"""Plate: Abbasid Baghdad, c. 850 CE — the scribe's desk in a fired-brick hall at dusk.
variant=abbasid : the record at rest, reed pen by the inkwell
variant=record  : the last line being written, pen on the page, candle burned lower
"""
import sys, math, os, json, random
sys.path.insert(0, os.path.dirname(__file__))
import lib
from lib import *
from common_props import *

args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
RES = tuple(int(v) for v in args.get("res", "1920x1080").split("x"))
SAMPLES = int(args.get("samples", 96))
VARIANT = args.get("variant", "abbasid")
OUT = args.get("out", os.path.join(os.path.dirname(os.path.abspath(__file__)), "final", f"{VARIANT}.png"))

sc = reset(RES, SAMPLES)
cam = camera(fstop=4.0, focus=1.25)

T = lib.TEX
WALL_Y = 4.2
WALL_T = 0.7

# ── materials ──
LEDGER = VARIANT == "ledger"
m_brick = brick("FiredBrick", (0.56, 0.42, 0.26), (0.47, 0.34, 0.2), (0.6, 0.52, 0.4), scale=4.0, row=0.18, width=0.36)
m_stucco = relief("Stucco", (0.62, 0.52, 0.38), os.path.join(T, "stucco.png"), 0.8, scale=(6, 1))
m_walnut = wood("Walnut", (0.06, 0.03, 0.016), (0.19, 0.1, 0.05), scale=2.2, rough=0.36, coat=0.4)
m_beam = wood("Beam", (0.05, 0.03, 0.018), (0.15, 0.085, 0.045), scale=1.5, rough=0.75, coat=0.0)
m_brass = brass()
m_rug = image_fabric("Rug", os.path.join(T, "rug.png"))
m_floor = noisy("FloorBrick", (0.4, 0.3, 0.2), var=0.1, rough=0.85, scale=6, bump=0.3)
m_earth = noisy("Earth", (0.42, 0.31, 0.2), var=0.1, rough=0.95, scale=3, bump=0.3)
m_cloth = [noisy(f"Cloth{i}", c, var=0.1, rough=0.9, scale=60, bump=0.2, sheen=0.5) for i, c in enumerate([(0.35, 0.07, 0.04), (0.45, 0.3, 0.08), (0.06, 0.1, 0.2), (0.5, 0.42, 0.3)])]
m_paper = noisy("ScrollPaper", (0.78, 0.68, 0.5), var=0.08, rough=0.8, scale=80, bump=0.1)
m_leather = noisy("Leather", (0.22, 0.09, 0.05), var=0.12, rough=0.55, scale=90, bump=0.25)
m_leather2 = noisy("Leather2", (0.12, 0.1, 0.06), var=0.12, rough=0.55, scale=90, bump=0.25)
m_clay = noisy("Clay", (0.5, 0.3, 0.17), var=0.1, rough=0.8, scale=40, bump=0.2)

# ── the desk & floor ──
desk(m_walnut)
box("Floor", (12, 10, 0.05), (0, 1.0, -0.025), m_floor, bevel=0)
plane("RugP", (2.6, 1.8), (0.3, 2.6, 0.004), m_rug)

# ── back wall with a great pointed arch, a side arch and a niche ──
main_w, main_spring = 1.5, 1.45
main_pts, main_apex = pointed_arch_pts(main_w, main_spring, 0.28)
side_w, side_spring = 0.95, 1.2
side_x = -2.1
side_pts, _ = pointed_arch_pts(side_w, side_spring, 0.28)
if LEDGER:
    m_brick = noisy("LimePlaster", (0.5, 0.42, 0.32), var=0.08, rough=0.92, scale=6, bump=0.12)
wall = wall_with_openings("BackWall", 12.0, 4.4, WALL_T, WALL_Y, m_brick, [(main_pts, 0.0, 0.0, WALL_T), (side_pts, side_x, 0.0, WALL_T)])
if LEDGER:
    # centuries later the great arch has been walled in, leaving a small shuttered window
    infill = prism("Infill", main_pts, 0.25, (0.0, WALL_Y + 0.2, 0.0), m_brick)
    boolean(infill, box("InfillWin", (0.55, 1.0, 0.8), (0.0, WALL_Y + 0.3, 1.45), None, bevel=0))
    prism("InfillSide", side_pts, 0.25, (side_x, WALL_Y + 0.2, 0.0), m_brick)
    for sx_ in (-1, 1):
        box(f"Shutter{sx_}", (0.27, 0.03, 0.8), (sx_ * 0.42, WALL_Y + 0.15, 1.45), m_beam, rot=(0, 0, sx_ * 0.9), bevel=0.004)
