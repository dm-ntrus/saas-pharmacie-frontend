# Module: Success Stories (Études de Cas)

## Vue d'ensemble

**Module**: `success_stories`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les études de cas/success stories affichées sur la page solutions

## Analyse des éléments statiques actuels

### Éléments à remplacer (solutions/page.tsx):
```tsx
// Ligne 34-37 - Stories hardcodées
const storiesMeta = [
  { id: "pax", image: "..." },
  { id: "horizon", image: "..." }
] as const;

// Ligne 54-61 - Stories depuis i18n
const stories = storiesMeta.map((s) => ({
  id: s.id,
  title: t(`stories.${s.id}.title`),
  location: t(`stories.${s.id}.location`),
  impact: t(`stories.${s.id}.impact`),
  quote: t(`stories.${s.id}.quote`),
  image: s.image,
}));
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: success_stories
-- Études de cas pour le site public
-- ============================================================
DEFINE TABLE success_stories SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD story_key ON success_stories TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_story_key ON success_stories COLUMNS story_key UNIQUE;

-- Entreprise
DEFINE FIELD company_name ON success_stories TYPE string;
DEFINE FIELD company_name_fr ON success_stories TYPE string;
DEFINE FIELD company_name_en ON success_stories TYPE string;

DEFINE FIELD company_type ON success_stories TYPE string
  ASSERT $value IN ['officine', 'grossiste', 'hopital', 'laboratoire', 'reseau'];
DEFINE INDEX idx_company_type ON success_stories COLUMNS company_type;

DEFINE FIELD company_size ON success_stories TYPE option<string>;
-- Ex: 'small', 'medium', 'large', 'enterprise'

-- Localisation
DEFINE FIELD location ON success_stories TYPE string;
DEFINE FIELD location_fr ON success_stories TYPE string;
DEFINE FIELD location_en ON success_stories TYPE string;

DEFINE FIELD country ON success_stories TYPE string;
DEFINE FIELD country_fr ON success_stories TYPE string;
DEFINE FIELD country_en ON success_stories TYPE string;

-- Impact metrics
DEFINE FIELD impact_tag ON success_stories TYPE string;
DEFINE FIELD impact_tag_fr ON success_stories TYPE string;
DEFINE FIELD impact_tag_en ON success_stories TYPE string;

DEFINE FIELD impact_metrics ON success_stories TYPE array<object> DEFAULT [];
-- [{ metric: "temps", value: "-40%", label: "temps de traitement" }]

DEFINE FIELD challenge ON success_stories TYPE string;
DEFINE FIELD challenge_fr ON success_stories TYPE string;
DEFINE FIELD challenge_en ON success_stories TYPE string;

DEFINE FIELD solution ON success_stories TYPE string;
DEFINE FIELD solution_fr ON success_stories TYPE string;
DEFINE FIELD solution_en ON success_stories TYPE string;

DEFINE FIELD results ON success_stories TYPE string;
DEFINE FIELD results_fr ON success_stories TYPE string;
DEFINE FIELD results_en ON success_stories TYPE string;

-- Témoignage
DEFINE FIELD quote ON success_stories TYPE string;
DEFINE FIELD quote_fr ON success_stories TYPE string;
DEFINE FIELD quote_en ON success_stories TYPE string;

DEFINE FIELD quote_author_name ON success_stories TYPE string;
DEFINE FIELD quote_author_role ON success_stories TYPE string;
DEFINE FIELD quote_author_role_fr ON success_stories TYPE string;
DEFINE FIELD quote_author_role_en ON success_stories TYPE string;
DEFINE FIELD quote_author_photo_url ON success_stories TYPE option<string>;

-- Visuels
DEFINE FIELD cover_image_url ON success_stories TYPE string;
DEFINE FIELD cover_image_alt ON success_stories TYPE string;
DEFINE FIELD cover_image_alt_fr ON success_stories TYPE string;
DEFINE FIELD cover_image_alt_en ON success_stories TYPE string;

DEFINE FIELD gallery_images ON success_stories TYPE array<string> DEFAULT [];
DEFINE FIELD video_url ON success_stories TYPE option<string>;

-- Métadonnées
DEFINE FIELD duration_months ON success_stories TYPE option<int>;
DEFINE FIELD investment_level ON success_stories TYPE option<string>;
-- Ex: 'low', 'medium', 'high'

DEFINE FIELD modules_used ON success_stories TYPE array<string> DEFAULT [];
DEFINE FIELD integrations_used ON success_stories TYPE array<string> DEFAULT [];

-- SEO
DEFINE FIELD slug ON success_stories TYPE string;
DEFINE INDEX idx_slug ON success_stories COLUMNS slug UNIQUE;

DEFINE FIELD meta_title ON success_stories TYPE option<string>;
DEFINE FIELD meta_title_fr ON success_stories TYPE option<string>;
DEFINE FIELD meta_title_en ON success_stories TYPE option<string>;
DEFINE FIELD meta_description ON success_stories TYPE option<string>;
DEFINE FIELD meta_description_fr ON success_stories TYPE option<string>;
DEFINE FIELD meta_description_en ON success_stories TYPE option<string>;

-- Visibilité
DEFINE FIELD featured ON success_stories TYPE bool DEFAULT false;
DEFINE INDEX idx_featured ON success_stories COLUMNS featured;

DEFINE FIELD active ON success_stories TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON success_stories COLUMNS active;

DEFINE FIELD sort_order ON success_stories TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON success_stories COLUMNS sort_order;

DEFINE FIELD published_at ON success_stories TYPE option<datetime>;
DEFINE FIELD valid_from ON success_stories TYPE option<datetime>;
DEFINE FIELD valid_until ON success_stories TYPE option<datetime>;

-- Timestamps
DEFINE FIELD created_at ON success_stories TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON success_stories TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON success_stories TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON success_stories TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: success_story_metrics
-- Métriques spécifiques pour les études de cas
-- ============================================================
DEFINE TABLE success_story_metrics SCHEMAFULL
  PERMISSIONS
    FOR select FULL
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD story_id ON success_story_metrics TYPE record<success_stories>;
DEFINE INDEX idx_metrics_story ON success_story_metrics COLUMNS story_id;

DEFINE FIELD metric_key ON success_story_metrics TYPE string;
DEFINE FIELD metric_value ON success_story_metrics TYPE string;
DEFINE FIELD metric_unit ON success_story_metrics TYPE option<string>;
DEFINE FIELD metric_label ON success_story_metrics TYPE string;
DEFINE FIELD metric_label_fr ON success_story_metrics TYPE string;
DEFINE FIELD metric_label_en ON success_story_metrics TYPE string;

DEFINE FIELD sort_order ON success_story_metrics TYPE int DEFAULT 0;

-- EVENTS
DEFINE EVENT audit_success_stories ON success_stories
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'success_stories.' + $after.story_key,
    action: $event,
    new_value: $after.company_name,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
CREATE success_stories CONTENT {
  story_key: 'story_pax',
  company_name: 'Pharmacie Pax',
  company_name_fr: 'Pharmacie Pax',
  company_name_en: 'Pax Pharmacy',
  company_type: 'officine',
  company_size: 'medium',
  location: 'Paris, France',
  location_fr: 'Paris, France',
  location_en: 'Paris, France',
  country: 'France',
  country_fr: 'France',
  country_en: 'France',
  impact_tag: '+150% croissance',
  impact_tag_fr: '+150% croissance',
  impact_tag_en: '+150% growth',
  impact_metrics: [
    { metric: 'revenue', value: '+150%', label: 'Chiffre d\'affaires', label_fr: 'Chiffre d\'affaires', label_en: 'Revenue' },
    { metric: 'time', value: '-60%', label: 'Temps de traitement', label_fr: 'Temps de traitement', label_en: 'Processing time' }
  ],
  challenge: 'Gestion manuelle des stocks et erreurs fréquentes de délivrance.',
  challenge_fr: 'Gestion manuelle des stocks et erreurs fréquentes de délivrance.',
  challenge_en: 'Manual stock management and frequent dispensing errors.',
  solution: 'Mise en place du module inventaire et prescription de SyntixPharma.',
  solution_fr: 'Mise en place du module inventaire et prescription de SyntixPharma.',
  solution_en: 'Implementation of SyntixPharma inventory and prescription modules.',
  results: 'Automatisation complète de la gestion des stocks et réduction drastique des erreurs.',
  results_fr: 'Automatisation complète de la gestion des stocks et réduction drastique des erreurs.',
  results_en: 'Complete automation of stock management and drastic reduction of errors.',
  quote: 'SyntixPharma a transformé notre façon de travailler. Nous gagnons 2 heures par jour.',
  quote_fr: 'SyntixPharma a transformé notre façon de travailler. Nous gagnons 2 heures par jour.',
  quote_en: 'SyntixPharma transformed how we work. We save 2 hours every day.',
  quote_author_name: 'Marie Dupont',
  quote_author_role: 'Propriétaire',
  quote_author_role_fr: 'Propriétaire',
  quote_author_role_en: 'Owner',
  cover_image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=500&fit=crop',
  cover_image_alt: 'Pharmacie Pax',
  slug: 'pharmacie-pax-paris',
  featured: true,
  active: true,
  sort_order: 1,
  modules_used: ['inventory', 'prescriptions', 'pos'],
  published_at: time::now()
};

CREATE success_stories CONTENT {
  story_key: 'story_horizon',
  company_name: 'Groupe Horizon Santé',
  company_name_fr: 'Groupe Horizon Santé',
  company_name_en: 'Horizon Health Group',
  company_type: 'reseau',
  company_size: 'large',
  location: 'Lyon, France',
  location_fr: 'Lyon, France',
  location_en: 'Lyon, France',
  country: 'France',
  country_fr: 'France',
  country_en: 'France',
  impact_tag: 'Réseau connecté',
  impact_tag_fr: 'Réseau connecté',
  impact_tag_en: 'Connected network',
  impact_metrics: [
    { metric: 'pharmacies', value: '25', label: 'Pharmacies connectées', label_fr: 'Pharmacies connectées', label_en: 'Connected pharmacies' }
  ],
  challenge: 'Coordination difficile entre 25 pharmacies et reporting centralisé inexistant.',
  challenge_fr: 'Coordination difficile entre 25 pharmacies et reporting centralisé inexistant.',
  challenge_en: 'Difficult coordination between 25 pharmacies and non-existent centralized reporting.',
  solution: 'Déploiement multi-sites avec tableau de bord centralisé.',
  solution_fr: 'Déploiement multi-sites avec tableau de bord centralisé.',
  solution_en: 'Multi-site deployment with centralized dashboard.',
  results: 'Visibilité complète sur toutes les pharmacies et décisions basées sur les données.',
  results_fr: 'Visibilité complète sur toutes les pharmacies et décisions basées sur les données.',
  results_en: 'Complete visibility across all pharmacies and data-driven decisions.',
  quote: 'Pour la première fois, nous avons une vue d\'ensemble de notre réseau.',
  quote_fr: 'Pour la première fois, nous avons une vue d\'ensemble de notre réseau.',
  quote_en: 'For the first time, we have an overview of our network.',
  quote_author_name: 'Jean Martin',
  quote_author_role: 'Directeur IT',
  quote_author_role_fr: 'Directeur des systèmes d\'information',
  quote_author_role_en: 'IT Director',
  cover_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
  cover_image_alt: 'Groupe Horizon Santé',
  slug: 'groupe-horizon-sante',
  featured: true,
  active: true,
  sort_order: 2,
  modules_used: ['analytics', 'inventory', 'accounting'],
  published_at: time::now()
};
```

