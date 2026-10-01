"use client";
/**
 * Solutions — SIENA's intelligent modules, working as one system.
 *
 * Arrival (scrubbed to scroll, reversible): eyebrow → headline → the network draws out from the
 * centre → a central pulse (the system powering on) → the modules bloom outward.
 * Interaction: hovering (or keyboard-focusing) a module brightens its path, sends a pulse to the
 * centre and on to the modules it exchanges data with, which glow faintly. Touch never relies on
 * hover. Each module is a real button that opens the detail drawer.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SOLUTIONS } from "@/content/site";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { CINEMATIC_QUERY, REDUCED_QUERY } from "@/lib/mode";
import { Particles } from "./Particles";
import { SolutionVisual } from "./SolutionVisual";
import { SolutionDrawer } from "./SolutionDrawer";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const ITEMS = SOLUTIONS.items;
const INDEX = Object.fromEntries(ITEMS.map((s, i) => [s.id, i])) as Record<string, number>;
const WIDE = "(min-width: 1101px)"; // 4 × 2 grid: the network is drawn

type Geo = { hub: [number, number]; ports: [number, number][] };

export function Solutions() {
  const ref = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const geo = useRef<Geo | null>(null);
  const pulseTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  /* ── network geometry: measured from the real module positions ─────────────────── */
  const measure = useCallback(() => {
    const field = fieldRef.current, svg = svgRef.current;
    if (!field || !svg) return;
    if (!window.matchMedia(WIDE).matches) { geo.current = null; return; }
    const w = field.clientWidth, h = field.clientHeight;
    // layout positions (offset*), so an in-progress arrival transform doesn't skew the network
    const cards = Array.from(field.querySelectorAll<HTMLElement>(".sol-card")).map((c) => {
      let left = 0, top = 0;
      for (let el: HTMLElement | null = c; el && el !== field; el = el.offsetParent as HTMLElement | null) { left += el.offsetLeft; top += el.offsetTop; }
      return { cx: left + c.offsetWidth / 2, top, bottom: top + c.offsetHeight };
    });
    if (cards.length !== 8) return;
    const row1Bottom = Math.max(...cards.slice(0, 4).map((c) => c.bottom));
    const row2Top = Math.min(...cards.slice(4).map((c) => c.top));
    const hub: [number, number] = [w / 2, (row1Bottom + row2Top) / 2];
    const ports = cards.map((c, i) => [c.cx, i < 4 ? c.bottom : c.top] as [number, number]);
    geo.current = { hub, ports };

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const [hx, hy] = hub;
    const xs = ports.map((p) => p[0]);
    const set = (sel: string, d: string) => svg.querySelectorAll(sel).forEach((el) => el.setAttribute("d", d));
    set(".sol-bus--l", `M${hx} ${hy} H${Math.min(...xs)}`);
    set(".sol-bus--r", `M${hx} ${hy} H${Math.max(...xs)}`);
    ports.forEach(([x, y], i) => {
      set(`.sol-stub[data-i="${i}"]`, `M${x} ${hy} V${y}`);
      set(`.sol-path[data-i="${i}"]`, `M${hx} ${hy} H${x} V${y}`);
    });
    svg.querySelectorAll(".sol-hub, .sol-hub-ring").forEach((c) => { c.setAttribute("cx", String(hx)); c.setAttribute("cy", String(hy)); });
    const core = field.querySelector<HTMLElement>(".sol-core");
    if (core) { core.style.left = `${hx}px`; core.style.top = `${hy}px`; }
  }, []);

  /* ── arrival: scrubbed to scroll ─────────────────────────────────────────────── */
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia(root);
    const q = gsap.utils.selector(root);

    // wide: network draws → system powers on → modules bloom outward
    mm.add(`${CINEMATIC_QUERY} and ${WIDE}`, () => {
      root.dataset.anim = "on";
      measure();
      const onRefreshInit = () => measure();
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      const grid = { each: 0.045, from: "center" as const, grid: [2, 4] as [number, number] };
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root, start: "top 88%", end: "top 8%", scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.fromTo(q("[data-sol-eyebrow]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0)
        .fromTo(q("[data-sol-title]"), { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.38 }, 0.07)
        .fromTo(q(".sol-bus"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.34, ease: "power1.inOut" }, 0.3)
        .fromTo(q(".sol-hub"), { autoAlpha: 0, scale: 0.2, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.12, ease: "back.out(2)" }, 0.5)
        .fromTo(q(".sol-hub-ring"), { autoAlpha: 0.7, scale: 1, transformOrigin: "50% 50%" }, { autoAlpha: 0, scale: 9, duration: 0.3, ease: "power2.out" }, 0.52)
        // the system powers on: the network and the central bloom brighten, then settle to a whisper
        .fromTo(fieldRef.current, { "--base": 0, "--boost": 0 }, { "--base": 1, "--boost": 1, duration: 0.16, ease: "sine.out" }, 0.3)
        .to(fieldRef.current, { "--boost": 0, duration: 0.34, ease: "sine.inOut" }, 0.78)
        .fromTo(q(".sol-core"), { scale: 0.6 }, { scale: 1, duration: 0.2 }, 0.5)
        .fromTo(q(".sol-stub"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.14, ease: "none", stagger: { each: 0.02, from: "center" } }, 0.56)
        .fromTo(q(".sol-card"), { autoAlpha: 0, y: 30, scale: 0.93 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: grid }, 0.6)
        .fromTo(q(".sol-card-bloom"), { opacity: 0 }, { opacity: 1, duration: 0.14, stagger: grid, ease: "sine.out" }, 0.66)
        .to(q(".sol-card-bloom"), { opacity: 0, duration: 0.26, stagger: grid, ease: "sine.inOut" }, 0.82);

      // depth: the headline drifts slower than the modules, the background network slower still
      const depth = gsap.timeline({ scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      depth.fromTo(q(".sol-head"), { y: 40 }, { y: -40, ease: "none" }, 0)
        .fromTo(q(".sol-ambient-net"), { yPercent: 6 }, { yPercent: -6, ease: "none" }, 0);

      return () => { ScrollTrigger.removeEventListener("refreshInit", onRefreshInit); delete root.dataset.anim; };
    });

    // tablet: same arrival without the drawn network
    mm.add(`${CINEMATIC_QUERY} and (min-width: 761px) and (max-width: 1100px)`, () => {
      root.dataset.anim = "on";
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: { trigger: root, start: "top 88%", end: "top 10%", scrub: 0.8 } });
      tl.fromTo(q("[data-sol-eyebrow], [data-sol-title]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08 }, 0)
        .fromTo(q(".sol-card"), { autoAlpha: 0, y: 40, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06 }, 0.35);
      return () => { delete root.dataset.anim; };
    });

    // phones: one module per row, each arriving as it reaches the screen (no parallax)
    mm.add(`${CINEMATIC_QUERY} and (max-width: 760px)`, () => {
      root.dataset.anim = "on";
      gsap.fromTo(q("[data-sol-eyebrow], [data-sol-title]"), { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: q(".sol-head")[0], start: "top 90%", end: "top 60%", scrub: 0.6 },
      });
      q(".sol-card").forEach((card) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 36, scale: 0.97 }, {
          autoAlpha: 1, y: 0, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 96%", end: "top 70%", scrub: 0.6 },
        });
      });
      return () => { delete root.dataset.anim; };
    });

    // the network follows the layout (window resizes, font loading)
    const ro = new ResizeObserver(() => measure());
    if (fieldRef.current) ro.observe(fieldRef.current);
    return () => { ro.disconnect(); mm.revert(); };
  }, [measure]);

  /* ── the little drawings only move while their module is on screen ─────────────── */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".sol-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  /* ── one system: hover / focus a module → its path, a pulse, related modules ─────── */
  const deactivate = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    pulseTl.current?.kill();
    pulseTl.current = null;
    fieldRef.current?.classList.remove("net-on");
    root.querySelectorAll(".is-active, .is-related, .is-lit, .is-soft").forEach((el) => el.classList.remove("is-active", "is-related", "is-lit", "is-soft"));
    root.querySelectorAll<SVGPathElement>(".sol-pulse").forEach((p) => { p.style.opacity = "0"; });
  }, []);

  const activate = useCallback((i: number) => {
    const root = ref.current, svg = svgRef.current;
    if (!root) return;
    deactivate();
    const cards = root.querySelectorAll<HTMLElement>(".sol-card");
    const related = ITEMS[i].related.map((id) => INDEX[id]);
    cards[i]?.classList.add("is-active");
    related.forEach((j) => cards[j]?.classList.add("is-related"));
    const g = geo.current;
    if (!svg || !g || window.matchMedia(REDUCED_QUERY).matches) return;
    svg.querySelector(`.sol-path[data-i="${i}"]`)?.classList.add("is-lit");
    related.forEach((j) => svg.querySelector(`.sol-path[data-i="${j}"]`)?.classList.add("is-soft"));
    svg.querySelector(".sol-hub")?.classList.add("is-lit");
    fieldRef.current?.classList.add("net-on"); // the network becomes the star for this moment

    // pulses: module → centre, then centre → each related module (a calm loop while hovered)
    const [hx, hy] = g.hub;
    const pulses = Array.from(svg.querySelectorAll<SVGPathElement>(".sol-pulse"));
    const [px, py] = g.ports[i];
    const routes = [`M${px} ${py} V${hy} H${hx}`, ...related.map((j) => `M${hx} ${hy} H${g.ports[j][0]} V${g.ports[j][1]}`)];
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.3 });
    routes.slice(0, pulses.length).forEach((d, k) => {
      const p = pulses[k];
      p.setAttribute("d", d);
      const len = p.getTotalLength();
      const seg = Math.min(46, len * 0.5);
      gsap.set(p, { strokeDasharray: `${seg} ${len + seg}`, strokeDashoffset: seg, opacity: 1 });
      tl.fromTo(p, { strokeDashoffset: seg }, { strokeDashoffset: -len, duration: k === 0 ? 0.55 : 0.7, ease: k === 0 ? "power1.in" : "power1.out" }, k === 0 ? 0 : 0.5 + (k - 1) * 0.08);
    });
    pulseTl.current = tl;
  }, [deactivate]);

  useEffect(() => () => { pulseTl.current?.kill(); }, []);

  /* ── the drawer ─────────────────────────────────────────────────────────────── */
  const openModule = (i: number, btn: HTMLButtonElement) => { opener.current = btn; deactivate(); setOpen(i); };
  const closeDrawer = useCallback((thenGoTo?: string) => {
    setOpen(null);
    const target = thenGoTo ? document.querySelector(thenGoTo) : null;
    if (target) {
      const reduced = window.matchMedia(REDUCED_QUERY).matches;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
    } else {
      opener.current?.focus({ preventScroll: true });
    }
  }, []);
  const navigate = useCallback((i: number) => {
    setOpen(i);
    opener.current = ref.current?.querySelectorAll<HTMLButtonElement>(".sol-card-hit")[i] ?? opener.current;
  }, []);

  return (
    <section className="solutions" id="solutions" ref={ref} aria-labelledby="solutions-heading">
      <div className="sol-ambient" aria-hidden="true">
        <div className="sol-glow sol-glow--a" />
        <div className="sol-glow sol-glow--b" />
        <svg className="sol-ambient-net" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-40 240 C 380 170 760 330 1640 200" />
          <path d="M-40 660 C 420 740 980 560 1640 700" />
          <path d="M300 -40 C 360 300 260 620 340 940" />
        </svg>
        <div className="sol-particles">
          <Particles density={0.22} tone="blue" />
        </div>
      </div>

      <div className="container">
        <div className="sol-head">
          <p className="eyebrow" data-sol-eyebrow>{SOLUTIONS.eyebrow}</p>
          <h2 id="solutions-heading" className="section-title" data-sol-title>
            {SOLUTIONS.headline}
          </h2>
        </div>

        <div className="sol-field" ref={fieldRef}>
          {/* the network the modules sit on (wide screens) — paths are measured from the real layout */}
          <span className="sol-core" aria-hidden="true" />
          <svg className="sol-net" ref={svgRef} aria-hidden="true" focusable="false">
            <g className="sol-base">
              <path className="sol-bus sol-bus--l" />
              <path className="sol-bus sol-bus--r" />
              {ITEMS.map((s, i) => <path key={`s${s.id}`} className="sol-stub" data-i={i} />)}
            </g>
            {ITEMS.map((s, i) => <path key={`p${s.id}`} className="sol-path" data-i={i} />)}
            {[0, 1, 2, 3].map((k) => <path key={`u${k}`} className="sol-pulse" />)}
            <circle className="sol-hub-ring" r="4" />
            <circle className="sol-hub" r="4" />
          </svg>

          <ul className="sol-grid">
            {ITEMS.map((s, i) => (
              <li key={s.id} className="sol-item">
                <article
                  className="sol-card"
                  data-solution={s.visual}
                  onPointerEnter={(e) => { if (e.pointerType === "mouse") activate(i); }}
                  onPointerLeave={(e) => { if (e.pointerType === "mouse") deactivate(); }}
                >
                  <span className="sol-card-bloom" aria-hidden="true" />
                  <span className="sol-card-sheen" aria-hidden="true" />
                  <div className="sol-card-top">
                    <span className="sol-card-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <SolutionVisual kind={s.visual} />
                  </div>
                  <h3>
                    {/* the whole module is this button (its ::after covers the card) */}
                    <button
                      type="button"
                      className="sol-card-hit"
                      aria-haspopup="dialog"
                      aria-expanded={open === i}
                      aria-controls="solution-drawer"
                      aria-describedby={`sol-desc-${s.id}`}
                      onClick={(e) => openModule(i, e.currentTarget)}
                      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) activate(i); }}
                      onBlur={deactivate}
                    >
                      {s.title}
                    </button>
                  </h3>
                  <p className="sol-card-body" id={`sol-desc-${s.id}`}>{s.body}</p>
                  <p className="sol-card-result">{s.result}</p>
                  <span className="sol-card-more" aria-hidden="true">Explore <span>→</span></span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SolutionDrawer index={open} onClose={closeDrawer} onNavigate={navigate} />
    </section>
  );
}
