# Module: Legal Pages (Pages Légales)

## Vue d'ensemble

**Module**: `legal_pages`
**Type**: Gestion de contenu pour pages légales
**Objectif**: Gérer dynamiquement les pages Confidentialité, Conditions d'utilisation, Cookies, Mentions légales

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: legal_pages
-- Pages légales du site
-- ============================================================
DEFINE TABLE legal_pages SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'LEGAL_ADMIN' IN $auth.roles;

DEFINE FIELD page_key ON legal_pages TYPE string
  ASSERT $value IN [
    'privacy', 'terms', 'cookies', 'mentions_legales',
    'gdpr', 'hipaa', 'licenses', 'acceptable_use'
  ];
DEFINE INDEX uq_page_key ON legal_pages COLUMNS page_key UNIQUE;

DEFINE FIELD page_type ON legal_pages TYPE string
  ASSERT $value IN ['policy', 'terms', 'legal_notice', 'guideline'];

-- Versions linguistiques
DEFINE FIELD title ON legal_pages TYPE string;
DEFINE FIELD title_fr ON legal_pages TYPE string;
DEFINE FIELD title_en ON legal_pages TYPE string;

DEFINE FIELD content ON legal_pages TYPE string;
DEFINE FIELD content_fr ON legal_pages TYPE string;
DEFINE FIELD content_en ON legal_pages TYPE string;
-- Contenu en Markdown

-- SEO
DEFINE FIELD meta_title ON legal_pages TYPE option<string>;
DEFINE FIELD meta_title_fr ON legal_pages TYPE option<string>;
DEFINE FIELD meta_title_en ON legal_pages TYPE option<string>;
DEFINE FIELD meta_description ON legal_pages TYPE option<string>;
DEFINE FIELD meta_description_fr ON legal_pages TYPE option<string>;
DEFINE FIELD meta_description_en ON legal_pages TYPE option<string>;

-- Configuration d'affichage
DEFINE FIELD slug ON legal_pages TYPE string;
DEFINE INDEX idx_slug ON legal_pages COLUMNS slug UNIQUE;

DEFINE FIELD show_in_footer ON legal_pages TYPE bool DEFAULT true;
DEFINE FIELD show_in_header ON legal_pages TYPE bool DEFAULT false;
DEFINE FIELD footer_sort_order ON legal_pages TYPE int DEFAULT 0;

DEFINE FIELD requires_consent ON legal_pages TYPE bool DEFAULT false;
-- Pour cookies, marketing

DEFINE FIELD requires_authentication ON legal_pages TYPE bool DEFAULT false;
DEFINE FIELD minimum_age ON legal_pages TYPE option<int>;

-- Régions
DEFINE FIELD applicable_regions ON legal_pages TYPE array<string> DEFAULT ['global'];
-- Ex: ['EU', 'US', 'FR', 'global']

-- Statut légal
DEFINE FIELD is_legally_binding ON legal_pages TYPE bool DEFAULT true;
DEFINE FIELD is_draft ON legal_pages TYPE bool DEFAULT false;

-- Validité
DEFINE FIELD effective_date ON legal_pages TYPE datetime;
DEFINE FIELD last_reviewed_date ON legal_pages TYPE option<datetime>;
DEFINE FIELD next_review_date ON legal_pages TYPE option<datetime>;
DEFINE FIELD version ON legal_pages TYPE string DEFAULT '1.0';

-- Contacts légaux
DEFINE FIELD legal_contact_email ON legal_pages TYPE option<string>;
DEFINE FIELD dpo_email ON legal_pages TYPE option<string>;
-- DPO = Data Protection Officer

