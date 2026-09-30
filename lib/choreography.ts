"use client";
/**
 * Master timeline for the evolution stage.
 *
 *  - Timeline time is measured in "chapter weights" (content/eras.ts). One chapter of weight 1 ≈ one viewport of scroll.
 *  - Generic rules (driven by data attributes rendered from EvolutionScene's layer registry) handle
 *    layer cross-fades, palette, copy, thread morphing and the year counter for every chapter.
 *  - `extras` hold the bespoke moments of individual chapters.
 */
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ERAS, type Era } from "@/content/eras";
import { AI_NODES, FLOW_NODES, LOCKUP, THREAD_PATHS } from "@/lib/geometry";
import { WINDOW_LAYOUT } from "@/components/scenes/DigitalArt";

gsap.registerPlugin(MotionPathPlugin);

export type Chapter = { era: Era; index: number; start: number; end: number; w: number };
type Ctx = {
  tl: gsap.core.Timeline;
  plateEras: Set<string>;
  q: (sel: string) => Element[];
  one: (sel: string) => Element | null;
  ch: Chapter;
  lite: boolean;
};

export function chapters(): Chapter[] {
  let t = 0;
  return ERAS.map((era, index) => {
    const c = { era, index, start: t, end: t + era.weight, w: era.weight };
    t += era.weight;
    return c;
  });
}

const paletteVars = (e: Era) => ({
  "--sky": e.palette.sky,
  "--wall": e.palette.wall,
  "--desk": e.palette.desk,
  "--desk-edge": e.palette.deskEdge,
  "--light": e.palette.light,
  "--accent": e.palette.accent,
});

/** When (as a fraction of the chapter) the thread morphs into this chapter's shape. */
const THREAD_AT: Record<string, number> = { ai: 0.36, record: 0 };

