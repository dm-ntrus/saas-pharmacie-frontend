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

## 🚀 Déploiement sur Vercel

### Étape 1: Vérifier le build local

```bash
npm run build
npm run start
# Tester: curl http://localhost:3000/
# Devrait retourner 200
```

### Étape 2: Configurer les variables d'environnement

Dans les paramètres Vercel (Settings → Environment Variables), ajoutez :

#### Obligatoires
```
NEXT_PUBLIC_API_URL=https://backend.kipmoni.com
NEXT_PUBLIC_SITE_URL=https://votre-app.vercel.app
NEXT_PUBLIC_KEYCLOAK_URL=https://backend.kipmoni.com:8443
NEXT_PUBLIC_KEYCLOAK_REALM=med-pharmacy
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pharma-saas-public-client
NEXT_PUBLIC_KEYCLOAK_SCOPE=openid profile email organization
NEXT_PUBLIC_MAIN_DOMAIN=syntixpharma.com
```

⚠️ **IMPORTANT**: Remplacez `https://votre-app.vercel.app` par votre vraie URL Vercel !

#### Optionnelles
```
NEXT_PUBLIC_COOKIE_DOMAIN=.syntixpharma.com
NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS=1800000
NEXT_PUBLIC_TOKEN_REFRESH_BUFFER_MS=60000
```

### Étape 3: Vérifier la configuration Vercel

Dans les paramètres du projet Vercel :

- **Framework Preset**: Next.js (détection automatique)
- **Build Command**: `npm run build` (par défaut)
- **Output Directory**: `.next` (par défaut)
- **Install Command**: `npm install` (par défaut)
- **Node Version**: 20.x (recommandé)

### Étape 4: Déployer

```bash
git add .
git commit -m "Fix Vercel deployment: custom i18n without middleware"
git push
```

Vercel déploiera automatiquement.

### Étape 5: Vérifier le déploiement

1. Attendez que le build se termine sur Vercel
2. Cliquez sur "Visit" pour ouvrir votre site
3. La page d'accueil devrait s'afficher correctement

## 🔧 Troubleshooting

### Erreur 404: NOT_FOUND

**Causes possibles:**

1. **Variables d'environnement manquantes**
   - Vérifiez que `NEXT_PUBLIC_SITE_URL` est définie
   - Vérifiez que toutes les variables obligatoires sont présentes

2. **Build échoué silencieusement**
   - Allez dans Vercel → Deployments → Cliquez sur le dernier déploiement
   - Vérifiez les logs de build pour des erreurs
   - Cherchez "Error" ou "Failed" dans les logs

3. **Cache Vercel**
   - Dans Vercel, allez dans Settings → General
   - Cliquez sur "Clear Build Cache & Redeploy"

4. **Configuration du projet**
   - Vérifiez que le Root Directory est correct (généralement `.`)
   - Vérifiez que le Framework est bien détecté comme "Next.js"

### Erreur 500: INTERNAL_SERVER_ERROR

Si vous obtenez encore une erreur 500:

1. Vérifiez les logs runtime dans Vercel → Functions
2. Vérifiez que les fichiers de messages existent:
   - `messages/fr.json`
   - `messages/en.json`
   - `messages/platform-fr.json`
   - `messages/platform-en.json`

### Build réussit mais page blanche

1. Ouvrez la console du navigateur (F12)
2. Cherchez des erreurs JavaScript
3. Vérifiez que les variables d'environnement sont accessibles côté client

## ✅ Vérification Post-Déploiement

Testez ces URLs (remplacez par votre domaine):

- `https://votre-app.vercel.app/` → Page d'accueil
- `https://votre-app.vercel.app/about` → Page À propos
- `https://votre-app.vercel.app/auth/login` → Page de connexion

Toutes devraient retourner 200 (pas 404 ou 500).

## 📊 Avantages de cette solution

✅ **Pas de middleware** - Évite tous les problèmes Edge Runtime sur Vercel  
✅ **Build rapide** - Pas de traçage de dépendances complexe  
✅ **Compatible** - Fonctionne avec tous les hooks existants  
✅ **Simple** - Code facile à maintenir et déboguer  
✅ **Performant** - Messages chargés une seule fois au démarrage  
✅ **Testé** - Build local réussi, serveur production OK (200)

## 📞 Support

Si le problème persiste après avoir suivi ce guide:

1. Exportez les logs de build Vercel
2. Vérifiez les logs runtime dans Vercel Functions
3. Testez en local avec `npm run build && npm run start`
4. Comparez les variables d'environnement local vs Vercel

