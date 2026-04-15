# Module: Announcements (Annonces et Bannières)

## Vue d'honneur

**Module**: `announcements`
**Type**: Table relationnelle
**Objectif**: Gérer dynamiquement les bannières d'annonces, notifications et alertes affichées sur le site

## SurrealDB Schema 3.x

```surql
-- ============================================================
-- TABLE: announcements
-- Annonces et bannières
-- ============================================================
DEFINE TABLE announcements SCHEMAFULL
  PERMISSIONS
    FOR select WHERE active = true AND (valid_from IS NONE OR valid_from <= time::now()) AND (valid_until IS NONE OR valid_until >= time::now())
    FOR create, update, delete WHERE 'SUPER_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles;

DEFINE FIELD announcement_key ON announcements TYPE string;
DEFINE INDEX uq_announcement_key ON announcements COLUMNS announcement_key UNIQUE;

-- Type d'annonce
DEFINE FIELD announcement_type ON announcements TYPE string
  ASSERT $value IN [
    'banner', 'toast', 'modal', 'alert', 
    'promotion', 'notification', 'info', 'warning', 'maintenance'
  ];

-- Contenu
DEFINE FIELD title ON announcements TYPE string;
DEFINE FIELD title_fr ON announcements TYPE string;
DEFINE FIELD title_en ON announcements TYPE string;

DEFINE FIELD message ON announcements TYPE string;
DEFINE FIELD message_fr ON announcements TYPE string;
DEFINE FIELD message_en ON announcements TYPE string;

-- Style
DEFINE FIELD variant ON announcements TYPE string DEFAULT 'info'
  ASSERT $VALUE IN [
    'info', 'success', 'warning', 'error', 
    'promo', 'brand', 'dark', 'light'
  ];

DEFINE FIELD background_color ON announcements TYPE option<string>;
DEFINE FIELD text_color ON announcements TYPE option<string>;
DEFINE FIELD border_color ON announcements TYPE option<string>;

-- Position
DEFINE FIELD position ON announcements TYPE string DEFAULT 'top'
  ASSERT $value IN [
    'top', 'bottom', 'top_fixed', 'bottom_fixed',
    'center', 'corner', 'inline'
  ];

DEFINE FIELD display_location ON announcements TYPE array<string> DEFAULT ['global'];
-- ['global', 'home', 'pricing', 'dashboard', 'auth', 'specific_page']

-- Page spécifique
DEFINE FIELD specific_page ON announcements TYPE option<string>;
-- Ex: '/features' ou regex pattern

-- URL de destination
DEFINE FIELD action_url ON announcements TYPE option<string>;
DEFINE FIELD action_label ON announcements TYPE option<string>;
DEFINE FIELD action_label_fr ON announcements TYPE option<string>;
DEFINE FIELD action_label_en ON announcements TYPE option<string>;

-- Action comportementale
DEFINE FIELD action_type ON announcements TYPE string DEFAULT 'none'
  ASSERT $value IN ['none', 'link', 'dismiss', 'cta', 'survey', 'update_modal'];

-- Icône
DEFINE FIELD icon ON announcements TYPE option<string>;
DEFINE FIELD icon_library ON announcements TYPE option<string>;

-- Badge
DEFINE FIELD badge ON announcements TYPE option<string>;
DEFINE FIELD badge_color ON announcements TYPE option<string>;

-- Comportement
DEFINE FIELD dismissible ON announcements TYPE bool DEFAULT true;
DEFINE FIELD dismiss_duration_days ON announcements TYPE int DEFAULT 7;
-- Durée avant de pouvoir réafficher

DEFINE FIELD show_close_button ON announcements TYPE bool DEFAULT true;

DEFINE FIELD priority ON announcements TYPE int DEFAULT 0;
-- Plus élevé = plus prioritaire

DEFINE FIELD max_display_count ON announcements TYPE option<int>;
DEFINE FIELD current_display_count ON announcements TYPE int DEFAULT 0;

-- Ciblage
DEFINE FIELD applicable_plans ON announcements TYPE array<string> DEFAULT [];
-- Si vide = tous les plans

DEFINE FIELD applicable_regions ON announcements TYPE array<string> DEFAULT [];
-- Si vide = toutes les régions

DEFINE FIELD applicable_user_roles ON announcements TYPE array<string> DEFAULT [];
-- Si vide = tous les rôles (y compris anonymes)

DEFINE FIELD requires_auth ON announcements TYPE bool DEFAULT false;

-- Validité
DEFINE FIELD valid_from ON announcements TYPE option<datetime>;
DEFINE FIELD valid_until ON announcements TYPE option<datetime>;

-- Statut
DEFINE FIELD active ON announcements TYPE bool DEFAULT true;
DEFINE INDEX idx_active ON announcements COLUMNS active;

DEFINE FIELD is_published ON announcements TYPE bool DEFAULT false;

-- Schedule
DEFINE FIELD is_scheduled ON announcements TYPE bool DEFAULT false;
DEFINE FIELD scheduled_at ON announcements TYPE option<datetime>;

-- Metrics
DEFINE FIELD view_count ON announcements TYPE int DEFAULT 0;
DEFINE FIELD click_count ON announcements TYPE int DEFAULT 0;
DEFINE FIELD dismiss_count ON announcements TYPE int DEFAULT 0;

-- Timestamps
DEFINE FIELD created_at ON announcements TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON announcements TYPE datetime VALUE time::now() READONLY;
DEFINE FIELD published_at ON announcements TYPE option<datetime>;
DEFINE FIELD created_by ON announcements TYPE option<record<platform_admins>>;
DEFINE FIELD updated_by ON announcements TYPE option<record<platform_admins>>;

-- ============================================================
-- TABLE: announcement_dismissals
-- Dismissals d'annonces par utilisateur
-- ============================================================
DEFINE TABLE announcement_dismissals SCHEMAFULL
  PERMISSIONS
    FOR select WHERE $auth.id = user_id OR 'SUPER_ADMIN' IN $auth.roles
    FOR create WHERE true
    FOR delete WHERE 'SUPER_ADMIN' IN $auth.roles;

DEFINE FIELD announcement_id ON announcement_dismissals TYPE record<announcements>;
DEFINE INDEX idx_dismissal_announcement ON announcement_dismissals COLUMNS announcement_id;

DEFINE FIELD user_id ON announcement_dismissals TYPE option<record<users>>;
DEFINE FIELD user_ip ON announcement_dismissals TYPE option<string>;

DEFINE FIELD dismissed_at ON announcement_dismissals TYPE datetime DEFAULT time::now() READONLY;

DEFINE INDEX idx_dismissal_user ON announcement_dismissals COLUMNS user_id;

-- ============================================================
-- TABLE: announcement_impressions
-- Suivi des impressions
-- ============================================================
DEFINE TABLE announcement_impressions SCHEMAFULL
  PERMISSIONS
    FOR select WHERE 'SUPER_ADMIN' IN $auth.roles OR 'MARKETING_ADMIN' IN $auth.roles
    FOR create WHERE true;

DEFINE FIELD announcement_id ON announcement_impressions TYPE record<announcements>;
DEFINE FIELD user_id ON announcement_impressions TYPE option<record<users>>;
DEFINE FIELD user_ip ON announcement_impressions TYPE option<string>;
DEFINE FIELD impression_type ON announcement_impressions TYPE string
  ASSERT $value IN ['view', 'click', 'dismiss'];
DEFINE FIELD created_at ON announcement_impressions TYPE datetime DEFAULT time::now() READONLY;

DEFINE INDEX idx_impression_announcement ON announcement_impressions COLUMNS announcement_id;
DEFINE INDEX idx_impression_period ON announcement_impressions COLUMNS created_at;
```

