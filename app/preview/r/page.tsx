import { FluxHome } from "@/components/flux/FluxHome";
import { SolutionsWheel } from "@/components/flux/SolutionsWheel";

/** Preview R — solutions wheel "Dial": circular dial with ticks. The rest of the page is the live homepage. */
export default function PreviewR() {
  return <FluxHome solutions={<SolutionsWheel variant="dial" />} />;
}
