# Module: Social Links (Réseaux Sociaux)

## Vue d'ensemble

**Module**: `social_links`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les liens vers les réseaux sociaux et autres plateformes

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: social_links
-- Liens vers les réseaux sociaux
-- ============================================================
DEFINE TABLE social_links SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles;

DEFINE FIELD link_key ON social_links TYPE string;
DEFINE INDEX uq_link_key ON social_links COLUMNS link_key UNIQUE;

DEFINE FIELD platform ON social_links TYPE string
  ASSERT $value IN [
    'facebook', 'twitter', 'instagram', 'linkedin', 
    'youtube', 'tiktok', 'github', 'discord',
    'slack', 'medium', 'blog', 'forum', 'app_store',
    'google_play', 'custom'
  ];
DEFINE INDEX idx_platform ON social_links COLUMNS platform UNIQUE;

DEFINE FIELD label ON social_links TYPE string;
DEFINE FIELD label_fr ON social_links TYPE string;
DEFINE FIELD label_en ON social_links TYPE string;

DEFINE FIELD url ON social_links TYPE string;
DEFINE FIELD icon ON social_links TYPE string DEFAULT 'globe';
DEFINE FIELD icon_library ON social_links TYPE string DEFAULT 'lucide';

-- Configuration d'affichage
DEFINE FIELD display_location ON social_links TYPE array<string> DEFAULT ['footer'];
-- ['footer', 'header', 'contact', 'social_page', 'mobile_app', 'settings']

DEFINE FIELD show_label ON social_links TYPE bool DEFAULT false;
DEFINE FIELD color ON social_links TYPE option<string>;
-- Couleur du réseau social (ex: '#1877F2' pour Facebook)

DEFINE FIELD is_primary ON social_links TYPE bool DEFAULT false;
DEFINE FIELD sort_order ON social_links TYPE int DEFAULT 0;
DEFINE INDEX idx_sort ON social_links COLUMNS sort_order;

DEFINE FIELD active ON social_links TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON social_links COLUMNS active;

-- Métadonnées
DEFINE FIELD follower_count ON social_links TYPE option<int>;
DEFINE FIELD updated_at ON social_links TYPE option<datetime>;

-- Vérification
DEFINE FIELD is_verified ON social_links TYPE bool DEFAULT false;
DEFINE FIELD verified_at ON social_links TYPE option<datetime>;

-- Description pour SEO
DEFINE FIELD description ON social_links TYPE option<string>;
DEFINE FIELD description_fr ON social_links TYPE option<string>;
DEFINE FIELD description_en ON social_links TYPE option<string>;

-- Timestamps
DEFINE FIELD created_at ON social_links TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at_social ON social_links TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD created_by ON social_links TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: social_link_analytics
-- Analytics pour les liens sociaux
-- ============================================================
DEFINE TABLE social_link_analytics SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles
    FOR create WHERE true;

DEFINE FIELD link_id ON social_link_analytics TYPE record<social_links>;
DEFINE INDEX idx_analytics_link ON social_link_analytics COLUMNS link_id;

DEFINE FIELD click_count ON social_link_analytics TYPE int DEFAULT 0;
DEFINE FIELD period ON social_link_analytics TYPE string;
-- Ex: '2024-01' pour mensuel

DEFINE INDEX idx_analytics_period ON social_link_analytics COLUMNS period;

