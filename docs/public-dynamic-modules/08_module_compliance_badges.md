# Module: Compliance Badges (Badges de Conformité)

## Vue d'ensemble

**Module**: `compliance_badges`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les badges de conformité affichés sur la page d'accueil (GDP, ISO, HIPAA, etc.)

## Analyse des éléments statiques actuels

### Éléments à remplacer (page.tsx):
```tsx
// Ligne 275-282 - Compliance badges
<div className="flex flex-wrap items-center gap-2 mb-6">
  <ComplianceBadge type="gdp" size="sm" />
  <ComplianceBadge type="iso" size="sm" />
  <ComplianceBadge type="hipaa" size="sm" />
  <span className="text-[10px] text-slate-400 font-medium">
    + 50+ regulatory standards
  </span>
</div>
```

### Composant actuel (ComplianceBadges.tsx):
```tsx
// Badges hardcodés avec type et size
<ComplianceBadge type="gdp" size="sm" />
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: compliance_badges
-- Badges de conformité pour le site public
-- ============================================================
DEFINE TABLE compliance_badges SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD badge_key ON compliance_badges TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_badge_key ON compliance_badges COLUMNS badge_key UNIQUE;

-- Informations
DEFINE FIELD name ON compliance_badges TYPE string;
DEFINE FIELD name_fr ON compliance_badges TYPE string;
DEFINE FIELD name_en ON compliance_badges TYPE string;

DEFINE FIELD short_name ON compliance_badges TYPE string;
DEFINE FIELD short_name_fr ON compliance_badges TYPE string;
DEFINE FIELD short_name_en ON compliance_badges TYPE string;

DEFINE FIELD description ON compliance_badges TYPE option<string>;
DEFINE FIELD description_fr ON compliance_badges TYPE option<string>;
DEFINE FIELD description_en ON compliance_badges TYPE option<string>;

-- Visuels
DEFINE FIELD logo_url ON compliance_badges TYPE option<string>;
DEFINE FIELD icon ON compliance_badges TYPE string DEFAULT 'ShieldCheck';
DEFINE FIELD icon_color ON compliance_badges TYPE string DEFAULT 'emerald';

DEFINE FIELD background_color ON compliance_badges TYPE string DEFAULT 'emerald';
DEFINE FIELD text_color ON compliance_badges TYPE string DEFAULT 'white';

-- Affiliation
DEFINE FIELD category ON compliance_badges TYPE string
  ASSERT $value IN ['security', 'privacy', 'quality', 'regulatory', 'industry'];
DEFINE INDEX idx_category ON compliance_badges COLUMNS category;

DEFINE FIELD region ON compliance_badges TYPE array<string> DEFAULT ['global'];
-- Ex: ['EU', 'US', 'global']

-- Lien vers documentation
DEFINE FIELD documentation_url ON compliance_badges TYPE option<string>;
DEFINE FIELD certification_url ON compliance_badges TYPE option<string>;

-- Position et visibilité
DEFINE FIELD display_location ON compliance_badges TYPE array<string> DEFAULT ['home'];
-- ['home', 'footer', 'pricing', 'security_page', 'about']

DEFINE FIELD active ON compliance_badges TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON compliance_badges COLUMNS active;

DEFINE FIELD sort_order ON compliance_badges TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON compliance_badges COLUMNS sort_order;

-- Affichage conditionnel
DEFINE FIELD requires_plan ON compliance_badges TYPE option<string>;
-- Si le badge est spécifique à un plan

DEFINE FIELD is_featured ON compliance_badges TYPE bool DEFAULT false;
DEFINE INDEX idx_featured ON compliance_badges COLUMNS is_featured;

-- Timestamps
DEFINE FIELD created_at ON compliance_badges TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON compliance_badges TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD certified_at ON compliance_badges TYPE option<datetime>;
DEFINE FIELD expires_at ON compliance_badges TYPE option<datetime>;
DEFINE FIELD created_by ON compliance_badges TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON compliance_badges TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: compliance_certifications
-- Certificats et audits
-- ============================================================
DEFINE TABLE compliance_certifications SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD certification_key ON compliance_certifications TYPE string;
DEFINE INDEX uq_certification_key ON compliance_certifications COLUMNS certification_key UNIQUE;

DEFINE FIELD badge_id ON compliance_certifications TYPE record<compliance_badges>;
DEFINE INDEX idx_cert_badge ON compliance_certifications COLUMNS badge_id;

DEFINE FIELD certificate_number ON compliance_certifications TYPE option<string>;
DEFINE FIELD auditor ON compliance_certifications TYPE option<string>;

DEFINE FIELD issued_at ON compliance_certifications TYPE datetime;
DEFINE FIELD expires_at ON compliance_certifications TYPE option<datetime>;
DEFINE FIELD scope ON compliance_certifications TYPE option<string>;

DEFINE FIELD document_url ON compliance_certifications TYPE option<string>;
DEFINE FIELD badge_url ON compliance_certifications TYPE option<string>;

DEFINE FIELD active ON compliance_certifications TYPE bool DEFAULT true;
DEFINE FIELD created_at ON compliance_certifications TYPE datetime DEFAULT time::now() READONLY;

-- ============================================================
-- TABLE: compliance_standards
-- Standards réglementaires additionnels
-- ============================================================
DEFINE TABLE compliance_standards SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD standard_key ON compliance_standards TYPE string;
DEFINE INDEX uq_standard_key ON compliance_standards COLUMNS standard_key UNIQUE;

DEFINE FIELD name ON compliance_standards TYPE string;
DEFINE FIELD name_fr ON compliance_standards TYPE string;
DEFINE FIELD name_en ON compliance_standards TYPE string;

DEFINE FIELD description ON compliance_standards TYPE option<string>;
DEFINE FIELD description_fr ON compliance_standards TYPE option<string>;
DEFINE FIELD description_en ON compliance_standards TYPE option<string>;

DEFINE FIELD category ON compliance_standards TYPE string;
DEFINE FIELD icon ON compliance_standards TYPE option<string>;

DEFINE FIELD active ON compliance_standards TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON compliance_standards TYPE int DEFAULT 0;

-- EVENTS
DEFINE EVENT audit_compliance_badges ON compliance_badges
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'compliance_badges.' + $after.badge_key,
    action: $event,
    new_value: $after.name,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
-- Badges principaux
CREATE compliance_badges CONTENT {
  badge_key: 'badge_gdp',
  name: 'Good Distribution Practice',
  name_fr: 'Bonnes Pratiques de Distribution',
  name_en: 'Good Distribution Practice',
  short_name: 'GDP',
  short_name_fr: 'BPD',
  short_name_en: 'GDP',
  description: 'Certification garantissant la qualité et l\'intégrité des médicaments tout au long de la chaîne d\'approvisionnement.',
  description_fr: 'Certification garantissant la qualité et l\'intégrité des médicaments tout au long de la chaîne d\'approvisionnement.',
  description_en: 'Certification ensuring the quality and integrity of medicines throughout the supply chain.',
  icon: 'ShieldCheck',
  icon_color: 'emerald',
  background_color: 'emerald',
  text_color: 'white',
  category: 'quality',
  region: ['EU', 'global'],
  documentation_url: '/compliance/gdp',
  display_location: ['home', 'footer', 'pricing', 'security_page'],
  certified_at: '2024-01-15T00:00:00Z',
  sort_order: 1,
  active: true,
  is_featured: true
};

CREATE compliance_badges CONTENT {
  badge_key: 'badge_iso27001',
  name: 'ISO/IEC 27001',
  name_fr: 'ISO/IEC 27001',
  name_en: 'ISO/IEC 27001',
  short_name: 'ISO 27001',
  short_name_fr: 'ISO 27001',
  short_name_en: 'ISO 27001',
  description: 'Standard international pour les systèmes de gestion de la sécurité de l\'information.',
  description_fr: 'Standard international pour les systèmes de gestion de la sécurité de l\'information.',
  description_en: 'International standard for information security management systems.',
  icon: 'Lock',
  icon_color: 'blue',
  background_color: 'blue',
  text_color: 'white',
  category: 'security',
  region: ['global'],
  documentation_url: '/compliance/iso27001',
  display_location: ['home', 'footer', 'security_page'],
  certified_at: '2024-03-01T00:00:00Z',
  sort_order: 2,
  active: true,
  is_featured: true
};

CREATE compliance_badges CONTENT {
  badge_key: 'badge_hipaa',
  name: 'HIPAA Compliance',
  name_fr: 'Conformité HIPAA',
  name_en: 'HIPAA Compliance',
  short_name: 'HIPAA',
  short_name_fr: 'HIPAA',
  short_name_en: 'HIPAA',
  description: 'Protection des informations de santé protégées aux États-Unis.',
  description_fr: 'Protection des informations de santé protégées aux États-Unis.',
  description_en: 'Protection of protected health information in the United States.',
  icon: 'Shield',
  icon_color: 'violet',
  background_color: 'violet',
  text_color: 'white',
  category: 'privacy',
  region: ['US'],
  documentation_url: '/compliance/hipaa',
  display_location: ['home', 'footer', 'pricing'],
  certified_at: '2024-02-15T00:00:00Z',
  sort_order: 3,
  active: true,
  is_featured: true
};

CREATE compliance_badges CONTENT {
  badge_key: 'badge_soc2',
  name: 'SOC 2 Type II',
  name_fr: 'SOC 2 Type II',
  name_en: 'SOC 2 Type II',
  short_name: 'SOC 2',
  short_name_fr: 'SOC 2',
  short_name_en: 'SOC 2',
  description: 'Atteste de la sécurité, disponibilité et confidentialité des données.',
  description_fr: 'Atteste de la sécurité, disponibilité et confidentialité des données.',
  description_en: 'Attests to the security, availability, and confidentiality of data.',
  icon: 'CheckCircle',
  icon_color: 'teal',
  background_color: 'teal',
  text_color: 'white',
  category: 'security',
  region: ['global', 'US'],
  documentation_url: '/compliance/soc2',
  display_location: ['home', 'footer', 'security_page'],
  certified_at: '2024-04-01T00:00:00Z',
  sort_order: 4,
  active: true,
  is_featured: true
};

CREATE compliance_badges CONTENT {
  badge_key: 'badge_gdpr',
  name: 'RGPD',
  name_fr: 'Règlement Général sur la Protection des Données',
  name_en: 'General Data Protection Regulation',
  short_name: 'RGPD',
  short_name_fr: 'RGPD',
  short_name_en: 'GDPR',
  description: 'Protection des données personnelles en Europe.',
  description_fr: 'Protection des données personnelles en Europe.',
  description_en: 'Personal data protection in Europe.',
  icon: 'Eye',
  icon_color: 'indigo',
  background_color: 'indigo',
  text_color: 'white',
  category: 'privacy',
  region: ['EU'],
  documentation_url: '/compliance/gdpr',
  display_location: ['home', 'footer', 'privacy'],
  certified_at: '2024-01-01T00:00:00Z',
  sort_order: 5,
  active: true,
  is_featured: true
};

-- Additional standards count
CREATE compliance_standards CONTENT {
  standard_key: 'standard_hds',
  name: 'Hébergement de Données de Santé',
  name_fr: 'Hébergement de Données de Santé',
  name_en: 'Health Data Hosting',
  description: 'Certification française pour l\'hébergement de données de santé.',
  description_fr: 'Certification française pour l\'hébergement de données de santé.',
  description_en: 'French certification for health data hosting.',
  category: 'privacy',
  icon: 'Server',
  sort_order: 1,
  active: true
};

CREATE compliance_standards CONTENT {
  standard_key: 'standard_dsci',
  name: 'DSCI',
  name_fr: 'Directive sur les Dispositifs Médicaux',
  name_en: 'Medical Device Directive',
  description: 'Conformité aux dispositifs médicaux.',
  description_fr: 'Conformité aux dispositifs médicaux.',
  description_en: 'Medical device compliance.',
  category: 'regulatory',
  icon: 'Stethoscope',
  sort_order: 2,
  active: true
};
```

