# Module: Help Center (Centre d'Aide)

## Vue d'ensemble

**Module**: `help_center`
**Type**: Structure hiérarchique complète
**Objectif**: Gérer le centre d'aide avec articles, catégories, tags, et recherche

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: help_center_categories
-- Catégories du centre d'aide
-- ============================================================
DEFINE TABLE help_center_categories SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles;

DEFINE FIELD category_key ON help_center_categories TYPE string;
DEFINE INDEX uq_category_key ON help_center_categories COLUMNS category_key UNIQUE;

DEFINE FIELD name ON help_center_categories TYPE string;
DEFINE FIELD name_fr ON help_center_categories TYPE string;
DEFINE FIELD name_en ON help_center_categories TYPE string;

DEFINE FIELD description ON help_center_categories TYPE option<string>;
DEFINE FIELD description_fr ON help_center_categories TYPE option<string>;
DEFINE FIELD description_en ON help_center_categories TYPE option<string>;

DEFINE FIELD icon ON help_center_categories TYPE option<string>;
DEFINE FIELD icon_library ON help_center_categories TYPE string DEFAULT 'lucide';

DEFINE FIELD color ON help_center_categories TYPE option<string>;
DEFINE FIELD color_bg ON help_center_categories TYPE option<string>;

DEFINE FIELD slug ON help_center_categories TYPE string;
DEFINE INDEX idx_category_slug ON help_center_categories COLUMNS slug UNIQUE;

DEFINE FIELD parent_id ON help_center_categories TYPE option<record<help_center_categories>>;
DEFINE FIELD level ON help_center_categories TYPE int DEFAULT 0;

DEFINE FIELD article_count ON help_center_categories TYPE int DEFAULT 0;

DEFINE FIELD sort_order ON help_center_categories TYPE int DEFAULT 0;
DEFINE INDEX idx_category_sort ON help_center_categories COLUMNS sort_order;

DEFINE FIELD active ON help_center_categories TYPE bool DEFAULT true;
DEFINE FIELD is_featured ON help_center_categories TYPE bool DEFAULT false;

DEFINE FIELD meta_title ON help_center_categories TYPE option<string>;
DEFINE FIELD meta_title_fr ON help_center_categories TYPE option<string>;
DEFINE FIELD meta_title_en ON help_center_categories TYPE option<string>;
DEFINE FIELD meta_description ON help_center_categories TYPE option<string>;

DEFINE FIELD created_at ON help_center_categories TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON help_center_categories TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON help_center_categories TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: help_center_articles
-- Articles du centre d'aide
-- ============================================================
DEFINE TABLE help_center_articles SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true AND (status = 'published' OR 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles)
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles;

DEFINE FIELD article_key ON help_center_articles TYPE string;
DEFINE INDEX uq_article_key ON help_center_articles COLUMNS article_key UNIQUE;

DEFINE FIELD title ON help_center_articles TYPE string;
DEFINE FIELD title_fr ON help_center_articles TYPE string;
DEFINE FIELD title_en ON help_center_articles TYPE string;

DEFINE FIELD slug ON help_center_articles TYPE string;
DEFINE INDEX idx_article_slug ON help_center_articles COLUMNS slug UNIQUE;

-- Contenu en Markdown/HTML
DEFINE FIELD content ON help_center_articles TYPE string;
DEFINE FIELD content_fr ON help_center_articles TYPE string;
DEFINE FIELD content_en ON help_center_articles TYPE string;

DEFINE FIELD summary ON help_center_articles TYPE option<string>;
DEFINE FIELD summary_fr ON help_center_articles TYPE option<string>;
DEFINE FIELD summary_en ON help_center_articles TYPE option<string>;

DEFINE FIELD category_id ON help_center_articles TYPE record<help_center_categories>;
DEFINE INDEX idx_article_category ON help_center_articles COLUMNS category_id;

DEFINE FIELD author_id ON help_center_articles TYPE option<record<platform_admins>>;

DEFINE FIELD status ON help_center_articles TYPE string DEFAULT 'draft'
  ASSERT $value IN ['draft', 'published', 'archived'];
DEFINE INDEX idx_article_status ON help_center_articles COLUMNS status;

DEFINE FIELD visibility ON help_center_articles TYPE string DEFAULT 'public'
  ASSERT $value IN ['public', 'authenticated', 'admin'];
DEFINE INDEX idx_article_visibility ON help_center_articles COLUMNS visibility;

-- Plans concernés
DEFINE FIELD applicable_plans ON help_center_articles TYPE array<string> DEFAULT [];
-- Ex: ['free', 'starter', 'professional', 'enterprise']

