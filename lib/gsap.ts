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
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
