# Module: Testimonials (Témoignages Clients)

## Vue d'ensemble

**Module**: `testimonials`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les témoignages affichés sur la page d'accueil

## Analyse des éléments statiques actuels

### Éléments à remplacer (testimonials.tsx):
```tsx
// Ligne 10-29 - Testimonials hardcodés via i18n
const testimonials = [
  {
    name: t('testimonial1Name'),
    role: t('testimonial1Role'),
    content: t('testimonial1Content'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    name: t('testimonial2Name'),
    role: t('testimonial2Role'),
    content: t('testimonial2Content'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JP'
  },
  {
    name: t('testimonial3Name'),
    role: t('testimonial3Role'),
    content: t('testimonial3Content'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina'
  }
];
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: testimonials
-- Témoignages clients pour la page d'accueil
-- ============================================================
DEFINE TABLE testimonials SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD testimonial_key ON testimonials TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_testimonial_key ON testimonials COLUMNS testimonial_key UNIQUE;

-- Contenu
DEFINE FIELD author_name ON testimonials TYPE string;
DEFINE FIELD author_role ON testimonials TYPE string;
DEFINE FIELD author_company ON testimonials TYPE option<string>;
DEFINE FIELD author_location ON testimonials TYPE option<string>;
DEFINE FIELD content ON testimonials TYPE string;

-- Localisation
DEFINE FIELD content_fr ON testimonials TYPE string;
DEFINE FIELD content_en ON testimonials TYPE string;
DEFINE FIELD author_role_fr ON testimonials TYPE string;
DEFINE FIELD author_role_en ON testimonials TYPE string;
DEFINE FIELD author_company_fr ON testimonials TYPE option<string>;
DEFINE FIELD author_company_en ON testimonials TYPE option<string>;

-- Avatar & Médias
DEFINE FIELD avatar_url ON testimonials TYPE option<string>;
DEFINE FIELD avatar_type ON testimonials TYPE string DEFAULT 'generated'
  ASSERT $value IN ['generated', 'uploaded', 'initials'];
DEFINE FIELD avatar_seed ON testimonials TYPE option<string>;
DEFINE FIELD photo_url ON testimonials TYPE option<string>;

-- Métadonnées
DEFINE FIELD rating ON testimonials TYPE int DEFAULT 5
  ASSERT $value >= 1 AND $value <= 5;
DEFINE FIELD featured ON testimonials TYPE bool DEFAULT false;
DEFINE FIELD source ON testimonials TYPE string DEFAULT 'internal'
  ASSERT $value IN ['internal', 'g2', 'capterra', 'trustpilot', 'google'];

-- Affiliation
DEFINE FIELD solution_type ON testimonials TYPE option<string>;
-- Ex: 'officine', 'grossiste', 'hopital'
DEFINE FIELD plan_tier ON testimonials TYPE option<string>;
-- Ex: 'starter', 'professional', 'enterprise'

-- Visibilité
DEFINE FIELD active ON testimonials TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON testimonials TYPE int DEFAULT 0;
DEFINE FIELD valid_from ON testimonials TYPE option<datetime>;
DEFINE FIELD valid_until ON testimonials TYPE option<datetime>;

-- SEO
DEFINE FIELD meta_title ON testimonials TYPE option<string>;
DEFINE FIELD meta_description ON testimonials TYPE option<string>;

-- Timestamps
DEFINE FIELD created_at ON testimonials TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON testimonials TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD published_at ON testimonials TYPE option<datetime>;
DEFINE FIELD created_by ON testimonials TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON testimonials TYPE option<record<platform_admins>>;

-- Index
DEFINE INDEX idx_active ON testimonials COLUMNS active;
DEFINE INDEX idx_featured ON testimonials COLUMNS featured;
DEFINE INDEX idx_source ON testimonials COLUMNS source;
DEFINE INDEX idx_sort ON testimonials COLUMNS sort_order;
DEFINE INDEX idx_solution_type ON testimonials COLUMNS solution_type;

-- EVENTS
DEFINE EVENT audit_testimonials ON testimonials
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'testimonials.' + $after.testimonial_key,
    action: $event,
    old_value: $before.content,
    new_value: $after.content,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
CREATE testimonials CONTENT {
  testimonial_key: 'testimonial_sarah',
  author_name: 'Sarah',
  author_role: 'Pharmacienne',
  author_role_fr: 'Pharmacienne propriétaire',
  author_role_en: 'Owner Pharmacist',
  author_company: 'Pharmacie du Centre',
  author_company_fr: 'Pharmacie du Centre',
  author_company_en: 'City Center Pharmacy',
  content: 'SyntixPharma a transformé notre gestion quotidienne. Fini les ruptures de stock et les erreurs de délivrance.',
  content_fr: 'SyntixPharma a transformé notre gestion quotidienne. Fini les ruptures de stock et les erreurs de délivrance.',
  content_en: 'SyntixPharma transformed our daily operations. No more stockouts and dispensing errors.',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  avatar_type: 'generated',
  avatar_seed: 'Sarah',
  rating: 5,
  featured: true,
  source: 'internal',
  solution_type: 'officine',
  sort_order: 1,
  active: true,
  published_at: time::now()
};

CREATE testimonials CONTENT {
  testimonial_key: 'testimonial_jp',
  author_name: 'Jean-Pierre',
  author_role: 'Directeur IT',
  author_role_fr: 'Directeur des systèmes d\'information',
  author_role_en: 'IT Director',
  author_company: 'Groupe Pharma Plus',
  author_company_fr: 'Groupe Pharma Plus',
  author_company_en: 'Pharma Plus Group',
  content: 'L\'intégration avec notre ERP existant a été seamless. Un vrai gain de productivité.',
  content_fr: 'L\'intégration avec notre ERP existant a été seamless. Un vrai gain de productivité.',
  content_en: 'Integration with our existing ERP was seamless. Real productivity gains.',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JP',
  avatar_type: 'generated',
  avatar_seed: 'JP',
  rating: 5,
  featured: true,
  source: 'internal',
  solution_type: 'grossiste',
  sort_order: 2,
  active: true,
  published_at: time::now()
};

CREATE testimonials CONTENT {
  testimonial_key: 'testimonial_amina',
  author_name: 'Amina',
  author_role: 'Pharmacienne',
  author_role_fr: 'Responsable Pharmacie',
  author_role_en: 'Pharmacy Manager',
  author_company: 'Pharmacie Hay Riad',
  author_company_fr: 'Pharmacie Hay Riad',
  author_company_en: 'Hay Riad Pharmacy',
  content: 'Le module patients et ordonnances nous fait gagner 2h par jour. Mes équipes adorent !',
  content_fr: 'Le module patients et ordonnances nous fait gagner 2h par jour. Mes équipes adorent !',
  content_en: 'The patient and prescription module saves us 2 hours daily. My team loves it!',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina',
  avatar_type: 'generated',
  avatar_seed: 'Amina',
  rating: 5,
  featured: true,
  source: 'internal',
  solution_type: 'officine',
  sort_order: 3,
  active: true,
  published_at: time::now()
};
```

