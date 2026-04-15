# Module: Platform Pages Content (Contenu des Pages)

## Vue d'ensemble

**Module**: `platform_pages`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement le contenu des pages About, Features, Solutions, Contact

## Analyse des éléments statiques actuels

### Pages et éléments à remplacer:

#### 1. about/page.tsx
```tsx
// Lignes 50-64 - Stats
{ val: "2021", label: t("statFoundation") },
{ val: "500+", label: t("statClients") },
{ val: "4", label: t("statCountries") },

// Lignes 76-79 - Image hero (locale-based)
// Lignes 89 - Quote
// Lignes 106-122 - Mission & Vision text
// Lignes 136-158 - Timeline (2021-2024)
// Lignes 178-195 - Values
// Lignes 205-214 - Team CTA
// Lignes 218-240 - Team images
```

#### 2. features/page.tsx
```tsx
// Ligne 22-32 - featureMeta (9 features)
// Lignes 46-56 - features.map avec titre/desc/details
// Lignes 58-62 - integrations
// Lignes 64-68 - deploySteps
// Lignes 70-75 - deepDiveItems
// Lignes 174-198 - Images grid
```

#### 3. solutions/page.tsx
```tsx
// Lignes 16-32 - solutionsMeta (officine, grossiste, hopital)
// Lignes 42-52 - solutions.map avec features
// Lignes 86-148 - Section solutions avec alternances
// Lignes 166-201 - Success stories section
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: platform_page_content
-- Contenu dynamique pour les pages publiques
-- ============================================================
DEFINE TABLE platform_page_content SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD content_key ON platform_page_content TYPE string;
DEFINE INDEX uq_content_key ON platform_page_content COLUMNS content_key UNIQUE;

DEFINE FIELD page ON platform_page_content TYPE string
  ASSERT $value IN ['home', 'about', 'features', 'solutions', 'contact', 'pricing'];
DEFINE INDEX idx_page ON platform_page_content COLUMNS page;

DEFINE FIELD section ON platform_page_content TYPE string;
-- Ex: 'hero', 'mission', 'values', 'team', 'cta', etc.

-- Contenu localisé
DEFINE FIELD value ON platform_page_content TYPE string;
DEFINE FIELD value_fr ON platform_page_content TYPE string;
DEFINE FIELD value_en ON platform_page_content TYPE string;

DEFINE FIELD value_type ON platform_page_content TYPE string DEFAULT 'text'
  ASSERT $value IN ['text', 'html', 'markdown', 'json', 'image_url', 'url'];

-- Métadonnées pour JSON
DEFINE FIELD metadata ON platform_page_content TYPE object DEFAULT {};

-- Position
DEFINE FIELD sort_order ON platform_page_content TYPE int DEFAULT 0;
DEFINE FIELD sort_group ON platform_page_content TYPE option<string>;

-- Visibilité
DEFINE FIELD active ON platform_page_content TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON platform_page_content COLUMNS active;

-- Condition d'affichage
DEFINE FIELD display_condition ON platform_page_content TYPE option<string>;
-- Ex: 'locale:fr', 'feature:ai_enabled', 'plan:tier_professional'

-- Timestamps
DEFINE FIELD created_at ON platform_page_content TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON platform_page_content TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON platform_page_content TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON platform_page_content TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: platform_page_features
-- Features spécifiques pour la page Features
-- ============================================================
DEFINE TABLE platform_page_features SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD feature_key ON platform_page_features TYPE string;
DEFINE INDEX uq_feature_key ON platform_page_features COLUMNS feature_key UNIQUE;

DEFINE FIELD page ON platform_page_features TYPE string DEFAULT 'features'
  ASSERT $value IN ['features', 'solutions'];

DEFINE FIELD icon ON platform_page_features TYPE string;
DEFINE FIELD icon_library ON platform_page_features TYPE string DEFAULT 'lucide';

DEFINE FIELD title ON platform_page_features TYPE string;
DEFINE FIELD title_fr ON platform_page_features TYPE string;
DEFINE FIELD title_en ON platform_page_features TYPE string;

DEFINE FIELD description ON platform_page_features TYPE string;
DEFINE FIELD description_fr ON platform_page_features TYPE string;
DEFINE FIELD description_en ON platform_page_features TYPE string;

DEFINE FIELD details ON platform_page_features TYPE array<string> DEFAULT [];
DEFINE FIELD details_fr ON platform_page_features TYPE array<string> DEFAULT [];
DEFINE FIELD details_en ON platform_page_features TYPE array<string> DEFAULT [];

DEFINE FIELD image_url ON platform_page_features TYPE option<string>;
DEFINE FIELD image_alt ON platform_page_features TYPE option<string>;

DEFINE FIELD link_url ON platform_page_features TYPE option<string>;
DEFINE FIELD link_label ON platform_page_features TYPE option<string>;
DEFINE FIELD link_label_fr ON platform_page_features TYPE option<string>;
DEFINE FIELD link_label_en ON platform_page_features TYPE option<string>;

DEFINE FIELD color_scheme ON platform_page_features TYPE option<string>;

DEFINE FIELD active ON platform_page_features TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON platform_page_features TYPE int DEFAULT 0;
DEFINE INDEX idx_feature_sort ON platform_page_features COLUMNS sort_order;

DEFINE FIELD created_at ON platform_page_features TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON platform_page_features TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: platform_page_solutions
-- Solutions pour la page Solutions
-- ============================================================
DEFINE TABLE platform_page_solutions SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD solution_key ON platform_page_solutions TYPE string;
DEFINE INDEX uq_solution_key ON platform_page_solutions COLUMNS solution_key UNIQUE;

DEFINE FIELD solution_type ON platform_page_solutions TYPE string
  ASSERT $value IN ['officine', 'grossiste', 'hopital', 'laboratoire'];
DEFINE INDEX idx_solution_type ON platform_page_solutions COLUMNS solution_type;

DEFINE FIELD icon ON platform_page_solutions TYPE string;
DEFINE FIELD icon_library ON platform_page_solutions TYPE string DEFAULT 'lucide';

DEFINE FIELD title ON platform_page_solutions TYPE string;
DEFINE FIELD title_fr ON platform_page_solutions TYPE string;
DEFINE FIELD title_en ON platform_page_solutions TYPE string;

DEFINE FIELD description ON platform_page_solutions TYPE string;
DEFINE FIELD description_fr ON platform_page_solutions TYPE string;
DEFINE FIELD description_en ON platform_page_solutions TYPE string;

DEFINE FIELD features ON platform_page_solutions TYPE array<string> DEFAULT [];
DEFINE FIELD features_fr ON platform_page_solutions TYPE array<string> DEFAULT [];
DEFINE FIELD features_en ON platform_page_solutions TYPE array<string> DEFAULT [];

DEFINE FIELD image_url ON platform_page_solutions TYPE string;
DEFINE FIELD image_alt ON platform_page_solutions TYPE option<string>;

DEFINE FIELD cta_text ON platform_page_solutions TYPE string;
DEFINE FIELD cta_text_fr ON platform_page_solutions TYPE string;
DEFINE FIELD cta_text_en ON platform_page_solutions TYPE string;
DEFINE FIELD cta_url ON platform_page_solutions TYPE string DEFAULT '/auth/register';

DEFINE FIELD display_order ON platform_page_solutions TYPE int DEFAULT 0;

DEFINE FIELD active ON platform_page_solutions TYPE bool DEFAULT true;
DEFINE INDEX idx_solution_active ON platform_page_solutions COLUMNS active;

DEFINE FIELD created_at ON platform_page_solutions TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON platform_page_solutions TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: platform_page_images
-- Images utilisées sur les pages
-- ============================================================
DEFINE TABLE platform_page_images SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD image_key ON platform_page_images TYPE string;
DEFINE INDEX uq_image_key ON platform_page_images COLUMNS image_key UNIQUE;

DEFINE FIELD page ON platform_page_images TYPE string;
DEFINE FIELD section ON platform_page_images TYPE option<string>;

DEFINE FIELD url ON platform_page_images TYPE string;
DEFINE FIELD alt ON platform_page_images TYPE string;
DEFINE FIELD alt_fr ON platform_page_images TYPE string;
DEFINE FIELD alt_en ON platform_page_images TYPE string;

DEFINE FIELD width ON platform_page_images TYPE option<int>;
DEFINE FIELD height ON platform_page_images TYPE option<int>;

DEFINE FIELD caption ON platform_page_images TYPE option<string>;
DEFINE FIELD caption_fr ON platform_page_images TYPE option<string>;
DEFINE FIELD caption_en ON platform_page_images TYPE option<string>;

DEFINE FIELD active ON platform_page_images TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON platform_page_images TYPE int DEFAULT 0;

DEFINE FIELD created_at ON platform_page_images TYPE datetime DEFAULT time::now() READONLY;

-- EVENTS
DEFINE EVENT audit_page_content ON platform_page_content
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'page_content.' + $after.page + '.' + $after.content_key,
    action: $event,
    new_value: $after.value,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data - About Page

```surql
-- About Page - Hero Stats
CREATE platform_page_content CONTENT {
  content_key: 'about_stat_foundation',
  page: 'about',
  section: 'hero_stats',
  value: '2021',
  value_fr: '2021',
  value_en: '2021',
  sort_order: 1,
  active: true
};

