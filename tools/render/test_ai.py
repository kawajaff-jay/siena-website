"""Test plate: 2026 — SIENA AI. Deep navy architecture, smoked glass desk, electric-blue light.
Same desk, same camera as every era. The centre-top is kept quiet for the SIENA logo overlay."""
import sys, os, math, json, random
sys.path.insert(0, os.path.dirname(__file__))
import lib
from lib import *
from common_props import *

args = dict(a.split("=") for a in sys.argv[sys.argv.index("--") + 1:]) if "--" in sys.argv else {}
RES = tuple(int(v) for v in args.get("res", "1920x1080").split("x"))
SAMPLES = int(args.get("samples", 64))
OUT = args.get("out", "/home/claude/render/test/ai.png")
T = lib.TEX
SIENA_BLUE = (0.07, 0.3, 1.0)

sc = reset(RES, SAMPLES)
cam = camera()

WALL_Y = 5.2
# ── architecture ──
floor_m = noisy("PolishedConcrete", (0.03, 0.032, 0.038), var=0.12, rough=0.22, scale=2.5, bump=0.02, coat=0.3, coat_rough=0.08)
navy_plaster = noisy("NavyPlaster", (0.012, 0.015, 0.024), var=0.08, rough=0.7, scale=5, bump=0.05)
room(WALL_Y, navy_plaster, floor_m, navy_plaster, 3.3, width=14, side=5.5)
WX = on_y(1590, 300, WALL_Y).x
# fluted back wall panels (deep navy), with a concealed blue cove at floor and ceiling
flute_m = relief("Fluted", (0.022, 0.028, 0.045), os.path.join(T, "fluted.png"), 1.0, rough=0.5, scale=(10, 1))
for i in range(-9, 10):
    if abs(i * 0.6 - WX) < 0.9:
        continue
    p_ = plane(f"FlutePanel{i}", (0.6, 3.2), (i * 0.6, WALL_Y - 0.05, 1.62), flute_m, rot=(math.radians(90), 0, 0))
    p_.modifiers.new("sol", "SOLIDIFY").thickness = 0.03
box("Plinth", (14, 0.25, 0.14), (0, WALL_Y - 0.2, 0.07), navy_plaster, bevel=0.004)
box("CoveFloor", (14, 0.02, 0.01), (0, WALL_Y - 0.09, 0.15), emission("CoveF", SIENA_BLUE, 8), bevel=0)
box("CoveCeil", (14, 0.02, 0.012), (0, WALL_Y - 0.12, 3.2), emission("CoveC", SIENA_BLUE, 5), bevel=0)
area((0, WALL_Y - 0.1, 0.16), SIENA_BLUE, 35, (12, 0.05), rot=(math.radians(-20), 0, 0), name="CoveUp")
area((0, WALL_Y - 0.2, 3.18), SIENA_BLUE, 18, (12, 0.1), rot=(math.radians(-160), 0, 0), name="CoveDown")
# two slim vertical light blades framing the space (kept away from the centre)
for x in (-2.35, 2.35):
    box(f"Blade{x}", (0.018, 0.018, 3.1), (x, WALL_Y - 0.15, 1.62), emission(f"BladeE{x}", SIENA_BLUE, 7), bevel=0)
# glazed corner (right): the city at night, far beyond, deep in bokeh
cutter = box("GlassCut", (1.4, 0.8, 2.9), (WX, WALL_Y, 1.6), None, bevel=0)
boolean(bpy.data.objects["BackWall"], cutter)
plane("CityNight", (40, 14), (8, 40, 5), image_mat("CityM", os.path.join(T, "city_night.png"), emit=0.55, rough=1), rot=(math.radians(90), 0, 0))
plane("Glazing", (1.4, 2.9), (WX, WALL_Y + 0.1, 1.6), glass_img_rough("Glazing", (0.8, 0.88, 1.0), 0.01), rot=(math.radians(90), 0, 0))
gradient_sky([(-0.2, (0.0, 0.0, 0.01)), (0.0, (0.02, 0.03, 0.08)), (0.4, (0.005, 0.01, 0.03))], 1.0)

