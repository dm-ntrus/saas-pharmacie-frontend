# Module: Footer (Pied de Page)

## Vue d'ensemble

**Module**: `footer`
**Type**: Structure hiérarchique pour le footer
**Objectif**: Gérer dynamiquement toutes les sections et liens du pied de page

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: footer_columns
-- Colonnes du pied de page
-- ============================================================
DEFINE TABLE footer_columns SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles;

DEFINE FIELD column_key ON footer_columns TYPE string;
DEFINE INDEX uq_column_key ON footer_columns COLUMNS column_key UNIQUE;

DEFINE FIELD title ON footer_columns TYPE string;
DEFINE FIELD title_fr ON footer_columns TYPE string;
DEFINE FIELD title_en ON footer_columns TYPE string;

DEFINE FIELD column_type ON footer_columns TYPE string DEFAULT 'links'
  ASSERT $value IN ['links', 'newsletter', 'social', 'contact', 'legal', 'custom'];

DEFINE FIELD icon ON footer_columns TYPE option<string>;
DEFINE FIELD icon_library ON footer_columns TYPE option<string>;

-- Configuration
DEFINE FIELD is_visible ON footer_columns TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON footer_columns TYPE int DEFAULT 0;
DEFINE INDEX idx_column_sort ON footer_columns COLUMNS sort_order;

-- Pour colonnes custom
DEFINE FIELD content ON footer_columns TYPE option<string>;
DEFINE FIELD content_fr ON footer_columns TYPE option<string>;
DEFINE FIELD content_en ON footer_columns TYPE option<string>;

-- Pour newsletter
DEFINE FIELD newsletter_placeholder ON footer_columns TYPE option<string>;
DEFINE FIELD newsletter_placeholder_fr ON footer_columns TYPE option<string>;
DEFINE FIELD newsletter_placeholder_en ON footer_columns TYPE option<string>;
DEFINE FIELD newsletter_success_message ON footer_columns TYPE option<string>;
DEFINE FIELD newsletter_success_message_fr ON footer_columns TYPE option<string>;
DEFINE FIELD newsletter_success_message_en ON footer_columns TYPE option<string>;

DEFINE FIELD active ON footer_columns TYPE bool DEFAULT true;
DEFINE FIELD created_at ON footer_columns TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON footer_columns TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: footer_links
-- Liens du pied de page
-- ============================================================
DEFINE TABLE footer_links SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles;

DEFINE FIELD link_key ON footer_links TYPE string;
DEFINE INDEX uq_link_key ON footer_links COLUMNS link_key UNIQUE;

DEFINE FIELD column_id ON footer_links TYPE record<footer_columns>;
DEFINE INDEX idx_link_column ON footer_links COLUMNS column_id;

DEFINE FIELD title ON footer_links TYPE string;
DEFINE FIELD title_fr ON footer_links TYPE string;
DEFINE FIELD title_en ON footer_links TYPE string;

DEFINE FIELD url ON footer_links TYPE string;
DEFINE FIELD url_type ON footer_links TYPE string DEFAULT 'internal'
  ASSERT $value IN ['internal', 'external', 'anchor', 'legal'];

DEFINE FIELD icon ON footer_links TYPE option<string>;
DEFINE FIELD icon_library ON footer_links TYPE option<string>;

DEFINE FIELD badge ON footer_links TYPE option<string>;
-- Ex: 'new', 'beta', 'pro'

DEFINE FIELD badge_color ON footer_links TYPE option<string>;

DEFINE FIELD target ON footer_links TYPE string DEFAULT '_self'
  ASSERT $value IN ['_self', '_blank', '_parent', '_top'];

DEFINE FIELD rel ON footer_links TYPE string DEFAULT 'noopener noreferrer';
-- Pour liens externes: 'noopener noreferrer'

-- Visibilité
DEFINE FIELD is_visible ON footer_links TYPE bool DEFAULT true;
DEFINE FIELD requires_auth ON footer_links TYPE bool DEFAULT false;
DEFINE FIELD applicable_plans ON footer_links TYPE array<string> DEFAULT [];
-- Si non vide, le lien n'est visible que pour ces plans

DEFINE FIELD sort_order ON footer_links TYPE int DEFAULT 0;
DEFINE INDEX idx_link_sort ON footer_links COLUMNS sort_order;

DEFINE FIELD active ON footer_links TYPE bool DEFAULT true;
DEFINE INDEX idx_link_active ON footer_links COLUMNS active;

