# Module: Marketing Stats (Statistiques Marketing)

## Vue d'ensemble

**Module**: `marketing-stats`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les statistiques affichées sur la page d'accueil (hero stats, pharma stats, capabilities)

## Analyse des éléments statiques actuels

### Éléments à remplacer (page.tsx):
```tsx
// Ligne 70-75 - STATS hero
const STATS = [
  { value: "500+", label: t("statsPharmacies"), icon: Package },
  { value: "1M+", label: t("statsTransactions"), icon: CreditCard },
  { value: "99.9%", label: t("statsUptime"), icon: ShieldCheck },
  { value: "24/7", label: t("statsSupport"), icon: Activity },
];

// Ligne 77-82 - PHARMA_STATS
const PHARMA_STATS = [
  { value: "2.5M+", label: t("statsMedicines"), icon: Pill, color: "emerald" },
  { value: "850K+", label: t("statsPrescriptions"), icon: FileText, color: "teal" },
  { value: "12K+", label: t("statsAlerts"), icon: AlertTriangle, color: "amber" },
  { value: "100%", label: t("statsCompliance"), icon: Shield, color: "cyan" },
];

// Ligne 84-127 - CAPABILITIES
const CAPABILITIES = [
  { icon: Package, title: t("capInventory"), desc: t("capInventoryDesc"), ... },
  { icon: Users, title: t("capPatients"), desc: t("capPatientsDesc"), ... },
  // ... 6 capacités
];
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: marketing_stats
-- Statistiques dynamiques pour la page d'accueil
-- ============================================================
DEFINE TABLE marketing_stats SCHEMAFULL
  PERMISSIONS
    FOR select WHERE true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD stat_key ON marketing_stats TYPE string 
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_stat_key ON marketing_stats COLUMNS stat_key UNIQUE;

DEFINE FIELD stat_category ON marketing_stats TYPE string 
  ASSERT $value IN ['hero', 'pharma', 'capability'];
DEFINE INDEX idx_category ON marketing_stats COLUMNS stat_category;

DEFINE FIELD value ON marketing_stats TYPE string;
DEFINE FIELD label_key ON marketing_stats TYPE string;
DEFINE FIELD label_fr ON marketing_stats TYPE string;
DEFINE FIELD label_en ON marketing_stats TYPE string;

DEFINE FIELD icon ON marketing_stats TYPE string;
DEFINE FIELD color ON marketing_stats TYPE option<string>;
DEFINE FIELD sort_order ON marketing_stats TYPE int DEFAULT 0;

DEFINE FIELD active ON marketing_stats TYPE bool DEFAULT true;

DEFINE FIELD metadata ON marketing_stats TYPE object DEFAULT {
  prefix: '',
  suffix: '',
  description_key: '',
  description_fr: '',
  description_en: '',
};

DEFINE FIELD created_at ON marketing_stats TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON marketing_stats TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON marketing_stats TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON marketing_stats TYPE option<record<platform_admins>>;

-- EVENTS
DEFINE EVENT audit_marketing_stats ON marketing_stats
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'marketing_stats.' + $after.stat_key,
    action: $event,
    old_value: $before.value,
    new_value: $after.value,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
-- Hero Stats
CREATE marketing_stats CONTENT {
  stat_key: 'hero_pharmacies',
  stat_category: 'hero',
  value: '500+',
  label_key: 'statsPharmacies',
  label_fr: 'Pharmacies',
  label_en: 'Pharmacies',
  icon: 'Package',
  sort_order: 1,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'hero_transactions',
  stat_category: 'hero',
  value: '1M+',
  label_key: 'statsTransactions',
  label_fr: 'Transactions',
  label_en: 'Transactions',
  icon: 'CreditCard',
  sort_order: 2,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'hero_uptime',
  stat_category: 'hero',
  value: '99.9%',
  label_key: 'statsUptime',
  label_fr: 'Disponibilité',
  label_en: 'Uptime',
  icon: 'ShieldCheck',
  sort_order: 3,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'hero_support',
  stat_category: 'hero',
  value: '24/7',
  label_key: 'statsSupport',
  label_fr: 'Support',
  label_en: 'Support',
  icon: 'Activity',
  sort_order: 4,
  active: true
};

-- Pharma Stats
CREATE marketing_stats CONTENT {
  stat_key: 'pharma_medicines',
  stat_category: 'pharma',
  value: '2.5M+',
  label_key: 'statsMedicines',
  label_fr: 'Médicaments traçés',
  label_en: 'Medicines tracked',
  icon: 'Pill',
  color: 'emerald',
  sort_order: 1,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'pharma_prescriptions',
  stat_category: 'pharma',
  value: '850K+',
  label_key: 'statsPrescriptions',
  label_fr: 'Ordonnances traitées',
  label_en: 'Prescriptions processed',
  icon: 'FileText',
  color: 'teal',
  sort_order: 2,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'pharma_alerts',
  stat_category: 'pharma',
  value: '12K+',
  label_key: 'statsAlerts',
  label_fr: 'Alertes envoyées',
  label_en: 'Stock alerts sent',
  icon: 'AlertTriangle',
  color: 'amber',
  sort_order: 3,
  active: true
};

CREATE marketing_stats CONTENT {
  stat_key: 'pharma_compliance',
  stat_category: 'pharma',
  value: '100%',
  label_key: 'statsCompliance',
  label_fr: 'Conformité réglementaire',
  label_en: 'Regulatory compliance',
  icon: 'Shield',
  color: 'cyan',
  sort_order: 4,
  active: true
};
```

