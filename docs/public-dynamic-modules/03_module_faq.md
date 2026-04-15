# Module: FAQ (Questions Fréquentes)

## Vue d'ensemble

**Module**: `faq`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les questions fréquentes affichées sur plusieurs pages

## Analyse des éléments statiques actuels

### Éléments à remplacer (faq.tsx):
```tsx
// Ligne 11-16 - FAQ hardcodées via i18n
const faqs = [
  { q: t('faq1Q'), a: t('faq1A') },
  { q: t('faq2Q'), a: t('faq2A') },
  { q: t('faq3Q'), a: t('faq3A') },
  { q: t('faq4Q'), a: t('faq4A') }
];
```

### Pages utilisant FAQ:
- Page d'accueil (`/`)
- Page pricing (`/pricing`)
- Possiblement d'autres pages

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: faqs
-- Questions fréquentes pour le site public
-- ============================================================
DEFINE TABLE faqs SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD faq_key ON faqs TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_faq_key ON faqs COLUMNS faq_key UNIQUE;

-- Localisation
DEFINE FIELD question ON faqs TYPE string;
DEFINE FIELD question_fr ON faqs TYPE string;
DEFINE FIELD question_en ON faqs TYPE string;

DEFINE FIELD answer ON faqs TYPE string;
DEFINE FIELD answer_fr ON faqs TYPE string;
DEFINE FIELD answer_en ON faqs TYPE string;

-- Organisation
DEFINE FIELD category ON faqs TYPE string DEFAULT 'general'
  ASSERT $value IN [
    'general', 'pricing', 'technical', 'billing', 
    'security', 'integrations', 'support'
  ];
DEFINE INDEX idx_category ON faqs COLUMNS category;

DEFINE FIELD page ON faqs TYPE string DEFAULT 'global'
  ASSERT $value IN [
    'global', 'home', 'pricing', 'features', 
    'solutions', 'about', 'contact'
  ];
DEFINE INDEX idx_page ON faqs COLUMNS page;

-- Hiérarchie
DEFINE FIELD parent_id ON faqs TYPE option<record<faqs>>;
DEFINE FIELD is_nested ON faqs TYPE bool DEFAULT false;

-- Position
DEFINE FIELD sort_order ON faqs TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON faqs COLUMNS sort_order;

-- Visibilité
DEFINE FIELD active ON faqs TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON faqs COLUMNS active;

-- Métadonnées SEO
DEFINE FIELD meta_title ON faqs TYPE option<string>;
DEFINE FIELD meta_title_fr ON faqs TYPE option<string>;
DEFINE FIELD meta_title_en ON faqs TYPE option<string>;
DEFINE FIELD meta_description ON faqs TYPE option<string>;
DEFINE FIELD meta_description_fr ON faqs TYPE option<string>;
DEFINE FIELD meta_description_en ON faqs TYPE option<string>;
DEFINE FIELD slug ON faqs TYPE option<string>;
DEFINE INDEX idx_slug ON faqs COLUMNS slug UNIQUE;

-- Configuration d'affichage
DEFINE FIELD display_mode ON faqs TYPE string DEFAULT 'accordion'
  ASSERT $value IN ['accordion', 'expandable', 'static'];
DEFINE FIELD icon ON faqs TYPE option<string>;
DEFINE FIELD badge ON faqs TYPE option<string>;
-- Ex: 'popular', 'new', 'beta'

-- Analytics
DEFINE FIELD view_count ON faqs TYPE int DEFAULT 0;
DEFINE FIELD helpful_count ON faqs TYPE int DEFAULT 0;
DEFINE FIELD not_helpful_count ON faqs TYPE int DEFAULT 0;

-- Timestamps
DEFINE FIELD created_at ON faqs TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON faqs TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD published_at ON faqs TYPE option<datetime>;
DEFINE FIELD created_by ON faqs TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON faqs TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: faq_ratings
-- Évaluation de l'utilité des FAQs par les utilisateurs
-- ============================================================
DEFINE TABLE faq_ratings SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR create WHERE true
    FOR update WHERE $auth.id = out.created_by
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD faq_id ON faq_ratings TYPE record<faqs>;
DEFINE FIELD is_helpful ON faq_ratings TYPE bool;
DEFINE FIELD comment ON faq_ratings TYPE option<string>;
DEFINE FIELD user_id ON faq_ratings TYPE option<record<users>>;
DEFINE FIELD user_ip ON faq_ratings TYPE option<string>;
DEFINE FIELD created_at ON faq_ratings TYPE datetime DEFAULT time::now() READONLY;

DEFINE INDEX idx_faq_ratings_faq ON faq_ratings COLUMNS faq_id;

-- EVENTS
DEFINE EVENT audit_faqs ON faqs
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'faqs.' + $after.faq_key,
    action: $event,
    old_value: $before.question,
    new_value: $after.question,
    performed_by: $auth.id ?? 'system'
  };
};

