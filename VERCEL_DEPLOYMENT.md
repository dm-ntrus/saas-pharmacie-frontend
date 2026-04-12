# Déploiement Vercel - Configuration

## Fichiers de configuration

### i18n.ts (racine)
Le fichier `i18n.ts` à la racine du projet configure next-intl pour le middleware.
Il gère la détection automatique de la locale (fr/en) via cookies et headers.

### middleware.ts
Le middleware gère le routage i18n automatiquement.

## Variables d'environnement requises

Assurez-vous de configurer ces variables dans les paramètres Vercel :

### Obligatoires
```
NEXT_PUBLIC_API_URL=https://backend.kipmoni.com
NEXT_PUBLIC_SITE_URL=https://saas-pharmacie-frontend-wft4.vercel.app
NEXT_PUBLIC_KEYCLOAK_URL=https://backend.kipmoni.com:8443
NEXT_PUBLIC_KEYCLOAK_REALM=med-pharmacy
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pharma-saas-public-client
NEXT_PUBLIC_KEYCLOAK_SCOPE=openid profile email organization
NEXT_PUBLIC_MAIN_DOMAIN=syntixpharma.com
```

### Optionnelles
```
NEXT_PUBLIC_COOKIE_DOMAIN=.syntixpharma.com
NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS=1800000
NEXT_PUBLIC_TOKEN_REFRESH_BUFFER_MS=60000
```

## Configuration du build

- Framework: Next.js (détection automatique)
- Build command: `next build` (par défaut)
- Output directory: `.next` (par défaut)
- Node version: 20.x (recommandé)

## Middleware i18n

Le middleware gère automatiquement :
- Détection de la locale (fr/en)
- Redirection selon les préférences du navigateur
- Cookie de mémorisation de la locale
- Edge Runtime pour des performances optimales

## Troubleshooting

### Erreur 500 MIDDLEWARE_INVOCATION_FAILED
1. Vérifiez que toutes les variables d'environnement sont définies
2. Vérifiez les logs de build Vercel
3. Assurez-vous que `NEXT_PUBLIC_SITE_URL` correspond à votre URL Vercel

### Erreur ENOENT middleware.js.nft.json
Cette erreur est résolue en utilisant le fichier `i18n.ts` à la racine au lieu de `src/i18n/request.ts`.
Le plugin next-intl doit être appelé sans paramètre dans `next.config.mjs`.

### Fichiers de messages manquants
Les fichiers de messages doivent être dans `/messages/` :
- `en.json`
- `fr.json`
- `platform-en.json`
- `platform-fr.json`

