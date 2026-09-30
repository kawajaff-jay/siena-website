"""Finish renders like a film still (bloom, gentle S-curve, vignette, grain) and hand them to the site.
python post.py [id ...]   (default: every finished render in final/)
"""
import json, os, sys, glob
import numpy as np
from PIL import Image, ImageFilter

FINAL = "/home/claude/render/final"
SITE = "/home/claude/siena-web"
PLATES = os.path.join(SITE, "art/plates")
THREADS = os.path.join(SITE, "content/plate-threads.json")
os.makedirs(PLATES, exist_ok=True)


EXPOSURE = {"centuries-ledger": 1.3, "centuries-accountbook": 1.2}


def grade(path, bloom=0.22, vignette=0.28, grain=0.010, contrast=0.12, seed=0, exposure=1.0):
    im = Image.open(path)
    a = np.asarray(im).astype(np.float32)
    a = a / (65535.0 if a.max() > 255 else 255.0)
    a = a[..., :3] * exposure
    h, w = a.shape[:2]
    # bloom from highlights
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    hi = np.clip((lum - 0.72) / 0.28, 0, 1)[..., None] * a
    hi_img = Image.fromarray((hi * 255).astype(np.uint8))
    b1 = np.asarray(hi_img.filter(ImageFilter.GaussianBlur(w * 0.006)), np.float32) / 255
    b2 = np.asarray(hi_img.filter(ImageFilter.GaussianBlur(w * 0.025)), np.float32) / 255
    a = a + bloom * (0.6 * b1 + 0.8 * b2)
    # gentle S-curve around mid grey
    a = np.clip(a, 0, 1)
    a = a + contrast * (a - a ** 2) * (a - 0.5) * 4
    # vignette
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w * 0.56) / (w * 0.62)) ** 2 + ((yy - h * 0.55) / (h * 0.72)) ** 2)
    a *= (1 - vignette * np.clip(r - 0.35, 0, 1) ** 1.6)[..., None]
    # grain (luminance, finer in highlights)
    rng = np.random.default_rng(seed)
    g = rng.normal(0, grain, (h, w)).astype(np.float32)
    g = np.asarray(Image.fromarray(((g + 0.5) * 255).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255 - 0.5
    a += g[..., None] * (1.2 - np.clip(lum, 0, 1)[..., None])
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def cine(img, sat=1.12, contrast=0.18, shadow_tint=(0.0, 0.0, 0.0), high_tint=(0.0, 0.0, 0.0), black=0.012):
    """Cinematic finish on top of grade(): saturation, filmic contrast, split toning, a soft black floor."""
    a = np.asarray(img, np.float32) / 255
    lum = (a @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    a = lum + (a - lum) * sat
    a = np.clip(a, 0, 1)
    a = a + contrast * (a - a ** 2) * (a - 0.45) * 4
    w_sh = np.clip(1 - lum * 2.2, 0, 1)
    w_hi = np.clip((lum - 0.45) * 2, 0, 1)
    a = a + w_sh * np.array(shadow_tint, np.float32) + w_hi * np.array(high_tint, np.float32)
    a = black + (1 - black) * np.clip(a, 0, 1)
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


LOOKS = {
    "abbasid": dict(sat=1.14, contrast=0.2, shadow_tint=(0.006, 0.0, -0.004), high_tint=(0.02, 0.008, -0.014)),
}


def main(ids):
    threads = json.load(open(THREADS)) if os.path.exists(THREADS) else {}
    for pid in ids:
        src = os.path.join(FINAL, pid + ".png")
        if not os.path.exists(src):
            print("skip", pid)
            continue
        out = grade(src, seed=sum(map(ord, pid)), exposure=EXPOSURE.get(pid, 1.0))
        out.save(os.path.join(PLATES, pid + ".jpg"), quality=93, subsampling=0)
        jp = src.replace(".png", ".json")
        if os.path.exists(jp):
            d = json.load(open(jp))
            if d:
                key, path = list(d.items())[0]
                if key == "ink":  # a written line undulates like script
                    import re
                    nums = [float(v) for v in re.findall(r"-?[\d.]+", path)]
                    (x0, y0), (x1, y1) = (nums[0], nums[1]), (nums[-2], nums[-1])
                    pts = []
                    for i in range(15):
                        t = i / 14
                        x = x0 + (x1 - x0) * t
                        y = y0 + (y1 - y0) * t + 5 * np.sin(t * np.pi * 6) * (0.4 + 0.6 * np.sin(t * np.pi))
                        pts.append(f"{x:.0f} {y:.1f}")
                    path = "M" + " L".join(pts)
                threads[pid] = path
        print("graded", pid, out.size)
    json.dump(threads, open(THREADS, "w"), indent=1)


if __name__ == "__main__":
    ids = sys.argv[1:] or [os.path.basename(p)[:-4] for p in sorted(glob.glob(os.path.join(FINAL, "*.png")))]
    main(ids)
