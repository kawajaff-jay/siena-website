const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}), // set only for GitHub Pages builds
  // lets phones/tablets on the same Wi-Fi load `npm run dev` (Next.js blocks other devices by default)
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*", "*.local"],
  output: "export",            // static HTML: deploy to any CDN
  images: { unoptimized: true }, // brand images are pre-optimised (AVIF/WebP) by `npm run assets`
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