-- Timestamps
DEFINE FIELD created_at ON footer_links TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON footer_links TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON footer_links TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: footer_company_info
-- Informations de l'entreprise dans le footer
-- ============================================================
DEFINE TABLE footer_company_info SCHEMAFULL
  PERMISSIONS
    FOR select WHERE true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD info_key ON footer_company_info TYPE string DEFAULT 'main';
DEFINE INDEX uq_info_key ON footer_company_info COLUMNS info_key UNIQUE;

-- Logo
DEFINE FIELD logo_url ON footer_company_info TYPE option<string>;
DEFINE FIELD logo_dark_url ON footer_company_info TYPE option<string>;
DEFINE FIELD logo_width ON footer_company_info TYPE int DEFAULT 120;

-- Description
DEFINE FIELD description ON footer_company_info TYPE option<string>;
DEFINE FIELD description_fr ON footer_company_info TYPE option<string>;
DEFINE FIELD description_en ON footer_company_info TYPE option<string>;

-- Tagline
DEFINE FIELD tagline ON footer_company_info TYPE option<string>;
DEFINE FIELD tagline_fr ON footer_company_info TYPE option<string>;
DEFINE FIELD tagline_en ON footer_company_info TYPE option<string>;

-- Copyright
DEFINE FIELD copyright_text ON footer_company_info TYPE option<string>;
DEFINE FIELD copyright_text_fr ON footer_company_info TYPE option<string>;
DEFINE FIELD copyright_text_en ON footer_company_info TYPE option<string>;

-- Année de création
DEFINE FIELD founded_year ON footer_company_info TYPE option<int>;

-- Patch Level
DEFINE FIELD bottom_text ON footer_company_info TYPE option<string>;
DEFINE FIELD bottom_text_fr ON footer_company_info TYPE option<string>;
DEFINE FIELD bottom_text_en ON footer_company_info TYPE option<string>;

-- Configuration
DEFINE FIELD layout_style ON footer_company_info TYPE string DEFAULT 'default'
  ASSERT $value IN ['default', 'minimal', 'extended', 'centered'];

DEFINE FIELD show_social_links ON footer_company_info TYPE bool DEFAULT true;
DEFINE FIELD show_newsletter ON footer_company_info TYPE bool DEFAULT true;

DEFINE FIELD active ON footer_company_info TYPE bool DEFAULT true;
DEFINE FIELD created_at ON footer_company_info TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON footer_company_info TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: footer_newsletter_subscribers
-- Abonnés à la newsletter
-- ============================================================
DEFINE TABLE footer_newsletter_subscribers SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles
    FOR create WHERE true
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles;

DEFINE FIELD subscriber_key ON footer_newsletter_subscribers TYPE string
  VALUE string::lowercase(geom::uuid());

DEFINE FIELD email ON footer_newsletter_subscribers TYPE string ASSERT string::is::email($value);
DEFINE INDEX idx_subscriber_email ON footer_newsletter_subscribers COLUMNS email UNIQUE;

DEFINE FIELD first_name ON footer_newsletter_subscribers TYPE option<string>;
DEFINE FIELD locale ON footer_newsletter_subscribers TYPE string DEFAULT 'fr';

DEFINE FIELD status ON footer_newsletter_subscribers TYPE string DEFAULT 'active'
  ASSERT $value IN ['active', 'unsubscribed', 'bounced', 'pending'];
DEFINE INDEX idx_subscriber_status ON footer_newsletter_subscribers COLUMNS status;

DEFINE FIELD source ON footer_newsletter_subscribers TYPE string DEFAULT 'footer';

DEFINE FIELD consent_given ON footer_newsletter_subscribers TYPE bool DEFAULT true;
DEFINE FIELD consent_timestamp ON footer_newsletter_subscribers TYPE datetime DEFAULT time::now();

DEFINE FIELD unsubscribed_at ON footer_newsletter_subscribers TYPE option<datetime>;
DEFINE FIELD bounce_reason ON footer_newsletter_subscribers TYPE option<string>;

DEFINE FIELD tags ON footer_newsletter_subscribers TYPE array<string> DEFAULT [];