### Seed Data

```surql
-- Bannière promotionnelle
CREATE announcements CONTENT {
  announcement_key: 'announce_promo_newyear',
  announcement_type: 'banner',
  title: 'Offre Spéciale',
  title_fr: 'Offre Spéciale',
  title_en: 'Special Offer',
  message: 'Profitez de -30% sur le plan Professional jusqu\'au 31 janvier !',
  message_fr: 'Profitez de -30% sur le plan Professional jusqu\'au 31 janvier !',
  message_en: 'Enjoy -30% off the Professional plan until January 31st!',
  variant: 'promo',
  background_color: '#10B981',
  text_color: '#FFFFFF',
  position: 'top_fixed',
  display_location: ['home', 'pricing'],
  action_url: '/auth/register?promo=newyear2024',
  action_label: 'En profiter',
  action_label_fr: 'En profiter',
  action_label_en: 'Get it now',
  action_type: 'link',
  icon: 'Gift',
  priority: 100,
  dismissible: true,
  valid_from: '2024-01-01T00:00:00Z',
  valid_until: '2024-01-31T23:59:59Z',
  is_published: true,
  published_at: '2024-01-01T00:00:00Z',
  active: true
};

-- Maintenance planifiée
CREATE announcements CONTENT {
  announcement_key: 'announce_maintenance_jan15',
  announcement_type: 'alert',
  announcement_type: 'warning',
  title: 'Maintenance Planifiée',
  title_fr: 'Maintenance Planifiée',
  title_en: 'Scheduled Maintenance',
  message: 'Une maintenance est prévue le 15 janvier de 2h à 4h UTC.',
  message_fr: 'Une maintenance est prévue le 15 janvier de 2h à 4h UTC.',
  message_en: 'Maintenance is scheduled for January 15th from 2am to 4am UTC.',
  variant: 'warning',
  position: 'top_fixed',
  display_location: ['global'],
  icon: 'AlertTriangle',
  priority: 200,
  dismissible: false,
  valid_from: '2024-01-14T12:00:00Z',
  valid_until: '2024-01-15T05:00:00Z',
  is_published: true,
  active: true
};

-- Nouvelle fonctionnalité
CREATE announcements CONTENT {
  announcement_key: 'announce_new_feature_ai',
  announcement_type: 'toast',
  title: 'Nouveau : Assistant IA',
  title_fr: 'Nouveau : Assistant IA',
  title_en: 'New: AI Assistant',
  message: 'Découvrez notre nouvel assistant IA pour optimiser vos opérations !',
  message_fr: 'Découvrez notre nouvel assistant IA pour optimiser vos opérations !',
  message_en: 'Discover our new AI assistant to optimize your operations!',
  variant: 'brand',
  position: 'bottom_fixed',
  display_location: ['dashboard'],
  action_url: '/modules/ai',
  action_label: 'Découvrir',
  action_label_fr: 'Découvrir',
  action_label_en: 'Learn more',
  action_type: 'link',
  icon: 'Sparkles',
  badge: 'NEW',
  badge_color: 'emerald',
  priority: 50,
  dismissible: true,
  dismiss_duration_days: 30,
  valid_from: '2024-01-15T00:00:00Z',
  is_published: true,
  published_at: '2024-01-15T00:00:00Z',
  applicable_plans: ['professional', 'enterprise'],
  applicable_user_roles: ['PHARMACIST', 'MANAGER', 'ADMIN'],
  requires_auth: true,
  active: true
};

-- Information générale
CREATE announcements CONTENT {
  announcement_key: 'announce_webinar',
  announcement_type: 'info',
  title: 'Webinaire gratuit',
  title_fr: 'Webinaire gratuit',
  title_en: 'Free webinar',
  message: 'Rejoignez notre webinaire sur l\'optimisation des stocks le 20 janvier.',
  message_fr: 'Rejoignez notre webinaire sur l\'optimisation des stocks le 20 janvier.',
  message_en: 'Join our webinar on stock optimization on January 20th.',
  variant: 'info',
  position: 'inline',
  display_location: ['home'],
  action_url: '/events/webinar-stock',
  action_label: 'S\'inscrire',
  action_label_fr: 'S\'inscrire',
  action_label_en: 'Register',
  action_type: 'cta',
  icon: 'Calendar',
  priority: 30,
  dismissible: true,
  valid_from: '2024-01-10T00:00:00Z',
  valid_until: '2024-01-21T00:00:00Z',
  is_published: true,
  active: true
};
```