export function buildEvolutionTimeline(root: HTMLElement, { lite = false, plateEras = new Set<string>() }: { lite?: boolean; plateEras?: Set<string> } = {}) {
  const q = (sel: string) => Array.from(root.querySelectorAll(sel));
  const one = (sel: string) => root.querySelector(sel);
  const stage = one(".evo-stage") as HTMLElement;
  const CH = chapters();
  const total = CH[CH.length - 1].end;
  const idx = (id: string) => ERAS.findIndex((e) => e.id === id);

  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  tl.set({}, {}, total); // lock duration to the total weight

  /* ── palette ─────────────────────────────────────────────── */
  gsap.set(stage, paletteVars(ERAS[0]));
  CH.slice(1).forEach((c) => {
    tl.to(stage, { ...paletteVars(c.era), duration: Math.min(0.7, c.w * 0.45), ease: "power1.inOut" }, c.start - 0.2);
  });

  /* ── layers (generic cross-fades) ────────────────────────── */
  q("[data-layer]").forEach((el) => {
    const h = el as HTMLElement;
    if (h.dataset.custom !== undefined) return;
    const fi = idx(h.dataset.from!);
    const ti = idx(h.dataset.to!);
    gsap.set(h, { autoAlpha: fi === 0 ? 1 : 0 });
    if (fi > 0) {
      const c = CH[fi];
      if (h.dataset.fadeIn === "slow") tl.to(h, { autoAlpha: 1, duration: c.w * 0.85, ease: "power1.inOut" }, c.start);
      else tl.to(h, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, c.start - 0.12);
    }
    if (ti < CH.length - 1) {
      const c = CH[ti];
      if (h.dataset.fadeOut === "slow") tl.to(h, { autoAlpha: 0, duration: c.w * 0.8, ease: "power1.inOut" }, c.start + c.w * 0.1);
      else tl.to(h, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, c.end - 0.18);
    }
  });
  // custom layers start hidden unless visible in chapter 0
  q("[data-layer][data-custom]").forEach((el) => {
    const h = el as HTMLElement;
    gsap.set(h, { autoAlpha: idx(h.dataset.from!) === 0 ? 1 : 0 });
  });

  /* ── photographic plates: cross-dissolve in scroll time, load progressively ── */
  const plateEls = q("[data-plate]") as SVGGElement[];
  type State = { t: number; el: SVGGElement | null; d: number };
  const states: State[] = [];
  CH.forEach((c) => {
    const ps = plateEls
      .filter((p) => p.dataset.era === c.era.id)
      .sort((a, b) => Number(a.dataset.at) - Number(b.dataset.at));
    if (!ps.length) states.push({ t: c.start, el: null, d: 0.35 });
    ps.forEach((p) => states.push({ t: c.start + Number(p.dataset.at) * c.w, el: p, d: Number(p.dataset.dissolve) || 0.35 }));
  });
  gsap.set(plateEls, { autoAlpha: 0 });
  const plateTime = new Map<Element, number>();
  states.forEach((st, i) => {
    if (st.el && !plateTime.has(st.el)) plateTime.set(st.el, st.t);
    const prev = states[i - 1];
    if (!prev) { if (st.el) gsap.set(st.el, { autoAlpha: 1 }); return; }
    if (prev.el === st.el) return;
    const at = Math.max(0, st.t - st.d / 2);
    if (st.el && st.el.dataset.reveal === "top-down") {
      // a soft band travels down the frame: the room changes first, the desk objects last
      const a = st.el.querySelector("[data-reveal-a]");
      const b = st.el.querySelector("[data-reveal-b]");
      const BAND = 0.42;
      const band = { p: -BAND };
      const apply = () => {
        a?.setAttribute("offset", String(Math.min(1, Math.max(0, band.p))));
        b?.setAttribute("offset", String(Math.min(1, Math.max(0, band.p + BAND))));
      };
      apply();
      tl.set(st.el, { autoAlpha: 1 }, at);
      tl.fromTo(band, { p: -BAND }, { p: 1, duration: st.d, ease: "sine.inOut", immediateRender: false, onUpdate: apply }, at);
    } else if (st.el) tl.fromTo(st.el, { autoAlpha: 0 }, { autoAlpha: 1, duration: st.d, ease: "power1.inOut", immediateRender: false }, at);
    if (prev.el) {
      if (st.el) tl.set(prev.el, { autoAlpha: 0 }, at + st.d);
      else tl.to(prev.el, { autoAlpha: 0, duration: st.d, ease: "power1.inOut" }, at);
    }
  });
  const loaded = new Set<Element>();
  const loadPlatesAround = (t: number) => {
    plateTime.forEach((pt, el) => {
      if (loaded.has(el) || pt > t + 2.6 || pt < t - 3) return;
      loaded.add(el);
      const img = el.querySelector("image");
      const src = img?.getAttribute("data-src");
      if (!img || !src) return;
      const pre = new Image();
      pre.src = src;
      (pre.decode ? pre.decode() : Promise.resolve()).catch(() => {}).finally(() => img.setAttribute("href", src));
    });
  };
  loadPlatesAround(0);

  /* ── camera: every chapter settles with a gentle push-in ── */
  const camera = one("[data-camera]");
  const PUSH = new Set(["paper", "mechanical", "computer", "enterprise", "internet", "cloud", "automation"]);
  CH.forEach((c) => {
    if (!PUSH.has(c.era.id)) return;
    tl.fromTo(camera, { scale: 1.035, svgOrigin: "960 520" }, { scale: 1, svgOrigin: "960 520", duration: c.w * 0.6, ease: "power1.out", immediateRender: false }, c.start);
  });

  /* ── copy ─────────────────────────────────────────────────── */
  CH.forEach((c) => {
    const el = one(`.era-label--stage[data-copy="${c.era.id}"]`);
    if (!el) return;
    const statement = el.querySelector("[data-statement]");
    const beats = Array.from(el.querySelectorAll("[data-beat]"));
    const kws = Array.from(el.querySelectorAll("[data-kw]"));
    const lead = el.querySelector("[data-lead]");
    gsap.set(el, { autoAlpha: 0 });
    if (beats.length) gsap.set(beats, { autoAlpha: 0, y: 24 });
    const inAt = c.start + (c.index === 0 ? 0.02 : 0.1);
    tl.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out", immediateRender: false }, inAt);
    tl.from(kws, { autoAlpha: 0, y: 12, stagger: 0.035, duration: 0.2, ease: "power2.out", immediateRender: false }, inAt + 0.14);
    if (lead) tl.from(lead, { autoAlpha: 0, duration: 0.25, immediateRender: false }, inAt + 0.2);
    beats.forEach((b, i) => {
      const at = c.start + c.w * (c.era.beatAt?.[i] ?? 0.5 + i * 0.15);
      tl.to(statement, { autoAlpha: 0.28, duration: 0.2 }, at);
      tl.to(b, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, at + 0.06);
    });
    const outAt = c.era.id === "ai" ? c.start + c.w * 0.66 : c.end - 0.26;
    if (c.index < CH.length - 1) tl.to(el, { autoAlpha: 0, y: -28, duration: 0.24, ease: "power2.in" }, outAt);
  });

  /* ── the thread ───────────────────────────────────────────── */
  const core = one("[data-thread]") as SVGPathElement;
  const glow = one("[data-thread-glow]") as SVGPathElement;
  // where a photograph recorded its own trace of the line, the thread follows that trace
  const plateThread = (el: Element | null) => (el as HTMLElement | null)?.dataset?.threadD || null;
  const targets: { t: number; d: string; dur: number }[] = [];
  CH.forEach((c) => {
    const ps = plateEls.filter((p) => p.dataset.era === c.era.id).sort((a, b) => Number(a.dataset.at) - Number(b.dataset.at));
    const fallback = { t: c.start + c.w * (THREAD_AT[c.era.id] ?? 0.04), d: THREAD_PATHS[c.era.thread] as string, dur: c.era.id === "ai" ? 0.55 : 0.45 };
    if (!ps.length) { targets.push(fallback); return; }
    ps.forEach((p, k) => {
      const d = plateThread(p);
      const at = Number(p.dataset.at);
      if (!d) { if (k === 0) targets.push(fallback); return; }
      // the line re-forms as the desk part of the plate arrives (late in a slow dissolve)
      const dis = Number(p.dataset.dissolve) || 0.35;
      const slow = p.dataset.reveal === "top-down";
      targets.push({ t: c.start + (at === 0 ? c.w * 0.04 : at * c.w + (slow ? dis * 0.1 : 0)), d, dur: slow ? dis * 0.45 : 0.4 });
    });
  });
  if (targets[0]?.d) { core.setAttribute("d", targets[0].d); glow.setAttribute("d", targets[0].d); }
  targets.slice(1).forEach((tg, i) => {
    if (tg.d === targets[i].d) return;
    tl.to([core, glow], { morphSVG: tg.d, duration: tg.dur, ease: "power2.inOut" }, Math.max(0, tg.t));
  });
  gsap.set([core, glow], { drawSVG: "0%" });
  if (plateEras.has(ERAS[0].id)) gsap.set([core, glow], { stroke: ERAS[0].palette.accent, opacity: 1 });
  if (plateEras.has(ERAS[0].id)) gsap.set(glow, { opacity: 0.25 });
  CH.forEach((c) => {
    const prev = CH[c.index - 1];
    if (!prev) return;
    const at = c.start + c.w * (THREAD_AT[c.era.id] ?? 0.04);
    const dur = c.era.id === "ai" ? 0.55 : 0.45;
    // on a photograph the line becomes light (era accent) rather than flat ink
    const photo = plateEras.has(c.era.id);
    const color = photo ? c.era.palette.accent : c.era.threadColor;
    const g = photo ? Math.max(c.era.threadGlow, 0.4) : c.era.threadGlow;
    tl.to(core, { stroke: color, duration: dur }, at);
    tl.to(glow, { opacity: g * (lite ? 0.35 : 0.55), stroke: color, duration: dur }, at);
  });

  /* ── year counter + rail ──────────────────────────────────── */
  const yearEl = one("[data-year]");
  const suffixEl = one("[data-year-suffix]");
  const fill = one("[data-progress-fill]") as HTMLElement | null;
  const rail = q("[data-rail]");
  const counter = { y: ERAS[0].yearFrom };
  CH.forEach((c) => {
    tl.set(counter, { y: c.era.yearFrom }, c.start);
    const keys = c.era.yearKeys;
    if (keys?.length) {
      keys.slice(1).forEach(([f, y], i) => {
        const [f0, y0] = keys[i];
        if (y !== y0) tl.to(counter, { y, duration: (f - f0) * c.w, ease: "sine.inOut" }, c.start + f0 * c.w);
      });
    } else if (c.era.yearTo !== c.era.yearFrom) tl.to(counter, { y: c.era.yearTo, duration: c.w, ease: "none" }, c.start);
  });
  let lastYear = -1;
  let lastActive = -1;
  tl.eventCallback("onUpdate", () => {
    loadPlatesAround(tl.time());
    const y = Math.round(counter.y);
    if (y !== lastYear && yearEl) {
      lastYear = y;
      const early = y < 1500;
      yearEl.textContent = early ? `c. ${y}` : y >= 2030 ? `${y}+` : String(y);
      if (suffixEl) suffixEl.textContent = early ? "CE" : "";
    }
    const t = tl.time();
    const active = CH.findIndex((c) => t >= c.start - 0.001 && t < c.end);
    const a = active === -1 ? CH.length - 1 : active;
    if (a !== lastActive) {
      lastActive = a;
      rail.forEach((b, i) => (i === a ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current")));
    }
    if (fill) fill.style.transform = `scaleY(${t / total})`;
  });

  /* ── chapter extras ──────────────────────────────────────── */
  CH.forEach((ch) => extras[ch.era.id]?.({ tl, q, one, ch, lite, plateEras }));

  return { tl, total, chapters: CH };
}

/* ═════════════════════════ chapter extras ═════════════════════════ */

const extras: Record<string, (c: Ctx) => void> = {
  abbasid({ tl, one, q, ch, lite }) {
    const camera = one("[data-camera]");
    // open through the arch, then pull back to reveal the scribe's desk
    gsap.set(camera, { scale: 2.25, svgOrigin: "960 330" });
    tl.to(camera, { scale: 1, svgOrigin: "960 330", duration: ch.w * 0.8, ease: "power2.inOut" }, ch.start + 0.05);
    const caravan = one("[data-caravan]");
    if (caravan) tl.fromTo(caravan, { x: -60 }, { x: 70, duration: ch.w + 1.2, immediateRender: false }, ch.start);
    if (!lite) q("[data-parallax]").forEach((el) => {
      const f = Number((el as HTMLElement).dataset.parallax);
      tl.fromTo(el, { y: 26 * f }, { y: -10 * f, duration: ch.w, immediateRender: false }, ch.start);
    });
    // manuscript and qalam are on the desk from the start (vector mode only — a photo carries its own)
    const onDesk = [one('[data-layer="doc-manuscript"]'), one('[data-layer="qalam"]')].filter(Boolean);
    if (onDesk.length) gsap.set(onDesk, { autoAlpha: 1 });
    const qalam = one("[data-qalam]") as SVGGElement | null;
    const core = one("[data-thread]") as SVGPathElement;
    const p0 = core.getPointAtLength(0);
    if (qalam) gsap.set(qalam, { x: p0.x, y: p0.y });
  },

  record({ tl, one, ch }) {
    const camera = one("[data-camera]");
    const core = one("[data-thread]") as SVGPathElement;
    const glow = one("[data-thread-glow]") as SVGPathElement;
    const qalam = one("[data-qalam]") as SVGGElement | null;
    // lean in to the desk
    tl.to(camera, { scale: 1.32, svgOrigin: "960 700", duration: ch.w * 0.35, ease: "power2.inOut" }, ch.start);
    // the scribe writes: the first line of the thread
    const len = core.getTotalLength();
    const writeAt = ch.start + ch.w * 0.22;
    const pen = { p: 0 };
    tl.to([core, glow], { drawSVG: "100%", duration: ch.w * 0.5, ease: "power1.inOut" }, writeAt);
    tl.to(pen, {
      p: 1, duration: ch.w * 0.5, ease: "power1.inOut",
      onUpdate: () => {
        if (!qalam) return;
        const pt = core.getPointAtLength(pen.p * len);
        gsap.set(qalam, { x: pt.x, y: pt.y });
      },
    }, writeAt);
    if (qalam) tl.to(one('[data-layer="qalam"]'), { autoAlpha: 0, duration: 0.2 }, ch.end - 0.2);
    tl.to(camera, { scale: 1, svgOrigin: "960 700", duration: 0.5, ease: "power2.inOut" }, ch.end - 0.5);
    // from now on the line is whole: release the dash so morphs never clip it
    tl.set([core, glow], { strokeDasharray: "none", strokeDashoffset: 0 }, ch.end);
  },

  centuries({ tl, one, ch }) {
    // manuscript → ledger → printed page → account book
    const seq = ["doc-manuscript", "doc-ledger", "doc-printed", "doc-accountbook"].map((k) => one(`[data-layer="${k}"]`));
    if (seq.some((e) => !e)) return; // photographic plates carry the document morph
    const at = [0.08, 0.36, 0.64].map((f) => ch.start + ch.w * f);
    at.forEach((t, i) => {
      tl.to(seq[i], { autoAlpha: 0, scale: 0.985, transformOrigin: "50% 50%", duration: 0.3 }, t);
      tl.fromTo(seq[i + 1], { autoAlpha: 0, scale: 1.02, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, t + 0.05);
    });
  },

  paper({ tl, one, ch }) {
    const book = one('[data-layer="doc-accountbook"]');
    if (book) tl.to(book, { autoAlpha: 0, y: -20, duration: 0.3 }, ch.end - 0.2);
  },

  mechanical({ tl, one, ch }) {
    const typed = one('[data-doc="typed"]');
    if (typed) tl.from(typed, { y: 40, duration: ch.w * 0.6, ease: "power1.out", immediateRender: false }, ch.start);
  },

  computer({ tl, q, ch }) {
    const reels = q("[data-reel]");
    if (reels.length) tl.to(reels, { rotation: 720, transformOrigin: "50% 50%", duration: ch.w, ease: "none" }, ch.start);
  },

  enterprise({ tl, one, q, ch }) {
    const layer = one('[data-layer="net-departments"]');
    const links = q("[data-system-nodes] [data-link]");
    const nodes = q("[data-system-nodes] [data-node]");
    tl.to(layer, { autoAlpha: 1, duration: 0.2 }, ch.start + 0.15);
    gsap.set(links, { drawSVG: "0%" });
    gsap.set(nodes, { autoAlpha: 0 });
    nodes.forEach((n, i) => {
      tl.to(n, { autoAlpha: 1, duration: 0.15 }, ch.start + 0.2 + i * 0.12);
      if (links[i]) tl.to(links[i], { drawSVG: "100%", duration: 0.14 }, ch.start + 0.28 + i * 0.12);
    });
    tl.to(layer, { autoAlpha: 0, duration: 0.3 }, ch.end - 0.2);
  },

  internet({ tl, one, q, ch }) {
    tl.fromTo(one("[data-globe]"), { scale: 0.8, transformOrigin: "50% 50%" }, { scale: 1, duration: ch.w, ease: "power1.out", immediateRender: false }, ch.start);
    const arcs = q("[data-arcs] path");
    gsap.set(arcs, { drawSVG: "0%" });
    tl.to(arcs, { drawSVG: "100%", duration: 0.4, stagger: 0.12 }, ch.start + 0.3);
  },

  cloud({ tl, q, ch }) {
    const streams = q("[data-streams] line");
    if (streams.length) tl.fromTo(streams, { strokeDashoffset: 0 }, { strokeDashoffset: -160, duration: ch.w, immediateRender: false }, ch.start);
  },

  automation({ tl, one, q, ch }) {
    const layer = one('[data-layer="win-automation"]');
    const wins = q("[data-window]");
    tl.to(layer, { autoAlpha: 1, duration: 0.1 }, ch.start);
    gsap.set(wins, { autoAlpha: 0 });
    wins.forEach((w, i) => {
      tl.fromTo(w, { autoAlpha: 0, scale: 0.86, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.18, ease: "back.out(1.6)", immediateRender: false }, ch.start + 0.12 + i * 0.07);
    });
    // clutter tension: windows drift and jostle
    wins.forEach((w, i) => {
      tl.to(w, { x: i % 2 ? 10 : -10, y: i % 3 ? -8 : 8, duration: ch.w * 0.5, ease: "sine.inOut" }, ch.start + ch.w * 0.45);
    });
  },

  ai({ tl, one, q, ch }) {
    const camera = one("[data-camera]");
    const layer = one('[data-layer="ai"]');
    const wins = q("[data-window]");
    const lines = q("[data-ai-lines] path");
    const nodes = q("[data-ai-nodes] [data-node]");
    const blades = one("[data-blades]");
    const lockup = one("[data-lockup]");
    const clip = document.querySelector("[data-lockup-clip]");
    const core = one("[data-thread]");
    const glow = one("[data-thread-glow]");
    const s = ch.start;

    const particles = document.querySelector(".evo-particles");
    gsap.set(particles, { autoAlpha: 0 });
    tl.to(particles, { autoAlpha: 1, duration: 0.6 }, s + 0.3);

    gsap.set(lines, { drawSVG: "0%" });
    gsap.set(nodes, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(blades, { autoAlpha: 0 });
    gsap.set(lockup, { autoAlpha: 0 });
    gsap.set(clip, { attr: { height: LOCKUP.wordmarkTop - LOCKUP.y } });

    // centre the brand in frame
    tl.to(camera, { x: -160, duration: 0.6, ease: "power2.inOut" }, s);
    tl.to(one(".evo-scrim"), { opacity: 0.25, duration: 0.6 }, s);
    tl.to(layer, { autoAlpha: 1, duration: 0.2 }, s + 0.05);

    // 1 · every separate app flies into its system node
    wins.forEach((w, i) => {
      const [x, y] = WINDOW_LAYOUT[i];
      const n = AI_NODES[i % AI_NODES.length];
      tl.to(w, { x: n.x - (x + 100), y: n.y - (y + 62), scale: 0.18, autoAlpha: 0, duration: 0.42, ease: "power2.in" }, s + 0.08 + i * 0.025);
    });
    nodes.forEach((n, i) => tl.to(n, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)" }, s + 0.34 + i * 0.03));

    // 2 · lines converge into one intelligence
    tl.to(lines, { drawSVG: "100%", duration: 0.34, stagger: 0.035, ease: "power2.inOut" }, s + 0.5);

    // 3 · the thread (generic morph at 36%) becomes the SIENA symbol; fill forms; real logo resolves on top
    tl.to(blades, { autoAlpha: 1, duration: 0.25 }, s + ch.w * 0.36 + 0.5);
    tl.to(lockup, { autoAlpha: 1, duration: 0.35 }, s + ch.w * 0.36 + 0.62);
    tl.to(blades, { autoAlpha: 0, duration: 0.25 }, s + ch.w * 0.36 + 0.85);
    tl.to([core, glow], { opacity: 0, duration: 0.3 }, s + ch.w * 0.36 + 0.8);
    tl.to([...lines, ...nodes], { opacity: 0.22, duration: 0.3 }, s + ch.w * 0.36 + 0.8);

    // 4 · SIENA — AI SOLUTIONS & SYSTEMS
    tl.to(clip, { attr: { height: LOCKUP.h }, duration: 0.35, ease: "power2.out" }, s + ch.w * 0.8);
  },

  autonomous({ tl, one, q, ch, lite }) {
    const camera = one("[data-camera]");
    const layer = one('[data-layer="flow"]');
    const ai = one('[data-layer="ai"]');
    const core = one("[data-thread]");
    const glow = one("[data-thread-glow]");
    const nodes = q("[data-flow-node]");
    const dots = q("[data-flow-dot]");
    const humans = q("[data-human]");
    const pulse = one("[data-pulse]");
    const s = ch.start;

    tl.to(ai, { autoAlpha: 0, duration: 0.3 }, s - 0.05);
    tl.to(camera, { x: 0, duration: 0.5, ease: "power2.inOut" }, s);
    tl.to(one(".evo-scrim"), { opacity: 1, duration: 0.5 }, s);
    tl.to([core], { opacity: 1, duration: 0.3 }, s + 0.05);
    tl.to([glow], { opacity: lite ? 0.3 : 0.5, duration: 0.3 }, s + 0.05);
    tl.to(layer, { autoAlpha: 1, duration: 0.2 }, s + 0.1);

    gsap.set(nodes, { autoAlpha: 0, scale: 0.7, transformOrigin: "50% 50%" });
    gsap.set(humans, { autoAlpha: 0 });
    gsap.set(pulse, { autoAlpha: 0 });
    nodes.forEach((n, i) => tl.to(n, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "back.out(1.6)" }, s + 0.3 + i * 0.05));

    // one continuous flow: the pulse travels the SIENA line; each step lights as it passes
    const travelAt = s + 0.8;
    const travel = ch.w - 1.05;
    tl.to(pulse, { autoAlpha: 1, duration: 0.1 }, travelAt);
    tl.to(pulse, {
      motionPath: { path: THREAD_PATHS.flow },
      duration: travel, ease: "none",
    }, travelAt);
    // light nodes roughly at their share of the path length
    const flowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    flowPath.setAttribute("d", THREAD_PATHS.flow);
    const L = flowPath.getTotalLength();
    FLOW_NODES.forEach((a, i) => {
      // find the path length nearest to the node anchor
      let best = 0, bd = Infinity;
      for (let l = 0; l <= L; l += 8) {
        const p = flowPath.getPointAtLength(l);
        const d = (p.x - a.x) ** 2 + (p.y - a.y) ** 2;
        if (d < bd) { bd = d; best = l; }
      }
      const t = travelAt + (best / L) * travel;
      tl.to(dots[i], { attr: { r: 13 }, fill: "#ffffff", duration: 0.12 }, t);
      tl.to(dots[i], { attr: { r: 9 }, fill: "#3a86ff", duration: 0.2 }, t + 0.12);
      if (i === 4) tl.to(humans[0], { autoAlpha: 1, duration: 0.15 }, t);
      if (i === 7) tl.to(humans[1], { autoAlpha: 1, duration: 0.15 }, t);
    });
  },
};
