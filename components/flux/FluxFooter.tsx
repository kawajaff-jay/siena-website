import { FooterReveal } from "./FooterReveal";
import { CONTACT, SERVICES, SITE } from "@/content/site";
import { asset } from "@/lib/asset";

/** Full footer: brand, navigation, every module (deep-links into the explorer), the Evolution story, contact. */
export function FluxFooter({ s }: { s: Record<string, string> }) {
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <FooterReveal className={s.footBrand} emClass={s.footEm} />
        <nav className={s.footCols} aria-label="Footer">
          <div>
            <h2>Navigate</h2>
            <ul>
              <li><a href="#what">About SIENA</a></li>
              <li><a href="#solutions">Solutions</a></li>
              <li><a href="#why">Why SIENA</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h2>Modules</h2>
            <ul>
              {SERVICES.map((it) => <li key={it.id}><a href={`#solution-${it.id}`}>{it.title}</a></li>)}
            </ul>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              <li><a href="#evolution">Experience the Evolution →</a></li>
            </ul>
            <h2 className={s.footH2Gap}>Contact</h2>
            <ul>
              <li><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
              <li><a href="#contact">{CONTACT.cta} →</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className={s.footBar}>
        <span>© {new Date().getFullYear()} {SITE.name} · {SITE.tagline}</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
