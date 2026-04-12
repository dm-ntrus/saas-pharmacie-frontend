# Déploiement Vercel - Configuration

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

Le fichier `vercel.json` est configuré pour :
- Framework: Next.js
- Région: iad1 (US East)
- Build command: `next build`

## Middleware i18n

Le middleware gère automatiquement :
- Détection de la locale (fr/en)
- Redirection selon les préférences du navigateur
- Cookie de mémorisation de la locale

## Troubleshooting

Si vous obtenez une erreur 500 MIDDLEWARE_INVOCATION_FAILED :
1. Vérifiez que toutes les variables d'environnement sont définies
2. Vérifiez les logs de build Vercel
3. Assurez-vous que `NEXT_PUBLIC_SITE_URL` correspond à votre URL Vercel
