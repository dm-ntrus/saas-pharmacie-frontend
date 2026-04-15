# Module: Value Strip (Bandeau de Valeurs)

## Vue d'ensemble

**Module**: `value_strip`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement le bandeau de valeurs affiché sous les stats pharma

## Analyse des éléments statiques actuels

### Éléments à remplacer (ValueStrip.tsx):
```tsx
// Ligne 6 - Clés des valeurs
const VALUE_KEYS = ["n1", "n2", "n3"] as const;

// Contenu chargé depuis i18n via:
// t('valueStripAria')
// t('valueStrip.n1.title')
// t('valueStrip.n1.text')
// t('valueStrip.n2.title')
// t('valueStrip.n2.text')
// t('valueStrip.n3.title')
// t('valueStrip.n3.text')
```

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: value_strip_items
-- Éléments du bandeau de valeurs
-- ============================================================
DEFINE TABLE value_strip_items SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

-- Identification
DEFINE FIELD item_key ON value_strip_items TYPE string
  ASSERT string::len($value) >= 1;
DEFINE INDEX uq_item_key ON value_strip_items COLUMNS item_key UNIQUE;

-- Contenu localisé
DEFINE FIELD title ON value_strip_items TYPE string;
DEFINE FIELD title_fr ON value_strip_items TYPE string;
DEFINE FIELD title_en ON value_strip_items TYPE string;

DEFINE FIELD text ON value_strip_items TYPE string;
DEFINE FIELD text_fr ON value_strip_items TYPE string;
DEFINE FIELD text_en ON value_strip_items TYPE string;

-- Visuel
DEFINE FIELD icon ON value_strip_items TYPE option<string>;
DEFINE FIELD icon_library ON value_strip_items TYPE string DEFAULT 'lucide';

-- Configuration
DEFINE FIELD active ON value_strip_items TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON value_strip_items TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON value_strip_items COLUMNS sort_order;

-- Timestamps
DEFINE FIELD created_at ON value_strip_items TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON value_strip_items TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON value_strip_items TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON value_strip_items TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: value_strip_config
-- Configuration du bandeau
-- ============================================================
DEFINE TABLE value_strip_config SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD config_key ON value_strip_config TYPE string DEFAULT 'main';
DEFINE INDEX uq_config_key ON value_strip_config COLUMNS config_key UNIQUE;

DEFINE FIELD aria_label ON value_strip_config TYPE string;
DEFINE FIELD aria_label_fr ON value_strip_config TYPE string;
DEFINE FIELD aria_label_en ON value_strip_config TYPE string;

DEFINE FIELD title ON value_strip_config TYPE string;
DEFINE FIELD title_fr ON value_strip_config TYPE string;
DEFINE FIELD title_en ON value_strip_config TYPE string;

DEFINE FIELD layout ON value_strip_config TYPE string DEFAULT 'horizontal'
  ASSERT $value IN ['horizontal', 'vertical', 'grid'];

DEFINE FIELD background_color ON value_strip_config TYPE string DEFAULT 'slate-50';
DEFINE FIELD border_color ON value_strip_config TYPE string DEFAULT 'slate-100';

DEFINE FIELD active ON value_strip_config TYPE bool DEFAULT true;
DEFINE FIELD created_at ON value_strip_config TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON value_strip_config TYPE datetime VALUE time::now() READONLY;

-- EVENTS
DEFINE EVENT audit_value_strip ON value_strip_items
WHEN $event IN ['CREATE', 'UPDATE', 'DELETE']
THEN {
  CREATE platform_config_audit_logs CONTENT {
    config_key: 'value_strip.' + $after.item_key,
    action: $event,
    new_value: $after.title,
    performed_by: $auth.id ?? 'system'
  };
};
```

### Seed Data

```surql
-- Configuration principale
CREATE value_strip_config CONTENT {
  config_key: 'main',
  aria_label: 'Nos engagements',
  aria_label_fr: 'Nos engagements',
  aria_label_en: 'Our commitments',
  title: 'Pourquoi SyntixPharma',
  title_fr: 'Pourquoi SyntixPharma',
  title_en: 'Why SyntixPharma',
  layout: 'horizontal',
  background_color: 'slate-50',
  border_color: 'slate-100',
  active: true
};

