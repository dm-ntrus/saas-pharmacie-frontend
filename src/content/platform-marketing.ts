/**
 * Types et structure marketing des modules (libellés dans messages/platform-{locale}.json).
 */

export type {
  ModuleIconKey,
  PlatformModule,
  ModuleCategory,
} from "./platform-marketing-types";

export {
  PLATFORM_MODULE_META,
  PLATFORM_CATEGORY_MODULE_IDS,
  TOTAL_PLATFORM_MODULES,
  HOMEPAGE_MODULE_HIGHLIGHT_IDS,
  buildModuleCategories,
  buildHomepageModuleHighlights,
} from "./platform-marketing-structure";

/** Nom produit (inchangé entre locales). */
export const MARKETING_BRAND = {
  name: "SyntixPharma",
} as const;
