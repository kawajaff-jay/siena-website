import { FluxHome } from "@/components/flux/FluxHome";
import { StoryLayer } from "@/components/StoryLayer";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";
import { getAvailablePlates } from "@/lib/plates.server";

/**
 * The homepage: Genesis Flux. "Experience the Evolution" (any #evolution link) opens the full-screen
 * Evolution story on top of it (StoryLayer). The previous homepage is kept at /preview/classic.
 */
export default function Home() {
  return (
    <>
      {/* shared SVG definitions used by the Evolution story's scenes */}
      <svg className="svg-defs" aria-hidden="true" focusable="false">
        <SceneDefs />
        <defs>
          <LockupDefs />
        </defs>
      </svg>
      <FluxHome />
      <StoryLayer plates={getAvailablePlates()} />
    </>
  );
}
