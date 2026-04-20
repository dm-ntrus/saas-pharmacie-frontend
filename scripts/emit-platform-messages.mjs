import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const fr = {
  brand: {
    tagline:
      "La plateforme SaaS pour piloter votre officine, de la caisse à la conformité.",
    region:
      "Conçu pour les pharmacies modernes — cloud, multi-utilisateurs, prêt pour l’Afrique et au-delà.",
  },
  valueStripAria: "Propositions de valeur",
  valueStrip: {
    n1: {
      title: "Un seul outil",
      text: "Ventes, stocks, patients, achats et finance dans une interface unifiée.",
    },
    n2: {
      title: "Multi-tenant sécurisé",
      text: "Espace dédié par pharmacie, rôles et permissions, traçabilité des actions.",
    },
    n3: {
      title: "Prêt pour la croissance",
      text: "Du point de vente à la chaîne d’approvisionnement et aux rapports décisionnels.",
    },
  },
  clientJourney: {
    sectionTag: "Parcours client",
    titleBeforeBrand: "Ce que vous faites avec",
    subtitle:
      "De l'onboarding à la fidélisation : une trajectoire claire pour votre équipe et vos patients.",
    ctaAllModules: "Voir tous les modules",
    ctaCreateSpace: "Créer mon espace →",
  },
  clientJourneySteps: {
    s1: {
      step: "01",
      title: "Démarrer en minutes",
      text: "Inscription, provisionnement de votre espace et connexion sécurisée (Keycloak). Votre équipe accède à son sous-domaine dédié.",
    },
    s2: {
      step: "02",
      title: "Configurer l’officine",
      text: "Paramètres, utilisateurs, modèles de documents, séquences — adaptez la plateforme à votre organisation.",
    },
    s3: {
      step: "03",
      title: "Opérer au quotidien",
      text: "Encaissez au POS, gérez l’inventaire, les prescriptions et les livraisons depuis un même écosystème.",
    },
    s4: {
      step: "04",
      title: "Piloter et fidéliser",
      text: "Tableaux de bord, rapports, fidélité et notifications pour animer la relation patient et sécuriser la marge.",
    },
  },
  trustedLogos: [
    "Pharmacie Centrale",
    "Groupe Santé",
    "BioMed Lab",
    "PharmaPlus",
    "MediCare Africa",
    "Global Health",
    "Kinshasa Pharma",
    "Lubumbashi Med",
  ],
  categories: {
    daily: {
      label: "Exécution quotidienne",
      intro: "Tout ce qui se passe au comptoir et en réserve, en temps réel.",
    },
    care: {
      label: "Patients & soins",
      intro: "Dossiers patients, ordonnances et suivi vaccinal au même endroit.",
    },
    supply: {
      label: "Chaîne d’approvisionnement",
      intro: "De la demande d’achat à la réception marchandise.",
    },
    finance: {
      label: "Finance, assurance & facturation",
      intro: "Encaissements, comptabilité opérationnelle et tiers payant.",
    },
    distribution: {
      label: "Distribution & service",
      intro: "Étendez votre pharmacie au-delà du comptoir.",
    },
    quality: {
      label: "Qualité & conformité",
      intro: "Maîtrise des risques et preuve de conformité.",
    },
    growth: {
      label: "Croissance & pilotage",
      intro: "Mesurer, décider, fidéliser.",
    },
    org: {
      label: "Équipe & plateforme",
      intro: "Gouvernance SaaS : utilisateurs, documents et abonnement.",
    },
  },
  modules: {
    dashboard: {
      title: "Tableau de bord",
      tagline: "Vue d’ensemble opérationnelle",
      description:
        "Indicateurs clés, raccourcis vers les modules et vision synthétique de l’activité de la pharmacie.",
      outcome0: "Priorisation des tâches du jour",
      outcome1: "Lecture rapide des volumes et alertes",
    },
    pos: {
      title: "Point de vente",
      tagline: "Caisse rapide et fiable",
      description:
        "Prise en charge des ventes au comptoir, panier, remises et expérience fluide pour réduire les files d’attente.",
      outcome0: "Ventes structurées et traçables",
      outcome1: "Interface pensée pour le terrain",
    },
    inventory: {
      title: "Inventaire",
      tagline: "Stocks, produits, réapprovisionnement",
      description:
        "Catalogue produits, mouvements, suggestions de réassort et pilotage des niveaux pour limiter la casse et la rupture.",
      outcome0: "Visibilité stock par produit / site",
      outcome1: "Alertes et suggestions d’achat",
    },
    patients: {
      title: "Patients",
      tagline: "Dossiers et relation soignant–patient",
      description:
        "Fiches patients, historique des interactions utiles à la dispensation et à la continuité des soins.",
      outcome0: "Moins d’erreurs d’identification",
      outcome1: "Historique centralisé côté officine",
    },
    prescriptions: {
      title: "Prescriptions",
      tagline: "Circuit ordonnance → dispensation",
      description:
        "Enregistrement et suivi des prescriptions pour sécuriser le flux entre prescription et délivrance.",
      outcome0: "Traçabilité des ordonnances",
      outcome1: "Meilleure coordination équipe",
    },
    vaccination: {
      title: "Vaccination",
      tagline: "Campagnes et registre",
      description:
        "Suivi des vaccinations dispensées en officine pour la conformité et le suivi patient.",
      outcome0: "Registre structuré",
      outcome1: "Appui aux campagnes locales",
    },
    suppliers: {
      title: "Fournisseurs",
      tagline: "Référentiel et relation fournisseurs",
      description:
        "Centralisez vos partenaires, conditions et bases pour enchaîner sur les commandes.",
      outcome0: "Référentiel unique",
      outcome1: "Préparation des flux d’achat",
    },
    "supply-chain": {
      title: "Supply chain",
      tagline: "Demandes, commandes, réceptions",
      description:
        "Demandes d’achat, bons de commande, réceptions (GRN), devis fournisseurs et pilotage des flux entrants.",
      outcome0: "Circuit achat documenté",
      outcome1: "Réconciliation réception / facture",
    },
    "billing-ops": {
      title: "Facturation (opérations)",
      tagline: "Factures clients et suivi",
      description:
        "Émission et suivi de la facturation liée à l’activité de l’officine (clients, règlements associés).",
      outcome0: "Factures alignées sur les ventes",
      outcome1: "Vision des créances",
    },
    payments: {
      title: "Paiements",
      tagline: "Mobile money, cartes, scénarios locaux",
      description:
        "Centralisation des moyens de paiement adaptés à votre marché (dont mobile money selon configuration).",
      outcome0: "Encaissement multi-canal",
      outcome1: "Réconciliation simplifiée",
    },
    accounting: {
      title: "Comptabilité",
      tagline: "Grand livre opérationnel",
      description:
        "Suivi comptable lié à l’activité : écritures, journaux et vision financière pour le gérant.",
      outcome0: "Lien ventes ↔ compta",
      outcome1: "Exports et contrôle de gestion",
    },
    "e-invoice": {
      title: "E-facture",
      tagline: "Facturation électronique",
      description:
        "Préparez-vous aux exigences de dématérialisation et d’échanges structurés avec l’écosystème.",
      outcome0: "Processus prêts pour la conformité",
      outcome1: "Moins de ressaisie",
      planNote: "Peut dépendre du plan ou des habilitations.",
    },
    insurance: {
      title: "Assurance",
      tagline: "Tiers payant et prises en charge",
      description:
        "Prise en charge des dossiers assurance pour accélérer le service au comptoir.",
      outcome0: "Moins de friction à l’encaissement",
      outcome1: "Traçabilité des prises en charge",
    },
    delivery: {
      title: "Livraisons",
      tagline: "Tournées et suivi des envois",
      description:
        "Gestion des livraisons pour offrir un service à domicile structuré et suivre les commandes.",
      outcome0: "Service client différenciant",
      outcome1: "Suivi des tournées / statuts",
    },
    quality: {
      title: "Qualité",
      tagline: "Processus et contrôles",
      description:
        "Cadre pour les exigences qualité en officine : procédures, contrôles et suivi.",
      outcome0: "Réduction des écarts",
      outcome1: "Culture qualité partagée",
    },
    "business-audit": {
      title: "Journal métier & audit",
      tagline: "Traçabilité des opérations sensibles",
      description:
        "Journalisation des événements métier pour audit interne, conformité et investigation.",
      outcome0: "Piste d’audit exploitable",
      outcome1: "Responsabilité clarifiée",
    },
    analytics: {
      title: "Analytics",
      tagline: "Indicateurs et tendances",
      description:
        "Analyses sur l’activité pour identifier les leviers de marge et d’écoulement.",
      outcome0: "Décisions basées sur les données",
      outcome1: "Priorisation des assortiments",
    },
    reports: {
      title: "Rapports",
      tagline: "Exports et synthèses",
      description:
        "Rapports métier et financiers pour le management et les obligations locales.",
      outcome0: "Vision consolidée",
      outcome1: "Partage avec comptable / direction",
    },
    loyalty: {
      title: "Fidélité",
      tagline: "Programmes et récompenses",
      description:
        "Fidélisation des patients avec mécaniques de points / avantages selon votre stratégie commerciale.",
      outcome0: "Récurrence et panier moyen",
      outcome1: "Campagnes ciblées",
      planNote: "Souvent activé par plan (entitlement).",
    },
    notifications: {
      title: "Notifications",
      tagline: "Alertes et messages opérationnels",
      description:
        "Informez l’équipe et les patients sur les événements importants (stocks, commandes, rappels).",
      outcome0: "Réactivité accrue",
      outcome1: "Moins d’oublis",
    },
    hr: {
      title: "Ressources humaines",
      tagline: "Équipe et organisation",
      description:
        "Pilotage des ressources humaines de l’officine en lien avec les accès et l’organisation du travail.",
      outcome0: "Vision RH centralisée",
      outcome1: "Alignement avec les rôles applicatifs",
    },
    settings: {
      title: "Paramètres",
      tagline: "Configuration métier",
      description:
        "Paramètres généraux, séquences documentaires, modèles et préférences pour adapter le SI à votre pharmacie.",
      outcome0: "Cohérence des numérotations",
      outcome1: "Personnalisation des impressions",
    },
    "saas-billing": {
      title: "Abonnement & facturation plateforme",
      tagline: "Votre relation commerciale avec SyntixPharma",
      description:
        "Gestion de l’abonnement SaaS, mises à niveau de plan et synchronisation avec la facturation selon votre offre.",
      outcome0: "Transparence des plans et options",
      outcome1: "Montée en gamme contrôlée",
      planNote: "Interface dédiée côté tenant (billing upgrade, factures).",
    },
  },
};

