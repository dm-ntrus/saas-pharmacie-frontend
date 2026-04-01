/**
 * Contenu marketing aligné sur les modules réels du tenant (sidebar / produit).
 * Utilisé par la home, /modules et /features pour une narration cohérente.
 */

export type ModuleIconKey =
  | "LayoutDashboard"
  | "ShoppingCart"
  | "Package"
  | "Users"
  | "FileText"
  | "Syringe"
  | "Truck"
  | "Receipt"
  | "Wallet"
  | "BookOpen"
  | "Building2"
  | "GitBranch"
  | "ShieldCheck"
  | "Handshake"
  | "Sheet"
  | "UserCog"
  | "BarChart3"
  | "Bell"
  | "PieChart"
  | "Gift"
  | "ScrollText"
  | "Settings";

export type PlatformModule = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  icon: ModuleIconKey;
  /** Indique une fonctionnalité souvent liée à un plan / entitlement côté produit */
  planNote?: string;
};

export type ModuleCategory = {
  id: string;
  label: string;
  intro: string;
  modules: PlatformModule[];
};

export const MARKETING_BRAND = {
  name: "SyntixPharma",
  tagline: "La plateforme SaaS pour piloter votre officine, de la caisse à la conformité.",
  region: "Conçu pour les pharmacies modernes — cloud, multi-utilisateurs, prêt pour l’Afrique et au-delà.",
};

/** Propositions de valeur courtes (above the fold / bandeaux) */
export const VALUE_STRIP = [
  {
    title: "Un seul outil",
    text: "Ventes, stocks, patients, achats et finance dans une interface unifiée.",
  },
  {
    title: "Multi-tenant sécurisé",
    text: "Espace dédié par pharmacie, rôles et permissions, traçabilité des actions.",
  },
  {
    title: "Prêt pour la croissance",
    text: "Du point de vente à la chaîne d’approvisionnement et aux rapports décisionnels.",
  },
];

/** Parcours client — ce que vous pouvez faire dès l’adoption */
export const CLIENT_JOURNEY = [
  {
    step: "01",
    title: "Démarrer en minutes",
    text: "Inscription, provisionnement de votre espace et connexion sécurisée (Keycloak). Votre équipe accède à son sous-domaine dédié.",
  },
  {
    step: "02",
    title: "Configurer l’officine",
    text: "Paramètres, utilisateurs, modèles de documents, séquences — adaptez la plateforme à votre organisation.",
  },
  {
    step: "03",
    title: "Opérer au quotidien",
    text: "Encaissez au POS, gérez l’inventaire, les prescriptions et les livraisons depuis un même écosystème.",
  },
  {
    step: "04",
    title: "Piloter et fidéliser",
    text: "Tableaux de bord, rapports, fidélité et notifications pour animer la relation patient et sécuriser la marge.",
  },
];

