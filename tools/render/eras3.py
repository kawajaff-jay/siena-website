"""v3 era plates (refined realism + stronger era signatures).
   python eras3.py -- era=<id> res=1920x1080 samples=64 out=...
Same desk (lib.desk) and seated camera (lib.camera) in every era."""
import sys, os, math, json, random
sys.path.insert(0, os.path.dirname(__file__))
import bpy
import lib
from lib import *
from common_props import *
from v3 import *

T = lib.TEX
def tx(n):
    return os.path.join(T, n)
anchors = json.load(open(tx("anchors.json")))
DB = lib.DESK_BACK


def dof(target, fstop=2.8):
    cam = bpy.context.scene.camera
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = (cam.location - Vector(target)).length
    cam.data.dof.aperture_fstop = fstop
    cam.data.dof.aperture_blades = 9


def no_shadow(*names):
    for n in names:
        if n in bpy.data.objects:
            bpy.data.objects[n].visible_shadow = False


def paper_on_desk(name, sx, sy, w, d, tex, rotz=0.0, z=0.0, curl=0.0):
    p = on_z(sx, sy)
    ob = plane(name, (w, d), (p.x, p.y, DESK_Z + 0.0015 + z), paper_rich(name + "M", tex), rot=(0, 0, rotz), subdiv=16)
    ob.modifiers.new("sol", "SOLIDIFY").thickness = 0.0006
    if curl:
        bend(ob, curl, "Y")
    return ob


def stack_books(sx, sy, n, mats, size=(0.3, 0.22), seed=0):
    rng = random.Random(seed)
    p = on_z(sx, sy)
    z = DESK_Z
    for i in range(n):
        h = rng.uniform(0.03, 0.05)
        box(f"Book{seed}_{i}", (size[0] + rng.uniform(-0.02, 0.02), size[1] + rng.uniform(-0.02, 0.02), h), (p.x + rng.uniform(-0.01, 0.01), p.y + rng.uniform(-0.01, 0.01), z + h / 2), mats[i % len(mats)], rot=(0, 0, rng.uniform(-0.12, 0.12)), bevel=0.004, segs=3)
        box(f"BookPages{seed}_{i}", (size[0] - 0.012, size[1] - 0.004, h - 0.008), (p.x, p.y - 0.003, z + h / 2), noisy(f"Pages{seed}{i}", (0.84, 0.79, 0.66), rough=0.9, scale=400, bump=0.6), rot=(0, 0, rng.uniform(-0.1, 0.1)), bevel=0.001)
        z += h


# ───────────────────────── c.1750 · printed page ─────────────────────────
def printed():
    camera()
    plaster = noisy("Plaster", (0.4, 0.42, 0.35), var=0.05, rough=0.9, scale=8, bump=0.12)
    oak = wood("PanelOak", (0.15, 0.085, 0.042), (0.3, 0.19, 0.095), 2.0, 0.45, 0.15, stretch=(6, 1, 1), distortion=4)
    floor = wood("Boards", (0.12, 0.07, 0.035), (0.25, 0.15, 0.08), 1.2, 0.6, 0.1, stretch=(1, 10, 1))
    wall = room(4.0, plaster, floor, noisy("CeilP", (0.5, 0.49, 0.45), rough=0.95, scale=5, bump=0.05), 3.4)
    desk(wood_rich("Mahogany", "walnut", tint=0.8, dust=0.05))
    panels(-4.3, 4.3, 4.0, 0.0, 0.95, oak, 14)
    window_cut(wall, 0.0, 0.95, 1.3, 1.9, y=4.1)
    mullions(0.0, 4.08, 0.95, 1.3, 1.9, 3, 4, solid("WinPaint", (0.7, 0.68, 0.6), 0.6))
    plane("Pane", (1.3, 1.9), (0, 4.1, 1.9), glass_img_rough("OldGlass", (0.95, 0.97, 0.95), 0.04), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.2, 0.18, 0.2)), (0.0, (0.95, 0.55, 0.3)), (0.08, (0.5, 0.35, 0.45)), (0.3, (0.12, 0.14, 0.3)), (0.8, (0.03, 0.04, 0.1))], 1.0)
    for i in range(6):
        box(f"Roof{i}", (4, 4, 6 + i), (-8 + i * 3.4, 30 + (i % 2) * 5, 3 + i / 2), noisy("Brick", (0.3, 0.18, 0.12), rough=0.9, scale=5, bump=0.3), bevel=0.05)
    for side in (-1, 1):
        cur = plane(f"Curtain{side}", (0.55, 2.4), (side * 0.95, 3.95, 1.9), cloth(f"Damask{side}", (0.3, 0.07, 0.05), sheen=0.8), rot=(math.radians(90), 0, 0), subdiv=24)
        md = cur.modifiers.new("wave", "WAVE")
        md.use_x, md.use_y = True, False
        md.height, md.width, md.narrowness = 0.05, 0.12, 1.2
        cur.modifiers.new("sol", "SOLIDIFY").thickness = 0.01
    box("Bookcase", (1.2, 0.4, 2.3), (2.4, 3.75, 1.15), oak, bevel=0.01)
    rng = random.Random(4)
    for sh in range(4):
        z = 0.35 + sh * 0.5
        x = 1.9
        while x < 2.9:
            bw = rng.uniform(0.03, 0.06)
            box("Book", (bw, 0.25, rng.uniform(0.25, 0.36)), (x, 3.6, z + 0.16), noisy(f"B{sh}{x}", rng.choice([(0.25, 0.06, 0.04), (0.08, 0.12, 0.08), (0.3, 0.2, 0.1), (0.1, 0.08, 0.15)]), rough=0.6, scale=80, bump=0.3), bevel=0.004)
            x += bw + 0.003
    # desk: printed price current over a letter, inkstand, argand lamp, watch, sealing wax
    paper_on_desk("Letter", 1010, 800, 0.2, 0.27, tx("manuscript_full.png"), rotz=0.15, z=0)
    sheet = paper_on_desk("Printed", 945, 815, 0.21, 0.29, tx("printed1750.png"), rotz=-0.05, z=0.001, curl=math.radians(4))
    b = brass_aged()
    lp = on_z(1310, 710)
    lathe("LampBase", [(0, 0), (0.07, 0), (0.07, 0.01), (0.03, 0.03), (0.018, 0.2), (0.05, 0.24), (0.055, 0.28), (0.02, 0.3), (0, 0.3)], (lp.x, lp.y, DESK_Z), b)
    lathe("Chimney", [(0.025, 0), (0.028, 0.03), (0.032, 0.06), (0.02, 0.12), (0.018, 0.2)], (lp.x, lp.y, DESK_Z + 0.3), glass("ChimGlass", (1, 0.98, 0.95), 0.01), close_top=False, close_bottom=False)
    flame((lp.x, lp.y, DESK_Z + 0.315), watts=38, name="ArgandFlame")
    ip = on_z(1170, 760)
    box("Inkstand", (0.2, 0.12, 0.02), (ip.x, ip.y, DESK_Z + 0.01), metal_worn("Pewter", (0.5, 0.5, 0.48), 0.35), bevel=0.004)
    for dx in (-0.05, 0.05):
        lathe(f"InkPot{dx}", [(0, 0), (0.025, 0), (0.028, 0.04), (0.012, 0.05), (0, 0.05)], (ip.x + dx, ip.y, DESK_Z + 0.02), glass("InkGlass", (0.4, 0.45, 0.5), 0.05))
    feather = plane("Quill", (0.025, 0.3), (ip.x + 0.05, ip.y + 0.02, DESK_Z + 0.17), solid("Feather", (0.92, 0.9, 0.84), 0.7, sss=0.3), rot=(math.radians(15), math.radians(20), 0), subdiv=6)
    bend(feather, math.radians(15), "Y")
    wp = on_z(760, 880)
    cyl("Watch", 0.025, 0.012, (wp.x, wp.y, DESK_Z + 0.006), brass_aged("WatchGold", (0.95, 0.72, 0.35), 0.2), bevel=0.003)
    cyl("WatchFace", 0.021, 0.001, (wp.x, wp.y, DESK_Z + 0.0125), paper_rich("Enamel", tx("clock.png")))
    sw = on_z(1150, 900)
    box("SealWax", (0.1, 0.012, 0.012), (sw.x, sw.y, DESK_Z + 0.006), solid("RedWax", (0.5, 0.03, 0.02), 0.35), rot=(0, 0, 0.3), bevel=0.002)
    coin_stack((wp.x + 0.08, wp.y - 0.02, DESK_Z), 3, r=0.016, mat=coin_mat("Shilling", (0.86, 0.86, 0.84), 0.016), seed=9)
    volume_box((8.4, 5.6, 3.3), (0, 1.2, 1.7), 0.007, (1, 0.9, 0.8), 0.5)
    dust(900, (0.9, 0.6, 1.25), (1.0, 0.8, 0.8), radius=0.0005, seed=5, bright=0.5)
    area((0, 3.6, 1.9), (1.0, 0.6, 0.4), 18, (1.2, 1.8), rot=(math.radians(-90), 0, 0)).data.use_shadow = False
    area((0.8, -1.5, 3.0), (0.6, 0.62, 0.75), 4, (3, 1), rot=(math.radians(40), 0, 0))
    dof((on_z(945, 815).x, on_z(945, 815).y, DESK_Z))
    ln = [on_z(x, 858, DESK_Z + 0.003) for x in (1030, 870)]
    return {"ledger": stage_path(ln)}


