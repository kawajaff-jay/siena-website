"""Calibration plate (art-directed): Abbasid Baghdad at dusk — the merchant's counting-house.
Same desk & seated camera as every era. Target: the SIENA Abbasid reference (warm candle/lantern
interior, glossy walnut, brass scales on a box, coins, glass inkwell, torn account sheet, scroll &
rope, niche shelves with glazed jars and scrolls, carved screens, and a great arch opening onto the
Tigris, domes & minarets under a violet-amber sky).
   python abbasid4.py -- res=1920x1080 samples=64 variant=abbasid|record out=...
"""
import sys, math, os, json, random
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector, Quaternion
import lib
from lib import *
from common_props import *
from v3 import *

args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
RES = tuple(int(v) for v in args.get("res", "1920x1080").split("x"))
SAMPLES = int(args.get("samples", 64))
VARIANT = args.get("variant", "abbasid")
OUT = args.get("out", f"/home/claude/render/out/{VARIANT}4.png")
FSTOP = float(args.get("fstop", 2.4))
T = lib.TEX
tx = lambda n: os.path.join(T, n)
rng = random.Random(4)

sc = reset(RES, SAMPLES)
try:
    sc.view_settings.look = "AgX - Medium High Contrast"
except Exception as e:
    print("look", e)
cam = camera()


# ───────────────────────── local materials ─────────────────────────
def obj_img(name, path, scale=1.0, rough=0.6, bump=0.0, alpha_from=None, color=None, noncolor=False, tint=None, emit=0.0, flat=False):
    """Image projected on the object's XZ plane (for wall-facing panels). alpha_from='color' uses luminance as alpha."""
    m, nt, b = lib._mat(name)
    co = lib._coord(nt)
    mp = nt.nodes.new("ShaderNodeMapping")
    if not flat:
        mp.inputs["Rotation"].default_value = (math.radians(90), 0, 0)
    mp.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(co, mp.inputs["Vector"])
    t = lib._img_node(nt, path, noncolor, mp.outputs[0])
    if color is not None:
        b.inputs["Base Color"].default_value = (*color, 1)
    else:
        src = t.outputs["Color"]
        if tint:
            mul = nt.nodes.new("ShaderNodeMix")
            mul.data_type = "RGBA"
            mul.blend_type = "MULTIPLY"
            mul.inputs["Factor"].default_value = 1.0
            nt.links.new(src, mul.inputs["A"])
            mul.inputs["B"].default_value = (*tint, 1)
            src = mul.outputs["Result"]
        nt.links.new(src, b.inputs["Base Color"])
    lib._set(b, rough=rough)
    if bump:
        lib._bump(nt, b, t.outputs["Color"], bump, 0.006)
    if alpha_from == "color":
        nt.links.new(t.outputs["Color"], b.inputs["Alpha"])
    if emit:
        nt.links.new(t.outputs["Color"], b.inputs["Emission Color"])
        b.inputs["Emission Strength"].default_value = emit
    return m


def glazed(name, color, band=(0.9, 0.88, 0.8), rough=0.18, bands=6.0):
    """Glazed ceramic: glossy coat, crackle noise, a painted band pattern."""
    m, nt, b = lib._mat(name)
    co = lib._coord(nt)
    w = nt.nodes.new("ShaderNodeTexWave")
    w.wave_type = "BANDS"
    w.bands_direction = "Z"
    w.inputs["Scale"].default_value = bands
    w.inputs["Distortion"].default_value = 6
    w.inputs["Detail"].default_value = 3
    nt.links.new(co, w.inputs["Vector"])
    r = lib._ramp(nt, w.outputs["Fac"], [(0.0, color), (0.62, color), (0.7, band), (0.8, color)])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 30
    mul = nt.nodes.new("ShaderNodeMix")
    mul.data_type = "RGBA"
    mul.blend_type = "MULTIPLY"
    mul.inputs["Factor"].default_value = 0.25
    nt.links.new(r.outputs["Color"], mul.inputs["A"])
    nt.links.new(n.outputs["Color"], mul.inputs["B"])
    nt.links.new(mul.outputs["Result"], b.inputs["Base Color"])
    lib._set(b, rough=rough, coat=0.8)
    return m


