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

  // ─────────────────────────── Finance ───────────────────────────
  "billing-ops": {
    id: "billing-ops",
    keyBenefits: ["Facturation fiable", "Suivi des créances", "Moins d’écarts"],
    capabilities: ["Factures (vente/B2B)", "Articles facture", "Statuts & échéances", "Avoirs"],
    subCapabilities: ["Rapprochement (selon activation)", "Exports", "Notes de débit/crédit"],
  },
  payments: {
    id: "payments",
    keyBenefits: ["Encaissement multi-canal", "Traçabilité", "Réconciliation simplifiée"],
    capabilities: ["Paiements", "Méthodes (cash/card/mobile money)", "Références transaction", "Rapprochement"],
    subCapabilities: ["Stripe (webhooks)", "Opérateurs mobile money (selon marché)"],
  },
  accounting: {
    id: "accounting",
    keyBenefits: ["Vision financière", "Automatisation des écritures", "Meilleur contrôle"],
    capabilities: ["Plan comptable", "Écritures", "Grand livre", "Périodes", "Budgets", "Rapports"],
    subCapabilities: ["Écritures automatiques via événements", "Dashboard temps réel (si activé)"],
  },
  insurance: {
    id: "insurance",
    keyBenefits: ["Moins de friction au comptoir", "Meilleur suivi tiers payant", "Traçabilité des dossiers"],
    capabilities: ["Assureurs", "Réclamations", "Statuts", "Remises & rapprochement"],
    subCapabilities: ["Éligibilité temps réel (si intégré)", "Rapports performance assureur"],
  },
  "e-invoice": {
    id: "e-invoice",
    keyBenefits: ["Conformité fiscale", "Moins de ressaisie", "Archivage structuré"],
    capabilities: ["Génération e-facture", "Soumission autorités (si intégrée)", "Audit fiscal"],
    subCapabilities: ["Signature/horodatage", "QR code", "Logs d’erreurs et corrections"],
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

