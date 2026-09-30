# Plate renderer (Blender · Cycles)

The realistic era images are **3D renders**, not illustrations: one modelled desk and one seated camera,
re-dressed for every era, path-traced with physically based materials, light and atmosphere.

```bash
# one-time: Python 3.11 + Blender as a module
python3.11 -m venv bl && source bl/bin/activate
pip install bpy==5.0.1 numpy pillow

python tex.py && python tex2.py          # procedural textures (manuscripts, ledgers, screens, silhouettes)
./batch.sh                               # renders every plate into final/ (hours on a laptop CPU; minutes on a GPU)
python post.py                           # film finish → ../../art/plates/*.jpg + content/plate-threads.json
cd ../.. && npm run plates && npm run build
```

- `lib.py` — scene setup, the shared camera (`camera()`), materials (wood, brick, brass, paper, glass, screens), lights, and `stage_of()`, which maps 3D points to the website's stage coordinates so the live line lands on rendered objects.
- `abbasid.py` — Baghdad hall (`variant=abbasid | record | ledger`).
- `scenes.py` — every later era (`era=centuries-printed … autonomous`).
- Paths passed to `stage_path()` become the recurring line for that plate (`content/plate-threads.json`).

To go further in realism, you can replace any plate with a photograph or AI-generated image of the same framing (see `docs/PHOTO-PROMPTS.md` and `art/reference/`).
