"""Calibration textures for the art-directed Abbasid plate. Run: python tex5.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from tex import OUT, aged_paper, noise, script_line
from tex3 import smooth_noise


def dusk_sky(name="dusk_sky.png", W=4096, H=2048, seed=5):
    """Baghdad dusk: violet zenith, rose mid-sky, peach-amber horizon glow; clouds lit from below."""
    y = np.linspace(0, 1, H)[:, None]  # 0 top .. 1 horizon (bottom row = horizon)
    stops = [(0.0, (10, 12, 34)), (0.42, (36, 34, 74)), (0.6, (84, 62, 110)), (0.72, (150, 96, 118)), (0.83, (222, 138, 104)), (0.93, (250, 176, 110)), (1.0, (255, 204, 140))]
    base = np.zeros((H, W, 3), np.float32)
    for c in range(3):
        base[..., c] = np.interp(y[:, 0], [s[0] for s in stops], [s[1][c] for s in stops])[:, None]
    # warm glow centred right of middle (where the sun has just set)
    xx = np.linspace(0, 1, W)[None, :]
    glow = np.exp(-((xx - 0.62) ** 2) / 0.05) * np.clip((y - 0.55) / 0.45, 0, 1) ** 2
    base += glow[..., None] * np.array([60, 30, 0], np.float32)
    # clouds: stretched fbm, banded in the mid sky
    n = smooth_noise(W, H, 900, 110, seed, octaves=6)
    n2 = smooth_noise(W, H, 240, 40, seed + 1, octaves=5)
    band = np.exp(-((y - 0.66) ** 2) / 0.006) * 1.0 + np.exp(-((y - 0.52) ** 2) / 0.01) * 0.8 + np.exp(-((y - 0.3) ** 2) / 0.02) * 0.5
    dens = np.clip((n * 0.7 + n2 * 0.3 - 0.47) * 4.0, 0, 1) * band
    # lit underside: gradient of density downward
    under = np.clip(dens - np.roll(dens, 18, axis=0), 0, 1)
    top_col = np.array([46, 40, 72], np.float32)
    lit_col = np.array([236, 150, 128], np.float32)
    shade = top_col[None, None, :] * (1 - under[..., None] * 2).clip(0, 1) + lit_col[None, None, :] * (under[..., None] * 2).clip(0, 1)
    shade = shade * (0.6 + 0.6 * y[..., None])
    out = base * (1 - dens[..., None] * 0.85) + shade * dens[..., None] * 0.85
    im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    im.save(os.path.join(OUT, name))


def star_lattice(name="star_lattice.png", S=1024, cells=4, lw=14):
    """8-point star (khatam) lattice — height/mask for carved wood & stone screens. White = solid."""
    im = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(im)
    c = S / cells
    for i in range(cells + 1):
        for j in range(cells + 1):
            cx, cy = i * c, j * c
            r = c * 0.36
            for rot in (0, math.pi / 4):
                pts = [(cx + r * math.cos(rot + k * math.pi / 2), cy + r * math.sin(rot + k * math.pi / 2)) for k in range(4)]
                d.line(pts + [pts[0]], fill=255, width=lw)
            # connectors to neighbouring stars
            for a in range(8):
                t = a * math.pi / 4 + math.pi / 8
                d.line((cx + r * 0.93 * math.cos(t), cy + r * 0.93 * math.sin(t), cx + c * 0.5 * math.cos(t) / max(abs(math.cos(t)), abs(math.sin(t))), cy + c * 0.5 * math.sin(t) / max(abs(math.cos(t)), abs(math.sin(t)))), fill=255, width=lw)
    d.rectangle((0, 0, S - 1, S - 1), outline=255, width=lw)
    im = im.filter(ImageFilter.GaussianBlur(2.0))
    im.save(os.path.join(OUT, name))


def tile_band(name="tile_band.png", W=2048, H=512, seed=2):
    """Glazed cobalt/turquoise tile band with a white interlace — for arch soffits and dados."""
    rng = random.Random(seed)
    im = Image.new("RGB", (W, H), (20, 52, 98))
    d = ImageDraw.Draw(im)
    tile = H // 2
    for tx in range(0, W, tile):
        for ty in range(0, H, tile):
            col = (22, 60, 112) if (tx // tile + ty // tile) % 2 else (18, 84, 104)
            d.rectangle((tx, ty, tx + tile, ty + tile), fill=col)
            cx, cy, r = tx + tile / 2, ty + tile / 2, tile * 0.38
            for rot in (0, math.pi / 4):
                pts = [(cx + r * math.cos(rot + k * math.pi / 2), cy + r * math.sin(rot + k * math.pi / 2)) for k in range(4)]
                d.polygon(pts, outline=(226, 222, 204), width=6)
            d.ellipse((cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3), fill=(190, 150, 60))
            d.rectangle((tx, ty, tx + tile, ty + tile), outline=(200, 196, 180), width=3)
    a = np.asarray(im, np.float32)
    n = noise(W, H, 40, 4, seed)[..., None]
    a = a * (0.82 + 0.3 * n)
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)).save(os.path.join(OUT, name))


def numeral(d, x, y, s, ink, rng):
    """An abstract Hindu-Arabic-numeral-like cluster (illegible, but reads as figures)."""
    for k in range(rng.randint(2, 4)):
        xx = x - k * s * 0.55
        kind = rng.random()
        if kind < 0.35:
            d.line((xx, y - s * 0.45, xx - s * 0.08, y + s * 0.35), fill=ink, width=max(2, int(s * 0.12)))
        elif kind < 0.65:
            d.arc((xx - s * 0.25, y - s * 0.45, xx + s * 0.2, y + s * 0.05), 180, 40, fill=ink, width=max(2, int(s * 0.11)))
            d.line((xx - s * 0.02, y - s * 0.1, xx - s * 0.1, y + s * 0.35), fill=ink, width=max(2, int(s * 0.11)))
        elif kind < 0.85:
            d.ellipse((xx - s * 0.1, y - s * 0.1, xx + s * 0.1, y + s * 0.1), outline=ink, width=max(2, int(s * 0.1)))
        else:
            d.line((xx - s * 0.2, y - s * 0.4, xx + s * 0.1, y - s * 0.2, xx - s * 0.1, y + s * 0.35), fill=ink, width=max(2, int(s * 0.11)), joint="curve")


def abbasid_account(name="account_abbasid.png", W=2048, H=1500, seed=21, rows=9):
    """A merchant's account sheet: header, ruled rows, entries (right) and figure columns (left), torn edges in alpha."""
    rng = random.Random(seed)
    im = aged_paper(W, H, base=(222, 200, 156), seed=seed, edge=0.45, stains=9)
    d = ImageDraw.Draw(im)
    ink, red = (40, 24, 14), (140, 58, 36)
    script_line(d, W - 220, W * 0.52, 170, 58, ink, rng)
    d.line((170, 250, W - 170, 250), fill=red, width=4)
    d.line((170, 262, W - 170, 262), fill=red, width=2)
    cols = [W - 170, W * 0.42, W * 0.3, W * 0.18, 170]
    for x in cols[1:-1]:
        d.line((x, 250, x, H - 180), fill=(150, 90, 60), width=2)
    for i in range(rows):
        y = 340 + i * 112
        d.line((170, y + 42, W - 170, y + 42), fill=(175, 140, 100), width=2)
        script_line(d, W - 230, W * (0.5 + rng.uniform(0.0, 0.18)), y, 40, ink, rng)
        for k in range(3):
            if rng.random() < 0.85:
                numeral(d, cols[k + 1] - 40, y + 4, 40, ink, rng)
    d.line((170, H - 230, W * 0.42, H - 230), fill=ink, width=4)
    numeral(d, cols[2] - 40, H - 200, 46, red, rng)
    numeral(d, cols[3] - 40, H - 200, 46, red, rng)
    im = im.filter(ImageFilter.GaussianBlur(0.7)).convert("RGBA")
    # deckled / torn edge alpha
    m = np.ones((H, W), np.float32)
    nx = noise(W, H, 24, 4, seed + 3)
    yy, xx = np.mgrid[0:H, 0:W]
    edge = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy]).astype(np.float32)
    thr = 18 + 42 * nx
    m = np.clip((edge - thr) / 3.0, 0, 1)
    # darkened, fibrous rim just inside the tear
    rim = np.clip(1 - (edge - thr) / 40, 0, 1) * m
    a = np.asarray(im, np.float32)
    a[..., :3] *= (1 - 0.35 * rim[..., None])
    a[..., 3] = m * 255
    Image.fromarray(a.astype(np.uint8), "RGBA").save(os.path.join(OUT, name))