-- Statut et timestamps
DEFINE FIELD active ON legal_pages TYPE bool DEFAULT true;
DEFINE FIELD created_at ON legal_pages TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON legal_pages TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD published_at ON legal_pages TYPE option<datetime>;
DEFINE FIELD created_by ON legal_pages TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON legal_pages TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: legal_page_versions
-- Historique des versions des pages légales
-- ============================================================
DEFINE TABLE legal_page_versions SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'LEGAL_ADMIN' IN $auth.roles
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD page_id ON legal_page_versions TYPE record<legal_pages>;
DEFINE INDEX idx_version_page ON legal_page_versions COLUMNS page_id;

DEFINE FIELD version ON legal_page_versions TYPE string;

DEFINE FIELD content ON legal_page_versions TYPE string;
DEFINE FIELD content_fr ON legal_page_versions TYPE string;
DEFINE FIELD content_en ON legal_page_versions TYPE string;

DEFINE FIELD change_summary ON legal_page_versions TYPE option<string>;
DEFINE FIELD change_summary_fr ON legal_page_versions TYPE option<string>;
DEFINE FIELD change_summary_en ON legal_page_versions TYPE option<string>;

DEFINE FIELD effective_date ON legal_page_versions TYPE datetime;
DEFINE FIELD created_at ON legal_page_versions TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD created_by ON legal_page_versions TYPE record<platform_admins>;

DEFINE INDEX idx_version ON legal_page_versions COLUMNS page_id, version UNIQUE;

-- ============================================================
-- TABLE: legal_consents
-- Consentements utilisateur
-- ============================================================
DEFINE TABLE legal_consents SCHEMAFULL
  PERMISSIONS
    FOR select WHERE $auth.id = user_id OR 'SUPER_ADMIN' IN $auth.roles
    FOR create WHERE true
    FOR update WHERE $auth.id = user_id OR 'SUPER_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD user_id ON legal_consents TYPE record<users>;
DEFINE INDEX idx_consent_user ON legal_consents COLUMNS user_id;

DEFINE FIELD consent_type ON legal_consents TYPE string
  ASSERT $value IN [
    'terms_of_service', 'privacy_policy', 'cookies',
    'marketing', 'data_processing', 'third_party_sharing'
  ];

DEFINE FIELD granted ON legal_consents TYPE bool;
DEFINE FIELD ip_address ON legal_consents TYPE option<string>;
DEFINE FIELD user_agent ON legal_consents TYPE option<string>;

DEFINE FIELD legal_page_version ON legal_consents TYPE option<string>;

DEFINE FIELD created_at ON legal_consents TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON legal_consents TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD expires_at ON legal_consents TYPE option<datetime>;

DEFINE INDEX idx_consent_type ON legal_consents COLUMNS user_id, consent_type UNIQUE;

-- ============================================================
-- TABLE: legal_page_sections
-- Sections modulaires pour les pages légales
-- ============================================================
DEFINE TABLE legal_page_sections SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'LEGAL_ADMIN' IN $auth.roles;

DEFINE FIELD section_key ON legal_page_sections TYPE string;
DEFINE INDEX uq_section_key ON legal_page_sections COLUMNS section_key UNIQUE;

DEFINE FIELD page_key ON legal_page_sections TYPE string;

DEFINE FIELD title ON legal_page_sections TYPE string;
DEFINE FIELD title_fr ON legal_page_sections TYPE string;
DEFINE FIELD title_en ON legal_page_sections TYPE string;

DEFINE FIELD content ON legal_page_sections TYPE string;
DEFINE FIELD content_fr ON legal_page_sections TYPE string;
DEFINE FIELD content_en ON legal_page_sections TYPE string;

DEFINE FIELD sort_order ON legal_page_sections TYPE int DEFAULT 0;
DEFINE FIELD active ON legal_page_sections TYPE bool DEFAULT true;

