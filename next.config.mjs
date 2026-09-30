/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",            // static HTML: deploy to any CDN
  images: { unoptimized: true }, // brand images are pre-optimised (AVIF/WebP) by `npm run assets`
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