## DTOs

### Input DTOs

```typescript
// create-testimonial.dto.ts
export class CreateTestimonialDto {
  testimonial_key: string;
  author_name: string;
  author_role: string;
  author_role_fr: string;
  author_role_en: string;
  author_company?: string;
  author_company_fr?: string;
  author_company_en?: string;
  content: string;
  content_fr: string;
  content_en: string;
  avatar_url?: string;
  avatar_type?: 'generated' | 'uploaded' | 'initials';
  avatar_seed?: string;
  photo_url?: string;
  rating?: number;
  featured?: boolean;
  source?: 'internal' | 'g2' | 'capterra' | 'trustpilot' | 'google';
  solution_type?: string;
  plan_tier?: string;
  active?: boolean;
  sort_order?: number;
  valid_from?: Date;
  valid_until?: Date;
  meta_title?: string;
  meta_description?: string;
}

// update-testimonial.dto.ts
export class UpdateTestimonialDto {
  author_name?: string;
  author_role?: string;
  author_role_fr?: string;
  author_role_en?: string;
  author_company?: string;
  content?: string;
  content_fr?: string;
  content_en?: string;
  avatar_url?: string;
  avatar_type?: 'generated' | 'uploaded' | 'initials';
  photo_url?: string;
  rating?: number;
  featured?: boolean;
  source?: string;
  solution_type?: string;
  plan_tier?: string;
  active?: boolean;
  sort_order?: number;
  valid_from?: Date;
  valid_until?: Date;
  meta_title?: string;
  meta_description?: string;
}
```

