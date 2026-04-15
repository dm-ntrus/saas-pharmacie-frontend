# Public Dynamic Modules - Documentation

## Vue d'ensemble

Ce dossier contient la documentation technique pour dynamiser tous les éléments statiques de la partie publique du site SyntixPharma.

## Modules documentés

| Module | Fichier | Description | Status |
|--------|---------|-------------|--------|
| Marketing Stats | [01_module_marketing_stats.md](./01_module_marketing_stats.md) | Stats page d'accueil (hero, pharma) | À implémenter |
| Testimonials | [02_module_testimonials.md](./02_module_testimonials.md) | Témoignages clients | À implémenter |
| FAQ | [03_module_faq.md](./03_module_faq.md) | Questions fréquentes | À implémenter |
| Trusted Partners | [04_module_trusted_partners.md](./04_module_trusted_partners.md) | Logos partenaires | À implémenter |
| Client Journey | [05_module_client_journey.md](./05_module_client_journey.md) | Parcours client | À implémenter |
| Success Stories | [06_module_success_stories.md](./06_module_success_stories.md) | Études de cas | À implémenter |
| Platform Pages | [07_module_platform_pages.md](./07_module_platform_pages.md) | Contenu pages About/Features | À implémenter |
| Compliance Badges | [08_module_compliance_badges.md](./08_module_compliance_badges.md) | Badges conformité | À implémenter |

## Architecture Backend

### Structure des routes API

```
/api/v1/marketing/
├── stats
│   ├── GET /                    # Toutes les stats
│   ├── GET /hero                # Stats hero
│   ├── GET /pharma              # Stats pharma
│   ├── GET /:stat_key           # Une stat par clé
│   └── POST|PATCH|DELETE (Admin)
├── testimonials
│   ├── GET /                    # Tous les témoignages
│   ├── GET /featured            # Témoignages mis en avant
│   ├── GET /random              # Ordre aléatoire
│   ├── GET /:testimonial_key    # Un témoignage par clé
│   └── POST|PATCH|DELETE (Admin)
├── faqs
│   ├── GET /                    # Toutes les FAQs
│   ├── GET /categories           # Catégories disponibles
│   ├── GET /by-page/:page        # FAQs par page
│   ├── GET /:faq_key            # Une FAQ par clé
│   ├── POST /:id/rate           # Évaluer une FAQ
│   └── POST|PATCH|DELETE (Admin)
├── trusted-partners
│   ├── GET /                    # Tous les partenaires
│   ├── GET /logo-only           # Données optimisées
│   ├── GET /categories           # Catégories disponibles
│   ├── GET /:partner_key        # Un partenaire par clé
│   └── POST|PATCH|DELETE (Admin)
├── client-journey
│   ├── GET /                    # Parcours complet
│   ├── GET /steps               # Étapes uniquement
│   ├── GET /content             # Contenu section uniquement
│   ├── GET /steps/:step_key     # Une étape par clé
│   └── POST|PATCH|DELETE (Admin)
├── success-stories
│   ├── GET /                    # Toutes les études
│   ├── GET /featured            # Études mises en avant
│   ├── GET /by-type/:type       # Par type d'entreprise
│   ├── GET /:slug               # Détail par slug
│   └── POST|PATCH|DELETE (Admin)
├── pages
│   ├── GET /:page               # Contenu d'une page
│   ├── GET /:page/section/:section
│   ├── GET /:page/content/:content_key
│   ├── GET /features            # Features
│   ├── GET /solutions           # Solutions
│   └── POST|PATCH|DELETE (Admin)
└── compliance
    ├── GET /badges              # Tous les badges
    ├── GET /badges/featured      # Badges mis en avant
    ├── GET /badges/by-location/:location
    ├── GET /badges/:badge_key   # Un badge par clé
    ├── GET /standards            # Standards additionnels
    ├── GET /summary              # Résumé pour hero
    └── POST|PATCH|DELETE (Admin)
```

