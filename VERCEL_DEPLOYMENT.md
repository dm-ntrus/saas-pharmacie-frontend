# Déploiement Vercel - Solution Sans Middleware

## ✅ Solution Implémentée

Pour résoudre les erreurs de middleware sur Vercel, nous avons implémenté une **solution i18n simplifiée sans middleware**.

### Changements Principaux

1. **Suppression du middleware** - Plus de fichier `middleware.ts`
2. **Solution i18n custom** - `src/lib/i18n-simple.tsx` remplace next-intl
3. **Navigation simplifiée** - `src/i18n/navigation.ts` utilise les hooks Next.js natifs
4. **Tous les imports mis à jour** - Remplacement automatique de `next-intl` par `@/lib/i18n-simple`

### Fichiers Clés

- `src/lib/i18n-simple.tsx` - Provider i18n custom avec hooks `useTranslations`, `useLocale`, `useMessages`
- `src/i18n/navigation.ts` - Wrappers simples pour Link, usePathname, useRouter
- `src/app/layout.tsx` - Utilise `SimpleI18nProvider` au lieu de `NextIntlClientProvider`
- `src/app/auth/layout.tsx` - Force le rendu dynamique pour les pages auth

## Variables d'environnement requises

Configurez ces variables dans les paramètres Vercel :

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
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 20.x (recommandé)

## Avantages de cette solution

✅ **Pas de middleware** - Évite tous les problèmes Edge Runtime sur Vercel  
✅ **Build rapide** - Pas de traçage de dépendances complexe  
✅ **Compatible** - Fonctionne avec tous les hooks existants  
✅ **Simple** - Code facile à maintenir et déboguer  
✅ **Performant** - Messages chargés une seule fois au démarrage  

## Déploiement

```bash
git add .
git commit -m "Fix Vercel deployment: remove middleware, use simple i18n solution"
git push
```

Vercel détectera automatiquement Next.js et déploiera l'application sans erreur de middleware.

## Notes

- La locale par défaut est `fr` (français)
- Le changement de langue fonctionne via cookie et rechargement de page
- Tous les messages sont chargés au démarrage (pas de lazy loading)
- Compatible avec tous les composants existants utilisant `useTranslations`

