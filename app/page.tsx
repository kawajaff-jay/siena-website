import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Solutions } from "@/components/Solutions";
import { ContactCTA, Footer } from "@/components/ContactCTA";
import { StoryLayer } from "@/components/StoryLayer";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";
import { getAvailablePlates } from "@/lib/plates.server";

/**
 * Home: the fast, conversion-focused site. The cinematic "Evolution of Business Systems"
 * story is optional — it opens full-screen from the hero button or the "The Evolution" link.
 */
export default function Home() {
  const plates = getAvailablePlates();
  return (
    <>
      {/* Shared SVG definitions (rendered, zero-size — referenced by every scene SVG) */}
      <svg className="svg-defs" aria-hidden="true" focusable="false">
        <SceneDefs />
        <defs>
          <LockupDefs />
        </defs>
      </svg>
      <Header />
      <main>
        <Hero />
        <Solutions />
        <ContactCTA />
      </main>
      <Footer />
      <StoryLayer plates={plates} />
    </>
  );
}
