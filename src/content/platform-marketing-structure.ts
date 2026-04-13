/**
 * Structure statique (ids + icônes + métadonnées) pour le contenu marketing des modules.
 * Les libellés viennent des messages i18n (`platformModules`).
 */

import type { ModuleCategory, ModuleIconKey, PlatformModule } from "./platform-marketing-types";

export type ModuleMeta = {
  icon: ModuleIconKey;
  outcomes: number;
  planNote?: boolean;
};

/** Métadonnées par id de module (identique aux ids historiques dans platform-marketing). */
export const PLATFORM_MODULE_META: Record<string, ModuleMeta> = {
  dashboard: { icon: "LayoutDashboard", outcomes: 2 },
  pos: { icon: "ShoppingCart", outcomes: 2 },
  inventory: { icon: "Package", outcomes: 2 },
  patients: { icon: "Users", outcomes: 2 },
  prescriptions: { icon: "FileText", outcomes: 2 },
  vaccination: { icon: "Syringe", outcomes: 2 },
  ai: { icon: "Bot", outcomes: 2, planNote: true },
  "cold-chain": { icon: "Snowflake", outcomes: 2 },
  compounding: { icon: "FlaskConical", outcomes: 2 },
  teleconsultation: { icon: "Video", outcomes: 2 },
  traceability: { icon: "Link2", outcomes: 2 },
  suppliers: { icon: "Building2", outcomes: 2 },
  "supply-chain": { icon: "GitBranch", outcomes: 2 },
  partners: { icon: "Handshake", outcomes: 2 },
  "sales-orders-b2b": { icon: "ScrollText", outcomes: 2 },
  "credit-control": { icon: "BadgeDollarSign", outcomes: 2 },
  "returns-rma": { icon: "Undo2", outcomes: 2 },
  "commercial-terms": { icon: "Tags", outcomes: 2 },
  "b2b-integrations": { icon: "Plug", outcomes: 2 },
  "b2b-governance": { icon: "ShieldCheck", outcomes: 2 },
  "b2b-dashboard": { icon: "BarChart3", outcomes: 2 },
  "billing-ops": { icon: "Receipt", outcomes: 2 },
  payments: { icon: "Wallet", outcomes: 2 },
  accounting: { icon: "BookOpen", outcomes: 2 },
  "e-invoice": { icon: "Sheet", outcomes: 2, planNote: true },
  insurance: { icon: "Handshake", outcomes: 2 },
  delivery: { icon: "Truck", outcomes: 2 },
  quality: { icon: "ShieldCheck", outcomes: 2 },
  "business-audit": { icon: "ScrollText", outcomes: 2 },
  analytics: { icon: "BarChart3", outcomes: 2 },
  reports: { icon: "PieChart", outcomes: 2 },
  loyalty: { icon: "Gift", outcomes: 2, planNote: true },
  notifications: { icon: "Bell", outcomes: 2 },
  hr: { icon: "UserCog", outcomes: 2 },
  settings: { icon: "Settings", outcomes: 2 },
  "saas-billing": { icon: "Receipt", outcomes: 2, planNote: true },
};

export const PLATFORM_CATEGORY_MODULE_IDS: { id: string; moduleIds: string[] }[] = [
  { id: "daily", moduleIds: ["dashboard", "pos", "inventory"] },
  {
    id: "care",
    moduleIds: ["patients", "prescriptions", "vaccination", "compounding"],
  },
  { id: "supply", moduleIds: ["suppliers", "supply-chain"] },
  {
    id: "b2b",
    moduleIds: [
      "partners",
      "sales-orders-b2b",
      "credit-control",
      "returns-rma",
      "commercial-terms",
      "b2b-integrations",
      "b2b-governance",
      "b2b-dashboard",
    ],
  },
  {
    id: "finance",
    moduleIds: [
      "billing-ops",
      "payments",
      "accounting",
      "e-invoice",
      "insurance",
    ],
  },
  { id: "distribution", moduleIds: ["delivery", "teleconsultation"] },
  {
    id: "quality",
    moduleIds: ["quality", "business-audit", "cold-chain", "traceability"],
  },
  {
    id: "growth",
    moduleIds: ["analytics", "reports", "loyalty", "notifications", "ai"],
  },
  { id: "org", moduleIds: ["hr", "settings", "saas-billing"] },
];

export const TOTAL_PLATFORM_MODULES = Object.keys(PLATFORM_MODULE_META).length;

export const HOMEPAGE_MODULE_HIGHLIGHT_IDS = [
  "pos",
  "inventory",
  "patients",
  "supply-chain",
  "analytics",
  "loyalty",
] as const;

type Translate = (key: string) => string;

function buildModule(moduleId: string, t: Translate): PlatformModule {
  const meta = PLATFORM_MODULE_META[moduleId];
  if (!meta) {
    throw new Error(`platform-marketing-structure: unknown module "${moduleId}"`);
  }
  const outcomes = Array.from({ length: meta.outcomes }, (_, i) =>
    t(`modules.${moduleId}.outcome${i}`),
  );
  return {
    id: moduleId,
    icon: meta.icon,
    title: t(`modules.${moduleId}.title`),
    tagline: t(`modules.${moduleId}.tagline`),
    description: t(`modules.${moduleId}.description`),
    outcomes,
    planNote: meta.planNote ? t(`modules.${moduleId}.planNote`) : undefined,
  };
}

export function buildModuleCategories(t: Translate): ModuleCategory[] {
  return PLATFORM_CATEGORY_MODULE_IDS.map((cat) => ({
    id: cat.id,
    label: t(`categories.${cat.id}.label`),
    intro: t(`categories.${cat.id}.intro`),
    modules: cat.moduleIds.map((mid) => buildModule(mid, t)),
  }));
}

export function buildHomepageModuleHighlights(t: Translate): PlatformModule[] {
  return HOMEPAGE_MODULE_HIGHLIGHT_IDS.map((id) => buildModule(id, t));
}
