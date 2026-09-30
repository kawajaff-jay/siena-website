import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { PLATES, type Plate } from "@/content/plates";
import plateThreads from "@/content/plate-threads.json";
import { asset } from "@/lib/asset";

export type AvailablePlate = Plate & {
  /** main image used on the cinematic stage */
  src: string;
  /** smaller image for mobile */
  small: string;
  avif: boolean;
  /** the recurring line, traced on this photograph (stage space), when the render recorded one */
  thread?: string;
};

/** Reads public/eras at build time; only plates whose files exist are used. */
export function getAvailablePlates(): AvailablePlate[] {
  // SIENA_PLATES=off shows the original illustrated (vector) version of the timeline
  if (process.env.SIENA_PLATES === "off") return [];
  const dir = path.join(process.cwd(), "public", "eras");
  const has = (f: string) => existsSync(path.join(dir, f));
  return PLATES.flatMap((p) => {
    const ext = has(`${p.id}.webp`) ? "webp" : has(`${p.id}.jpg`) ? "jpg" : null;
    if (!ext) return [];
    const small = has(`${p.id}-1280.${ext}`) ? asset(`/eras/${p.id}-1280.${ext}`) : asset(`/eras/${p.id}.${ext}`);
    const thread = (plateThreads as Record<string, string | undefined>)[p.id];
    return [{ ...p, src: asset(`/eras/${p.id}.${ext}`), small, avif: has(`${p.id}.avif`) && has(`${p.id}-1280.avif`), thread }];
  });
}