-- Métriques
DEFINE FIELD view_count ON help_center_articles TYPE int DEFAULT 0;
DEFINE FIELD helpful_count ON help_center_articles TYPE int DEFAULT 0;
DEFINE FIELD not_helpful_count ON help_center_articles TYPE int DEFAULT 0;

-- Related articles
DEFINE FIELD related_articles ON help_center_articles TYPE array<record<help_center_articles>> DEFAULT [];

-- Tags
DEFINE FIELD tags ON help_center_articles TYPE array<string> DEFAULT [];
DEFINE INDEX idx_article_tags ON help_center_articles COLUMNS tags;

-- SEO
DEFINE FIELD meta_title ON help_center_articles TYPE option<string>;
DEFINE FIELD meta_title_fr ON help_center_articles TYPE option<string>;
DEFINE FIELD meta_title_en ON help_center_articles TYPE option<string>;
DEFINE FIELD meta_description ON help_center_articles TYPE option<string>;
DEFINE FIELD meta_description_fr ON help_center_articles TYPE option<string>;
DEFINE FIELD meta_description_en ON help_center_articles TYPE option<string>;

-- Images
DEFINE FIELD cover_image_url ON help_center_articles TYPE option<string>;
DEFINE FIELD thumbnail_url ON help_center_articles TYPE option<string>;

-- Durées de lecture
DEFINE FIELD reading_time_minutes ON help_center_articles TYPE int DEFAULT 5;

-- Position
DEFINE FIELD is_featured ON help_center_articles TYPE bool DEFAULT false;
DEFINE FIELD is_popular ON help_center_articles TYPE bool DEFAULT false;
DEFINE FIELD is_new ON help_center_articles TYPE bool DEFAULT false;

DEFINE FIELD sort_order ON help_center_articles TYPE int DEFAULT 0;
DEFINE INDEX idx_article_sort ON help_center_articles COLUMNS sort_order;

DEFINE FIELD active ON help_center_articles TYPE bool DEFAULT true;
DEFINE INDEX idx_article_active ON help_center_articles COLUMNS active;

DEFINE FIELD published_at ON help_center_articles TYPE option<datetime>;
DEFINE FIELD created_at ON help_center_articles TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON help_center_articles TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD created_by ON help_center_articles TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON help_center_articles TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: help_center_tags
-- Tags pour articles
-- ============================================================
DEFINE TABLE help_center_tags SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles;

DEFINE FIELD tag_key ON help_center_tags TYPE string;
DEFINE INDEX uq_tag_key ON help_center_tags COLUMNS tag_key UNIQUE;

DEFINE FIELD name ON help_center_tags TYPE string;
DEFINE FIELD name_fr ON help_center_tags TYPE string;
DEFINE FIELD name_en ON help_center_tags TYPE string;

DEFINE FIELD slug ON help_center_tags TYPE string;
DEFINE FIELD color ON help_center_tags TYPE string DEFAULT 'gray';
DEFINE FIELD article_count ON help_center_tags TYPE int DEFAULT 0;

DEFINE FIELD active ON help_center_tags TYPE bool DEFAULT true;
DEFINE FIELD created_at ON help_center_tags TYPE datetime DEFAULT time::now() READONLY;

-- ============================================================
-- TABLE: help_center_article_ratings
-- Évaluations des articles
-- ============================================================
DEFINE TABLE help_center_article_ratings SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles
    FOR create WHERE true;

DEFINE FIELD article_id ON help_center_article_ratings TYPE record<help_center_articles>;
DEFINE INDEX idx_rating_article ON help_center_article_ratings COLUMNS article_id;

DEFINE FIELD is_helpful ON help_center_article_ratings TYPE bool;
DEFINE FIELD comment ON help_center_article_ratings TYPE option<string>;
DEFINE FIELD user_id ON help_center_article_ratings TYPE option<record<users>>;
DEFINE FIELD user_ip ON help_center_article_ratings TYPE option<string>;
DEFINE FIELD locale ON help_center_article_ratings TYPE option<string>;
DEFINE FIELD created_at ON help_center_article_ratings TYPE datetime DEFAULT time::now() READONLY;

-- ============================================================
-- TABLE: help_center_popular_searches
-- Recherches populaires
-- ============================================================
DEFINE TABLE help_center_popular_searches SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true
    FOR create WHERE true
    FOR update WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD query ON help_center_popular_searches TYPE string;
DEFINE INDEX uq_popular_query ON help_center_popular_searches COLUMNS query UNIQUE;

