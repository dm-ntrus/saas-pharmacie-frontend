# Module: Client Journey (Parcours Client)

## Vue d'ensemble

**Module**: `client_journey`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les étapes du parcours client affiché sur la page d'accueil

## Analyse des éléments statiques actuels

### Éléments à remplacer (ClientJourneySection.tsx):
```tsx
// Ligne 9 - Étapes définies en dur
const STEP_KEYS = ["s1", "s2", "s3", "s4"] as const;

// Contenu chargé depuis i18n via:
// t('clientJourney.sectionTag')
// t('clientJourney.titleBeforeBrand')
// t('clientJourney.subtitle')
// t('clientJourney.ctaAllModules')
// t('clientJourney.ctaCreateSpace')
// t(`clientJourneySteps.${key}.step`)
// t(`clientJourneySteps.${key}.title`)
// t(`clientJourneySteps.${key}.text`)
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: client_journey_steps
-- Étapes du parcours client pour la page d'accueil
-- ============================================================
DEFINE TABLE client_journey_steps SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD step_key ON client_journey_steps TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_step_key ON client_journey_steps COLUMNS step_key UNIQUE;

-- Contenu localisé
DEFINE FIELD title ON client_journey_steps TYPE string;
DEFINE FIELD title_fr ON client_journey_steps TYPE string;
DEFINE FIELD title_en ON client_journey_steps TYPE string;

DEFINE FIELD description ON client_journey_steps TYPE string;
DEFINE FIELD description_fr ON client_journey_steps TYPE string;
DEFINE FIELD description_en ON client_journey_steps TYPE string;

-- Numéro d'étape
DEFINE FIELD step_number ON client_journey_steps TYPE string;
-- Ex: "01", "02", "03", "04"

-- Visuels
DEFINE FIELD icon ON client_journey_steps TYPE string;
DEFINE FIELD image_url ON client_journey_steps TYPE option<string>;
DEFINE FIELD video_url ON client_journey_steps TYPE option<string>;

-- Configuration
DEFINE FIELD active ON client_journey_steps TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON client_journey_steps TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON client_journey_steps COLUMNS sort_order;

-- Cible CTA
DEFINE FIELD cta_text ON client_journey_steps TYPE option<string>;
DEFINE FIELD cta_text_fr ON client_journey_steps TYPE option<string>;
DEFINE FIELD cta_text_en ON client_journey_steps TYPE option<string>;
DEFINE FIELD cta_url ON client_journey_steps TYPE option<string>;

-- Durée estimée
DEFINE FIELD estimated_duration ON client_journey_steps TYPE option<string>;
DEFINE FIELD estimated_duration_fr ON client_journey_steps TYPE option<string>;
DEFINE FIELD estimated_duration_en ON client_journey_steps TYPE option<string>;

-- Timestamps
DEFINE FIELD created_at ON client_journey_steps TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON client_journey_steps TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON client_journey_steps TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON client_journey_steps TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: client_journey_content
-- Contenu additionnel (header, CTA global, etc.)
-- ============================================================
DEFINE TABLE client_journey_content SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD content_key ON client_journey_content TYPE string;
DEFINE INDEX uq_content_key ON client_journey_content COLUMNS content_key UNIQUE;

DEFINE FIELD value ON client_journey_content TYPE string;
DEFINE FIELD value_fr ON client_journey_content TYPE string;
DEFINE FIELD value_en ON client_journey_content TYPE string;

DEFINE FIELD content_type ON client_journey_content TYPE string
  ASSERT $value IN ['tag', 'title', 'subtitle', 'cta', 'background'];

DEFINE FIELD url ON client_journey_content TYPE option<string>;

DEFINE FIELD active ON client_journey_content TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON client_journey_steps TYPE int DEFAULT 0;

DEFINE FIELD created_at ON client_journey_content TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON client_journey_content TYPE datetime VALUE time::now() READONLY;

-- EVENTS
DEFINE EVENT audit_client_journey_steps ON client_journey_steps
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'client_journey_steps.' + $after.step_key,
    action: $event,
    new_value: $after.title,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
-- Étapes du parcours
CREATE client_journey_steps CONTENT {
  step_key: 'journey_step_1',
  step_number: '01',
  title: 'Inscription gratuite',
  title_fr: 'Inscription gratuite',
  title_en: 'Free signup',
  description: 'Créez votre compte en 2 minutes. Aucun carte bancaire requise.',
  description_fr: 'Créez votre compte en 2 minutes. Aucun carte bancaire requise.',
  description_en: 'Create your account in 2 minutes. No credit card required.',
  icon: 'UserPlus',
  estimated_duration: '2 min',
  estimated_duration_fr: '2 min',
  estimated_duration_en: '2 min',
  sort_order: 1,
  active: true
};

CREATE client_journey_steps CONTENT {
  step_key: 'journey_step_2',
  step_number: '02',
  title: 'Configuration rapide',
  title_fr: 'Configuration rapide',
  title_en: 'Quick setup',
  description: 'Importez vos produits et configurez votre pharmacie.',
  description_fr: 'Importez vos produits et configurez votre pharmacie.',
  description_en: 'Import your products and configure your pharmacy.',
  icon: 'Settings',
  estimated_duration: '15 min',
  estimated_duration_fr: '15 min',
  estimated_duration_en: '15 min',
  sort_order: 2,
  active: true
};

CREATE client_journey_steps CONTENT {
  step_key: 'journey_step_3',
  step_number: '03',
  title: 'Formation intégrés',
  title_fr: 'Formation intégrés',
  title_en: 'Built-in training',
  description: 'Apprenez à votre rythme avec nos tutoriels interactifs.',
  description_fr: 'Apprenez à votre rythme avec nos tutoriels interactifs.',
  description_en: 'Learn at your own pace with our interactive tutorials.',
  icon: 'GraduationCap',
  estimated_duration: '1h',
  estimated_duration_fr: '1h',
  estimated_duration_en: '1h',
  sort_order: 3,
  active: true
};

CREATE client_journey_steps CONTENT {
  step_key: 'journey_step_4',
  step_number: '04',
  title: 'Premières ventes',
  title_fr: 'Premières ventes',
  title_en: 'First sales',
  description: 'Commencez à vendre ! Notre support est là si vous avez besoin.',
  description_fr: 'Commencez à vendre ! Notre support est là si vous avez besoin.',
  description_en: 'Start selling! Our support is here if you need help.',
  icon: 'ShoppingCart',
  estimated_duration: ' immediat',
  estimated_duration_fr: ' immediat',
  estimated_duration_en: 'immediate',
  sort_order: 4,
  active: true
};

-- Contenu additionnel
CREATE client_journey_content CONTENT {
  content_key: 'section_tag',
  value: 'Comment ça marche',
  value_fr: 'Comment ça marche',
  value_en: 'How it works',
  content_type: 'tag',
  active: true
};

CREATE client_journey_content CONTENT {
  content_key: 'title_before_brand',
  value: 'Commencez avec',
  value_fr: 'Commencez avec',
  value_en: 'Get started with',
  content_type: 'title',
  active: true
};

CREATE client_journey_content CONTENT {
  content_key: 'subtitle',
  value: 'Un parcours simple et guidé pour vous accompagner de l\'inscription à vos premières ventes.',
  value_fr: 'Un parcours simple et guidé pour vous accompagner de l\'inscription à vos premières ventes.',
  value_en: 'A simple and guided journey to take you from signup to your first sales.',
  content_type: 'subtitle',
  active: true
};

CREATE client_journey_content CONTENT {
  content_key: 'cta_all_modules',
  value: 'Découvrir tous les modules',
  value_fr: 'Découvrir tous les modules',
  value_en: 'Explore all modules',
  content_type: 'cta',
  url: '/modules',
  active: true
};

CREATE client_journey_content CONTENT {
  content_key: 'cta_create_space',
  value: 'Créer mon espace',
  value_fr: 'Créer mon espace',
  value_en: 'Create my space',
  content_type: 'cta',
  url: '/auth/register',
  active: true
};
```

