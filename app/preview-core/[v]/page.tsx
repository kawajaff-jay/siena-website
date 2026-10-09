import { notFound } from "next/navigation";
import { FluxHome } from "@/components/flux/FluxHome";
import { EnergyCore } from "@/components/flux/EnergyCore";
import { CORE_DESIGNS } from "../designs";

export const dynamicParams = false;
export function generateStaticParams() {
  return CORE_DESIGNS.map((d) => ({ v: d.v }));
}

/** The live homepage with the About diagram replaced by one energy-core design. */
export default async function CorePreview({ params }: { params: Promise<{ v: string }> }) {
  const { v } = await params;
  const d = CORE_DESIGNS.find((x) => x.v === v);
  if (!d) notFound();
  return <FluxHome core={<EnergyCore variant={d.v} />} />;
}