DEFINE FIELD created_at ON footer_newsletter_subscribers TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON footer_newsletter_subscribers TYPE datetime VALUE time::now() READONLY;
```

### Seed Data

```surql
-- Informations de l'entreprise
CREATE footer_company_info CONTENT {
  info_key: 'main',
  logo_url: '/images/logo-white.svg',
  logo_dark_url: '/images/logo-dark.svg',
  logo_width: 140,
  description: 'SyntixPharma est la plateforme SaaS de référence pour la gestion des pharmacies et établissements de santé.',
  description_fr: 'SyntixPharma est la plateforme SaaS de référence pour la gestion des pharmacies et établissements de santé.',
  description_en: 'SyntixPharma is the leading SaaS platform for pharmacy and healthcare management.',
  tagline: 'Simplifiez votre gestion pharma',
  tagline_fr: 'Simplifiez votre gestion pharma',
  tagline_en: 'Simplify your pharma management',
  copyright_text: '© 2024 SyntixPharma. Tous droits réservés.',
  copyright_text_fr: '© 2024 SyntixPharma. Tous droits réservés.',
  copyright_text_en: '© 2024 SyntixPharma. All rights reserved.',
  founded_year: 2021,
  layout_style: 'default',
  show_social_links: true,
  show_newsletter: true,
  active: true
};

-- Colonnes
CREATE footer_columns CONTENT {
  column_key: 'col_product',
  title: 'Produit',
  title_fr: 'Produit',
  title_en: 'Product',
  column_type: 'links',
  icon: 'Package',
  sort_order: 1,
  active: true
};

CREATE footer_columns CONTENT {
  column_key: 'col_solutions',
  title: 'Solutions',
  title_fr: 'Solutions',
  title_en: 'Solutions',
  column_type: 'links',
  icon: 'Layers',
  sort_order: 2,
  active: true
};

CREATE footer_columns CONTENT {
  column_key: 'col_resources',
  title: 'Ressources',
  title_fr: 'Ressources',
  title_en: 'Resources',
  column_type: 'links',
  icon: 'BookOpen',
  sort_order: 3,
  active: true
};

CREATE footer_columns CONTENT {
  column_key: 'col_company',
  title: 'Entreprise',
  title_fr: 'Entreprise',
  title_en: 'Company',
  column_type: 'links',
  icon: 'Building2',
  sort_order: 4,
  active: true
};

CREATE footer_columns CONTENT {
  column_key: 'col_newsletter',
  title: 'Newsletter',
  title_fr: 'Newsletter',
  title_en: 'Newsletter',
  column_type: 'newsletter',
  icon: 'Mail',
  newsletter_placeholder: 'Votre email...',
  newsletter_placeholder_fr: 'Votre email...',
  newsletter_placeholder_en: 'Your email...',
  newsletter_success_message: 'Merci pour votre inscription !',
  newsletter_success_message_fr: 'Merci pour votre inscription !',
  newsletter_success_message_en: 'Thanks for subscribing!',
  sort_order: 5,
  active: true
};

-- Liens - Produit
CREATE footer_links CONTENT {
  link_key: 'link_features',
  column_id: footer_columns:col_product,
  title: 'Fonctionnalités',
  title_fr: 'Fonctionnalités',
  title_en: 'Features',
  url: '/features',
  sort_order: 1,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_pricing',
  column_id: footer_columns:col_product,
  title: 'Tarifs',
  title_fr: 'Tarifs',
  title_en: 'Pricing',
  url: '/pricing',
  sort_order: 2,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_modules',
  column_id: footer_columns:col_product,
  title: 'Modules',
  title_fr: 'Modules',
  title_en: 'Modules',
  url: '/modules',
  sort_order: 3,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_integrations',
  column_id: footer_columns:col_product,
  title: 'Intégrations',
  title_fr: 'Intégrations',
  title_en: 'Integrations',
  url: '/integrations',
  sort_order: 4,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_changelog',
  column_id: footer_columns:col_product,
  title: 'Changelog',
  title_fr: 'Changelog',
  title_en: 'Changelog',
  url: '/changelog',
  badge: 'new',
  badge_color: 'emerald',
  sort_order: 5,
  active: true
};

-- Liens - Solutions
CREATE footer_links CONTENT {
  link_key: 'link_officine',
  column_id: footer_columns:col_solutions,
  title: 'Pharmacie Officine',
  title_fr: 'Pharmacie Officine',
  title_en: 'Retail Pharmacy',
  url: '/solutions/officine',
  sort_order: 1,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_grossiste',
  column_id: footer_columns:col_solutions,
  title: 'Grossiste',
  title_fr: 'Grossiste',
  title_en: 'Wholesaler',
  url: '/solutions/grossiste',
  sort_order: 2,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_hopital',
  column_id: footer_columns:col_solutions,
  title: 'Hôpital',
  title_fr: 'Hôpital',
  title_en: 'Hospital',
  url: '/solutions/hopital',
  sort_order: 3,
  active: true
};

