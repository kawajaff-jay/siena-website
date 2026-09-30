"""High-fidelity texture maps (colour / roughness / height) for the test scenes. Run: python tex3.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from tex import OUT, noise

rng_np = np.random.default_rng


def smooth_noise(w, h, sx, sy, seed, octaves=4):
    """Anisotropic value noise: sx, sy are cell sizes in pixels (large sx = stretched along x)."""
    rng = rng_np(seed)
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        cx, cy = max(2, int(sx / 2 ** o)), max(2, int(sy / 2 ** o))
        small = rng.random((h // cy + 3, w // cx + 3)).astype(np.float32)
        im = Image.fromarray((small * 255).astype(np.uint8)).resize(((w // cx + 3) * cx, (h // cy + 3) * cy), Image.BICUBIC)
        acc += amp * np.asarray(im, np.float32)[cy:cy + h, cx:cx + w] / 255
        tot += amp
        amp *= 0.55
    return acc / tot


def wood_maps(name, dark, light, w=4096, h=1600, ring_freq=26, warp=0.28, planks=3, seed=1, figure=0.6):
    """Flat-sawn hardwood: warped growth rings, fibre streaks, pores, plank seams.
    Writes <name>_col.png, <name>_rough.png, <name>_h.png. Grain runs along x."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = xx / w, yy / h
    col = np.zeros((h, w, 3), np.float32)
    rough = np.zeros((h, w), np.float32)
    height = np.zeros((h, w), np.float32)
    plank_h = h / planks
    for p in range(planks):
        y0, y1 = int(p * plank_h), int((p + 1) * plank_h)
        sl = slice(y0, y1)
        pu, pv = u[sl], (v[sl] - p / planks) * planks
        s = seed * 31 + p * 7
        wn = smooth_noise(w, y1 - y0, 900, 160, s, 4)
        wn2 = smooth_noise(w, y1 - y0, 300, 60, s + 1, 3)
        r_ = rng_np(s)
        u0, v0, sc = r_.uniform(0.2, 0.8), r_.uniform(-0.3, 0.05), r_.uniform(0.5, 0.9)
        rings = ring_freq * np.sqrt((pv - v0) ** 2 + (sc * (pu - u0)) ** 2) + warp * (wn * 1.6 + wn2 * 0.5)
        frac = rings - np.floor(rings)
        late = np.clip((frac - 0.7) / 0.26, 0, 1) ** 1.8 * (1 - np.clip((frac - 0.97) / 0.03, 0, 1))  # thin latewood line
        fibre = smooth_noise(w, y1 - y0, 220, 2, s + 2, 3)
        fine = smooth_noise(w, y1 - y0, 40, 1, s + 3, 2)
        tone = 0.5 + 0.35 * (smooth_noise(w, y1 - y0, 1400, 400, s + 4, 2) - 0.5) * 2 * figure
        streak = smooth_noise(w, y1 - y0, 700, 18, s + 6, 3)
        t = np.clip(0.24 + tone * 0.5 + (streak - 0.5) * 0.4 - late * 0.36 + (fibre - 0.5) * 0.22 + (fine - 0.5) * 0.1, 0, 1)
        for c in range(3):
            col[sl, :, c] = dark[c] + (light[c] - dark[c]) * t
        # pores: short dark dashes along the grain
        pr = rng_np(s + 5)
        n = int(w * (y1 - y0) / 900)
        px = pr.integers(0, w, n)
        py = pr.integers(0, y1 - y0, n)
        ln = pr.integers(6, 26, n)
        for i in range(n):
            x0 = px[i]
            x1 = min(w, x0 + ln[i])
            col[y0 + py[i], x0:x1] *= 0.72
            height[y0 + py[i], x0:x1] -= 0.25
        rough[sl] = 0.34 + 0.12 * late + 0.08 * (fibre - 0.5)
        height[sl] += 0.35 * fibre + 0.2 * late
        # seam
        col[y0:y0 + 3] *= 0.55
        height[y0:y0 + 3] -= 0.8
        rough[y0:y0 + 3] += 0.2
    # finish wear: faint satin variation + a few hairline scratches
    wear = smooth_noise(w, h, 600, 600, seed + 99, 3)
    rough += (wear - 0.5) * 0.04
    pr = rng_np(seed + 7)
    img_s = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(img_s)
    for _ in range(90):
        x, y = pr.integers(0, w), pr.integers(0, h)
        a = pr.uniform(0, math.pi)
        L = pr.uniform(40, 300)
        d.line((x, y, x + math.cos(a) * L, y + math.sin(a) * L), fill=int(pr.uniform(40, 120)), width=1)
    scr = np.asarray(img_s, np.float32) / 255
    rough = np.clip(rough + scr * 0.12, 0.05, 1)
    col = np.clip(col * 255, 0, 255).astype(np.uint8)
    Image.fromarray(col).filter(ImageFilter.GaussianBlur(0.5)).save(os.path.join(OUT, f"{name}_col.png"))
    Image.fromarray((rough * 255).astype(np.uint8)).save(os.path.join(OUT, f"{name}_rough.png"))
    hh = height - height.min()
    hh = hh / hh.max()
    Image.fromarray((hh * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)).save(os.path.join(OUT, f"{name}_h.png"))


