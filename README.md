# SyntixPharma — Frontend

Application [Next.js 16](https://nextjs.org) (App Router) : site marketing, authentification et espace tenant (POS, inventaire, etc.).

## Prérequis

- Node.js 20+
- [pnpm](https://pnpm.io)

## Installation et développement

```bash
pnpm install
cp .env.example .env.local   # puis renseigner les variables
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Production

```bash
pnpm build
pnpm start
```

## Déploiement (Vercel)

- Définir `NEXT_PUBLIC_SITE_URL` avec l’URL publique du déploiement.
- Le middleware Edge est dans `src/proxy.ts` (convention Next.js 16).

## Traductions

Les textes applicatifs sont dans `messages/*.json` et `messages/platform-*.json`, chargés par `SimpleI18nProvider` (`src/lib/i18n-simple.tsx`).