## DTOs

### Input DTOs

```typescript
// create-journey-step.dto.ts
export class CreateJourneyStepDto {
  step_key: string;
  step_number: string;
  title: string;
  title_fr: string;
  title_en: string;
  description: string;
  description_fr: string;
  description_en: string;
  icon?: string;
  image_url?: string;
  video_url?: string;
  estimated_duration?: string;
  estimated_duration_fr?: string;
  estimated_duration_en?: string;
  cta_text?: string;
  cta_text_fr?: string;
  cta_text_en?: string;
  cta_url?: string;
  sort_order?: number;
  active?: boolean;
}

// update-journey-step.dto.ts
export class UpdateJourneyStepDto {
  step_number?: string;
  title?: string;
  title_fr?: string;
  title_en?: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  icon?: string;
  image_url?: string;
  video_url?: string;
  estimated_duration?: string;
  estimated_duration_fr?: string;
  estimated_duration_en?: string;
  cta_text?: string;
  cta_text_fr?: string;
  cta_text_en?: string;
  cta_url?: string;
  sort_order?: number;
  active?: boolean;
}

// create-journey-content.dto.ts
export class CreateJourneyContentDto {
  content_key: string;
  value: string;
  value_fr: string;
  value_en: string;
  content_type: 'tag' | 'title' | 'subtitle' | 'cta' | 'background';
  url?: string;
  active?: boolean;
}
```

### Output DTOs

