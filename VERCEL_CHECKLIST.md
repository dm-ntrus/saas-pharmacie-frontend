# ✅ Checklist Déploiement Vercel

## Avant de déployer

- [ ] Build local réussi: `npm run build`
- [ ] Serveur local fonctionne: `npm run start`
- [ ] Page d'accueil accessible: `curl http://localhost:3000/` retourne 200
- [ ] Pas d'erreurs TypeScript: `npm run type-check`
- [ ] Fichiers de messages présents dans `/messages/`

## Configuration Vercel

### Variables d'environnement (Settings → Environment Variables)

- [ ] `NEXT_PUBLIC_API_URL` définie
- [ ] `NEXT_PUBLIC_SITE_URL` définie (⚠️ utiliser votre vraie URL Vercel!)
- [ ] `NEXT_PUBLIC_KEYCLOAK_URL` définie
- [ ] `NEXT_PUBLIC_KEYCLOAK_REALM` définie
- [ ] `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` définie
- [ ] `NEXT_PUBLIC_KEYCLOAK_SCOPE` définie
- [ ] `NEXT_PUBLIC_MAIN_DOMAIN` définie

### Paramètres du projet (Settings → General)

- [ ] Framework Preset: **Next.js**
- [ ] Build Command: `npm run build` (ou vide pour défaut)
- [ ] Output Directory: `.next` (ou vide pour défaut)
- [ ] Install Command: `npm install` (ou vide pour défaut)
- [ ] Node Version: **20.x**
- [ ] Root Directory: `.` (racine du projet)

## Déploiement

- [ ] Code commité: `git add . && git commit -m "Fix Vercel deployment"`
- [ ] Code pushé: `git push`
- [ ] Build Vercel en cours (vérifier dans Deployments)
- [ ] Build Vercel réussi (pas d'erreurs dans les logs)

## Vérification Post-Déploiement

Testez ces URLs (remplacez `votre-app.vercel.app` par votre domaine):

- [ ] `https://votre-app.vercel.app/` → 200 (page d'accueil)
- [ ] `https://votre-app.vercel.app/about` → 200
- [ ] `https://votre-app.vercel.app/auth/login` → 200
- [ ] `https://votre-app.vercel.app/pricing` → 200

## Si erreur 404

1. [ ] Vérifier les logs de build dans Vercel
2. [ ] Vérifier que `NEXT_PUBLIC_SITE_URL` correspond à l'URL Vercel
3. [ ] Clear Build Cache dans Vercel (Settings → General)
4. [ ] Redéployer manuellement depuis Vercel

## Si erreur 500

1. [ ] Vérifier les logs runtime dans Vercel → Functions
2. [ ] Vérifier que tous les fichiers de messages existent
3. [ ] Vérifier les variables d'environnement
4. [ ] Tester en local: `npm run build && npm run start`

## Support

Si tout échoue:

1. [ ] Exporter les logs de build Vercel
2. [ ] Comparer avec le build local
3. [ ] Vérifier la console du navigateur (F12) pour erreurs JS
4. [ ] Vérifier que le framework est bien détecté comme "Next.js"

---

**Date de dernière mise à jour**: 12 Avril 2026  
**Version**: 1.0 - Solution sans middleware
