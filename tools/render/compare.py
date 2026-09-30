import sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, "/home/claude/render")
import post
g = post.grade("/home/claude/render/final4/abbasid.png", exposure=1.08, seed=7)
g = post.cine(g, **post.LOOKS["abbasid"])
g.save("/home/claude/render/final4/abbasid_graded.jpg", quality=94, subsampling=0)
g.save("/mnt/user-data/outputs/abbasid-calibration.jpg", quality=94, subsampling=0)
ref = Image.open("/home/claude/siena-web/art/reference/target-abbasid.png").convert("RGB").resize((960, 540))
old = Image.open("/home/claude/render/test/p3_abbasid.png").convert("RGB").resize((960, 540))
new = g.resize((960, 540))
W = 960 * 3 + 40
sheet = Image.new("RGB", (W, 540 + 70), (10, 12, 18))
d = ImageDraw.Draw(sheet)
try:
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
except Exception:
    f = None
for i, (im, lab) in enumerate(((old, "Before (v3 render)"), (new, "Calibration (Blender, same desk & camera)"), (ref, "Your art-direction reference"))):
    x = i * 980
    sheet.paste(im, (x, 60))
    d.text((x + 10, 18), lab, fill=(220, 225, 235), font=f)
sheet.save("/mnt/user-data/outputs/abbasid-calibration-compare.jpg", quality=92)
print("ok")