niche_w, niche_x = 1.1, 2.05
niche_pts, _ = pointed_arch_pts(niche_w, 1.35, 0.28, base=0.55)
boolean(wall, prism("NicheCut", niche_pts, 0.38, (niche_x, WALL_Y - 0.05, 0.0), None))
box("NicheBack", (niche_w, 0.02, 3), (niche_x, WALL_Y + 0.32, 1.5), noisy("NicheStucco", (0.46, 0.36, 0.25), var=0.08, rough=0.9, scale=20, bump=0.3), bevel=0)

rng = random.Random(3)
for k, zz in enumerate((0.95, 1.4)):
    box(f"Shelf{k}", (niche_w - 0.02, 0.34, 0.03), (niche_x, WALL_Y + 0.15, zz), m_beam, bevel=0.004)
    xx = niche_x - niche_w / 2 + 0.05
    while xx < niche_x + niche_w / 2 - 0.08:
        if rng.random() < 0.5:
            rr_ = rng.uniform(0.028, 0.04)
            cyl("Scroll", rr_, 0.26, (xx + rr_, WALL_Y + 0.14, zz + 0.015 + rr_), m_paper, rot=(math.radians(90), 0, rng.uniform(-0.2, 0.2)))
            xx += rr_ * 2 + 0.012
        else:
            bw, bh = rng.uniform(0.035, 0.07), rng.uniform(0.18, 0.28)
            box("Codex", (bw, 0.22, bh), (xx + bw / 2, WALL_Y + 0.14, zz + 0.015 + bh / 2), m_leather if rng.random() < 0.6 else m_leather2, rot=(0, rng.uniform(-0.06, 0.06), 0), bevel=0.005)
            xx += bw + 0.005
lathe("Jar", [(0, 0), (0.07, 0), (0.14, 0.1), (0.15, 0.22), (0.1, 0.36), (0.055, 0.4), (0.06, 0.44), (0.0, 0.44)], (niche_x - 0.2, WALL_Y + 0.14, 0.58), m_clay)
lathe("Jar2", [(0, 0), (0.05, 0), (0.1, 0.07), (0.1, 0.16), (0.06, 0.24), (0.035, 0.27), (0.0, 0.27)], (niche_x + 0.2, WALL_Y + 0.14, 0.58), m_clay)

# carved stucco frieze across the wall, cut where it meets the openings
band = plane("StuccoBand", (12, 0.28), (0, WALL_Y - 0.02, main_spring + 0.05), m_stucco, rot=(math.radians(90), 0, 0))
band.modifiers.new("sol", "SOLIDIFY").thickness = 0.04
for i, (pts, x) in enumerate(((main_pts, 0.0), (side_pts, side_x), (niche_pts, niche_x))):
    boolean(band, prism(f"BandCut{i}", pts, 0.5, (x, WALL_Y - 0.3, 0.0), None))
# arch surround moulding
outer, _ = pointed_arch_pts(main_w + 0.3, main_spring, 0.28)
ring = prism("ArchFrame", outer, 0.08, (0, WALL_Y - 0.06, 0.0), m_stucco)
boolean(ring, prism("ArchFrameCut", main_pts, 0.4, (0, WALL_Y - 0.2, 0.0), None))

# ceiling beams & side walls
for i in range(9):
    box(f"Beam{i}", (12, 0.2, 0.24), (0, -0.6 + i * 0.6, 3.6), m_beam, bevel=0.012)
box("Ceiling", (12, 6, 0.05), (0, 1.5, 3.75), m_beam, bevel=0)
box("WallL", (0.4, 6, 4.4), (-4.2, 1.2, 2.2), m_brick, bevel=0)
box("WallR", (0.4, 6, 4.4), (4.4, 1.2, 2.2), m_brick, bevel=0)