## DTOs

### Input DTOs

```typescript
// create-success-story.dto.ts
export class CreateSuccessStoryDto {
  story_key: string;
  company_name: string;
  company_name_fr: string;
  company_name_en: string;
  company_type: 'officine' | 'grossiste' | 'hopital' | 'laboratoire' | 'reseau';
  company_size?: string;
  location: string;
  location_fr: string;
  location_en: string;
  country: string;
  country_fr: string;
  country_en: string;
  impact_tag: string;
  impact_tag_fr: string;
  impact_tag_en: string;
  impact_metrics?: Array<{
    metric: string;
    value: string;
    label?: string;
    label_fr?: string;
    label_en?: string;
    unit?: string;
  }>;
  challenge: string;
  challenge_fr: string;
  challenge_en: string;
  solution: string;
  solution_fr: string;
  solution_en: string;
  results: string;
  results_fr: string;
  results_en: string;
  quote: string;
  quote_fr: string;
  quote_en: string;
  quote_author_name: string;
  quote_author_role: string;
  quote_author_role_fr: string;
  quote_author_role_en: string;
  quote_author_photo_url?: string;
  cover_image_url: string;
  cover_image_alt?: string;
  cover_image_alt_fr?: string;
  cover_image_alt_en?: string;
  gallery_images?: string[];
  video_url?: string;
  duration_months?: number;
  investment_level?: string;
  modules_used?: string[];
  integrations_used?: string[];
  slug: string;
  meta_title?: string;
  meta_title_fr?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_fr?: string;
  meta_description_en?: string;
  featured?: boolean;
  active?: boolean;
  sort_order?: number;
  published_at?: Date;
  valid_from?: Date;
  valid_until?: Date;
}

// update-success-story.dto.ts
export class UpdateSuccessStoryDto {
  // Tous les champs sont optionnels
  company_name?: string;
  company_name_fr?: string;
  company_name_en?: string;
  company_type?: string;
  location?: string;
  location_fr?: string;
  location_en?: string;
  // ... autres champs
}
```