# ───────────────────────── c.1880 · account book ─────────────────────────
def accountbook():
    camera()
    panel_w = wood("DarkOak", (0.07, 0.04, 0.02), (0.16, 0.09, 0.045), 2.0, 0.4, 0.3, stretch=(6, 1, 1), distortion=4)
    paper_wall = noisy("Wallpaper", (0.22, 0.18, 0.12), var=0.12, rough=0.85, scale=30, bump=0.08)
    floor = wood("Parquet", (0.1, 0.06, 0.03), (0.22, 0.13, 0.06), 1.5, 0.45, 0.2)
    wall = room(4.0, paper_wall, floor, noisy("Ceil", (0.3, 0.27, 0.22), rough=0.95, scale=5, bump=0.05), 3.4)
    desk(wood_rich("Walnut", "walnut", tint=0.75, dust=0.05))
    panels(-4.3, 4.3, 4.0, 0.0, 1.2, panel_w, 12)
    window_cut(wall, 0.2, 1.1, 1.1, 2.0, y=4.1)
    mullions(0.2, 4.08, 1.1, 1.1, 2.0, 2, 2, panel_w, bar=0.04)
    plane("Pane", (1.1, 2.0), (0.2, 4.12, 2.1), glass_img_rough("Glass", (0.95, 0.97, 1), 0.02), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.02, 0.02, 0.03)), (0.0, (0.1, 0.1, 0.14)), (0.3, (0.03, 0.04, 0.08)), (0.8, (0.01, 0.01, 0.03))], 1.0)
    for i in range(5):
        x = -3 + i * 1.6
        box(f"Facade{i}", (1.5, 1, 8), (x, 18, 4), noisy("Stone", (0.3, 0.28, 0.25), rough=0.9, scale=4, bump=0.3), bevel=0.05)
        for k in range(3):
            plane(f"Win{i}{k}", (0.5, 0.8), (x, 17.45, 1.5 + k * 2), emission(f"WinE{i}{k}", (1.0, 0.7, 0.35), 2.5 if (i + k) % 2 else 0.2), rot=(math.radians(90), 0, 0))
    point((0.8, 12, 3.5), (1.0, 0.65, 0.3), 200, 0.2, "StreetGas")
    for x in (-1.3, 1.7):
        box(f"SconceArm{x}", (0.03, 0.25, 0.03), (x, 3.87, 1.95), brass_aged(), bevel=0.005)
        sphere(f"Globe{x}", 0.08, (x, 3.75, 2.0), emission("GasGlobe", (1.0, 0.72, 0.4), 5))
        point((x, 3.7, 2.0), (1.0, 0.68, 0.35), 70, 0.08, "Gas")
    sf = box("Safe", (0.7, 0.6, 0.9), (2.5, 3.5, 0.45), metal_worn("SafeIron", (0.1, 0.12, 0.1), 0.45), bevel=0.02)
    cyl("SafeDial", 0.06, 0.02, (2.5, 3.19, 0.6), brass_aged(), rot=(math.radians(90), 0, 0))
    ab_c = on_z(960, 815)
    book, uv2w = open_book("AccountBook", (ab_c.x, ab_c.y), 0.46, 0.3, tx("accountbook1880.png"), noisy("Cloth", (0.12, 0.05, 0.04), rough=0.6, scale=90, bump=0.3))
    book.data.materials[0] = paper_rich("AccountBookPages", tx("accountbook1880.png"))
    stack_books(640, 760, 3, [noisy("LeatherA", (0.15, 0.05, 0.03), rough=0.55, scale=90, bump=0.4), noisy("LeatherB", (0.06, 0.09, 0.06), rough=0.55, scale=90, bump=0.4)], seed=2)
    bp = on_z(1220, 880)
    box("Blotter", (0.36, 0.26, 0.01), (bp.x, bp.y, DESK_Z + 0.005), noisy("Felt", (0.08, 0.2, 0.12), rough=0.95, scale=200, bump=0.3), bevel=0.003)
    ip = on_z(1230, 740)
    lathe("InkGlass", [(0, 0), (0.035, 0), (0.038, 0.04), (0.015, 0.055), (0.015, 0.065), (0, 0.065)], (ip.x, ip.y, DESK_Z), glass_img_rough("CutGlass", (0.95, 0.97, 1), 0.03))
    cyl("Ink", 0.03, 0.02, (ip.x, ip.y, DESK_Z + 0.012), solid("Ink", (0.01, 0.01, 0.02), 0.05))
    cyl("DipPen", 0.0035, 0.18, (ip.x - 0.12, ip.y + 0.02, DESK_Z + 0.004), solid("PenWood", (0.05, 0.03, 0.02), 0.3), rot=(0, math.radians(90), math.radians(-30)))
    lp = on_z(1340, 690)
    lathe("DeskLampBase", [(0, 0), (0.08, 0), (0.07, 0.02), (0.02, 0.04), (0.02, 0.32), (0, 0.32)], (lp.x, lp.y, DESK_Z), brass_aged())
    lathe("LampShade", [(0.03, 0.0), (0.07, 0.03), (0.075, 0.08), (0.05, 0.12), (0.02, 0.13)], (lp.x, lp.y, DESK_Z + 0.3), glass("OpalGlass", (1, 0.95, 0.85), 0.35), close_top=False, close_bottom=False)
    flame((lp.x, lp.y, DESK_Z + 0.32), watts=40, name="DeskGas")
    volume_box((8.4, 5.6, 3.3), (0, 1.2, 1.7), 0.006, (1, 0.9, 0.8), 0.5)
    area((0.8, -1.5, 3.0), (0.6, 0.62, 0.75), 4, (3, 1), rot=(math.radians(40), 0, 0))
    dof((ab_c.x, ab_c.y, DESK_Z))
    v = 1 - (178 + 10 * 44 + 2) / 1600
    return {"ledger": stage_path([uv2w(0.96, v), uv2w(0.55, v)])}


# ───────────────────────── 1920s–1940s · the paper system ─────────────────────────
def candlestick_phone(loc, mat):
    x, y, z = loc
    lathe("CPBase", [(0, 0), (0.055, 0), (0.055, 0.008), (0.03, 0.025), (0.012, 0.035), (0, 0.035)], (x, y, z), mat)
    cyl("CPStem", 0.009, 0.24, (x, y, z + 0.15), mat)
    lathe("CPMouth", [(0.0, 0), (0.012, 0), (0.028, 0.03), (0.03, 0.04), (0.0, 0.04)], (x, y - 0.03, z + 0.27), mat, rot=(math.radians(-80), 0, 0))
    cyl("CPHook", 0.003, 0.05, (x + 0.02, y, z + 0.24), metal_worn("Nickel", (0.75, 0.74, 0.7), 0.2), rot=(0, math.radians(90), 0))
    rec = lathe("CPReceiver", [(0, 0), (0.014, 0), (0.016, 0.1), (0.028, 0.12), (0.03, 0.14), (0, 0.14)], (x + 0.045, y, z + 0.16), mat)


