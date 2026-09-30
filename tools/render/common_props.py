"""Reusable props and architecture for the plates."""
import math
from mathutils import Vector
import lib
from lib import *


def pointed_arch_pts(width, spring, c_ratio=0.28, n=28, base=0.0):
    """2D outline (x, z) of a two-centred pointed arch, counter-clockwise, including jambs."""
    c = width * c_ratio
    r = width / 2 + c
    apex = spring + math.sqrt(r * r - c * c)
    pts = [(-width / 2, base), (width / 2, base), (width / 2, spring)]
    # right arc: centre (-c, spring) from angle 0 to angle where x=0
    a_end = math.acos(c / r)
    for i in range(1, n + 1):
        a = a_end * i / n
        pts.append((-c + r * math.cos(a), spring + r * math.sin(a)))
    # left arc: centre (+c, spring) from apex down to spring
    for i in range(n - 1, -1, -1):
        a = math.pi - a_end * i / n
        pts.append((c + r * math.cos(a), spring + r * math.sin(a)))
    pts[-1] = (-width / 2, spring)
    # dedupe apex
    out = []
    for p in pts:
        if not out or (abs(out[-1][0] - p[0]) > 1e-6 or abs(out[-1][1] - p[1]) > 1e-6):
            out.append(p)
    return out, apex


def wall_with_openings(name, width, height, thick, y, mat, openings, x0=0.0):
    """Back wall slab (front face at y) with through-openings: list of (pts2d, x, z_base, through_depth)."""
    wall = box(name, (width, thick, height), (x0, y + thick / 2, height / 2), mat, bevel=0)
    for i, (pts, ox, oz, depth) in enumerate(openings):
        cut = prism(f"{name}_cut{i}", pts, depth + 0.2, (ox, y - 0.1, oz), None)
        boolean(wall, cut)
    return wall


def candle(loc, height=0.16, r=0.018, holder=True, lit=True, brass_m=None, watts=4.0):
    x, y, z = loc
    wax = noisy("Wax", (0.93, 0.86, 0.7), var=0.03, rough=0.35, scale=30, bump=0.05, sss=0.6)
    wax.node_tree.nodes["Principled BSDF"].inputs["Subsurface Radius"].default_value = (0.02, 0.012, 0.006)
    bm_ = brass_m or brass()
    h0 = z
    if holder:
        lathe("CandleHolder", [(0.0, 0), (0.06, 0), (0.062, 0.006), (0.05, 0.012), (0.018, 0.02), (0.014, 0.05), (0.026, 0.058), (0.028, 0.066), (0.0, 0.066)], (x, y, z), bm_)
        h0 = z + 0.066
    # slightly melted top
    lathe("Candle", [(0, 0), (r, 0), (r, height - 0.006), (r * 0.9, height - 0.002), (r * 0.6, height - 0.004), (0, height - 0.006)], (x, y, h0), wax)
    cyl("Wick", 0.0012, 0.012, (x, y, h0 + height), solid("Wick", (0.02, 0.015, 0.01), 0.9))
    if lit:
        flame = sphere("Flame", 0.006, (x, y, h0 + height + 0.018), emission("FlameM", (1.0, 0.62, 0.22), 60), scale=(1, 1, 2.6))
        flame.visible_shadow = False
        core = sphere("FlameCore", 0.003, (x, y, h0 + height + 0.012), emission("FlameCoreM", (1.0, 0.85, 0.6), 120), scale=(1, 1, 2))
        core.visible_shadow = False
        point((x, y, h0 + height + 0.02), (1.0, 0.58, 0.25), watts, radius=0.012, name="CandleLight")
    return h0 + height


def lantern(loc, chain_top=3.4, watts=18, color=(1.0, 0.6, 0.28), s=1.0):
    x, y, z = loc
    b = brass("LanternBrass", (0.62, 0.43, 0.18), 0.35)
    cyl("Chain", 0.004, chain_top - z, (x, y, (chain_top + z) / 2 + 0.3 * s), solid("Iron", (0.05, 0.045, 0.04), 0.5, 1.0))
    body = lathe("Lantern", [(r * s, h * s) for r, h in [(0.0, -0.08), (0.03, -0.08), (0.09, 0.0), (0.12, 0.1), (0.11, 0.2), (0.06, 0.28), (0.02, 0.32), (0.0, 0.33)]], (x, y, z), b, close_top=True)
    # pierced pattern: emission shell slightly inside, seen through holes simulated with glass panels
    lathe("LanternGlow", [(r * s, h * s) for r, h in [(0.0, -0.05), (0.07, 0.0), (0.1, 0.1), (0.095, 0.19), (0.05, 0.26), (0.0, 0.28)]], (x, y, z), emission("LanternGlowM", color, 8))
    # cut windows in the brass body using a ring of boxes (pierced metalwork)
    for i in range(10):
        a = 2 * math.pi * i / 10
        cut = box(f"lcut{i}", (0.03 * s, 0.12 * s, 0.09 * s), (x + math.cos(a) * 0.11 * s, y + math.sin(a) * 0.11 * s, z + 0.12 * s), None, rot=(0, 0, a + math.pi / 2), bevel=0)
        boolean(body, cut)
    point((x, y, z + 0.1 * s), color, watts, radius=0.05 * s, name="LanternLight")
    return body