# ── outside: market square at dusk, city beyond ──
box("Ground", (120, 120, 0.1), (0, 64, -0.06), m_earth, bevel=0)
stalls = ((-1.2, 8.0), (1.0, 9.2), (0.0, 11.5), (-2.5, 12.0), (2.4, 13.0), (-0.8, 15.0))
for i, (ax, ay) in enumerate(stalls):
    aw = plane(f"Awning{i}", (1.9, 1.3), (ax, ay, 2.15), m_cloth[i % 4], rot=(math.radians(-16), 0, rng.uniform(-0.2, 0.2)), subdiv=12)
    aw.modifiers.new("sol", "SOLIDIFY").thickness = 0.01
    bend(aw, math.radians(8), "X")
    for px in (-0.9, 0.9):
        cyl(f"Pole{i}{px}", 0.025, 2.25, (ax + px, ay - 0.6, 1.1), m_beam)
    box(f"Stall{i}", (1.6, 0.7, 0.8), (ax, ay, 0.4), m_beam, bevel=0.01)
    for k in range(5):
        lathe(f"Sack{i}{k}", [(0, 0), (0.15, 0.02), (0.19, 0.18), (0.13, 0.38), (0.09, 0.42), (0, 0.42)], (ax - 0.6 + k * 0.3, ay - 0.5, 0.0), noisy(f"Sack{i}{k}m", rng.choice([(0.55, 0.45, 0.3), (0.6, 0.3, 0.1), (0.5, 0.4, 0.2)]), rough=0.95, scale=60, bump=0.3))
card("Crowd1", os.path.join(T, "market.png"), 1.8, (0.2, 9.8, 0.9))
card("Crowd2", os.path.join(T, "market.png"), 1.75, (-0.6, 13.5, 0.87), rot=(math.radians(90), 0, math.radians(180)))
for i, (ax, ay) in enumerate(stalls[:4]):
    point((ax + 0.5, ay - 0.9, 1.0), (1.0, 0.55, 0.22), 25, radius=0.1, name=f"StallLamp{i}")
card("Caravan", os.path.join(T, "caravan.png"), 3.0, (4, 70, 1.3))
card("Skyline", os.path.join(T, "baghdad_skyline.png"), 24, (-6, 150, 11))

if LEDGER:
    gradient_sky([(-0.2, (0.02, 0.02, 0.03)), (0.0, (0.08, 0.1, 0.2)), (0.2, (0.04, 0.05, 0.12)), (0.7, (0.01, 0.01, 0.03))], 1.0)
    sphere("Moon", 1.2, (6, 120, 26), emission("MoonE", (0.9, 0.9, 1.0), 6))
else:
  gradient_sky([(-0.2, (0.9, 0.42, 0.14)), (0.0, (1.0, 0.5, 0.18)), (0.03, (0.95, 0.42, 0.2)), (0.1, (0.55, 0.25, 0.3)), (0.25, (0.16, 0.1, 0.25)), (0.6, (0.03, 0.03, 0.09))], 1.1)
if not LEDGER:
    sun((math.radians(-86), 0, math.radians(8)), (1.0, 0.5, 0.25), 4.0, angle=1.5)

volume_box((8.0, 5.2, 3.6), (0, 1.5, 1.8), 0.012, (1.0, 0.86, 0.72), 0.55)
volume_box((80, 80, 25), (0, 50, 12), 0.004, (1.0, 0.75, 0.6), 0.2, name="OutsideHaze")

# ── lanterns ──
lantern((-1.0, 2.9, 2.35), chain_top=3.6, watts=18 if not LEDGER else 10, s=0.9)
if not LEDGER:
    lantern((1.05, 3.1, 2.45), chain_top=3.6, watts=16, s=0.9)

# ── desk objects ──
man_tex = os.path.join(T, "manuscript_full.png" if VARIANT == "record" else "manuscript.png")
if LEDGER:
    bc = on_z(960, 815)
    book, uv2w = open_book("Ledger1400", (bc.x, bc.y), 0.48, 0.32, os.path.join(T, "ledger1400.png"), m_leather)
    pcx, pcy, pw, pd = bc.x, bc.y, 0.48, 0.32
else:
    page, pw, pd, (pcx, pcy) = paper_sheet("Manuscript", [(850, 735), (1070, 735), (1105, 890), (815, 890)], man_tex, curl=math.radians(3))

