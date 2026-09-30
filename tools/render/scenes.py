"""Era plates after the prologue. Usage:
   python scenes.py -- era=<id> res=1600x900 samples=48
Each era builds on the same desk and camera (lib.camera), records thread paths in stage space, and renders.
"""
import sys, os, math, json, random
sys.path.insert(0, os.path.dirname(__file__))
import lib
from lib import *
from common_props import *

T = lib.TEX
anchors = json.load(open(os.path.join(T, "anchors.json")))


def tx(n):
    return os.path.join(T, n)


# ───────────────────────── c.1750 · printed page ─────────────────────────
def printed():
    camera(fstop=4.0, focus=1.2)
    plaster = noisy("Plaster", (0.42, 0.44, 0.36), var=0.05, rough=0.9, scale=8, bump=0.08)
    oak = wood("Oak", (0.16, 0.09, 0.045), (0.32, 0.2, 0.1), 2.0, 0.45, 0.15, stretch=(6, 1, 1), distortion=4)
    mahog = wood("Mahogany", (0.09, 0.03, 0.015), (0.25, 0.08, 0.04), 2.4, 0.3, 0.5)
    floor = wood("Boards", (0.12, 0.07, 0.035), (0.25, 0.15, 0.08), 1.2, 0.6, 0.1, stretch=(1, 10, 1))
    wall = room(4.0, plaster, floor, noisy("CeilP", (0.5, 0.49, 0.45), rough=0.95, scale=5, bump=0.05), 3.4)
    desk(mahog)
    panels(-4.3, 4.3, 4.0, 0.0, 0.95, oak, 14)
    # sash window (where the arch stood) with small panes, evening outside
    window_cut(wall, 0.0, 0.95, 1.3, 1.9, y=4.1)
    mullions(0.0, 4.08, 0.95, 1.3, 1.9, 3, 4, solid("WinPaint", (0.75, 0.72, 0.64), 0.6))
    glass_p = glass("OldGlass", (0.95, 0.97, 0.95), 0.05)
    plane("Pane", (1.3, 1.9), (0, 4.1, 1.9), glass_p, rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.2, 0.18, 0.2)), (0.0, (0.95, 0.55, 0.3)), (0.08, (0.5, 0.35, 0.45)), (0.3, (0.12, 0.14, 0.3)), (0.8, (0.03, 0.04, 0.1))], 1.0)
    card("Rooftops", tx("baghdad_skyline.png"), 8, (1, 40, 2.2))
    # curtains
    for side in (-1, 1):
        cur = plane(f"Curtain{side}", (0.55, 2.4), (side * 0.95, 3.95, 1.9), noisy("Damask", (0.32, 0.08, 0.06), var=0.15, rough=0.8, scale=40, bump=0.3, sheen=0.6), rot=(math.radians(90), 0, 0), subdiv=24)
        md = cur.modifiers.new("wave", "WAVE")
        md.use_x, md.use_y = True, False
        md.height, md.width, md.narrowness = 0.05, 0.12, 1.2
        cur.modifiers.new("sol", "SOLIDIFY").thickness = 0.01
    # painting of a merchant ship (left), bookcase (right)
    frame_ = brass("Gilt", (0.7, 0.52, 0.22), 0.35)
    box("PaintFrame", (1.0, 0.05, 0.75), (-2.1, 3.96, 1.95), frame_, bevel=0.01)
    plane("Painting", (0.88, 0.63), (-2.1, 3.93, 1.95), noisy("Canvas", (0.2, 0.24, 0.26), var=0.3, rough=0.7, scale=6, bump=0.2), rot=(math.radians(90), 0, 0))
    box("Bookcase", (1.2, 0.4, 2.3), (2.4, 3.75, 1.15), oak, bevel=0.01)
    rng = random.Random(4)
    for sh in range(4):
        z = 0.35 + sh * 0.5
        x = 1.9
        while x < 2.9:
            bw = rng.uniform(0.03, 0.06)
            box("Book", (bw, 0.25, rng.uniform(0.25, 0.36)), (x, 3.6, z + 0.16), noisy(f"B{sh}{x}", rng.choice([(0.25, 0.06, 0.04), (0.08, 0.12, 0.08), (0.3, 0.2, 0.1), (0.1, 0.08, 0.15)]), rough=0.6, scale=80, bump=0.2), bevel=0.004)
            x += bw + 0.003
    # desk: printed price current, quill & inkstand, argand oil lamp, sealing wax, watch
    paper_sheet("Printed", [(860, 740), (1060, 740), (1085, 900), (830, 900)], tx("printed1750.png"))
    lp = on_z(1310, 710)
    b = brass()
    lathe("LampBase", [(0, 0), (0.07, 0), (0.07, 0.01), (0.03, 0.03), (0.018, 0.2), (0.05, 0.24), (0.055, 0.28), (0.02, 0.3), (0, 0.3)], (lp.x, lp.y, DESK_Z), b)
    lathe("Chimney", [(0.025, 0), (0.028, 0.03), (0.032, 0.06), (0.02, 0.12), (0.018, 0.2)], (lp.x, lp.y, DESK_Z + 0.3), glass("ChimGlass", (1, 0.98, 0.95), 0.01), close_top=False, close_bottom=False)
    sphere("LampFlame", 0.01, (lp.x, lp.y, DESK_Z + 0.33), emission("LampFlameM", (1, 0.6, 0.25), 40), scale=(1, 1, 2.2)).visible_shadow = False
    point((lp.x, lp.y, DESK_Z + 0.34), (1.0, 0.62, 0.3), 40, 0.02, "LampLight")
    area((0.1, 0.05, DESK_Z + 0.9), (1.0, 0.75, 0.5), 8, (0.6, 0.4), rot=(0, 0, 0))
    ip = on_z(1170, 760)
    box("Inkstand", (0.2, 0.12, 0.02), (ip.x, ip.y, DESK_Z + 0.01), solid("Pewter", (0.5, 0.5, 0.48), 0.35, 1.0), bevel=0.004)
    for dx in (-0.05, 0.05):
        lathe(f"InkPot{dx}", [(0, 0), (0.025, 0), (0.028, 0.04), (0.012, 0.05), (0, 0.05)], (ip.x + dx, ip.y, DESK_Z + 0.02), glass("InkGlass", (0.4, 0.45, 0.5), 0.05))
    wp = on_z(760, 880)
    cyl("Watch", 0.025, 0.012, (wp.x, wp.y, DESK_Z + 0.006), gold(), bevel=0.003)
    cyl("WatchFace", 0.021, 0.001, (wp.x, wp.y, DESK_Z + 0.0125), solid("Enamel", (0.9, 0.88, 0.82), 0.2))
    sw = on_z(1150, 900)
    box("SealWax", (0.1, 0.012, 0.012), (sw.x, sw.y, DESK_Z + 0.006), solid("RedWax", (0.5, 0.03, 0.02), 0.35), rot=(0, 0, 0.3), bevel=0.002)
    coin_stack((wp.x + 0.08, wp.y - 0.02, DESK_Z), 3, r=0.016, mat=silver(), seed=9)
    volume_box((8.4, 5.6, 3.3), (0, 1.2, 1.7), 0.01, (1, 0.9, 0.8), 0.5)
    area((0, 3.6, 1.9), (1.0, 0.6, 0.4), 20, (1.2, 1.8), rot=(math.radians(-90), 0, 0))
    area((0.8, -1.5, 3.0), (0.6, 0.62, 0.75), 5, (3, 1), rot=(math.radians(40), 0, 0))
    ln = [on_z(x, 900 - 45, DESK_Z + 0.002) for x in (1045, 900)]
    return {"ledger": stage_path([ln[0], ln[1]])}