## DTOs

```typescript
// announcements.dto.ts

export class CreateAnnouncementDto {
  announcement_key: string;
  announcement_type: 'banner' | 'toast' | 'modal' | 'alert' | 
                   'promotion' | 'notification' | 'info' | 'warning' | 'maintenance';
  title: string;
  title_fr: string;
  title_en: string;
  message: string;
  message_fr: string;
  message_en: string;
  variant?: string;
  background_color?: string;
  text_color?: string;
  border_color?: string;
  position?: string;
  display_location?: string[];
  specific_page?: string;
  action_url?: string;
  action_label?: string;
  action_label_fr?: string;
  action_label_en?: string;
  action_type?: 'none' | 'link' | 'dismiss' | 'cta' | 'survey' | 'update_modal';
  icon?: string;
  badge?: string;
  badge_color?: string;
  dismissible?: boolean;
  dismiss_duration_days?: number;
  show_close_button?: boolean;
  priority?: number;
  applicable_plans?: string[];
  applicable_regions?: string[];
  applicable_user_roles?: string[];
  requires_auth?: boolean;
  valid_from?: Date;
  valid_until?: Date;
}

export class UpdateAnnouncementDto {
  title?: string;
  title_fr?: string;
  title_en?: string;
  message?: string;
  message_fr?: string;
  message_en?: string;
  variant?: string;
  background_color?: string;
  text_color?: string;
  position?: string;
  display_location?: string[];
  action_url?: string;
  action_label?: string;
  action_type?: string;
  icon?: string;
  badge?: string;
  priority?: number;
  dismissible?: boolean;
  active?: boolean;
  is_published?: boolean;
  valid_from?: Date;
  valid_until?: Date;
}

export class AnnouncementResponseDto {
  id: string;
  announcement_key: string;
  announcement_type: string;
  title: string; // Localisé
  message: string; // Localisé
  variant: string;
  background_color?: string;
  text_color?: string;
  position: string;
  display_location: string[];
  action_url?: string;
  action_label?: string; // Localisé
  action_type: string;
  icon?: string;
  badge?: string;
  badge_color?: string;
  dismissible: boolean;
  show_close_button: boolean;
  priority: number;
  valid_from?: Date;
  valid_until?: Date;
  created_at: Date;
}

export class AnnouncementDetailDto extends AnnouncementResponseDto {
  applicable_plans: string[];
  applicable_regions: string[];
  applicable_user_roles: string[];
  requires_auth: boolean;
  view_count: number;
  click_count: number;
  dismiss_count: number;
  is_published: boolean;
  published_at?: Date;
  created_by?: string;
}

export class DismissAnnouncementDto {
  announcement_id: string;
}
```