## DTOs

### Input DTOs

```typescript
// create-compliance-badge.dto.ts
export class CreateComplianceBadgeDto {
  badge_key: string;
  name: string;
  name_fr: string;
  name_en: string;
  short_name: string;
  short_name_fr: string;
  short_name_en: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  logo_url?: string;
  icon?: string;
  icon_color?: string;
  background_color?: string;
  text_color?: string;
  category: 'security' | 'privacy' | 'quality' | 'regulatory' | 'industry';
  region?: string[];
  documentation_url?: string;
  certification_url?: string;
  display_location?: string[];
  sort_order?: number;
  is_featured?: boolean;
  certified_at?: Date;
  expires_at?: Date;
  active?: boolean;
}

// update-compliance-badge.dto.ts
export class UpdateComplianceBadgeDto {
  // Tous les champs optionnels
  name?: string;
  name_fr?: string;
  name_en?: string;
  short_name?: string;
  short_name_fr?: string;
  short_name_en?: string;
  description?: string;
  logo_url?: string;
  icon?: string;
  icon_color?: string;
  background_color?: string;
  text_color?: string;
  category?: string;
  region?: string[];
  documentation_url?: string;
  certification_url?: string;
  display_location?: string[];
  sort_order?: number;
  is_featured?: boolean;
  certified_at?: Date;
  expires_at?: Date;
  active?: boolean;
}
```