DEFINE FIELD created_at ON legal_page_sections TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON legal_page_sections TYPE datetime VALUE time::now() READONLY;
```

### Seed Data

```surql
-- Politique de confidentialité
CREATE legal_pages CONTENT {
  page_key: 'privacy',
  page_type: 'policy',
  title: 'Politique de Confidentialité',
  title_fr: 'Politique de Confidentialité',
  title_en: 'Privacy Policy',
  slug: 'confidentialite',
  show_in_footer: true,
  footer_sort_order: 1,
  requires_consent: true,
  applicable_regions: ['global', 'EU'],
  is_legally_binding: true,
  effective_date: '2024-01-01T00:00:00Z',
  last_reviewed_date: '2024-06-15T00:00:00Z',
  next_review_date: '2025-06-15T00:00:00Z',
  version: '2.1',
  legal_contact_email: 'privacy@syntixpharma.com',
  dpo_email: 'dpo@syntixpharma.com',
  content_fr: '''# Politique de Confidentialité

## 1. Introduction
SyntixPharma (« nous », « notre ») s\'engage à protéger votre vie privée...

## 2. Données que nous collectons
Nous collectons les données suivantes:
- Informations de compte (nom, email, téléphone)
- Données d\'utilisation
- Données de localisation
...

## 3. Utilisation de vos données
Vos données sont utilisées pour:
- Fournir nos services
- Améliorer notre plateforme
- Vous contacter
...

[Contenu complet...]
''',
  content_en: '''# Privacy Policy

## 1. Introduction
SyntixPharma ("we", "our") is committed to protecting your privacy...

## 2. Data We Collect
We collect the following data:
- Account information (name, email, phone)
- Usage data
- Location data
...

[Full content...]
''',
  active: true,
  published_at: '2024-01-01T00:00:00Z'
};

-- Conditions d'utilisation
CREATE legal_pages CONTENT {
  page_key: 'terms',
  page_type: 'terms',
  title: 'Conditions d\'Utilisation',
  title_fr: 'Conditions d\'Utilisation',
  title_en: 'Terms of Service',
  slug: 'conditions-utilisation',
  show_in_footer: true,
  footer_sort_order: 2,
  requires_consent: true,
  is_legally_binding: true,
  effective_date: '2024-01-01T00:00:00Z',
  version: '2.0',
  legal_contact_email: 'legal@syntixpharma.com',
  content_fr: '''# Conditions d\'Utilisation

## 1. Acceptation des conditions
En accédant à SyntixPharma, vous acceptez d\'être lié par ces conditions...

## 2. Description du service
SyntixPharma est une plateforme SaaS de gestion pour pharmacies...

## 3. Votre compte
Vous êtes responsable de la confidentialité de votre compte...

[Contenu complet...]
''',
  content_en: '''# Terms of Service

## 1. Acceptance of Terms
By accessing SyntixPharma, you agree to be bound by these terms...

## 2. Service Description
SyntixPharma is a SaaS management platform for pharmacies...

## 3. Your Account
You are responsible for maintaining the confidentiality of your account...

[Full content...]
''',
  active: true,
  published_at: '2024-01-01T00:00:00Z'
};

-- Politique de cookies
CREATE legal_pages CONTENT {
  page_key: 'cookies',
  page_type: 'policy',
  title: 'Politique de Cookies',
  title_fr: 'Politique de Cookies',
  title_en: 'Cookie Policy',
  slug: 'cookies',
  show_in_footer: true,
  footer_sort_order: 3,
  requires_consent: true,
  applicable_regions: ['EU', 'global'],
  is_legally_binding: true,
  effective_date: '2024-01-01T00:00:00Z',
  version: '1.0',
  content_fr: '''# Politique de Cookies

## 1. Qu\'est-ce qu\'un cookie ?
Les cookies sont de petits fichiers texte stockés sur votre appareil...

## 2. Types de cookies que nous utilisons
### Cookies essentiels
Ces cookies sont nécessaires au fonctionnement du site...

### Cookies analytiques
Ces cookies nous aident à comprendre comment vous utilisez notre site...

### Cookies de marketing
Ces cookies sont utilisés pour vous proposer des publicités pertinentes...

[Contenu complet...]
''',
  content_en: '''# Cookie Policy

## 1. What is a cookie?
Cookies are small text files stored on your device...

## 2. Types of cookies we use
### Essential cookies
These cookies are necessary for the website to function...

### Analytics cookies
These cookies help us understand how you use our site...

### Marketing cookies
These cookies are used to deliver relevant advertisements...

[Full content...]
''',
  active: true,
  published_at: '2024-01-01T00:00:00Z'
};