CREATE platform_page_content CONTENT {
  content_key: 'about_stat_clients',
  page: 'about',
  section: 'hero_stats',
  value: '500+',
  value_fr: '500+',
  value_en: '500+',
  sort_order: 2,
  active: true
};

CREATE platform_page_content CONTENT {
  content_key: 'about_stat_countries',
  page: 'about',
  section: 'hero_stats',
  value: '4',
  value_fr: '4',
  value_en: '4',
  sort_order: 3,
  active: true
};

-- About Page - Mission & Vision
CREATE platform_page_content CONTENT {
  content_key: 'about_mission_label',
  page: 'about',
  section: 'mission',
  value: 'Notre Mission',
  value_fr: 'Notre Mission',
  value_en: 'Our Mission',
  sort_order: 1,
  active: true
};

CREATE platform_page_content CONTENT {
  content_key: 'about_mission_text',
  page: 'about',
  section: 'mission',
  value: 'Révolutionner la gestion pharmaceutique...',
  value_fr: 'Révolutionner la gestion pharmaceutique en Africa et au-delà.',
  value_en: 'Revolutionize pharmaceutical management in Africa and beyond.',
  value_type: 'text',
  sort_order: 2,
  active: true
};

CREATE platform_page_content CONTENT {
  content_key: 'about_vision_label',
  page: 'about',
  section: 'vision',
  value: 'Notre Vision',
  value_fr: 'Notre Vision',
  value_en: 'Our Vision',
  sort_order: 1,
  active: true
};