DEFINE EVENT track_faq_view ON faqs
WHEN $event = 'SELECT'
THEN {
  -- Increment view count (simplified - in production use proper counter)
};
```

### Seed Data

```surql
-- General FAQs
CREATE faqs CONTENT {
  faq_key: 'faq_general_1',
  question: 'Qu\'est-ce que SyntixPharma ?',
  question_fr: 'Qu\'est-ce que SyntixPharma ?',
  question_en: 'What is SyntixPharma?',
  answer: 'SyntixPharma est une plateforme SaaS de gestion complète pour pharmacies, grossistes et établissements de santé.',
  answer_fr: 'SyntixPharma est une plateforme SaaS de gestion complète pour pharmacies, grossistes et établissements de santé.',
  answer_en: 'SyntixPharma is a comprehensive SaaS management platform for pharmacies, wholesalers, and healthcare facilities.',
  category: 'general',
  page: 'home',
  sort_order: 1,
  active: true,
  display_mode: 'accordion'
};

CREATE faqs CONTENT {
  faq_key: 'faq_pricing_1',
  question: 'Quels sont les plans disponibles ?',
  question_fr: 'Quels sont les plans disponibles ?',
  question_en: 'What plans are available?',
  answer: 'Nous proposons 4 plans : Free, Starter, Professional et Enterprise. Chaque plan inclut des fonctionnalités différentes.',
  answer_fr: 'Nous proposons 4 plans : Free, Starter, Professional et Enterprise. Chaque plan inclut des fonctionnalités différentes.',
  answer_en: 'We offer 4 plans: Free, Starter, Professional, and Enterprise. Each plan includes different features.',
  category: 'pricing',
  page: 'pricing',
  sort_order: 1,
  active: true,
  display_mode: 'accordion'
};

CREATE faqs CONTENT {
  faq_key: 'faq_security_1',
  question: 'Mes données sont-elles sécurisées ?',
  question_fr: 'Mes données sont-elles sécurisées ?',
  question_en: 'Is my data secure?',
  answer: 'Oui ! Nous utilisons le chiffrement AES-256, la conformité GDP et SOC 2 Type II.',
  answer_fr: 'Oui ! Nous utilisons le chiffrement AES-256, la conformité GDP et SOC 2 Type II.',
  answer_en: 'Yes! We use AES-256 encryption, GDP compliance, and SOC 2 Type II certification.',
  category: 'security',
  page: 'home',
  sort_order: 2,
  active: true,
  badge: 'security'
};

CREATE faqs CONTENT {
  faq_key: 'faq_support_1',
  question: 'Comment obtenir de l\'aide ?',
  question_fr: 'Comment obtenir de l\'aide ?',
  question_en: 'How can I get help?',
  answer: 'Vous pouvez nous contacter via le chat en ligne, email ou téléphone. Notre support est disponible 24/7.',
  answer_fr: 'Vous pouvez nous contacter via le chat en ligne, email ou téléphone. Notre support est disponible 24/7.',
  answer_en: 'You can contact us via live chat, email, or phone. Our support is available 24/7.',
  category: 'support',
  page: 'home',
  sort_order: 3,
  active: true,
  badge: 'support'
};
```

## DTOs

### Input DTOs

```typescript
// create-faq.dto.ts
export class CreateFaqDto {
  faq_key: string;
  question: string;
  question_fr: string;
  question_en: string;
  answer: string;
  answer_fr: string;
  answer_en: string;
  category?: 'general' | 'pricing' | 'technical' | 'billing' | 'security' | 'integrations' | 'support';
  page?: 'global' | 'home' | 'pricing' | 'features' | 'solutions' | 'about' | 'contact';
  parent_id?: string;
  sort_order?: number;
  active?: boolean;
  display_mode?: 'accordion' | 'expandable' | 'static';
  icon?: string;
  badge?: string;
  meta_title?: string;
  meta_title_fr?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_fr?: string;
  meta_description_en?: string;
  slug?: string;
}

// update-faq.dto.ts
export class UpdateFaqDto {
  question?: string;
  question_fr?: string;
  question_en?: string;
  answer?: string;
  answer_fr?: string;
  answer_en?: string;
  category?: string;
  page?: string;
  parent_id?: string;
  sort_order?: number;
  active?: boolean;
  display_mode?: string;
  icon?: string;
  badge?: string;
  meta_title?: string;
  meta_title_fr?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_fr?: string;
  meta_description_en?: string;
  slug?: string;
}

// create-faq-rating.dto.ts
export class CreateFaqRatingDto {
  faq_id: string;
  is_helpful: boolean;
  comment?: string;
}
```

### Output DTOs

```typescript
// faq.response.dto.ts
export class FaqResponseDto {
  id: string;
  faq_key: string;
  question: string; // Localisé
  answer: string; // Localisé
  category: string;
  page: string;
  sort_order: number;
  display_mode: string;
  icon?: string;
  badge?: string;
  helpful_count: number;
  not_helpful_count: number;
  created_at: Date;
}