# ───────────────────────── c.1880 · account book ─────────────────────────
def accountbook():
    camera(fstop=4.0, focus=1.2)
    panel_w = wood("DarkOak", (0.07, 0.04, 0.02), (0.16, 0.09, 0.045), 2.0, 0.4, 0.3, stretch=(6, 1, 1), distortion=4)
    paper_wall = noisy("Wallpaper", (0.2, 0.17, 0.12), var=0.1, rough=0.85, scale=30, bump=0.05)
    floor = wood("Parquet", (0.1, 0.06, 0.03), (0.22, 0.13, 0.06), 1.5, 0.45, 0.2)
    wall = room(4.0, paper_wall, floor, noisy("Ceil", (0.3, 0.27, 0.22), rough=0.95, scale=5, bump=0.05), 3.4)
    desk(wood("Walnut", (0.06, 0.03, 0.016), (0.18, 0.1, 0.05), 2.2, 0.35, 0.45))
    panels(-4.3, 4.3, 4.0, 0.0, 1.2, panel_w, 12)
    window_cut(wall, 0.2, 1.1, 1.1, 2.0, y=4.1)
    mullions(0.2, 4.08, 1.1, 1.1, 2.0, 2, 2, panel_w, bar=0.04)
    plane("Pane", (1.1, 2.0), (0.2, 4.12, 2.1), glass("Glass", (0.95, 0.97, 1), 0.02), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.02, 0.02, 0.03)), (0.0, (0.1, 0.1, 0.14)), (0.3, (0.03, 0.04, 0.08)), (0.8, (0.01, 0.01, 0.03))], 1.0)
    # gas-lit street beyond: warm lamps, facades
    card("Street", tx("city_night.png"), 7, (0.5, 30, 1.2), emit=0.25)
    # gas sconces
    for x in (-1.3, 1.7):
        box(f"SconceArm{x}", (0.03, 0.25, 0.03), (x, 3.87, 1.95), brass(), bevel=0.005)
        g = sphere(f"Globe{x}", 0.08, (x, 3.75, 2.0), emission("GasGlobe", (1.0, 0.72, 0.4), 6))
        point((x, 3.7, 2.0), (1.0, 0.68, 0.35), 70, 0.08, "Gas")
    # iron safe (right) & coat stand (left)
    sf = box("Safe", (0.7, 0.6, 0.9), (2.5, 3.5, 0.45), noisy("SafeIron", (0.08, 0.1, 0.08), rough=0.4, scale=20, bump=0.05, metal=0.6), bevel=0.02)
    cyl("SafeDial", 0.06, 0.02, (2.5, 3.19, 0.6), brass(), rot=(math.radians(90), 0, 0))
    # desk: open account book, dip pen, glass inkwell, blotter, spectacles-free
    ab_c = on_z(960, 815)
    book, uv2w = open_book("AccountBook", (ab_c.x, ab_c.y), 0.46, 0.3, tx("accountbook1880.png"), noisy("Cloth", (0.12, 0.05, 0.04), rough=0.6, scale=90, bump=0.3))
    bp = on_z(1220, 880)
    box("Blotter", (0.36, 0.26, 0.01), (bp.x, bp.y, DESK_Z + 0.005), noisy("Felt", (0.08, 0.2, 0.12), rough=0.95, scale=200, bump=0.2), bevel=0.003)
    ip = on_z(1230, 740)
    lathe("InkGlass", [(0, 0), (0.035, 0), (0.038, 0.04), (0.015, 0.055), (0.015, 0.065), (0, 0.065)], (ip.x, ip.y, DESK_Z), glass("CutGlass", (0.95, 0.97, 1), 0.03))
    cyl("Ink", 0.03, 0.02, (ip.x, ip.y, DESK_Z + 0.012), solid("Ink", (0.01, 0.01, 0.02), 0.05))
    cyl("DipPen", 0.0035, 0.18, (ip.x - 0.12, ip.y + 0.02, DESK_Z + 0.004), solid("PenWood", (0.05, 0.03, 0.02), 0.3), rot=(0, math.radians(90), math.radians(-30)))
    lp = on_z(1330, 690)
    lathe("DeskLampBase", [(0, 0), (0.08, 0), (0.07, 0.02), (0.02, 0.04), (0.02, 0.32), (0, 0.32)], (lp.x, lp.y, DESK_Z), brass())
    sphere("LampGlobe", 0.05, (lp.x, lp.y, DESK_Z + 0.36), emission("LampGlobeM", (1, 0.75, 0.45), 3), scale=(1, 1, 1.2))
    point((lp.x, lp.y, DESK_Z + 0.38), (1, 0.7, 0.4), 30, 0.07, "DeskGas")
    volume_box((8.4, 5.6, 3.3), (0, 1.2, 1.7), 0.008, (1, 0.9, 0.8), 0.5)
    area((0.8, -1.5, 3.0), (0.6, 0.62, 0.75), 4, (3, 1), rot=(math.radians(40), 0, 0))
    v = 1 - (178 + 10 * 44 + 2) / 1600
    return {"ledger": stage_path([uv2w(0.96, v), uv2w(0.55, v)])}


# ───────────────────────── c.1400 · ledger (handled in abbasid.py variant=ledger) ─────────────────────────