## DTOs

### Input DTOs

```typescript
// create-marketing-stat.dto.ts
export class CreateMarketingStatDto {
  stat_key: string;
  stat_category: 'hero' | 'pharma' | 'capability';
  value: string;
  label_key: string;
  label_fr: string;
  label_en: string;
  icon: string;
  color?: string;
  sort_order?: number;
  active?: boolean;
  metadata?: {
    prefix?: string;
    suffix?: string;
    description_key?: string;
    description_fr?: string;
    description_en?: string;
  };
}

// update-marketing-stat.dto.ts
export class UpdateMarketingStatDto {
  value?: string;
  label_key?: string;
  label_fr?: string;
  label_en?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  active?: boolean;
  metadata?: {
    prefix?: string;
    suffix?: string;
    description_key?: string;
    description_fr?: string;
    description_en?: string;
  };
}
```

### Output DTOs

```typescript
// marketing-stat.response.dto.ts
export class MarketingStatResponseDto {
  id: string;
  stat_key: string;
  stat_category: string;
  value: string;
  label_key: string;
  label: string; // Localisé
  icon: string;
  color?: string;
  sort_order: number;
  active: boolean;
  metadata: {
    prefix?: string;
    suffix?: string;
    description?: string; // Localisé
  };
  created_at: Date;
  updated_at: Date;
}

// Query DTO
export class QueryMarketingStatsDto {
  category?: 'hero' | 'pharma' | 'capability';
  active?: boolean;
  sort?: 'asc' | 'desc';
  limit?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/stats
Récupérer les statistiques marketing.

**Query Parameters:**
- `category` (optional): `hero` | `pharma` | `capability`
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `active` (optional): `true` | `false`

**Response 200:**
```json
{
  "data": [
    {
      "id": "marketing_stats:hero_pharmacies",
      "stat_key": "hero_pharmacies",
      "stat_category": "hero",
      "value": "500+",
      "label_key": "statsPharmacies",
      "label": "Pharmacies",
      "icon": "Package",
      "sort_order": 1,
      "active": true
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 50
}
```

### GET /api/v1/marketing/stats/hero
Récupérer les stats du hero.

### GET /api/v1/marketing/stats/pharma
Récupérer les stats pharma.

### GET /api/v1/marketing/stats/:stat_key
Récupérer une statistique par clé.

### POST /api/v1/marketing/stats (Admin only)
Créer une nouvelle statistique.

**Body:**
```json
{
  "stat_key": "hero_new_stat",
  "stat_category": "hero",
  "value": "1000+",
  "label_key": "statsNew",
  "label_fr": "Nouveaux clients",
  "label_en": "New clients",
  "icon": "Users",
  "sort_order": 5
}
```

### PATCH /api/v1/marketing/stats/:id (Admin only)
Mettre à jour une statistique.

### DELETE /api/v1/marketing/stats/:id (Admin only)
Supprimer une statistique.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_marketing_stats($category: option<string>, $locale: string) {
  LET $filter = IF $category IS NONE THEN {} ELSE { stat_category: $category };
  LET $stats = (SELECT * FROM marketing_stats WHERE active = true AND $filter ORDER BY sort_order ASC);
  FOR $stat IN $stats {
    LET $label = IF $locale == 'en' THEN $stat.label_en ELSE $stat.label_fr;
    RETURN {
      id: $stat.id,
      stat_key: $stat.stat_key,
      stat_category: $stat.stat_category,
      value: $stat.value,
      label: $label,
      icon: $stat.icon,
      color: $stat.color,
      metadata: $stat.metadata
    };
  };
};
```