def paper():
    camera()
    plaster = noisy("Plaster", (0.52, 0.46, 0.36), var=0.06, rough=0.9, scale=8, bump=0.1)
    oak = wood("PanelOak", (0.12, 0.07, 0.035), (0.28, 0.17, 0.08), 2.0, 0.4, 0.2, stretch=(6, 1, 1), distortion=4)
    floor = wood("Floor", (0.1, 0.06, 0.03), (0.22, 0.13, 0.06), 1.2, 0.55, 0.15, stretch=(1, 10, 1))
    wall = room(4.0, plaster, floor, noisy("Ceil", (0.6, 0.57, 0.5), rough=0.95, scale=5, bump=0.05), 3.3)
    desk(wood_rich("GoldenOak", "goldenoak", tint=0.85, dust=0.05))
    panels(-4.3, 4.3, 4.0, 0.0, 1.05, oak, 12)
    # tall window with a pull shade, afternoon sun raking the room
    window_cut(wall, 0.45, 1.05, 1.2, 1.9, y=4.1)
    mullions(0.45, 4.08, 1.05, 1.2, 1.9, 2, 3, oak, bar=0.035)
    plane("Pane", (1.2, 1.9), (0.45, 4.12, 2.0), glass_img_rough("Glass", (0.97, 0.98, 1), 0.02), rot=(math.radians(90), 0, 0))
    plane("Shade", (1.2, 0.55), (0.45, 4.02, 2.68), cloth("ShadeCloth", (0.75, 0.66, 0.48), sheen=0.3), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.6, 0.55, 0.45)), (0.0, (0.95, 0.85, 0.65)), (0.3, (0.6, 0.72, 0.9)), (0.8, (0.35, 0.5, 0.8))], 1.3)
    for i in range(5):
        box(f"Bldg{i}", (3, 3, 10 + i * 2), (-4 + i * 3.2, 22 + (i % 2) * 4, 5 + i), noisy("BrickFacade", (0.4, 0.25, 0.18), rough=0.9, scale=6, bump=0.3), bevel=0.05)
    sun((math.radians(-60), 0, math.radians(-24)), (1.0, 0.84, 0.62), 6.0, angle=1.0)
    # frosted door (left) — a manager beyond the glass
    dx = -1.65
    window_cut(wall, dx, 0.0, 0.9, 2.2, y=4.1)
    box("DoorLower", (0.9, 0.05, 1.05), (dx, 4.08, 0.525), oak, bevel=0.006)
    box("DoorTop", (0.9, 0.05, 0.12), (dx, 4.08, 2.14), oak, bevel=0.006)
    for s_ in (-1, 1):
        box(f"DoorStile{s_}", (0.1, 0.05, 1.05), (dx + s_ * 0.4, 4.08, 1.6), oak, bevel=0.006)
    plane("Frosted", (0.7, 1.0), (dx, 4.08, 1.58), glass("Frosted", (0.95, 0.94, 0.9), 0.4), rot=(math.radians(90), 0, 0))
    figure("Manager", (dx + 0.08, 4.7, 0.0), 1.8, robe=(0.12, 0.12, 0.13), head="hat", head_color=(0.12, 0.1, 0.09), facing=math.radians(20))
    area((dx, 5.4, 1.6), (1, 0.85, 0.65), 60, (1.5, 2), rot=(math.radians(-90), 0, 0))
    box("OutsideHall", (3, 0.1, 3), (dx, 5.8, 1.5), plaster, bevel=0)
    # pigeonhole sorting cabinet on the back wall — the paper system's signature
    ph_x, ph_z = 1.55, 1.9
    box("PigeonCase", (1.3, 0.32, 0.9), (ph_x, 3.84, ph_z), oak, bevel=0.01)
    rng = random.Random(2)
    for r in range(4):
        for c in range(6):
            cx, cz = ph_x - 0.54 + c * 0.216, ph_z - 0.33 + r * 0.22
            box(f"Hole{r}{c}", (0.2, 0.2, 0.2), (cx, 3.7, cz), solid("HoleDark", (0.05, 0.03, 0.02), 0.8), bevel=0)
            if rng.random() < 0.75:
                for k in range(rng.randint(2, 6)):
                    box(f"Slip{r}{c}{k}", (0.17, 0.2, 0.002), (cx, 3.68, cz - 0.08 + k * 0.012), solid(f"SlipM{r}{c}{k}", rng.choice([(0.86, 0.82, 0.7), (0.78, 0.7, 0.5), (0.9, 0.88, 0.8)]), 0.9), rot=(math.radians(rng.uniform(-6, 6)), 0, 0), bevel=0)
    # wall clock
    ck = on_y(1000, 130, 3.95)
    cyl("ClockBody", 0.2, 0.06, (ck.x, 3.95, ck.z), oak, rot=(math.radians(90), 0, 0), bevel=0.01)
    plane("ClockFace", (0.34, 0.34), (ck.x, 3.915, ck.z), paper_rich("ClockFaceM", tx("clock.png")), rot=(math.radians(90), 0, 0))
    # filing cabinets (right)
    for i, fx in enumerate((2.6, 3.3)):
        box(f"Cabinet{i}", (0.68, 0.65, 1.45), (fx, 3.6, 0.725), oak, bevel=0.008)
        for k in range(4):
            box(f"Drawer{i}{k}", (0.6, 0.02, 0.3), (fx, 3.27, 0.2 + k * 0.34), oak, bevel=0.01)
            box(f"Handle{i}{k}", (0.14, 0.02, 0.025), (fx, 3.255, 0.28 + k * 0.34), brass_aged(), bevel=0.005)
            plane(f"Label{i}{k}", (0.1, 0.05), (fx, 3.253, 0.33 + k * 0.34), paper_rich(f"LabelM{i}{k}", tx("indexcard.png")), rot=(math.radians(90), 0, 0))
    # desk: open ledger, closed ledgers, card index, wire tray, banker's lamp, candlestick phone
    ab_c = on_z(930, 775)
    book, uv2w = open_book("Ledger", (ab_c.x, ab_c.y), 0.48, 0.32, tx("ledger1924.png"), noisy("Cloth", (0.1, 0.14, 0.1), rough=0.6, scale=90, bump=0.3))
    book.data.materials[0] = paper_rich("LedgerPages", tx("ledger1924.png"))
    stack_books(560, 690, 3, [noisy("LedgerRed", (0.22, 0.05, 0.04), rough=0.55, scale=90, bump=0.4), noisy("LedgerBlack", (0.04, 0.04, 0.04), rough=0.5, scale=90, bump=0.4), noisy("LedgerGreen", (0.05, 0.12, 0.07), rough=0.55, scale=90, bump=0.4)], size=(0.27, 0.2), seed=4)
    ci = on_z(760, 720)
    box("IndexBox", (0.16, 0.34, 0.1), (ci.x, ci.y, DESK_Z + 0.05), oak, bevel=0.005)
    for k in range(18):
        box(f"IdxCard{k}", (0.13, 0.002, 0.08 + (0.012 if k % 5 == 0 else 0)), (ci.x, ci.y - 0.15 + k * 0.017, DESK_Z + 0.07), paper_rich("IdxCardM", tx("indexcard.png")), rot=(math.radians(-8), 0, 0), bevel=0)
    tr = on_z(1180, 760)
    wire = metal_worn("WireTray", (0.55, 0.55, 0.52), 0.35)
    box("TrayBase", (0.3, 0.24, 0.004), (tr.x, tr.y, DESK_Z + 0.002), wire, bevel=0)
    for s_ in (-1, 1):
        box(f"TrayWallX{s_}", (0.3, 0.004, 0.05), (tr.x, tr.y + s_ * 0.12, DESK_Z + 0.027), wire, bevel=0)
        box(f"TrayWallY{s_}", (0.004, 0.24, 0.05), (tr.x + s_ * 0.15, tr.y, DESK_Z + 0.027), wire, bevel=0)
    for k in range(8):
        paper_on_desk(f"TrayPaper{k}", 1180 + rng.uniform(-6, 6), 760 + rng.uniform(-4, 4), 0.21, 0.28, tx("typed1957.png") if k % 2 else tx("indexcard.png"), rotz=rng.uniform(-0.08, 0.08), z=0.004 + k * 0.0015)
    lp = on_z(1420, 655)
    b = brass_aged()
    lathe("BankLampBase", [(0, 0), (0.07, 0), (0.07, 0.012), (0.035, 0.025), (0.01, 0.035), (0.01, 0.26), (0, 0.26)], (lp.x, lp.y, DESK_Z), b)
    shade = lathe("BankShade", [(0.005, 0.0), (0.025, 0.008), (0.06, 0.04), (0.08, 0.06)], (lp.x, lp.y, DESK_Z + 0.33), solid("GreenGlass", (0.03, 0.22, 0.09), 0.12, coat=1.0, emit=(0.1, 0.7, 0.3), emit_str=0.8), rot=(math.radians(180), 0, 0), close_top=False, close_bottom=False)
    shade.scale = (1.7, 1, 1)
    shade.modifiers.new("sol", "SOLIDIFY").thickness = 0.004
    cyl("Bulb", 0.01, 0.14, (lp.x, lp.y, DESK_Z + 0.29), emission("BulbM", (1, 0.8, 0.55), 30), rot=(0, math.radians(90), 0)).visible_shadow = False
    spot((lp.x, lp.y, DESK_Z + 0.29), (1.0, 0.78, 0.5), 30, (0, 0, 0), angle=120, blend=0.8, radius=0.05, name="BankerSpot")
    candlestick_phone(tuple(on_z(1250, 670)) , solid("BlackNickel", (0.02, 0.02, 0.02), 0.25, 0.3))
    pp = on_z(1150, 860)
    cyl("FountainPen", 0.006, 0.14, (pp.x, pp.y, DESK_Z + 0.006), solid("Bakelite", (0.02, 0.02, 0.02), 0.15, coat=0.8), rot=(0, math.radians(90), math.radians(-25)))
    st = on_z(640, 820)
    cyl("StampHandle", 0.015, 0.07, (st.x, st.y, DESK_Z + 0.05), wood("Handle", (0.1, 0.05, 0.02), (0.2, 0.1, 0.05)))
    box("StampBase", (0.06, 0.035, 0.015), (st.x, st.y, DESK_Z + 0.0075), wood("Handle2", (0.1, 0.05, 0.02), (0.2, 0.1, 0.05)), bevel=0.002)
    volume_box((8.4, 5.6, 3.2), (0, 1.2, 1.65), 0.012, (1, 0.92, 0.82), 0.6)
    dust(1600, (0.3, 2.2, 1.5), (2.4, 3.2, 1.8), radius=0.0007, seed=6, bright=0.6)
    area((0.8, -1.5, 3.0), (0.7, 0.72, 0.8), 5, (3, 1), rot=(math.radians(40), 0, 0))
    dof((ab_c.x, ab_c.y, DESK_Z))
    v = 1 - (178 + 12 * 44 + 2) / 1600
    return {"ledger": stage_path([uv2w(0.96, v), uv2w(0.54, v)])}


