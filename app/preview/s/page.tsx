import { FluxHome } from "@/components/flux/FluxHome";
import { SolutionsWheel } from "@/components/flux/SolutionsWheel";

/** Preview S — solutions wheel "Drum": 3D rolling cylinder. The rest of the page is the live homepage. */
export default function PreviewS() {
  return <FluxHome solutions={<SolutionsWheel variant="drum" />} />;
}