### Output DTOs

```typescript
// compliance-badge.response.dto.ts
export class ComplianceBadgeResponseDto {
  id: string;
  badge_key: string;
  name: string; // Localisé
  short_name: string; // Localisé
  description?: string; // Localisé
  icon: string;
  icon_color: string;
  background_color: string;
  text_color: string;
  category: string;
  region: string[];
  documentation_url?: string;
  is_featured: boolean;
  certified_at?: Date;
  expires_at?: Date;
  sort_order: number;
}

export class ComplianceBadgeDetailResponseDto extends ComplianceBadgeResponseDto {
  logo_url?: string;
  certification_url?: string;
  display_location: string[];
  created_at: Date;
  updated_at: Date;
}

// Compliance Standards Response
export class ComplianceStandardResponseDto {
  id: string;
  standard_key: string;
  name: string; // Localisé
  description?: string; // Localisé
  category: string;
  icon?: string;
  sort_order: number;
}

// Query DTO
export class QueryComplianceBadgesDto {
  locale?: 'fr' | 'en';
  category?: 'security' | 'privacy' | 'quality' | 'regulatory' | 'industry';
  region?: string;
  display_location?: string;
  featured?: boolean;
  active?: boolean;
  sort?: 'asc' | 'desc';
  limit?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/compliance/badges
Récupérer tous les badges de conformité.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `category` (optional): `security` | `privacy` | `quality` | `regulatory` | `industry`
- `display_location` (optional): `home` | `footer` | `pricing` | `security_page`
- `featured` (optional): `true` | `false`
- `limit` (optional): nombre max (défaut: 10)

**Response 200:**
```json
{
  "data": [
    {
      "id": "compliance_badges:badge_gdp",
      "badge_key": "badge_gdp",
      "name": "Bonnes Pratiques de Distribution",
      "short_name": "BPD",
      "description": "Certification garantissant...",
      "icon": "ShieldCheck",
      "icon_color": "emerald",
      "background_color": "emerald",
      "text_color": "white",
      "category": "quality",
      "is_featured": true,
      "certified_at": "2024-01-15T00:00:00Z",
      "sort_order": 1
    }
  ],
  "total": 5,
  "featured_count": 4
}
```

### GET /api/v1/marketing/compliance/badges/featured
Récupérer les badges mis en avant.

### GET /api/v1/marketing/compliance/badges/by-location/:location
Récupérer les badges pour un emplacement spécifique.

### GET /api/v1/marketing/compliance/badges/:badge_key
Récupérer un badge par clé.

### GET /api/v1/marketing/compliance/standards
Récupérer les standards additionnels.

**Response:**
```json
{
  "data": [
    {
      "id": "compliance_standards:standard_hds",
      "standard_key": "standard_hds",
      "name": "Hébergement de Données de Santé",
      "category": "privacy",
      "icon": "Server"
    }
  ],
  "total": 2
}
```

### GET /api/v1/marketing/compliance/summary
Récupérer un résumé pour affichage sur le hero.

**Response:**
```json
{
  "featured_badges": [...],
  "additional_standards_count": 50,
  "additional_standards_text": "+ 50+ regulatory standards"
}
```

### POST /api/v1/marketing/compliance/badges (Admin only)
Créer un nouveau badge.

### PATCH /api/v1/marketing/compliance/badges/:id (Admin only)
Mettre à jour un badge.

### DELETE /api/v1/marketing/compliance/badges/:id (Admin only)
Supprimer un badge.

### POST /api/v1/marketing/compliance/badges/reorder (Admin only)
Réordonner les badges.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_compliance_badges(
  $locale: string,
  $display_location: option<string>,
  $featured: option<bool>,
  $category: option<string>,
  $limit: option<int>
) {
  LET $query = SELECT * FROM compliance_badges 
    WHERE active = true
    AND ($featured IS NONE OR is_featured = $featured)
    AND ($category IS NONE OR category = $category)
    AND ($display_location IS NONE OR display_location CONTAINS $display_location)
    ORDER BY sort_order ASC
    LIMIT $limit ?? 10;
  
  RETURN FOR $b IN $query RETURN {
    id: $b.id,
    badge_key: $b.badge_key,
    name: IF $locale == 'en' THEN $b.name_en ELSE $b.name_fr,
    short_name: IF $locale == 'en' THEN $b.short_name_en ELSE $b.short_name_fr,
    description: IF $locale == 'en' THEN $b.description_en ELSE $b.description_fr,
    icon: $b.icon,
    icon_color: $b.icon_color,
    background_color: $b.background_color,
    text_color: $b.text_color,
    category: $b.category,
    region: $b.region,
    documentation_url: $b.documentation_url,
    is_featured: $b.is_featured,
    certified_at: $b.certified_at,
    expires_at: $b.expires_at,
    sort_order: $b.sort_order
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::get_compliance_summary($locale: string, $additional_count: option<int>) {
  LET $featured = fn::get_compliance_badges($locale, 'home', true, NONE, 6);
  LET $additional = $additional_count ?? 50;
  LET $text = IF $locale == 'en' 
    THEN '+ ' + string::format('%d', $additional) + '+ regulatory standards'
    ELSE '+ ' + string::format('%d', $additional) + '+ normes réglementaires';
  
  RETURN {
    featured_badges: $featured,
    additional_standards_count: $additional,
    additional_standards_text: $text
  };
};
```

## Mapping vers le composant Frontend

Le composant `ComplianceBadge` existant devra être mis à jour pour utiliser les données dynamiques:

```tsx
// Exemple d'utilisation avec données dynamiques
interface ComplianceBadgeProps {
  type?: string; // Legacy support
  size?: 'sm' | 'md' | 'lg';
  badgeData?: ComplianceBadgeResponseDto; // Nouvelle prop
}

function ComplianceBadge({ type, size = 'sm', badgeData }: ComplianceBadgeProps) {
  // Si badgeData est fourni, utiliser ces données
  // Sinon, fallback sur le type legacy pour rétrocompatibilité
}
```