CREATE platform_page_content CONTENT {
  content_key: 'about_vision_text',
  page: 'about',
  section: 'vision',
  value: 'Un monde où chaque pharmacie...',
  value_fr: 'Un monde où chaque pharmacie a accès aux meilleurs outils technologiques.',
  value_en: 'A world where every pharmacy has access to the best technological tools.',
  value_type: 'text',
  sort_order: 2,
  active: true
};

-- About Page - Timeline
CREATE platform_page_content CONTENT {
  content_key: 'about_timeline_2021',
  page: 'about',
  section: 'timeline',
  value: 'Création de SyntixPharma',
  value_fr: 'Création de SyntixPharma',
  value_en: 'SyntixPharma founded',
  sort_order: 1,
  active: true
};

-- About Page - Values
CREATE platform_page_content CONTENT {
  content_key: 'about_value_empathy',
  page: 'about',
  section: 'values',
  value: 'Empathie',
  value_fr: 'Empathie',
  value_en: 'Empathy',
  metadata: { icon: 'Heart' },
  sort_order: 1,
  active: true
};
```

### Seed Data - Features

```surql
CREATE platform_page_features CONTENT {
  feature_key: 'feature_inventory',
  page: 'features',
  icon: 'Package',
  title: 'Gestion des Stocks Intelligente',
  title_fr: 'Gestion des Stocks Intelligente',
  title_en: 'Smart Inventory Management',
  description: 'Optimisez vos stocks avec notre solution IA-powered.',
  description_fr: 'Optimisez vos stocks avec notre solution alimentée par l\'IA.',
  description_en: 'Optimize your inventory with our AI-powered solution.',
  details: ['Suivi en temps réel', 'Alertes automatiques', 'Prévisions de demande'],
  details_fr: ['Suivi en temps réel', 'Alertes automatiques', 'Prévisions de demande'],
  details_en: ['Real-time tracking', 'Automatic alerts', 'Demand forecasting'],
  color_scheme: 'emerald',
  sort_order: 1,
  active: true
};

CREATE platform_page_features CONTENT {
  feature_key: 'feature_pos',
  page: 'features',
  icon: 'BarChart3',
  title: 'Point de Vente',
  title_fr: 'Point de Vente',
  title_en: 'Point of Sale',
  description: 'Encaissement rapide et précis.',
  description_fr: 'Encaissement rapide et précis.',
  description_en: 'Fast and accurate checkout.',
  details: ['Multi-paiements', 'Gestion des remises', 'Impression tickets'],
  details_fr: ['Multi-paiements', 'Gestion des remises', 'Impression tickets'],
  details_en: ['Multi-payments', 'Discount management', 'Ticket printing'],
  color_scheme: 'amber',
  sort_order: 2,
  active: true
};
```

## DTOs

```typescript
// platform-page.dto.ts
export class CreatePageContentDto {
  content_key: string;
  page: 'home' | 'about' | 'features' | 'solutions' | 'contact' | 'pricing';
  section: string;
  value: string;
  value_fr: string;
  value_en: string;
  value_type?: 'text' | 'html' | 'markdown' | 'json' | 'image_url' | 'url';
  metadata?: Record<string, any>;
  sort_order?: number;
  sort_group?: string;
  display_condition?: string;
  active?: boolean;
}

