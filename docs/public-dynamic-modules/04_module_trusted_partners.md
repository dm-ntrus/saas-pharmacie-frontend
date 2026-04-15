# Module: Trusted Partners (Partenaires de Confiance)

## Vue d'ensemble

**Module**: `trusted_partners`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les logos des partenaires affichés sur la page d'accueil (section "Trusted By")

## Analyse des éléments statiques actuels

### Éléments à remplacer (trusted-by.tsx):
```tsx
// Ligne 8-11 - Logos chargés depuis i18n
const messages = useMessages() as {
  platformModules?: { trustedLogos?: string[] };
};
const logos = messages.platformModules?.trustedLogos ?? [];
```

Les logos sont actuellement dans le fichier de messages i18n et sont statiques.

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: trusted_partners
-- Logos des partenaires affichés sur le site public
-- ============================================================
DEFINE TABLE trusted_partners SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD partner_key ON trusted_partners TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_partner_key ON trusted_partners COLUMNS partner_key UNIQUE;

-- Informations du partenaire
DEFINE FIELD name ON trusted_partners TYPE string;
DEFINE FIELD name_fr ON trusted_partners TYPE string;
DEFINE FIELD name_en ON trusted_partners TYPE string;

DEFINE FIELD description ON trusted_partners TYPE option<string>;
DEFINE FIELD description_fr ON trusted_partners TYPE option<string>;
DEFINE FIELD description_en ON trusted_partners TYPE option<string>;

DEFINE FIELD website_url ON trusted_partners TYPE option<string>;

-- Médias
DEFINE FIELD logo_url ON trusted_partners TYPE string;
DEFINE FIELD logo_dark_url ON trusted_partners TYPE option<string>;
-- Pour le mode sombre si nécessaire

DEFINE FIELD logo_width ON trusted_partners TYPE int DEFAULT 120;
DEFINE FIELD logo_height ON trusted_partners TYPE int DEFAULT 40;

-- Catégorie
DEFINE FIELD category ON trusted_partners TYPE string DEFAULT 'partner'
  ASSERT $value IN ['partner', 'investor', 'certification', 'integration', 'media'];
DEFINE INDEX idx_category ON trusted_partners COLUMNS category;

-- Affiliation
DEFINE FIELD integration_type ON trusted_partners TYPE option<string>;
-- Ex: 'payment', 'accounting', 'delivery'

DEFINE FIELD tier ON trusted_partners TYPE string DEFAULT 'standard'
  ASSERT $value IN ['standard', 'gold', 'platinum', 'strategic'];

-- Position et visibilité
DEFINE FIELD sort_order ON trusted_partners TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON trusted_partners COLUMNS sort_order;

DEFINE FIELD active ON trusted_partners TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON trusted_partners COLUMNS active;

-- Configuration d'affichage
DEFINE FIELD display_location ON trusted_partners TYPE array<string> DEFAULT ['home']
  -- ['home', 'footer', 'pricing', 'integration_page']
DEFINE FIELD is_featured ON trusted_partners TYPE bool DEFAULT false;

-- Animation
DEFINE FIELD animation_style ON trusted_partners TYPE string DEFAULT 'marquee'
  ASSERT $value IN ['marquee', 'fade', 'static', 'none'];

-- SEO
DEFINE FIELD meta_title ON trusted_partners TYPE option<string>;
DEFINE FIELD meta_description ON trusted_partners TYPE option<string>;

-- Timestamps
DEFINE FIELD created_at ON trusted_partners TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON trusted_partners TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD partnership_start_date ON trusted_partners TYPE option<datetime>;
DEFINE FIELD partnership_end_date ON trusted_partners TYPE option<datetime>;
DEFINE FIELD created_by ON trusted_partners TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON trusted_partners TYPE option<record<platform_admins>>;

-- EVENTS
DEFINE EVENT audit_trusted_partners ON trusted_partners
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'trusted_partners.' + $after.partner_key,
    action: $event,
    new_value: $after.name,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
CREATE trusted_partners CONTENT {
  partner_key: 'partner_sanofi',
  name: 'Sanofi',
  name_fr: 'Sanofi',
  name_en: 'Sanofi',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sanofi_Logo.svg/200px-Sanofi_Logo.svg.png',
  category: 'partner',
  tier: 'strategic',
  sort_order: 1,
  active: true,
  display_location: ['home', 'footer'],
  animation_style: 'marquee'
};