export class FaqDetailResponseDto extends FaqResponseDto {
  meta_title?: string; // Localisé
  meta_description?: string; // Localisé
  slug?: string;
  is_nested: boolean;
  children?: FaqResponseDto[];
  published_at?: Date;
}

// Query DTO
export class QueryFaqsDto {
  locale?: 'fr' | 'en';
  category?: string;
  page?: string;
  active?: boolean;
  include_nested?: boolean;
  sort?: 'asc' | 'desc';
  limit?: number;
  page_num?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/faqs
Récupérer les FAQs.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `category` (optional): `general` | `pricing` | `technical` | `billing` | `security` | `integrations` | `support`
- `page` (optional): `home` | `pricing` | `features` | `solutions` | `about` | `contact`
- `active` (optional): `true` | `false`
- `include_nested` (optional): `true` | `false`

**Response 200:**
```json
{
  "data": [
    {
      "id": "faqs:faq_general_1",
      "faq_key": "faq_general_1",
      "question": "Qu'est-ce que SyntixPharma ?",
      "answer": "SyntixPharma est une plateforme SaaS...",
      "category": "general",
      "page": "home",
      "sort_order": 1,
      "display_mode": "accordion",
      "helpful_count": 45,
      "not_helpful_count": 2
    }
  ],
  "categories": ["general", "pricing", "security", "support"],
  "total": 4,
  "page": 1,
  "limit": 20
}
```

### GET /api/v1/marketing/faqs/categories
Récupérer les catégories de FAQ disponibles.

### GET /api/v1/marketing/faqs/by-page/:page
Récupérer les FAQs pour une page spécifique.

### GET /api/v1/marketing/faqs/:faq_key
Récupérer une FAQ par clé.

### POST /api/v1/marketing/faqs (Admin only)
Créer une nouvelle FAQ.

**Body:**
```json
{
  "faq_key": "faq_new",
  "question_fr": "Nouvelle question ?",
  "question_en": "New question?",
  "answer_fr": "Réponse...",
  "answer_en": "Answer...",
  "category": "general",
  "page": "home",
  "sort_order": 5
}
```

### PATCH /api/v1/marketing/faqs/:id (Admin only)
Mettre à jour une FAQ.

### DELETE /api/v1/marketing/faqs/:id (Admin only)
Supprimer une FAQ.

### POST /api/v1/marketing/faqs/:id/rate (Public)
Évaluer l'utilité d'une FAQ.

**Body:**
```json
{
  "is_helpful": true,
  "comment": "Très utile merci !"
}
```

### PUT /api/v1/marketing/faqs/reorder (Admin only)
Réordonner les FAQs.

**Body:**
```json
{
  "order": [
    { "id": "faq_id_1", "sort_order": 1 },
    { "id": "faq_id_2", "sort_order": 2 },
    { "id": "faq_id_3", "sort_order": 3 }
  ]
}
```

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_faqs(
  $locale: string,
  $category: option<string>,
  $page: option<string>,
  $include_nested: option<bool>
) {
  LET $query = SELECT * FROM faqs 
    WHERE active = true 
    AND ($category IS NONE OR category = $category)
    AND ($page IS NONE OR page = $page OR page = 'global')
    ORDER BY sort_order ASC;
  
  IF $include_nested = false {
    RETURN (SELECT * FROM $query WHERE parent_id IS NONE) {
      id: $this.id,
      faq_key: $this.faq_key,
      question: IF $locale == 'en' THEN $this.question_en ELSE $this.question_fr,
      answer: IF $locale == 'en' THEN $this.answer_en ELSE $this.answer_fr,
      category: $this.category,
      page: $this.page,
      display_mode: $this.display_mode,
      icon: $this.icon,
      badge: $this.badge,
      helpful_count: $this.helpful_count
    };
  };
  
  RETURN $query {
    id: $this.id,
    faq_key: $this.faq_key,
    question: IF $locale == 'en' THEN $this.question_en ELSE $this.question_fr,
    answer: IF $locale == 'en' THEN $this.answer_en ELSE $this.answer_fr,
    category: $this.category,
    display_mode: $this.display_mode,
    badge: $this.badge,
    children: (SELECT * FROM faqs WHERE parent_id = $this.id ORDER BY sort_order ASC) {
      id: $this.id,
      question: IF $locale == 'en' THEN $this.question_en ELSE $this.question_fr,
      answer: IF $locale == 'en' THEN $this.answer_en ELSE $this.answer_fr
    }
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::rate_faq($faq_id: record<faqs>, $is_helpful: bool) {
  LET $faq = (SELECT * FROM faqs WHERE id = $faq_id)[0];
  IF !$faq {
    THROW 'FAQ not found';
  };
  
  UPDATE faqs SET {
    helpful_count: $faq.helpful_count + IF $is_helpful THEN 1 ELSE 0,
    not_helpful_count: $faq.not_helpful_count + IF $is_helpful THEN 0 ELSE 1
  } WHERE id = $faq_id;
  
  RETURN true;
};
```