const en = {
  brand: {
    tagline:
      "The SaaS platform to run your pharmacy from the checkout to compliance.",
    region:
      "Built for modern pharmacies — cloud, multi-user, ready for Africa and beyond.",
  },
  valueStripAria: "Value propositions",
  valueStrip: {
    n1: {
      title: "One tool",
      text: "Sales, inventory, patients, purchasing, and finance in one unified interface.",
    },
    n2: {
      title: "Secure multi-tenant",
      text: "Dedicated space per pharmacy, roles and permissions, full action traceability.",
    },
    n3: {
      title: "Built to scale",
      text: "From point of sale to supply chain and decision-ready reporting.",
    },
  },
  clientJourney: {
    sectionTag: "Customer journey",
    titleBeforeBrand: "What you do with",
    subtitle:
      "From onboarding to loyalty: a clear path for your team and your patients.",
    ctaAllModules: "View all modules",
    ctaCreateSpace: "Create my workspace →",
  },
  clientJourneySteps: {
    s1: {
      step: "01",
      title: "Get started in minutes",
      text: "Sign up, provisioning of your space, and secure login (Keycloak). Your team uses its dedicated subdomain.",
    },
    s2: {
      step: "02",
      title: "Configure the pharmacy",
      text: "Settings, users, document templates, sequences — adapt the platform to your organization.",
    },
    s3: {
      step: "03",
      title: "Run day-to-day operations",
      text: "Check out at the POS, manage inventory, prescriptions, and deliveries from one ecosystem.",
    },
    s4: {
      step: "04",
      title: "Steer and retain",
      text: "Dashboards, reports, loyalty, and notifications to engage patients and protect margin.",
    },
  },
  trustedLogos: [
    "Central Pharmacy",
    "Santé Group",
    "BioMed Lab",
    "PharmaPlus",
    "MediCare Africa",
    "Global Health",
    "Kinshasa Pharma",
    "Lubumbashi Med",
  ],
  categories: {
    daily: {
      label: "Daily execution",
      intro: "Everything that happens at the counter and in the back office, in real time.",
    },
    care: {
      label: "Patients & care",
      intro: "Patient records, prescriptions, and vaccination tracking in one place.",
    },
    supply: {
      label: "Supply chain",
      intro: "From purchase request to goods receipt.",
    },
    finance: {
      label: "Finance, insurance & billing",
      intro: "Collections, operational accounting, and third-party payment.",
    },
    distribution: {
      label: "Distribution & service",
      intro: "Extend your pharmacy beyond the counter.",
    },
    quality: {
      label: "Quality & compliance",
      intro: "Risk control and audit-ready evidence.",
    },
    growth: {
      label: "Growth & steering",
      intro: "Measure, decide, retain.",
    },
    org: {
      label: "Team & platform",
      intro: "SaaS governance: users, documents, and subscription.",
    },
  },
  modules: {
    dashboard: {
      title: "Dashboard",
      tagline: "Operational overview",
      description:
        "Key metrics, shortcuts to modules, and a concise view of pharmacy activity.",
      outcome0: "Prioritize today’s tasks",
      outcome1: "Quick read on volumes and alerts",
    },
    pos: {
      title: "Point of sale",
      tagline: "Fast, reliable checkout",
      description:
        "Front-desk sales, basket, discounts, and a smooth experience to shorten queues.",
      outcome0: "Structured, traceable sales",
      outcome1: "UI built for the floor",
    },
    inventory: {
      title: "Inventory",
      tagline: "Stock, products, replenishment",
      description:
        "Product catalog, movements, reorder suggestions, and stock levels to limit waste and stockouts.",
      outcome0: "Stock visibility by product / site",
      outcome1: "Alerts and purchase suggestions",
    },
    patients: {
      title: "Patients",
      tagline: "Records and caregiver–patient relationship",
      description:
        "Patient files and interaction history to support dispensing and continuity of care.",
      outcome0: "Fewer identification errors",
      outcome1: "Centralized history at the pharmacy",
    },
    prescriptions: {
      title: "Prescriptions",
      tagline: "Prescription → dispensing flow",
      description:
        "Capture and track prescriptions to secure the path from prescription to delivery.",
      outcome0: "Prescription traceability",
      outcome1: "Better team coordination",
    },
    vaccination: {
      title: "Vaccination",
      tagline: "Campaigns and registry",
      description:
        "Track vaccinations delivered in-store for compliance and patient follow-up.",
      outcome0: "Structured registry",
      outcome1: "Support for local campaigns",
    },
    suppliers: {
      title: "Suppliers",
      tagline: "Directory and supplier relationships",
      description:
        "Centralize partners, terms, and foundations to move into ordering.",
      outcome0: "Single source of truth",
      outcome1: "Prepared purchasing flows",
    },
    "supply-chain": {
      title: "Supply chain",
      tagline: "Requests, orders, receipts",
      description:
        "Purchase requests, POs, GRNs, supplier quotes, and inbound flow management.",
      outcome0: "Documented purchasing path",
      outcome1: "Receipt / invoice reconciliation",
    },
    "billing-ops": {
      title: "Billing (operations)",
      tagline: "Customer invoices and tracking",
      description:
        "Issue and track billing tied to pharmacy activity (customers, related payments).",
      outcome0: "Invoices aligned with sales",
      outcome1: "Receivables visibility",
    },
    payments: {
      title: "Payments",
      tagline: "Mobile money, cards, local scenarios",
      description:
        "Centralize payment methods for your market (including mobile money where configured).",
      outcome0: "Multi-channel collection",
      outcome1: "Simpler reconciliation",
    },
    accounting: {
      title: "Accounting",
      tagline: "Operational ledger",
      description:
        "Activity-linked accounting: entries, journals, and financial insight for the owner.",
      outcome0: "Sales ↔ accounting link",
      outcome1: "Exports and management control",
    },
    "e-invoice": {
      title: "E-invoicing",
      tagline: "Electronic invoicing",
      description:
        "Prepare for dematerialization and structured exchange with the ecosystem.",
      outcome0: "Processes ready for compliance",
      outcome1: "Less re-keying",
      planNote: "May depend on plan or entitlements.",
    },
    insurance: {
      title: "Insurance",
      tagline: "Third-party payment and coverage",
      description:
        "Handle insurance cases to speed up service at the counter.",
      outcome0: "Less friction at checkout",
      outcome1: "Traceability of coverage",
    },
    delivery: {
      title: "Deliveries",
      tagline: "Routes and shipment tracking",
      description:
        "Manage deliveries for a structured home service and order tracking.",
      outcome0: "Differentiated customer service",
      outcome1: "Route / status tracking",
    },
    quality: {
      title: "Quality",
      tagline: "Processes and controls",
      description:
        "Framework for pharmacy quality requirements: procedures, controls, and monitoring.",
      outcome0: "Fewer deviations",
      outcome1: "Shared quality culture",
    },
    "business-audit": {
      title: "Business journal & audit",
      tagline: "Traceability of sensitive operations",
      description:
        "Business event logging for internal audit, compliance, and investigation.",
      outcome0: "Actionable audit trail",
      outcome1: "Clear accountability",
    },
    analytics: {
      title: "Analytics",
      tagline: "Indicators and trends",
      description:
        "Analyze activity to find margin and sell-through levers.",
      outcome0: "Data-driven decisions",
      outcome1: "Assortment prioritization",
    },
    reports: {
      title: "Reports",
      tagline: "Exports and summaries",
      description:
        "Business and financial reports for management and local obligations.",
      outcome0: "Consolidated view",
      outcome1: "Share with accountant / leadership",
    },
    loyalty: {
      title: "Loyalty",
      tagline: "Programs and rewards",
      description:
        "Retain patients with points / perks aligned with your commercial strategy.",
      outcome0: "Repeat visits and basket size",
      outcome1: "Targeted campaigns",
      planNote: "Often enabled by plan (entitlement).",
    },
    notifications: {
      title: "Notifications",
      tagline: "Alerts and operational messages",
      description:
        "Inform staff and patients about important events (stock, orders, reminders).",
      outcome0: "Higher responsiveness",
      outcome1: "Fewer oversights",
    },
    hr: {
      title: "Human resources",
      tagline: "Team and organization",
      description:
        "HR management for the pharmacy tied to access and ways of working.",
      outcome0: "Centralized HR view",
      outcome1: "Alignment with app roles",
    },
    settings: {
      title: "Settings",
      tagline: "Business configuration",
      description:
        "General settings, document sequences, templates, and preferences to fit the system to your pharmacy.",
      outcome0: "Consistent numbering",
      outcome1: "Customized printouts",
    },
    "saas-billing": {
      title: "Subscription & platform billing",
      tagline: "Your commercial relationship with SyntixPharma",
      description:
        "SaaS subscription management, plan upgrades, and billing sync per your offer.",
      outcome0: "Transparent plans and options",
      outcome1: "Controlled upsell",
      planNote: "Dedicated tenant UI (billing upgrade, invoices).",
    },
  },
};

writeFileSync(
  join(root, "messages", "platform-fr.json"),
  JSON.stringify({ platformModules: fr }, null, 2),
  "utf8",
);
writeFileSync(
  join(root, "messages", "platform-en.json"),
  JSON.stringify({ platformModules: en }, null, 2),
  "utf8",
);

console.log("Wrote messages/platform-fr.json and messages/platform-en.json");