def water(name="Tigris"):
    m, nt, b = lib._mat(name)
    b.inputs["Base Color"].default_value = (0.01, 0.012, 0.02, 1)
    lib._set(b, rough=0.04)
    co = lib._coord(nt)
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.4, 2.5, 1)
    nt.links.new(co, mp.inputs["Vector"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 0.8
    n.inputs["Detail"].default_value = 8
    nt.links.new(mp.outputs[0], n.inputs["Vector"])
    lib._bump(nt, b, n.outputs["Fac"], 0.35, 0.05)
    return m


def facade(name, wall, lit=(1.0, 0.62, 0.3), strength=6.0, seed=0.0, win=(1.6, 2.6)):
    """Distant city block: stone/plaster wall + a random scatter of warmly lit windows."""
    m, nt, b = lib._mat(name)
    co = nt.nodes.new("ShaderNodeTexCoord").outputs["Object"]
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (math.radians(90), 0, 0)
    mp.inputs["Location"].default_value = (seed, seed * 0.37, 0)
    nt.links.new(co, mp.inputs["Vector"])
    br = nt.nodes.new("ShaderNodeTexBrick")
    br.inputs["Color1"].default_value = (0, 0, 0, 1)
    br.inputs["Color2"].default_value = (1, 1, 1, 1)
    br.inputs["Mortar"].default_value = (0, 0, 0, 1)
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Mortar Size"].default_value = 0.45
    br.inputs["Bias"].default_value = -0.55
    br.inputs["Brick Width"].default_value = win[0]
    br.inputs["Row Height"].default_value = win[1]
    nt.links.new(mp.outputs[0], br.inputs["Vector"])
    b.inputs["Base Color"].default_value = (*wall, 1)
    b.inputs["Emission Color"].default_value = (*lit, 1)
    em = nt.nodes.new("ShaderNodeMath")
    em.operation = "MULTIPLY"
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(br.outputs["Color"], sep.inputs[0])
    nt.links.new(sep.outputs[0], em.inputs[0])
    em.inputs[1].default_value = strength
    nt.links.new(em.outputs[0], b.inputs["Emission Strength"])
    lib._set(b, rough=0.9)
    return m


def paper_alpha(name, path):
    m = paper_rich(name, path)
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    for nd in nt.nodes:
        if nd.type == "TEX_IMAGE":
            nt.links.new(nd.outputs["Alpha"], b.inputs["Alpha"])
            break
    return m


# ───────────────────────── palette ─────────────────────────
m_walnut = wood_rich("Walnut", "walnut", tint=0.6, coat=0.85, dust=0.025, bump=0.1)
_cr = [n for n in m_walnut.node_tree.nodes if n.type == "VALTORGB"][-1].color_ramp
_cr.elements[0].color = (0.04, 0.04, 0.04, 1)
_cr.elements[1].color = (0.26, 0.26, 0.26, 1)
m_stone = brick("Limestone", (0.58, 0.47, 0.34), (0.5, 0.4, 0.28), (0.62, 0.55, 0.43), scale=2.2, row=0.22, width=0.5)
m_stone_smooth = noisy("DressedStone", (0.55, 0.45, 0.33), var=0.1, rough=0.8, scale=6, bump=0.25)
m_floor = brick("FloorSlabs", (0.24, 0.18, 0.12), (0.21, 0.155, 0.1), (0.28, 0.23, 0.17), scale=1.0, row=0.5, width=0.7)
m_dark_wood = wood("DarkCarved", (0.035, 0.02, 0.012), (0.12, 0.065, 0.035), scale=2.0, rough=0.5, coat=0.3)
m_brass = brass_aged("Brass", (0.8, 0.57, 0.27), 0.26)
m_brass_dark = brass_aged("DarkBrass", (0.55, 0.38, 0.16), 0.35)
m_leather = noisy("Leather", (0.16, 0.06, 0.03), var=0.15, rough=0.66, scale=90, bump=0.12)
m_leather2 = noisy("Leather2", (0.07, 0.05, 0.035), var=0.15, rough=0.66, scale=90, bump=0.12)
m_scrollp = paper_rich("ScrollPaper", tx("manuscript.png"))
m_rope = noisy("Rope", (0.42, 0.3, 0.16), var=0.2, rough=0.95, scale=400, bump=1.0)
m_burlap = cloth("Burlap", (0.2, 0.15, 0.1), sheen=0.3, weave=500)
m_kilim = image_fabric("Kilim", tx("carpet_red.png"))
m_clay = noisy("Clay", (0.36, 0.2, 0.11), var=0.12, rough=0.75, scale=40, bump=0.2)
m_gold, m_silver = coin_mat("Dinar", (1.0, 0.72, 0.3), 0.016, 0.2), coin_mat("Dirham", (0.86, 0.86, 0.84), 0.017, 0.26)

# ───────────────────────── the desk ─────────────────────────
desk(m_walnut)
box("Floor", (14, 7, 0.05), (0, 1.0, -0.025), m_floor, bevel=0)

# ───────────────────────── architecture ─────────────────────────
WALL_Y, WALL_T = 3.4, 0.6
LB_Y = 2.1  # left bay (closer): niche wall
xs = lambda sx, y, sy=400: on_y(sx, sy, y).x
xl = xs(1110, WALL_Y)
xr_frame = xs(1760, WALL_Y)
aw = (xr_frame - xl) + 0.1
ac = xl + aw / 2
apex_z = on_y(1480, -330, WALL_Y).z
cr = 0.22
c_, r_ = aw * cr, aw / 2 + aw * cr
spring = apex_z - math.sqrt(r_ * r_ - c_ * c_)
arch_pts, _ = pointed_arch_pts(aw, spring, cr)
print("arch", round(xl, 2), round(aw, 2), "spring", round(spring, 2), "apex", round(apex_z, 2))
wall = wall_with_openings("BackWall", 16.0, 6.0, WALL_T, WALL_Y, m_stone, [(arch_pts, ac, 0.0, WALL_T)])
# arch surround: glazed-tile band + dressed stone moulding (as in the great Abbasid iwans)
outer, _ = pointed_arch_pts(aw + 0.44, spring, cr)
ring = prism("ArchTiles", outer, 0.06, (ac, WALL_Y - 0.04, 0.0), obj_img("TileBand", tx("tile_band.png"), scale=1.4, rough=0.25, bump=0.02))
boolean(ring, prism("ArchTilesCut", pointed_arch_pts(aw + 0.12, spring, cr)[0], 0.4, (ac, WALL_Y - 0.2, 0.0), None))
ring2 = prism("ArchMould", pointed_arch_pts(aw + 0.12, spring, cr)[0], 0.09, (ac, WALL_Y - 0.06, 0.0), m_stone_smooth)
boolean(ring2, prism("ArchMouldCut", arch_pts, 0.4, (ac, WALL_Y - 0.2, 0.0), None))
# column with capital standing before the left jamb
colx = xl - 0.05
lathe("ColBase", [(0, 0), (0.24, 0), (0.24, 0.1), (0.2, 0.16), (0.17, 0.2), (0, 0.2)], (colx, WALL_Y - 0.25, 0.0), m_stone_smooth)
cyl("ColShaft", 0.15, spring - 0.45, (colx, WALL_Y - 0.25, 0.2 + (spring - 0.45) / 2), m_stone_smooth, segs=48)
lathe("ColCapital", [(0, 0), (0.17, 0), (0.2, 0.08), (0.27, 0.18), (0.27, 0.25), (0, 0.25)], (colx, WALL_Y - 0.25, spring - 0.25), obj_img("CapCarve", tx("star_lattice.png"), 5.0, rough=0.8, bump=0.5, color=(0.55, 0.45, 0.33), noncolor=True))

# left bay, closer to the desk: a recessed niche of shelves and a wall lantern
x_lb = xs(430, LB_Y)
lb_w = x_lb + 6.0
lbwall = box("LeftBay", (lb_w, 0.5, 6.0), (x_lb - lb_w / 2, LB_Y + 0.25, 3.0), m_stone, bevel=0)
box("LeftReturn", (0.5, WALL_Y - LB_Y, 6.0), (x_lb - 0.25, (LB_Y + WALL_Y) / 2 + 0.25, 3.0), m_stone, bevel=0)
box("LeftPier", (0.36, 0.36, 6.0), (x_lb + 0.02, LB_Y + 0.02, 3.0), m_stone_smooth, bevel=0.01)
nx = xs(170, LB_Y)
nw = 1.05
npts, _ = pointed_arch_pts(nw, 2.35, 0.25, base=0.8)
boolean(lbwall, prism("NicheCut", npts, 0.42, (nx, LB_Y - 0.02, 0.0), None))
box("NicheBack", (nw, 0.02, 3.0), (nx, LB_Y + 0.4, 2.0), noisy("NicheStucco", (0.42, 0.32, 0.22), var=0.1, rough=0.9, scale=20, bump=0.3), bevel=0)
nframe = prism("NicheFrame", pointed_arch_pts(nw + 0.18, 2.35, 0.25, base=0.72)[0], 0.05, (nx, LB_Y - 0.03, 0.0), m_dark_wood)
boolean(nframe, prism("NicheFrameCut", npts, 0.3, (nx, LB_Y - 0.2, 0.0), None))
jars = [glazed("GlazeTeal", (0.03, 0.22, 0.24), (0.8, 0.75, 0.6)), glazed("GlazeCobalt", (0.86, 0.84, 0.78), (0.04, 0.1, 0.4), bands=9), glazed("GlazeGreen", (0.1, 0.2, 0.12), (0.7, 0.55, 0.25))]
for k, zz in enumerate((0.8, 1.38, 1.96)):
    box(f"Shelf{k}", (nw - 0.02, 0.4, 0.035), (nx, LB_Y + 0.2, zz), m_dark_wood, bevel=0.004)
    x0 = nx - nw / 2 + 0.06
    row_items = ["jar", "scrolls", "books", "jar2"] if k == 0 else (["books", "ewer", "scrolls"] if k == 1 else ["scrolls", "jar", "books"])
    slot = (nw - 0.12) / len(row_items)
    for i, it in enumerate(row_items):
        cx_ = x0 + slot * (i + 0.5)
        z0 = zz + 0.0175
        if it in ("jar", "jar2"):
            h = rng.uniform(0.26, 0.36) if it == "jar" else 0.22
            lathe(f"NJar{k}{i}", [(0, 0), (0.05, 0), (0.1, h * 0.35), (0.095, h * 0.6), (0.05, h * 0.85), (0.04, h * 0.95), (0.05, h), (0, h)], (cx_, LB_Y + 0.2, z0), jars[(k + i) % 3])
        elif it == "ewer":
            lathe(f"NEwer{k}{i}", [(0, 0), (0.05, 0), (0.07, 0.08), (0.06, 0.16), (0.025, 0.22), (0.022, 0.3), (0.035, 0.32), (0, 0.32)], (cx_, LB_Y + 0.2, z0), m_brass)
        elif it == "scrolls":
            for s in range(6):
                rr = rng.uniform(0.022, 0.032)
                row, col = divmod(s, 3)
                cyl(f"NScroll{k}{i}{s}", rr, 0.3, (cx_ - 0.07 + col * 0.068 + row * 0.03, LB_Y + 0.2, z0 + rr + row * 0.055), m_scrollp, rot=(math.radians(90), 0, rng.uniform(-0.15, 0.15)))
        else:
            xx = cx_ - 0.1
            while xx < cx_ + 0.1:
                bw_, bh_ = rng.uniform(0.035, 0.06), rng.uniform(0.2, 0.3)
                box(f"NBook{k}{i}{xx:.2f}", (bw_, 0.24, bh_), (xx + bw_ / 2, LB_Y + 0.22, z0 + bh_ / 2), m_leather if rng.random() < 0.6 else m_leather2, rot=(0, rng.uniform(-0.05, 0.05), 0), bevel=0.005)
                xx += bw_ + 0.004
# wall lantern on an iron bracket, left of the niche
lp_ = on_y(-40, 140, LB_Y - 0.3)
box("Bracket", (0.03, 0.34, 0.03), (lp_.x, LB_Y - 0.15, lp_.z + 0.5), solid("Iron", (0.04, 0.035, 0.03), 0.5, 1.0), bevel=0.005)
lantern((lp_.x, LB_Y - 0.3, lp_.z), chain_top=lp_.z + 0.35, watts=60, s=1.25)
hl_ = on_y(1000, 230, 3.0)
lantern((hl_.x, 3.0, hl_.z), chain_top=4.5, watts=40, s=0.95)
# a carved stucco / lattice panel on the left-bay wall, right of the niche
px_ = xs(360, LB_Y)
plane("LBPanel", (0.34, 2.1), (px_, LB_Y - 0.01, 2.2), obj_img("LBCarve", tx("star_lattice.png"), 4.0, rough=0.85, bump=0.8, color=(0.5, 0.4, 0.29), noncolor=True, flat=True), rot=(math.radians(90), 0, 0))

# centre bay (far wall): tall carved wooden screen, bales, jars, a potted palm
cp = xs(790, WALL_Y)
box("ScreenFrame", (0.95, 0.06, 2.1), (cp, WALL_Y - 0.03, 2.0), m_dark_wood, bevel=0.01)
plane("ScreenLattice", (0.85, 2.0), (cp, WALL_Y - 0.08, 2.0), obj_img("Lattice", tx("star_lattice.png"), 2.4, rough=0.55, bump=0.6, alpha_from="color", color=(0.14, 0.075, 0.035), noncolor=True, flat=True), rot=(math.radians(90), 0, 0))
plane("ScreenGlow", (0.85, 2.0), (cp, WALL_Y - 0.065, 2.0), emission("ScreenGlowE", (1.0, 0.56, 0.24), 0.6), rot=(math.radians(90), 0, 0))
plane("Rug", (2.6, 1.7), (cp + 0.2, 2.35, 0.004), image_mat("RugM", tx("rug.png"), rough=0.95), rot=(0, 0, 0.04))
plane("TileDado", (5.0, 0.28), (cp, WALL_Y - 0.01, 0.95), obj_img("Dado", tx("tile_band.png"), 1.6, rough=0.3, bump=0.02, flat=True), rot=(math.radians(90), 0, 0))
for i, (sx_, yy, sz) in enumerate(((640, 2.8, (0.7, 0.5, 0.45)), (700, 2.95, (0.6, 0.5, 0.4)), (660, 2.85, (0.55, 0.45, 0.38)))):
    bx = xs(sx_, yy)
    zb = 0.0 if i < 2 else 0.45
    bl = box(f"Bale{i}", sz, (bx + (0.35 if i == 1 else 0), yy, zb + sz[2] / 2), m_burlap, rot=(0, 0, rng.uniform(-0.2, 0.2)), bevel=0.14, segs=6)
    for k in (-1, 1):
        box(f"BaleRope{i}{k}", (sz[0] + 0.01, 0.02, sz[2] + 0.01), (bl.location.x + k * sz[0] * 0.22, yy, bl.location.z), m_rope, rot=(0, math.radians(90), bl.rotation_euler.z), bevel=0.008)
jx = xs(1000, 3.0)
lathe("BigJar", [(0, 0), (0.12, 0), (0.24, 0.2), (0.26, 0.42), (0.18, 0.66), (0.11, 0.74), (0.13, 0.8), (0, 0.8)], (jx, 3.0, 0.0), glazed("GlazeBlack", (0.03, 0.03, 0.035), (0.35, 0.25, 0.12), bands=4))
pp = xs(880, 2.9)
lathe("PalmPot", [(0, 0), (0.14, 0), (0.22, 0.3), (0.2, 0.42), (0, 0.42)], (pp, 2.9, 0.0), glazed("PotGlaze", (0.06, 0.08, 0.07), (0.3, 0.2, 0.1)))
leaf_m = image_mat("FrondM", tx("frond.png"), rough=0.55, alpha=True)
for k in range(14):
    a = k * 2.4 + rng.uniform(-0.2, 0.2)
    L = rng.uniform(1.0, 1.35)
    el = math.radians(rng.uniform(30, 72))
    fr = plane(f"Frond{k}", (L * 0.33, L), (0, 0, 0), leaf_m, subdiv=12)
    d = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
    fr.location = Vector((pp, 2.9, 0.75)) + d * L * 0.5
    fr.rotation_mode = "QUATERNION"
    fr.rotation_quaternion = Vector((0, 1, 0)).rotation_difference(d) @ Quaternion((0, 1, 0), rng.uniform(-0.6, 0.6))
    bend(fr, math.radians(-45), "Y")
cyl("PalmStem", 0.02, 0.5, (pp, 2.9, 0.62), noisy("Stem", (0.2, 0.14, 0.08), rough=0.9, scale=80, bump=0.4))

# the carved chair behind the desk (the merchant has just stood up)
ch = on_z(600, 640, 0.0)
chy = 1.25
chx = ch.x
for s_ in (-1, 1):
    box(f"ChairPost{s_}", (0.05, 0.05, 1.05), (chx + s_ * 0.27, chy + 0.22, 0.525), m_dark_wood, bevel=0.008)
    box(f"ChairLeg{s_}", (0.05, 0.05, 0.46), (chx + s_ * 0.27, chy - 0.22, 0.23), m_dark_wood, bevel=0.008)
box("ChairSeat", (0.6, 0.5, 0.05), (chx, chy, 0.48), m_dark_wood, bevel=0.01)
box("ChairRail", (0.6, 0.05, 0.08), (chx, chy + 0.22, 1.02), m_dark_wood, bevel=0.01)
plane("ChairBack", (0.5, 0.48), (chx, chy + 0.22, 0.76), obj_img("ChairLattice", tx("star_lattice.png"), 7.0, rough=0.5, bump=0.4, alpha_from="color", color=(0.13, 0.07, 0.035), noncolor=True, flat=True), rot=(math.radians(90), 0, 0))
# cu = box("Cushion", (0.52, 0.44, 0.07), (chx, chy - 0.01, 0.54), cloth("CushionCloth", (0.28, 0.04, 0.03), sheen=0.6), bevel=0.03, segs=4)

# ───────────────────────── beyond the arch: terrace, market, the Tigris & the city ─────────────────────────
box("Terrace", (16, 3.0, 0.05), (ac, WALL_Y + WALL_T + 1.5, -0.025), m_floor, bevel=0)
PY = WALL_Y + 2.5
box("Parapet", (16, 0.3, 0.42), (ac, PY, 0.21), noisy("ParapetStone", (0.3, 0.23, 0.17), var=0.1, rough=0.85, scale=6, bump=0.25), bevel=0.02)
box("ParapetCap", (16, 0.36, 0.05), (ac, PY, 0.445), m_stone_smooth, bevel=0.01)
# floor lantern on a pedestal just inside the arch
for i, fx in enumerate((xl + 0.7, xl + 1.7)):
    fp = on_y(1250 + i * 330, 400, PY).x
    lathe(f"ParaLampBase{i}", [(0, 0), (0.07, 0), (0.05, 0.1), (0, 0.1)], (fp, PY, 0.47), m_brass_dark, segs=16)
    sphere(f"ParaLamp{i}", 0.05, (fp, PY, 0.6), emission("ParaLampE", (1.0, 0.6, 0.26), 30), segs=12).visible_shadow = False
    point((fp, PY - 0.05, 0.62), (1.0, 0.6, 0.28), 12, radius=0.05, name=f"ParaL{i}")
ppx = on_y(1240, 400, PY - 0.5).x
fl = (xl + 0.35, WALL_Y - 0.3)
lathe("Pedestal", [(0, 0), (0.16, 0), (0.16, 0.06), (0.09, 0.12), (0.07, 0.8), (0.12, 0.86), (0.12, 0.9), (0, 0.9)], (fl[0], fl[1], 0.0), m_dark_wood)
lantern((fl[0], fl[1], 0.98), chain_top=0.981, watts=45, s=1.05)

GROUND = -0.2
box("Plaza", (120, 70, 0.1), (ac + 20, PY + 38, GROUND - 0.05), noisy("PlazaEarth", (0.4, 0.32, 0.22), var=0.12, rough=0.95, scale=0.8, bump=0.3), bevel=0)
m_wood = noisy("OldTimber", (0.2, 0.13, 0.08), var=0.15, rough=0.85, scale=20, bump=0.4)
cloths = [cloth(f"Awn{i}", c) for i, c in enumerate([(0.42, 0.08, 0.05), (0.55, 0.36, 0.1), (0.08, 0.13, 0.28), (0.6, 0.52, 0.4)])]
xa0, xa1 = xs(1260, 40), xs(1760, 40)
for i in range(6):
    sy_ = 16 + i * 4.0 + rng.uniform(-1, 1)
    sx_ = xs(rng.uniform(1480, 1760), sy_)
    aw_ = plane(f"Awning{i}", (2.4, 1.6), (sx_, sy_, 2.0), cloths[i % 4], rot=(math.radians(-12), 0, rng.uniform(-0.2, 0.2)), subdiv=12)
    aw_.modifiers.new("sol", "SOLIDIFY").thickness = 0.01
    for pxo in (-1.1, 1.1):
        cyl(f"Pole{i}{pxo}", 0.035, 2.5, (sx_ + pxo, sy_ - 0.7, GROUND + 1.25), m_wood)
    box(f"Stall{i}", (2.0, 0.8, 0.8), (sx_, sy_, GROUND + 0.4), m_wood, bevel=0.02)
    for k in range(4):
        lathe(f"Goods{i}{k}", [(0, 0), (0.18, 0.02), (0.22, 0.2), (0.16, 0.4), (0, 0.38)], (sx_ - 0.7 + k * 0.45, sy_ - 0.55, GROUND), noisy(f"Gd{i}{k}", rng.choice([(0.6, 0.45, 0.28), (0.62, 0.3, 0.1), (0.5, 0.15, 0.08)]), rough=0.9, scale=60, bump=0.3), segs=20)
    sphere(f"StallLamp{i}", 0.1, (sx_ + 0.6, sy_ - 0.5, GROUND + 1.8), emission(f"SLE{i}", (1.0, 0.6, 0.25), 40), segs=16).visible_shadow = False
    point((sx_ + 0.6, sy_ - 0.5, GROUND + 1.75), (1.0, 0.6, 0.28), 90, radius=0.1, name=f"StallL{i}")
for i in range(22):
    py_ = rng.uniform(13, 55)
    px_ = xs(rng.uniform(1230, 1760), py_)
    figure(f"Person{i}", (px_, py_, GROUND), rng.uniform(1.62, 1.82), robe=rng.choice([(0.72, 0.68, 0.6), (0.25, 0.2, 0.16), (0.2, 0.25, 0.35), (0.5, 0.35, 0.2), (0.3, 0.1, 0.07), (0.62, 0.58, 0.5)]),
           head=rng.choice(["turban", "turban", "keffiyeh"]), pose=rng.choice(["stand", "stand", "reach"]), facing=rng.uniform(0, 6.28),
           head_color=rng.choice([(0.85, 0.82, 0.74), (0.3, 0.25, 0.2), (0.7, 0.62, 0.45)]))
for i, (sx_, py_, h_) in enumerate(((1250, 26, 10), (1700, 34, 12), (1450, 70, 11), (1620, 90, 13))):
    palm(f"Palm{i}", (xs(sx_, py_), py_, GROUND), h_, lean=rng.uniform(-0.08, 0.08), seed=i)
# the quay and the river
RIVER_Z = -2.2
box("QuayWall", (400, 1.0, 2.0), (ac + 60, 72, GROUND - 1.0), m_stone_smooth, bevel=0.05)
plane("Tigris", (900, 500), (ac + 60, 322, RIVER_Z), water())
rng2 = random.Random(8)
hull_m = noisy("Hull", (0.12, 0.08, 0.05), rough=0.7, scale=10, bump=0.2)
sail_m = cloth("Sail", (0.75, 0.66, 0.5), sheen=0.3)
for i in range(7):
    by_ = rng2.uniform(90, 230)
    bx_ = xs(rng2.uniform(1230, 1760), by_)
    hl = sphere(f"Boat{i}", 1.0, (bx_, by_, RIVER_Z + 0.1), hull_m, scale=(4.5, 1.3, 0.8))
    boolean(hl, box(f"BoatCut{i}", (12, 4, 2), (bx_, by_, RIVER_Z + 1.1), None, bevel=0))
    cyl(f"Mast{i}", 0.08, 7, (bx_, by_, RIVER_Z + 3.5), hull_m)
    prism(f"SailTri{i}", [(-3.5, 0), (2.5, 1.2), (-2.0, 6.5)], 0.05, (bx_, by_, RIVER_Z + 1.2), sail_m, rot=(0, 0, rng2.uniform(-0.3, 0.3)))
    sphere(f"BoatLamp{i}", 0.25, (bx_ + 2.5, by_, RIVER_Z + 1.5), emission(f"BLE{i}", (1.0, 0.6, 0.25), 80), segs=12)
# far bank: the city — domes, minarets, houses with lamplit windows, a pontoon bridge
FAR = 260
box("FarBank", (1200, 60, 3.0), (ac + 60, FAR + 20, RIVER_Z + 1.0), m_stone_smooth, bevel=0)
stone_far = noisy("FarStone", (0.5, 0.4, 0.33), var=0.08, rough=0.9, scale=0.2, bump=0.1)
for i in range(70):
    fy = rng.uniform(FAR, FAR + 120)
    fxx = xs(rng.uniform(1100, 1900), fy, 300)
    bw_, bd_, bh_ = rng.uniform(6, 16), rng.uniform(6, 14), rng.uniform(6, 22)
    box(f"FarHouse{i}", (bw_, bd_, bh_), (fxx, fy, RIVER_Z + 2.5 + bh_ / 2), facade(f"Fac{i}", (0.34, 0.27, 0.24), seed=i * 3.1, strength=rng.uniform(4, 9)), bevel=0.2)
glaze_blue = noisy("DomeGlaze", (0.05, 0.12, 0.3), var=0.1, rough=0.25, scale=0.3, bump=0.05, coat=0.8)
gilt = noisy("DomeGilt", (0.7, 0.5, 0.2), var=0.1, rough=0.3, scale=0.3, bump=0.05, metal=1.0)
domes = ((1560, FAR + 60, 34, 22, glaze_blue), (1330, FAR + 90, 16, 16, glaze_blue), (1700, FAR + 110, 14, 14, gilt), (1450, FAR + 150, 12, 18, stone_far))
for i, (sx_, fy, r, dh, mm) in enumerate(domes):
    fxx = xs(sx_, fy, 300)
    box(f"Hall{i}", (r * 2.6, r * 2.2, dh), (fxx, fy, RIVER_Z + 2.5 + dh / 2), facade(f"HallF{i}", (0.42, 0.34, 0.28), strength=5, win=(3.0, 4.0)), bevel=0.3)
    dome(f"Dome{i}", (fxx, fy, RIVER_Z + 2.5 + dh), r, r * 0.25, mm)
    sphere(f"DomeFinial{i}", r * 0.06, (fxx, fy, RIVER_Z + 2.5 + dh + r * 1.45), gilt)
for i, (sx_, fy, h) in enumerate(((1500, FAR + 40, 75), (1660, FAR + 45, 85), (1260, FAR + 70, 62), (1390, FAR + 120, 70), (1740, FAR + 80, 60), (1180, FAR + 130, 55))):
    fxx = xs(sx_, fy, 300)
    base = RIVER_Z + 2.5
    cyl(f"MinShaft{i}", 2.2, h, (fxx, fy, base + h / 2), stone_far, segs=24, r2=1.6)
    for k, t in enumerate((0.62, 0.86)):
        cyl(f"MinBalc{i}{k}", 3.0 - k * 0.5, 1.2, (fxx, fy, base + h * t), facade(f"MinBF{i}{k}", (0.45, 0.36, 0.28), strength=8, win=(1.0, 1.2)), segs=24)
    cyl(f"MinTop{i}", 1.4, 6, (fxx, fy, base + h + 3), stone_far, segs=16, r2=0.1)
# bridge of boats with lamps
by_ = FAR - 60
box("Bridge", (900, 4, 0.8), (ac + 60, by_, RIVER_Z + 0.9), noisy("BridgeWood", (0.15, 0.1, 0.06), rough=0.8, scale=2, bump=0.2), rot=(0, 0, 0.06), bevel=0)
for i in range(60):
    x_ = ac - 200 + i * 9
    sphere(f"BridgeLamp{i}", 0.35, (x_, by_ + (x_ - ac - 60) * 0.06, RIVER_Z + 2.4), emission("BridgeLampE", (1.0, 0.62, 0.28), 60), segs=10)
# waterfront lights on the far bank
for i in range(160):
    fy = rng.uniform(FAR - 5, FAR + 8)
    fxx = xs(rng.uniform(1100, 1900), fy, 300)
    sphere(f"BankLamp{i}", rng.uniform(0.25, 0.5), (fxx, fy, RIVER_Z + rng.uniform(2.6, 5)), emission("BankLampE", (1.0, 0.6, 0.26), 70), segs=8)

# sky: a painted dusk backdrop (horizon glow sits just behind the skyline) + matching world light
sk = on_y(1470, 400, 1400)
plane("DuskSky", (3000, 1500), (sk.x, 1400, 750), image_mat("DuskSkyM", tx("dusk_sky.png"), emit=1.7, rough=1), rot=(math.radians(90), 0, 0))
gradient_sky([(-0.2, (0.05, 0.03, 0.04)), (0.0, (0.6, 0.35, 0.3)), (0.08, (0.35, 0.22, 0.35)), (0.3, (0.1, 0.09, 0.2)), (0.7, (0.03, 0.03, 0.08))], 0.7)
volume_box((700, 480, 160), (ac + 60, 250, 60), 0.0002, (1.0, 0.78, 0.7), 0.2, name="OutsideHaze")
volume_box((9.0, WALL_Y + 0.8 + 0.8, 4.0), (0, (WALL_Y - 0.8) / 2, 2.0), 0.0022, (1.0, 0.86, 0.7), 0.6)
dust(900, (0.3, 1.6, 1.5), (2.4, 2.4, 1.6), radius=0.0007, seed=3, bright=0.35)
# the evening sky pouring in through the arch (cool) and warm lamplight bounce
area((ac, WALL_Y + 0.1, 1.6), (0.8, 0.55, 0.62), 25, (aw * 0.9, 2.6), rot=(math.radians(-90), 0, 0), name="ArchSky")
fill_ = area((-1.0, 0.3, 3.2), (1.0, 0.62, 0.34), 8, (2.0, 1.2), rot=(0, 0, 0), name="WarmTop")
fill_.data.use_shadow = False
area((0.8, -1.5, 2.6), (0.6, 0.55, 0.65), 2, (3, 1), rot=(math.radians(50), 0, 0), name="FrontFill")

# ───────────────────────── the desk: a merchant's account at dusk ─────────────────────────
# ornate brass-bound chest, far left
cx0 = on_z(-40, 665)
chest = box("Chest", (0.34, 0.24, 0.2), (cx0.x, cx0.y, DESK_Z + 0.1), obj_img("ChestCarve", tx("star_lattice.png"), 6.0, rough=0.6, bump=0.08, color=(0.03, 0.016, 0.008), noncolor=True), rot=(0, 0, 0.12), bevel=0.01)
for s_ in (-1, 1):
    box(f"ChestBand{s_}", (0.025, 0.25, 0.21), (cx0.x + s_ * 0.14 * math.cos(0.12), cx0.y + s_ * 0.14 * math.sin(0.12), DESK_Z + 0.1), m_brass_dark, rot=(0, 0, 0.12), bevel=0.004)
box("ChestLid", (0.36, 0.26, 0.04), (cx0.x, cx0.y, DESK_Z + 0.22), m_dark_wood, rot=(0, 0, 0.12), bevel=0.01)
# candle on a brass dish, left
cpos = on_z(330, 700)
lathe("CandleDish", [(0, 0), (0.07, 0), (0.085, 0.012), (0.09, 0.02), (0.084, 0.02), (0.065, 0.008), (0, 0.008)], (cpos.x, cpos.y, DESK_Z), m_brass)
top_z = candle((cpos.x, cpos.y, DESK_Z + 0.008), height=0.12 if VARIANT == "abbasid" else 0.085, r=0.022, holder=False, lit=False)
flame((cpos.x, cpos.y, top_z + 0.006), watts=9)
for _n in ("Candle", "Wick"):
    bpy.data.objects[_n].visible_shadow = False
for k, (dx, dz) in enumerate(((0.021, -0.02), (-0.017, -0.04))):
    sphere(f"Drip{k}", 0.004, (cpos.x + dx, cpos.y - 0.01, top_z + dz), noisy("DripWax", (0.93, 0.86, 0.7), rough=0.3, sss=0.6), scale=(0.8, 0.8, 2.6)).visible_shadow = False
# a stack of bound registers by the candle
bk = on_z(90, 760)
for i, (h, m_) in enumerate(((0.045, m_leather), (0.04, m_leather2), (0.035, m_leather))):
    box(f"Register{i}", (0.2 - i * 0.015, 0.15 - i * 0.01, h * 0.8), (bk.x + i * 0.01, bk.y, DESK_Z + 0.8 * sum((0.045, 0.04, 0.035)[:i]) + h * 0.4), m_, rot=(0, 0, 0.1 - i * 0.08), bevel=0.006, segs=3)

# the account sheet (torn, aged) with an earlier sheet beneath
acc = tx("account_abbasid.png")
under, _, _, _ = paper_sheet("UnderSheet", [(1090, 690), (1300, 695), (1320, 790), (1080, 790)], acc, curl=math.radians(2), mat=paper_alpha("UnderM", tx("account_abbasid.png")))
under.rotation_euler = (0, 0, math.radians(-8))
page, pw, pd, (pcx, pcy) = paper_sheet("Account", [(790, 715), (1150, 715), (1190, 905), (740, 905)], acc, curl=math.radians(4), mat=paper_alpha("AccountM", acc))
page.location.z += 0.002
# glass inkwell, reed pen
ip = on_z(1235, 715)
ink_glass = glass("InkGlass", (0.12, 0.1, 0.09), 0.03)
box("Inkwell", (0.07, 0.07, 0.06), (ip.x, ip.y, DESK_Z + 0.03), ink_glass, bevel=0.01, segs=3)
box("InkInside", (0.06, 0.06, 0.04), (ip.x, ip.y, DESK_Z + 0.022), solid("InkBlack", (0.005, 0.004, 0.003), 0.05), bevel=0.008)
cyl("InkNeck", 0.018, 0.018, (ip.x, ip.y, DESK_Z + 0.068), ink_glass, bevel=0.003)
reed = noisy("Reed", (0.5, 0.33, 0.15), var=0.12, rough=0.45, scale=200, bump=0.1, coat=0.3)
row_v_top = (340 + 5 * 112 + 10) / 1500
line_y = pcy + (0.5 - row_v_top) * pd
line_pts = [(pcx + (u - 0.5) * pw, line_y, DESK_Z + 0.004) for u in [0.9 - i * 0.05 for i in range(9)]]
if VARIANT == "record":
    tip = Vector(line_pts[6])
    dvec = Vector((0.04, -0.06, 0.09))
    q = cyl("Qalam", 0.0045, 0.26, tip + dvec.normalized() * 0.13, reed, r2=0.0025)
    q.rotation_mode = "QUATERNION"
    q.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(dvec)
else:
    rp = on_z(1180, 850)
    cyl("Qalam", 0.0045, 0.26, (rp.x, rp.y, DESK_Z + 0.0045), reed, rot=(0, math.radians(90), math.radians(28)), r2=0.0025)
# brass scales standing on a carved wooden box (right), silhouetted against the dusk
sb = on_z(1455, 690)
box("ScaleBox", (0.28, 0.17, 0.09), (sb.x, sb.y, DESK_Z + 0.045), obj_img("BoxCarve", tx("star_lattice.png"), 9.0, rough=0.4, bump=0.25, color=(0.1, 0.05, 0.025), noncolor=True), bevel=0.008)
box("ScaleBoxLid", (0.3, 0.19, 0.012), (sb.x, sb.y, DESK_Z + 0.096), m_dark_wood, bevel=0.004)
SC = 1.15
balance_scales((sb.x, sb.y, DESK_Z + 0.102), SC, m_brass)
coin_stack((sb.x - 0.175 * SC, sb.y, DESK_Z + 0.102 + 0.086 * SC), 4, r=0.014, t=0.0024, mat=m_gold, seed=11)
lathe("PanWeight", [(0, 0), (0.014, 0), (0.014, 0.016), (0.007, 0.02), (0.005, 0.026), (0, 0.028)], (sb.x + 0.175 * SC, sb.y, DESK_Z + 0.102 + 0.07 * SC), m_brass, segs=24)
# coins: stacks and a scatter, a brass dish of coins far right
g = on_z(1400, 800)
coin_stack((g.x, g.y, DESK_Z), 6, r=0.016, t=0.0026, mat=m_gold, seed=1)
coin_stack((g.x + 0.05, g.y + 0.02, DESK_Z), 3, r=0.017, t=0.0024, mat=m_silver, seed=2)
rs = random.Random(9)
for k in range(14):
    cm_ = m_gold if k % 3 else m_silver
    tilt = 0.3 if k in (4, 9) else 0.0
    cyl(f"Loose{k}", 0.016, 0.0024, (g.x - 0.08 + rs.uniform(-0.06, 0.12), g.y - 0.05 + rs.uniform(-0.05, 0.05), DESK_Z + 0.0013 + (0.004 if tilt else 0)), cm_, segs=40, bevel=0.0006, rot=(rs.uniform(-0.04, 0.04) + tilt, rs.uniform(-0.04, 0.04), rs.uniform(0, 6)))
dd = on_z(1640, 860)
lathe("CoinDish", [(0, 0), (0.09, 0), (0.11, 0.02), (0.115, 0.03), (0.108, 0.03), (0.085, 0.01), (0, 0.01)], (dd.x, dd.y, DESK_Z), m_brass_dark)
for k in range(10):
    a, rr = k * 2.3, 0.02 + (k % 4) * 0.018
    cyl(f"DishCoin{k}", 0.016, 0.0024, (dd.x + math.cos(a) * rr, dd.y + math.sin(a) * rr, DESK_Z + 0.013 + (k % 3) * 0.0025), m_gold, segs=32, bevel=0.0006, rot=(0.08 * (k % 2), 0.06, a))
weights_set(tuple(on_z(1300, 715)), m_brass, 1.0)
# rolled contract with a rope tie, far right
sp = on_z(1700, 720)
cyl("Contract", 0.04, 0.34, (sp.x, sp.y, DESK_Z + 0.04), m_scrollp, rot=(0, math.radians(90), math.radians(-35)))
for k in (-1, 1):
    tor = bpy.ops.mesh.primitive_torus_add(major_radius=0.042, minor_radius=0.004, location=(sp.x + k * 0.06 * math.cos(math.radians(-35)), sp.y + k * 0.06 * math.sin(math.radians(-35)), DESK_Z + 0.04), rotation=(0, math.radians(90), math.radians(-35)))
    bpy.context.active_object.data.materials.append(m_rope)

# ───────────────────────── camera ─────────────────────────
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (cam.location - Vector((pcx, pcy + 0.05, DESK_Z))).length
cam.data.dof.aperture_fstop = FSTOP
cam.data.dof.aperture_blades = 9
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT.replace(".png", ".json"), "w") as f:
    json.dump({"ink": stage_path(line_pts)}, f)
lib.render(OUT)
print("rendered", OUT)
