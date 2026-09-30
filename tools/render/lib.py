"""
SIENA plate renderer — shared helpers.
One desk, one camera, many eras. Cycles path tracing with procedural PBR materials.

Stage space (the website's 1600x900 SVG) maps onto the rendered plate as:
  image_x = (stage_x + 160) / 1920,  image_y = (stage_y + 90) / 1080   (y from top)
so live overlays (the thread, UI) land on the rendered objects.
"""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix

DESK_Z = 0.76          # desk top height (m)
DESK_BACK = 0.42       # y of the desk's back edge
CAM_LOC = Vector((0.0, -0.78, 1.2))
LENS = 30.0
SHIFT_X = -(0.5833 - 0.5)   # desk centre lands 58.3% across

TEX = os.path.join(os.path.dirname(__file__), "tex")


# ───────────────────────── scene ─────────────────────────
def reset(res=(1920, 1080), samples=96):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    cy = sc.cycles
    cy.device = "CPU"
    cy.samples = samples
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.02
    cy.use_denoising = True
    cy.denoiser = "OPENIMAGEDENOISE"
    cy.max_bounces = 6
    cy.diffuse_bounces = 3
    cy.glossy_bounces = 3
    cy.transmission_bounces = 6
    cy.volume_bounces = 1
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 1.0
    cy.sample_clamp_indirect = 6.0
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "16"
    sc.view_settings.view_transform = "AgX"
    try:
        sc.view_settings.look = "AgX - Base Contrast"
    except Exception:
        pass
    sc.render.film_transparent = False
    world = bpy.data.worlds.new("World")
    sc.world = world
    world.use_nodes = True
    set_world_color((0.0, 0.0, 0.0), 0.0)
    return sc


def set_world_color(color, strength):
    w = bpy.context.scene.world
    bg = w.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = (*color, 1)
    bg.inputs[1].default_value = strength


def world_volume(density=0.02, color=(1, 1, 1), anisotropy=0.3):
    """Homogeneous atmospheric haze (light shafts, depth)."""
    w = bpy.context.scene.world
    nt = w.node_tree
    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Density"].default_value = density
    vol.inputs["Color"].default_value = (*color, 1)
    vol.inputs["Anisotropy"].default_value = anisotropy
    out = nt.nodes.get("World Output")
    nt.links.new(vol.outputs[0], out.inputs["Volume"])


def volume_box(size, loc, density=0.03, color=(1, 1, 1), anisotropy=0.35, name="Haze"):
    """Haze confined to a box (so distant exteriors are not fogged out)."""
    m = bpy.data.materials.new(name + "M")
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    v = nt.nodes.new("ShaderNodeVolumePrincipled")
    v.inputs["Density"].default_value = density
    v.inputs["Color"].default_value = (*color, 1)
    v.inputs["Anisotropy"].default_value = anisotropy
    nt.links.new(v.outputs[0], nt.nodes["Material Output"].inputs["Volume"])
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    ob = _obj_from_bm(name, bm, m)
    ob.location = loc
    return ob


