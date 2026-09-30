import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EvolutionTimeline } from "@/components/EvolutionTimeline";
import { SienaReveal } from "@/components/SienaReveal";
import { Solutions } from "@/components/Solutions";
import { ContactCTA, Footer } from "@/components/ContactCTA";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";
import { getAvailablePlates } from "@/lib/plates.server";

/** Home: the cinematic "Evolution of Business Systems" story. The short version lives at /lite. */
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
        <EvolutionTimeline plates={plates} />
        <SienaReveal />
        <Solutions />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
