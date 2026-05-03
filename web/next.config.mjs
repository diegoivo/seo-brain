/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel default: deixa next/image otimizar (AVIF/WebP automático).
  // Para hosts estáticos (Cloudflare Pages, GitHub Pages),
  // configure via env var DEPLOY_TARGET=static + sharp pre-conversion.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
