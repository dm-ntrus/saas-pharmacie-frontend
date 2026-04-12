/**
 * Navigation et pied de page du site marketing — source unique pour éviter liens morts.
 */

export type MarketingSiteLink = {
  href: string;
  label: string;
};

export const MARKETING_BRAND_LINE =
  "Plateforme SaaS multi-tenant pour officines : POS, inventaire, patients, prescriptions, supply chain, conformité et pilotage.";

/** Liens principaux (header desktop + ancre mobile prioritaire) */
export const MARKETING_HEADER_PRIMARY: MarketingSiteLink[] = [
  { href: "/modules", label: "Plateforme" },
  { href: "/solutions", label: "Solutions" },
  { href: "/features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

/** Liens secondaires (menu mobile, raccourcis header optionnels) */
export const MARKETING_HEADER_SECONDARY: MarketingSiteLink[] = [
  { href: "/support", label: "Centre d'aide" },
  { href: "/plan_demo", label: "Démo" },
  { href: "/api-docs", label: "API" },
  { href: "/status", label: "Statut" },
  { href: "/signup", label: "Offres" },
  { href: "/auth/register", label: "Créer un compte" },
];

export type MarketingFooterColumn = {
  id: string;
  title: string;
  links: MarketingSiteLink[];
};

/** Colonnes footer — couvre toutes les pages (public) */
export const MARKETING_FOOTER_COLUMNS: MarketingFooterColumn[] = [
  {
    id: "product",
    title: "Produit",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/modules", label: "Modules & capacités" },
      { href: "/solutions", label: "Solutions métier" },
      { href: "/features", label: "Fonctionnalités" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/plan_demo", label: "Démo" },
      { href: "/signup", label: "Offres & packs" },
    ],
  },
  {
    id: "dev",
    title: "Développeurs & fiabilité",
    links: [
      { href: "/api-docs", label: "Documentation API" },
      { href: "/status", label: "Statut des services" },
    ],
  },
  {
    id: "help",
    title: "Aide & accès",
    links: [
      { href: "/support", label: "Centre d'aide" },
      { href: "/contact", label: "Nous contacter" },
      { href: "/auth/login", label: "Connexion" },
      { href: "/auth/register", label: "Essai / inscription" },
    ],
  },
  {
    id: "legal",
    title: "Entreprise & légal",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/privacy", label: "Confidentialité" },
      { href: "/terms", label: "Conditions d'utilisation" },
    ],
  },
];

/** Pied de page des écrans encore branchés sur `components/layout/Layout` (legacy) */
export const TENANT_SHELL_FOOTER_COLUMNS: MarketingFooterColumn[] = [
  {
    id: "product",
    title: "Produit",
    links: [
      { href: "/", label: "Site vitrine" },
      { href: "/modules", label: "Plateforme" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/api-docs", label: "API" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { href: "/support", label: "Aide" },
      { href: "/contact", label: "Contact" },
      { href: "/status", label: "Statut" },
    ],
  },
  {
    id: "legal",
    title: "Légal",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/privacy", label: "Confidentialité" },
      { href: "/terms", label: "CGU" },
    ],
  },
];