DEFINE FIELD created_at ON social_link_analytics TYPE datetime DEFAULT time::now() READONLY;
```

### Seed Data

```surql
CREATE social_links CONTENT {
  link_key: 'social_linkedin',
  platform: 'linkedin',
  label: 'LinkedIn',
  label_fr: 'LinkedIn',
  label_en: 'LinkedIn',
  url: 'https://linkedin.com/company/syntixpharma',
  icon: 'Linkedin',
  icon_library: 'lucide',
  display_location: ['footer', 'header', 'contact'],
  show_label: false,
  color: '#0A66C2',
  is_primary: true,
  sort_order: 1,
  is_verified: true,
  verified_at: time::now(),
  description: 'Suivez-nous sur LinkedIn pour les dernières actualités',
  description_fr: 'Suivez-nous sur LinkedIn pour les dernières actualités',
  description_en: 'Follow us on LinkedIn for the latest news',
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_twitter',
  platform: 'twitter',
  label: 'Twitter',
  label_fr: 'Twitter / X',
  label_en: 'Twitter / X',
  url: 'https://twitter.com/syntixpharma',
  icon: 'Twitter',
  icon_library: 'lucide',
  display_location: ['footer', 'header', 'contact'],
  show_label: false,
  color: '#1DA1F2',
  is_primary: false,
  sort_order: 2,
  is_verified: true,
  verified_at: time::now(),
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_facebook',
  platform: 'facebook',
  label: 'Facebook',
  label_fr: 'Facebook',
  label_en: 'Facebook',
  url: 'https://facebook.com/syntixpharma',
  icon: 'Facebook',
  icon_library: 'lucide',
  display_location: ['footer'],
  show_label: false,
  color: '#1877F2',
  sort_order: 3,
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_instagram',
  platform: 'instagram',
  label: 'Instagram',
  label_fr: 'Instagram',
  label_en: 'Instagram',
  url: 'https://instagram.com/syntixpharma',
  icon: 'Instagram',
  icon_library: 'lucide',
  display_location: ['footer', 'header', 'social_page'],
  show_label: false,
  color: '#E4405F',
  is_primary: true,
  sort_order: 4,
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_youtube',
  platform: 'youtube',
  label: 'YouTube',
  label_fr: 'YouTube',
  label_en: 'YouTube',
  url: 'https://youtube.com/@syntixpharma',
  icon: 'Youtube',
  icon_library: 'lucide',
  display_location: ['footer', 'social_page'],
  show_label: false,
  color: '#FF0000',
  sort_order: 5,
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_github',
  platform: 'github',
  label: 'GitHub',
  label_fr: 'GitHub',
  label_en: 'GitHub',
  url: 'https://github.com/syntixpharma',
  icon: 'Github',
  icon_library: 'lucide',
  display_location: ['footer', 'social_page'],
  show_label: false,
  color: '#181717',
  sort_order: 6,
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_tiktok',
  platform: 'tiktok',
  label: 'TikTok',
  label_fr: 'TikTok',
  label_en: 'TikTok',
  url: 'https://tiktok.com/@syntixpharma',
  icon: 'Video',
  icon_library: 'lucide',
  display_location: ['footer', 'social_page'],
  show_label: false,
  color: '#000000',
  is_primary: true,
  sort_order: 7,
  active: true
};

-- Blog / Resources
CREATE social_links CONTENT {
  link_key: 'social_blog',
  platform: 'blog',
  label: 'Blog',
  label_fr: 'Blog',
  label_en: 'Blog',
  url: 'https://blog.syntixpharma.com',
  icon: 'FileText',
  icon_library: 'lucide',
  display_location: ['footer', 'header'],
  show_label: true,
  sort_order: 10,
  active: true
};

-- App Stores
CREATE social_links CONTENT {
  link_key: 'social_appstore',
  platform: 'app_store',
  label: 'App Store',
  label_fr: 'App Store',
  label_en: 'App Store',
  url: 'https://apps.apple.com/app/syntixpharma',
  icon: 'Apple',
  icon_library: 'lucide',
  display_location: ['footer', 'settings'],
  show_label: true,
  sort_order: 20,
  active: true
};

CREATE social_links CONTENT {
  link_key: 'social_googleplay',
  platform: 'google_play',
  label: 'Google Play',
  label_fr: 'Google Play',
  label_en: 'Google Play',
  url: 'https://play.google.com/store/apps/details?id=com.syntixpharma',
  icon: 'Play',
  icon_library: 'lucide',
  display_location: ['footer', 'settings'],
  show_label: true,
  sort_order: 21,
  active: true
};
```

## DTOs

### Input DTOs

```typescript
// create-social-link.dto.ts
export class CreateSocialLinkDto {
  link_key: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 
            'tiktok' | 'github' | 'discord' | 'slack' | 'medium' | 
            'blog' | 'forum' | 'app_store' | 'google_play' | 'custom';
  label: string;
  label_fr: string;
  label_en: string;
  url: string;
  icon?: string;
  icon_library?: string;
  display_location?: string[];
  show_label?: boolean;
  color?: string;
  is_primary?: boolean;
  sort_order?: number;
  description?: string;
  description_fr?: string;
  description_en?: string;
  follower_count?: number;
  is_verified?: boolean;
}

// update-social-link.dto.ts
export class UpdateSocialLinkDto {
  label?: string;
  label_fr?: string;
  label_en?: string;
  url?: string;
  icon?: string;
  display_location?: string[];
  show_label?: boolean;
  color?: string;
  is_primary?: boolean;
  sort_order?: number;
  description?: string;
  description_fr?: string;
  description_en?: string;
  follower_count?: number;
  is_verified?: boolean;
  active?: boolean;
}
```

### Output DTOs

```typescript
// social-link.response.dto.ts
export class SocialLinkResponseDto {
  link_key: string;
  platform: string;
  label: string; // Localisé
  url: string;
  icon: string;
  icon_library: string;
  display_location: string[];
  show_label: boolean;
  color?: string;
  is_primary: boolean;
  is_verified: boolean;
  sort_order: number;
  description?: string; // Localisé
  follower_count?: number;
  updated_at?: Date;
}

export class SocialLinkSummaryDto {
  link_key: string;
  platform: string;
  url: string;
  icon: string;
  color?: string;
}