def carpet(name="carpet_red.png", W=1024, H=1024, seed=4):
    """Deep red kilim with dark-blue lozenges (for cushion / bales)."""
    rng = random.Random(seed)
    im = Image.new("RGB", (W, H), (110, 22, 18))
    d = ImageDraw.Draw(im)
    for y in range(0, H, 128):
        d.rectangle((0, y, W, y + 18), fill=(30, 30, 60))
        for x in range(0, W, 128):
            d.polygon([(x + 64, y + 30), (x + 118, y + 74), (x + 64, y + 118), (x + 10, y + 74)], outline=(210, 160, 80), fill=(40, 34, 70) if (x // 128) % 2 else (150, 40, 26))
    a = np.asarray(im, np.float32) * (0.8 + 0.35 * noise(W, H, 16, 4, seed)[..., None])
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name))


if __name__ == "__main__":
    dusk_sky()
    star_lattice()
    tile_band()
    abbasid_account()
    carpet()
    print("ok")


def frond(name="frond.png", W=512, H=1536, seed=3):
    """Pinnate palm frond (alpha): rib along the height, leaflets angled toward the tip."""
    rng = random.Random(seed)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = W / 2
    for y in range(40, H - 20, 14):
        t = y / H  # 0 base .. 1 tip  (image top = tip)
        L = (W * 0.48) * math.sin(math.pi * min(1.0, (1 - t) * 1.1 + 0.05)) * rng.uniform(0.85, 1.05)
        for s in (-1, 1):
            ang = math.radians(rng.uniform(28, 40))
            x2, y2 = cx + s * L * math.cos(ang), y - L * math.sin(ang) * 0.9
            g = rng.randint(60, 110)
            col = (int(g * 0.45), g, int(g * 0.35), 255)
            w0 = rng.randint(7, 11)
            d.polygon([(cx, y - w0 / 2), (cx, y + w0 / 2), (x2, y2)], fill=col)
    d.line((cx, 0, cx, H), fill=(70, 80, 40, 255), width=10)
    im.save(os.path.join(OUT, name))