-- Mentions légales
CREATE legal_pages CONTENT {
  page_key: 'mentions_legales',
  page_type: 'legal_notice',
  title: 'Mentions Légales',
  title_fr: 'Mentions Légales',
  title_en: 'Legal Notice',
  slug: 'mentions-legales',
  show_in_footer: true,
  footer_sort_order: 4,
  is_legally_binding: false,
  applicable_regions: ['FR'],
  effective_date: '2024-01-01T00:00:00Z',
  version: '1.0',
  content_fr: '''# Mentions Légales

## Informations sur l\'éditeur
**Raison sociale:** SyntixPharma SAS
**Capital social:** 100 000 euros
**Siège social:** 123 Rue de la Santé, 75001 Paris, France
**SIRET:** 123 456 789 00012
**TVA Intracommunautaire:** FR12345678901

## Directeur de publication
Jean Dupont, PDG

## Hébergement
Ce site est hébergé par:
AWS France
10 Place des Vosges
92051 Paris La Défense

## Contact
Email: contact@syntixpharma.com
Téléphone: +33 1 23 45 67 89
''',
  content_en: '''# Legal Notice

## Publisher Information
**Company name:** SyntixPharma SAS
**Share capital:** 100,000 euros
**Headquarters:** 123 Health Street, 75001 Paris, France
...

[Content...]
''',
  active: true,
  published_at: '2024-01-01T00:00:00Z'
};
```

## DTOs

```typescript
// legal-pages.dto.ts

// Input DTOs
export class CreateLegalPageDto {
  page_key: string;
  page_type: 'policy' | 'terms' | 'legal_notice' | 'guideline';
  title: string;
  title_fr: string;
  title_en: string;
  content: string;
  content_fr: string;
  content_en: string;
  slug: string;
  meta_title?: string;
  meta_title_fr?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_fr?: string;
  meta_description_en?: string;
  show_in_footer?: boolean;
  show_in_header?: boolean;
  footer_sort_order?: number;
  requires_consent?: boolean;
  requires_authentication?: boolean;
  minimum_age?: number;
  applicable_regions?: string[];
  effective_date: Date;
  version: string;
  legal_contact_email?: string;
  dpo_email?: string;
}

export class UpdateLegalPageDto {
  title?: string;
  title_fr?: string;
  title_en?: string;
  content?: string;
  content_fr?: string;
  content_en?: string;
  meta_title?: string;
  meta_description?: string;
  show_in_footer?: boolean;
  show_in_header?: boolean;
  footer_sort_order?: number;
  requires_consent?: boolean;
  applicable_regions?: string[];
  effective_date?: Date;
  last_reviewed_date?: Date;
  next_review_date?: Date;
  version?: string;
}

// Output DTOs
export class LegalPageResponseDto {
  page_key: string;
  page_type: string;
  title: string; // Localisé
  slug: string;
  content: string; // Localisé (Markdown)
  meta_title?: string;
  meta_description?: string;
  effective_date: Date;
  last_reviewed_date?: Date;
  next_review_date?: Date;
  version: string;
  requires_consent: boolean;
  applicable_regions: string[];
  created_at: Date;
  updated_at: Date;
}

export class LegalPageSummaryDto {
  page_key: string;
  title: string;
  slug: string;
  page_type: string;
  version: string;
  effective_date: Date;
  last_reviewed_date?: Date;
}

export class LegalConsentDto {
  consent_type: string;
  granted: boolean;
  granted_at: Date;
  expires_at?: Date;
}