export class SocialLinksGroupedDto {
  primary: SocialLinkResponseDto[];
  secondary: SocialLinkResponseDto[];
  app_stores: SocialLinkResponseDto[];
}
```

## Endpoints API

### GET /api/v1/marketing/social-links
Récupérer tous les liens sociaux actifs.

**Query Parameters:**
- `locale` (optional): `fr` | `en`
- `location` (optional): `footer` | `header` | `contact` | `social_page`
- `primary_only` (optional): `true` | `false`

**Response 200:**
```json
{
  "data": [
    {
      "link_key": "social_linkedin",
      "platform": "linkedin",
      "label": "LinkedIn",
      "url": "https://linkedin.com/company/syntixpharma",
      "icon": "Linkedin",
      "color": "#0A66C2",
      "is_primary": true,
      "is_verified": true,
      "sort_order": 1
    }
  ],
  "grouped": {
    "primary": [...],
    "secondary": [...],
    "app_stores": [...]
  }
}
```

### GET /api/v1/marketing/social-links/by-location/:location
Récupérer les liens pour un emplacement spécifique.

**Example:** `/api/v1/marketing/social-links/by-location/footer`

**Response 200:**
```json
{
  "location": "footer",
  "links": [
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/company/syntixpharma",
      "icon": "Linkedin",
      "color": "#0A66C2"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/syntixpharma",
      "icon": "Twitter",
      "color": "#1DA1F2"
    }
  ]
}
```

### GET /api/v1/marketing/social-links/:link_key
Récupérer un lien par clé.

### GET /api/v1/marketing/social-links/all (Admin)
Récupérer tous les liens (y compris inactifs).

### POST /api/v1/admin/social-links (Admin)
Créer un nouveau lien social.

**Body:**
```json
{
  "link_key": "social_mastodon",
  "platform": "custom",
  "label_fr": "Mastodon",
  "label_en": "Mastodon",
  "url": "https://mastodon.social/@syntixpharma",
  "icon": "Radio",
  "color": "#6364FF",
  "display_location": ["footer"],
  "sort_order": 8
}
```

### PATCH /api/v1/admin/social-links/:link_key (Admin)
Mettre à jour un lien social.

### DELETE /api/v1/admin/social-links/:link_key (Admin)
Supprimer un lien social (soft delete - set active = false).

### POST /api/v1/admin/social-links/reorder (Admin)
Réordonner les liens.

**Body:**
```json
{
  "order": [
    { "link_key": "social_linkedin", "sort_order": 1 },
    { "link_key": "social_twitter", "sort_order": 2 },
    { "link_key": "social_instagram", "sort_order": 3 }
  ]
}
```

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_social_links(
  $locale: string,
  $location: option<string>,
  $primary_only: option<bool>
) {
  LET $query = SELECT * FROM social_links 
    WHERE active = true
    AND ($location IS NONE OR display_location CONTAINS $location)
    AND ($primary_only IS NONE OR is_primary = $primary_only)
    ORDER BY sort_order ASC;
  
  RETURN FOR $link IN $query RETURN {
    link_key: $link.link_key,
    platform: $link.platform,
    label: IF $locale == 'en' THEN $link.label_en ELSE $link.label_fr,
    url: $link.url,
    icon: $link.icon,
    icon_library: $link.icon_library,
    display_location: $link.display_location,
    show_label: $link.show_label,
    color: $link.color,
    is_primary: $link.is_primary,
    is_verified: $link.is_verified,
    sort_order: $link.sort_order,
    description: IF $locale == 'en' THEN $link.description_en ELSE $link.description_fr,
    follower_count: $link.follower_count,
    updated_at: $link.updated_at_social
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::get_social_links_grouped($locale: string) {
  LET $links = fn::get_social_links($locale, NONE, NONE);
  
  LET $primary = (SELECT * FROM $links WHERE is_primary = true);
  LET $secondary = (SELECT * FROM $links WHERE is_primary = false AND platform NOT IN ['app_store', 'google_play']);
  LET $app_stores = (SELECT * FROM $links WHERE platform IN ['app_store', 'google_play']);
  
  RETURN {
    primary: $primary,
    secondary: $secondary,
    app_stores: $app_stores
  };
};
```

## Mapping des plateformes

```typescript
const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'Linkedin',
  youtube: 'Youtube',
  tiktok: 'Video',
  github: 'Github',
  discord: 'MessageCircle',
  slack: 'Hash',
  medium: 'BookOpen',
  blog: 'FileText',
  forum: 'Users',
  app_store: 'Apple',
  google_play: 'Play',
  custom: 'Globe'
};

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
  github: '#181717',
  discord: '#5865F2',
  slack: '#4A154B',
  medium: '#00AB6C',
};
```
