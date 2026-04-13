import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable typed routes
  typedRoutes: false,
  // Déploiement Vercel : sortie classique (serverless). Pour Docker / `node server.js`, utiliser output: 'standalone'.
  // Évite les ambiguïtés de racine monorepo avec d'autres lockfiles au-dessus de ce dossier.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;