# ───────────────────────── 1950s–1960s · the mechanical office ─────────────────────────
def typewriter2(center, texpath):
    cx, cy = center
    body_m = noisy("TWBody", (0.13, 0.19, 0.17), var=0.04, rough=0.32, scale=40, bump=0.04, coat=0.5)
    chrome = metal_worn("Chrome", (0.85, 0.85, 0.85), 0.12)
    black = solid("BlackEnamel", (0.02, 0.02, 0.02), 0.25, coat=0.6)
    z = DESK_Z
    box("TWBase", (0.44, 0.34, 0.05), (cx, cy, z + 0.025), body_m, bevel=0.018, segs=4)
    box("TWBody", (0.4, 0.2, 0.09), (cx, cy + 0.06, z + 0.095), body_m, bevel=0.035, segs=5)
    box("TWDeck", (0.36, 0.15, 0.03), (cx, cy - 0.07, z + 0.058), body_m, rot=(math.radians(-12), 0, 0), bevel=0.012, segs=3)
    cyl("Platen", 0.024, 0.46, (cx, cy + 0.12, z + 0.165), solid("Rubber", (0.03, 0.03, 0.03), 0.6), rot=(0, math.radians(90), 0))
    for s_ in (-1, 1):
        cyl(f"Knob{s_}", 0.03, 0.03, (cx + s_ * 0.25, cy + 0.12, z + 0.165), black, rot=(0, math.radians(90), 0), bevel=0.006)
    box("CarriageRail", (0.52, 0.02, 0.02), (cx, cy + 0.165, z + 0.145), chrome, bevel=0.004)
    cyl("ReturnLever", 0.004, 0.1, (cx - 0.29, cy + 0.08, z + 0.19), chrome, rot=(0, math.radians(70), math.radians(20)))
    box("PaperBail", (0.4, 0.006, 0.006), (cx, cy + 0.1, z + 0.19), chrome, bevel=0.002)
    key_m = noisy("KeyCap", (0.9, 0.88, 0.82), rough=0.28, scale=90, bump=0.02, coat=0.4)
    for r in range(4):
        n = 11 - (r == 3)
        for k in range(n):
            x = cx - 0.15 + k * 0.03 + r * 0.008
            y = cy - 0.125 + r * 0.03
            zz = z + 0.072 + r * 0.013
            cyl(f"Key{r}_{k}", 0.0095, 0.005, (x, y, zz), key_m, bevel=0.0015)
            cyl(f"KeyRing{r}_{k}", 0.0105, 0.004, (x, y, zz - 0.002), chrome)
            cyl(f"KeyStem{r}_{k}", 0.0022, 0.03, (x, y + 0.004, zz - 0.016), chrome)
    box("SpaceBar", (0.2, 0.014, 0.008), (cx, cy - 0.155, z + 0.066), chrome, bevel=0.003)
    pw, ph = 0.215, 0.26
    pap = plane("TypedSheet", (pw, ph), (cx, cy + 0.15, z + 0.17 + ph / 2 - 0.03), paper_rich("TypedM", texpath), rot=(math.radians(98), 0, 0), subdiv=12)
    bend(pap, math.radians(6), "X")
    bpy.context.view_layer.update()
    def uv2w(u, v):
        return pap.matrix_world @ Vector(((u - 0.5) * pw, (v - 0.5) * ph, 0.001))
    return uv2w


