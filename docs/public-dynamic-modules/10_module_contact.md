# Module: Contact (Nous Contacter)

## Vue d'ensemble

**Module**: `contact`
**Type**: Table relationnelle + Gestion des soumissions
**Objectif**: Gérer dynamiquement les informations de contact et les soumissions du formulaire

## Analyse des éléments statiques actuels

### Éléments à remplacer (contact/page.tsx):
- Header section avec informations de contact
- Formulaire de contact
- Coordonnées (adresse, email, téléphone)
- Horaires d'ouverture
- Liens vers réseaux sociaux

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: contact_info
-- Informations de contact de l'entreprise
-- ============================================================
DEFINE TABLE contact_info SCHEMAFULL
  PERMISSIONS
    FOR select WHERE true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles;

DEFINE FIELD info_key ON contact_info TYPE string;
DEFINE INDEX uq_info_key ON contact_info COLUMNS info_key UNIQUE;

DEFINE FIELD contact_type ON contact_info TYPE string
  ASSERT $value IN ['email', 'phone', 'address', 'hours', 'social', 'department'];
DEFINE INDEX idx_type ON contact_info COLUMNS contact_type;

DEFINE FIELD label ON contact_info TYPE string;
DEFINE FIELD label_fr ON contact_info TYPE string;
DEFINE FIELD label_en ON contact_info TYPE string;

DEFINE FIELD value ON contact_info TYPE string;
DEFINE FIELD value_fr ON contact_info TYPE string;
DEFINE FIELD value_en ON contact_info TYPE string;

DEFINE FIELD is_primary ON contact_info TYPE bool DEFAULT false;
DEFINE FIELD is_public ON contact_info TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON contact_info TYPE int DEFAULT 0;

DEFINE FIELD metadata ON contact_info TYPE object DEFAULT {};
-- Pour email: { is_support: bool, is_sales: bool }
-- Pour phone: { is_whatsapp: bool, country_code: string }
-- Pour address: { lat: float, lng: float, country: string }

DEFINE FIELD active ON contact_info TYPE bool DEFAULT true;
DEFINE FIELD created_at ON contact_info TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON contact_info TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: contact_submissions
-- Soumissions du formulaire de contact
-- ============================================================
DEFINE TABLE contact_submissions SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles
    FOR create WHERE true
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD submission_key ON contact_submissions TYPE string
  VALUE string::lowercase(geom::uuid());
DEFINE INDEX uq_submission_key ON contact_submissions COLUMNS submission_key UNIQUE;

DEFINE FIELD first_name ON contact_submissions TYPE string;
DEFINE FIELD last_name ON contact_submissions TYPE string;
DEFINE FIELD email ON contact_submissions TYPE string ASSERT string::is::email($value);
DEFINE FIELD phone ON contact_submissions TYPE option<string>;

DEFINE FIELD subject ON contact_submissions TYPE string;
DEFINE FIELD subject_fr ON contact_submissions TYPE string;
DEFINE FIELD subject_en ON contact_submissions TYPE string;

DEFINE FIELD message ON contact_submissions TYPE string;
DEFINE FIELD message_fr ON contact_submissions TYPE string;
DEFINE FIELD message_en ON contact_submissions TYPE string;

DEFINE FIELD company ON contact_submissions TYPE option<string>;
DEFINE FIELD department ON contact_submissions TYPE option<string>;
DEFINE FIELD department_key ON contact_submissions TYPE option<string>;

DEFINE FIELD source ON contact_submissions TYPE string DEFAULT 'website'
  ASSERT $value IN ['website', 'mobile', 'api', 'chatbot'];

DEFINE FIELD locale ON contact_submissions TYPE string DEFAULT 'fr';
DEFINE FIELD user_agent ON contact_submissions TYPE option<string>;
DEFINE FIELD ip_address ON contact_submissions TYPE option<string>;

-- Statut et traitement
DEFINE FIELD status ON contact_submissions TYPE string DEFAULT 'new'
  ASSERT $value IN ['new', 'assigned', 'in_progress', 'resolved', 'closed', 'spam'];
DEFINE INDEX idx_status ON contact_submissions COLUMNS status;

DEFINE FIELD assigned_to ON contact_submissions TYPE option<record<platform_admins>>;
DEFINE FIELD assigned_at ON contact_submissions TYPE option<datetime>;
DEFINE FIELD resolved_at ON contact_submissions TYPE option<datetime>;
DEFINE FIELD closed_at ON contact_submissions TYPE option<datetime>;

DEFINE FIELD priority ON contact_submissions TYPE string DEFAULT 'normal'
  ASSERT $value IN ['low', 'normal', 'high', 'urgent'];

DEFINE FIELD internal_notes ON contact_submissions TYPE option<string>;

