/**
 * Réponses HTTP Nest avec {@link SuccessResponseInterceptor} : `{ success, message?, data }`.
 * Les handlers `@Res({ passthrough: false })` renvoient le corps brut (pas d’enveloppe).
 */
export function unwrapNestSuccessData<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const o = raw as Record<string, unknown>;
    if (o.data !== undefined) {
      return o.data as T;
    }
  }
  return raw as T;
}
