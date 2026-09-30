/** Prefix for static files when the site is served from a sub-path (e.g. GitHub Pages: /siena-website). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