-- Tags pour catégorisation
DEFINE FIELD tags ON contact_submissions TYPE array<string> DEFAULT [];

-- Réponse
DEFINE FIELD response_message ON contact_submissions TYPE option<string>;
DEFINE FIELD response_sent_at ON contact_submissions TYPE option<datetime>;
DEFINE FIELD response_sent_by ON contact_submissions TYPE option<record<platform_admins>>;

-- Consentement
DEFINE FIELD consent_marketing ON contact_submissions TYPE bool DEFAULT false;
DEFINE FIELD consent_privacy ON contact_submissions TYPE bool DEFAULT true;
DEFINE FIELD consent_timestamp ON contact_submissions TYPE datetime DEFAULT time::now();

DEFINE FIELD created_at ON contact_submissions TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON contact_submissions TYPE datetime VALUE time::now() READONLY;

DEFINE INDEX idx_created ON contact_submissions COLUMNS created_at;
DEFINE INDEX idx_email ON contact_submissions COLUMNS email;

-- ============================================================
-- TABLE: contact_departments
-- Départements de contact
-- ============================================================
DEFINE TABLE contact_departments SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'PLATFORM_ADMIN' IN $auth.roles;

DEFINE FIELD department_key ON contact_departments TYPE string;
DEFINE INDEX uq_department_key ON contact_departments COLUMNS department_key UNIQUE;

DEFINE FIELD name ON contact_departments TYPE string;
DEFINE FIELD name_fr ON contact_departments TYPE string;
DEFINE FIELD name_en ON contact_departments TYPE string;

DEFINE FIELD description ON contact_departments TYPE option<string>;
DEFINE FIELD description_fr ON contact_departments TYPE option<string>;
DEFINE FIELD description_en ON contact_departments TYPE option<string>;

DEFINE FIELD email ON contact_departments TYPE string;
DEFINE FIELD icon ON contact_departments TYPE option<string>;
DEFINE FIELD color ON contact_departments TYPE option<string>;

DEFINE FIELD default_subject ON contact_departments TYPE option<string>;
DEFINE FIELD default_subject_fr ON contact_departments TYPE option<string>;
DEFINE FIELD default_subject_en ON contact_departments TYPE option<string>;

DEFINE FIELD target_response_hours ON contact_departments TYPE int DEFAULT 24;
DEFINE FIELD active ON contact_departments TYPE bool DEFAULT true;
DEFINE FIELD sort_order ON contact_departments TYPE int DEFAULT 0;

DEFINE FIELD created_at ON contact_departments TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON contact_departments TYPE datetime VALUE time::now() READONLY;

-- ============================================================
-- TABLE: contact_responses
-- Templates de réponse
-- ============================================================
DEFINE TABLE contact_response_templates SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles;

DEFINE FIELD template_key ON contact_response_templates TYPE string;
DEFINE INDEX uq_template_key ON contact_response_templates COLUMNS template_key UNIQUE;

DEFINE FIELD name ON contact_response_templates TYPE string;
DEFINE FIELD subject ON contact_response_templates TYPE string;
DEFINE FIELD subject_fr ON contact_response_templates TYPE string;
DEFINE FIELD subject_en ON contact_response_templates TYPE string;

DEFINE FIELD body ON contact_response_templates TYPE string;
DEFINE FIELD body_fr ON contact_response_templates TYPE string;
DEFINE FIELD body_en ON contact_response_templates TYPE string;

DEFINE FIELD variables ON contact_response_templates TYPE array<string> DEFAULT [];
-- Variables: {{first_name}}, {{ticket_id}}, {{subject}}, etc.

DEFINE FIELD department_key ON contact_response_templates TYPE option<string>;
DEFINE FIELD status ON contact_response_templates TYPE string DEFAULT 'draft'
  ASSERT $value IN ['draft', 'active', 'archived'];

DEFINE FIELD active ON contact_response_templates TYPE bool DEFAULT true;
DEFINE FIELD created_at ON contact_response_templates TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON contact_response_templates TYPE datetime VALUE time::now() READONLY;
```

### Seed Data

```surql
-- Départements
CREATE contact_departments CONTENT {
  department_key: 'sales',
  name: 'Service Commercial',
  name_fr: 'Service Commercial',
  name_en: 'Sales Department',
  description: 'Questions sur nos produits et tarifs',
  description_fr: 'Questions sur nos produits et tarifs',
  description_en: 'Questions about our products and pricing',
  email: 'sales@syntixpharma.com',
  icon: 'TrendingUp',
  color: 'emerald',
  target_response_hours: 4,
  sort_order: 1,
  active: true
};