### Tables SurrealDB 3.x

| Table | Type | Description |
|-------|------|-------------|
| `marketing_stats` | SCHEMAFULL | Statistiques marketing |
| `testimonials` | SCHEMAFULL | Témoignages clients |
| `faqs` | SCHEMAFULL | Questions fréquentes |
| `faq_ratings` | SCHEMAFULL | Évaluations des FAQs |
| `trusted_partners` | SCHEMAFULL | Logos partenaires |
| `client_journey_steps` | SCHEMAFULL | Étapes parcours client |
| `client_journey_content` | SCHEMAFULL | Contenu parcours client |
| `success_stories` | SCHEMAFULL | Études de cas |
| `success_story_metrics` | SCHEMAFULL | Métriques études de cas |
| `platform_page_content` | SCHEMAFULL | Contenu des pages |
| `platform_page_features` | SCHEMAFULL | Features pages |
| `platform_page_solutions` | SCHEMAFULL | Solutions pages |
| `platform_page_images` | SCHEMAFULL | Images pages |
| `compliance_badges` | SCHEMAFULL | Badges conformité |
| `compliance_certifications` | SCHEMAFULL | Certificats |
| `compliance_standards` | SCHEMAFULL | Standards additionnels |

## Champs communs à toutes les tables

```surql
-- Timestamps
created_at TYPE datetime DEFAULT time::now() READONLY
updated_at TYPE datetime VALUE time::now() READONLY

-- Audit
created_by TYPE option<record<platform_admins>>
updated_by TYPE option<record<platform_admins>>

-- Champs transversaux
active TYPE bool DEFAULT true
sort_order TYPE int DEFAULT 0
```

## Localisation

Tous les modules supportent la localisation FR/EN via des champs séparés:
- `value_fr` / `value_en`
- `name_fr` / `name_en`
- `title_fr` / `title_en`
- `description_fr` / `description_en`

### Requête avec locale
```
GET /api/v1/marketing/testimonials?locale=fr
```

## Permissions

| Rôle | GET (Public) | POST/PATCH/DELETE |
|------|--------------|-------------------|
| Anonyme | Oui (active=true) | Non |
| PLATFORM_ADMIN | Oui (tout) | Oui |
| SUPER_ADMIN | Oui (tout) | Oui |

## Ordre d'implémentation recommandé

1. **Marketing Stats** - Simple, bloque le hero
2. **Compliance Badges** - Simple, bloque le hero
3. **Trusted Partners** - Moyen
4. **FAQ** - Moyen
5. **Client Journey** - Moyen
6. **Testimonials** - Complexe
7. **Success Stories** - Complexe
8. **Platform Pages** - Complexe

## Validation i18n

Les clés i18n actuelles (`t('statsPharmacies')`, etc.) peuvent être progressivement remplacées par les données dynamiques.

### Stratégie de migration

1. Créer les tables et seed data
2. Ajouter les endpoints API
3. Créer les hooks React (ex: `useMarketingStats`)
4. Modifier les composants pour utiliser les hooks
5. Supprimer les clés i18n devenue inutiles

## Tests recommandés

```typescript
describe('Marketing Stats API', () => {
  it('should return stats by category', async () => {
    const res = await request(app)
      .get('/api/v1/marketing/stats')
      .query({ category: 'hero', locale: 'fr' });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(4);
  });

  it('should filter by locale', async () => {
    const res = await request(app)
      .get('/api/v1/marketing/stats')
      .query({ category: 'hero', locale: 'en' });
    expect(res.body.data[0].label).toBe('Pharmacies');
  });
});
```

## Prochaines étapes

1. Implémenter les tables dans SurrealDB
2. Créer les repositories NestJS
3. Créer les services
4. Créer les contrôleurs
5. Ajouter les DTOs
6. Créer les hooks React
7. Modifier les composants frontend
8. Ajouter les tests

## Contact

Pour toute question sur l'implémentation, se référer à la documentation technique complète dans `/docs/backend/`.
