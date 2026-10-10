import { notFound } from "next/navigation";
import { FluxHome } from "@/components/flux/FluxHome";
import { CURSOR_DESIGNS } from "../designs";

export const dynamicParams = false;
export function generateStaticParams() {
  return CURSOR_DESIGNS.map((d) => ({ v: d.v }));
}

/** The live homepage with one subtle cursor style over the hero. */
export default async function CursorPreview({ params }: { params: Promise<{ v: string }> }) {
  const { v } = await params;
  const d = CURSOR_DESIGNS.find((x) => x.v === v);
  if (!d) notFound();
  return <FluxHome cursor={d.v} />;
}