CREATE contact_departments CONTENT {
  department_key: 'support',
  name: 'Support Technique',
  name_fr: 'Support Technique',
  name_en: 'Technical Support',
  description: 'Aide technique et dépannage',
  description_fr: 'Aide technique et dépannage',
  description_en: 'Technical help and troubleshooting',
  email: 'support@syntixpharma.com',
  icon: 'Headphones',
  color: 'blue',
  target_response_hours: 8,
  sort_order: 2,
  active: true
};

CREATE contact_departments CONTENT {
  department_key: 'billing',
  name: 'Facturation',
  name_fr: 'Facturation',
  name_en: 'Billing',
  description: 'Questions sur la facturation et les paiements',
  description_fr: 'Questions sur la facturation et les paiements',
  description_en: 'Billing and payment questions',
  email: 'billing@syntixpharma.com',
  icon: 'CreditCard',
  color: 'amber',
  target_response_hours: 24,
  sort_order: 3,
  active: true
};

-- Informations de contact
CREATE contact_info CONTENT {
  info_key: 'email_main',
  contact_type: 'email',
  label: 'Email',
  label_fr: 'Email',
  label_en: 'Email',
  value: 'contact@syntixpharma.com',
  value_fr: 'contact@syntixpharma.com',
  value_en: 'contact@syntixpharma.com',
  is_primary: true,
  is_public: true,
  sort_order: 1,
  metadata: { is_support: true, is_sales: true },
  active: true
};

CREATE contact_info CONTENT {
  info_key: 'phone_main',
  contact_type: 'phone',
  label: 'Téléphone',
  label_fr: 'Téléphone',
  label_en: 'Phone',
  value: '+33 1 23 45 67 89',
  value_fr: '+33 1 23 45 67 89',
  value_en: '+33 1 23 45 67 89',
  is_primary: true,
  is_public: true,
  sort_order: 2,
  metadata: { country_code: '+33', is_whatsapp: true },
  active: true
};

CREATE contact_info CONTENT {
  info_key: 'address_main',
  contact_type: 'address',
  label: 'Adresse',
  label_fr: 'Adresse',
  label_en: 'Address',
  value: '123 Rue de la Santé, 75001 Paris, France',
  value_fr: '123 Rue de la Santé, 75001 Paris, France',
  value_en: '123 Health Street, 75001 Paris, France',
  is_primary: true,
  is_public: true,
  sort_order: 3,
  metadata: { lat: 48.8566, lng: 2.3522, country: 'France', city: 'Paris' },
  active: true
};

CREATE contact_info CONTENT {
  info_key: 'hours_weekday',
  contact_type: 'hours',
  label: 'Horaires jours ouvrables',
  label_fr: 'Horaires jours ouvrables',
  label_en: 'Weekday hours',
  value: '9h00 - 18h00',
  value_fr: '9h00 - 18h00',
  value_en: '9:00 AM - 6:00 PM',
  is_public: true,
  sort_order: 4,
  active: true
};

CREATE contact_info CONTENT {
  info_key: 'hours_weekend',
  contact_type: 'hours',
  label: 'Horaires weekend',
  label_fr: 'Horaires weekend',
  label_en: 'Weekend hours',
  value: 'Fermé',
  value_fr: 'Fermé',
  value_en: 'Closed',
  is_public: true,
  sort_order: 5,
  active: true
};
```

## DTOs

### Input DTOs

```typescript
// create-contact-submission.dto.ts
export class CreateContactSubmissionDto {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  subject_fr: string;
  subject_en: string;
  message: string;
  message_fr: string;
  message_en: string;
  company?: string;
  department_key?: string;
  consent_marketing?: boolean;
}

// create-contact-info.dto.ts
export class CreateContactInfoDto {
  info_key: string;
  contact_type: 'email' | 'phone' | 'address' | 'hours' | 'social' | 'department';
  label: string;
  label_fr: string;
  label_en: string;
  value: string;
  value_fr: string;
  value_en: string;
  is_primary?: boolean;
  is_public?: boolean;
  sort_order?: number;
  metadata?: Record<string, any>;
}

// create-department.dto.ts
export class CreateDepartmentDto {
  department_key: string;
  name: string;
  name_fr: string;
  name_en: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  email: string;
  icon?: string;
  color?: string;
  default_subject?: string;
  default_subject_fr?: string;
  default_subject_en?: string;
  target_response_hours?: number;
  sort_order?: number;
}
```

### Output DTOs

```typescript
// contact-info.response.dto.ts
export class ContactInfoResponseDto {
  info_key: string;
  contact_type: string;
  label: string; // Localisé
  value: string; // Localisé
  is_primary: boolean;
  sort_order: number;
  metadata?: Record<string, any>;
}