# linear ceiling slot (soft top light over the desk)
plane("Slot", (2.6, 0.06), (0.1, 0.6, 3.29), emission("SlotE", (0.92, 0.95, 1.0), 20), rot=(math.radians(180), 0, 0))
area((0.1, 0.6, 3.25), (0.9, 0.93, 1.0), 220, (2.4, 0.08), rot=(0, 0, 0), name="SlotLight")

# ── the one desk: smoked glass slab on brushed-aluminium frame, SIENA-blue edge ──
top = lib.desk(glass_img_rough("SmokedGlass", (0.012, 0.016, 0.028), 0.03, trans=0.25))
alu = noisy("BrushedAlu", (0.62, 0.64, 0.68), var=0.02, rough=0.26, scale=600, bump=0.02, metal=1.0)
for x in (-1.45, 1.45):
    box(f"Leg{x}", (0.04, 1.1, 0.03), (x, lib.DESK_BACK - 0.62, DESK_Z - 0.065), alu, bevel=0.004)
    box(f"LegV{x}", (0.04, 0.04, DESK_Z - 0.08), (x, lib.DESK_BACK - 0.1, (DESK_Z - 0.08) / 2), alu, bevel=0.004)
box("EdgeLED", (3.1, 0.003, 0.003), (0, lib.DESK_BACK - 0.006, DESK_Z - 0.006), emission("EdgeE", SIENA_BLUE, 35), bevel=0)
box("EdgeLED2", (3.1, 0.004, 0.004), (0, lib.DESK_BACK - 0.004, DESK_Z - 0.056), emission("EdgeE2", SIENA_BLUE, 20), bevel=0)
area((0, lib.DESK_BACK + 0.05, DESK_Z - 0.06), SIENA_BLUE, 25, (3.0, 0.02), rot=(math.radians(180), 0, 0), name="UnderGlow")

# architectural wall-washers: soft scallops of cool white grazing the fluted panels
for x in (-1.7, 1.25):
    spot((x, WALL_Y - 0.45, 3.25), (0.8, 0.86, 1.0), 420, (math.radians(14), 0, 0), angle=55, blend=0.9, radius=0.02, name=f"Wash{x}")
spot((0.0, WALL_Y - 0.55, 3.25), SIENA_BLUE, 220, (math.radians(12), 0, 0), angle=70, blend=1.0, radius=0.03, name="WashBlue")
# a single glass slate lies on the desk (right of centre), faintly awake
sl = on_z(1215, 820)
box("Slate", (0.24, 0.165, 0.006), (sl.x, sl.y, DESK_Z + 0.003), glass_img_rough("SlateGlass", (0.02, 0.025, 0.04), 0.02, trans=0.3), rot=(0, 0, -0.22), bevel=0.003)
s_, _ = screen("SlateUI", (sl.x, sl.y, DESK_Z + 0.0065), 0.22, 0.145, os.path.join(T, "dash_auto1.png"), emit=0.35, rot=(0, 0, -0.22))
# a thin brushed-metal stylus
cyl("Stylus", 0.0035, 0.15, (sl.x - 0.2, sl.y + 0.02, DESK_Z + 0.0035), alu, rot=(0, math.radians(90), math.radians(-12)))

# air: faint blue haze and a few motes in the light
volume_box((10, 7, 3.2), (0, 1.8, 1.62), 0.008, (0.7, 0.78, 1.0), 0.55)
dust(260, (0.1, 0.7, 2.6), (2.4, 0.6, 1.0), radius=0.0005, seed=21, bright=0.35)

cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (cam.location - Vector((0.0, 0.05, DESK_Z))).length
cam.data.dof.aperture_fstop = 2.2
cam.data.dof.aperture_blades = 9

os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({}, open(OUT.replace(".png", ".json"), "w"))
lib.render(OUT)
print("rendered", OUT)