### Output DTOs

```typescript
// testimonial.response.dto.ts
export class TestimonialResponseDto {
  id: string;
  testimonial_key: string;
  author_name: string;
  author_role: string; // Localisé
  author_company?: string; // Localisé
  content: string; // Localisé
  avatar_url?: string;
  avatar_type?: string;
  photo_url?: string;
  rating: number;
  featured: boolean;
  source: string;
  solution_type?: string;
  plan_tier?: string;
  sort_order: number;
  created_at: Date;
  published_at?: Date;
}

export class TestimonialDetailResponseDto extends TestimonialResponseDto {
  author_location?: string;
  meta_title?: string;
  meta_description?: string;
  valid_from?: Date;
  valid_until?: Date;
}

// Query DTO
export class QueryTestimonialsDto {
  locale?: 'fr' | 'en';
  featured?: boolean;
  source?: string;
  solution_type?: string;
  plan_tier?: string;
  active?: boolean;
  valid?: boolean; // Vérifie valid_from et valid_until
  sort?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/testimonials
Récupérer les témoignages.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `featured` (optional): `true` | `false`
- `source` (optional): `internal` | `g2` | `capterra` | `trustpilot` | `google`
- `solution_type` (optional): `officine` | `grossiste` | `hopital`
- `limit` (optional): nombre max (défaut: 10)
- `random` (optional): `true` pour ordre aléatoire

**Response 200:**
```json
{
  "data": [
    {
      "id": "testimonials:testimonial_sarah",
      "testimonial_key": "testimonial_sarah",
      "author_name": "Sarah",
      "author_role": "Pharmacienne propriétaire",
      "author_company": "Pharmacie du Centre",
      "content": "SyntixPharma a transformé notre gestion quotidienne...",
      "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      "rating": 5,
      "featured": true,
      "sort_order": 1
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### GET /api/v1/marketing/testimonials/featured
Récupérer les témoignages mis en avant (3 par défaut).

### GET /api/v1/marketing/testimonials/random
Récupérer des témoignages dans un ordre aléatoire.

### GET /api/v1/marketing/testimonials/:testimonial_key
Récupérer un témoignage par clé.

### POST /api/v1/marketing/testimonials (Admin only)
Créer un nouveau témoignage.

**Body:**
```json
{
  "testimonial_key": "testimonial_new",
  "author_name": "Marie",
  "author_role_fr": "Directrice de Pharmacie",
  "author_role_en": "Pharmacy Director",
  "content_fr": "Contenu en français...",
  "content_en": "Content in English...",
  "rating": 5,
  "featured": true,
  "sort_order": 4
}
```

### PATCH /api/v1/marketing/testimonials/:id (Admin only)
Mettre à jour un témoignage.

### DELETE /api/v1/marketing/testimonials/:id (Admin only)
Supprimer un témoignage.

### POST /api/v1/marketing/testimonials/:id/publish (Admin only)
Publier un témoignage (active + published_at).

### POST /api/v1/marketing/testimonials/:id/unpublish (Admin only)
Dépublier un témoignage.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_testimonials(
  $locale: string,
  $featured: option<bool>,
  $solution_type: option<string>,
  $limit: option<int>
) {
  LET $now = time::now();
  LET $query = SELECT * FROM testimonials 
    WHERE active = true 
    AND (valid_from IS NONE OR valid_from <= $now)
    AND (valid_until IS NONE OR valid_until >= $now)
    AND ($featured IS NONE OR featured = $featured)
    AND ($solution_type IS NONE OR solution_type = $solution_type)
    ORDER BY sort_order ASC
    LIMIT $limit ?? 10;
  
  FOR $t IN $query {
    RETURN {
      id: $t.id,
      author_name: $t.author_name,
      author_role: IF $locale == 'en' THEN $t.author_role_en ELSE $t.author_role_fr,
      author_company: IF $locale == 'en' THEN $t.author_company_en ELSE $t.author_company_fr,
      content: IF $locale == 'en' THEN $t.content_en ELSE $t.content_fr,
      avatar_url: $t.avatar_url,
      photo_url: $t.photo_url,
      rating: $t.rating,
      featured: $t.featured,
      source: $t.source,
      solution_type: $t.solution_type
    };
  };
};
```
