"""Procedural texture & card generation (PIL + numpy). Run once: python tex.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "tex")
os.makedirs(OUT, exist_ok=True)
R = random.Random(7)


def noise(w, h, scale=64, octaves=5, seed=1):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        small = rng.random((h // s + 2, w // s + 2)).astype(np.float32)
        im = Image.fromarray((small * 255).astype(np.uint8)).resize((w + 2 * s, h + 2 * s), Image.BICUBIC)
        acc += amp * np.asarray(im, np.float32)[s:s + h, s:s + w] / 255
        tot += amp
        amp *= 0.5
    return acc / tot


# ───────────── calligraphy (abstract, Arabic-inspired, illegible) ─────────────
def nib_stroke(draw, pts, width, color, nib=math.radians(38), minw=0.18):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        a = math.atan2(y1 - y0, x1 - x0)
        w = width * (minw + (1 - minw) * abs(math.sin(a - nib)))
        steps = max(1, int(math.hypot(x1 - x0, y1 - y0) / 1.5))
        for i in range(steps + 1):
            t = i / steps
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            draw.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=color)


def bez(p0, p1, p2, p3, n=24):
    out = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        out.append((u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                    u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]))
    return out


def script_line(draw, x_right, x_left, y, size, color, rng):
    x = x_right
    while x > x_left + size * 2:
        wlen = rng.uniform(1.5, 4.5) * size
        # baseline connecting stroke with gentle waves
        pts = bez((x, y), (x - wlen * 0.3, y + rng.uniform(-0.25, 0.35) * size), (x - wlen * 0.7, y + rng.uniform(-0.3, 0.3) * size), (x - wlen, y))
        nib_stroke(draw, pts, size * 0.32, color)
        # letter forms along the word
        k = x
        while k > x - wlen:
            c = rng.random()
            if c < 0.22:  # tall vertical (alif-like)
                nib_stroke(draw, [(k, y - size * 1.9), (k + size * 0.05, y - size * 0.9), (k, y)], size * 0.30, color)
            elif c < 0.42:  # loop / bowl below baseline
                pts = bez((k, y), (k - size * 0.2, y + size * 0.9), (k - size * 1.1, y + size * 0.9), (k - size * 1.2, y + size * 0.1))
                nib_stroke(draw, pts, size * 0.30, color)
            elif c < 0.6:  # small tooth
                nib_stroke(draw, [(k, y - size * 0.45), (k - size * 0.1, y)], size * 0.28, color)
            elif c < 0.7:  # head loop
                pts = bez((k, y), (k + size * 0.3, y - size * 0.8), (k - size * 0.6, y - size * 0.9), (k - size * 0.4, y - size * 0.1))
                nib_stroke(draw, pts, size * 0.26, color)
            if rng.random() < 0.35:  # dots (diacritics)
                dy = -size * rng.uniform(0.9, 1.3) if rng.random() < 0.6 else size * rng.uniform(0.7, 1.0)
                d = size * 0.17
                for j in range(rng.choice([1, 1, 2, 3])):
                    cx = k - size * 0.25 * j
                    draw.polygon([(cx, y + dy - d), (cx + d, y + dy), (cx, y + dy + d), (cx - d, y + dy)], fill=color)
            k -= size * rng.uniform(0.5, 1.0)
        x -= wlen + size * rng.uniform(0.6, 1.4)


def aged_paper(w, h, base=(226, 208, 170), seed=3, edge=0.35, stains=6):
    n = noise(w, h, 80, 6, seed)
    n2 = noise(w, h, 12, 3, seed + 1)
    img = np.zeros((h, w, 3), np.float32)
    for i in range(3):
        img[..., i] = base[i] * (0.9 + 0.12 * n + 0.04 * n2)
    yy, xx = np.mgrid[0:h, 0:w]
    dx = np.minimum(xx, w - 1 - xx) / (w * 0.5)
    dy = np.minimum(yy, h - 1 - yy) / (h * 0.5)
    e = np.clip(np.minimum(dx, dy) * 6, 0, 1)
    img *= (1 - edge * (1 - e)[..., None] * np.array([0.35, 0.5, 0.75]))
    rng = np.random.default_rng(seed)
    for _ in range(stains):
        cx, cy, r = rng.random() * w, rng.random() * h, rng.random() * w * 0.12 + 20
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
        ring = np.exp(-((d - 1) ** 2) * 60) * 0.12 + np.clip(1 - d, 0, 1) * 0.05
        img *= (1 - ring[..., None] * np.array([0.3, 0.45, 0.7]))
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def manuscript(lines=6, written=6, name="manuscript.png", w=2048, h=1400, seed=11, rosette=True):
    rng = random.Random(seed)
    im = aged_paper(w, h, seed=seed)
    d = ImageDraw.Draw(im)
    ink = (38, 22, 12)
    # ruled frame in faded red
    d.rectangle((150, 120, w - 150, h - 120), outline=(150, 70, 45), width=3)
    size = 46
    for i in range(written):
        y = 250 + i * 150
        script_line(d, w - 210, 210 if i < written - 1 else w * 0.42, y, size, ink, rng)
    if rosette:
        cx, cy = 260, h - 230
        for r in (46, 34):
            d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(160, 90, 40), width=4)
        for a in range(8):
            t = a * math.pi / 4
            d.line((cx, cy, cx + 30 * math.cos(t), cy + 30 * math.sin(t)), fill=(160, 90, 40), width=3)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    im.save(os.path.join(OUT, name))


# ───────────── silhouettes (cards) ─────────────
def _save_sil(img, name, blur=1.2):
    a = img.split()[-1].filter(ImageFilter.GaussianBlur(blur))
    img.putalpha(a)
    img.save(os.path.join(OUT, name))


def camel_card(name="caravan.png"):
    W, H = 2400, 420
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    col = (20, 14, 16, 255)
    rng = random.Random(4)

    def camel(x, base, s, rider, load):
        # body (hump), neck, head, legs — side profile walking left
        body = bez((x + 120 * s, base - 150 * s), (x + 110 * s, base - 260 * s), (x - 10 * s, base - 270 * s), (x - 40 * s, base - 170 * s), 30)
        pts = [(x + 150 * s, base - 120 * s)] + body + [(x - 70 * s, base - 150 * s), (x - 110 * s, base - 200 * s), (x - 140 * s, base - 250 * s), (x - 170 * s, base - 262 * s), (x - 185 * s, base - 250 * s), (x - 160 * s, base - 235 * s), (x - 135 * s, base - 195 * s), (x - 95 * s, base - 120 * s), (x + 140 * s, base - 100 * s)]
        d.polygon(pts, fill=col)
        ph = rng.random() * 6
        for lx, sw in ((-60, 1), (-35, -1), (95, 1), (120, -1)):
            k = math.sin(ph + lx) * 18 * s
            d.line([(x + lx * s, base - 115 * s), (x + lx * s + k * sw, base - 55 * s), (x + lx * s + k * sw * 0.6, base)], fill=col, width=int(12 * s))
        if load:
            d.rounded_rectangle((x - 20 * s, base - 300 * s, x + 90 * s, base - 225 * s), radius=int(18 * s), fill=col)
        if rider:
            d.polygon([(x + 5 * s, base - 250 * s), (x + 55 * s, base - 250 * s), (x + 45 * s, base - 350 * s), (x + 15 * s, base - 350 * s)], fill=col)
            d.ellipse((x + 12 * s, base - 395 * s, x + 50 * s, base - 350 * s), fill=col)
            d.ellipse((x + 6 * s, base - 405 * s, x + 56 * s, base - 372 * s), fill=col)

    x = 260
    for i in range(9):
        s = 0.95 + rng.random() * 0.1
        camel(x, H - 8, s, rider=i % 3 == 0, load=i % 3 != 0)
        if i % 4 == 1:  # walker
            px = x + 190
            d.polygon([(px - 18, H - 8), (px + 18, H - 8), (px + 12, H - 150), (px - 12, H - 150)], fill=col)
            d.ellipse((px - 14, H - 185, px + 14, H - 150), fill=col)
        x += 250 + rng.random() * 40
    _save_sil(im, name, 1.5)


def person_card(name, hat="turban", pose=0, seed=0, w=360, h=1000, color=(18, 12, 10)):
    rng = random.Random(seed)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = (*color, 255)
    cx = w // 2
    # robe
    robe = [(cx - 95, h), (cx + 95, h), (cx + 75, 330), (cx + 55, 250), (cx - 55, 250), (cx - 75, 330)]
    d.polygon(robe, fill=c)
    # shoulders & head
    d.ellipse((cx - 70, 225, cx + 70, 320), fill=c)
    d.ellipse((cx - 38, 130, cx + 38, 235), fill=c)
    if hat == "turban":
        d.ellipse((cx - 50, 95, cx + 50, 175), fill=c)
    elif hat == "fedora":
        d.rectangle((cx - 60, 140, cx + 60, 152), fill=c)
        d.rounded_rectangle((cx - 36, 92, cx + 36, 146), radius=10, fill=c)
    elif hat == "hair":
        d.ellipse((cx - 42, 120, cx + 42, 190), fill=c)
    # arms
    if pose == 1:
        d.line([(cx + 60, 290), (cx + 150, 400), (cx + 190, 380)], fill=c, width=34)
    else:
        d.line([(cx + 62, 290), (cx + 78, 560)], fill=c, width=34)
    d.line([(cx - 62, 290), (cx - 80, 560)], fill=c, width=34)
    _save_sil(im, name, 1.4)


def skyline_card(name="baghdad_skyline.png"):
    W, H = 3200, 700
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    col = (26, 18, 30, 255)
    base = H - 5
    # city wall with crenellations
    d.rectangle((0, base - 120, W, base), fill=col)
    for x in range(0, W, 46):
        d.rectangle((x, base - 146, x + 24, base - 120), fill=col)
    rng = random.Random(9)
    x = 60
    while x < W - 200:
        kind = rng.random()
        if kind < 0.25:  # dome on drum
            r = rng.randint(70, 140)
            d.rectangle((x, base - 120 - r * 0.9, x + 2 * r, base - 120), fill=col)
            d.pieslice((x, base - 120 - r * 0.9 - r, x + 2 * r, base - 120 - r * 0.9 + r), 180, 360, fill=col)
            d.polygon([(x + r - 6, base - 120 - r * 1.9), (x + r + 6, base - 120 - r * 1.9), (x + r, base - 120 - r * 2.2)], fill=col)
            x += 2 * r + rng.randint(40, 120)
        elif kind < 0.35:  # minaret (spiral-inspired, tapering)
            hgt = rng.randint(320, 460)
            d.polygon([(x, base - 120), (x + 60, base - 120), (x + 42, base - 120 - hgt), (x + 18, base - 120 - hgt)], fill=col)
            d.rectangle((x + 10, base - 120 - hgt - 30, x + 50, base - 120 - hgt), fill=col)
            x += rng.randint(120, 220)
        elif kind < 0.55:  # palm
            tx = x + 40
            th = rng.randint(220, 330)
            d.line([(tx, base - 120), (tx + 12, base - 120 - th)], fill=col, width=12)
            for a in range(9):
                t = math.radians(a * 40 + rng.randint(-10, 10))
                ex, ey = tx + 12 + math.cos(t) * 110, base - 120 - th + math.sin(t) * 45 + 40
                d.line(bez((tx + 12, base - 120 - th), (tx + 12 + math.cos(t) * 50, base - 120 - th - 30), (ex, ey - 30), (ex, ey), 12), fill=col, width=9)
            x += rng.randint(90, 180)
        else:  # flat-roofed houses
            bw, bh = rng.randint(90, 220), rng.randint(40, 140)
            d.rectangle((x, base - 120 - bh, x + bw, base - 120), fill=col)
            x += bw + rng.randint(0, 30)
    _save_sil(im, name, 1.8)


def stall_people_card(name="market.png"):
    W, H = 3000, 900
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rng = random.Random(21)
    # awnings drawn separately in 3D; here a crowd of figures and goods
    for i in range(22):
        hat = rng.choice(["turban", "turban", "turban", "hair"])
        p = Image.new("RGBA", (360, 1000), (0, 0, 0, 0))
        person_card("_tmp.png", hat=hat, pose=rng.choice([0, 0, 1]), seed=i)
        p = Image.open(os.path.join(OUT, "_tmp.png"))
        s = rng.uniform(0.62, 0.9)
        p = p.resize((int(360 * s), int(1000 * s)))
        if rng.random() < 0.5:
            p = p.transpose(Image.FLIP_LEFT_RIGHT)
        x = int(rng.uniform(0, W - 300))
        im.alpha_composite(p, (x, H - p.size[1]))
    d = ImageDraw.Draw(im)
    col = (16, 11, 9, 255)
    for i in range(14):  # sacks and jars
        x = rng.uniform(0, W)
        r = rng.uniform(30, 55)
        d.ellipse((x - r, H - 2 * r, x + r, H), fill=col)
    os.remove(os.path.join(OUT, "_tmp.png"))
    im.save(os.path.join(OUT, name))


if __name__ == "__main__":
    manuscript()
    manuscript(name="manuscript_full.png", written=7, seed=12)
    camel_card()
    skyline_card()
    stall_people_card()
    person_card("person_turban.png", "turban", 0, 1)
    person_card("person_fedora.png", "fedora", 1, 2, color=(30, 22, 16))
    person_card("person_hair.png", "hair", 1, 3, color=(12, 14, 16))
    print("textures written to", OUT)


def rug(name="rug.png", w=2048, h=1400, seed=5):
    """Hand-knotted wool rug: field, medallion, borders — muted madder red, indigo, ochre."""
    rng = random.Random(seed)
    red, indigo, ochre, ivory, dark = (120, 32, 26), (30, 40, 70), (170, 120, 50), (205, 185, 150), (40, 20, 16)
    im = Image.new("RGB", (w, h), red)
    d = ImageDraw.Draw(im)
    for i, (m, col) in enumerate(((0, dark), (40, ivory), (60, indigo), (150, ivory), (170, red))):
        d.rectangle((m, m, w - 1 - m, h - 1 - m), fill=col)
    # border motifs
    for x in range(80, w - 80, 70):
        d.polygon([(x, 80), (x + 35, 105), (x, 130), (x - 35, 105)], fill=ochre)
        d.polygon([(x, h - 80), (x + 35, h - 105), (x, h - 130), (x - 35, h - 105)], fill=ochre)
    for y in range(80, h - 80, 70):
        d.polygon([(80, y), (105, y + 35), (130, y), (105, y - 35)], fill=ochre)
        d.polygon([(w - 80, y), (w - 105, y + 35), (w - 130, y), (w - 105, y - 35)], fill=ochre)
    # field lattice
    for x in range(260, w - 200, 120):
        for y in range(260, h - 200, 120):
            d.polygon([(x, y - 30), (x + 30, y), (x, y + 30), (x - 30, y)], outline=indigo, width=6)
            d.ellipse((x - 6, y - 6, x + 6, y + 6), fill=ochre)
    # medallion
    cx, cy = w // 2, h // 2
    for r, col in ((330, dark), (310, indigo), (250, ivory), (230, red), (150, indigo), (130, ochre), (60, red)):
        d.polygon([(cx, cy - r), (cx + r * 1.4, cy), (cx, cy + r), (cx - r * 1.4, cy)], fill=col)
    a = np.asarray(im).astype(np.float32)
    n = noise(w, h, 6, 3, seed)[..., None]
    n2 = noise(w, h, 120, 4, seed + 3)[..., None]
    a = a * (0.8 + 0.3 * n) * (0.85 + 0.25 * n2)
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)).save(os.path.join(OUT, name))


def stucco_pattern(name="stucco.png", w=2048, h=256):
    """Samarra-style bevelled stucco frieze (height map)."""
    im = Image.new("L", (w, h), 90)
    d = ImageDraw.Draw(im)
    step = 128
    for x in range(-step, w + step, step):
        d.polygon([(x, h // 2), (x + step // 2, 20), (x + step, h // 2), (x + step // 2, h - 20)], fill=200)
        d.ellipse((x + step // 2 - 26, h // 2 - 26, x + step // 2 + 26, h // 2 + 26), fill=120)
        d.line([(x, 20), (x + step, h - 20)], fill=160, width=10)
        d.line([(x, h - 20), (x + step, 20)], fill=160, width=10)
    d.rectangle((0, 0, w, 12), fill=220)
    d.rectangle((0, h - 12, w, h), fill=220)
    im.filter(ImageFilter.GaussianBlur(3)).save(os.path.join(OUT, name))


if __name__ == "__main__":
    rug()
    stucco_pattern()
