"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin);
  gsap.defaults({ ease: "power2.inOut" });
  // phones: the address bar showing/hiding resizes the viewport — don't recalculate (and jump) on that
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