DEFINE FIELD query_fr ON help_center_popular_searches TYPE string;
DEFINE FIELD query_en ON help_center_popular_searches TYPE string;

DEFINE FIELD search_count ON help_center_popular_searches TYPE int DEFAULT 1;
DEFINE FIELD result_count ON help_center_popular_searches TYPE int DEFAULT 0;
DEFINE FIELD last_searched_at ON help_center_popular_searches TYPE datetime DEFAULT time::now();

DEFINE FIELD is_featured ON help_center_popular_searches TYPE bool DEFAULT false;
DEFINE FIELD active ON help_center_popular_searches TYPE bool DEFAULT true;
DEFINE FIELD created_at ON help_center_popular_searches TYPE datetime DEFAULT time::now() READONLY;

-- ============================================================
-- TABLE: help_center_feedback
-- Feedback utilisateur sur les articles
-- ============================================================
DEFINE TABLE help_center_feedback SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'SUPPORT_ADMIN' IN $auth.roles
    FOR create WHERE true;

DEFINE FIELD article_id ON help_center_feedback TYPE record<help_center_articles>;
DEFINE FIELD user_id ON help_center_feedback TYPE option<record<users>>;
DEFINE FIELD user_ip ON help_center_feedback TYPE option<string>;

DEFINE FIELD feedback_type ON help_center_feedback TYPE string
  ASSERT $value IN ['helpful', 'not_helpful', 'correction', 'question'];

DEFINE FIELD message ON help_center_feedback TYPE option<string>;
DEFINE FIELD status ON help_center_feedback TYPE string DEFAULT 'pending'
  ASSERT $value IN ['pending', 'reviewed', 'implemented', 'dismissed'];

DEFINE FIELD reviewed_by ON help_center_feedback TYPE option<record<platform_admins>>;
DEFINE FIELD reviewed_at ON help_center_feedback TYPE option<datetime>;

DEFINE FIELD created_at ON help_center_feedback TYPE datetime DEFAULT time::now() READONLY;

-- EVENTS
DEFINE EVENT update_article_counts ON help_center_articles
WHEN $event = 'INSERT' OR $event = 'DELETE'
THEN {
  -- Mettre à jour le compteur de la catégorie
};
```

### Seed Data

```surql
-- Catégories
CREATE help_center_categories CONTENT {
  category_key: 'getting_started',
  name: 'Getting Started',
  name_fr: 'Premiers Pas',
  name_en: 'Getting Started',
  description: 'Learn how to set up your account and get started quickly',
  description_fr: 'Apprenez à configurer votre compte et commencer rapidement',
  description_en: 'Learn how to set up your account and get started quickly',
  icon: 'Rocket',
  color: 'emerald',
  color_bg: 'emerald',
  slug: 'premiers-pas',
  sort_order: 1,
  active: true,
  is_featured: true
};

CREATE help_center_categories CONTENT {
  category_key: 'billing',
  name: 'Billing & Pricing',
  name_fr: 'Facturation & Tarifs',
  name_en: 'Billing & Pricing',
  description: 'Everything about billing, payments, and pricing',
  description_fr: 'Tout sur la facturation, les paiements et les tarifs',
  description_en: 'Everything about billing, payments, and pricing',
  icon: 'CreditCard',
  color: 'amber',
  slug: 'facturation-tarifs',
  sort_order: 2,
  active: true
};

CREATE help_center_categories CONTENT {
  category_key: 'features',
  name: 'Features',
  name_fr: 'Fonctionnalités',
  name_en: 'Features',
  description: 'Learn about all features and how to use them',
  description_fr: 'Découvrez toutes les fonctionnalités et comment les utiliser',
  description_en: 'Learn about all features and how to use them',
  icon: 'Layers',
  color: 'blue',
  slug: 'fonctionnalites',
  sort_order: 3,
  active: true,
  is_featured: true
};

CREATE help_center_categories CONTENT {
  category_key: 'integrations',
  name: 'Integrations',
  name_fr: 'Intégrations',
  name_en: 'Integrations',
  description: 'Connect SyntixPharma with other tools',
  description_fr: 'Connectez SyntixPharma avec d\'autres outils',
  description_en: 'Connect SyntixPharma with other tools',
  icon: 'Plug',
  color: 'violet',
  slug: 'integrations',
  sort_order: 4,
  active: true
};