```typescript
// journey-step.response.dto.ts
export class JourneyStepResponseDto {
  id: string;
  step_key: string;
  step_number: string;
  title: string; // Localisé
  description: string; // Localisé
  icon: string;
  image_url?: string;
  video_url?: string;
  estimated_duration?: string; // Localisé
  sort_order: number;
  created_at: Date;
}

export class JourneyContentResponseDto {
  content_key: string;
  value: string; // Localisé
  content_type: string;
  url?: string;
}

// Complete response for frontend
export class ClientJourneyResponseDto {
  section: {
    tag: string;
    title_before_brand: string;
    subtitle: string;
    brand_name: string; // SyntixPharma (from MARKETING_BRAND)
    cta_all_modules: string;
    cta_create_space: string;
  };
  steps: JourneyStepResponseDto[];
}
```

## Endpoints API

### GET /api/v1/marketing/client-journey
Récupérer le parcours client complet.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)

**Response 200:**
```json
{
  "section": {
    "tag": "Comment ça marche",
    "title_before_brand": "Commencez avec",
    "subtitle": "Un parcours simple et guidé...",
    "brand_name": "SyntixPharma",
    "cta_all_modules": "Découvrir tous les modules",
    "cta_create_space": "Créer mon espace"
  },
  "steps": [
    {
      "id": "client_journey_steps:journey_step_1",
      "step_key": "journey_step_1",
      "step_number": "01",
      "title": "Inscription gratuite",
      "description": "Créez votre compte en 2 minutes...",
      "icon": "UserPlus",
      "estimated_duration": "2 min",
      "sort_order": 1
    }
  ]
}
```

### GET /api/v1/marketing/client-journey/steps
Récupérer uniquement les étapes.

### GET /api/v1/marketing/client-journey/content
Récupérer uniquement le contenu de section.

### GET /api/v1/marketing/client-journey/steps/:step_key
Récupérer une étape par clé.

### POST /api/v1/marketing/client-journey/steps (Admin only)
Créer une nouvelle étape.

### PATCH /api/v1/marketing/client-journey/steps/:id (Admin only)
Mettre à jour une étape.

### DELETE /api/v1/marketing/client-journey/steps/:id (Admin only)
Supprimer une étape.

### PUT /api/v1/marketing/client-journey/content/:content_key (Admin only)
Mettre à jour le contenu de section.

### POST /api/v1/marketing/client-journey/reorder-steps (Admin only)
Réordonner les étapes.

**Body:**
```json
{
  "order": [
    { "id": "step_id_1", "sort_order": 1 },
    { "id": "step_id_2", "sort_order": 2 }
  ]
}
```

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_client_journey($locale: string) {
  LET $brand = (SELECT value FROM client_journey_content WHERE content_key = 'title_before_brand' AND active = true)[0];
  LET $subtitle = (SELECT value FROM client_journey_content WHERE content_key = 'subtitle' AND active = true)[0];
  LET $tag = (SELECT value FROM client_journey_content WHERE content_key = 'section_tag' AND active = true)[0];
  LET $ctaAll = (SELECT value, url FROM client_journey_content WHERE content_key = 'cta_all_modules' AND active = true)[0];
  LET $ctaCreate = (SELECT value, url FROM client_journey_content WHERE content_key = 'cta_create_space' AND active = true)[0];
  
  LET $steps = (SELECT * FROM client_journey_steps WHERE active = true ORDER BY sort_order ASC);
  
  LET $localize = FUNCTION($field, $fieldFr, $fieldEn) {
    IF $locale == 'en' THEN $fieldEn ELSE $fieldFr
  };
  
  RETURN {
    section: {
      tag: fn::localize($tag.value, $tag.value_fr, $tag.value_en),
      title_before_brand: fn::localize($brand.value, $brand.value_fr, $brand.value_en),
      subtitle: fn::localize($subtitle.value, $subtitle.value_fr, $subtitle.value_en),
      brand_name: 'SyntixPharma',
      cta_all_modules: {
        text: fn::localize($ctaAll.value, $ctaAll.value_fr, $ctaAll.value_en),
        url: $ctaAll.url
      },
      cta_create_space: {
        text: fn::localize($ctaCreate.value, $ctaCreate.value_fr, $ctaCreate.value_en),
        url: $ctaCreate.url
      }
    },
    steps: (FOR $step IN $steps RETURN {
      id: $step.id,
      step_key: $step.step_key,
      step_number: $step.step_number,
      title: fn::localize($step.title, $step.title_fr, $step.title_en),
      description: fn::localize($step.description, $step.description_fr, $step.description_en),
      icon: $step.icon,
      image_url: $step.image_url,
      estimated_duration: fn::localize($step.estimated_duration, $step.estimated_duration_fr, $step.estimated_duration_en),
      sort_order: $step.sort_order
    })
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::localize($value, $fr, $en) {
  IF $en IS NONE THEN $fr ELSE $en
};
```