def balance_scales(loc, s=1.0, bm_=None):
    x, y, z = loc
    b = bm_ or brass()
    lathe("ScaleBase", [(0, 0), (0.07 * s, 0), (0.07 * s, 0.008 * s), (0.045 * s, 0.02 * s), (0.012 * s, 0.03 * s), (0, 0.03 * s)], (x, y, z), b)
    cyl("ScalePost", 0.007 * s, 0.34 * s, (x, y, z + 0.2 * s), b)
    sphere("ScaleKnob", 0.013 * s, (x, y, z + 0.38 * s), b)
    beam = cyl("ScaleBeam", 0.005 * s, 0.36 * s, (x, y, z + 0.355 * s), b, rot=(0, math.radians(92), 0))
    for side, tilt in ((-1, 0.012), (1, -0.012)):
        px = x + side * 0.175 * s
        pz = z + 0.355 * s + side * tilt * 3 * s * -1
        for k in range(3):
            a = 2 * math.pi * k / 3
            top = Vector((px, y, pz))
            bot = Vector((px + math.cos(a) * 0.055 * s, y + math.sin(a) * 0.055 * s, z + 0.1 * s + tilt * s))
            mid = (top + bot) / 2
            dvec = bot - top
            ch = cyl(f"Chain{side}{k}", 0.0012 * s, dvec.length, mid, solid("ChainM", (0.4, 0.3, 0.14), 0.4, 1.0))
            ch.rotation_mode = "QUATERNION"
            ch.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(dvec)
        lathe(f"Pan{side}", [(0, 0), (0.035 * s, 0.004 * s), (0.06 * s, 0.018 * s), (0.062 * s, 0.022 * s), (0.058 * s, 0.021 * s), (0.034 * s, 0.008 * s), (0, 0.006 * s)], (px, y, z + 0.08 * s + tilt * s), b, close_top=False)


def coin_stack(loc, n, r=0.012, t=0.0022, mat=None, jitter=0.0012, seed=0):
    import random
    rng = random.Random(seed)
    x, y, z = loc
    for i in range(n):
        cyl(f"Coin{seed}_{i}", r, t, (x + rng.uniform(-jitter, jitter), y + rng.uniform(-jitter, jitter), z + t / 2 + i * t * 1.02), mat, segs=40, bevel=0.0006, rot=(rng.uniform(-0.03, 0.03), rng.uniform(-0.03, 0.03), rng.uniform(0, 6)))


def gold():
    return noisy("Gold", (0.95, 0.68, 0.28), var=0.05, rough=0.22, scale=120, bump=0.3, metal=1.0)


def silver():
    return noisy("Silver", (0.82, 0.82, 0.8), var=0.06, rough=0.3, scale=120, bump=0.3, metal=1.0)


def paper_sheet(name, corners_stage, texpath=None, thick=0.0008, curl=0.0, mat=None):
    """Place a sheet on the desk whose corners project to the given stage points (tl, tr, br, bl)."""
    pts = [on_z(sx, sy, DESK_Z + 0.001) for sx, sy in corners_stage]
    cx = sum(p.x for p in pts) / 4
    cy = sum(p.y for p in pts) / 4
    w = ((pts[1].x - pts[0].x) + (pts[2].x - pts[3].x)) / 2
    d = ((pts[0].y - pts[3].y) + (pts[1].y - pts[2].y)) / 2
    m = mat or (image_mat(name + "M", texpath, rough=0.75) if texpath else noisy(name + "M", (0.85, 0.8, 0.68), rough=0.8))
    ob = plane(name, (w, d), (cx, cy, DESK_Z + 0.0015), m, subdiv=24)
    sol = ob.modifiers.new("solid", "SOLIDIFY")
    sol.thickness = thick
    if curl:
        bend(ob, curl, "Y")
    return ob, w, d, (cx, cy)


