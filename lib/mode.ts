/**
 * Two render modes, decided by media query (mirrored in globals.css so there is no flash):
 *  - cinematic: sticky stage + scrubbed timeline (every screen size, phones included;
 *    portrait screens get their own layout in globals.css)
 *  - chronicle: linear, lightweight storytelling (reduced motion, no-JS)
 */
export const CINEMATIC_QUERY = "(prefers-reduced-motion: no-preference)";
export const LITE_QUERY = "(max-width: 1199px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
