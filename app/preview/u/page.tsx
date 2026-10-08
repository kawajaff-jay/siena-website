import { FluxHome } from "@/components/flux/FluxHome";
import { SolutionsWheel } from "@/components/flux/SolutionsWheel";

/** Preview U — solutions wheel "Arc": half-wheel from the left edge. The rest of the page is the live homepage. */
export default function PreviewU() {
  return <FluxHome solutions={<SolutionsWheel variant="arc" />} />;
}
