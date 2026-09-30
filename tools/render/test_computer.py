"""Test plate: 1970s–80s computer room — CRT terminal, mainframes, industrial office light.
Same desk, same camera as every era."""
import sys, os, math, json, random
sys.path.insert(0, os.path.dirname(__file__))
import lib
from lib import *
from common_props import *

args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
RES = tuple(int(v) for v in args.get("res", "1920x1080").split("x"))
SAMPLES = int(args.get("samples", 64))
OUT = args.get("out", "/home/claude/render/test/computer.png")
T = lib.TEX

sc = reset(RES, SAMPLES)
cam = camera()

# ── room ──
wall_m = noisy("PaintedBlock", (0.56, 0.57, 0.54), var=0.04, rough=0.75, scale=6, bump=0.12)
floor_m = tiled_img("Vinyl", "vinyl", tile=2.4, rough=0.32, bump=0.3, coat=0.25, rough_var=0.08)
ceil_m = noisy("AcousticTile", (0.72, 0.72, 0.7), rough=0.95, scale=220, bump=0.5)
WALL_Y = 4.6
room(WALL_Y, wall_m, floor_m, ceil_m, 2.85)
# ceiling grid + fluorescent troffers with prismatic diffusers
grid_m = metal_worn("CeilGrid", (0.8, 0.8, 0.78), rough=0.4)
for i in range(-6, 7):
    box(f"GridX{i}", (0.022, 9, 0.012), (i * 0.61, 1.0, 2.84), grid_m, bevel=0.002)
for j in range(-2, 8):
    box(f"GridY{j}", (9, 0.022, 0.012), (0, j * 0.61, 2.84), grid_m, bevel=0.002)
diff_m = emission("Diffuser", (0.9, 0.97, 1.0), 6)
for (x, y) in ((-1.22, 1.22), (1.22, 1.22), (-1.22, 3.05), (1.22, 3.05), (0.0, -0.3)):
    plane(f"Troffer{x}{y}", (0.58, 1.18), (x, y, 2.832), diff_m, rot=(math.radians(180), 0, 0))
    if x >= 0:
        area((x, y, 2.8), (0.9, 0.97, 1.0), 45, (0.55, 1.15), rot=(0, 0, 0))
# skirting & cable tray
box("Skirt", (12, 0.02, 0.1), (0, WALL_Y - 0.01, 0.05), solid("Vinyl skirt", (0.08, 0.08, 0.08), 0.5), bevel=0)

