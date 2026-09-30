import { NAV } from "@/content/site";
import { BrandLogo } from "./BrandLogo";

export function Header({ story = true }: { story?: boolean }) {
  return (
    <header className="site-header">
      <a href="#top" className="site-brand" aria-label="SIENA — back to top">
        <BrandLogo variant="symbol" alt="" className="site-brand-symbol" sizes="40px" priority />
        <BrandLogo variant="wordmark" alt="SIENA" className="site-brand-word" sizes="120px" priority feather={false} />
      </a>
      <nav aria-label="Primary">
        <ul className="site-nav">
          {NAV.filter((n) => story || n.href !== "#evolution").map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#contact" className="btn btn--small">
        Build Your AI System
      </a>
    </header>
  );
}