def coin_face(name="coin_face.png", S=1024, seed=3):
    """Embossed height map for a dinar: rim, concentric bands, script marks."""
    im = Image.new("L", (S, S), 90)
    d = ImageDraw.Draw(im)
    c = S / 2
    d.ellipse((6, 6, S - 6, S - 6), outline=230, width=26)
    for r in (400, 300, 170):
        d.ellipse((c - r, c - r, c + r, c + r), outline=200, width=9)
    rng = random.Random(seed)
    for band_r in (350, 235):
        for i in range(40):
            a = i / 40 * 2 * math.pi
            x, y = c + band_r * math.cos(a), c + band_r * math.sin(a)
            h = rng.uniform(18, 46)
            d.line((x, y, x + math.cos(a + 1.57) * 8, y + math.sin(a + 1.57) * 8 - h * 0.2), fill=220, width=7)
            if rng.random() < 0.4:
                d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=220)
    for i in range(5):
        y = c - 90 + i * 45
        x0 = c - 120 + rng.uniform(-10, 10)
        d.line((x0, y, x0 + 240, y), fill=215, width=9)
        for k in range(6):
            xx = x0 + k * 45 + rng.uniform(0, 20)
            d.line((xx, y, xx, y - rng.uniform(15, 40)), fill=215, width=8)
    a = np.asarray(im.filter(ImageFilter.GaussianBlur(3)), np.float32)
    a += (noise(S, S, 20, 3, seed) - 0.5) * 50  # wear
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name))


def vinyl_tiles(name="vinyl", S=2048, n=4, seed=2):
    """Speckled 1970s vinyl floor tiles (colour + height)."""
    base = np.array([168, 164, 150], np.float32)
    col = np.ones((S, S, 3), np.float32) * base
    spk = smooth_noise(S, S, 3, 3, seed, 1)
    col *= (0.85 + 0.25 * spk)[..., None]
    big = smooth_noise(S, S, 500, 500, seed + 1, 3)
    col *= (0.9 + 0.15 * big)[..., None]
    t = S // n
    h = np.ones((S, S), np.float32)
    for i in range(n + 1):
        col[:, max(0, i * t - 2):i * t + 2] *= 0.6
        col[max(0, i * t - 2):i * t + 2, :] *= 0.6
        h[:, max(0, i * t - 2):i * t + 2] = 0
        h[max(0, i * t - 2):i * t + 2, :] = 0
    Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).save(os.path.join(OUT, f"{name}_col.png"))
    Image.fromarray((h * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)).save(os.path.join(OUT, f"{name}_h.png"))


def vent_slots(name="vents.png", w=1024, h=1024):
    im = Image.new("L", (w, h), 255)
    d = ImageDraw.Draw(im)
    for y in range(40, h - 40, 36):
        d.rounded_rectangle((60, y, w - 60, y + 14), radius=7, fill=0)
    im.filter(ImageFilter.GaussianBlur(1.5)).save(os.path.join(OUT, name))


def fluted(name="fluted.png", w=1024, h=64, flutes=16):
    x = np.linspace(0, flutes * 2 * np.pi, w)
    row = (np.cos(x) * 0.5 + 0.5) ** 0.6
    a = np.tile(row, (h, 1))
    Image.fromarray((a * 255).astype(np.uint8)).save(os.path.join(OUT, name))


def smudges(name="smudges.png", S=1024, seed=4):
    """Roughness breakup for glass/metal: fingerprints and wipe marks."""
    a = smooth_noise(S, S, 200, 200, seed, 4)
    b = smooth_noise(S, S, 12, 12, seed + 1, 2)
    im = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(im)
    r = random.Random(seed)
    for _ in range(14):
        cx, cy = r.uniform(0, S), r.uniform(0, S)
        for k in range(10):
            rr = 8 + k * 5
            d.ellipse((cx - rr, cy - rr * 1.3, cx + rr, cy + rr * 1.3), outline=int(60 - k * 5), width=2)
    fp = np.asarray(im.filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
    out = np.clip(0.3 * a + 0.1 * b + fp * 1.5, 0, 1)
    Image.fromarray((out * 255).astype(np.uint8)).save(os.path.join(OUT, name))


if __name__ == "__main__":
    wood_maps("walnut", (0.12, 0.06, 0.032), (0.4, 0.23, 0.12), ring_freq=13, planks=3, seed=1)
    wood_maps("teak70", (0.2, 0.11, 0.055), (0.5, 0.31, 0.16), ring_freq=16, planks=1, seed=5, figure=0.3)
    coin_face()
    vinyl_tiles()
    vent_slots()
    fluted()
    smudges()
    print("ok")