## Endpoints API

### GET /api/v1/marketing/announcements
Récupérer les annonces actives.

**Query Parameters:**
- `locale` (optional): `fr` | `en`
- `location` (optional): `home` | `pricing` | `dashboard` | `auth`
- `page` (optional): URL de la page courante
- `user_id` (optional): ID de l'utilisateur (pour exclure les dismissed)
- `plan` (optional): Plan de l'utilisateur
- `region` (optional): Région de l'utilisateur

**Response 200:**
```json
{
  "data": [
    {
      "id": "announcements:announce_promo",
      "announcement_key": "announce_promo_newyear",
      "announcement_type": "banner",
      "title": "Offre Spéciale",
      "message": "Profitez de -30% sur le plan Professional...",
      "variant": "promo",
      "position": "top_fixed",
      "action_url": "/auth/register?promo=newyear2024",
      "action_label": "En profiter",
      "icon": "Gift",
      "badge": null,
      "priority": 100
    }
  ]
}
```

### GET /api/v1/marketing/announcements/by-position/:position
Récupérer les annonces par position.

**Example:** `/api/v1/marketing/announcements/by-position/top_fixed`

### GET /api/v1/marketing/announcements/by-location/:location
Récupérer les annonces pour un emplacement.

**Example:** `/api/v1/marketing/announcements/by-location/home`

### GET /api/v1/marketing/announcements/dismissed
Récupérer les IDs des annonces dismiss par l'utilisateur (pour filtrage frontend).

**Query Parameters:**
- `user_id` ou `ip_address`

### POST /api/v1/marketing/announcements/dismiss (Public/Authenticated)
Marquer une annonce comme dismiss.

**Body:**
```json
{
  "announcement_id": "announcements:xxx"
}
```

### POST /api/v1/marketing/announcements/track-impression (Public)
Tracker une impression.

**Body:**
```json
{
  "announcement_id": "announcements:xxx",
  "type": "view"
}
```

### POST /api/v1/admin/announcements (Admin)
Créer une annonce.

### PATCH /api/v1/admin/announcements/:announcement_key (Admin)
Mettre à jour une annonce.

### POST /api/v1/admin/announcements/:announcement_key/publish (Admin)
Publier une annonce.

### POST /api/v1/admin/announcements/:announcement_key/unpublish (Admin)
Dépublier une annonce.

### DELETE /api/v1/admin/announcements/:announcement_key (Admin)
Supprimer une annonce.

### GET /api/v1/admin/announcements/stats/:announcement_key (Admin)
Obtenir les statistiques d'une annonce.

