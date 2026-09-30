import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Solutions } from "@/components/Solutions";
import { ContactCTA, Footer } from "@/components/ContactCTA";
import { SceneDefs } from "@/components/scenes/common";
import { LockupDefs } from "@/components/AIConvergence";

/** Home page: brand, solutions and contact. The full evolution story lives at /story. */
export default function Home() {
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