def camera(fstop=2.8, focus=None, lens=22.0, tilt_deg=-3.0, edge=0.68):
    """Seated first-person camera, near-level with a vertical shift (architectural look).
    The desk's back edge lands `edge` of the way down the frame; desk centre at 58.3% across."""
    sc = bpy.context.scene
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.clip_start, cd.clip_end = 0.05, 6000.0
    cd.sensor_width = 36
    cd.sensor_fit = "HORIZONTAL"
    cd.shift_x = SHIFT_X
    cam = bpy.data.objects.new("Cam", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    cam.location = CAM_LOC
    cam.rotation_euler = (math.radians(90 + tilt_deg), 0, 0)
    from bpy_extras.object_utils import world_to_camera_view
    lo, hi = -0.6, 0.6
    target = 1 - edge
    for _ in range(40):
        mid = (lo + hi) / 2
        cd.shift_y = mid
        bpy.context.view_layer.update()
        v = world_to_camera_view(sc, cam, Vector((0, DESK_BACK, DESK_Z)))
        # increasing shift_y moves the frame up, so points appear lower
        if v.y > target:
            lo = mid
        else:
            hi = mid
    cd.shift_y = (lo + hi) / 2
    bpy.context.view_layer.update()
    if focus is not None:
        cd.dof.use_dof = True
        cd.dof.focus_distance = focus
        cd.dof.aperture_fstop = fstop
        cd.dof.aperture_blades = 7
    return cam


def stage_of(p):
    """World point → stage (site SVG) coordinates."""
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.context.scene
    v = world_to_camera_view(sc, sc.camera, Vector(p))
    return (v.x * 1920 - 160, (1 - v.y) * 1080 - 90)


def stage_path(points):
    pts = [stage_of(p) for p in points]
    return "M" + " L".join(f"{x:.0f} {y:.0f}" for x, y in pts)


def _frame(cam):
    sc = bpy.context.scene
    tr, br, bl, tl = cam.data.view_frame(scene=sc)
    return tr, br, bl, tl


def ray(sx, sy):
    """Ray (origin, dir) through a stage-space point."""
    cam = bpy.context.scene.camera
    ix, iy = (sx + 160) / 1920, (sy + 90) / 1080
    tr, br, bl, tl = _frame(cam)
    p = tl + (tr - tl) * ix + (bl - tl) * iy
    d = (cam.matrix_world.to_3x3() @ p).normalized()
    return cam.matrix_world.translation.copy(), d


def on_z(sx, sy, z=DESK_Z):
    o, d = ray(sx, sy)
    t = (z - o.z) / d.z
    return o + d * t


def on_y(sx, sy, y):
    o, d = ray(sx, sy)
    t = (y - o.y) / d.y
    return o + d * t


# ───────────────────────── materials ─────────────────────────
def _mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    return m, nt, bsdf


def _set(bsdf, **kw):
    names = {
        "color": "Base Color", "rough": "Roughness", "metal": "Metallic", "sss": "Subsurface Weight",
        "sss_radius": "Subsurface Radius", "trans": "Transmission Weight", "ior": "IOR", "coat": "Coat Weight",
        "coat_rough": "Coat Roughness", "sheen": "Sheen Weight", "emit": "Emission Color", "emit_str": "Emission Strength",
        "alpha": "Alpha", "spec": "Specular IOR Level", "aniso": "Anisotropic",
    }
    for k, v in kw.items():
        inp = bsdf.inputs[names[k]]
        if isinstance(v, (tuple, list)) and len(v) == 3 and names[k] not in ("Subsurface Radius",):
            v = (*v, 1)
        inp.default_value = v


def solid(name, color, rough=0.5, metal=0.0, **kw):
    m, nt, b = _mat(name)
    _set(b, color=color, rough=rough, metal=metal, **kw)
    return m


def _coord(nt, kind="Object"):
    tc = nt.nodes.new("ShaderNodeTexCoord")
    return tc.outputs[kind]


def _bump(nt, bsdf, height_socket, strength=0.2, distance=0.002):
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = distance
    nt.links.new(height_socket, bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return bump


def _ramp(nt, fac_socket, stops):
    r = nt.nodes.new("ShaderNodeValToRGB")
    el = r.color_ramp.elements
    el[0].position, el[0].color = stops[0][0], (*stops[0][1], 1)
    el[1].position, el[1].color = stops[-1][0], (*stops[-1][1], 1)
    for pos, col in stops[1:-1]:
        e = el.new(pos)
        e.color = (*col, 1)
    nt.links.new(fac_socket, r.inputs["Fac"])
    return r


def wood(name, dark, light, scale=3.0, rough=0.42, coat=0.25, ring=18.0, stretch=(1, 7, 1), distortion=14.0):
    """Straight-grain hardwood with pores and a satin finish."""
    m, nt, b = _mat(name)
    co = _coord(nt)
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale * stretch[0], scale * stretch[1], scale * stretch[2])
    nt.links.new(co, mp.inputs["Vector"])
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "RINGS"
    wave.inputs["Scale"].default_value = ring * 0.1
    wave.inputs["Distortion"].default_value = distortion
    wave.inputs["Detail"].default_value = 3.0
    wave.inputs["Detail Scale"].default_value = 1.5
    nt.links.new(mp.outputs[0], wave.inputs["Vector"])
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 60
    noise.inputs["Detail"].default_value = 8
    nt.links.new(mp.outputs[0], noise.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "FLOAT"
    mix.inputs["Factor"].default_value = 0.25
    nt.links.new(wave.outputs["Fac"], mix.inputs["A"])
    nt.links.new(noise.outputs["Fac"], mix.inputs["B"])
    ramp = _ramp(nt, mix.outputs["Result"], [(0.2, dark), (0.55, tuple((d + l) / 2 for d, l in zip(dark, light))), (0.85, light)])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    rr = _ramp(nt, noise.outputs["Fac"], [(0.3, (rough - 0.1,) * 3), (0.8, (rough + 0.12,) * 3)])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    _set(b, coat=coat, coat_rough=0.25)
    _bump(nt, b, mix.outputs["Result"], 0.08, 0.001)
    return m


def noisy(name, color, var=0.08, rough=0.6, scale=40, bump=0.15, metal=0.0, detail=6, color2=None, **kw):
    """Generic material with subtle colour & roughness variation (plaster, paper, fabric, plastics, metal)."""
    m, nt, b = _mat(name)
    co = _coord(nt)
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = 0.6
    nt.links.new(co, n.inputs["Vector"])
    c2 = color2 or tuple(max(0, c * (1 - var * 3)) for c in color)
    ramp = _ramp(nt, n.outputs["Fac"], [(0.3, c2), (0.7, color)])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    rr = _ramp(nt, n.outputs["Fac"], [(0.3, (min(1, rough + 0.1),) * 3), (0.7, (max(0, rough - 0.1),) * 3)])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    _set(b, metal=metal, **kw)
    if bump:
        _bump(nt, b, n.outputs["Fac"], bump, 0.002)
    return m


def brass(name="Brass", tint=(0.78, 0.55, 0.24), rough=0.28, patina=0.35):
    return noisy(name, tint, var=patina * 0.2, rough=rough, scale=25, bump=0.05, metal=1.0)


def brick(name, c1, c2, mortar, scale=6.0, rough=0.85, row=0.25, width=0.5):
    m, nt, b = _mat(name)
    co = _coord(nt)
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (math.radians(90), 0, 0)
    nt.links.new(co, mp.inputs["Vector"])
    br = nt.nodes.new("ShaderNodeTexBrick")
    br.inputs["Color1"].default_value = (*c1, 1)
    br.inputs["Color2"].default_value = (*c2, 1)
    br.inputs["Mortar"].default_value = (*mortar, 1)
    br.inputs["Scale"].default_value = scale
    br.inputs["Mortar Size"].default_value = 0.012
    br.inputs["Mortar Smooth"].default_value = 0.4
    br.inputs["Bias"].default_value = 0.0
    br.inputs["Brick Width"].default_value = width
    br.inputs["Row Height"].default_value = row
    br.offset = 0.5
    nt.links.new(mp.outputs[0], br.inputs["Vector"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 90
    n.inputs["Detail"].default_value = 10
    nt.links.new(mp.outputs[0], n.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 0.35
    nt.links.new(br.outputs["Color"], mix.inputs["A"])
    nt.links.new(n.outputs["Color"], mix.inputs["B"])
    nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    _set(b, rough=rough)
    h = nt.nodes.new("ShaderNodeMath")
    h.operation = "ADD"
    nt.links.new(br.outputs["Fac"], h.inputs[0])
    nt.links.new(n.outputs["Fac"], h.inputs[1])
    bump = _bump(nt, b, h.outputs[0], 0.45, 0.004)
    bump.invert = True
    return m


def image_mat(name, path, emit=0.0, rough=0.5, alpha=False, extension="CLIP", base_tint=None, interp="Linear"):
    m, nt, b = _mat(name)
    img = bpy.data.images.load(path, check_existing=True)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.extension = extension
    tex.interpolation = interp
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    _set(b, rough=rough)
    if emit:
        nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
        _set(b, emit_str=emit)
    if alpha:
        nt.links.new(tex.outputs["Alpha"], b.inputs["Alpha"])
    return m


def screen_mat(name, path, emit=2.0, glass=True):
    """Emissive display behind a glossy glass surface."""
    m, nt, b = _mat(name)
    img = bpy.data.images.load(path, check_existing=True)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.extension = "CLIP"
    nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
    _set(b, color=(0.005, 0.005, 0.006), rough=0.08 if glass else 0.4, emit_str=emit, coat=1.0 if glass else 0.0, coat_rough=0.03)
    return m


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value = (*color, 1)
    e.inputs[1].default_value = strength
    nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs[0])
    return m


def glass(name="Glass", color=(1, 1, 1), rough=0.02, ior=1.5):
    m, nt, b = _mat(name)
    _set(b, color=color, rough=rough, trans=1.0, ior=ior)
    return m


# ───────────────────────── geometry ─────────────────────────
def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob


def _obj_from_bm(name, bm, mat=None, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    link(ob)
    if mat:
        me.materials.append(mat)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    return ob


def box(name, size, loc, mat=None, rot=(0, 0, 0), bevel=0.004, segs=2):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    ob = _obj_from_bm(name, bm, mat)
    ob.location = loc
    ob.rotation_euler = rot
    if bevel:
        md = ob.modifiers.new("bev", "BEVEL")
        md.width = bevel
        md.segments = segs
        md.limit_method = "ANGLE"
        for p in ob.data.polygons:
            p.use_smooth = True
        ws = ob.modifiers.new("ws", "WEIGHTED_NORMAL")
        ws.keep_sharp = True
    return ob


def cyl(name, r, h, loc, mat=None, rot=(0, 0, 0), segs=48, bevel=0.0, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r, radius2=r if r2 is None else r2, depth=h)
    ob = _obj_from_bm(name, bm, mat, smooth=True)
    ob.location = loc
    ob.rotation_euler = rot
    if bevel:
        md = ob.modifiers.new("bev", "BEVEL")
        md.width = bevel
        md.segments = 2
        md.limit_method = "ANGLE"
        ob.modifiers.new("ws", "WEIGHTED_NORMAL")
    else:
        md = ob.modifiers.new("ws", "WEIGHTED_NORMAL")
        md.keep_sharp = True
    return ob


def sphere(name, r, loc, mat=None, scale=(1, 1, 1), segs=48):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=r)
    ob = _obj_from_bm(name, bm, mat, smooth=True)
    ob.location = loc
    ob.scale = scale
    return ob


def lathe(name, profile, loc, mat=None, segs=64, rot=(0, 0, 0), close_top=True, close_bottom=True):
    """Solid of revolution from [(radius, z), ...] bottom→top."""
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        ring = []
        for i in range(segs):
            a = 2 * math.pi * i / segs
            ring.append(bm.verts.new((r * math.cos(a), r * math.sin(a), z)))
        rings.append(ring)
    for a, b_ in zip(rings, rings[1:]):
        for i in range(segs):
            j = (i + 1) % segs
            bm.faces.new((a[i], a[j], b_[j], b_[i]))
    if close_bottom and profile[0][0] > 0:
        bm.faces.new(list(reversed(rings[0])))
    if close_top and profile[-1][0] > 0:
        bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = _obj_from_bm(name, bm, mat, smooth=True)
    ob.location = loc
    ob.rotation_euler = rot
    return ob


def prism(name, pts2d, depth, loc, mat=None, rot=(0, 0, 0), plane="XZ"):
    """Extrude a 2D polygon (x, y) by depth. plane XZ → polygon stands upright, extruded along +Y."""
    bm = bmesh.new()
    vs = []
    for x, y in pts2d:
        vs.append(bm.verts.new((x, 0, y) if plane == "XZ" else (x, y, 0)))
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    moved = [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=(0, depth, 0) if plane == "XZ" else (0, 0, depth))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = _obj_from_bm(name, bm, mat)
    ob.location = loc
    ob.rotation_euler = rot
    return ob


def plane(name, size, loc, mat=None, rot=(0, 0, 0), subdiv=0):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=max(1, subdiv), y_segments=max(1, subdiv), size=0.5)
    bmesh.ops.scale(bm, vec=Vector((size[0], size[1], 1)), verts=bm.verts)
    # UVs 0..1
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        for l in f.loops:
            x, y = l.vert.co.x / size[0] + 0.5, l.vert.co.y / size[1] + 0.5
            l[uv].uv = (x, y)
    ob = _obj_from_bm(name, bm, mat)
    ob.location = loc
    ob.rotation_euler = rot
    return ob


def card(name, path, height, loc, rot=(math.radians(90), 0, 0), emit=0.0, shadow=True):
    """Alpha-cut image card (VFX 'card' technique for distant figures, silhouettes, foliage)."""
    img = bpy.data.images.load(path, check_existing=True)
    w, h = img.size
    m = image_mat(name + "_m", path, emit=emit, rough=0.9, alpha=True)
    ob = plane(name, (height * w / h, height), loc, m, rot)
    if not shadow:
        ob.visible_shadow = False
    return ob


def boolean(ob, cutter, op="DIFFERENCE"):
    md = ob.modifiers.new("bool", "BOOLEAN")
    md.operation = op
    md.object = cutter
    md.solver = "EXACT"
    cutter.hide_render = True
    cutter.hide_viewport = True
    return ob


def bend(ob, angle, axis="X"):
    md = ob.modifiers.new("bend", "SIMPLE_DEFORM")
    md.deform_method = "BEND"
    md.angle = angle
    md.deform_axis = axis
    return ob


def subsurf(ob, levels=2):
    md = ob.modifiers.new("sub", "SUBSURF")
    md.levels = levels
    md.render_levels = levels
    return ob


# ───────────────────────── lights ─────────────────────────
def point(loc, color, watts, radius=0.02, name="Point"):
    ld = bpy.data.lights.new(name, "POINT")
    ld.color = color
    ld.energy = watts
    ld.shadow_soft_size = radius
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    return link(ob)


def area(loc, color, watts, size=(1, 1), rot=(0, 0, 0), name="Area", spread=180):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = "RECTANGLE"
    ld.size, ld.size_y = size
    ld.color = color
    ld.energy = watts
    ld.spread = math.radians(spread)
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = rot
    return link(ob)


def spot(loc, color, watts, rot, angle=60, blend=0.6, radius=0.03, name="Spot"):
    ld = bpy.data.lights.new(name, "SPOT")
    ld.color = color
    ld.energy = watts
    ld.spot_size = math.radians(angle)
    ld.spot_blend = blend
    ld.shadow_soft_size = radius
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = rot
    return link(ob)


def sun(rot, color, strength, angle=1.0):
    ld = bpy.data.lights.new("Sun", "SUN")
    ld.color = color
    ld.energy = strength
    ld.angle = math.radians(angle)
    ob = bpy.data.objects.new("Sun", ld)
    ob.rotation_euler = rot
    return link(ob)


# ───────────────────────── desk ─────────────────────────
def desk(mat, width=3.2, depth=1.25, thick=0.05, edge_mat=None):
    """The one desk. Same footprint in every era: back edge at DESK_BACK, top at DESK_Z."""
    top = box("DeskTop", (width, depth, thick), (0, DESK_BACK - depth / 2, DESK_Z - thick / 2), mat, bevel=0.006, segs=3)
    return top


def render(path):
    sc = bpy.context.scene
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


def relief(name, color, height_path, strength=0.6, rough=0.85, scale=(1, 1), var=0.06):
    """Plaster/stucco with an image height map (carved relief) + fine noise."""
    m, nt, b = _mat(name)
    uv = nt.nodes.new("ShaderNodeTexCoord").outputs["UV"]
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale[0], scale[1], 1)
    nt.links.new(uv, mp.inputs["Vector"])
    img = bpy.data.images.load(height_path, check_existing=True)
    img.colorspace_settings.name = "Non-Color"
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.extension = "REPEAT"
    nt.links.new(mp.outputs[0], tex.inputs["Vector"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 60
    n.inputs["Detail"].default_value = 8
    ramp = _ramp(nt, n.outputs["Fac"], [(0.3, tuple(c * (1 - var * 3) for c in color)), (0.7, color)])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    ao = nt.nodes.new("ShaderNodeMix")
    ao.data_type = "RGBA"
    ao.blend_type = "MULTIPLY"
    ao.inputs["Factor"].default_value = 0.5
    nt.links.new(ramp.outputs["Color"], ao.inputs["A"])
    nt.links.new(tex.outputs["Color"], ao.inputs["B"])
    nt.links.new(ao.outputs["Result"], b.inputs["Base Color"])
    _set(b, rough=rough)
    _bump(nt, b, tex.outputs["Color"], strength, 0.01)
    return m


def image_fabric(name, path, rough=0.95, sheen=0.8, bump=0.3, scale=(1, 1)):
    m, nt, b = _mat(name)
    uv = nt.nodes.new("ShaderNodeTexCoord").outputs["UV"]
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale[0], scale[1], 1)
    nt.links.new(uv, mp.inputs["Vector"])
    img = bpy.data.images.load(path, check_existing=True)
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    nt.links.new(mp.outputs[0], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 400
    n.inputs["Detail"].default_value = 4
    _set(b, rough=rough, sheen=sheen)
    _bump(nt, b, n.outputs["Fac"], bump, 0.002)
    return m


def gradient_sky(stops, strength=1.0):
    """World colour by elevation: stops = [(z, (r,g,b)), ...] with z in -1..1 (view direction)."""
    w = bpy.context.scene.world
    nt = w.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -1
    mr.inputs["From Max"].default_value = 1
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    ramp = _ramp(nt, mr.outputs["Result"], [((z + 1) / 2, c) for z, c in stops])
    bg = nt.nodes["Background"]
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = strength


# ───────────────────────── v2 high-fidelity materials ─────────────────────────
def _img_node(nt, path, noncolor=False, coord=None, extension="REPEAT"):
    img = bpy.data.images.load(path, check_existing=True)
    if noncolor:
        img.colorspace_settings.name = "Non-Color"
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = img
    t.extension = extension
    t.interpolation = "Cubic"
    if coord is not None:
        nt.links.new(coord, t.inputs["Vector"])
    return t


def wood_img(name, prefix, size=(3.2, 1.25), origin=(0.0, 0.0), coat=0.35, coat_rough=0.12, bump=0.35, tint=1.0):
    """Image-based hardwood (colour/roughness/height maps from tex3.py), mapped in object space onto a desk-size top."""
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size[0], 1 / size[1], 1)
    mp.inputs["Location"].default_value = (0.5 - origin[0] / size[0], 0.5 - origin[1] / size[1], 0)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    col = _img_node(nt, os.path.join(TEX, prefix + "_col.png"), coord=mp.outputs[0])
    rgh = _img_node(nt, os.path.join(TEX, prefix + "_rough.png"), True, mp.outputs[0])
    hgt = _img_node(nt, os.path.join(TEX, prefix + "_h.png"), True, mp.outputs[0])
    if tint != 1.0:
        mul = nt.nodes.new("ShaderNodeMix")
        mul.data_type = "RGBA"
        mul.blend_type = "MULTIPLY"
        mul.inputs["Factor"].default_value = 1.0
        nt.links.new(col.outputs["Color"], mul.inputs["A"])
        mul.inputs["B"].default_value = (tint, tint, tint, 1)
        nt.links.new(mul.outputs["Result"], b.inputs["Base Color"])
    else:
        nt.links.new(col.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(rgh.outputs["Color"], b.inputs["Roughness"])
    _set(b, coat=coat, coat_rough=coat_rough)
    _bump(nt, b, hgt.outputs["Color"], bump, 0.0012)
    return m


def metal_worn(name, color, rough=0.22, cavity=(0.18, 0.12, 0.06), polish=0.6, scale=40):
    """Metal with polished edges, darkened cavities (pointiness) and fine roughness breakup."""
    m, nt, b = _mat(name)
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    pr = nt.nodes.new("ShaderNodeMapRange")
    pr.inputs["From Min"].default_value = 0.47
    pr.inputs["From Max"].default_value = 0.56
    nt.links.new(geo.outputs["Pointiness"], pr.inputs["Value"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 10
    n2 = nt.nodes.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = 3
    n2.inputs["Detail"].default_value = 4
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    nt.links.new(pr.outputs["Result"], mix.inputs["Factor"])
    mix.inputs["A"].default_value = (*cavity, 1)
    mix.inputs["B"].default_value = (*color, 1)
    patina = nt.nodes.new("ShaderNodeMix")
    patina.data_type = "RGBA"
    patina.blend_type = "MULTIPLY"
    nt.links.new(n2.outputs["Fac"], patina.inputs["Factor"])
    nt.links.new(mix.outputs["Result"], patina.inputs["A"])
    patina.inputs["B"].default_value = (0.8, 0.75, 0.65, 1)
    nt.links.new(patina.outputs["Result"], b.inputs["Base Color"])
    rr = _ramp(nt, n.outputs["Fac"], [(0.3, (rough - 0.08,) * 3), (0.7, (rough + 0.15,) * 3)])
    rmix = nt.nodes.new("ShaderNodeMix")
    rmix.data_type = "RGBA"
    nt.links.new(pr.outputs["Result"], rmix.inputs["Factor"])
    nt.links.new(rr.outputs["Color"], rmix.inputs["A"])
    rmix.inputs["B"].default_value = (rough * (1 - polish),) * 3 + (1,)
    nt.links.new(rmix.outputs["Result"], b.inputs["Roughness"])
    _set(b, metal=1.0)
    _bump(nt, b, n.outputs["Fac"], 0.04, 0.001)
    return m


def coin_mat(name, color, radius, rough=0.25):
    """Struck coin: emboss from coin_face.png projected on the faces (object space)."""
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / (2 * radius), 1 / (2 * radius), 1)
    mp.inputs["Location"].default_value = (0.5, 0.5, 0)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    h = _img_node(nt, os.path.join(TEX, "coin_face.png"), True, mp.outputs[0], "CLIP")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 300
    ramp = _ramp(nt, h.outputs["Color"], [(0.3, tuple(c * 0.55 for c in color)), (0.8, color)])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    rr = _ramp(nt, n.outputs["Fac"], [(0.3, (rough,) * 3), (0.7, (rough + 0.15,) * 3)])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    _set(b, metal=1.0)
    _bump(nt, b, h.outputs["Color"], 0.9, 0.0004)
    return m


def paper_mat(name, texpath, rough=0.72, sss=0.08, bump=0.25):
    m, nt, b = _mat(name)
    uv = nt.nodes.new("ShaderNodeTexCoord").outputs["UV"]
    t = _img_node(nt, texpath, coord=uv, extension="CLIP")
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 900
    n.inputs["Detail"].default_value = 6
    _set(b, rough=rough, sss=sss)
    b.inputs["Subsurface Radius"].default_value = (0.004, 0.003, 0.002)
    _bump(nt, b, n.outputs["Fac"], bump, 0.0006)
    return m


def glass_img_rough(name, color, rough, tex="smudges.png", ior=1.52, trans=1.0):
    """Glass/polished surfaces with fingerprint & wipe roughness breakup."""
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.6, 0.6, 0.6)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    s = _img_node(nt, os.path.join(TEX, tex), True, mp.outputs[0])
    rr = _ramp(nt, s.outputs["Color"], [(0.0, (rough,) * 3), (1.0, (min(1, rough + 0.25),) * 3)])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    _set(b, color=color, trans=trans, ior=ior)
    return m


def dust(n, center, size, radius=0.0007, seed=1, name="Dust", bright=0.9):
    """Airborne dust motes: tiny diffuse specks that only show where a light beam catches them."""
    import random as _r
    rng = _r.Random(seed)
    bm = bmesh.new()
    for i in range(n):
        m = Matrix.Translation((center[0] + rng.uniform(-size[0] / 2, size[0] / 2),
                                center[1] + rng.uniform(-size[1] / 2, size[1] / 2),
                                center[2] + rng.uniform(-size[2] / 2, size[2] / 2)))
        r = radius * rng.uniform(0.5, 1.6)
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r, matrix=m)
    mat = solid(name + "M", (bright, bright, bright), 0.8, alpha=0.3)
    ob = _obj_from_bm(name, bm, mat, smooth=True)
    ob.visible_shadow = False
    return ob


def flame(loc, h=0.03, name="Flame", watts=6.0, color=(1.0, 0.56, 0.2)):
    """Teardrop candle flame with a hotter core, plus its light."""
    x, y, z = loc
    prof = [(0.0, 0.0), (0.0045, 0.004), (0.006, 0.01), (0.0055, 0.018), (0.0035, 0.025), (0.0012, 0.03), (0.0, h)]
    outer = lathe(name, prof, (x, y, z), emission(name + "O", color, 45))
    outer.visible_shadow = False
    inner = lathe(name + "Core", [(r * 0.55, zz * 0.6) for r, zz in prof], (x, y, z + 0.001), emission(name + "C", (1.0, 0.86, 0.62), 90))
    inner.visible_shadow = False
    blue = lathe(name + "Base", [(0.0, 0.0), (0.0035, 0.002), (0.004, 0.005), (0.0, 0.006)], (x, y, z - 0.001), emission(name + "B", (0.25, 0.35, 1.0), 8))
    blue.visible_shadow = False
    point((x, y, z + 0.014), color, watts, radius=0.006, name=name + "L")


def tiled_img(name, prefix, tile=2.4, rough=0.35, bump=0.4, coat=0.0, has_h=True, rough_var=0.1):
    """World-space tiled image material (floors, panels): <prefix>_col.png (+ _h.png)."""
    m, nt, b = _mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / tile, 1 / tile, 1 / tile)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    col = _img_node(nt, os.path.join(TEX, prefix + "_col.png"), coord=mp.outputs[0])
    nt.links.new(col.outputs["Color"], b.inputs["Base Color"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 3
    rr = _ramp(nt, n.outputs["Fac"], [(0.3, (rough - rough_var,) * 3), (0.7, (rough + rough_var,) * 3)])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    if has_h:
        h = _img_node(nt, os.path.join(TEX, prefix + "_h.png"), True, mp.outputs[0])
        _bump(nt, b, h.outputs["Color"], bump, 0.002)
    _set(b, coat=coat)
    return m


def bulge_screen(name, center, w, h, bulge, texpath, emit=2.0, rot=(math.radians(90), 0, 0)):
    """Curved CRT faceplate: phosphor image behind a glossy glass surface with spherical bulge."""
    bm = bmesh.new()
    nx, ny = 32, 24
    uvl = bm.loops.layers.uv.new()
    vs = [[None] * (nx + 1) for _ in range(ny + 1)]
    for j in range(ny + 1):
        for i in range(nx + 1):
            u, v = i / nx, j / ny
            x, y = (u - 0.5) * w, (v - 0.5) * h
            z = bulge * (1 - (2 * u - 1) ** 2) * (1 - (2 * v - 1) ** 2)
            vs[j][i] = bm.verts.new((x, y, z))
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
            for l, (ii, jj) in zip(f.loops, ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))):
                l[uvl].uv = (ii / nx, jj / ny)
    ob = _obj_from_bm(name, bm, screen_mat(name + "M", texpath, emit, True), smooth=True)
    ob.location = center
    ob.rotation_euler = rot
    bpy.context.view_layer.update()
    def uv2w(u, v):
        z = bulge * (1 - (2 * u - 1) ** 2) * (1 - (2 * v - 1) ** 2)
        return ob.matrix_world @ Vector(((u - 0.5) * w, (v - 0.5) * h, z + 0.0005))
    return ob, uv2w


def keycap(name, loc, size=(0.018, 0.018), h=0.009, mat=None, dish=True, rot=(0, 0, 0)):
    """Sculpted keycap: tapered, rounded, slightly dished top."""
    w, d = size
    bm = bmesh.new()
    bot = [(-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)]
    k = 0.78
    vb = [bm.verts.new((x, y, 0)) for x, y in bot]
    vt = [bm.verts.new((x * k, y * k + 0.0008, h)) for x, y in bot]
    bm.faces.new(list(reversed(vb)))
    bm.faces.new(vt)
    for i in range(4):
        bm.faces.new((vb[i], vb[(i + 1) % 4], vt[(i + 1) % 4], vt[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = _obj_from_bm(name, bm, mat)
    ob.location = loc
    ob.rotation_euler = rot
    md = ob.modifiers.new("bev", "BEVEL")
    md.width = min(w, d) * 0.12
    md.segments = 3
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob
