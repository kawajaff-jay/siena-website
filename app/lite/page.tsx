import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SienaReveal } from "@/components/SienaReveal";
import { Solutions } from "@/components/Solutions";
import { ContactCTA, Footer } from "@/components/ContactCTA";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";

export const metadata: Metadata = { robots: { index: false } }; // alternative version, kept for later

/** Short version without the evolution story: S → logo → From paper. To software. To intelligence. → solutions → contact. */
export default function Lite() {
  return (
    <>
      <svg className="svg-defs" aria-hidden="true" focusable="false">
        <SceneDefs />
        <defs>
          <LockupDefs />
        </defs>
      </svg>
      <Header story={false} />
      <main>
        <SienaReveal opening />
        <Solutions />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
