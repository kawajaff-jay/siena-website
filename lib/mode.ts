/**
 * Two render modes, decided by media query (mirrored in globals.css so there is no flash):
 *  - cinematic: sticky stage + scrubbed timeline (desktop / landscape tablet)
 *  - chronicle: linear, lightweight storytelling (mobile, portrait tablet, reduced motion)
 */
export const CINEMATIC_QUERY = "(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)";
export const LITE_QUERY = "(max-width: 1199px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