# ───────────────────────── 1920s · the paper system ─────────────────────────
def paper():
    camera(fstop=4.5, focus=1.2)
    plaster = noisy("Plaster", (0.55, 0.48, 0.37), var=0.05, rough=0.9, scale=8, bump=0.06)
    oak = wood("Oak", (0.12, 0.07, 0.035), (0.28, 0.17, 0.08), 2.0, 0.4, 0.2, stretch=(6, 1, 1), distortion=4)
    floor = wood("Floor", (0.1, 0.06, 0.03), (0.22, 0.13, 0.06), 1.2, 0.55, 0.15, stretch=(1, 10, 1))
    wall = room(4.0, plaster, floor, noisy("Ceil", (0.6, 0.57, 0.5), rough=0.95, scale=5, bump=0.05), 3.3)
    desk(wood("DeskOak", (0.13, 0.075, 0.035), (0.3, 0.18, 0.085), 2.2, 0.35, 0.35))
    panels(-4.3, 4.3, 4.0, 0.0, 1.05, oak, 12)
    # tall window, afternoon sun
    window_cut(wall, 0.9, 1.05, 1.3, 1.9, y=4.1)
    mullions(0.9, 4.08, 1.05, 1.3, 1.9, 3, 3, oak, bar=0.035)
    plane("Pane", (1.3, 1.9), (0.9, 4.12, 2.0), glass("Glass", (0.97, 0.98, 1), 0.02), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.6, 0.55, 0.45)), (0.0, (0.95, 0.85, 0.65)), (0.3, (0.6, 0.72, 0.9)), (0.8, (0.35, 0.5, 0.8))], 1.4)
    card("Buildings", tx("baghdad_skyline.png"), 10, (0, 60, 3.0))
    sun((math.radians(-62), 0, math.radians(-28)), (1.0, 0.82, 0.6), 6.0, angle=1.0)
    # frosted door with a manager's silhouette beyond
    dx = -1.55
    window_cut(wall, dx, 0.0, 0.9, 2.2, y=4.1)
    box("DoorLower", (0.9, 0.05, 1.05), (dx, 4.08, 0.525), oak, bevel=0.006)
    box("DoorTop", (0.9, 0.05, 0.12), (dx, 4.08, 2.14), oak, bevel=0.006)
    for s_ in (-1, 1):
        box(f"DoorStile{s_}", (0.1, 0.05, 1.05), (dx + s_ * 0.4, 4.08, 1.6), oak, bevel=0.006)
    plane("Frosted", (0.7, 1.0), (dx, 4.08, 1.58), glass("Frosted", (0.95, 0.94, 0.9), 0.35), rot=(math.radians(90), 0, 0))
    card("Manager", tx("person_fedora.png"), 1.8, (dx + 0.05, 4.6, 0.9))
    area((dx, 5.2, 1.6), (1, 0.85, 0.65), 60, (1.5, 2), rot=(math.radians(-90), 0, 0))
    box("OutsideHall", (3, 0.1, 3), (dx, 5.6, 1.5), plaster, bevel=0)
    # wall clock
    ck = on_y(1180, 150, 3.95)
    cyl("ClockBody", 0.2, 0.06, (ck.x, 3.95, ck.z), oak, rot=(math.radians(90), 0, 0), bevel=0.01)
    plane("ClockFace", (0.34, 0.34), (ck.x, 3.915, ck.z), image_mat("ClockFaceM", tx("clock.png"), rough=0.3), rot=(math.radians(90), 0, 0))
    # oak filing cabinet (right)
    fx = 2.45
    box("Cabinet", (0.7, 0.65, 1.45), (fx, 3.6, 0.725), oak, bevel=0.008)
    for i in range(4):
        box(f"Drawer{i}", (0.62, 0.02, 0.3), (fx, 3.27, 0.2 + i * 0.34), oak, bevel=0.01)
        box(f"Handle{i}", (0.14, 0.02, 0.025), (fx, 3.255, 0.28 + i * 0.34), brass(), bevel=0.005)
        plane(f"Label{i}", (0.1, 0.05), (fx, 3.253, 0.33 + i * 0.34), solid("Card", (0.9, 0.87, 0.78), 0.8), rot=(math.radians(90), 0, 0))
    card("Clerk", tx("person_hair.png"), 1.72, (1.95, 3.3, 0.86))
    # coat stand (left, in shadow)
    cyl("CoatStand", 0.02, 1.8, (-2.7, 3.4, 0.9), oak)
    sphere("Hat", 0.14, (-2.7, 3.4, 1.8), noisy("Felt", (0.1, 0.09, 0.08), rough=0.9, scale=90, bump=0.3), scale=(1.1, 1, 0.45))
    # desk objects
    ab_c = on_z(960, 815)
    book, uv2w = open_book("Ledger", (ab_c.x, ab_c.y), 0.48, 0.32, tx("ledger1924.png"), noisy("Cloth", (0.1, 0.14, 0.1), rough=0.6, scale=90, bump=0.3))
    lp = on_z(1300, 700)
    b = brass()
    lathe("BankLampBase", [(0, 0), (0.09, 0), (0.09, 0.015), (0.04, 0.03), (0.012, 0.04), (0.012, 0.3), (0, 0.3)], (lp.x, lp.y, DESK_Z), b)
    shade = lathe("BankShade", [(0.005, 0.0), (0.03, 0.01), (0.08, 0.05), (0.11, 0.08)], (lp.x, lp.y, DESK_Z + 0.38), solid("GreenGlass", (0.03, 0.22, 0.09), 0.12, coat=1.0, emit=(0.1, 0.7, 0.3), emit_str=0.8), rot=(math.radians(180), 0, 0), close_top=False, close_bottom=False)
    shade.scale = (1.9, 1, 1)
    shade.modifiers.new("sol", "SOLIDIFY").thickness = 0.004
    lathe("ShadeInner", [(0.005, 0.0), (0.03, 0.009), (0.078, 0.048), (0.106, 0.077)], (lp.x, lp.y, DESK_Z + 0.378), solid("ShadeWhite", (0.95, 0.9, 0.8), 0.5), rot=(math.radians(180), 0, 0), close_top=False, close_bottom=False).scale = (1.9, 1, 1)
    cyl("Bulb", 0.012, 0.18, (lp.x, lp.y, DESK_Z + 0.33), emission("BulbM", (1, 0.8, 0.55), 30), rot=(0, math.radians(90), 0)).visible_shadow = False
    spot((lp.x, lp.y, DESK_Z + 0.33), (1.0, 0.78, 0.5), 25, (0, 0, 0), angle=120, blend=0.8, radius=0.05, name="BankerSpot")
    fp = on_z(700, 800)
    rng = random.Random(2)
    for i in range(5):
        box(f"Folder{i}", (0.32, 0.24, 0.006), (fp.x + rng.uniform(-0.01, 0.01), fp.y, DESK_Z + 0.003 + i * 0.008), noisy(f"Manila{i}", (0.72, 0.58, 0.36), rough=0.85, scale=50, bump=0.1), rot=(0, 0, rng.uniform(-0.06, 0.06)), bevel=0.001)
    sp = on_z(610, 900)
    cyl("SpikeBase", 0.035, 0.012, (sp.x, sp.y, DESK_Z + 0.006), solid("Iron", (0.05, 0.05, 0.05), 0.4, 1.0))
    cyl("Spike", 0.002, 0.15, (sp.x, sp.y, DESK_Z + 0.08), solid("Steel", (0.6, 0.6, 0.6), 0.3, 1.0))
    for i in range(4):
        box(f"Invoice{i}", (0.1, 0.13, 0.001), (sp.x, sp.y, DESK_Z + 0.02 + i * 0.01), solid("InvPaper", (0.88, 0.85, 0.76), 0.8), rot=(0, 0, rng.uniform(-0.4, 0.4)), bevel=0)
    st = on_z(1200, 900)
    box("StampPad", (0.12, 0.08, 0.015), (st.x + 0.08, st.y, DESK_Z + 0.0075), solid("Tin", (0.15, 0.15, 0.17), 0.4, 0.8), bevel=0.003)
    cyl("StampHandle", 0.015, 0.07, (st.x, st.y, DESK_Z + 0.05), wood("Handle", (0.1, 0.05, 0.02), (0.2, 0.1, 0.05)))
    box("StampBase", (0.06, 0.035, 0.015), (st.x, st.y, DESK_Z + 0.0075), wood("Handle2", (0.1, 0.05, 0.02), (0.2, 0.1, 0.05)), bevel=0.002)
    pp = on_z(1110, 760)
    cyl("FountainPen", 0.006, 0.14, (pp.x, pp.y, DESK_Z + 0.006), solid("Bakelite", (0.02, 0.02, 0.02), 0.15), rot=(0, math.radians(90), math.radians(-25)))
    volume_box((8.4, 5.6, 3.2), (0, 1.2, 1.65), 0.018, (1, 0.92, 0.82), 0.55)
    area((0.8, -1.5, 3.0), (0.7, 0.72, 0.8), 6, (3, 1), rot=(math.radians(40), 0, 0))
    v = 1 - (178 + 12 * 44 + 2) / 1600
    return {"ledger": stage_path([uv2w(0.96, v), uv2w(0.54, v)])}


# ───────────────────────── 1950s · the mechanical office ─────────────────────────
def typewriter(center, texpath):
    """Mid-century manual typewriter facing the viewer; returns uv→world of the paper."""
    cx, cy = center
    body_m = noisy("TWBody", (0.12, 0.2, 0.17), var=0.04, rough=0.35, scale=40, bump=0.03, coat=0.4)
    chrome = solid("Chrome", (0.8, 0.8, 0.8), 0.15, 1.0)
    black = solid("BlackEnamel", (0.02, 0.02, 0.02), 0.25)
    z = DESK_Z
    # base & body (trapezoid-ish via stacked boxes)
    box("TWBase", (0.44, 0.34, 0.05), (cx, cy, z + 0.025), body_m, bevel=0.015, segs=3)
    body = box("TWBody", (0.4, 0.22, 0.09), (cx, cy + 0.05, z + 0.095), body_m, bevel=0.03, segs=4)
    box("TWDeck", (0.36, 0.14, 0.03), (cx, cy - 0.07, z + 0.06), body_m, rot=(math.radians(-12), 0, 0), bevel=0.01)
    # carriage & platen
    cyl("Platen", 0.022, 0.46, (cx, cy + 0.12, z + 0.16), black, rot=(0, math.radians(90), 0))
    for s_ in (-1, 1):
        cyl(f"Knob{s_}", 0.028, 0.03, (cx + s_ * 0.25, cy + 0.12, z + 0.16), black, rot=(0, math.radians(90), 0))
    box("CarriageRail", (0.5, 0.02, 0.02), (cx, cy + 0.16, z + 0.14), chrome, bevel=0.004)
    lever = cyl("ReturnLever", 0.004, 0.09, (cx - 0.28, cy + 0.08, z + 0.19), chrome, rot=(0, math.radians(70), math.radians(20)))
    # keys: 4 rows of round caps
    key_m = noisy("KeyCap", (0.9, 0.88, 0.82), rough=0.3, scale=90, bump=0.02)
    for r in range(4):
        n = 11 - (r == 3) * 1
        for k in range(n):
            x = cx - 0.15 + k * 0.03 + r * 0.008
            y = cy - 0.12 + r * 0.03
            zz = z + 0.07 + r * 0.012
            cyl(f"Key{r}_{k}", 0.009, 0.006, (x, y, zz), key_m, bevel=0.002)
            cyl(f"KeyStem{r}_{k}", 0.0025, 0.03, (x, y + 0.004, zz - 0.015), chrome)
    box("SpaceBar", (0.2, 0.014, 0.008), (cx, cy - 0.15, z + 0.065), chrome, bevel=0.003)
    # paper sheet rising from the platen
    pw, ph = 0.215, 0.26
    pap = plane("TypedSheet", (pw, ph), (cx, cy + 0.15, z + 0.16 + ph / 2 - 0.02), image_mat("TypedM", texpath, rough=0.8), rot=(math.radians(97), 0, 0), subdiv=10)
    bend(pap, math.radians(6), "X")
    bpy.context.view_layer.update()
    def uv2w(u, v):
        return pap.matrix_world @ Vector(((u - 0.5) * pw, (v - 0.5) * ph, 0.001))
    return uv2w


