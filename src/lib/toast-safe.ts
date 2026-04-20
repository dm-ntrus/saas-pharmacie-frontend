import toast from "react-hot-toast";

export function normalizeToastMessage(input: unknown): string {
  if (typeof input === "string") return input;
  if (typeof input === "number" || typeof input === "boolean") return String(input);
  if (input && typeof input === "object") {
    const maybeMessage = (input as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
    try {
      return JSON.stringify(input);
    } catch {
      return "Une erreur est survenue";
    }
  }
  return "Une erreur est survenue";
}

export function toastErrorSafe(input: unknown) {
  return toast.error(normalizeToastMessage(input));
}