### Output DTOs

```typescript
// success-story.response.dto.ts
export class SuccessStoryResponseDto {
  id: string;
  story_key: string;
  company_name: string; // Localisé
  company_type: string;
  company_size?: string;
  location: string; // Localisé
  country: string; // Localisé
  impact_tag: string; // Localisé
  impact_metrics?: Array<{
    metric: string;
    value: string;
    label: string;
    unit?: string;
  }>;
  quote: string; // Localisé
  quote_author_name: string;
  quote_author_role: string; // Localisé
  quote_author_photo_url?: string;
  cover_image_url: string;
  cover_image_alt?: string;
  slug: string;
  featured: boolean;
  sort_order: number;
  published_at?: Date;
}

export class SuccessStoryDetailResponseDto extends SuccessStoryResponseDto {
  challenge: string; // Localisé
  solution: string; // Localisé
  results: string; // Localisé
  gallery_images?: string[];
  video_url?: string;
  duration_months?: number;
  investment_level?: string;
  modules_used?: string[];
  integrations_used?: string[];
  meta_title?: string;
  meta_description?: string;
  valid_from?: Date;
  valid_until?: Date;
}

// Query DTO
export class QuerySuccessStoriesDto {
  locale?: 'fr' | 'en';
  company_type?: string;
  company_size?: string;
  country?: string;
  featured?: boolean;
  active?: boolean;
  valid?: boolean;
  modules?: string[];
  sort?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/success-stories
Récupérer les études de cas.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `company_type` (optional): `officine` | `grossiste` | `hopital` | `laboratoire` | `reseau`
- `featured` (optional): `true` | `false`
- `limit` (optional): nombre max (défaut: 10)

**Response 200:**
```json
{
  "data": [
    {
      "id": "success_stories:story_pax",
      "story_key": "story_pax",
      "company_name": "Pharmacie Pax",
      "company_type": "officine",
      "location": "Paris, France",
      "impact_tag": "+150% croissance",
      "quote": "SyntixPharma a transformé notre façon de travailler...",
      "quote_author_name": "Marie Dupont",
      "cover_image_url": "https://...",
      "slug": "pharmacie-pax-paris",
      "featured": true,
      "sort_order": 1
    }
  ],
  "total": 2,
  "company_types": ["officine", "reseau"]
}
```

### GET /api/v1/marketing/success-stories/featured
Récupérer les études de cas mises en avant.

### GET /api/v1/marketing/success-stories/by-type/:company_type
Récupérer les études de cas par type d'entreprise.

### GET /api/v1/marketing/success-stories/:slug
Récupérer une étude de cas par slug (détail complet).

### GET /api/v1/marketing/success-stories/:slug/summary
Récupérer le résumé d'une étude de cas (pour les cards).

### POST /api/v1/marketing/success-stories (Admin only)
Créer une nouvelle étude de cas.

**Body:**
```json
{
  "story_key": "story_new",
  "company_name": "Nouvelle Pharmacie",
  "company_name_fr": "Nouvelle Pharmacie",
  "company_name_en": "New Pharmacy",
  "company_type": "officine",
  "location_fr": "Bruxelles, Belgique",
  "location_en": "Brussels, Belgium",
  "impact_tag_fr": "Nouveau succès",
  "impact_tag_en": "New success",
  "cover_image_url": "https://...",
  "slug": "nouvelle-pharmacie-bruxelles",
  "featured": true
}
```

### PATCH /api/v1/marketing/success-stories/:id (Admin only)
Mettre à jour une étude de cas.

### DELETE /api/v1/marketing/success-stories/:id (Admin only)
Supprimer une étude de cas.

### POST /api/v1/marketing/success-stories/reorder (Admin only)
Réordonner les études de cas.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_success_stories(
  $locale: string,
  $company_type: option<string>,
  $featured: option<bool>,
  $limit: option<int>
) {
  LET $now = time::now();
  LET $query = SELECT * FROM success_stories 
    WHERE active = true
    AND ($featured IS NONE OR featured = $featured)
    AND ($company_type IS NONE OR company_type = $company_type)
    AND (valid_from IS NONE OR valid_from <= $now)
    AND (valid_until IS NONE OR valid_until >= $now)
    ORDER BY sort_order ASC
    LIMIT $limit ?? 10;
  
  RETURN FOR $story IN $query RETURN {
    id: $story.id,
    story_key: $story.story_key,
    company_name: IF $locale == 'en' THEN $story.company_name_en ELSE $story.company_name_fr,
    company_type: $story.company_type,
    company_size: $story.company_size,
    location: IF $locale == 'en' THEN $story.location_en ELSE $story.location_fr,
    country: IF $locale == 'en' THEN $story.country_en ELSE $story.country_fr,
    impact_tag: IF $locale == 'en' THEN $story.impact_tag_en ELSE $story.impact_tag_fr,
    impact_metrics: (FOR $m IN $story.impact_metrics RETURN {
      metric: $m.metric,
      value: $m.value,
      label: IF $locale == 'en' THEN $m.label_en ELSE $m.label_fr,
      unit: $m.unit
    }),
    quote: IF $locale == 'en' THEN $story.quote_en ELSE $story.quote_fr,
    quote_author_name: $story.quote_author_name,
    quote_author_role: IF $locale == 'en' THEN $story.quote_author_role_en ELSE $story.quote_author_role_fr,
    quote_author_photo_url: $story.quote_author_photo_url,
    cover_image_url: $story.cover_image_url,
    cover_image_alt: IF $locale == 'en' THEN $story.cover_image_alt_en ELSE $story.cover_image_alt_fr,
    slug: $story.slug,
    featured: $story.featured,
    sort_order: $story.sort_order,
    published_at: $story.published_at
  };
};
```