CREATE trusted_partners CONTENT {
  partner_key: 'partner_novartis',
  name: 'Novartis',
  name_fr: 'Novartis',
  name_en: 'Novartis',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Novartis-Logo.svg/200px-Novartis-Logo.svg.png',
  category: 'partner',
  tier: 'platinum',
  sort_order: 2,
  active: true,
  display_location: ['home', 'footer'],
  animation_style: 'marquee'
};

CREATE trusted_partners CONTENT {
  partner_key: 'partner_roche',
  name: 'Roche',
  name_fr: 'Roche',
  name_en: 'Roche',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Roche_Logo.svg/200px-Roche_Logo.svg.png',
  category: 'partner',
  tier: 'platinum',
  sort_order: 3,
  active: true,
  display_location: ['home', 'footer'],
  animation_style: 'marquee'
};

CREATE trusted_partners CONTENT {
  partner_key: 'partner_bayer',
  name: 'Bayer',
  name_fr: 'Bayer',
  name_en: 'Bayer',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bayer_Logo.svg/200px-Bayer_Logo.svg.png',
  category: 'partner',
  tier: 'gold',
  sort_order: 4,
  active: true,
  display_location: ['home'],
  animation_style: 'marquee'
};

CREATE trusted_partners CONTENT {
  partner_key: 'partner_gs1',
  name: 'GS1',
  name_fr: 'GS1',
  name_en: 'GS1',
  logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/GS1_Logo.svg/200px-GS1_Logo.svg.png',
  category: 'certification',
  tier: 'standard',
  sort_order: 5,
  active: true,
  display_location: ['home', 'footer'],
  animation_style: 'fade'
};
```

## DTOs

### Input DTOs

```typescript
// create-trusted-partner.dto.ts
export class CreateTrustedPartnerDto {
  partner_key: string;
  name: string;
  name_fr: string;
  name_en: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  website_url?: string;
  logo_url: string;
  logo_dark_url?: string;
  logo_width?: number;
  logo_height?: number;
  category?: 'partner' | 'investor' | 'certification' | 'integration' | 'media';
  integration_type?: string;
  tier?: 'standard' | 'gold' | 'platinum' | 'strategic';
  sort_order?: number;
  active?: boolean;
  display_location?: string[];
  is_featured?: boolean;
  animation_style?: 'marquee' | 'fade' | 'static' | 'none';
  meta_title?: string;
  meta_description?: string;
  partnership_start_date?: Date;
  partnership_end_date?: Date;
}

// update-trusted-partner.dto.ts
export class UpdateTrustedPartnerDto {
  name?: string;
  name_fr?: string;
  name_en?: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  website_url?: string;
  logo_url?: string;
  logo_dark_url?: string;
  logo_width?: number;
  logo_height?: number;
  category?: string;
  integration_type?: string;
  tier?: string;
  sort_order?: number;
  active?: boolean;
  display_location?: string[];
  is_featured?: boolean;
  animation_style?: string;
  partnership_start_date?: Date;
  partnership_end_date?: Date;
}
```

### Output DTOs

```typescript
// trusted-partner.response.dto.ts
export class TrustedPartnerResponseDto {
  id: string;
  partner_key: string;
  name: string; // Localisé
  logo_url: string;
  logo_dark_url?: string;
  logo_width: number;
  logo_height: number;
  category: string;
  tier: string;
  sort_order: number;
  display_location: string[];
  animation_style: string;
  is_featured: boolean;
  created_at: Date;
}

export class TrustedPartnerDetailResponseDto extends TrustedPartnerResponseDto {
  description?: string; // Localisé
  website_url?: string;
  integration_type?: string;
  meta_title?: string;
  meta_description?: string;
  partnership_start_date?: Date;
  partnership_end_date?: Date;
}

