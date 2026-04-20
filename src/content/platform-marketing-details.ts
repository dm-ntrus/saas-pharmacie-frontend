import type { ModuleIconKey } from "./platform-marketing-types";

export type MarketingModuleDetail = {
  id: string;
  icon?: ModuleIconKey;
  /** Accroche plus “page” (optionnel). */
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  /** Promesse concrète (marketing). */
  keyBenefits: string[];
  /** Fonctionnalités (niveau module). */
  capabilities: string[];
  /** Sous-fonctionnalités (niveau “détails”). */
  subCapabilities?: string[];
  /** Intégrations / dépendances. */
  integrations?: string[];
  /** Cas d’usage. */
  bestFor?: string[];
  /** Indicateurs (KPIs) suivis pour piloter la performance. */
  kpis?: string[];
  /** Exemples concrets d'usage métier. */
  useCases?: { title: string; scenario: string }[];
};

/**
 * Détails marketing enrichis (résumés depuis la doc `docs/ANALYSE_COMPLETE_PROJET_TENANT*`).
 * Objectif: alimenter les pages marketing `/modules/[id]`.
 */
export const MARKETING_MODULE_DETAILS: Record<string, MarketingModuleDetail> = {
  // ─────────────────────────── Daily / core ───────────────────────────
  dashboard: {
    id: "dashboard",
    keyBenefits: ["Vision opérationnelle immédiate", "Moins de dispersion", "Priorisation des actions"],
    capabilities: ["KPIs clés", "Raccourcis module", "Alertes & signalements"],
    subCapabilities: ["Tuiles personnalisables", "Indicateurs par période", "Accès rapide aux tâches"],
  },
  pos: {
    id: "pos",
    keyBenefits: ["Encaissement plus rapide", "Moins d’erreurs de caisse", "Meilleure expérience comptoir"],
    capabilities: ["Panier multi-articles", "Remises & taxes", "Paiements multi-méthodes", "Tickets & historique"],
    subCapabilities: ["Modes cash/card/mobile money", "Ventes à crédit", "Remboursements/retours", "Sessions de caisse"],
  },
  inventory: {
    id: "inventory",
    keyBenefits: ["Réduire ruptures et périmés", "Visibilité stock", "Réassort plus intelligent"],
    capabilities: [
      "Inventaire & stock (articles, emplacements, mouvements)",
      "Lots & péremption (traçage, blocages, règles FEFO/FIFO)",
      "Réapprovisionnement (seuils, suggestions, commandes fournisseur)",
      "Réservations & allocations (gestion des conflits et expirations)",
      "Réception fournisseur (contrôle qualité d’entrée, création de lots)",
      "Pricing & déstockage (promos ciblées sur lots proches péremption)",
      "Reporting & BI inventaire (valeur stock, vieillissement, exports)",
      "Conformité & traçabilité (journal d’audit des mouvements)",
      "Prévisions de demande (pour dimensionner stock et réassort)",
      "Référentiel SKU & catalogue fournisseurs (mapping, lead time)",
    ],
    subCapabilities: [
      "CRUD articles & ajustements",
      "Transferts entre emplacements",
      "Réceptions / sorties / retours",
      "Alertes rupture, péremption, anomalies",
      "Politique min/max, stock de sécurité, délai d’approvisionnement",
      "Picking/fulfilment (sortie stock contrôlée)",
      "Réservations avec libération automatique et rollback",
    ],
    kpis: [
      "Taux de rupture",
      "Couverture en jours",
      "Stock périmé (%)",
      "% de lots périmés",
      "Alertes traitées",
      "Délai moyen de réapprovisionnement",
      "OTIF fournisseur",
      "Valeur immobilisée",
    ],
    useCases: [
      {
        title: "Limiter les pertes",
        scenario:
          "Identifier les lots proches de péremption, proposer un déstockage ciblé et suivre l’impact sur le stock périmé.",
      },
      {
        title: "Sécuriser la délivrance",
        scenario:
          "Bloquer automatiquement la vente d’un lot non conforme et tracer toutes les actions jusqu’au client.",
      },
    ],
  },

  // ─────────────────────────── Care ───────────────────────────
  patients: {
    id: "patients",
    keyBenefits: ["Dossiers propres", "Moins d’erreurs d’identification", "Historique exploitable"],
    capabilities: ["Profil patient", "Allergies/conditions", "Assurance (références)", "Historique"],
    subCapabilities: ["Préférences communication", "Consentements", "Lien patient-utilisateur"],
  },
  prescriptions: {
    id: "prescriptions",
    keyBenefits: ["Flux sécurisé ordonnance → délivrance", "Traçabilité", "Moins d’oublis"],
    capabilities: ["Cycle de vie complet", "Statuts & suivi", "Dispensation", "Alertes fin de traitement"],
    subCapabilities: [
      "OCR / ingestion (si activé)",
      "Analyse interactions/allergies",
      "Substitution (génériques/équivalents)",
      "Substances contrôlées",
      "Préparation de doses",
      "Revue médicamenteuse",
    ],
    integrations: ["Patients", "Inventaire", "Notifications", "Assurance (selon activation)"],
  },
  vaccination: {
    id: "vaccination",
    keyBenefits: ["Registre conforme", "Meilleur suivi patient", "Campagnes structurées"],
    capabilities: ["Rendez-vous", "Dossiers vaccinaux", "Certificats", "Traçabilité lots/fioles"],
    subCapabilities: ["Rappels automatiques", "QR code", "Pharmacovigilance"],
  },

  // ─────────────────────────── IA ───────────────────────────
  ai: {
    id: "ai",
    keyBenefits: [
      "Accélérer la délivrance tout en réduisant les erreurs",
      "Aider la décision (interactions, substitutions, recommandations)",
      "Capitaliser la connaissance (audit, feedback, gouvernance)",
    ],
    capabilities: [
      "Copilot métier (assistant conversationnel programmable)",
      "Contexte multi‑tour (mémoire de session et continuité)",
      "Suggestions d’actions (réappro, réservation, préparation, tickets)",
      "Exécution guidée de workflows (avec validation avant action)",
      "Personnalisation par rôle, profil et historique",
      "Sécurité intégrée (filtres, validations, contrôle d’accès)",
      "Traçabilité complète des actions initiées par le copilot",
    ],
    subCapabilities: [
      "Support: répondre et orienter avec un contexte fiable",
      "Opérations: proposer puis exécuter des actions (sur confirmation)",
      "Suggestions FEFO/FIFO‑aware (ex: utiliser le lot qui expire le plus tôt)",
      "Suggestions proactives (péremption → proposer promo/réaffectation)",
      "Enrichissement du contexte par données métier avant réponse",
    ],
    integrations: ["Inventaire", "Commandes", "Réapprovisionnement", "Audit & conformité"],
    bestFor: [
      "Officines à fort volume",
      "Équipes multi-sites",
      "Pharmacies voulant standardiser la qualité de délivrance",
    ],
    kpis: [
      "Taux d’actions automatiques réussies via copilot",
      "Taux de satisfaction / correction humaine",
      "Temps moyen de résolution (copilot vs humain)",
      "Nombre d’escalades vers un opérateur",
    ],
    useCases: [
      {
        title: "Agent support",
        scenario:
          "« Quel lot expire bientôt ? » → réponse + proposition d’action « lancer un déstockage ».",
      },
      {
        title: "Assistant opérations",
        scenario:
          "« Prépare le picking pour une commande » → réserve le stock, génère une liste et demande confirmation avant sortie.",
      },
      {
        title: "Assistant gestion",
        scenario:
          "« Propose un réapprovisionnement » → suggère une commande basée sur la couverture, la saisonnalité et les alertes.",
      },
    ],
  },

  // ─────────────────────────── Supply ───────────────────────────
  suppliers: {
    id: "suppliers",
    keyBenefits: ["Référentiel fournisseur propre", "Achats plus fluides", "Meilleure négociation"],
    capabilities: ["Fiches fournisseurs", "Conditions", "Historique commandes", "Évaluation"],
    subCapabilities: ["Licences & certifications", "Contrats fournisseurs", "Performance (OTIF/qualité)"],
  },
  "supply-chain": {
    id: "supply-chain",
    keyBenefits: ["Réduire les ruptures", "Réception mieux contrôlée", "Traçabilité achats"],
    capabilities: [
      "Demandes d’achat",
      "Bons de commande (suivi et statuts)",
      "Réceptions (quantité, qualité, lots)",
      "Devis & contrats fournisseurs",
      "Prévisions de demande",
      "Politiques d’inventaire (point de commande, stock sécurité)",
      "Alertes supply chain",
      "Dashboard supply chain",
    ],
    subCapabilities: [
      "Matching commande ↔ réception",
      "Réception partielle / complète",
      "Comparaison multi-fournisseurs",
      "Performance fournisseurs (OTIF, qualité, délais)",
    ],
    kpis: ["OTIF fournisseur", "Délai moyen de réappro", "Temps de traitement réception", "Écarts commandé vs reçu"],
    integrations: ["Inventaire", "Comptabilité", "Notifications"],
  },

  // ─────────────────────────── B2B ───────────────────────────
  partners: {
    id: "partners",
    keyBenefits: ["Référentiel B2B unifié", "Moins de doublons", "Meilleure exécution commerciale"],
    capabilities: ["Types partenaires", "Contacts & adresses", "Limites de crédit (lien)"],
    subCapabilities: ["Webhooks partenaires", "Statuts (blacklist/suspendu)", "Score risque"],
  },
  "sales-orders-b2b": {
    id: "sales-orders-b2b",
    keyBenefits: ["Cycle B2B standardisé", "Meilleure allocation stock", "Livraisons plus fiables"],
    capabilities: ["Devis", "Commandes", "Allocation stock", "Picking/expédition", "Facturation/paiement"],
    subCapabilities: ["Backorders", "Contrôle crédit", "Statuts par ligne", "Suivi expédition"],
  },
  "credit-control": {
    id: "credit-control",
    keyBenefits: ["Réduction du risque", "Blocage automatique en cas de dépassement", "Recouvrement structuré"],
    capabilities: ["Comptes de crédit", "Événements de crédit", "Vérifications", "Approbations d’exception"],
    subCapabilities: ["Scoring risque", "Aging 30/60/90", "Relances automatiques", "Promesses de paiement"],
  },
  "returns-rma": {
    id: "returns-rma",
    keyBenefits: ["Retours contrôlés", "Qualité renforcée", "Avoirs/remboursements cadrés"],
    capabilities: ["RMA client/fournisseur", "Inspection QC", "Actions retour", "Avoirs/remboursements"],
    subCapabilities: ["Photos & notes", "Quarantaine", "Décisions QC", "Traçabilité lot/expiration"],
  },
  "commercial-terms": {
    id: "commercial-terms",
    keyBenefits: ["Politique prix cohérente", "Promotions maîtrisées", "Marge protégée"],
    capabilities: ["Listes de prix", "Règles de remise", "Promotions", "Ristournes (rebates)"],
    subCapabilities: ["Remises par palier/volume", "Périodes de validité", "Clients/segments applicables"],
  },
  "b2b-integrations": {
    id: "b2b-integrations",
    keyBenefits: ["Moins de ressaisie", "Meilleure fiabilité des échanges", "Partenaires mieux servis"],
    capabilities: ["EDI (EDIFACT/X12)", "APIs partenaires", "Webhooks", "Mapping & transformation"],
    subCapabilities: ["Monitoring SLA", "Retry/erreurs", "Jobs asynchrones B2B"],
  },
  "b2b-governance": {
    id: "b2b-governance",
    keyBenefits: ["Contrats et SLA maîtrisés", "Exceptions cadrées", "Conformité renforcée"],
    capabilities: ["Contrats B2B", "Workflows d’approbation", "Règles métier", "Audit B2B"],
    subCapabilities: ["Délégations", "Historique approbations", "Pénalités/bonus"],
  },
  "b2b-dashboard": {
    id: "b2b-dashboard",
    keyBenefits: ["Pilotage exécutif", "Détection de churn/risque", "Priorisation des clients"],
    capabilities: ["KPIs (OTIF, DSO, marge)", "Performance clients", "Performance produits", "Rapports exécutifs"],
  },
  "ap-matching": {
    id: "ap-matching",
    keyBenefits: ["Réduction des écarts fournisseur", "Moins de litiges", "Traitement comptable plus rapide"],
    capabilities: ["Matching facture fournisseur ↔ BC ↔ réception", "Détection des écarts", "Workflow d'approbation des écarts"],
    subCapabilities: ["Tolérances configurables", "Justificatifs et audit trail", "Priorisation des anomalies"],
    integrations: ["Supply chain", "Facturation", "Comptabilité"],
  },
  "b2b-async": {
    id: "b2b-async",
    keyBenefits: ["Résilience des flux B2B", "Moins d'échecs silencieux", "Visibilité opérationnelle"],
    capabilities: ["Orchestration jobs asynchrones", "Retry intelligent", "Monitoring SLA des échanges"],
    subCapabilities: ["Historique des tentatives", "Diagnostic d'erreur", "Relance manuelle contrôlée"],
    integrations: ["B2B intégrations", "Notifications", "Audit"],
  },
  "pricing-desk": {
    id: "pricing-desk",
    keyBenefits: ["Marge protégée", "Règles de prix cohérentes", "Décisions commerciales plus rapides"],
    capabilities: ["Grilles tarifaires", "Règles de remise", "Simulations d'impact marge"],
    subCapabilities: ["Segmentation client", "Périodes de validité", "Gouvernance des exceptions"],
    integrations: ["Commercial terms", "B2B commandes", "Facturation"],
  },
  "credit-desk": {
    id: "credit-desk",
    keyBenefits: ["Risque client mieux maîtrisé", "Encours sous contrôle", "Arbitrage crédit plus structuré"],
    capabilities: ["Suivi des limites et encours", "Scoring et alertes risque", "Workflow d'override crédit"],
    subCapabilities: ["Aging 30/60/90", "Promesses de paiement", "Escalade et approbation"],
    integrations: ["Credit control", "B2B dashboard", "Recouvrement"],
  },

  // ─────────────────────────── Finance ───────────────────────────
  "billing-ops": {
    id: "billing-ops",
    keyBenefits: [
      "Cycle quote-to-cash structuré",
      "Recouvrement plus prévisible",
      "Réduction des écarts de facturation",
    ],
    capabilities: [
      "Facturation vente et B2B (proforma, facture, avoir)",
      "Lignes de factures, remises, taxes, échéances et statuts",
      "Suivi des encours, retards et relances opérationnelles",
      "Gestion notes de crédit/débit et ajustements commerciaux",
      "Rapprochement opérationnel avec paiements et commandes",
      "Exports et reporting facturation multi-périmètre",
    ],
    subCapabilities: [
      "Gestion des transitions de statut et workflows d'approbation",
      "Annulation/remboursement avec piste d'audit",
      "Scénarios B2B (override, litiges, exceptions validées)",
    ],
    integrations: ["Sales", "B2B orders", "Payments", "Accounting", "AP matching"],
    kpis: [
      "DSO (Days Sales Outstanding)",
      "Taux de factures en retard",
      "Taux d'erreurs de facturation",
      "Délai moyen de conversion devis → facture",
    ],
  },
  payments: {
    id: "payments",
    keyBenefits: [
      "Encaissement multi-canal localisé",
      "Réconciliation accélérée",
      "Traçabilité complète des transactions",
    ],
    capabilities: [
      "Paiements cash, cartes, mobile money et modes alternatifs",
      "Moteur de paiement unifié avec statuts et références",
      "Preuves de paiement et vérification/validation",
      "Webhooks et callbacks providers avec retry",
      "Remboursements, annulations et gestion des incidents paiement",
      "Consolidation des paiements pour reporting financier",
    ],
    subCapabilities: [
      "Upload de pièces justificatives et contrôle manuel",
      "Support opérateurs régionaux et multi-devises (selon config)",
      "Gestion des erreurs provider et plans de reprise",
    ],
    integrations: ["Billing ops", "SaaS billing", "Accounting", "Notifications"],
    kpis: [
      "Taux de succès paiement",
      "Temps moyen de confirmation paiement",
      "Taux de litiges/remboursements",
      "Taux de rapprochement automatique",
    ],
  },
  accounting: {
    id: "accounting",
    keyBenefits: [
      "Comptabilité multi-normes (OHADA / IFRS / US GAAP)",
      "Automatisation des écritures avec gouvernance forte",
      "Vision financière fiable pour pilotage et audit",
    ],
    capabilities: [
      "Plan comptable dynamique par tenant (templates + personnalisation)",
      "Moteur de traduction comptable (événement métier → écritures)",
      "Règles de comptabilisation paramétrables (posting rules)",
      "Grand livre, journaux, comptes et périodes financières",
      "Budgets, dépenses, transactions bancaires et reporting",
      "Comptabilité analytique (dimensions, allocations, modèles réutilisables)",
      "Gestion des taxes (taux, règles) et préparation e-invoicing",
      "Contrôles de conformité (immutabilité, clôture de période, audit trail)",
    ],
    subCapabilities: [
      "Normalisation des standards comptables et aliases (ex: GAP → US_GAAP)",
      "Onboarding enterprise par lot (scripts et runbook)",
      "Validation stricte des allocations analytiques avec équilibrage",
      "Templates d'allocation analytiques personnalisés par tenant",
      "CRUD règles comptables et dimensions analytiques",
      "Endpoints dédiés pour journal, budgets, périodes, taxes et allocations",
      "Exports et rapprochement avec facturation/paiements",
    ],
    integrations: ["Facturation", "Paiements", "Supply chain", "Fiscal / e-invoice", "Audit métier"],
    kpis: [
      "Délai de clôture mensuelle",
      "Taux d'écritures automatiques",
      "Taux d'anomalies de validation comptable",
      "Dérive budget vs réalisé",
      "Taux d'allocations analytiques équilibrées",
      "Temps moyen de résolution des écarts comptables",
    ],
    useCases: [
      {
        title: "Internationalisation comptable",
        scenario:
          "Une même transaction métier est traduite automatiquement selon la norme du tenant (OHADA/IFRS/US GAAP) avec règles locales et plan comptable dédié.",
      },
      {
        title: "Clôture et conformité",
        scenario:
          "L'équipe clôture une période, verrouille les écritures, produit les rapports financiers et conserve une piste d'audit exploitable.",
      },
      {
        title: "Pilotage analytique",
        scenario:
          "Les coûts sont ventilés sur des dimensions analytiques (rayon, projet, centre de coût) avec validation d'équilibre avant enregistrement.",
      },
    ],
  },
  insurance: {
    id: "insurance",
    keyBenefits: [
      "Parcours tiers payant plus fluide",
      "Meilleure visibilité sur les dossiers assureurs",
      "Réduction des rejets et retards de prise en charge",
    ],
    capabilities: [
      "Référentiel assureurs, contrats et paramètres de couverture",
      "Création et suivi des claims/réclamations",
      "Cycle de statut assureur (soumis, en attente, payé, rejeté)",
      "Rapprochement règlement assureur ↔ facturation",
      "Pilotage remises, participations patient et reste à charge",
    ],
    subCapabilities: [
      "Éligibilité en temps réel (si connecteur disponible)",
      "Historique complet du dossier et pièces justificatives",
      "Analyse de performance par assureur et motif de rejet",
    ],
    integrations: ["Patients", "Prescriptions", "Billing ops", "Accounting"],
    kpis: [
      "Taux d'acceptation des claims",
      "Délai moyen de remboursement assureur",
      "Taux de rejet par assureur",
      "Montant en attente de remboursement",
    ],
  },
  "e-invoice": {
    id: "e-invoice",
    keyBenefits: [
      "Conformité fiscale renforcée",
      "Moins d'opérations manuelles",
      "Audit fiscal prêt à l'emploi",
    ],
    capabilities: [
      "Génération de e-factures conformes au format attendu",
      "Soumission aux plateformes fiscales (OBR/DGI/équivalent selon intégration)",
      "Gestion des statuts fiscaux (soumis, validé, rejeté, annulé, retry)",
      "Gestion des identifiants fiscaux, credentials et certificats",
      "Rapports fiscaux et piste d'audit réglementaire",
    ],
    subCapabilities: [
      "Signature, horodatage et QR code réglementaire",
      "Retry intelligent et gestion des erreurs de soumission",
      "Journal détaillé des échanges avec l'autorité fiscale",
    ],
    integrations: ["Billing ops", "Accounting", "Fiscal compliance", "Business audit"],
    kpis: [
      "Taux de soumission fiscale réussie",
      "Temps moyen de validation fiscale",
      "Taux de rejet e-facture",
      "Délai de résolution des erreurs fiscales",
    ],
  },

  // ─────────────────────────── Distribution / service ───────────────────────────
  delivery: {
    id: "delivery",
    keyBenefits: ["Service différenciant", "Suivi fiable", "Meilleure satisfaction"],
    capabilities: ["Commandes livraison", "Zones", "Livreurs", "Tracking", "Preuve de livraison"],
    subCapabilities: ["Optimisation de routes", "Créneaux", "Extras (express/assurance)"],
  },

  // ─────────────────────────── Quality / compliance ───────────────────────────
  quality: {
    id: "quality",
    keyBenefits: ["Réduction des non-conformités", "Processus standard", "Culture qualité"],
    capabilities: ["Incidents qualité", "CAPA", "Audits internes", "Documents qualité"],
    subCapabilities: ["Checklists", "Métriques qualité", "Archivage"],
  },
  "business-audit": {
    id: "business-audit",
    keyBenefits: ["Traçabilité complète", "Investigation rapide", "Responsabilité clarifiée"],
    capabilities: ["Journal d’événements", "Recherche/filtrage", "Exports"],
    subCapabilities: ["Accès aux opérations sensibles", "Avant/après", "Métadonnées"],
  },
  "inventory-recalls": {
    id: "inventory-recalls",
    keyBenefits: ["Réaction rapide aux rappels", "Risque patient réduit", "Conformité démontrable"],
    capabilities: ["Campagnes de rappel lot", "Blocage des lots impactés", "Traçabilité des actions correctives"],
    subCapabilities: ["Recherche multi-critères", "Suivi statut rappel", "Exports auditables"],
    integrations: ["Inventaire", "Traçabilité", "Qualité"],
  },
  "controlled-substances": {
    id: "controlled-substances",
    keyBenefits: ["Conformité réglementaire renforcée", "Réduction des écarts sensibles", "Audit simplifié"],
    capabilities: ["Registre des mouvements sensibles", "Contrôles d'accès et validations", "Journal d'événements sécurisés"],
    subCapabilities: ["Double validation", "Historique inviolable", "Alertes d'anomalies"],
    integrations: ["Prescriptions", "Inventaire", "Audit métier"],
  },

  // ─────────────────────────── Growth / steering ───────────────────────────
  analytics: {
    id: "analytics",
    keyBenefits: ["Décisions basées données", "Marge mieux pilotée", "Rotation optimisée"],
    capabilities: ["Dashboards", "KPIs", "Alertes", "Sources de données (selon activation)"],
    subCapabilities: ["Rapports personnalisés", "Exports", "Temps réel (si activé)"],
  },
  reports: {
    id: "reports",
    keyBenefits: ["Synthèses rapides", "Partage avec direction/comptable", "Conformité locale"],
    capabilities: ["Rapports prédéfinis", "Exports PDF/Excel", "Filtres et groupements"],
  },
  loyalty: {
    id: "loyalty",
    keyBenefits: ["Récurrence", "Panier moyen", "Segmentation"],
    capabilities: ["Programmes points/cashback/niveaux", "Comptes fidélité", "Récompenses"],
    subCapabilities: ["Bonus anniversaire", "Expiration points", "Campagnes ciblées"],
  },
  notifications: {
    id: "notifications",
    keyBenefits: ["Moins d’oublis", "Réactivité", "Service patient amélioré"],
    capabilities: ["Email/SMS/WhatsApp/Push", "Templates", "Préférences", "Historique"],
    subCapabilities: ["Files d’attente", "Retry/DLQ", "Ouvertures/clics (si activé)"],
  },

  // ─────────────────────────── Org / platform ───────────────────────────
  hr: {
    id: "hr",
    keyBenefits: ["Organisation plus claire", "Suivi RH", "Alignement rôles ↔ accès"],
    capabilities: ["Employés", "Horaires", "Présence", "Congés", "Paie", "Évaluations"],
  },
  settings: {
    id: "settings",
    keyBenefits: ["Plateforme adaptée à l’organisation", "Cohérence documentaire", "Moins d’erreurs"],
    capabilities: ["Séquences de documents", "Modèles", "Paramètres généraux", "Préférences"],
  },
  "role-security": {
    id: "role-security",
    keyBenefits: ["Accès aligné aux responsabilités", "Moins de risques d'erreur humaine", "Sécurité opérationnelle"],
    capabilities: ["Rôles et permissions granulaires", "Affectation par utilisateur/équipe", "Politiques d'accès tenant"],
    subCapabilities: ["Journal des changements de rôles", "Revues périodiques", "Contrôles de séparation des tâches"],
    integrations: ["Paramètres", "Audit métier", "Notifications sécurité"],
  },
  "saas-billing": {
    id: "saas-billing",
    keyBenefits: ["Transparence plan", "Montée en gamme contrôlée", "Suivi abonnement"],
    capabilities: ["Gestion plan", "Upgrade", "Factures plateforme (selon configuration)"],
  },

  // ─────────────────────── Chaîne du froid ───────────────────────
  "cold-chain": {
    id: "cold-chain",
    keyBenefits: [
      "Limiter la casse sur produits sensibles",
      "Détecter les excursions de température plus tôt",
      "Prouver la conformité en cas d’audit",
    ],
    capabilities: [
      "Équipements & capteurs (inventaire, maintenance, calibration)",
      "Monitoring température (seuils, tendances, historique)",
      "Alertes & escalade (incident, porte ouverte, panne, etc.)",
      "Rapports de conformité",
    ],
    subCapabilities: [
      "Relevés automatiques",
      "Seuils min/max configurables",
      "Historique par lot / produit sensible",
      "Actions correctives documentées",
    ],
  },

  // ───────────────────── Compounding (préparations) ─────────────────────
  compounding: {
    id: "compounding",
    keyBenefits: [
      "Structurer les préparations et réduire les écarts",
      "Tracer ingrédients → lot → patient",
      "Standardiser la documentation",
    ],
    capabilities: [
      "Formules (ingrédients, instructions, stabilité)",
      "Lots de préparation (statuts, dates, signatures)",
      "Contrôle qualité (tests, conformité)",
      "Dossier de lot (documents, archivage)",
    ],
    subCapabilities: [
      "Équipement requis & temps de préparation",
      "Traçabilité des ingrédients (lots)",
      "Étiquetage & preuves",
    ],
  },

  // ───────────────────── Téléconsultation ─────────────────────
  teleconsultation: {
    id: "teleconsultation",
    keyBenefits: [
      "Étendre le service au-delà du comptoir",
      "Améliorer l’accès aux conseils",
      "Fluidifier le parcours patient (selon réglementation)",
    ],
    capabilities: [
      "Sessions (vidéo/audio/chat) et statut",
      "Notes de consultation et recommandations",
      "Prescription à distance (si autorisé) et suivi",
    ],
    integrations: ["Notifications (rappels)", "Patients & prescriptions"],
  },

  // ───────────────────── Traçabilité avancée ─────────────────────
  traceability: {
    id: "traceability",
    keyBenefits: [
      "Mieux sécuriser l’authenticité des lots",
      "Accélérer les investigations (rappels, incidents qualité)",
      "Améliorer la non-répudiation (preuves, horodatage)",
    ],
    capabilities: [
      "Traçabilité renforcée des lots et mouvements",
      "Vérifications et preuves",
      "Audit trail exploitable",
    ],
    subCapabilities: [
      "Cas d’usage: lots, supply chain, prescriptions, certificats",
      "Historique et validation",
    ],
  },
};

