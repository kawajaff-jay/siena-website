import { notFound } from "next/navigation";
import { FluxHome } from "@/components/flux/FluxHome";
import { LogoInterlude } from "@/components/flux/LogoInterlude";
import { LOGO_DESIGNS } from "../designs";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOGO_DESIGNS.map((d) => ({ v: d.v }));
}

/** The live homepage with one logo-interlude design after the About text. */
export default async function LogoPreview({ params }: { params: Promise<{ v: string }> }) {
  const { v } = await params;
  const d = LOGO_DESIGNS.find((x) => x.v === v);
  if (!d) notFound();
  return <FluxHome core={<LogoInterlude variant={d.v} />} />;
}