# ── mainframe row ──
cab_paint = noisy("CabinetPaint", (0.62, 0.62, 0.58), var=0.03, rough=0.38, scale=30, bump=0.02, coat=0.15)
door_blue = noisy("DoorBlue", (0.06, 0.13, 0.28), var=0.05, rough=0.32, scale=30, bump=0.02, coat=0.25)
dark = solid("Recess", (0.015, 0.015, 0.017), 0.6)
reel_m = metal_worn("ReelAlu", (0.72, 0.72, 0.72), rough=0.25)
tape_m = noisy("TapePack", (0.09, 0.05, 0.03), rough=0.35, scale=400, bump=0.1)
win_glass = glass_img_rough("TapeWindow", (0.95, 0.97, 0.97), 0.02)
chrome = metal_worn("Chrome", (0.85, 0.85, 0.85), rough=0.12)
rng = random.Random(7)
CAB_W, CAB_H, CAB_D = 0.78, 1.82, 0.78
x = -3.9
k = 0
while x < 3.9:
    cy = WALL_Y - CAB_D / 2 - 0.05
    body = box(f"Cab{k}", (CAB_W - 0.012, CAB_D, CAB_H), (x, cy, CAB_H / 2 + 0.02), cab_paint, bevel=0.006, segs=3)
    box(f"Plinth{k}", (CAB_W - 0.04, CAB_D - 0.04, 0.05), (x, cy, 0.025), dark, bevel=0.002)
    fy = cy - CAB_D / 2 - 0.004
    if k % 3 != 2:
        # tape drive: recessed window with two reels
        box(f"TapeRecess{k}", (CAB_W - 0.12, 0.02, 0.86), (x, fy + 0.012, 1.3), dark, bevel=0.004)
        for rz in (1.52, 1.08):
            ry = fy + 0.004
            reel = lathe(f"Reel{k}{rz}", [(0.0, 0), (0.135, 0), (0.135, 0.006), (0.0, 0.006)], (x, ry, rz), reel_m, rot=(math.radians(90), 0, 0))
            for c in range(3):
                a = c * 2 * math.pi / 3 + rng.uniform(0, 1)
                cut = cyl(f"ReelCut{k}{rz}{c}", 0.035, 0.05, (x + math.cos(a) * 0.08, ry, rz + math.sin(a) * 0.08), None, rot=(math.radians(90), 0, 0))
                boolean(reel, cut)
            cyl(f"TapePack{k}{rz}", rng.uniform(0.07, 0.12), 0.004, (x, ry - 0.001, rz), tape_m, rot=(math.radians(90), 0, 0))
            cyl(f"Hub{k}{rz}", 0.03, 0.02, (x, ry - 0.008, rz), chrome, rot=(math.radians(90), 0, 0), bevel=0.002)
        box(f"TapeGlass{k}", (CAB_W - 0.14, 0.006, 0.84), (x, fy - 0.004, 1.3), win_glass, bevel=0.002)
        box(f"Head{k}", (0.14, 0.02, 0.1), (x, fy, 1.3), cab_paint, bevel=0.006)
    else:
        box(f"Door{k}", (CAB_W - 0.05, 0.015, 1.2), (x, fy, 1.05), door_blue, bevel=0.004)
        vp = plane(f"Vents{k}", (0.5, 0.5), (x, fy - 0.009, 0.7), dark, rot=(math.radians(90), 0, 0))
    # control panel with lamps & toggles
    box(f"Panel{k}", (CAB_W - 0.08, 0.02, 0.18), (x, fy, 0.72 if k % 3 != 2 else 1.72), door_blue, bevel=0.003)
    pz = 0.72 if k % 3 != 2 else 1.72
    for li in range(12):
        col = rng.choice([(1, 0.25, 0.15), (1, 0.75, 0.2), (0.3, 1, 0.45), (1, 1, 0.9)])
        on = rng.random() < 0.55
        sphere(f"Lamp{k}{li}", 0.0055, (x - 0.27 + (li % 6) * 0.1, fy - 0.012, pz + 0.035 - (li // 6) * 0.06), emission(f"LampE{k}{li}", col, rng.uniform(6, 16) if on else 0.2))
    for ti in range(8):
        cyl(f"Toggle{k}{ti}", 0.003, 0.025, (x - 0.24 + ti * 0.07, fy - 0.02, pz - 0.075), chrome, rot=(math.radians(60), 0, 0))
    x += CAB_W
    k += 1

# ── the one desk: 1970s teak ──
desk(wood_img("Teak", "teak70", coat=0.25, coat_rough=0.25, tint=0.9))
box("DeskTrim", (3.2, 0.012, 0.05), (0, lib.DESK_BACK - 0.006, DESK_Z - 0.025), chrome, bevel=0.002)

# ── CRT terminal (VT-style): tapered housing, recessed bezel, curved faceplate ──
t = on_z(960, 690)
housing = noisy("TermHousing", (0.72, 0.68, 0.58), var=0.03, rough=0.42, scale=60, bump=0.03)
bezel_m = noisy("TermBezel", (0.2, 0.17, 0.14), var=0.04, rough=0.45, scale=60, bump=0.03)
TW, TH = 0.44, 0.36
front = box("TermFront", (TW, 0.24, TH), (t.x, t.y, DESK_Z + 0.035 + TH / 2), housing, bevel=0.02, segs=5)
back = box("TermBack", (TW - 0.08, 0.2, TH - 0.08), (t.x, t.y + 0.2, DESK_Z + 0.075 + (TH - 0.08) / 2), housing, bevel=0.03, segs=5)
recess = box("TermRecessCut", (0.33, 0.06, 0.25), (t.x, t.y - 0.12, DESK_Z + 0.035 + TH / 2 + 0.01), None, bevel=0)
boolean(front, recess)
box("TermBezel", (0.345, 0.012, 0.265), (t.x, t.y - 0.098, DESK_Z + 0.035 + TH / 2 + 0.01), bezel_m, bevel=0.006)
scr, suv = bulge_screen("CRT", (t.x, t.y - 0.104, DESK_Z + 0.035 + TH / 2 + 0.01), 0.3, 0.225, 0.012, os.path.join(T, "crt1978.png"), emit=2.4)
box("TermFoot", (0.34, 0.3, 0.035), (t.x, t.y + 0.06, DESK_Z + 0.0175), bezel_m, bevel=0.008)
area((t.x, t.y - 0.25, DESK_Z + 0.22), (0.3, 1.0, 0.55), 5, (0.3, 0.22), rot=(math.radians(-90), 0, 0), name="CRTGlow")
_b = scr.data.materials[0].node_tree.nodes["Principled BSDF"]
_b.inputs["Coat Weight"].default_value = 0.45
_b.inputs["Coat Roughness"].default_value = 0.12

# keyboard with sculpted keycaps
kb = on_z(955, 820)
kbody = box("KbBody", (0.48, 0.19, 0.03), (kb.x, kb.y, DESK_Z + 0.015), housing, rot=(math.radians(-4), 0, 0), bevel=0.01, segs=4)
cap_a = noisy("CapAlpha", (0.78, 0.74, 0.64), rough=0.35, scale=300, bump=0.02)
cap_m = noisy("CapMod", (0.32, 0.28, 0.24), rough=0.35, scale=300, bump=0.02)
for r in range(4):
    for c in range(14):
        m_ = cap_m if c in (0, 13) or r == 3 and c > 10 else cap_a
        keycap(f"Key{r}{c}", (kb.x - 0.2 + c * 0.0295 + r * 0.007, kb.y - 0.055 + r * 0.029, DESK_Z + 0.03 + r * 0.002), mat=m_)
keycap("Space", (kb.x - 0.01, kb.y - 0.084, DESK_Z + 0.028), size=(0.16, 0.018), mat=cap_a)

# green-bar printout (fanfold stack) and a binder
gb = paper_mat("GreenBar", os.path.join(T, "greenbar.png"), rough=0.8)
pp = on_z(640, 760)
for i in range(14):
    sh = plane(f"Fanfold{i}", (0.38, 0.28), (pp.x + random.Random(i).uniform(-0.002, 0.002), pp.y, DESK_Z + 0.001 + i * 0.0011), gb, rot=(0, 0, 0.1), subdiv=6)
    sh.modifiers.new("sol", "SOLIDIFY").thickness = 0.0008
top = plane("FanfoldTop", (0.38, 0.28), (pp.x + 0.004, pp.y - 0.01, DESK_Z + 0.018), gb, rot=(0, 0, 0.12), subdiv=12)
bend(top, math.radians(10), "Y")

# coffee mug, pen
mg = on_z(1400, 780)
mug = noisy("MugGlaze", (0.78, 0.74, 0.66), var=0.04, rough=0.2, scale=80, bump=0.03, coat=0.4)
lathe("Mug", [(0, 0), (0.038, 0), (0.041, 0.004), (0.041, 0.095), (0.038, 0.098), (0.036, 0.095), (0.035, 0.008), (0, 0.008)], (mg.x, mg.y, DESK_Z), mug, close_top=False)
cyl("Coffee", 0.035, 0.002, (mg.x, mg.y, DESK_Z + 0.078), solid("CoffeeM", (0.05, 0.025, 0.012), 0.08))
cyl("Pen", 0.0045, 0.14, (on_z(1180, 870).x, on_z(1180, 870).y, DESK_Z + 0.0045), solid("PenBlack", (0.02, 0.02, 0.02), 0.25), rot=(0, math.radians(90), math.radians(-18)))

# air
volume_box((8.4, 6.4, 2.8), (0, 1.5, 1.42), 0.014, (0.92, 1.0, 0.95), 0.55)
dust(500, (0.9, 1.4, 2.2), (1.2, 1.6, 1.0), radius=0.0005, seed=11, bright=0.4)

cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (cam.location - Vector((t.x, t.y - 0.1, DESK_Z + 0.2))).length
cam.data.dof.aperture_fstop = 2.8
cam.data.dof.aperture_blades = 9

y_ = 1 - (60 + 14 * 52 + 20) / 1050
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({"data": stage_path([suv(0.06, y_), suv(0.3, y_), suv(0.32, y_ + 0.03), suv(0.34, y_ - 0.04), suv(0.36, y_ + 0.02), suv(0.38, y_), suv(0.9, y_)])}, open(OUT.replace(".png", ".json"), "w"))
lib.render(OUT)
print("rendered", OUT)
