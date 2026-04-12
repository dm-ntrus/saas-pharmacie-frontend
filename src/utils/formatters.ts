import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";

export function formatCurrency(
  amount: number | string,
  currency = "XOF",
  locale = "fr-FR",
): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "XOF" ? 0 : 2,
    maximumFractionDigits: currency === "XOF" ? 0 : 2,
  }).format(n);
}

export function formatNumber(
  value: number | string,
  locale = "fr-FR",
): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat(locale).format(n);
}

export function formatPercent(
  value: number | string,
  decimals = 1,
): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

export function formatDate(
  date: string | Date | undefined | null,
  pattern = "dd/MM/yyyy",
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, pattern, { locale: fr });
}

export function formatDateTime(
  date: string | Date | undefined | null,
): string {
  return formatDate(date, "dd/MM/yyyy HH:mm");
}

export function formatDateTimeFull(
  date: string | Date | undefined | null,
): string {
  return formatDate(date, "EEEE dd MMMM yyyy 'à' HH:mm");
}

export function formatRelative(
  date: string | Date | undefined | null,
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

export function formatPhone(phone: string | undefined | null): string {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  if (cleaned.length === 12 && cleaned.startsWith("250")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