**Response:**
```json
{
  "view_count": 1542,
  "click_count": 234,
  "dismiss_count": 89,
  "ctr": 15.18,
  "dismiss_rate": 5.77
}
```

## Fonction helper SurrealDB

```surql
DEFINE FUNCTION IF NOT EXISTS fn::get_active_announcements(
  $locale: string,
  $location: option<string>,
  $page: option<string>,
  $plan: option<string>,
  $region: option<string>,
  $user_roles: option<array<string>>,
  $requires_auth: option<bool>
) {
  LET $now = time::now();
  
  LET $query = SELECT * FROM announcements 
    WHERE active = true
    AND is_published = true
    AND (valid_from IS NONE OR valid_from <= $now)
    AND (valid_until IS NONE OR valid_until >= $now)
    AND ($max_display_count IS NONE OR current_display_count < $max_display_count)
    ORDER BY priority DESC;
  
  -- Filtrer par emplacement
  LET $filtered = (FOR $a IN $query {
    IF $location IS NOT NONE AND NOT ($a.display_location CONTAINS 'global' OR $a.display_location CONTAINS $location) {
      CONTINUE;
    };
    
    -- Filtrer par page spécifique
    IF $a.specific_page IS NOT NONE AND $page IS NOT NONE {
      IF NOT string::starts_with($page, $a.specific_page) {
        CONTINUE;
      };
    };
    
    -- Filtrer par plan
    IF array::len($a.applicable_plans) > 0 AND $plan IS NOT NONE {
      IF NOT ($a.applicable_plans CONTAINS $plan) {
        CONTINUE;
      };
    };
    
    -- Filtrer par région
    IF array::len($a.applicable_regions) > 0 AND $region IS NOT NONE {
      IF NOT ($a.applicable_regions CONTAINS $region OR $a.applicable_regions CONTAINS 'global') {
        CONTINUE;
      };
    };
    
    -- Filtrer par rôles
    IF array::len($a.applicable_user_roles) > 0 AND $user_roles IS NOT NONE {
      LET $has_role = false;
      FOR $role IN $a.applicable_user_roles {
        IF $user_roles CONTAINS $role {
          $has_role = true;
          BREAK;
        };
      };
      IF $has_role = false {
        CONTINUE;
      };
    };
    
    -- Filtrer par requires_auth
    IF $a.requires_auth = true AND $requires_auth = false {
      CONTINUE;
    };
    
    RETURN $a;
  });
  
  RETURN FOR $a IN $filtered RETURN {
    id: $a.id,
    announcement_key: $a.announcement_key,
    announcement_type: $a.announcement_type,
    title: IF $locale == 'en' THEN $a.title_en ELSE $a.title_fr,
    message: IF $locale == 'en' THEN $a.message_en ELSE $a.message_fr,
    variant: $a.variant,
    background_color: $a.background_color,
    text_color: $a.text_color,
    border_color: $a.border_color,
    position: $a.position,
    display_location: $a.display_location,
    action_url: $a.action_url,
    action_label: IF $locale == 'en' THEN $a.action_label_en ELSE $a.action_label_fr,
    action_type: $a.action_type,
    icon: $a.icon,
    icon_library: $a.icon_library,
    badge: $a.badge,
    badge_color: $a.badge_color,
    dismissible: $a.dismissible,
    show_close_button: $a.show_close_button,
    priority: $a.priority
  };
};
```

## Exemple d'utilisation Frontend

```tsx
// Exemple d'intégration React
function useAnnouncements(location: string) {
  const { data } = useQuery({
    queryKey: ['announcements', location],
    queryFn: () => fetchAnnouncements({ location }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return data?.data ?? [];
}

function AnnouncementBanner({ announcement }) {
  const dismiss = useDismissAnnouncement();
  const trackImpression = useTrackAnnouncementImpression();
  
  useEffect(() => {
    trackImpression.mutate({ 
      announcement_id: announcement.id, 
      type: 'view' 
    });
  }, []);
  
  return (
    <div className={`announcement announcement--${announcement.variant}`}>
      <span className="announcement__icon">{getIcon(announcement.icon)}</span>
      <span className="announcement__message">{announcement.message}</span>
      {announcement.action_url && (
        <Link href={announcement.action_url} className="announcement__cta">
          {announcement.action_label}
        </Link>
      )}
      {announcement.dismissible && (
        <button onClick={() => dismiss.mutate(announcement.id)}>×</button>
      )}
    </div>
  );
}
```