-- Items
CREATE value_strip_items CONTENT {
  item_key: 'value_1',
  title: 'Setup en 24h',
  title_fr: 'Setup en 24h',
  title_en: 'Setup in 24h',
  text: 'Commencez à utiliser SyntixPharma dès demain avec notre configuration rapide.',
  text_fr: 'Commencez à utiliser SyntixPharma dès demain avec notre configuration rapide.',
  text_en: 'Start using SyntixPharma tomorrow with our quick setup.',
  icon: 'Zap',
  sort_order: 1,
  active: true
};

CREATE value_strip_items CONTENT {
  item_key: 'value_2',
  title: 'Support 24/7',
  title_fr: 'Support 24/7',
  title_en: '24/7 Support',
  text: 'Notre équipe est disponible à tout moment pour vous accompagner.',
  text_fr: 'Notre équipe est disponible à tout moment pour vous accompagner.',
  text_en: 'Our team is available anytime to support you.',
  icon: 'Headphones',
  sort_order: 2,
  active: true
};

CREATE value_strip_items CONTENT {
  item_key: 'value_3',
  title: 'Conforme GDP',
  title_fr: 'Conforme GDP',
  title_en: 'GDP Compliant',
  text: 'Certifié Good Distribution Practice pour la sécurité de vos médicaments.',
  text_fr: 'Certifié Good Distribution Practice pour la sécurité de vos médicaments.',
  text_en: 'Good Distribution Practice certified for your medicine safety.',
  icon: 'Shield',
  sort_order: 3,
  active: true
};
```

## DTOs

```typescript
// create-value-strip-item.dto.ts
export class CreateValueStripItemDto {
  item_key: string;
  title: string;
  title_fr: string;
  title_en: string;
  text: string;
  text_fr: string;
  text_en: string;
  icon?: string;
  icon_library?: string;
  sort_order?: number;
  active?: boolean;
}

// value-strip-item.response.dto.ts
export class ValueStripItemResponseDto {
  id: string;
  item_key: string;
  title: string; // Localisé
  text: string; // Localisé
  icon?: string;
  sort_order: number;
}

export class ValueStripConfigResponseDto {
  aria_label: string; // Localisé
  layout: string;
  background_color: string;
  border_color: string;
  items: ValueStripItemResponseDto[];
}
```

## Endpoints API

### GET /api/v1/marketing/value-strip
Récupérer le bandeau complet.

**Query Parameters:**
- `locale` (optional): `fr` | `en` (défaut: `fr`)
- `config_key` (optional): Clé de config (défaut: `main`)

**Response 200:**
```json
{
  "config": {
    "aria_label": "Nos engagements",
    "layout": "horizontal",
    "background_color": "slate-50",
    "border_color": "slate-100"
  },
  "items": [
    {
      "id": "value_strip_items:value_1",
      "item_key": "value_1",
      "title": "Setup en 24h",
      "text": "Commencez à utiliser SyntixPharma dès demain...",
      "icon": "Zap",
      "sort_order": 1
    }
  ]
}
```

### POST|PATCH|DELETE /api/v1/marketing/value-strip/items/:id (Admin only)
Gérer les items.

### PATCH /api/v1/marketing/value-strip/config/:config_key (Admin only)
Modifier la configuration.

### POST /api/v1/marketing/value-strip/reorder (Admin only)
Réordonner les items.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_value_strip($locale: string, $config_key: string) {
  LET $config = (SELECT * FROM value_strip_config WHERE config_key = $config_key AND active = true)[0];
  LET $items = SELECT * FROM value_strip_items 
    WHERE active = true 
    ORDER BY sort_order ASC;
  
  RETURN {
    config: {
      aria_label: IF $locale == 'en' THEN $config.aria_label_en ELSE $config.aria_label_fr,
      layout: $config.layout,
      background_color: $config.background_color,
      border_color: $config.border_color
    },
    items: (FOR $item IN $items RETURN {
      id: $item.id,
      item_key: $item.item_key,
      title: IF $locale == 'en' THEN $item.title_en ELSE $item.title_fr,
      text: IF $locale == 'en' THEN $item.text_en ELSE $item.text_fr,
      icon: $item.icon,
      sort_order: $item.sort_order
    })
  };
};
```