-- Liens - Ressources
CREATE footer_links CONTENT {
  link_key: 'link_help',
  column_id: footer_columns:col_resources,
  title: 'Centre d\'aide',
  title_fr: 'Centre d\'aide',
  title_en: 'Help Center',
  url: '/help',
  sort_order: 1,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_docs',
  column_id: footer_columns:col_resources,
  title: 'Documentation',
  title_fr: 'Documentation',
  title_en: 'Documentation',
  url: '/docs',
  sort_order: 2,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_blog',
  column_id: footer_columns:col_resources,
  title: 'Blog',
  title_fr: 'Blog',
  title_en: 'Blog',
  url: '/blog',
  sort_order: 3,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_api',
  column_id: footer_columns:col_resources,
  title: 'API',
  title_fr: 'API',
  title_en: 'API',
  url: '/api-docs',
  sort_order: 4,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_status',
  column_id: footer_columns:col_resources,
  title: 'Statut',
  title_fr: 'Statut',
  title_en: 'Status',
  url: '/status',
  badge: 'beta',
  badge_color: 'amber',
  sort_order: 5,
  active: true
};

-- Liens - Entreprise
CREATE footer_links CONTENT {
  link_key: 'link_about',
  column_id: footer_columns:col_company,
  title: 'À propos',
  title_fr: 'À propos',
  title_en: 'About',
  url: '/about',
  sort_order: 1,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_contact',
  column_id: footer_columns:col_company,
  title: 'Contact',
  title_fr: 'Contact',
  title_en: 'Contact',
  url: '/contact',
  sort_order: 2,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_careers',
  column_id: footer_columns:col_company,
  title: 'Carrières',
  title_fr: 'Carrières',
  title_en: 'Careers',
  url: '/careers',
  sort_order: 3,
  active: true
};

CREATE footer_links CONTENT {
  link_key: 'link_partners',
  column_id: footer_columns:col_company,
  title: 'Partenaires',
  title_fr: 'Partenaires',
  title_en: 'Partners',
  url: '/partners',
  sort_order: 4,
  active: true
};
```

## DTOs

```typescript
// footer.dto.ts

export class FooterColumnResponseDto {
  column_key: string;
  title: string; // Localisé
  column_type: string;
  icon?: string;
  links: FooterLinkResponseDto[];
}

export class FooterLinkResponseDto {
  link_key: string;
  title: string; // Localisé
  url: string;
  url_type: string;
  icon?: string;
  badge?: string;
  badge_color?: string;
  target: string;
}

export class FooterCompanyInfoDto {
  logo_url?: string;
  logo_dark_url?: string;
  logo_width: number;
  description?: string; // Localisé
  tagline?: string; // Localisé
  copyright_text: string; // Localisé avec année
  founded_year?: number;
}

export class FooterResponseDto {
  company_info: FooterCompanyInfoDto;
  columns: FooterColumnResponseDto[];
  social_links: SocialLinkResponseDto[];
  newsletter_config?: {
    placeholder: string;
    success_message: string;
  };
  legal_links: FooterLinkResponseDto[];
}

export class SubscribeNewsletterDto {
  email: string;
  first_name?: string;
  locale?: string;
}

export class CreateFooterColumnDto {
  column_key: string;
  title: string;
  title_fr: string;
  title_en: string;
  column_type?: string;
  icon?: string;
  sort_order?: number;
}