// contact-department.response.dto.ts
export class DepartmentResponseDto {
  department_key: string;
  name: string; // Localisé
  description?: string; // Localisé
  email: string;
  icon?: string;
  color?: string;
  target_response_hours: number;
  sort_order: number;
}

// contact-submission.response.dto.ts
export class ContactSubmissionResponseDto {
  submission_key: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string; // Localisé
  message: string; // Localisé
  company?: string;
  department?: DepartmentResponseDto;
  source: string;
  status: string;
  priority: string;
  tags: string[];
  created_at: Date;
  assigned_to?: string;
}

// Contact Page Data
export class ContactPageDataDto {
  departments: DepartmentResponseDto[];
  contact_info: ContactInfoResponseDto[];
  social_links: SocialLinkResponseDto[];
  office_locations?: OfficeLocationDto[];
}
```

## Endpoints API

### GET /api/v1/marketing/contact
Récupérer toutes les informations de contact pour la page.

**Query Parameters:**
- `locale` (optional): `fr` | `en`

**Response 200:**
```json
{
  "departments": [
    {
      "department_key": "sales",
      "name": "Service Commercial",
      "description": "Questions sur nos produits...",
      "email": "sales@syntixpharma.com",
      "icon": "TrendingUp",
      "color": "emerald",
      "target_response_hours": 4
    }
  ],
  "contact_info": [
    {
      "info_key": "email_main",
      "contact_type": "email",
      "label": "Email",
      "value": "contact@syntixpharma.com",
      "is_primary": true
    }
  ]
}
```

### GET /api/v1/marketing/contact/info
Récupérer uniquement les informations de contact.

### GET /api/v1/marketing/contact/departments
Récupérer les départements.

### GET /api/v1/marketing/contact/departments/:department_key
Récupérer un département par clé.

### POST /api/v1/marketing/contact/submissions
Soumettre une demande de contact (Public).

**Body:**
```json
{
  "first_name": "Marie",
  "last_name": "Dupont",
  "email": "marie@example.com",
  "phone": "+33 6 12 34 56 78",
  "subject_fr": "Question sur les fonctionnalités",
  "subject_en": "Question about features",
  "message_fr": "Bonjour, j'aimerais en savoir plus...",
  "message_en": "Hello, I'd like to know more...",
  "company": "Ma Pharmacie",
  "department_key": "sales",
  "consent_marketing": true
}
```

**Response 201:**
```json
{
  "submission_key": "abc123",
  "status": "new",
  "message": "Votre demande a été envoyée avec succès",
  "message_en": "Your request has been sent successfully"
}
```

### GET /api/v1/admin/contact/submissions (Admin)
Lister les soumissions.

**Query Parameters:**
- `status` (optional): `new` | `assigned` | `in_progress` | `resolved` | `closed`
- `department_key` (optional)
- `priority` (optional)
- `assigned_to` (optional)
- `from_date` / `to_date` (optional)

### PATCH /api/v1/admin/contact/submissions/:submission_key (Admin)
Mettre à jour une soumission (statut, assignation, notes).

**Body:**
```json
{
  "status": "assigned",
  "assigned_to": "admin_id",
  "priority": "high",
  "tags": ["vip", "urgent"]
}
```

### POST /api/v1/admin/contact/submissions/:submission_key/respond (Admin)
Envoyer une réponse.

**Body:**
```json
{
  "message": "Merci pour votre message..."
}
```

### POST /api/v1/admin/contact/info (Admin)
Créer une information de contact.

### PATCH /api/v1/admin/contact/info/:info_key (Admin)
Modifier une information.

### POST /api/v1/admin/contact/departments (Admin)
Créer un département.

### POST /api/v1/admin/contact/response-templates (Admin)
Créer un template de réponse.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_contact_page($locale: string) {
  LET $departments = SELECT * FROM contact_departments WHERE active = true ORDER BY sort_order ASC;
  LET $info = SELECT * FROM contact_info WHERE active = true AND is_public = true ORDER BY sort_order ASC;
  
  RETURN {
    departments: (FOR $d IN $departments RETURN {
      department_key: $d.department_key,
      name: IF $locale == 'en' THEN $d.name_en ELSE $d.name_fr,
      description: IF $locale == 'en' THEN $d.description_en ELSE $d.description_fr,
      email: $d.email,
      icon: $d.icon,
      color: $d.color,
      target_response_hours: $d.target_response_hours
    }),
    contact_info: (FOR $i IN $info RETURN {
      info_key: $i.info_key,
      contact_type: $i.contact_type,
      label: IF $locale == 'en' THEN $i.label_en ELSE $i.label_fr,
      value: IF $locale == 'en' THEN $i.value_en ELSE $i.value_fr,
      is_primary: $i.is_primary,
      metadata: $i.metadata
    })
  };
};
```
