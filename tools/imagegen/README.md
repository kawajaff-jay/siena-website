# SIENA plate generator (Gemini 3 Pro Image · "Nano Banana Pro")

Generates the photorealistic era plates for the timeline, one era at a time, with the same seated
camera and desk in every image.

## One-time setup

1. `cp .env.example .env.local`
2. Open `.env.local` (for example `open -e .env.local` on a Mac), paste your key after `GEMINI_API_KEY=`, and save.

`.env.local` is in `.gitignore`: the key stays on your machine and never goes into the repository.

## Generate

```bash
npm run imagegen -- --era abbasid            # use the preset in tools/imagegen/presets.json
npm run imagegen -- --era abbasid --dry-run  # show the exact prompt and reference images, no API call
npm run imagegen -- --era abbasid --count 2  # two candidates to choose from
```

You can also set everything yourself:

```bash
npm run imagegen -- --era abbasid --name "Abbasid Baghdad" --year "c. 850 CE" \
  --scene "…" --ref art/reference/target-abbasid.png --aspect 16:9 --out abbasid.jpg
```

| Option | Meaning |
|---|---|
| `--era` | Plate id (`abbasid`, `record`, `paper`, … — see `presets.json`) |
| `--name`, `--year`, `--scene` | Era name, year and scene description (default: preset) |
| `--ref <file>` | Art-direction reference image; repeat for several (default: preset) |
| `--aspect` | `16:9` (default), `21:9`, `4:3`, `1:1`, … |
| `--size` | `1K`, `2K` or `4K` (default: preset; the opening Abbasid plates use 4K) |
| `--out` | Final filename in `art/plates/` once approved (default `<era>.jpg`) |
| `--guide <file>` / `--no-guide` | Composition guide (default: the current plate for that era, i.e. the Blender render shot from the same camera) |
| `--prev <file>` / `--no-prev` | Continuity image (default: the nearest earlier **approved** plate) |
| `--model` | Default `gemini-3-pro-image` (or set `GEMINI_IMAGE_MODEL`) |

Every image is sent with up to three kinds of reference, labelled in the prompt:

- **Composition lock:** the same-camera frame for this era; only the layout is used.
- **Continuity:** the previous approved era, so neighbouring plates cross-dissolve cleanly.
- **Art direction:** the look to aim for, without copying its framing.

## Review and approve

Results are saved as **candidates** in `art/plates/candidates/<era>/`, each with a `.json` file recording the
prompt, model and references. Generating never touches `art/plates/`.

```bash
npm run imagegen:approve -- art/plates/candidates/abbasid/abbasid-<time>.png
```

- If `art/plates/<name>` already exists, approval **refuses** and changes nothing. Add `--replace` to replace it
  on purpose; the old plate is kept in `art/plates/_superseded/`.
- The approval is recorded in `art/plates/approved.json`. The next era then automatically uses this plate as its
  continuity reference.
- Run `npm run plates` to put approved plates on the site.

Candidates and superseded plates are git-ignored; approved plates and `approved.json` are committed.
