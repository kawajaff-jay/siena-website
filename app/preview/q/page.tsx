import { FluxHome } from "@/components/flux/FluxHome";
import { SolutionsWheel } from "@/components/flux/SolutionsWheel";

/** Preview Q — solutions wheel "Tide": hazy, fluid like water. The rest of the page is the live homepage. */
export default function PreviewQ() {
  return <FluxHome solutions={<SolutionsWheel variant="tide" />} />;
}