export class CreateFooterLinkDto {
  link_key: string;
  column_key: string;
  title: string;
  title_fr: string;
  title_en: string;
  url: string;
  url_type?: string;
  icon?: string;
  badge?: string;
  badge_color?: string;
  sort_order?: number;
}
```

## Endpoints API

### GET /api/v1/marketing/footer
Récupérer la configuration complète du footer.

**Query Parameters:**
- `locale` (optional): `fr` | `en`

**Response 200:**
```json
{
  "company_info": {
    "logo_url": "/images/logo-white.svg",
    "description": "SyntixPharma est la plateforme SaaS...",
    "tagline": "Simplifiez votre gestion pharma",
    "copyright_text": "© 2024 SyntixPharma. Tous droits réservés."
  },
  "columns": [
    {
      "column_key": "col_product",
      "title": "Produit",
      "icon": "Package",
      "links": [
        { "link_key": "link_features", "title": "Fonctionnalités", "url": "/features" }
      ]
    }
  ],
  "social_links": [...],
  "newsletter_config": {
    "placeholder": "Votre email...",
    "success_message": "Merci pour votre inscription !"
  }
}
```

### GET /api/v1/marketing/footer/columns
Récupérer uniquement les colonnes.

### GET /api/v1/marketing/footer/company-info
Récupérer uniquement les informations entreprise.

### GET /api/v1/marketing/footer/legal-links
Récupérer les liens légaux (Privacy, Terms, Cookies).

### POST /api/v1/marketing/newsletter/subscribe (Public)
S'abonner à la newsletter.

**Body:**
```json
{
  "email": "user@example.com",
  "first_name": "Marie",
  "locale": "fr"
}
```

### DELETE /api/v1/marketing/newsletter/unsubscribe (Public)
Se désabonner de la newsletter.

**Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/v1/admin/footer/columns (Admin)
Créer une colonne.

### PATCH /api/v1/admin/footer/columns/:column_key (Admin)
Mettre à jour une colonne.

### DELETE /api/v1/admin/footer/columns/:column_key (Admin)
Supprimer une colonne.

### POST /api/v1/admin/footer/links (Admin)
Créer un lien.

### PATCH /api/v1/admin/footer/links/:link_key (Admin)
Mettre à jour un lien.

### DELETE /api/v1/admin/footer/links/:link_key (Admin)
Supprimer un lien.

### PATCH /api/v1/admin/footer/company-info (Admin)
Mettre à jour les informations entreprise.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_footer($locale: string) {
  LET $company = (SELECT * FROM footer_company_info WHERE active = true LIMIT 1)[0];
  LET $columns = SELECT * FROM footer_columns WHERE active = true ORDER BY sort_order ASC;
  LET $all_links = SELECT * FROM footer_links WHERE active = true ORDER BY sort_order ASC;
  
  -- Récupérer les liens sociaux
  LET $social_links = SELECT * FROM social_links WHERE active = true AND display_location CONTAINS 'footer' ORDER BY sort_order ASC;
  
  -- Récupérer les liens légaux
  LET $legal_links = SELECT * FROM footer_links WHERE active = true AND url_type = 'legal' ORDER BY sort_order ASC;
  
  -- Newsletter config
  LET $newsletter_col = (SELECT * FROM $columns WHERE column_type = 'newsletter')[0];
  
  RETURN {
    company_info: {
      logo_url: $company.logo_url,
      logo_dark_url: $company.logo_dark_url,
      logo_width: $company.logo_width,
      description: IF $locale == 'en' THEN $company.description_en ELSE $company.description_fr,
      tagline: IF $locale == 'en' THEN $company.tagline_en ELSE $company.tagline_fr,
      copyright_text: IF $locale == 'en' THEN $company.copyright_text_en ELSE $company.copyright_text_fr,
      founded_year: $company.founded_year
    },
    columns: (FOR $col IN $columns WHERE $col.column_type = 'links' RETURN {
      column_key: $col.column_key,
      title: IF $locale == 'en' THEN $col.title_en ELSE $col.title_fr,
      icon: $col.icon,
      links: (FOR $link IN $all_links WHERE $link.column_id = $col.id RETURN {
        link_key: $link.link_key,
        title: IF $locale == 'en' THEN $link.title_en ELSE $link.title_fr,
        url: $link.url,
        url_type: $link.url_type,
        icon: $link.icon,
        badge: $link.badge,
        badge_color: $link.badge_color,
        target: $link.target
      })
    }),
    social_links: (FOR $s IN $social_links RETURN {
      platform: $s.platform,
      url: $s.url,
      icon: $s.icon,
      color: $s.color
    }),
    newsletter_config: IF $newsletter_col THEN {
      placeholder: IF $locale == 'en' THEN $newsletter_col.newsletter_placeholder_en ELSE $newsletter_col.newsletter_placeholder_fr,
      success_message: IF $locale == 'en' THEN $newsletter_col.newsletter_success_message_en ELSE $newsletter_col.newsletter_success_message_fr
    } ELSE NONE,
    legal_links: (FOR $l IN $legal_links RETURN {
      link_key: $l.link_key,
      title: IF $locale == 'en' THEN $l.title_en ELSE $l.title_fr,
      url: $l.url,
      target: $l.target
    })
  };
};
```
