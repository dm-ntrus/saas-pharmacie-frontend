import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev LAN / proxy access: allow all development origins.
  allowedDevOrigins: ["*"],
  // Disable typed routes
  typedRoutes: false,
  // Déploiement Vercel : sortie classique (serverless). Pour Docker / `node server.js`, utiliser output: 'standalone'.
  // Évite les ambiguïtés de racine monorepo avec d'autres lockfiles au-dessus de ce dossier.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Allow generating optimized WEBP derivatives at common widths.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 80, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;