def open_book(name, center, width, depth, texpath, cover_mat, lift=0.018, thick=0.022, rot_z=0.0):
    """Open bound book lying on the desk. Returns uv→world function for the page spread (u,v in 0..1, v=0 bottom/near)."""
    import bmesh
    cx, cy = center
    nx, ny = 48, 12
    bm = bmesh.new()
    uvl = bm.loops.layers.uv.new()
    verts = []
    def zf(u):
        a = abs(u * 2 - 1)  # 0 at spine, 1 at fore-edge
        return DESK_Z + thick + lift * (1 - math.exp(-7 * a)) - 0.004 * a ** 6
    for j in range(ny + 1):
        row = []
        for i in range(nx + 1):
            u, v = i / nx, j / ny
            row.append(bm.verts.new(((u - 0.5) * width, (v - 0.5) * depth, zf(u))))
        verts.append(row)
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
            for l, (ii, jj) in zip(f.loops, ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))):
                l[uvl].uv = (ii / nx, jj / ny)
    ob = lib._obj_from_bm(name, bm, image_mat(name + "M", texpath, rough=0.7), smooth=True)
    ob.location = (cx, cy, 0)
    ob.rotation_euler = (0, 0, rot_z)
    # page block edges
    for side in (-1, 1):
        box(name + f"Block{side}", (width / 2 - 0.004, depth - 0.006, thick), (cx + side * width / 4, cy, DESK_Z + thick / 2 + 0.001), noisy(name + "Edge", (0.86, 0.8, 0.68), rough=0.9, scale=300, bump=0.4), rot=(0, 0, rot_z), bevel=0.003)
    box(name + "Cover", (width + 0.03, depth + 0.02, 0.006), (cx, cy, DESK_Z + 0.003), cover_mat, rot=(0, 0, rot_z), bevel=0.002)
    def uv2w(u, v):
        from mathutils import Matrix
        p = Vector(((u - 0.5) * width, (v - 0.5) * depth, zf(u) + 0.0015))
        return Matrix.Rotation(rot_z, 4, "Z") @ p + Vector((cx, cy, 0))
    return ob, uv2w


def screen(name, center, w, h, texpath, emit=1.6, rot=(math.radians(90), 0, 0), glass=True):
    """Emissive display plane; returns (obj, uv→world)."""
    m = screen_mat(name + "M", texpath, emit, glass)
    ob = plane(name, (w, h), center, m, rot)
    def uv2w(u, v):
        return ob.matrix_world @ Vector(((u - 0.5) * w, (v - 0.5) * h, 0.0005))
    bpy.context.view_layer.update()
    return ob, uv2w


def room(wall_y, wall_mat, floor_mat, ceil_mat=None, height=3.0, width=12.0, side=4.3, wall_t=0.2):
    back = box("BackWall", (width, wall_t, height), (0, wall_y + wall_t / 2, height / 2), wall_mat, bevel=0)
    box("Floor", (width, 12, 0.05), (0, 1.0, -0.025), floor_mat, bevel=0)
    box("WallL", (0.2, 8, height), (-side, 0.5, height / 2), wall_mat, bevel=0)
    box("WallR", (0.2, 8, height), (side, 0.5, height / 2), wall_mat, bevel=0)
    if ceil_mat:
        box("Ceiling", (width, 8, 0.05), (0, 0.5, height), ceil_mat, bevel=0)
    return back


def window_cut(wall, x, z0, w, h, depth=0.6, y=None):
    cut = box("WinCut", (w, depth, h), (x, (y if y is not None else wall.location.y), z0 + h / 2), None, bevel=0)
    boolean(wall, cut)


def mullions(x, y, z0, w, h, cols, rows, mat, bar=0.03, frame=0.06):
    box("WinFrameT", (w + frame, 0.08, frame), (x, y, z0 + h), mat, bevel=0.003)
    box("WinFrameB", (w + frame, 0.12, frame), (x, y - 0.02, z0), mat, bevel=0.003)
    box("WinFrameL", (frame, 0.08, h), (x - w / 2, y, z0 + h / 2), mat, bevel=0.003)
    box("WinFrameR", (frame, 0.08, h), (x + w / 2, y, z0 + h / 2), mat, bevel=0.003)
    for i in range(1, cols):
        box(f"MulV{i}", (bar, 0.05, h), (x - w / 2 + i * w / cols, y, z0 + h / 2), mat, bevel=0.002)
    for j in range(1, rows):
        box(f"MulH{j}", (w, 0.05, bar), (x, y, z0 + j * h / rows), mat, bevel=0.002)


def panels(x0, x1, y, z0, z1, mat, n, inset=0.03, frame_mat=None):
    """Raised wood panelling (wainscot)."""
    box("WainBase", (x1 - x0, 0.03, z1 - z0), ((x0 + x1) / 2, y - 0.015, (z0 + z1) / 2), frame_mat or mat, bevel=0.002)
    pw = (x1 - x0) / n
    for i in range(n):
        box(f"Panel{i}", (pw - 0.08, 0.02, (z1 - z0) - 0.12), (x0 + pw * (i + 0.5), y - 0.035, (z0 + z1) / 2), mat, bevel=0.012, segs=3)
    box("Rail", (x1 - x0, 0.05, 0.05), ((x0 + x1) / 2, y - 0.03, z1), frame_mat or mat, bevel=0.01)
    box("Skirt", (x1 - x0, 0.04, 0.12), ((x0 + x1) / 2, y - 0.03, z0 + 0.06), frame_mat or mat, bevel=0.005)
