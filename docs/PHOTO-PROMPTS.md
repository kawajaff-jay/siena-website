# SIENA — Photographic plates: prompt pack

The site is ready for realistic imagery. For each era you create **one photograph (a "plate")**, save it as `art/plates/<id>.jpg` (or `.png` / `.webp`), and run `npm run plates`. The site uses whatever plates exist and keeps the illustrations for the rest, so you can add them one at a time.

Text, the recurring line, network lines, app windows, the AI convergence, the workflow and the SIENA logo all stay **live on top** of the photos. **Never put text, UI or logos into the images.**

---

## 1. The rule that makes it work: one camera

Every plate must look like it was shot **from the same chair, with the same lens, at the same desk**. Only the era changes.

| Setting | Value |
|---|---|
| Aspect ratio | **16:9**, at least **2560×1440** (prologue plates `abbasid` and `record`: **3840×2160**, because the page opens zoomed in) |
| Camera | First-person, seated, eye level ~40 cm above the desk, looking straight ahead, 35 mm lens, no tilt, no dutch angle |
| Desk | Back edge of the desk runs horizontally **60% down the frame**; the desk top fills the lower 40% and runs edge to edge |
| Hero object | Centred at **58% across** the frame, just above / on the desk (see `art/reference/_composition-guide.png`) |
| Left 37% | Darker, calm, low detail. Headlines sit here |
| Lighting | Motivated by a real source in the scene (candle → lamp → screen glow → blue edge light). Low-key, cinematic |
| People | Allowed in the background (merchants, clerks, typists, operators), never looking into the lens, never the focus. Hands at the desk are fine |

**Use the reference frames.** `art/reference/<id>.png` shows exactly where everything sits for each plate. In your image generator, attach the reference as a **structure / composition / image reference** (Midjourney `--cref`/image prompt, ChatGPT or Gemini "use this layout", Firefly "Structure reference", Stable Diffusion ControlNet depth or canny). Around 50–70% strength keeps the layout and lets the realism take over.

**Keep one tool and one look.** Generate all plates in the same tool, reuse the same style reference image (your first good plate), and if the tool supports it, keep the same seed.

---

## 2. Style block (paste at the end of every prompt)

> photorealistic cinematic film still, first-person view seated at a desk, 35mm lens, eye level slightly above the desk, the desk's back edge runs horizontally across the lower-middle of the frame, main object centred slightly right of centre, the left third of the frame darker and uncluttered, motivated practical lighting, deep shadows, shallow depth of field on the background, subtle film grain, rich but restrained colour, 16:9, no text, no letters, no logos, no watermark, no UI, no people looking at the camera

Negative prompt (if your tool supports it):

> text, lettering, captions, logo, watermark, cartoon, illustration, 3d render, CGI look, oversaturated, fisheye, tilted horizon, cluttered left side, faces in focus

---

## 3. The plates

### `abbasid` — c. 750–1258 CE · Baghdad (3840×2160)
> An Abbasid-era scholar-merchant's writing desk in a stone and fired-brick hall in Baghdad at dusk. Behind the desk, a tall pointed arch opens onto a busy market square: merchants weighing goods on brass balance scales, awnings, sacks of spice and grain, and on the horizon a camel caravan silhouetted against an amber sky, with low domes and city walls in the distance. A smaller pointed arch on the left, a recessed niche on the right holding rolled manuscripts and bound ledgers. Two hanging pierced-brass lanterns. On the dark walnut desk: a cream paper manuscript with lines of flowing Arabic-style script (illegible, abstract), a reed pen (qalam) beside it, a brass inkwell, a small brass balance, stacks of gold dinars and silver dirhams, a rolled contract with a red wax seal, and a beeswax candle in a brass holder casting warm light. Warm candlelight, gold and brown tones, historically grounded, no fantasy architecture.

### `record` — c. 850 CE · The scribe's account (3840×2160)
> Same hall, same desk, same framing as the previous image, slightly later in the evening. A scribe's hand in a simple linen sleeve holds a reed pen and is finishing a line of ink on the manuscript; the ink is still wet and glossy. Brass scales, dinars and dirhams, inkwell and candle exactly where they were. The market beyond the arch is quieter, lantern-lit.

### `centuries-ledger` — c. 1400
> The same desk position centuries later. The room is now plastered stone with a heavy timber beam; the arch has been partly walled in, leaving a smaller window. On the desk: a large leather-bound ledger lying open with ruled columns and handwritten entries (illegible), a quill, a brass candlestick, a few coins. Warm candlelight, parchment and umber tones.

### `centuries-printed` — c. 1750
> The same desk position, eighteenth century. Panelled plaster walls, a multi-pane window with dusk light, a brass oil lamp. On the desk: a single printed merchant's document with blocks of type (illegible), a quill and inkstand, sealing wax, a pocket watch. Warm, soft, candle-and-lamp light.

