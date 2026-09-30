"""v3 refinement helpers: richer materials (dust, patina, wear, smudges) and 3D set dressing
(people, camels, palms, architecture) that replace flat cut-out cards."""
import math, os, random
import bpy, bmesh
from mathutils import Vector, Matrix
import lib
from lib import (_mat, _set, _bump, _ramp, _img_node, _obj_from_bm, TEX, box, cyl, sphere, lathe, plane,
                 solid, noisy, emission, bend, subsurf, point, area)


# ───────────────────────── materials ─────────────────────────
def _dust_mix(nt, b, base_socket, amount=0.12, color=(0.62, 0.58, 0.52), scale=90):
    """Fine dust settling on up-facing surfaces: lightens colour, raises roughness a touch."""
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(geo.outputs["Normal"], sep.inputs[0])
    up = nt.nodes.new("ShaderNodeMapRange")
    up.inputs["From Min"].default_value = 0.6
    up.inputs["From Max"].default_value = 1.0
    nt.links.new(sep.outputs["Z"], up.inputs["Value"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 12
    n.inputs["Roughness"].default_value = 0.7
    nr = nt.nodes.new("ShaderNodeMapRange")
    nr.inputs["From Min"].default_value = 0.45
    nr.inputs["From Max"].default_value = 0.75
    nt.links.new(n.outputs["Fac"], nr.inputs["Value"])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    nt.links.new(up.outputs["Result"], mul.inputs[0])
    nt.links.new(nr.outputs["Result"], mul.inputs[1])
    amt = nt.nodes.new("ShaderNodeMath")
    amt.operation = "MULTIPLY"
    nt.links.new(mul.outputs[0], amt.inputs[0])
    amt.inputs[1].default_value = amount
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    nt.links.new(amt.outputs[0], mix.inputs["Factor"])
    nt.links.new(base_socket, mix.inputs["A"])
    mix.inputs["B"].default_value = (*color, 1)
    nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    return amt.outputs[0]


def wood_rich(name, prefix, size=(3.2, 1.25), tint=0.9, coat=0.32, dust=0.06, bump=0.12):
    """Image wood + satin coat with fingerprint/wipe breakup + a whisper of settled dust."""
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size[0], 1 / size[1], 1)
    mp.inputs["Location"].default_value = (0.5, 0.5, 0)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    col = _img_node(nt, os.path.join(TEX, prefix + "_col.png"), coord=mp.outputs[0])
    rgh = _img_node(nt, os.path.join(TEX, prefix + "_rough.png"), True, mp.outputs[0])
    hgt = _img_node(nt, os.path.join(TEX, prefix + "_h.png"), True, mp.outputs[0])
    tintn = nt.nodes.new("ShaderNodeMix")
    tintn.data_type = "RGBA"
    tintn.blend_type = "MULTIPLY"
    tintn.inputs["Factor"].default_value = 1.0
    nt.links.new(col.outputs["Color"], tintn.inputs["A"])
    tintn.inputs["B"].default_value = (tint, tint, tint, 1)
    _dust_mix(nt, b, tintn.outputs["Result"], dust)
    nt.links.new(rgh.outputs["Color"], b.inputs["Roughness"])
    sm = _img_node(nt, os.path.join(TEX, "smudges.png"), True, mp.outputs[0])
    cr = _ramp(nt, sm.outputs["Color"], [(0.0, (0.1,) * 3), (1.0, (0.45,) * 3)])
    nt.links.new(cr.outputs["Color"], b.inputs["Coat Roughness"])
    _set(b, coat=coat)
    _bump(nt, b, hgt.outputs["Color"], bump, 0.0012)
    return m


def brass_aged(name="AgedBrass", color=(0.78, 0.55, 0.25), rough=0.3):
    """Brass with polished high points, brown-green patina in recesses and hand-worn roughness."""
    m, nt, b = _mat(name)
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    pr = nt.nodes.new("ShaderNodeMapRange")
    pr.inputs["From Min"].default_value = 0.46
    pr.inputs["From Max"].default_value = 0.56
    nt.links.new(geo.outputs["Pointiness"], pr.inputs["Value"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 18
    n.inputs["Detail"].default_value = 10
    nf = nt.nodes.new("ShaderNodeTexNoise")
    nf.inputs["Scale"].default_value = 260
    nf.inputs["Detail"].default_value = 6
    patchy = _ramp(nt, n.outputs["Fac"], [(0.35, (0.0, 0.0, 0.0)), (0.62, (1.0, 1.0, 1.0))])
    # patina colour in cavities & patches
    pat = nt.nodes.new("ShaderNodeMix")
    pat.data_type = "RGBA"
    nt.links.new(patchy.outputs["Color"], pat.inputs["Factor"])
    pat.inputs["A"].default_value = (*color, 1)
    pat.inputs["B"].default_value = (0.32, 0.26, 0.13, 1)
    cav = nt.nodes.new("ShaderNodeMix")
    cav.data_type = "RGBA"
    nt.links.new(pr.outputs["Result"], cav.inputs["Factor"])
    cav.inputs["A"].default_value = (0.14, 0.13, 0.07, 1)
    nt.links.new(pat.outputs["Result"], cav.inputs["B"])
    nt.links.new(cav.outputs["Result"], b.inputs["Base Color"])
    rr = _ramp(nt, nf.outputs["Fac"], [(0.3, (rough - 0.1,) * 3), (0.7, (rough + 0.12,) * 3)])
    rp = nt.nodes.new("ShaderNodeMix")
    rp.data_type = "RGBA"
    nt.links.new(patchy.outputs["Color"], rp.inputs["Factor"])
    nt.links.new(rr.outputs["Color"], rp.inputs["A"])
    rp.inputs["B"].default_value = (0.6, 0.6, 0.6, 1)
    nt.links.new(rp.outputs["Result"], b.inputs["Roughness"])
    _set(b, metal=1.0)
    _bump(nt, b, nf.outputs["Fac"], 0.05, 0.0008)
    return m


def paper_rich(name, texpath, rough=0.74, bump=0.35, sss=0.1):
    """Paper: image + fibre relief + slight cockling + softer roughness at worn edges."""
    m, nt, b = _mat(name)
    uv = nt.nodes.new("ShaderNodeTexCoord").outputs["UV"]
    t = _img_node(nt, texpath, coord=uv, extension="CLIP")
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
    fib = nt.nodes.new("ShaderNodeTexNoise")
    fib.inputs["Scale"].default_value = 1400
    fib.inputs["Detail"].default_value = 4
    cock = nt.nodes.new("ShaderNodeTexNoise")
    cock.inputs["Scale"].default_value = 9
    cock.inputs["Detail"].default_value = 3
    add = nt.nodes.new("ShaderNodeMath")
    add.operation = "ADD"
    nt.links.new(fib.outputs["Fac"], add.inputs[0])
    mc = nt.nodes.new("ShaderNodeMath")
    mc.operation = "MULTIPLY"
    nt.links.new(cock.outputs["Fac"], mc.inputs[0])
    mc.inputs[1].default_value = 3.0
    nt.links.new(mc.outputs[0], add.inputs[1])
    _set(b, rough=rough, sss=sss)
    b.inputs["Subsurface Radius"].default_value = (0.004, 0.003, 0.002)
    _bump(nt, b, add.outputs[0], bump, 0.0005)
    return m


def cloth(name, color, sheen=0.7, rough=0.9, weave=300):
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.inputs["Scale"].default_value = weave
    wv.inputs["Distortion"].default_value = 2
    nt.links.new(tc.outputs["Object"], wv.inputs["Vector"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 6
    ramp = _ramp(nt, n.outputs["Fac"], [(0.3, tuple(c * 0.75 for c in color)), (0.7, color)])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _set(b, rough=rough, sheen=sheen)
    _bump(nt, b, wv.outputs["Fac"], 0.15, 0.001)
    return m


def skin(name="Skin", tone=(0.45, 0.28, 0.18)):
    m, nt, b = _mat(name)
    _set(b, color=tone, rough=0.5, sss=0.25)
    b.inputs["Subsurface Radius"].default_value = (0.02, 0.008, 0.005)
    return m


# ───────────────────────── people & animals (seen out of focus) ─────────────────────────
def figure(name, loc, height=1.72, robe=(0.35, 0.3, 0.24), head="turban", pose="stand", facing=0.0, head_color=(0.8, 0.76, 0.66), skin_tone=(0.42, 0.27, 0.17)):
    """A dignified robed/suited person built from smooth primitives — for depth-of-field background life."""
    x, y, z = loc
    s = height / 1.72
    rot = Matrix.Rotation(facing, 4, "Z")
    root = bpy.data.objects.new(name, None)
    lib.link(root)
    root.location = loc
    root.rotation_euler = (0, 0, facing)
    cm = cloth(name + "Robe", robe)
    sk = skin(name + "Skin", skin_tone)
    prof = [(0.0, 0.0), (0.27, 0.0), (0.25, 0.4), (0.2, 0.85), (0.18, 1.05), (0.2, 1.3), (0.215, 1.41), (0.12, 1.47), (0.055, 1.5), (0.0, 1.5)]
    body = lathe(name + "Body", [(r * s, h * s) for r, h in prof], (0, 0, 0), cm, segs=40)
    body.scale = (1, 0.68, 1)
    body.parent = root
    subsurf(body, 1)
    hd = sphere(name + "Head", 0.1 * s, (0, 0, 1.6 * s), sk, scale=(0.88, 0.95, 1.12))
    hd.parent = root
    if head == "turban":
        t = sphere(name + "Turban", 0.112 * s, (0, 0, 1.67 * s), cloth(name + "TurbanC", head_color), scale=(1.05, 1.05, 0.8))
        t.parent = root
    elif head == "keffiyeh":
        t = sphere(name + "Kef", 0.118 * s, (0, 0.012 * s, 1.63 * s), cloth(name + "KefC", head_color), scale=(1.0, 1.08, 1.12))
        t.parent = root
    elif head == "hat":
        t = cyl(name + "Brim", 0.16 * s, 0.01 * s, (0, 0, 1.69 * s), cloth(name + "Felt", head_color))
        t2 = cyl(name + "Crown", 0.095 * s, 0.1 * s, (0, 0, 1.74 * s), cloth(name + "Felt2", head_color))
        t.parent = root
        t2.parent = root
    elif head == "hair":
        t = sphere(name + "Hair", 0.103 * s, (0, 0.01 * s, 1.64 * s), solid(name + "HairM", head_color, 0.6), scale=(0.9, 0.98, 1.0))
        t.parent = root
    # arms
    for side in (-1, 1):
        reach = pose == "reach" and side == 1
        sh = Vector((side * 0.2 * s, 0, 1.38 * s))
        el = sh + (Vector((side * 0.05 * s, -0.2 * s, -0.12 * s)) if reach else Vector((side * 0.05 * s, 0.0, -0.3 * s)))
        wr = el + (Vector((0, -0.26 * s, 0.02 * s)) if reach else Vector((0.0, -0.08 * s, -0.26 * s)))
        for a, bb, part in ((sh, el, "U"), (el, wr, "L")):
            v = bb - a
            c = cyl(f"{name}Arm{side}{part}", 0.05 * s if part == "U" else 0.042 * s, v.length, (a + bb) / 2, cm, segs=16)
            c.rotation_mode = "QUATERNION"
            c.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(v)
            c.parent = root
        hnd = sphere(f"{name}Hand{side}", 0.04 * s, wr, sk, segs=16)
        hnd.parent = root
    return root


def camel(name, loc, s=1.0, facing=0.0, load=True, rider=False, stride=0.0):
    x, y, z = loc
    root = bpy.data.objects.new(name, None)
    lib.link(root)
    root.location = loc
    root.rotation_euler = (0, 0, facing)
    hide = noisy(name + "Hide", (0.52, 0.4, 0.26), var=0.1, rough=0.9, scale=30, bump=0.3, sheen=0.4)
    parts = []
    parts.append(sphere(name + "Body", 0.55 * s, (0, 0, 1.45 * s), hide, scale=(1.0, 0.42, 0.5)))
    parts.append(sphere(name + "Hump", 0.3 * s, (0.05 * s, 0, 1.78 * s), hide, scale=(1.0, 0.7, 0.9)))
    # neck & head (walking toward -x)
    n1 = cyl(name + "Neck", 0.09 * s, 0.7 * s, (-0.72 * s, 0, 1.55 * s), hide, rot=(0, math.radians(-40), 0), r2=0.07 * s)
    parts.append(n1)
    parts.append(sphere(name + "Head", 0.13 * s, (-1.0 * s, 0, 1.88 * s), hide, scale=(1.5, 0.7, 0.75)))
    for i, (lx, ly) in enumerate(((-0.38, -0.14), (-0.38, 0.14), (0.4, -0.14), (0.4, 0.14))):
        sw = math.sin(stride + i * 1.7) * 0.12
        parts.append(cyl(f"{name}Leg{i}", 0.05 * s, 1.2 * s, ((lx + sw) * s, ly * s, 0.62 * s), hide, rot=(0, sw * 0.8, 0), r2=0.035 * s))
    if load:
        bag = cloth(name + "Bag", (0.3, 0.12, 0.07))
        for side in (-1, 1):
            parts.append(box(f"{name}Bag{side}", (0.4 * s, 0.14 * s, 0.35 * s), (0.1 * s, side * 0.27 * s, 1.55 * s), bag, bevel=0.04 * s, segs=3))
    if rider:
        fr = figure(name + "Rider", (0.05 * s, 0, 1.9 * s), 1.2 * s, robe=(0.25, 0.22, 0.2), head="turban")
        fr.parent = root
        fr.location = (0.05 * s, 0, 1.75 * s)
    for p in parts:
        p.parent = root
        p.location = Vector(p.location)
    return root


def palm(name, loc, h=7.0, lean=0.05, seed=0):
    rng = random.Random(seed)
    x, y, z = loc
    trunk_m = noisy(name + "Trunk", (0.28, 0.2, 0.13), var=0.15, rough=0.95, scale=12, bump=0.8)
    segs = 10
    top = Vector((x, y, z))
    for i in range(segs):
        a = top.copy()
        top = a + Vector((lean * h / segs, 0, h / segs))
        v = top - a
        c = cyl(f"{name}T{i}", 0.2 - i * 0.008, v.length * 1.02, (a + top) / 2, trunk_m, segs=14)
        c.rotation_mode = "QUATERNION"
        c.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(v)
    frond_m = noisy(name + "Frond", (0.12, 0.2, 0.08), var=0.15, rough=0.7, scale=40, bump=0.2, sss=0.15)
    for i in range(16):
        ang = i / 16 * 2 * math.pi + rng.uniform(-0.2, 0.2)
        f = plane(f"{name}F{i}", (0.55, 3.0), (top.x + math.cos(ang) * 1.3, top.y + math.sin(ang) * 1.3, top.z - 0.3), frond_m, rot=(math.radians(rng.uniform(55, 80)), 0, ang - math.pi / 2), subdiv=10)
        bend(f, math.radians(-50), "X")
        md = f.modifiers.new("taper", "SIMPLE_DEFORM")
        md.deform_method = "TAPER"
        md.factor = -0.8
        md.deform_axis = "Y"


def dome(name, loc, r, drum_h, mat, ribbed=False):
    x, y, z = loc
    cyl(name + "Drum", r, drum_h, (x, y, z + drum_h / 2), mat, segs=48)
    d = sphere(name + "Dome", r * 1.02, (x, y, z + drum_h), mat, segs=48, scale=(1, 1, 1.15))
    return d


def spiral_minaret(name, loc, base_r=6.0, h=36.0, turns=5, mat=None):
    """Samarra-style spiral minaret (Abbasid): stacked tapering drums with a spiral ramp."""
    x, y, z = loc
    steps = 40
    for i in range(steps):
        t = i / steps
        r = base_r * (1 - 0.72 * t)
        cyl(f"{name}C{i}", r, h / steps * 1.02, (x, y, z + h * t + h / steps / 2), mat, segs=40)
    ramp_m = mat
    for i in range(turns * 24):
        t = i / (turns * 24)
        a = t * turns * 2 * math.pi
        r = base_r * (1 - 0.72 * t) + 0.35
        box(f"{name}R{i}", (0.9, 0.9, 0.25), (x + math.cos(a) * r, y + math.sin(a) * r, z + h * t + 0.6), ramp_m, rot=(0, 0, a), bevel=0)
    cyl(name + "Lantern", base_r * 0.3, 3.0, (x, y, z + h + 1.5), mat, segs=24)


def weights_set(loc, mat, s=1.0):
    """Graded brass trade weights (nested cylinders with knobs)."""
    x, y, z = loc
    for i, r in enumerate((0.018, 0.015, 0.012, 0.009, 0.007)):
        cx = x + i * 0.034 * s
        lathe(f"Weight{i}", [(0, 0), (r * s, 0), (r * s, r * 1.2 * s), (r * 0.5 * s, r * 1.35 * s), (r * 0.35 * s, r * 1.8 * s), (0, r * 1.9 * s)], (cx, y, z), mat, segs=32)


def pouch(name, loc, mat, s=1.0):
    x, y, z = loc
    p = lathe(name, [(0, 0), (0.035 * s, 0.004 * s), (0.05 * s, 0.03 * s), (0.04 * s, 0.06 * s), (0.018 * s, 0.075 * s), (0.024 * s, 0.09 * s), (0, 0.092 * s)], (x, y, z), mat, segs=32)
    p.scale = (1.15, 0.9, 0.8)
    subsurf(p, 1)
    cyl(name + "Tie", 0.02 * s, 0.006 * s, (x, y, z + 0.068 * s * 0.8), solid(name + "Cord", (0.25, 0.12, 0.06), 0.8))
    return p
