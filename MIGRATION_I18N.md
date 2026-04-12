# Migration i18n - De next-intl à Solution Custom

## Pourquoi cette migration ?

L'utilisation de `next-intl` avec middleware causait des erreurs `MIDDLEWARE_INVOCATION_FAILED` sur Vercel en production. La solution custom élimine complètement le besoin de middleware.

## Architecture

### Avant (next-intl)
```
middleware.ts → next-intl routing → getRequestConfig → messages
```

### Après (Solution custom)
```
SimpleI18nProvider → Context → useTranslations/useLocale/useMessages
```

## Fichiers Modifiés

### Nouveaux fichiers
- `src/lib/i18n-simple.tsx` - Provider et hooks i18n
- `src/app/auth/layout.tsx` - Force dynamic rendering
- `fix-imports.sh` - Script de migration automatique

### Fichiers mis à jour
- `src/app/layout.tsx` - Utilise SimpleI18nProvider
- `src/i18n/navigation.ts` - Wrappers simples sans next-intl
- `src/components/LanguageSwitcher.tsx` - Adapté pour nouvelle navigation
- `next.config.mjs` - Suppression du plugin next-intl
- Tous les fichiers `.tsx` - Imports remplacés automatiquement

### Fichiers supprimés
- `middleware.ts` - Plus nécessaire
- `i18n.ts` - Remplacé par i18n-simple.tsx

## API Compatible

La solution custom maintient la même API que next-intl :

```typescript
// useTranslations
const t = useTranslations("namespace");
t("key"); // Simple
t("key", { value: "test" }); // Avec interpolation

// useLocale
const locale = useLocale(); // "fr" | "en"

// useMessages
const messages = useMessages(); // Tous les messages

// Navigation
import { Link, usePathname, useRouter } from "@/i18n/navigation";
```

## Limitations

1. **Pas de lazy loading** - Tous les messages sont chargés au démarrage
2. **Pas de pluralisation avancée** - Seulement interpolation simple
3. **Pas de formatage de dates/nombres** - Utiliser des libs externes si nécessaire
4. **Changement de langue** - Nécessite un rechargement de page

## Avantages

✅ Pas de middleware = Pas d'erreurs Vercel  
✅ Build plus rapide  
✅ Code plus simple et maintenable  
✅ Compatible avec l'existant  
✅ Performances optimales (messages en mémoire)

## Migration Future

Si vous souhaitez revenir à next-intl plus tard :

1. Restaurer `middleware.ts`
2. Restaurer `next.config.mjs` avec le plugin
3. Exécuter : `find src -type f -name "*.tsx" -exec sed -i 's/@\/lib\/i18n-simple/next-intl/g' {} +`
4. Adapter les composants si nécessaire
