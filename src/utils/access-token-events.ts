/** Émis après mise à jour du jeton (refresh BFF, login, autre onglet). */
export const ACCESS_TOKEN_UPDATED_EVENT = "syntix:access-token-updated";

export function dispatchAccessTokenUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ACCESS_TOKEN_UPDATED_EVENT));
}
