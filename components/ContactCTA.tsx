import { CONTACT, SITE } from "@/content/site";
import { BrandLogo } from "./BrandLogo";

export function ContactCTA() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="container contact-inner">
        <p className="eyebrow">{CONTACT.eyebrow}</p>
        <h2 id="contact-heading" className="section-title">
          {CONTACT.headline}
        </h2>
        <p className="contact-body">{CONTACT.body}</p>
        <a className="btn btn--primary" href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("Build my AI system")}`}>
          {CONTACT.cta}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <BrandLogo variant="wordmark" alt="SIENA" className="footer-word" sizes="140px" feather={false} />
        <p>
          © {new Date().getFullYear()} SIENA — AI Solutions &amp; Systems
        </p>
      </div>
    </footer>
  );
}