export const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    id: "daily",
    label: "Exécution quotidienne",
    intro: "Tout ce qui se passe au comptoir et en réserve, en temps réel.",
    modules: [
      {
        id: "dashboard",
        title: "Tableau de bord",
        tagline: "Vue d’ensemble opérationnelle",
        description:
          "Indicateurs clés, raccourcis vers les modules et vision synthétique de l’activité de la pharmacie.",
        outcomes: [
          "Priorisation des tâches du jour",
          "Lecture rapide des volumes et alertes",
        ],
        icon: "LayoutDashboard",
      },
      {
        id: "pos",
        title: "Point de vente",
        tagline: "Caisse rapide et fiable",
        description:
          "Prise en charge des ventes au comptoir, panier, remises et expérience fluide pour réduire les files d’attente.",
        outcomes: [
          "Ventes structurées et traçables",
          "Interface pensée pour le terrain",
        ],
        icon: "ShoppingCart",
      },
      {
        id: "inventory",
        title: "Inventaire",
        tagline: "Stocks, produits, réapprovisionnement",
        description:
          "Catalogue produits, mouvements, suggestions de réassort et pilotage des niveaux pour limiter la casse et la rupture.",
        outcomes: [
          "Visibilité stock par produit / site",
          "Alertes et suggestions d’achat",
        ],
        icon: "Package",
      },
    ],
  },
  {
    id: "care",
    label: "Patients & soins",
    intro: "Dossiers patients, ordonnances et suivi vaccinal au même endroit.",
    modules: [
      {
        id: "patients",
        title: "Patients",
        tagline: "Dossiers et relation soignant–patient",
        description:
          "Fiches patients, historique des interactions utiles à la dispensation et à la continuité des soins.",
        outcomes: [
          "Moins d’erreurs d’identification",
          "Historique centralisé côté officine",
        ],
        icon: "Users",
      },
      {
        id: "prescriptions",
        title: "Prescriptions",
        tagline: "Circuit ordonnance → dispensation",
        description:
          "Enregistrement et suivi des prescriptions pour sécuriser le flux entre prescription et délivrance.",
        outcomes: [
          "Traçabilité des ordonnances",
          "Meilleure coordination équipe",
        ],
        icon: "FileText",
      },
      {
        id: "vaccination",
        title: "Vaccination",
        tagline: "Campagnes et registre",
        description:
          "Suivi des vaccinations dispensées en officine pour la conformité et le suivi patient.",
        outcomes: [
          "Registre structuré",
          "Appui aux campagnes locales",
        ],
        icon: "Syringe",
      },
    ],
  },
  {
    id: "supply",
    label: "Chaîne d’approvisionnement",
    intro: "De la demande d’achat à la réception marchandise.",
    modules: [
      {
        id: "suppliers",
        title: "Fournisseurs",
        tagline: "Référentiel et relation fournisseurs",
        description:
          "Centralisez vos partenaires, conditions et bases pour enchaîner sur les commandes.",
        outcomes: [
          "Référentiel unique",
          "Préparation des flux d’achat",
        ],
        icon: "Building2",
      },
      {
        id: "supply-chain",
        title: "Supply chain",
        tagline: "Demandes, commandes, réceptions",
        description:
          "Demandes d’achat, bons de commande, réceptions (GRN), devis fournisseurs et pilotage des flux entrants.",
        outcomes: [
          "Circuit achat documenté",
          "Réconciliation réception / facture",
        ],
        icon: "GitBranch",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance, assurance & facturation",
    intro: "Encaissements, comptabilité opérationnelle et tiers payant.",
    modules: [
      {
        id: "billing-ops",
        title: "Facturation (opérations)",
        tagline: "Factures clients et suivi",
        description:
          "Émission et suivi de la facturation liée à l’activité de l’officine (clients, règlements associés).",
        outcomes: [
          "Factures alignées sur les ventes",
          "Vision des créances",
        ],
        icon: "Receipt",
      },
      {
        id: "payments",
        title: "Paiements",
        tagline: "Mobile money, cartes, scénarios locaux",
        description:
          "Centralisation des moyens de paiement adaptés à votre marché (dont mobile money selon configuration).",
        outcomes: [
          "Encaissement multi-canal",
          "Réconciliation simplifiée",
        ],
        icon: "Wallet",
      },
      {
        id: "accounting",
        title: "Comptabilité",
        tagline: "Grand livre opérationnel",
        description:
          "Suivi comptable lié à l’activité : écritures, journaux et vision financière pour le gérant.",
        outcomes: [
          "Lien ventes ↔ compta",
          "Exports et contrôle de gestion",
        ],
        icon: "BookOpen",
      },
      {
        id: "e-invoice",
        title: "E-facture",
        tagline: "Facturation électronique",
        description:
          "Préparez-vous aux exigences de dématérialisation et d’échanges structurés avec l’écosystème.",
        outcomes: [
          "Processus prêts pour la conformité",
          "Moins de ressaisie",
        ],
        icon: "Sheet",
        planNote: "Peut dépendre du plan ou des habilitations.",
      },
      {
        id: "insurance",
        title: "Assurance",
        tagline: "Tiers payant et prises en charge",
        description:
          "Prise en charge des dossiers assurance pour accélérer le service au comptoir.",
        outcomes: [
          "Moins de friction à l’encaissement",
          "Traçabilité des prises en charge",
        ],
        icon: "Handshake",
      },
    ],
  },
  {
    id: "distribution",
    label: "Distribution & service",
    intro: "Étendez votre pharmacie au-delà du comptoir.",
    modules: [
      {
        id: "delivery",
        title: "Livraisons",
        tagline: "Tournées et suivi des envois",
        description:
          "Gestion des livraisons pour offrir un service à domicile structuré et suivre les commandes.",
        outcomes: [
          "Service client différenciant",
          "Suivi des tournées / statuts",
        ],
        icon: "Truck",
      },
    ],
  },
  {
    id: "quality",
    label: "Qualité & conformité",
    intro: "Maîtrise des risques et preuve de conformité.",
    modules: [
      {
        id: "quality",
        title: "Qualité",
        tagline: "Processus et contrôles",
        description:
          "Cadre pour les exigences qualité en officine : procédures, contrôles et suivi.",
        outcomes: [
          "Réduction des écarts",
          "Culture qualité partagée",
        ],
        icon: "ShieldCheck",
      },
      {
        id: "business-audit",
        title: "Journal métier & audit",
        tagline: "Traçabilité des opérations sensibles",
        description:
          "Journalisation des événements métier pour audit interne, conformité et investigation.",
        outcomes: [
          "Piste d’audit exploitable",
          "Responsabilité clarifiée",
        ],
        icon: "ScrollText",
      },
    ],
  },
  {
    id: "growth",
    label: "Croissance & pilotage",
    intro: "Mesurer, décider, fidéliser.",
    modules: [
      {
        id: "analytics",
        title: "Analytics",
        tagline: "Indicateurs et tendances",
        description:
          "Analyses sur l’activité pour identifier les leviers de marge et d’écoulement.",
        outcomes: [
          "Décisions basées sur les données",
          "Priorisation des assortiments",
        ],
        icon: "BarChart3",
      },
      {
        id: "reports",
        title: "Rapports",
        tagline: "Exports et synthèses",
        description:
          "Rapports métier et financiers pour le management et les obligations locales.",
        outcomes: [
          "Vision consolidée",
          "Partage avec comptable / direction",
        ],
        icon: "PieChart",
      },
      {
        id: "loyalty",
        title: "Fidélité",
        tagline: "Programmes et récompenses",
        description:
          "Fidélisation des patients avec mécaniques de points / avantages selon votre stratégie commerciale.",
        outcomes: [
          "Récurrence et panier moyen",
          "Campagnes ciblées",
        ],
        icon: "Gift",
        planNote: "Souvent activé par plan (entitlement).",
      },
      {
        id: "notifications",
        title: "Notifications",
        tagline: "Alertes et messages opérationnels",
        description:
          "Informez l’équipe et les patients sur les événements importants (stocks, commandes, rappels).",
        outcomes: [
          "Réactivité accrue",
          "Moins d’oublis",
        ],
        icon: "Bell",
      },
    ],
  },
  {
    id: "org",
    label: "Équipe & plateforme",
    intro: "Gouvernance SaaS : utilisateurs, documents et abonnement.",
    modules: [
      {
        id: "hr",
        title: "Ressources humaines",
        tagline: "Équipe et organisation",
        description:
          "Pilotage des ressources humaines de l’officine en lien avec les accès et l’organisation du travail.",
        outcomes: [
          "Vision RH centralisée",
          "Alignement avec les rôles applicatifs",
        ],
        icon: "UserCog",
      },
      {
        id: "settings",
        title: "Paramètres",
        tagline: "Configuration métier",
        description:
          "Paramètres généraux, séquences documentaires, modèles et préférences pour adapter le SI à votre pharmacie.",
        outcomes: [
          "Cohérence des numérotations",
          "Personnalisation des impressions",
        ],
        icon: "Settings",
      },
      {
        id: "saas-billing",
        title: "Abonnement & facturation plateforme",
        tagline: "Votre relation commerciale avec SyntixPharma",
        description:
          "Gestion de l’abonnement SaaS, mises à niveau de plan et synchronisation avec la facturation (ex. Stripe) selon votre offre.",
        outcomes: [
          "Transparence des plans et options",
          "Montée en gamme contrôlée",
        ],
        icon: "Receipt",
        planNote: "Interface dédiée côté tenant (billing upgrade, factures).",
      },
    ],
  },
];

export const TOTAL_PLATFORM_MODULES = MODULE_CATEGORIES.reduce(
  (n, c) => n + c.modules.length,
  0,
);

function moduleById(id: string): PlatformModule {
  const m = MODULE_CATEGORIES.flatMap((c) => c.modules).find((x) => x.id === id);
  if (!m) throw new Error(`platform-marketing: module id "${id}" not found`);
  return m;
}

/** Sous-ensemble pour la home — les piliers visuels */
export const HOMEPAGE_MODULE_HIGHLIGHTS: PlatformModule[] = [
  moduleById("pos"),
  moduleById("inventory"),
  moduleById("patients"),
  moduleById("supply-chain"),
  moduleById("analytics"),
  moduleById("loyalty"),
];

/** Cartes « capacités » home — messaging orienté bénéfice (complète la grille existante) */
export const HOMEPAGE_CAPABILITY_CARDS = [
  {
    title: "Inventaire & réassort",
    description:
      "Produits, mouvements, suggestions de réapprovisionnement — moins de ruptures, moins de péremption.",
    highlight: "Stock sous contrôle",
    icon: "Package" as ModuleIconKey,
  },
  {
    title: "Prescriptions & patients",
    description:
      "Circuit ordonnance, dossiers patients et vaccination pour un service soignant structuré.",
    highlight: "Sécurité de dispensation",
    icon: "FileText" as ModuleIconKey,
  },
  {
    title: "Ventes & paiements",
    description:
      "POS moderne, facturation opérationnelle et moyens de paiement adaptés à votre marché.",
    highlight: "Encaissement fluide",
    icon: "ShoppingCart" as ModuleIconKey,
  },
  {
    title: "Achats & fournisseurs",
    description:
      "Demandes d’achat, commandes, réceptions et performance fournisseurs dans un même fil.",
    highlight: "Supply chain intégrée",
    icon: "GitBranch" as ModuleIconKey,
  },
  {
    title: "Pilotage & rapports",
    description:
      "Tableaux de bord, rapports et BI pour arbitrer marges, volumes et équipes.",
    highlight: "Décisions éclairées",
    icon: "BarChart3" as ModuleIconKey,
  },
  {
    title: "Conformité & audit",
    description:
      "Qualité, journal métier et paramètres documentaires pour répondre aux contrôles.",
    highlight: "Traçabilité",
    icon: "ShieldCheck" as ModuleIconKey,
  },
];