def mechanical():
    camera(fstop=4.5, focus=1.15)
    paint = noisy("GreenPaint", (0.38, 0.42, 0.36), var=0.04, rough=0.8, scale=10, bump=0.04)
    lino = noisy("Linoleum", (0.25, 0.22, 0.18), var=0.08, rough=0.4, scale=6, bump=0.05)
    wall = room(4.0, paint, lino, noisy("AcousticTile", (0.75, 0.74, 0.7), rough=0.95, scale=60, bump=0.3), 3.0)
    lam = noisy("Laminate", (0.28, 0.24, 0.2), var=0.05, rough=0.35, scale=20, bump=0.02, coat=0.3)
    desk(lam)
    box("DeskEdge", (3.2, 0.03, 0.05), (0, lib.DESK_BACK - 0.01, DESK_Z - 0.025), solid("SteelEdge", (0.6, 0.6, 0.6), 0.25, 1.0), bevel=0.004)
    # venetian blinds window with raking sun
    wx = 0.95
    window_cut(wall, wx, 0.9, 1.6, 1.7, y=4.1)
    mullions(wx, 4.08, 0.9, 1.6, 1.7, 2, 1, solid("MetalFrame", (0.5, 0.5, 0.48), 0.4, 0.7))
    slat_m = solid("Slat", (0.85, 0.83, 0.77), 0.5)
    for i in range(34):
        box(f"Slat{i}", (1.6, 0.05, 0.004), (wx, 3.98, 0.95 + i * 0.049), slat_m, rot=(math.radians(35), 0, 0), bevel=0)
    gradient_sky([(-0.2, (0.6, 0.6, 0.55)), (0.0, (0.9, 0.9, 0.85)), (0.5, (0.6, 0.72, 0.9))], 1.6)
    sun((math.radians(-58), 0, math.radians(-22)), (1.0, 0.9, 0.75), 7.0, angle=0.8)
    # org chart & clock
    oc = on_y(700, 150, 3.97)
    box("OrgFrame", (0.95, 0.03, 0.65), (oc.x, 3.98, oc.z), solid("BlackFrame", (0.03, 0.03, 0.03), 0.4), bevel=0.006)
    plane("OrgChart", (0.88, 0.58), (oc.x, 3.96, oc.z), image_mat("OrgM", tx("orgchart.png"), rough=0.6), rot=(math.radians(90), 0, 0))
    ck = on_y(980, 120, 3.95)
    cyl("Clock", 0.17, 0.05, (ck.x, 3.96, ck.z), solid("ClockRim", (0.7, 0.7, 0.7), 0.3, 1.0), rot=(math.radians(90), 0, 0), bevel=0.008)
    plane("ClockFace", (0.3, 0.3), (ck.x, 3.93, ck.z), image_mat("ClockFaceM", tx("clock.png"), rough=0.3), rot=(math.radians(90), 0, 0))
    # grey steel filing cabinets
    steel = noisy("GreySteel", (0.36, 0.37, 0.36), rough=0.35, scale=20, bump=0.02, metal=0.3, coat=0.3)
    for i, fx in enumerate((2.3, 2.85)):
        box(f"Steel{i}", (0.52, 0.65, 1.35), (fx, 3.6, 0.675), steel, bevel=0.01)
        for k in range(4):
            box(f"SD{i}{k}", (0.46, 0.02, 0.3), (fx, 3.27, 0.18 + k * 0.32), steel, bevel=0.008)
            box(f"SH{i}{k}", (0.12, 0.02, 0.02), (fx, 3.255, 0.28 + k * 0.32), solid("ChromeH", (0.8, 0.8, 0.8), 0.15, 1.0), bevel=0.004)
    # typing pool beyond a glazed partition (left)
    for i, (px, py) in enumerate(((-2.4, 5.4), (-1.6, 5.8), (-0.9, 5.6))):
        card(f"Typist{i}", tx("person_hair.png"), 1.3, (px, py, 0.65))
        box(f"TDesk{i}", (0.9, 0.5, 0.05), (px, py - 0.4, 0.72), lam, bevel=0.005)
    plane("Partition", (3.2, 1.6), (-1.8, 4.05, 1.95), glass("Ribbed", (0.95, 0.97, 0.97), 0.25), rot=(math.radians(90), 0, 0))
    window_cut(wall, -1.8, 1.15, 3.2, 1.6, y=4.1)
    box("PoolFloor", (5, 4, 0.05), (-1.8, 6.0, -0.025), lino, bevel=0)
    box("PoolWall", (5, 0.1, 3), (-1.8, 7.5, 1.5), paint, bevel=0)
    area((-1.8, 6.0, 2.9), (0.9, 0.95, 1.0), 35, (3, 2), rot=(0, 0, 0))
    # desk: typewriter, rotary phone, adding machine, punch cards, desk lamp
    tw = on_z(960, 700)
    uv2w = typewriter((tw.x, tw.y), tx("typed1957.png"))
    ph_ = on_z(1400, 740)
    black = solid("Bakelite", (0.015, 0.015, 0.015), 0.18)
    lathe("PhoneBody", [(0, 0), (0.1, 0), (0.1, 0.02), (0.085, 0.07), (0.05, 0.09), (0, 0.095)], (ph_.x, ph_.y, DESK_Z), black).scale = (1, 0.9, 1)
    cyl("Dial", 0.045, 0.006, (ph_.x, ph_.y - 0.06, DESK_Z + 0.075), solid("DialChrome", (0.75, 0.75, 0.75), 0.2, 1.0), rot=(math.radians(-40), 0, 0), bevel=0.001)
    cyl("DialCenter", 0.02, 0.008, (ph_.x, ph_.y - 0.062, DESK_Z + 0.077), solid("DialPaper", (0.9, 0.88, 0.8), 0.6), rot=(math.radians(-40), 0, 0))
    cyl("Handset", 0.022, 0.22, (ph_.x, ph_.y + 0.01, DESK_Z + 0.12), black, rot=(0, math.radians(90), 0))
    for s_ in (-1, 1):
        sphere(f"Ear{s_}", 0.032, (ph_.x + s_ * 0.1, ph_.y + 0.01, DESK_Z + 0.115), black, scale=(1, 1, 0.7))
    am = on_z(560, 745)
    box("AddMach", (0.2, 0.26, 0.1), (am.x, am.y, DESK_Z + 0.05), noisy("AMGrey", (0.3, 0.3, 0.29), rough=0.4, scale=40, bump=0.02), rot=(math.radians(-8), 0, 0), bevel=0.02)
    for k in range(20):
        cyl(f"AMKey{k}", 0.009, 0.01, (am.x - 0.06 + (k % 5) * 0.03, am.y - 0.08 + (k // 5) * 0.03, DESK_Z + 0.105 + (k // 5) * 0.004), solid("AMKeyM", (0.05, 0.05, 0.05), 0.3))
    cyl("AMRoll", 0.03, 0.12, (am.x, am.y + 0.14, DESK_Z + 0.11), solid("RollPaper", (0.92, 0.9, 0.84), 0.8), rot=(0, math.radians(90), 0))
    pc = on_z(1150, 840)
    for i in range(12):
        box(f"Punch{i}", (0.187, 0.083, 0.0006), (pc.x, pc.y, DESK_Z + 0.0005 + i * 0.0007), image_mat("PunchM", tx("punchcard.png"), rough=0.8) if os.path.exists(tx("punchcard.png")) else solid("PunchC", (0.86, 0.8, 0.6), 0.8), rot=(0, 0, 0.12), bevel=0)
    volume_box((8.4, 5.6, 2.9), (0, 1.2, 1.5), 0.011, (1, 1, 1), 0.6)
    area((0.8, -1.5, 3.0), (0.8, 0.82, 0.85), 6, (3, 1), rot=(math.radians(40), 0, 0))
    area((0, 1.5, 2.95), (1, 0.97, 0.9), 40, (2.4, 0.4), rot=(0, 0, 0))
    v = 1 - (150 + 18 * 52 + 40) / 1650
    return {"typed": stage_path([uv2w(0.12, v), uv2w(0.88, v)])}


# ───────────────────────── 1970s · computer room ─────────────────────────
def computer():
    camera(fstop=4.0, focus=1.1)
    white = noisy("WallWhite", (0.62, 0.62, 0.58), rough=0.8, scale=8, bump=0.03)
    tiles = noisy("RaisedFloor", (0.45, 0.46, 0.44), rough=0.5, scale=3, bump=0.05)
    wall = room(4.6, white, tiles, noisy("Ceil", (0.7, 0.7, 0.68), rough=0.9, scale=40, bump=0.2), 2.9)
    for i in range(-6, 7):
        box(f"FloorSeam{i}", (0.01, 12, 0.003), (i * 0.6, 1, 0.001), solid("Seam", (0.15, 0.15, 0.15), 0.6), bevel=0)
    desk(noisy("DarkLam", (0.12, 0.1, 0.08), rough=0.4, scale=20, bump=0.02, coat=0.2))
    # fluorescent troffers
    for i in range(3):
        for j in range(3):
            plane(f"Troffer{i}{j}", (0.6, 1.2), (-1.8 + i * 1.8, 0.5 + j * 1.6, 2.89), emission("Fluoro", (0.92, 0.97, 1.0), 12), rot=(math.radians(180), 0, 0))
    # mainframe cabinets with tape drives
    cab_blue = noisy("CabBlue", (0.08, 0.16, 0.32), rough=0.35, scale=20, bump=0.02, coat=0.3)
    cab_grey = noisy("CabGrey", (0.55, 0.55, 0.52), rough=0.35, scale=20, bump=0.02, coat=0.3)
    reel_m = solid("Reel", (0.02, 0.02, 0.02), 0.3)
    glass_m = glass("TapeGlass", (0.95, 0.97, 0.97), 0.03)
    x = -3.3
    rng = random.Random(7)
    k = 0
    while x < 3.4:
        cw = 0.75
        box(f"Cab{k}", (cw - 0.02, 0.8, 1.85), (x, 4.1, 0.925), cab_grey, bevel=0.01)
        box(f"CabPanel{k}", (cw - 0.06, 0.02, 0.5), (x, 3.69, 1.55), cab_blue, bevel=0.005)
        if k % 2 == 0:
            for rz in (1.4, 1.0):
                for rx in (-0.16, 0.16):
                    cyl(f"Reel{k}{rz}{rx}", 0.13, 0.02, (x + rx, 3.68, rz + 0.05), reel_m, rot=(math.radians(90), 0, 0))
                    cyl(f"Hub{k}{rz}{rx}", 0.04, 0.025, (x + rx, 3.672, rz + 0.05), solid("HubAl", (0.7, 0.7, 0.7), 0.3, 1.0), rot=(math.radians(90), 0, 0))
            plane(f"TapeWin{k}", (cw - 0.1, 0.7), (x, 3.66, 1.2), glass_m, rot=(math.radians(90), 0, 0))
        for li in range(10):
            col = rng.choice([(1, 0.3, 0.2), (1, 0.8, 0.3), (0.3, 1, 0.5), (1, 1, 0.9)])
            sphere(f"Lamp{k}{li}", 0.009, (x - 0.25 + (li % 5) * 0.12, 3.68, 0.55 + (li // 5) * 0.06), emission(f"LampE{k}{li}", col, rng.uniform(4, 14)))
        x += cw
        k += 1
    card("Operator", tx("person_hair.png"), 1.75, (1.7, 3.3, 0.875))
    # desk: CRT terminal, keyboard, printout stack, tape reel, mug
    t = on_z(960, 700)
    beige = noisy("TermBeige", (0.62, 0.56, 0.45), rough=0.45, scale=30, bump=0.03)
    brown = noisy("TermBrown", (0.18, 0.12, 0.08), rough=0.45, scale=30, bump=0.03)
    box("TermBody", (0.42, 0.42, 0.36), (t.x, t.y + 0.1, DESK_Z + 0.2), beige, bevel=0.03, segs=4)
    box("TermBezel", (0.44, 0.03, 0.34), (t.x, t.y - 0.115, DESK_Z + 0.21), brown, bevel=0.012)
    scr, suv = screen("CRT", (t.x, t.y - 0.132, DESK_Z + 0.22), 0.32, 0.24, tx("crt1978.png"), emit=2.2)
    bend(scr, math.radians(6), "X")
    box("TermPedestal", (0.3, 0.3, 0.02), (t.x, t.y + 0.05, DESK_Z + 0.01), brown, bevel=0.005)
    area((t.x, t.y - 0.2, DESK_Z + 0.22), (0.3, 1.0, 0.5), 4, (0.3, 0.22), rot=(math.radians(-90), 0, 0))
    for i in range(3):
        area((-1.8 + i * 1.8, 2.1, 2.85), (0.92, 0.97, 1.0), 70, (0.6, 1.2), rot=(0, 0, 0))
    kb = on_z(960, 830)
    box("Keyboard", (0.46, 0.18, 0.035), (kb.x, kb.y, DESK_Z + 0.0175), beige, rot=(math.radians(-5), 0, 0), bevel=0.01)
    keym = solid("TermKey", (0.2, 0.17, 0.13), 0.4)
    for r in range(4):
        for c in range(14):
            box(f"TK{r}{c}", (0.022, 0.022, 0.012), (kb.x - 0.19 + c * 0.029 + r * 0.006, kb.y - 0.05 + r * 0.028, DESK_Z + 0.04 + r * 0.003), keym, bevel=0.003)
    pp = on_z(640, 770)
    for i in range(10):
        box(f"Printout{i}", (0.38, 0.28, 0.002), (pp.x, pp.y, DESK_Z + 0.001 + i * 0.0021), image_mat("GreenBar", tx("greenbar.png"), rough=0.8), rot=(0, 0, 0.08), bevel=0)
    tr = on_z(1320, 730)
    cyl("DeskReel", 0.11, 0.022, (tr.x, tr.y, DESK_Z + 0.011), reel_m)
    cyl("DeskReelTape", 0.08, 0.023, (tr.x, tr.y, DESK_Z + 0.011), solid("TapeBrown", (0.12, 0.07, 0.04), 0.4))
    mg = on_z(1400, 820)
    lathe("Mug", [(0, 0), (0.04, 0), (0.042, 0.1), (0.038, 0.1), (0.036, 0.008), (0, 0.008)], (mg.x, mg.y, DESK_Z), solid("MugOrange", (0.7, 0.25, 0.05), 0.3), close_top=False)
    volume_box((8.4, 6.2, 2.8), (0, 1.5, 1.45), 0.01, (0.9, 1, 0.95), 0.5)
    y_ = 1 - (60 + 14 * 52 + 20) / 1050
    return {"data": stage_path([suv(0.06, y_), suv(0.3, y_), suv(0.32, y_ + 0.03), suv(0.34, y_ - 0.04), suv(0.36, y_ + 0.02), suv(0.38, y_), suv(0.9, y_)])}


# ───────────────────────── 1990s · enterprise ─────────────────────────
def enterprise():
    camera(fstop=4.0, focus=1.1)
    fabric = noisy("PartitionFabric", (0.22, 0.26, 0.33), var=0.05, rough=0.95, scale=400, bump=0.4, sheen=0.4)
    wallm = noisy("OfficeWall", (0.55, 0.56, 0.55), rough=0.85, scale=8, bump=0.03)
    carpet = noisy("Carpet", (0.16, 0.17, 0.2), var=0.1, rough=0.98, scale=300, bump=0.5)
    wall = room(6.5, wallm, carpet, noisy("CeilTile", (0.72, 0.72, 0.7), rough=0.95, scale=60, bump=0.4), 2.8)
    for i in range(-5, 6):
        for j in range(5):
            if (i + j) % 3 == 0:
                plane(f"Troffer{i}{j}", (0.6, 1.2), (i * 1.2, -0.5 + j * 1.6, 2.79), emission("Fluoro", (0.93, 0.97, 1.0), 5), rot=(math.radians(180), 0, 0))
    grid = solid("Grid", (0.8, 0.8, 0.78), 0.5, 0.3)
    for i in range(-6, 7):
        box(f"GridX{i}", (0.02, 9, 0.01), (i * 0.6, 1.5, 2.78), grid, bevel=0)
    desk(noisy("GreyLam", (0.42, 0.42, 0.4), rough=0.45, scale=20, bump=0.02))
    # cubicle partitions: back panel behind desk, rows beyond
    box("CubicleBack", (3.4, 0.06, 1.02), (0, lib.DESK_BACK + 0.35, 0.51), fabric, bevel=0.01)
    box("CubicleCap", (3.4, 0.08, 0.03), (0, lib.DESK_BACK + 0.35, 1.03), solid("Trim", (0.55, 0.55, 0.55), 0.4), bevel=0.005)
    area((0.2, 0.2, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    area((-1.5, 3.0, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    area((1.8, 4.2, 2.7), (0.95, 0.98, 1.0), 40, (1.2, 0.6), rot=(0, 0, 0))
    for r, yy in enumerate((2.8, 4.4)):
        for c in range(-3, 4):
            box(f"Cub{r}{c}", (1.55, 0.06, 1.3), (c * 1.6, yy, 0.65), fabric, bevel=0.01)
            box(f"CubCap{r}{c}", (1.55, 0.08, 0.03), (c * 1.6, yy, 1.31), solid("Trim2", (0.55, 0.55, 0.55), 0.4), bevel=0.005)
    for i, (px, py) in enumerate(((-2.2, 3.4), (1.3, 3.5), (-0.6, 5.1), (2.6, 5.0))):
        card(f"Colleague{i}", tx("person_hair.png"), 1.7, (px, py, 0.85))
    plane("Whiteboard", (1.6, 1.0), (-2.4, 6.45, 1.6), solid("WB", (0.9, 0.9, 0.9), 0.2), rot=(math.radians(90), 0, 0))
    # desk: beige CRT with spreadsheet, tower, keyboard, mouse, floppies, phone, mug
    beige = noisy("PCBeige", (0.66, 0.62, 0.53), rough=0.45, scale=40, bump=0.02)
    m = on_z(930, 700)
    box("MonBody", (0.4, 0.38, 0.36), (m.x, m.y + 0.12, DESK_Z + 0.24), beige, bevel=0.04, segs=4)
    box("MonBezel", (0.42, 0.06, 0.36), (m.x, m.y - 0.09, DESK_Z + 0.24), beige, bevel=0.015)
    scr, suv = screen("Screen96", (m.x, m.y - 0.122, DESK_Z + 0.245), 0.33, 0.25, tx("sheet1996.png"), emit=1.4)
    bend(scr, math.radians(4), "X")
    lathe("MonStand", [(0, 0), (0.12, 0), (0.11, 0.02), (0.05, 0.05), (0, 0.06)], (m.x, m.y + 0.05, DESK_Z), beige)
    tw = on_z(1440, 700)
    box("Tower", (0.2, 0.44, 0.44), (tw.x, tw.y + 0.1, DESK_Z + 0.22), beige, bevel=0.012)
    box("Drive1", (0.15, 0.02, 0.04), (tw.x, tw.y - 0.125, DESK_Z + 0.36), solid("DriveF", (0.55, 0.52, 0.45), 0.5), bevel=0.003)
    box("Drive2", (0.12, 0.02, 0.025), (tw.x, tw.y - 0.125, DESK_Z + 0.29), solid("DriveF2", (0.3, 0.3, 0.3), 0.5), bevel=0.003)
    sphere("PowerLED", 0.004, (tw.x + 0.05, tw.y - 0.126, DESK_Z + 0.1), emission("LEDg", (0.3, 1, 0.4), 30))
    kb = on_z(940, 830)
    box("Keyboard", (0.46, 0.17, 0.03), (kb.x, kb.y, DESK_Z + 0.015), beige, rot=(math.radians(-5), 0, 0), bevel=0.01)
    keym = solid("KeyBeige", (0.72, 0.68, 0.6), 0.45)
    for r in range(5):
        for c in range(15):
            box(f"K{r}{c}", (0.02, 0.02, 0.01), (kb.x - 0.2 + c * 0.0275, kb.y - 0.06 + r * 0.025, DESK_Z + 0.035 + r * 0.002), keym, bevel=0.003)
    ms = on_z(1180, 840)
    box("MousePad", (0.22, 0.18, 0.004), (ms.x, ms.y, DESK_Z + 0.002), solid("PadBlue", (0.05, 0.08, 0.2), 0.9), bevel=0.002)
    sphere("Mouse", 0.035, (ms.x, ms.y, DESK_Z + 0.012), beige, scale=(0.9, 1.4, 0.5))
    fd = on_z(700, 840)
    for i, col in enumerate(((0.05, 0.05, 0.06), (0.1, 0.2, 0.5), (0.05, 0.05, 0.06))):
        box(f"Floppy{i}", (0.09, 0.094, 0.0033), (fd.x + i * 0.03, fd.y + i * 0.02, DESK_Z + 0.002 + i * 0.0034), solid(f"Fl{i}", col, 0.35), rot=(0, 0, 0.2 * i - 0.1), bevel=0.001)
    dp = on_z(650, 720)
    box("DeskPhone", (0.2, 0.22, 0.06), (dp.x, dp.y, DESK_Z + 0.03), solid("PhoneGrey", (0.18, 0.18, 0.19), 0.4), rot=(math.radians(-10), 0, 0.15), bevel=0.02)
    mg = on_z(1440, 790)
    lathe("Mug", [(0, 0), (0.04, 0), (0.042, 0.1), (0.038, 0.1), (0.036, 0.008), (0, 0.008)], (mg.x, mg.y, DESK_Z), solid("MugWhite", (0.85, 0.85, 0.85), 0.2), close_top=False)
    volume_box((8.4, 9, 2.7), (0, 2.5, 1.4), 0.008, (0.95, 0.97, 1), 0.4)
    pts = anchors["sheet"]
    return {"sheet": stage_path([suv(u, 1 - v) for u, v in pts])}


# ───────────────────────── 2000s · internet ─────────────────────────
def internet():
    camera(fstop=3.2, focus=1.1)
    carpet = noisy("Carpet", (0.08, 0.09, 0.12), var=0.1, rough=0.98, scale=300, bump=0.5)
    wallm = noisy("Wall", (0.2, 0.22, 0.26), rough=0.8, scale=8, bump=0.02)
    wall = room(4.6, wallm, carpet, noisy("Ceil", (0.25, 0.26, 0.3), rough=0.9, scale=40, bump=0.2), 2.9)
    window_cut(wall, 0.0, 0.25, 8.0, 2.55, y=4.7)
    for i in range(-4, 5):
        box(f"Mullion{i}", (0.06, 0.1, 2.6), (i * 1.0, 4.65, 1.5), solid("Alu", (0.25, 0.26, 0.28), 0.35, 1.0), bevel=0.004)
    plane("Glazing", (8, 2.6), (0, 4.66, 1.5), glass("Glazing", (0.9, 0.95, 1.0), 0.01), rot=(math.radians(90), 0, 0))
    plane("City", (60, 21), (0, 60, 7), emission("CityE", (1, 1, 1), 1.0), rot=(math.radians(90), 0, 0))
    bpy.data.objects["City"].data.materials.clear()
    bpy.data.objects["City"].data.materials.append(image_mat("CityM", tx("city_night.png"), emit=1.8, rough=1))
    gradient_sky([(-0.2, (0.01, 0.01, 0.02)), (0.0, (0.06, 0.08, 0.18)), (0.3, (0.02, 0.03, 0.08))], 1.0)
    desk(noisy("LightLam", (0.5, 0.49, 0.46), rough=0.35, scale=20, bump=0.02, coat=0.2))
    # LCD monitor with the online store
    m = on_z(960, 735)
    silver_ = solid("SilverPlastic", (0.6, 0.62, 0.65), 0.3, 0.6)
    black = solid("BlackPlastic", (0.02, 0.02, 0.025), 0.35)
    box("LCDBezel", (0.5, 0.04, 0.34), (m.x, m.y, DESK_Z + 0.3), silver_, bevel=0.012)
    scr, suv = screen("LCD", (m.x, m.y - 0.0205, DESK_Z + 0.305), 0.46, 0.288, tx("browser2005.png"), emit=1.6, glass=False)
    box("LCDNeck", (0.06, 0.04, 0.14), (m.x, m.y + 0.04, DESK_Z + 0.08), silver_, bevel=0.01)
    lathe("LCDFoot", [(0, 0), (0.12, 0), (0.12, 0.012), (0, 0.014)], (m.x, m.y + 0.04, DESK_Z), silver_).scale = (1.2, 0.8, 1)
    area((m.x, m.y - 0.3, DESK_Z + 0.3), (0.7, 0.8, 1.0), 6, (0.4, 0.3), rot=(math.radians(-90), 0, 0))
    kb = on_z(950, 850)
    box("Keyboard", (0.44, 0.15, 0.022), (kb.x, kb.y, DESK_Z + 0.011), black, rot=(math.radians(-4), 0, 0), bevel=0.008)
    for r in range(5):
        for c in range(15):
            box(f"K{r}{c}", (0.02, 0.02, 0.006), (kb.x - 0.195 + c * 0.0275, kb.y - 0.055 + r * 0.024, DESK_Z + 0.025), solid("KeyB", (0.05, 0.05, 0.06), 0.4), bevel=0.002)
    fp = on_z(1270, 880)
    box("FlipPhone", (0.05, 0.095, 0.018), (fp.x, fp.y, DESK_Z + 0.009), solid("PhoneSilver", (0.55, 0.57, 0.6), 0.25, 0.8), rot=(0, 0, -0.3), bevel=0.008)
    cd_ = on_z(700, 880)
    box("BankCard", (0.0856, 0.054, 0.0008), (cd_.x, cd_.y, DESK_Z + 0.0005), solid("CardBlue", (0.05, 0.12, 0.35), 0.3, 0.2), rot=(0, 0, 0.2), bevel=0.0004)
    lathe("Plant", [(0, 0), (0.07, 0), (0.08, 0.14), (0, 0.14)], (on_z(1420, 720).x, on_z(1420, 720).y, DESK_Z), solid("Pot", (0.1, 0.1, 0.11), 0.4))
    volume_box((8.4, 6, 2.8), (0, 1.5, 1.45), 0.006, (0.8, 0.9, 1), 0.4)
    area((0.8, -1.5, 3.0), (0.6, 0.7, 0.9), 5, (3, 1), rot=(math.radians(40), 0, 0))
    # a network arc across the night skyline (for the site's thread)
    arc = [Vector((-9 + 20 * t, 40, 3 + 6 * math.sin(math.pi * t))) for t in [i / 10 for i in range(11)]]
    return {"network": stage_path(arc)}


# ───────────────────────── 2010s · cloud & mobile ─────────────────────────
def cloud():
    camera(fstop=2.8, focus=1.05)
    floor = wood("LightOakFloor", (0.45, 0.35, 0.24), (0.62, 0.5, 0.36), 1.2, 0.45, 0.2, stretch=(1, 10, 1))
    wallm = noisy("WhiteWall", (0.8, 0.8, 0.78), rough=0.8, scale=8, bump=0.02)
    wall = room(4.6, wallm, floor, noisy("Ceil", (0.82, 0.82, 0.8), rough=0.9, scale=40, bump=0.1), 3.0)
    window_cut(wall, 0.0, 0.1, 8.0, 2.8, y=4.7)
    for i in range(-3, 4):
        box(f"Mullion{i}", (0.04, 0.08, 2.9), (i * 1.3, 4.65, 1.5), solid("BlackAlu", (0.03, 0.03, 0.035), 0.3, 1.0), bevel=0.003)
    plane("Glazing", (8, 2.8), (0, 4.66, 1.5), glass("Glazing", (0.92, 0.96, 1.0), 0.01), rot=(math.radians(90), 0, 0))
    plane("City", (70, 24), (0, 70, 8), image_mat("CityM", tx("city_night.png"), emit=0.9, rough=1), rot=(math.radians(90), 0, 0))
    gradient_sky([(-0.2, (0.1, 0.12, 0.2)), (0.0, (0.35, 0.5, 0.75)), (0.2, (0.18, 0.32, 0.62)), (0.6, (0.06, 0.12, 0.3))], 1.3)
    desk(wood("PaleOak", (0.5, 0.38, 0.25), (0.68, 0.55, 0.4), 2.0, 0.4, 0.15))
    # laptop (aluminium) with cloud dashboard
    lp = on_z(960, 800)
    alu = noisy("Aluminium", (0.72, 0.73, 0.75), var=0.02, rough=0.28, scale=600, bump=0.02, metal=1.0)
    box("LaptopBase", (0.34, 0.235, 0.012), (lp.x, lp.y, DESK_Z + 0.006), alu, bevel=0.004)
    lid = box("LaptopLid", (0.34, 0.008, 0.225), (lp.x, lp.y + 0.12, DESK_Z + 0.12), alu, rot=(math.radians(-12), 0, 0), bevel=0.004)
    scr, suv = screen("LaptopScreen", (lp.x, lp.y + 0.113, DESK_Z + 0.121), 0.3, 0.19, tx("dash_cloud.png"), emit=1.6)
    scr.rotation_euler = (math.radians(90 - 12), 0, 0)
    bpy.context.view_layer.update()
    box("KeyDeck", (0.28, 0.1, 0.001), (lp.x, lp.y + 0.03, DESK_Z + 0.0125), solid("KeysBlack", (0.03, 0.03, 0.035), 0.5), bevel=0)
    ph_ = on_z(1280, 880)
    box("Phone", (0.07, 0.14, 0.008), (ph_.x, ph_.y, DESK_Z + 0.004), solid("PhoneBody", (0.1, 0.1, 0.11), 0.25, 0.8), rot=(0, 0, -0.25), bevel=0.006)
    ps, _ = screen("PhoneScreen", (ph_.x, ph_.y, DESK_Z + 0.0085), 0.064, 0.13, tx("phone_app.png"), emit=1.4, rot=(0, 0, -0.25))
    tb = on_z(660, 860)
    box("Tablet", (0.24, 0.17, 0.008), (tb.x, tb.y, DESK_Z + 0.004), solid("TabBody", (0.12, 0.12, 0.13), 0.3, 0.6), rot=(0, 0, 0.12), bevel=0.008)
    screen("TabletScreen", (tb.x, tb.y, DESK_Z + 0.0085), 0.22, 0.15, tx("dash_light.png"), emit=1.2, rot=(0, 0, 0.12))
    cp = on_z(1400, 760)
    lathe("Cup", [(0, 0), (0.035, 0), (0.042, 0.09), (0.039, 0.09), (0.033, 0.006), (0, 0.006)], (cp.x, cp.y, DESK_Z), solid("Ceramic", (0.92, 0.92, 0.9), 0.15), close_top=False)
    cyl("Coffee", 0.037, 0.002, (cp.x, cp.y, DESK_Z + 0.075), solid("Coffee", (0.08, 0.04, 0.02), 0.1))
    pl = on_z(560, 700)
    lathe("PlantPot", [(0, 0), (0.08, 0), (0.1, 0.2), (0, 0.2)], (pl.x, pl.y, DESK_Z), solid("Terrazzo", (0.85, 0.83, 0.8), 0.5))
    for i in range(14):
        a = i * 2.4
        leaf = plane(f"Leaf{i}", (0.06, 0.28), (pl.x + math.cos(a) * 0.04, pl.y + math.sin(a) * 0.04, DESK_Z + 0.32), solid("Leaf", (0.08, 0.25, 0.08), 0.5, sss=0.2), rot=(math.radians(20 + (i % 3) * 12), 0, a), subdiv=4)
        bend(leaf, math.radians(40), "X")
    volume_box((8.4, 6, 2.9), (0, 1.5, 1.5), 0.005, (0.9, 0.95, 1), 0.4)
    area((0, 4.2, 1.5), (0.6, 0.75, 1.0), 120, (6, 2.5), rot=(math.radians(-90), 0, 0))
    area((0.8, -1.5, 3.0), (0.9, 0.9, 0.95), 15, (3, 1), rot=(math.radians(40), 0, 0))
    base = suv(0.5, 0.6)
    top = on_y(1250, 40, 4.0)
    pts = [base + (top - base) * t + Vector((0.25 * math.sin(t * math.pi), 0, 0)) for t in [i / 10 for i in range(11)]]
    return {"stream": stage_path(pts)}


# ───────────────────────── 2020–25 · automation ─────────────────────────
def automation():
    camera(fstop=2.8, focus=1.05)
    floor = noisy("DarkFloor", (0.05, 0.05, 0.06), rough=0.4, scale=4, bump=0.05)
    wallm = noisy("DarkWall", (0.06, 0.065, 0.08), rough=0.8, scale=8, bump=0.02)
    wall = room(4.4, wallm, floor, noisy("Ceil", (0.05, 0.05, 0.06), rough=0.9, scale=40, bump=0.1), 2.9)
    desk(wood("SmokedOak", (0.04, 0.03, 0.025), (0.1, 0.08, 0.06), 2.0, 0.35, 0.3))
    # wall of screens behind: many disconnected dashboards
    dash = ["dash_auto1.png", "dash_auto2.png", "dash_auto3.png", "dash_auto4.png", "dash_light.png", "browser2005.png", "dash_cloud.png"]
    rng = random.Random(3)
    k = 0
    for row, z in enumerate((1.25, 2.05)):
        for c in range(-3, 4):
            x = c * 1.05 + (0.25 if row else 0)
            box(f"TVBezel{k}", (0.96, 0.04, 0.56), (x, 4.36, z), solid("TVBlack", (0.01, 0.01, 0.012), 0.3), bevel=0.006)
            screen(f"TV{k}", (x, 4.335, z), 0.92, 0.52, tx(dash[k % len(dash)]), emit=1.1, glass=True)
            k += 1
    # monitors on arms
    blk = solid("MonBlack", (0.015, 0.015, 0.018), 0.35)
    for i, (sx, tex_) in enumerate(((1170, "dash_auto2.png"), (760, "dash_auto3.png"))):
        mp = on_z(sx, 700)
        box(f"Mon{i}", (0.55, 0.03, 0.33), (mp.x, mp.y, DESK_Z + 0.36), blk, rot=(0, 0, 0.25 if i == 0 else -0.25), bevel=0.006)
        s_, _ = screen(f"MonScr{i}", (mp.x, mp.y, DESK_Z + 0.36), 0.53, 0.3, tx(tex_), emit=1.3, rot=(math.radians(90), 0, 0.25 if i == 0 else -0.25))
        s_.location.y -= 0.016
        cyl(f"MonArm{i}", 0.012, 0.3, (mp.x, mp.y + 0.05, DESK_Z + 0.15), blk)
    lp = on_z(960, 820)
    alu = noisy("SpaceGrey", (0.3, 0.31, 0.33), var=0.02, rough=0.3, scale=600, bump=0.02, metal=1.0)
    box("LaptopBase", (0.34, 0.235, 0.012), (lp.x, lp.y, DESK_Z + 0.006), alu, bevel=0.004)
    box("LaptopLid", (0.34, 0.008, 0.225), (lp.x, lp.y + 0.12, DESK_Z + 0.12), alu, rot=(math.radians(-12), 0, 0), bevel=0.004)
    scr, suv = screen("LaptopScreen", (lp.x, lp.y + 0.113, DESK_Z + 0.121), 0.3, 0.19, tx("dash_auto1.png"), emit=1.6)
    scr.rotation_euler = (math.radians(78), 0, 0)
    ph_ = on_z(1290, 900)
    box("Phone", (0.072, 0.15, 0.008), (ph_.x, ph_.y, DESK_Z + 0.004), solid("PhoneBody", (0.05, 0.05, 0.06), 0.25, 0.8), rot=(0, 0, -0.2), bevel=0.006)
    screen("PhoneScreen", (ph_.x, ph_.y, DESK_Z + 0.0085), 0.066, 0.14, tx("phone_notif.png"), emit=1.6, rot=(0, 0, -0.2))
    rng = random.Random(5)
    for i in range(6):
        sn = on_z(rng.uniform(620, 1400), rng.uniform(800, 950))
        box(f"Sticky{i}", (0.075, 0.075, 0.0006), (sn.x, sn.y, DESK_Z + 0.0004), solid(f"StickyC{i}", rng.choice([(0.95, 0.85, 0.3), (0.95, 0.5, 0.55), (0.5, 0.85, 0.95)]), 0.8), rot=(0, 0, rng.uniform(-0.4, 0.4)), bevel=0)
    for i in range(4):
        cab = cyl(f"Cable{i}", 0.003, 1.0, (rng.uniform(-0.6, 0.6), 0.25, DESK_Z + 0.003), blk, rot=(0, math.radians(90), rng.uniform(-0.5, 0.5)))
    volume_box((8.4, 6, 2.8), (0, 1.5, 1.45), 0.012, (0.8, 0.85, 1), 0.4)
    area((0.8, -1.5, 3.0), (0.5, 0.6, 1.0), 4, (3, 1), rot=(math.radians(40), 0, 0))
    area((0, 3.5, 2.6), (0.3, 0.45, 1.0), 25, (6, 1), rot=(0, 0, 0))
    return {}


# ───────────────────────── 2026 · AI / 2030 · autonomous ─────────────────────────
def ai(autonomous=False):
    camera(fstop=2.8, focus=1.1)
    floor = noisy("BlackStone", (0.02, 0.022, 0.03), rough=0.2, scale=3, bump=0.02)
    wallm = noisy("Graphite", (0.025, 0.028, 0.04), rough=0.6, scale=6, bump=0.03)
    wall = room(5.0, wallm, floor, wallm, 3.2)
    # architectural fins with concealed blue light
    for i in range(-7, 8):
        box(f"Fin{i}", (0.06, 0.4, 3.2), (i * 0.55, 4.8, 1.6), solid("FinM", (0.02, 0.022, 0.03), 0.4), bevel=0.004)
    for i in range(-7, 8, 2):
        plane(f"FinLight{i}", (0.02, 3.0), (i * 0.55 + 0.04, 4.96, 1.6), emission("FinGlow", (0.12, 0.35, 1.0), 2.5 if not autonomous else 4), rot=(math.radians(90), 0, 0))
    # the desk: one slab of black glass with an electric-blue edge
    top = desk(noisy("BlackGlass", (0.005, 0.006, 0.01), rough=0.04, scale=4, bump=0.0, coat=1.0))
    box("EdgeLED", (3.1, 0.006, 0.006), (0, lib.DESK_BACK - 0.003, DESK_Z - 0.004), emission("LED", (0.15, 0.45, 1.0), 40), bevel=0)
    box("FrontLED", (3.1, 0.006, 0.006), (0, lib.DESK_BACK - 1.25 + 0.003, DESK_Z - 0.004), emission("LED2", (0.15, 0.45, 1.0), 20), bevel=0)
    area((0, 1.8, 2.9), (0.4, 0.6, 1.0), 30, (3, 2), rot=(0, 0, 0))
    area((0, 4.4, 1.6), (0.15, 0.35, 1.0), 40 if not autonomous else 70, (6, 2), rot=(math.radians(-90), 0, 0))
    if autonomous:
        # a thin glass display stands on the desk; a person reviews it
        g = on_z(1250, 720)
        pane = box("GlassDisplay", (0.5, 0.008, 0.32), (g.x, g.y, DESK_Z + 0.19), glass("DispGlass", (0.8, 0.9, 1.0), 0.03), rot=(0, 0, -0.35), bevel=0.003)
        plane("DispGlow", (0.46, 0.28), (g.x, g.y - 0.006, DESK_Z + 0.19), image_mat("DispE", tx("dash_auto1.png"), emit=0.5, rough=0.2), rot=(math.radians(90), 0, -0.35))
        box("DispFoot", (0.2, 0.06, 0.02), (g.x, g.y, DESK_Z + 0.01), solid("Alu", (0.5, 0.52, 0.56), 0.25, 1.0), rot=(0, 0, -0.35), bevel=0.005)
        pp = on_y(1450, 400, 2.3)
        card("Person", tx("person_hair.png"), 1.78, (pp.x, 2.3, 0.89), rot=(math.radians(90), 0, math.radians(-10)))
        point((pp.x + 0.4, 2.8, 1.7), (0.3, 0.55, 1.0), 40, 0.2, "RimBlue")
    volume_box((8.4, 6.5, 3.1), (0, 1.8, 1.55), 0.012, (0.6, 0.75, 1.0), 0.5)
    return {}


ERAS = {
    "centuries-printed": printed,
    "centuries-accountbook": accountbook,
    "paper": paper,
    "mechanical": mechanical,
    "computer": computer,
    "enterprise": enterprise,
    "internet": internet,
    "cloud": cloud,
    "automation": automation,
    "ai": ai,
    "autonomous": lambda: ai(True),
}

if __name__ == "__main__":
    args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
    era = args["era"]
    res = tuple(int(v) for v in args.get("res", "1600x900").split("x"))
    samples = int(args.get("samples", 48))
    out = args.get("out", os.path.join(os.path.dirname(os.path.abspath(__file__)), "final", f"{era}.png"))
    reset(res, samples)
    paths = ERAS[era]()
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(paths, open(out.replace(".png", ".json"), "w"))
    lib.render(out)
    print("rendered", out, paths)