export class CreatePageFeatureDto {
  feature_key: string;
  page?: 'features' | 'solutions';
  icon: string;
  icon_library?: string;
  title: string;
  title_fr: string;
  title_en: string;
  description: string;
  description_fr: string;
  description_en: string;
  details?: string[];
  details_fr?: string[];
  details_en?: string[];
  image_url?: string;
  link_url?: string;
  link_label?: string;
  link_label_fr?: string;
  link_label_en?: string;
  color_scheme?: string;
  sort_order?: number;
  active?: boolean;
}

export class CreatePageSolutionDto {
  solution_key: string;
  solution_type: 'officine' | 'grossiste' | 'hopital' | 'laboratoire';
  icon: string;
  icon_library?: string;
  title: string;
  title_fr: string;
  title_en: string;
  description: string;
  description_fr: string;
  description_en: string;
  features: string[];
  features_fr: string[];
  features_en: string[];
  image_url: string;
  cta_text: string;
  cta_text_fr: string;
  cta_text_en: string;
  cta_url?: string;
  display_order?: number;
  active?: boolean;
}

// Response DTOs
export class PageContentResponseDto {
  content_key: string;
  page: string;
  section: string;
  value: string;
  value_type: string;
  metadata?: Record<string, any>;
}

export class PageFeatureResponseDto {
  id: string;
  feature_key: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
  color_scheme?: string;
  sort_order: number;
}

export class PageSolutionResponseDto {
  id: string;
  solution_key: string;
  solution_type: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  image_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
}
```

## Endpoints API

### GET /api/v1/marketing/pages/:page
Récupérer tout le contenu d'une page.

**Response:**
```json
{
  "page": "about",
  "sections": {
    "hero_stats": [
      { "content_key": "about_stat_foundation", "value": "2021", "sort_order": 1 }
    ],
    "mission": [
      { "content_key": "about_mission_label", "value": "Notre Mission" }
    ]
  }
}
```

### GET /api/v1/marketing/pages/:page/section/:section
Récupérer une section spécifique.

### GET /api/v1/marketing/pages/:page/content/:content_key
Récupérer un contenu spécifique.

### GET /api/v1/marketing/features
Récupérer toutes les features.

### GET /api/v1/marketing/solutions
Récupérer toutes les solutions.

### POST /api/v1/marketing/pages/:page/content (Admin only)
Créer du contenu.

### PATCH /api/v1/marketing/pages/:page/content/:content_key (Admin only)
Mettre à jour du contenu.

### POST /api/v1/marketing/features (Admin only)
Créer une feature.

### PUT /api/v1/marketing/features/reorder (Admin only)
Réordonner les features.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_page_content($page: string, $locale: string) {
  LET $contents = SELECT * FROM platform_page_content 
    WHERE page = $page AND active = true
    ORDER BY sort_order ASC;
  
  LET $grouped = {};
  FOR $c IN $contents {
    LET $section = $c.section;
    LET $localized_value = IF $locale == 'en' THEN $c.value_en ELSE $c.value_fr;
    
    IF $grouped[$section] IS NONE {
      $grouped[$section] = [];
    };
    
    $grouped[$section] = array::push($grouped[$section], {
      content_key: $c.content_key,
      value: $localized_value,
      value_type: $c.value_type,
      sort_order: $c.sort_order,
      metadata: $c.metadata
    });
  };
  
  RETURN {
    page: $page,
    sections: $grouped
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::get_page_features($page: string, $locale: string) {
  LET $features = SELECT * FROM platform_page_features 
    WHERE page = $page AND active = true
    ORDER BY sort_order ASC;
  
  RETURN FOR $f IN $features RETURN {
    id: $f.id,
    feature_key: $f.feature_key,
    icon: $f.icon,
    icon_library: $f.icon_library,
    title: IF $locale == 'en' THEN $f.title_en ELSE $f.title_fr,
    description: IF $locale == 'en' THEN $f.description_en ELSE $f.description_fr,
    details: IF $locale == 'en' THEN $f.details_en ELSE $f.details_fr,
    image_url: $f.image_url,
    color_scheme: $f.color_scheme,
    sort_order: $f.sort_order
  };
};
```