def mechanical():
    camera()
    paint = noisy("GreenPaint", (0.36, 0.4, 0.35), var=0.04, rough=0.8, scale=10, bump=0.06)
    lino = noisy("Linoleum", (0.24, 0.21, 0.17), var=0.08, rough=0.35, scale=6, bump=0.05, coat=0.3)
    wall = room(4.0, paint, lino, noisy("AcousticTile", (0.75, 0.74, 0.7), rough=0.95, scale=220, bump=0.5), 3.0)
    lam = noisy("Laminate", (0.3, 0.26, 0.21), var=0.05, rough=0.32, scale=20, bump=0.02, coat=0.3)
    desk(lam)
    box("DeskEdge", (3.2, 0.03, 0.05), (0, DB - 0.01, DESK_Z - 0.025), metal_worn("SteelEdge", (0.62, 0.62, 0.6), 0.25), bevel=0.004)
    wx = 1.0
    window_cut(wall, wx, 0.9, 1.6, 1.7, y=4.1)
    mullions(wx, 4.08, 0.9, 1.6, 1.7, 2, 1, metal_worn("MetalFrame", (0.5, 0.5, 0.48), 0.4))
    slat_m = solid("Slat", (0.85, 0.83, 0.77), 0.45)
    for i in range(34):
        box(f"Slat{i}", (1.6, 0.05, 0.004), (wx, 3.98, 0.95 + i * 0.049), slat_m, rot=(math.radians(35), 0, 0), bevel=0)
    gradient_sky([(-0.2, (0.6, 0.6, 0.55)), (0.0, (0.9, 0.9, 0.85)), (0.5, (0.6, 0.72, 0.9))], 1.5)
    sun((math.radians(-56), 0, math.radians(-22)), (1.0, 0.9, 0.75), 7.0, angle=0.6)
    oc = on_y(760, 150, 3.97)
    box("OrgFrame", (0.95, 0.03, 0.65), (oc.x, 3.98, oc.z), solid("BlackFrame", (0.03, 0.03, 0.03), 0.4), bevel=0.006)
    plane("OrgChart", (0.88, 0.58), (oc.x, 3.96, oc.z), paper_rich("OrgM", tx("orgchart.png")), rot=(math.radians(90), 0, 0))
    ck = on_y(1020, 110, 3.95)
    cyl("Clock", 0.17, 0.05, (ck.x, 3.96, ck.z), metal_worn("ClockRim", (0.7, 0.7, 0.7), 0.3), rot=(math.radians(90), 0, 0), bevel=0.008)
    plane("ClockFace", (0.3, 0.3), (ck.x, 3.93, ck.z), paper_rich("ClockFaceM", tx("clock.png")), rot=(math.radians(90), 0, 0))
    steel = noisy("GreySteel", (0.36, 0.37, 0.36), rough=0.35, scale=20, bump=0.02, metal=0.3, coat=0.3)
    for i, fx in enumerate((2.3, 2.85, 3.4)):
        box(f"Steel{i}", (0.52, 0.65, 1.35), (fx, 3.6, 0.675), steel, bevel=0.01)
        for k in range(4):
            box(f"SD{i}{k}", (0.46, 0.02, 0.3), (fx, 3.27, 0.18 + k * 0.32), steel, bevel=0.008)
            box(f"SH{i}{k}", (0.12, 0.02, 0.02), (fx, 3.255, 0.28 + k * 0.32), metal_worn("ChromeH", (0.82, 0.82, 0.8), 0.15), bevel=0.004)
    # the typing pool beyond a glazed partition: rows of desks, typewriters, typists (structured office)
    window_cut(wall, -1.6, 1.0, 3.2, 1.7, y=4.1)
    plane("Partition", (3.2, 1.7), (-1.6, 4.05, 1.85), glass_img_rough("Ribbed", (0.95, 0.97, 0.97), 0.18), rot=(math.radians(90), 0, 0))
    box("PoolFloor", (6, 6, 0.05), (-1.6, 7.0, -0.025), lino, bevel=0)
    box("PoolWall", (6, 0.1, 3), (-1.6, 9.5, 1.5), paint, bevel=0)
    rng = random.Random(3)
    for r in range(2):
        for c in range(3):
            px, py = -2.9 + c * 1.3, 5.2 + r * 1.6
            box(f"PDesk{r}{c}", (1.0, 0.6, 0.04), (px, py, 0.74), lam, bevel=0.005)
            box(f"PTW{r}{c}", (0.36, 0.28, 0.12), (px, py - 0.05, 0.82), noisy(f"PTWb{r}{c}", (0.15, 0.18, 0.17), rough=0.35, scale=30, bump=0.02), bevel=0.02)
            figure(f"Typist{r}{c}", (px, py + 0.45, 0.0), rng.uniform(1.55, 1.7), robe=rng.choice([(0.3, 0.32, 0.4), (0.45, 0.3, 0.28), (0.25, 0.25, 0.22)]), head="hair", head_color=rng.choice([(0.08, 0.06, 0.05), (0.3, 0.2, 0.1)]), facing=math.radians(180), pose="reach")
    area((-1.6, 6.5, 2.9), (0.9, 0.95, 1.0), 60, (4, 3), rot=(0, 0, 0))
    # desk: typewriter, rotary phone, adding machine with tape, punch cards, in/out trays, desk lamp
    tw = on_z(960, 700)
    uv2w = typewriter2((tw.x, tw.y), tx("typed1957.png"))
    ph_ = on_z(1400, 740)
    blk = solid("Bakelite", (0.015, 0.015, 0.015), 0.16, coat=0.7)
    body = lathe("PhoneBody", [(0, 0), (0.1, 0), (0.1, 0.02), (0.085, 0.07), (0.05, 0.09), (0, 0.095)], (ph_.x, ph_.y, DESK_Z), blk)
    body.scale = (1, 0.9, 1)
    cyl("Dial", 0.045, 0.006, (ph_.x, ph_.y - 0.06, DESK_Z + 0.075), metal_worn("DialChrome", (0.8, 0.8, 0.8), 0.15), rot=(math.radians(-40), 0, 0), bevel=0.001)
    for i in range(10):
        a = math.radians(40 + i * 28)
        hole = cyl(f"DialHole{i}", 0.006, 0.01, (ph_.x + math.cos(a) * 0.032, ph_.y - 0.06 - math.sin(a) * 0.032 * 0.76, DESK_Z + 0.078 + math.sin(a) * 0.032 * 0.64), solid("HoleBlack", (0.01, 0.01, 0.01), 0.5), rot=(math.radians(-40), 0, 0))
    cyl("DialCenter", 0.02, 0.008, (ph_.x, ph_.y - 0.062, DESK_Z + 0.078), paper_rich("DialPaper", tx("indexcard.png")), rot=(math.radians(-40), 0, 0))
    for s_ in (-1, 1):
        box(f"Cradle{s_}", (0.02, 0.03, 0.03), (ph_.x + s_ * 0.075, ph_.y + 0.01, DESK_Z + 0.095), blk, bevel=0.006)
    hs = cyl("Handset", 0.016, 0.2, (ph_.x, ph_.y + 0.01, DESK_Z + 0.125), blk, rot=(0, math.radians(90), 0), segs=24)
    for s_ in (-1, 1):
        sphere(f"Ear{s_}", 0.03, (ph_.x + s_ * 0.1, ph_.y + 0.01, DESK_Z + 0.118), blk, scale=(0.9, 1, 0.6))
    am = on_z(560, 750)
    box("AddMach", (0.2, 0.26, 0.1), (am.x, am.y, DESK_Z + 0.05), noisy("AMGrey", (0.32, 0.31, 0.3), rough=0.35, scale=40, bump=0.02, coat=0.3), rot=(math.radians(-8), 0, 0), bevel=0.02, segs=3)
    for k in range(20):
        keycap(f"AMKey{k}", (am.x - 0.06 + (k % 5) * 0.03, am.y - 0.08 + (k // 5) * 0.03, DESK_Z + 0.1 + (k // 5) * 0.004), size=(0.02, 0.02), h=0.012, mat=solid("AMKeyM", (0.06, 0.06, 0.06) if k % 5 else (0.6, 0.15, 0.1), 0.3))
    cyl("AMRoll", 0.03, 0.12, (am.x, am.y + 0.14, DESK_Z + 0.11), paper_rich("RollPaper", tx("greenbar.png")), rot=(0, math.radians(90), 0))
    tape = plane("AMTape", (0.07, 0.3), (am.x, am.y + 0.24, DESK_Z + 0.2), paper_rich("TapeM", tx("typed1957.png")), rot=(math.radians(-60), 0, 0), subdiv=12)
    bend(tape, math.radians(-120), "X")
    pc = on_z(1170, 850)
    for i in range(14):
        box(f"Punch{i}", (0.187, 0.083, 0.0006), (pc.x + random.Random(i).uniform(-0.003, 0.003), pc.y, DESK_Z + 0.0005 + i * 0.0007), noisy("PunchC", (0.86, 0.8, 0.6), rough=0.85, scale=200, bump=0.1), rot=(0, 0, 0.12), bevel=0)
    for k in range(5):
        paper_on_desk(f"Memo{k}", 700 + k * 4, 845 - k * 3, 0.21, 0.28, tx("typed1957.png") if k % 2 == 0 else tx("indexcard.png"), rotz=-0.12 + 0.05 * k, z=k * 0.0012)
    volume_box((8.4, 5.6, 2.9), (0, 1.2, 1.5), 0.012, (1, 1, 1), 0.6)
    dust(1400, (0.9, 2.4, 1.4), (1.6, 3.0, 1.4), radius=0.0006, seed=7, bright=0.6)
    area((0.8, -1.5, 3.0), (0.8, 0.82, 0.85), 5, (3, 1), rot=(math.radians(40), 0, 0))
    area((0, 1.5, 2.95), (1, 0.97, 0.9), 35, (2.4, 0.4), rot=(0, 0, 0))
    dof((tw.x, tw.y + 0.05, DESK_Z + 0.12))
    v = 1 - (150 + 18 * 52 + 40) / 1650
    return {"typed": stage_path([uv2w(0.12, v), uv2w(0.88, v)])}


# ───────────────────────── 1990s · enterprise ─────────────────────────
def enterprise():
    camera()
    fabric = cloth("PartitionFabric", (0.22, 0.26, 0.33), sheen=0.4, weave=900)
    wallm = noisy("OfficeWall", (0.55, 0.56, 0.55), rough=0.85, scale=8, bump=0.03)
    carpet = noisy("Carpet", (0.14, 0.15, 0.18), var=0.12, rough=0.98, scale=300, bump=0.6)
    room(7.5, wallm, carpet, noisy("CeilTile", (0.72, 0.72, 0.7), rough=0.95, scale=220, bump=0.5), 2.8)
    for i in range(-6, 7):
        for j in range(-1, 12):
            if (i + j) % 3 == 0:
                plane(f"Troffer{i}{j}", (0.6, 1.2), (i * 1.22, j * 0.61 * 2, 2.79), emission("Fluoro", (0.93, 0.97, 1.0), 5), rot=(math.radians(180), 0, 0))
    grid = metal_worn("Grid", (0.8, 0.8, 0.78), 0.45)
    for i in range(-7, 8):
        box(f"GridX{i}", (0.02, 12, 0.01), (i * 0.61, 3.0, 2.78), grid, bevel=0)
    desk(noisy("GreyLam", (0.42, 0.42, 0.4), rough=0.42, scale=20, bump=0.02, coat=0.15))
    # own cubicle walls: back + side, with pinned printouts
    box("CubicleBack", (3.4, 0.06, 1.02), (0, DB + 0.35, 0.51), fabric, bevel=0.01)
    box("CubicleCap", (3.4, 0.08, 0.03), (0, DB + 0.35, 1.03), solid("Trim", (0.55, 0.55, 0.55), 0.4), bevel=0.005)
    for k, (px, pz) in enumerate(((0.9, 0.85), (1.15, 0.8), (-0.5, 0.88))):
        plane(f"Pinned{k}", (0.21, 0.28), (px, DB + 0.315, pz), paper_rich(f"PinnedM{k}", tx("sheet1996.png") if k != 1 else tx("typed1957.png")), rot=(math.radians(90), 0, math.radians((k - 1) * 3)))
    # the office beyond: rows of cubicles, each with a glowing CRT, colleagues' heads
    rng = random.Random(8)
    for r, yy in enumerate((2.6, 4.2, 5.8)):
        for c in range(-3, 4):
            cx = c * 1.6 + (0.8 if r % 2 else 0)
            box(f"Cub{r}{c}", (1.55, 0.06, 1.3), (cx, yy, 0.65), fabric, bevel=0.01)
            box(f"CubCap{r}{c}", (1.55, 0.08, 0.03), (cx, yy, 1.31), solid("Trim2", (0.55, 0.55, 0.55), 0.4), bevel=0.005)
            box(f"CubMon{r}{c}", (0.38, 0.36, 0.32), (cx + 0.2, yy + 0.5, 0.95), noisy("MonBeigeBG", (0.62, 0.58, 0.5), rough=0.45, scale=40, bump=0.02), bevel=0.03)
            plane(f"CubScr{r}{c}", (0.28, 0.21), (cx + 0.2, yy + 0.31, 0.97), emission(f"CubScrE{r}{c}", (0.55, 0.65, 0.85), 1.5), rot=(math.radians(90), 0, 0))
            if rng.random() < 0.5:
                figure(f"Colleague{r}{c}", (cx - 0.25, yy + 0.8, -0.3), rng.uniform(1.65, 1.8), robe=rng.choice([(0.18, 0.2, 0.28), (0.6, 0.58, 0.55), (0.3, 0.25, 0.22)]), head="hair", head_color=rng.choice([(0.08, 0.06, 0.05), (0.3, 0.22, 0.12), (0.5, 0.45, 0.4)]), facing=math.radians(180))
    plane("Whiteboard", (1.8, 1.1), (-2.4, 7.45, 1.6), solid("WB", (0.9, 0.9, 0.9), 0.15), rot=(math.radians(90), 0, 0))
    # desk: beige CRT (curved glass) with spreadsheet, tower, keyboard, mouse, floppies, phone, binders, mug
    beige = noisy("PCBeige", (0.66, 0.62, 0.53), var=0.03, rough=0.42, scale=40, bump=0.03)
    m = on_z(930, 700)
    box("MonBody", (0.4, 0.36, 0.34), (m.x, m.y + 0.13, DESK_Z + 0.24), beige, bevel=0.05, segs=5)
    front = box("MonBezel", (0.42, 0.07, 0.36), (m.x, m.y - 0.07, DESK_Z + 0.245), beige, bevel=0.02, segs=4)
    boolean(front, box("MonCut", (0.33, 0.12, 0.25), (m.x, m.y - 0.12, DESK_Z + 0.255), None, bevel=0))
    scr, suv = bulge_screen("Screen96", (m.x, m.y - 0.08, DESK_Z + 0.255), 0.32, 0.24, 0.01, tx("sheet1996.png"), emit=1.5)
    b_ = scr.data.materials[0].node_tree.nodes["Principled BSDF"]
    b_.inputs["Coat Weight"].default_value = 0.4
    b_.inputs["Coat Roughness"].default_value = 0.1
    lathe("MonStand", [(0, 0), (0.12, 0), (0.11, 0.02), (0.05, 0.05), (0, 0.06)], (m.x, m.y + 0.05, DESK_Z), beige)
    for k, (dx, dz, tex_, rz) in enumerate(((0.19, 0.33, "sticky.png", 0.1), (-0.18, 0.1, "sticky2.png", -0.08))):
        plane(f"MonSticky{k}", (0.07, 0.07), (m.x + dx, m.y - 0.108, DESK_Z + dz), paper_rich(f"StickyM{k}", tx(tex_)), rot=(math.radians(90), rz, 0))
    tw = on_z(1430, 700)
    box("Tower", (0.2, 0.44, 0.44), (tw.x, tw.y + 0.1, DESK_Z + 0.22), beige, bevel=0.012)
    box("Drive1", (0.15, 0.02, 0.04), (tw.x, tw.y - 0.125, DESK_Z + 0.36), solid("DriveF", (0.55, 0.52, 0.45), 0.5), bevel=0.003)
    box("Drive2", (0.12, 0.02, 0.025), (tw.x, tw.y - 0.125, DESK_Z + 0.29), solid("DriveF2", (0.25, 0.25, 0.25), 0.5), bevel=0.003)
    sphere("PowerLED", 0.004, (tw.x + 0.05, tw.y - 0.126, DESK_Z + 0.1), emission("LEDg", (0.3, 1, 0.4), 30))
    kb = on_z(940, 830)
    box("Keyboard", (0.46, 0.17, 0.03), (kb.x, kb.y, DESK_Z + 0.015), beige, rot=(math.radians(-5), 0, 0), bevel=0.01, segs=3)
    keym = noisy("KeyBeige", (0.74, 0.7, 0.62), rough=0.4, scale=300, bump=0.02)
    for r in range(5):
        for c in range(15):
            keycap(f"K{r}{c}", (kb.x - 0.2 + c * 0.0275, kb.y - 0.06 + r * 0.025, DESK_Z + 0.03 + r * 0.002), size=(0.019, 0.019), h=0.009, mat=keym)
    ms = on_z(1180, 840)
    box("MousePad", (0.22, 0.18, 0.004), (ms.x, ms.y, DESK_Z + 0.002), cloth("PadBlue", (0.05, 0.08, 0.2), sheen=0.2), bevel=0.002)
    mouse = sphere("Mouse", 0.035, (ms.x, ms.y, DESK_Z + 0.012), beige, scale=(0.9, 1.4, 0.5))
    fd = on_z(700, 840)
    for i, col in enumerate(((0.05, 0.05, 0.06), (0.1, 0.2, 0.5), (0.05, 0.05, 0.06))):
        box(f"Floppy{i}", (0.09, 0.094, 0.0033), (fd.x + i * 0.03, fd.y + i * 0.02, DESK_Z + 0.002 + i * 0.0034), solid(f"Fl{i}", col, 0.35), rot=(0, 0, 0.2 * i - 0.1), bevel=0.001)
    stack_books(620, 730, 3, [solid("BinderBlue", (0.08, 0.15, 0.4), 0.4), solid("BinderBlack", (0.03, 0.03, 0.03), 0.4)], size=(0.3, 0.26), seed=9)
    mg = on_z(1450, 800)
    lathe("Mug", [(0, 0), (0.04, 0), (0.042, 0.1), (0.038, 0.1), (0.036, 0.008), (0, 0.008)], (mg.x, mg.y, DESK_Z), noisy("MugWhite", (0.85, 0.85, 0.83), rough=0.18, scale=80, bump=0.01, coat=0.5), close_top=False)
    cyl("CoffeeE", 0.036, 0.002, (mg.x, mg.y, DESK_Z + 0.085), solid("CoffeeE", (0.05, 0.025, 0.012), 0.08))
    area((0.2, 0.2, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    area((-1.5, 3.0, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    area((1.8, 4.2, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    volume_box((8.4, 9, 2.7), (0, 3.0, 1.4), 0.006, (0.95, 0.97, 1), 0.4)
    dof((m.x, m.y - 0.08, DESK_Z + 0.25))
    pts = anchors["sheet"]
    return {"sheet": stage_path([suv(u, 1 - v) for u, v in pts])}


# ───────────────────────── 2000s · internet / global ─────────────────────────
def internet():
    camera()
    carpet = noisy("Carpet", (0.07, 0.08, 0.1), var=0.1, rough=0.98, scale=300, bump=0.6)
    wallm = noisy("Wall", (0.16, 0.17, 0.2), rough=0.8, scale=8, bump=0.02)
    wall = room(4.6, wallm, carpet, noisy("Ceil", (0.2, 0.21, 0.24), rough=0.9, scale=40, bump=0.2), 2.9)
    window_cut(wall, 0.6, 0.25, 6.0, 2.55, y=4.7)
    for i in range(-2, 4):
        box(f"Mullion{i}", (0.06, 0.1, 2.6), (0.6 + i * 1.0, 4.65, 1.5), metal_worn("Alu", (0.3, 0.31, 0.33), 0.35), bevel=0.004)
    plane("Glazing", (6, 2.6), (0.6, 4.66, 1.5), glass_img_rough("Glazing", (0.9, 0.95, 1.0), 0.01), rot=(math.radians(90), 0, 0))
    plane("City", (70, 24), (4, 60, 8), image_mat("CityM", tx("city_night.png"), emit=1.6, rough=1), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.01, 0.01, 0.02)), (0.0, (0.06, 0.08, 0.18)), (0.3, (0.02, 0.03, 0.08))], 1.0)
    # world clocks on the solid wall (left of the glazing): the business runs in every time zone
    for i, city in enumerate(("newyork", "london", "dubai", "tokyo")):
        cx = -2.35 + i * 0.55
        cyl(f"WClock{i}", 0.19, 0.04, (cx, 4.57, 2.05), metal_worn("ClockAlu", (0.7, 0.71, 0.73), 0.25), rot=(math.radians(90), 0, 0), bevel=0.006)
        face = plane(f"WClockFace{i}", (0.34, 0.34), (cx, 4.545, 2.05), paper_rich(f"WCF{i}", tx("clock.png")), rot=(math.radians(90), 0, math.radians(i * 70)))
        plane(f"WClockLab{i}", (0.3, 0.06), (cx, 4.568, 1.78), image_mat(f"WCL{i}", tx(f"clock_{city}.png"), rough=0.5), rot=(math.radians(90), 0, 0))
    spot((-1.5, 3.8, 2.85), (1.0, 0.92, 0.8), 60, (math.radians(10), 0, 0), angle=70, blend=0.9, name="ClockWash")
    desk(noisy("LightLam", (0.52, 0.51, 0.48), rough=0.32, scale=20, bump=0.02, coat=0.2))
    m = on_z(960, 720)
    silver_ = metal_worn("SilverPlastic", (0.62, 0.64, 0.67), 0.35)
    box("LCDBezel", (0.52, 0.045, 0.36), (m.x, m.y, DESK_Z + 0.3), silver_, bevel=0.014, segs=3)
    scr, suv = screen("LCD", (m.x, m.y - 0.0235, DESK_Z + 0.305), 0.47, 0.294, tx("browser2005.png"), emit=1.6, glass=False)
    box("LCDNeck", (0.06, 0.04, 0.14), (m.x, m.y + 0.04, DESK_Z + 0.08), silver_, bevel=0.01)
    lathe("LCDFoot", [(0, 0), (0.12, 0), (0.12, 0.012), (0, 0.014)], (m.x, m.y + 0.04, DESK_Z), silver_).scale = (1.2, 0.8, 1)
    area((m.x, m.y - 0.3, DESK_Z + 0.3), (0.7, 0.8, 1.0), 6, (0.4, 0.3), rot=(math.radians(-90), 0, 0))
    kb = on_z(950, 850)
    box("Keyboard", (0.44, 0.15, 0.022), (kb.x, kb.y, DESK_Z + 0.011), solid("BlackPlastic", (0.03, 0.03, 0.035), 0.35), rot=(math.radians(-4), 0, 0), bevel=0.008)
    for r in range(5):
        for c in range(15):
            keycap(f"K{r}{c}", (kb.x - 0.195 + c * 0.0275, kb.y - 0.055 + r * 0.024, DESK_Z + 0.02), size=(0.02, 0.02), h=0.007, mat=solid("KeyB", (0.05, 0.05, 0.06), 0.4))
    ms = on_z(1180, 860)
    sphere("OpticalMouse", 0.032, (ms.x, ms.y, DESK_Z + 0.01), silver_, scale=(0.95, 1.5, 0.45))
    bb = on_z(1330, 860)
    box("Smartphone", (0.06, 0.11, 0.014), (bb.x, bb.y, DESK_Z + 0.007), solid("PhoneBody", (0.05, 0.05, 0.06), 0.3), rot=(0, 0, -0.3), bevel=0.006)
    screen("BBScreen", (bb.x, bb.y + 0.02, DESK_Z + 0.0145), 0.048, 0.04, tx("inbox.png"), emit=1.2, rot=(0, 0, -0.3))
    cd_ = on_z(700, 870)
    box("BankCard", (0.0856, 0.054, 0.0008), (cd_.x, cd_.y, DESK_Z + 0.0005), solid("CardBlue", (0.05, 0.12, 0.35), 0.3, 0.2), rot=(0, 0, 0.2), bevel=0.0004)
    box("Passport", (0.088, 0.125, 0.006), (cd_.x - 0.08, cd_.y + 0.06, DESK_Z + 0.003), cloth("PassportC", (0.25, 0.05, 0.06), sheen=0.2), rot=(0, 0, -0.15), bevel=0.002)
    volume_box((8.4, 6, 2.8), (0, 1.5, 1.45), 0.005, (0.8, 0.9, 1), 0.4)
    area((0.8, -1.5, 3.0), (0.6, 0.7, 0.9), 5, (3, 1), rot=(math.radians(40), 0, 0))
    dof((m.x, m.y, DESK_Z + 0.3))
    arc = [Vector((-9 + 20 * t, 40, 3 + 6 * math.sin(math.pi * t))) for t in [i / 10 for i in range(11)]]
    return {"network": stage_path(arc)}


# ───────────────────────── 2010s · cloud & mobile ─────────────────────────
def cloud():
    camera()
    floor = wood("LightOakFloor", (0.45, 0.35, 0.24), (0.62, 0.5, 0.36), 1.2, 0.45, 0.2, stretch=(1, 10, 1))
    wallm = noisy("WhiteWall", (0.8, 0.8, 0.78), rough=0.8, scale=8, bump=0.02)
    wall = room(4.6, wallm, floor, noisy("Ceil", (0.82, 0.82, 0.8), rough=0.9, scale=40, bump=0.1), 3.0)
    window_cut(wall, 0.6, 0.1, 6.0, 2.8, y=4.7)
    for i in range(-2, 3):
        box(f"Mullion{i}", (0.04, 0.08, 2.9), (0.6 + i * 1.5, 4.65, 1.5), solid("BlackAlu", (0.03, 0.03, 0.035), 0.3, 1.0), bevel=0.003)
    plane("Glazing", (6, 2.8), (0.6, 4.66, 1.5), glass_img_rough("Glazing", (0.92, 0.96, 1.0), 0.01), rot=(math.radians(90), 0, 0))
    plane("City", (70, 24), (4, 70, 8), image_mat("CityM", tx("city_night.png"), emit=0.8, rough=1), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.1, 0.12, 0.2)), (0.0, (0.35, 0.5, 0.75)), (0.2, (0.18, 0.32, 0.62)), (0.6, (0.06, 0.12, 0.3))], 1.3)
    # shelf with a plant and books on the left wall — lived-in, remote-work feel
    box("Shelf", (1.2, 0.25, 0.03), (-2.1, 4.45, 1.5), wood_rich("ShelfOak", "oaklight", size=(1.2, 0.25), dust=0.03), bevel=0.003)
    desk(wood_rich("PaleOak", "oaklight", tint=0.95, dust=0.03))
    lp = on_z(960, 790)
    alu = metal_worn("Aluminium", (0.74, 0.75, 0.77), 0.25)
    box("LaptopBase", (0.34, 0.235, 0.012), (lp.x, lp.y, DESK_Z + 0.006), alu, bevel=0.004)
    box("LaptopLid", (0.34, 0.008, 0.225), (lp.x, lp.y + 0.12, DESK_Z + 0.12), alu, rot=(math.radians(-12), 0, 0), bevel=0.004)
    scr, suv = screen("LaptopScreen", (lp.x, lp.y + 0.113, DESK_Z + 0.121), 0.3, 0.19, tx("videocall.png"), emit=1.5)
    scr.rotation_euler = (math.radians(90 - 12), 0, 0)
    bpy.context.view_layer.update()
    box("KeyDeck", (0.28, 0.1, 0.001), (lp.x, lp.y + 0.03, DESK_Z + 0.0125), solid("KeysBlack", (0.03, 0.03, 0.035), 0.5), bevel=0)
    ph_ = on_z(1280, 870)
    box("Phone", (0.07, 0.14, 0.008), (ph_.x, ph_.y, DESK_Z + 0.004), solid("PhoneBody", (0.1, 0.1, 0.11), 0.25, 0.8), rot=(0, 0, -0.25), bevel=0.006)
    screen("PhoneScreen", (ph_.x, ph_.y, DESK_Z + 0.0085), 0.064, 0.13, tx("phone_app.png"), emit=1.4, rot=(0, 0, -0.25))
    tb = on_z(660, 850)
    box("Tablet", (0.24, 0.17, 0.008), (tb.x, tb.y, DESK_Z + 0.004), solid("TabBody", (0.12, 0.12, 0.13), 0.3, 0.6), rot=(0, 0, 0.12), bevel=0.008)
    screen("TabletScreen", (tb.x, tb.y, DESK_Z + 0.0085), 0.22, 0.15, tx("dash_cloud.png"), emit=1.2, rot=(0, 0, 0.12))
    cp = on_z(1400, 760)
    lathe("Cup", [(0, 0), (0.035, 0), (0.042, 0.09), (0.039, 0.09), (0.033, 0.006), (0, 0.006)], (cp.x, cp.y, DESK_Z), noisy("Ceramic", (0.92, 0.92, 0.9), rough=0.12, scale=80, bump=0.01, coat=0.5), close_top=False)
    cyl("Coffee", 0.037, 0.002, (cp.x, cp.y, DESK_Z + 0.075), solid("Coffee", (0.08, 0.04, 0.02), 0.1))
    ep = on_z(1180, 900)
    box("EarbudCase", (0.05, 0.022, 0.04), (ep.x, ep.y, DESK_Z + 0.011), solid("WhiteGloss", (0.9, 0.9, 0.9), 0.15, coat=0.6), rot=(math.radians(90), 0, 0.3), bevel=0.01)
    nb = on_z(1160, 760)
    box("Notebook", (0.15, 0.21, 0.012), (nb.x, nb.y, DESK_Z + 0.006), cloth("NotebookC", (0.12, 0.13, 0.15), sheen=0.2), rot=(0, 0, 0.2), bevel=0.003)
    pl = on_z(560, 700)
    lathe("PlantPot", [(0, 0), (0.08, 0), (0.1, 0.2), (0, 0.2)], (pl.x, pl.y, DESK_Z), noisy("Terrazzo", (0.85, 0.83, 0.8), rough=0.5, scale=300, bump=0.1))
    rng = random.Random(4)
    for i in range(18):
        a = i * 2.4
        leaf = plane(f"Leaf{i}", (0.05, 0.3), (pl.x + math.cos(a) * 0.04, pl.y + math.sin(a) * 0.04, DESK_Z + 0.34), noisy("Leaf", (0.07, 0.22, 0.07), rough=0.45, scale=80, bump=0.1, sss=0.3), rot=(math.radians(15 + (i % 4) * 10), 0, a), subdiv=6)
        bend(leaf, math.radians(35 + rng.uniform(-10, 10)), "X")
    volume_box((8.4, 6, 2.9), (0, 1.5, 1.5), 0.004, (0.9, 0.95, 1), 0.4)
    area((0.6, 4.2, 1.5), (0.6, 0.75, 1.0), 120, (6, 2.5), rot=(math.radians(-90), 0, 0))
    area((0.8, -1.5, 3.0), (0.9, 0.9, 0.95), 14, (3, 1), rot=(math.radians(40), 0, 0))
    dof((lp.x, lp.y + 0.1, DESK_Z + 0.1))
    base = suv(0.5, 0.6)
    top = on_y(1250, 40, 4.0)
    pts = [base + (top - base) * t + Vector((0.25 * math.sin(t * math.pi), 0, 0)) for t in [i / 10 for i in range(11)]]
    return {"stream": stage_path(pts)}


# ───────────────────────── 2020–2025 · automation (too many systems) ─────────────────────────
def automation():
    camera()
    floor = noisy("DarkFloor", (0.05, 0.05, 0.06), rough=0.35, scale=4, bump=0.05, coat=0.2)
    wallm = noisy("DarkWall", (0.06, 0.065, 0.08), rough=0.8, scale=8, bump=0.02)
    room(4.4, wallm, floor, noisy("Ceil", (0.05, 0.05, 0.06), rough=0.9, scale=40, bump=0.1), 2.9)
    desk(wood_rich("SmokedOak", "walnut", tint=0.45, dust=0.02))
    tvs = ["dash_auto1.png", "login_crm.png", "dash_auto2.png", "kanban.png", "login_erp.png", "dash_auto3.png", "inbox.png", "chat.png", "dash_auto4.png", "sheet_modern.png", "login_bi.png", "dash_light.png", "login_hr.png", "dash_cloud.png"]
    k = 0
    rng = random.Random(3)
    for row, z in enumerate((1.2, 1.9, 2.55)):
        for c in range(-2, 5):
            x = c * 0.98 + (0.3 if row == 1 else 0) + rng.uniform(-0.05, 0.05)
            if x < -1.2 and row < 2:
                continue  # keep the text side calmer
            box(f"TVBezel{k}", (0.9, 0.035, 0.52), (x, 4.36, z), solid("TVBlack", (0.01, 0.01, 0.012), 0.3), bevel=0.005)
            screen(f"TV{k}", (x, 4.34, z), 0.86, 0.48, tx(tvs[k % len(tvs)]), emit=0.9 + rng.uniform(0, 0.4), glass=True)
            k += 1
    blk = solid("MonBlack", (0.015, 0.015, 0.018), 0.35)
    # three slim monitors pushed to the back edge, angled inward — each a different system
    monitors = ((1360, 648, 0.42, "login_crm.png", 0.46), (1010, 644, 0.0, "sheet_modern.png", 0.5), (660, 648, -0.42, "dash_auto3.png", 0.46))
    for i, (sx, sy, rz, tex_, w) in enumerate(monitors):
        mp = on_z(sx, sy)
        mp.y = max(mp.y, DB - 0.16)
        h = w * 0.58
        zc = DESK_Z + 0.2 + h / 2
        box(f"Mon{i}", (w, 0.022, h), (mp.x, mp.y, zc), blk, rot=(0, 0, rz), bevel=0.004)
        nx, ny = math.sin(rz), -math.cos(rz)
        screen(f"MonScr{i}", (mp.x + nx * 0.0125, mp.y + ny * 0.0125, zc + 0.006), w - 0.02, h - 0.03, tx(tex_), emit=1.4, rot=(math.radians(90), 0, rz))
        cyl(f"MonNeck{i}", 0.014, 0.2, (mp.x - nx * 0.05, mp.y - ny * 0.05, DESK_Z + 0.1), metal_worn("NeckAlu", (0.5, 0.51, 0.53), 0.3))
        box(f"MonFoot{i}", (0.2, 0.15, 0.008), (mp.x - nx * 0.05, mp.y - ny * 0.05, DESK_Z + 0.004), metal_worn("FootAlu", (0.5, 0.51, 0.53), 0.3), rot=(0, 0, rz), bevel=0.003)
        # sticky notes stuck on the bezel: passwords, reminders, workarounds
        for k in range(2 if i != 1 else 1):
            off = (-0.5 + k) * (w - 0.06)
            sx_, sy_ = mp.x + math.cos(rz) * off + nx * 0.013, mp.y + math.sin(rz) * off + ny * 0.013
            plane(f"BezelNote{i}{k}", (0.06, 0.06), (sx_, sy_, zc - h / 2 + 0.02), paper_rich(f"BNM{i}{k}", tx(["sticky.png", "sticky2.png", "sticky3.png"][(i + k) % 3])), rot=(math.radians(90 - 6), 0, rz + (k - 0.5) * 0.3))
    # laptop front-left, tablet and two phones front-right, all lit with different tools
    lp = on_z(780, 800)
    alu = metal_worn("SpaceGrey", (0.3, 0.31, 0.33), 0.28)
    lap_rz = -0.25
    box("LaptopBase", (0.32, 0.22, 0.012), (lp.x, lp.y, DESK_Z + 0.006), alu, rot=(0, 0, lap_rz), bevel=0.004)
    hx, hy = lp.x - math.sin(lap_rz) * 0.11, lp.y + math.cos(lap_rz) * 0.11
    box("LaptopLid", (0.32, 0.007, 0.21), (hx, hy, DESK_Z + 0.11), alu, rot=(math.radians(-12), 0, lap_rz), bevel=0.004)
    scr, suv = screen("LaptopScreen", (hx + math.sin(lap_rz) * 0.006, hy - math.cos(lap_rz) * 0.006, DESK_Z + 0.112), 0.29, 0.18, tx("inbox.png"), emit=1.4, rot=(math.radians(78), 0, lap_rz))
    tb = on_z(1180, 860)
    box("Tablet", (0.24, 0.17, 0.008), (tb.x, tb.y, DESK_Z + 0.004), solid("TabBody", (0.08, 0.08, 0.09), 0.3, 0.6), rot=(0, 0, 0.14), bevel=0.008)
    screen("TabletScreen", (tb.x, tb.y, DESK_Z + 0.0085), 0.22, 0.15, tx("kanban.png"), emit=1.1, rot=(0, 0, 0.14))
    for i, (sx, sy, rz, tex_) in enumerate(((1420, 830, 0.35, "phone_notif.png"), (960, 890, -0.1, "chat.png"))):
        pp = on_z(sx, sy)
        box(f"Phone{i}", (0.072, 0.15, 0.008), (pp.x, pp.y, DESK_Z + 0.004), solid("PhoneBody", (0.05, 0.05, 0.06), 0.25, 0.8), rot=(0, 0, rz), bevel=0.006)
        screen(f"PhoneScreen{i}", (pp.x, pp.y, DESK_Z + 0.0085), 0.066, 0.14, tx(tex_), emit=1.6, rot=(0, 0, rz))
    for i in range(6):
        sx, sy = rng.uniform(560, 1440), rng.uniform(740, 930)
        paper_on_desk(f"Sticky{i}", sx, sy, 0.075, 0.075, tx(rng.choice(["sticky.png", "sticky2.png", "sticky3.png"])), rotz=rng.uniform(-0.5, 0.5), z=0.0002 * i)
    paper_on_desk("Printout", 1300, 760, 0.21, 0.28, tx("sheet_modern.png"), rotz=0.3, z=0.0)
    cm = on_z(560, 700)
    lathe("Mug", [(0, 0), (0.042, 0), (0.044, 0.1), (0.04, 0.1), (0.038, 0.006), (0, 0.006)], (cm.x, cm.y, DESK_Z), solid("MugM", (0.75, 0.76, 0.78), 0.25, coat=0.6))
    volume_box((8.4, 6, 2.8), (0, 1.5, 1.45), 0.01, (0.8, 0.85, 1), 0.4)
    area((0.8, -1.5, 3.0), (0.5, 0.6, 1.0), 4, (3, 1), rot=(math.radians(40), 0, 0))
    area((0.6, 3.5, 2.7), (0.35, 0.45, 1.0), 25, (6, 1), rot=(0, 0, 0))
    area((0.2, 2.2, 2.8), (0.55, 0.62, 0.85), 30, (3.5, 1.2), rot=(0, 0, 0), name="Fill")
    dof((0.0, DB - 0.2, DESK_Z + 0.3), fstop=3.5)
    return {}


ERAS = {
    "centuries-printed": printed,
    "centuries-accountbook": accountbook,
    "paper": paper,
    "mechanical": mechanical,
    "enterprise": enterprise,
    "internet": internet,
    "cloud": cloud,
    "automation": automation,
}

if __name__ == "__main__":
    args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
    era = args["era"]
    res = tuple(int(v) for v in args.get("res", "1920x1080").split("x"))
    samples = int(args.get("samples", 64))
    out = args.get("out", f"/home/claude/render/final3/{era}.png")
    reset(res, samples)
    paths = ERAS[era]()
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(paths, open(out.replace(".png", ".json"), "w"))
    lib.render(out)
    print("rendered", out, paths)