CREATE help_center_categories CONTENT {
  category_key: 'troubleshooting',
  name: 'Troubleshooting',
  name_fr: 'Dépannage',
  name_en: 'Troubleshooting',
  description: 'Solutions to common issues',
  description_fr: 'Solutions aux problèmes courants',
  description_en: 'Solutions to common issues',
  icon: 'Wrench',
  color: 'red',
  slug: 'depannage',
  sort_order: 5,
  active: true
};

-- Articles
CREATE help_center_articles CONTENT {
  article_key: 'article_001',
  title: 'Comment créer mon compte ?',
  title_fr: 'Comment créer mon compte ?',
  title_en: 'How to create my account?',
  slug: 'creer-mon-compte',
  content: '# Créer votre compte\n\nSuivez ces étapes pour créer votre compte SyntixPharma...',
  content_fr: '# Créer votre compte\n\nSuivez ces étapes pour créer votre compte SyntixPharma...',
  content_en: '# Create your account\n\nFollow these steps to create your SyntixPharma account...',
  summary: 'Guide complet pour créer et configurer votre compte',
  summary_fr: 'Guide complet pour créer et configurer votre compte',
  summary_en: 'Complete guide to create and configure your account',
  category_id: help_center_categories:getting_started,
  status: 'published',
  visibility: 'public',
  reading_time_minutes: 3,
  is_new: true,
  is_featured: true,
  sort_order: 1,
  active: true,
  published_at: time::now()
};

CREATE help_center_articles CONTENT {
  article_key: 'article_002',
  title: 'Comment fonctionne la facturation ?',
  title_fr: 'Comment fonctionne la facturation ?',
  title_en: 'How does billing work?',
  slug: 'fonctionnement-facturation',
  content: '# Facturation\n\nExplication du système de facturation...',
  content_fr: '# Facturation\n\nExplication du système de facturation...',
  content_en: '# Billing\n\nExplanation of the billing system...',
  summary: 'Comprenez votre facture et les options de paiement',
  summary_fr: 'Comprenez votre facture et les options de paiement',
  summary_en: 'Understand your invoice and payment options',
  category_id: help_center_categories:billing,
  status: 'published',
  visibility: 'public',
  reading_time_minutes: 5,
  sort_order: 1,
  active: true,
  published_at: time::now()
};

-- Tags
CREATE help_center_tags CONTENT {
  tag_key: 'tag_account',
  name: 'Account',
  name_fr: 'Compte',
  name_en: 'Account',
  slug: 'compte',
  color: 'blue',
  active: true
};

CREATE help_center_tags CONTENT {
  tag_key: 'tag_billing',
  name: 'Billing',
  name_fr: 'Facturation',
  name_en: 'Billing',
  slug: 'facturation',
  color: 'amber',
  active: true
};

-- Recherches populaires
CREATE help_center_popular_searches CONTENT {
  query: 'comment créer un compte',
  query_fr: 'comment créer un compte',
  query_en: 'how to create account',
  search_count: 1542,
  result_count: 5,
  is_featured: true,
  active: true
};

CREATE help_center_popular_searches CONTENT {
  query: 'facturation mensuel',
  query_fr: 'facturation mensuel',
  query_en: 'monthly billing',
  search_count: 892,
  result_count: 8,
  is_featured: true,
  active: true
};
```

## DTOs

```typescript
// help-center.dto.ts