cpos = on_z(1320, 700)
candle((cpos.x, cpos.y, DESK_Z), height=0.17 if VARIANT == "abbasid" else 0.12, watts=9)
spos = on_z(700, 700)
balance_scales((spos.x, spos.y, DESK_Z), 0.85 if not LEDGER else 0.6, m_brass)
m_gold, m_silver = gold(), silver()
g = on_z(735, 870)
coin_stack((g.x, g.y, DESK_Z), 7, r=0.016, t=0.0026, mat=m_gold, seed=1)
coin_stack((g.x + 0.055, g.y + 0.012, DESK_Z), 4, r=0.017, t=0.0024, mat=m_silver, seed=2)
coin_stack((g.x + 0.025, g.y - 0.045, DESK_Z), 1, mat=m_gold, seed=3)
coin_stack((g.x + 0.1, g.y - 0.03, DESK_Z), 1, r=0.013, mat=m_silver, seed=4)
coin_stack((g.x - 0.04, g.y - 0.02, DESK_Z), 2, mat=m_gold, seed=5)
ip = on_z(1185, 770)
lathe("Inkwell", [(0, 0), (0.035, 0), (0.042, 0.012), (0.04, 0.035), (0.022, 0.05), (0.016, 0.058), (0.02, 0.062), (0.0, 0.062)], (ip.x, ip.y, DESK_Z), m_brass)
cyl("Ink", 0.015, 0.002, (ip.x, ip.y, DESK_Z + 0.061), solid("InkBlack", (0.01, 0.006, 0.004), 0.05))
reed = noisy("Reed", (0.55, 0.38, 0.18), var=0.1, rough=0.5, scale=200, bump=0.1)

# the line on the page that the site's recurring thread follows (6th line of the texture)
line_v = 0.5 - (250 + 5 * 150) / 1400
line_pts = []
for i in range(9):
    u = 0.9 - i * (0.8 / 8)
    line_pts.append((pcx + (u - 0.5) * pw, pcy + line_v * pd, DESK_Z + 0.002))
if LEDGER:
    cyl("Quill", 0.0025, 0.3, (ip.x - 0.02, ip.y + 0.03, DESK_Z + 0.16), solid("Feather", (0.9, 0.88, 0.82), 0.7), rot=(math.radians(25), math.radians(-15), 0), r2=0.007)
    vv = 1 - (150 + 9 * 78 + 30) / 1600
    line_pts = [uv2w(0.95, vv), uv2w(0.56, vv)]
elif VARIANT == "record":
    tip = Vector(line_pts[6])
    dvec = Vector((0.035, -0.06, 0.09))
    q = cyl("Qalam", 0.0042, 0.22, tip + dvec.normalized() * 0.11, reed, r2=0.0024)
    q.rotation_mode = "QUATERNION"
    q.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(dvec)
else:
    cyl("Qalam", 0.0042, 0.22, (ip.x - 0.12, ip.y - 0.03, DESK_Z + 0.0045), reed, rot=(0, math.radians(90), math.radians(-20)), r2=0.0024)
sp = on_z(1210, 930)
cyl("Contract", 0.018, 0.22, (sp.x, sp.y, DESK_Z + 0.018), m_paper, rot=(0, math.radians(90), math.radians(-10)))
cyl("Seal", 0.012, 0.004, (sp.x - 0.01, sp.y - 0.017, DESK_Z + 0.03), noisy("Wax", (0.45, 0.04, 0.03), rough=0.35, scale=90, bump=0.3), rot=(math.radians(70), 0, math.radians(-10)))
cyl("Ribbon", 0.0185, 0.012, (sp.x - 0.01, sp.y, DESK_Z + 0.018), solid("RibbonM", (0.3, 0.05, 0.03), 0.7), rot=(0, math.radians(90), math.radians(-10)))

# fills: warm bounce from the square, cool sky fill from above
area((0, WALL_Y - 0.3, 1.6), (1.0, 0.55, 0.3), 30, (1.4, 2.2), rot=(math.radians(-90), 0, 0))
area((0.8, -1.5, 3.0), (0.55, 0.6, 0.8), 6, (3, 1), rot=(math.radians(40), 0, 0))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT.replace(".png", ".json"), "w") as f:
    json.dump({"ledger" if LEDGER else "ink": stage_path(line_pts)}, f)
lib.render(OUT)
print("rendered", OUT)
