import { FluxHome } from "@/components/flux/FluxHome";
import { SolutionsWheel } from "@/components/flux/SolutionsWheel";

/** Preview T — solutions wheel "Lens": names magnify through a lens. The rest of the page is the live homepage. */
export default function PreviewT() {
  return <FluxHome solutions={<SolutionsWheel variant="lens" />} />;
}