// Query DTO
export class QueryTrustedPartnersDto {
  locale?: 'fr' | 'en';
  category?: string;
  tier?: string;
  display_location?: string;
  featured?: boolean;
  active?: boolean;
  sort?: 'asc' | 'desc';
  limit?: number;
  random?: boolean;
}
```

## Endpoints API

### GET /api/v1/marketing/trusted-partners
Récupérer les partenaires de confiance.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `category` (optional): `partner` | `investor` | `certification` | `integration` | `media`
- `display_location` (optional): `home` | `footer` | `pricing` | `integration_page`
- `tier` (optional): `standard` | `gold` | `platinum` | `strategic`
- `featured` (optional): `true` | `false`
- `limit` (optional): nombre max (défaut: 20)
- `random` (optional): `true` pour ordre aléatoire

**Response 200:**
```json
{
  "data": [
    {
      "id": "trusted_partners:partner_sanofi",
      "partner_key": "partner_sanofi",
      "name": "Sanofi",
      "logo_url": "https://...",
      "logo_width": 120,
      "logo_height": 40,
      "category": "partner",
      "tier": "strategic",
      "sort_order": 1,
      "animation_style": "marquee"
    }
  ],
  "total": 5,
  "categories": ["partner", "certification"]
}
```

### GET /api/v1/marketing/trusted-partners/logo-only
Récupérer uniquement les données nécessaires pour l'affichage (optimisé).

### GET /api/v1/marketing/trusted-partners/categories
Récupérer les catégories disponibles.

### GET /api/v1/marketing/trusted-partners/:partner_key
Récupérer un partenaire par clé.

### POST /api/v1/marketing/trusted-partners (Admin only)
Créer un nouveau partenaire.

**Body:**
```json
{
  "partner_key": "partner_new",
  "name": "Nouveau Partenaire",
  "name_fr": "Nouveau Partenaire",
  "name_en": "New Partner",
  "logo_url": "https://...",
  "category": "partner",
  "sort_order": 6
}
```

### PATCH /api/v1/marketing/trusted-partners/:id (Admin only)
Mettre à jour un partenaire.

### DELETE /api/v1/marketing/trusted-partners/:id (Admin only)
Supprimer un partenaire.

### POST /api/v1/marketing/trusted-partners/reorder (Admin only)
Réordonner les partenaires.

**Body:**
```json
{
  "order": [
    { "id": "partner_id_1", "sort_order": 1 },
    { "id": "partner_id_2", "sort_order": 2 }
  ]
}
```

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_trusted_partners(
  $locale: string,
  $category: option<string>,
  $display_location: option<string>,
  $limit: option<int>,
  $random: option<bool>
) {
  LET $now = time::now();
  LET $query = SELECT * FROM trusted_partners 
    WHERE active = true
    AND ($category IS NONE OR category = $category)
    AND ($display_location IS NONE OR display_location CONTAINS $display_location)
    AND (partnership_start_date IS NONE OR partnership_start_date <= $now)
    AND (partnership_end_date IS NONE OR partnership_end_date >= $now)
    ORDER BY sort_order ASC
    LIMIT $limit ?? 20;
  
  IF $random = true {
    RETURN fn::shuffle_array($query {
      id: $this.id,
      partner_key: $this.partner_key,
      name: IF $locale == 'en' THEN $this.name_en ELSE $this.name_fr,
      logo_url: $this.logo_url,
      logo_dark_url: $this.logo_dark_url,
      logo_width: $this.logo_width,
      logo_height: $this.logo_height,
      category: $this.category,
      tier: $this.tier,
      animation_style: $this.animation_style
    });
  };
  
  RETURN $query {
    id: $this.id,
    partner_key: $this.partner_key,
    name: IF $locale == 'en' THEN $this.name_en ELSE $this.name_fr,
    logo_url: $this.logo_url,
    logo_dark_url: $this.logo_dark_url,
    logo_width: $this.logo_width,
    logo_height: $this.logo_height,
    category: $this.category,
    tier: $this.tier,
    animation_style: $this.animation_style
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::shuffle_array($arr: array) {
  -- Simple Fisher-Yates shuffle
  LET $n = array::len($arr);
  FOR $i IN range(0, $n - 1) {
    LET $j = math::floor(math::rand() * ($i + 1));
    LET $temp = $arr[$i];
    $arr[$i] = $arr[$j];
    $arr[$j] = $temp;
  };
  RETURN $arr;
};
```