### `centuries-accountbook` — c. 1880
> The same desk position, late nineteenth century counting house. Wood-panelled wainscot, a tall window, a gas lamp glowing on the wall. On the desk: an open account book with red and blue ruled columns and neat handwritten figures (illegible), a steel dip pen and inkwell, a blotter. Warm gaslight, sepia tones.

### `paper` — 1920s–1940s · The Paper System
> A 1920s accounts office, same desk position. Plaster wall above dark wood wainscoting, a tall multi-pane window with afternoon light, a wall clock, a wooden door with a frosted glass panel through which the silhouette of a manager in a hat can be seen, a tall wooden filing cabinet on the right with a clerk filing papers. On the oak desk: an open ledger, a green-shaded banker's lamp on the right, a stack of manila folders, invoices on a spike, a rubber stamp and ink pad, a fountain pen, a cash book. Amber, beige and dark-wood tones.

### `mechanical` — 1950s–1960s · The Mechanical Office
> A 1950s corporate office, same desk position. Venetian blinds on a window, a framed organisation chart on the wall, a wall clock, grey steel filing cabinets, typists at desks in the soft-focus background. On a steel-edged laminate desk: a dark green manual typewriter at the centre with a sheet of typed paper in the platen, a black rotary telephone on the right, an adding machine with a paper roll on the left, a small stack of punch cards. Muted industrial grey and brown, fluorescent office light.

### `computer` — 1970s–1980s · The Computer Revolution
> A 1970s computer room, same desk position. Behind the desk, a row of mainframe cabinets with reel-to-reel tape drives and small indicator lights; an operator in the background. On a dark laminate desk: a beige CRT terminal at the centre with glowing green text on a black screen, a mechanical keyboard, a stack of green-bar tractor-feed printout on the left, a reel of magnetic tape on the right. Dark industrial tones lit by the green CRT glow.

### `enterprise` — 1990s · The Enterprise Revolution
> A 1990s corporate office, same desk position. Fabric cubicle partitions in grey-blue, a suspended ceiling with fluorescent panels, colleagues' heads visible over the partitions. On a grey laminate desk: a beige desktop PC with a CRT monitor at the centre showing a spreadsheet with a line chart, a beige tower on the right, a beige keyboard and ball mouse, a few 3.5-inch floppy disks, a coffee mug. Neutral corporate blue-grey light.

### `internet` — 2000s · The Internet Revolution
> A 2000s office at night, same desk position. Floor-to-ceiling glass behind the desk with a city at night beyond, lights stretching to the horizon. On a light laminate desk: a silver flat LCD monitor at the centre showing a clean online store layout (no readable text), a slim keyboard, a silver flip phone on the right, a bank card on the left. Rich digital blue tones, the monitor the brightest light.

### `cloud` — 2010s · The Cloud & Mobile Revolution
> A bright modern workspace at blue hour, same desk position. Glass walls and pale wood. On a pale wooden desk: an open aluminium laptop at the centre showing a dashboard with charts (no readable text), a smartphone on the right showing an app, a tablet on the left showing a bar chart, a white coffee cup. Cyan, blue and white tones, soft screen light.

### `automation` — 2020–2025 · The Automation Revolution
> A modern office late at night, same desk position. A dark desk crowded with devices: an open laptop at the centre, a second monitor, a phone with many notifications, sticky notes, cables; several glowing screens around the room showing different dashboards and apps. The feeling is busy and fragmented. Dark digital blue tones, screen-lit.

### `ai` — 2026 · The AI Revolution
> The same desk position in a near-dark, minimal, premium room. The desk is now a single slab of black glass with a thin line of electric-blue light running along its back edge and a soft blue reflection on its surface. Nothing on the desk. Deep navy and black, faint architectural lines in the darkness, a subtle haze. Very minimal, very quiet, high-end technology company.

### `autonomous` — 2030 and beyond · The Autonomous Business
> The same black glass desk and room, a little more light. A person in a dark, well-cut jacket stands to the right of the desk, seen from behind or in profile, reviewing a thin transparent glass display that glows soft blue; calm, confident, in control. Deep navy, black, electric-blue accents, clean white highlights. Elegant and believable, not sci-fi; no robots, no holograms.

---

## 4. Adding them to the site

1. Save each image as `art/plates/<id>.jpg` using the ids above (e.g. `art/plates/paper.jpg`).
2. Run `npm run plates`. It centre-crops to 16:9, makes AVIF/WebP and a mobile size, and warns about anything too small.
3. Refresh `npm run dev`, or run `npm run build`. The site loads each photo just before its chapter.

**Fine-tuning:** if the line or overlays don't sit perfectly on a photo, you can nudge the shapes in `THREAD_PATHS` (`lib/geometry.ts`), or tweak when a plate appears with `at` in `content/plates.ts`.