export class GrantConsentDto {
  consent_type: string;
  granted: boolean;
}
```

## Endpoints API

### GET /api/v1/legal/pages
Récupérer toutes les pages légales (liste).

### GET /api/v1/legal/pages/:page_key
Récupérer une page légale complète.

**Query Parameters:**
- `locale` (optional): `fr` | `en`

**Response 200:**
```json
{
  "page_key": "privacy",
  "page_type": "policy",
  "title": "Politique de Confidentialité",
  "slug": "confidentialite",
  "content": "# Politique de Confidentialité\n\n## 1. Introduction...",
  "meta_title": "Politique de Confidentialité | SyntixPharma",
  "meta_description": "Découvrez comment SyntixPharma protège vos données...",
  "effective_date": "2024-01-01T00:00:00Z",
  "version": "2.1",
  "requires_consent": true,
  "applicable_regions": ["global", "EU"]
}
```

### GET /api/v1/legal/pages/:page_key/summary
Récupérer les métadonnées d'une page (sans contenu).

### GET /api/v1/legal/pages/:page_key/versions
Récupérer l'historique des versions.

### GET /api/v1/legal/footer-links
Récupérer les liens à afficher dans le footer.

**Response 200:**
```json
{
  "links": [
    { "title": "Politique de Confidentialité", "slug": "confidentialite", "sort_order": 1 },
    { "title": "Conditions d'Utilisation", "slug": "conditions-utilisation", "sort_order": 2 },
    { "title": "Politique de Cookies", "slug": "cookies", "sort_order": 3 },
    { "title": "Mentions Légales", "slug": "mentions-legales", "sort_order": 4 }
  ]
}
```

### POST /api/v1/legal/consent (Authenticated)
Enregistrer un consentement.

**Body:**
```json
{
  "consent_type": "terms_of_service",
  "granted": true
}
```

### GET /api/v1/legal/consents (Authenticated)
Récupérer mes consentements.

### GET /api/v1/legal/consents/all (Admin)
Récupérer tous les consentements.

### POST /api/v1/admin/legal/pages (Admin)
Créer une page légale.

### PATCH /api/v1/admin/legal/pages/:page_key (Admin)
Mettre à jour une page légale.

### POST /api/v1/admin/legal/pages/:page_key/publish (Admin)
Publier une page légale.

### POST /api/v1/admin/legal/pages/:page_key/rollback/:version (Admin)
Restaurer une version précédente.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_legal_page($page_key: string, $locale: string) {
  LET $page = (SELECT * FROM legal_pages WHERE page_key = $page_key AND active = true)[0];
  IF !$page {
    THROW 'Legal page not found';
  };
  
  RETURN {
    page_key: $page.page_key,
    page_type: $page.page_type,
    title: IF $locale == 'en' THEN $page.title_en ELSE $page.title_fr,
    slug: $page.slug,
    content: IF $locale == 'en' THEN $page.content_en ELSE $page.content_fr,
    meta_title: IF $locale == 'en' THEN $page.meta_title_en ELSE $page.meta_title_fr,
    meta_description: IF $locale == 'en' THEN $page.meta_description_en ELSE $page.meta_description_fr,
    effective_date: $page.effective_date,
    last_reviewed_date: $page.last_reviewed_date,
    next_review_date: $page.next_review_date,
    version: $page.version,
    requires_consent: $page.requires_consent,
    applicable_regions: $page.applicable_regions
  };
};

DEFINE FUNCTION IF NOT EXISTS fn::get_footer_legal_links($locale: string) {
  LET $pages = SELECT * FROM legal_pages 
    WHERE active = true AND show_in_footer = true
    ORDER BY footer_sort_order ASC;
  
  RETURN FOR $p IN $pages RETURN {
    title: IF $locale == 'en' THEN $p.title_en ELSE $p.title_fr,
    slug: $p.slug,
    sort_order: $p.footer_sort_order
  };
};
```
