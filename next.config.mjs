const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}), // set only for GitHub Pages builds
  output: "export",            // static HTML: deploy to any CDN
  images: { unoptimized: true }, // brand images are pre-optimised (AVIF/WebP) by `npm run assets`
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