// Categories
export class CreateCategoryDto {
  category_key: string;
  name: string;
  name_fr: string;
  name_en: string;
  description?: string;
  description_fr?: string;
  description_en?: string;
  icon?: string;
  color?: string;
  slug: string;
  parent_id?: string;
  sort_order?: number;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export class CategoryResponseDto {
  category_key: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  slug: string;
  article_count: number;
  is_featured: boolean;
  children?: CategoryResponseDto[];
}

// Articles
export class CreateArticleDto {
  article_key: string;
  title: string;
  title_fr: string;
  title_en: string;
  slug: string;
  content: string;
  content_fr: string;
  content_en: string;
  summary?: string;
  summary_fr?: string;
  summary_en?: string;
  category_id: string;
  tags?: string[];
  cover_image_url?: string;
  reading_time_minutes?: number;
  is_featured?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'authenticated' | 'admin';
  applicable_plans?: string[];
  published_at?: Date;
}

export class ArticleResponseDto {
  article_key: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string; // Only for detail view
  category: CategoryResponseDto;
  tags: string[];
  reading_time_minutes: number;
  view_count: number;
  helpful_count: number;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  published_at?: Date;
  updated_at: Date;
}

export class ArticleDetailResponseDto extends ArticleResponseDto {
  content: string;
  author_id?: string;
  related_articles: ArticleResponseDto[];
  meta_title?: string;
  meta_description?: string;
}

// Search
export class SearchArticlesDto {
  query: string;
  locale?: 'fr' | 'en';
  category_key?: string;
  tags?: string[];
  limit?: number;
}

// Feedback
export class CreateArticleFeedbackDto {
  article_id: string;
  feedback_type: 'helpful' | 'not_helpful' | 'correction' | 'question';
  message?: string;
}

export class ArticleFeedbackResponseDto {
  id: string;
  feedback_type: string;
  message?: string;
  status: string;
  created_at: Date;
}
```

## Endpoints API

### GET /api/v1/help-center
Récupérer le centre d'aide complet (catégories + articles populaires).

**Query Parameters:**
- `locale` (optional): `fr` | `en`

**Response 200:**
```json
{
  "categories": [
    {
      "category_key": "getting_started",
      "name": "Premiers Pas",
      "description": "Apprenez à configurer...",
      "icon": "Rocket",
      "color": "emerald",
      "article_count": 12,
      "is_featured": true,
      "slug": "premiers-pas"
    }
  ],
  "popular_articles": [...],
  "featured_articles": [...],
  "popular_searches": [
    { "query": "comment créer un compte", "search_count": 1542 }
  ]
}
```

### GET /api/v1/help-center/categories
Lister toutes les catégories.

### GET /api/v1/help-center/categories/:slug
Récupérer une catégorie avec ses articles.

### GET /api/v1/help-center/categories/:slug/articles
Récupérer les articles d'une catégorie.

### GET /api/v1/help-center/articles
Lister tous les articles (avec filtres).

**Query Parameters:**
- `locale`
- `category_key`
- `tags`
- `featured`
- `popular`
- `new`
- `search`

### GET /api/v1/help-center/articles/:slug
Récupérer un article complet (increment view count).

### GET /api/v1/help-center/articles/popular
Récupérer les articles populaires.

### GET /api/v1/help-center/articles/featured
Récupérer les articles mis en avant.

### GET /api/v1/help-center/search
Rechercher des articles.

**Query Parameters:**
- `q` (required): Terme de recherche
- `locale`
- `limit`

**Response 200:**
```json
{
  "results": [
    {
      "article_key": "article_001",
      "title": "Comment créer mon compte ?",
      "slug": "creer-mon-compte",
      "summary": "Guide complet...",
      "category": { "name": "Premiers Pas", "slug": "premiers-pas" },
      "relevance_score": 0.95
    }
  ],
  "total": 1,
  "popular_suggestions": [...]
}
```

### POST /api/v1/help-center/articles/:slug/feedback (Public)
Soumettre un feedback sur un article.

**Body:**
```json
{
  "feedback_type": "helpful",
  "message": "Très utile merci !"
}
```

### POST /api/v1/help-center/articles/:slug/rate (Public)
Évaluer si un article est utile.

**Body:**
```json
{
  "is_helpful": true
}
```

### POST /api/v1/admin/help-center/categories (Admin)
Créer une catégorie.

### POST /api/v1/admin/help-center/articles (Admin)
Créer un article.

### PATCH /api/v1/admin/help-center/articles/:article_key (Admin)
Mettre à jour un article.

### PATCH /api/v1/admin/help-center/articles/:article_key/publish (Admin)
Publier un article.

### DELETE /api/v1/admin/help-center/articles/:article_key (Admin)
Supprimer un article.

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::search_articles(
  $query: string,
  $locale: string,
  $limit: option<int>
) {
  LET $q = string::lowercase($query);
  
  LET $articles = SELECT * FROM help_center_articles 
    WHERE active = true 
    AND status = 'published'
    AND (visibility = 'public' OR 'SUPER_ADMIN' IN $auth.roles)
    ORDER BY view_count DESC
    LIMIT $limit ?? 20;
  
  -- Score de pertinence basique
  LET $results = (FOR $a IN $articles {
    LET $title = IF $locale == 'en' THEN $a.title_en ELSE $a.title_fr;
    LET $title_lower = string::lowercase($title);
    LET $summary = IF $locale == 'en' THEN $a.summary_en ELSE $a.summary_fr;
    
    LET $score = 0;
    IF string::contains($title_lower, $q) { $score = $score + 10; };
    IF string::contains($summary, $q) { $score = $score + 5; };
    
    IF $score > 0 {
      {
        article: $a,
        title: $title,
        summary: $summary,
        relevance_score: $score
      }
    }
  });
  
  RETURN (SELECT * FROM $results WHERE relevance_score > 0 ORDER BY relevance_score DESC);
};
```
