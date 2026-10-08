import "@fontsource-variable/jetbrains-mono/wght.css";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT, SITE, SOLUTIONS, WHAT, WHY } from "@/content/site";
import s from "./e.module.css";

/** Preview E — "Prompt": the homepage reads as a conversation with SIENA. */
export default function PreviewE() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <a href="#top" className={s.brand} aria-label="SIENA — back to top">
          <BrandLogo variant="symbol" alt="" className={s.symbol} sizes="32px" priority />
          <BrandLogo variant="wordmark" alt="SIENA" className={s.word} sizes="100px" priority feather={false} />
          <span className={s.brandTag}>{SITE.tagline}</span>
        </a>
        <a href="#start" className={s.topCta}>Build your AI system</a>
      </header>

      <main id="top" className={s.main}>
        <section className={s.hero}>
          <BrandLogo variant="symbol" alt="" className={s.heroSymbol} sizes="96px" priority />
          <h1 className={s.h1}>What should your business run on?</h1>
          <div className={s.prompt} aria-label="Example request">
            <span className={s.typed}>Connect our invoices, bank feeds and forecasts into one flow</span>
            <span className={s.send} aria-hidden="true">↑</span>
          </div>
          <nav className={s.chips} aria-label="Jump to">
            <a href="#q-what">What does SIENA do?</a>
            <a href="#q-solutions">Which parts of my business?</a>
            <a href="#q-why">Why SIENA?</a>
            <a href="#start">How do we start?</a>
          </nav>
        </section>

        <ol className={s.thread}>
          <Turn id="q-what" q="What does SIENA do?" thought="2s">
            <p className={s.big}>{WHAT.headline}</p>
            <ul className={s.pillars}>
              {WHAT.pillars.map((p, i) => (
                <li key={p.title}>
                  <span>{i + 1}</span>
                  <div><strong>{p.title}.</strong> {p.body}</div>
                </li>
              ))}
            </ul>
          </Turn>

          <Turn id="q-solutions" q="Which parts of my business can it connect?" thought="3s">
            <p className={s.big}>{SOLUTIONS.headline} Here are the eight areas — open one to see the workflow.</p>
            <div className={s.sols}>
              {SOLUTIONS.items.map((it) => (
                <details key={it.id} className={s.sol}>
                  <summary>
                    <span className={s.solTitle}>{it.title}</span>
                    <span className={s.solBody}>{it.body}</span>
                  </summary>
                  <ol className={s.trace}>
                    {it.workflow.map((w) => <li key={w}>{w}</li>)}
                  </ol>
                  <p className={s.solResult}>→ {it.result}</p>
                </details>
              ))}
            </div>
          </Turn>

          <Turn id="q-why" q="Why SIENA, and not another tool?" thought="2s">
            <p className={s.big}>{WHY.headline}</p>
            <ul className={s.why}>
              {WHY.points.map((p) => (
                <li key={p.title}><strong>{p.title}</strong><span>{p.body}</span></li>
              ))}
            </ul>
          </Turn>

          <Turn id="start" q="How do we start?" thought="1s">
            <p className={s.big}>{CONTACT.headline}</p>
            <p>{CONTACT.body}</p>
            <div className={s.actions}>
              <a href={`mailto:${SITE.contactEmail}`} className={s.btn}>{CONTACT.cta}</a>
              <span className={s.mail}>{SITE.contactEmail}</span>
            </div>
          </Turn>
        </ol>
      </main>

      <footer className={s.foot}>
        <span>© {SITE.name} · {SITE.tagline}</span>
        <span>SIENA brings people in where judgment matters.</span>
      </footer>
    </div>
  );
}

function Turn({ id, q, thought, children }: { id: string; q: string; thought: string; children: React.ReactNode }) {
  return (
    <li id={id} className={s.turn}>
      <p className={s.user}>{q}</p>
      <div className={s.reply}>
        <BrandLogo variant="symbol" alt="SIENA" className={s.avatar} sizes="36px" />
        <div className={s.replyBody}>
          <p className={s.thought}><span aria-hidden="true">✦</span> Thought for {thought}</p>
          {children}
        </div>
      </div>
    </li>
  );
}
