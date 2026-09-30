import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Solutions } from "@/components/Solutions";
import { ContactCTA, Footer } from "@/components/ContactCTA";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";

export const metadata: Metadata = {
  title: "SIENA — AI Solutions & Systems",
  robots: { index: false }, // preview of the site without the evolution story
};

/** The same site without the scroll-driven evolution timeline. The full story stays on the home page. */
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
        <Hero story={false} />
        <Solutions />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
