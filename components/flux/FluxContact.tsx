"use client";
import { useState, type FormEvent } from "react";
import { CONTACT, SITE, SOLUTIONS } from "@/content/site";

/** Terminal-style enquiry. The site is static, so it opens a pre-filled email in the visitor's mail app. */
export function FluxContact({ s }: { s: Record<string, string> }) {
  const [areas, setAreas] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggle = (t: string) => setAreas((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim(), email = String(f.get("email") || "").trim();
    const company = String(f.get("company") || "").trim(), note = String(f.get("note") || "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Add your name and a valid email address."); return;
    }
    setError("");
    const subject = `Build your AI system${company ? ` — ${company}` : ""}`;
    const lines = [`Name: ${name}`, `Email: ${email}`];
    if (company) lines.push(`Company: ${company}`);
    if (areas.length) lines.push(`Where systems feel fragmented: ${areas.join(", ")}`);
    if (note) lines.push("", note);
    const body = lines.join("\n");
    const steps = ["> packaging request", `> modules flagged: ${areas.length || "none yet"}`, "> opening your email app…"];
    setLog([]);
    steps.forEach((l, i) => window.setTimeout(() => setLog((x) => [...x, l]), 350 * (i + 1)));
    window.setTimeout(() => {
      window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 350 * (steps.length + 1));
  };

  return (
    <section id="contact" className={`${s.section} ${s.contactWrap}`} data-reveal="">
      <div className={s.contactCopy}>
        <p className={s.eyebrow}>{CONTACT.eyebrow}</p>
        <h2 className={s.h2}>{CONTACT.headline}</h2>
        <p className={s.sectionLead}>{CONTACT.body}</p>
        <p className={s.direct}>Or write to us directly: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
      </div>

      <form className={s.terminal} onSubmit={submit} noValidate data-spot="">
        <div className={s.termBar} aria-hidden="true"><span /><span /><span /><p>siena://initiate</p></div>
        <div className={s.termBody}>
          <div className={s.fieldRow}>
            <label className={s.field}><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label className={s.field}><span>Company</span><input name="company" autoComplete="organization" /></label>
          </div>
          <label className={s.field}><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          <fieldset className={s.areas}>
            <legend>Where do your systems feel fragmented?</legend>
            <div>
              {SOLUTIONS.items.map((it) => (
                <button key={it.id} type="button" aria-pressed={areas.includes(it.title)} onClick={() => toggle(it.title)}>
                  {it.title}
                </button>
              ))}
            </div>
          </fieldset>
          <label className={s.field}><span>Anything else? <em>(optional)</em></span><textarea name="note" rows={3} /></label>
          {error && <p className={s.error} role="alert">{error}</p>}
          <div className={s.termFoot}>
            <button type="submit" className={s.btn} data-magnet="">{CONTACT.cta} →</button>
            <p className={s.termNote}>Opens a pre-filled email in your mail app.</p>
          </div>
          {log.length > 0 && <pre className={s.log} aria-live="polite">{log.join("\n")}</pre>}
        </div>
      </form>
    </section>
  );
}
