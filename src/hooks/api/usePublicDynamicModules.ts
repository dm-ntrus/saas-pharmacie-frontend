"use client";

import { useQuery } from "@tanstack/react-query";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { useLocale } from "@/lib/i18n-simple";

function toArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>) &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

async function fetchMarketing<T>(path: string, locale: string): Promise<T> {
  const base = getApiBaseUrl();
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `${base}/marketing/${path}${separator}locale=${encodeURIComponent(locale)}`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error(`Marketing endpoint failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function useMarketingStats(category: "hero" | "pharma" | "capability") {
  const locale = useLocale();
  return useQuery<any[]>({
    queryKey: ["marketing", "stats", category, locale],
    queryFn: async () => toArray(await fetchMarketing<unknown>(`stats?category=${category}`, locale)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingTestimonials() {
  const locale = useLocale();
  return useQuery<any[]>({
    queryKey: ["marketing", "testimonials", locale],
    queryFn: async () => toArray(await fetchMarketing<unknown>("testimonials/featured", locale)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingFaqs(page = "home") {
  const locale = useLocale();
  return useQuery<any[]>({
    queryKey: ["marketing", "faqs", page, locale],
    queryFn: async () => toArray(await fetchMarketing<unknown>(`faqs?page=${encodeURIComponent(page)}`, locale)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingTrustedPartners(location = "home") {
  const locale = useLocale();
  return useQuery<any[]>({
    queryKey: ["marketing", "trusted-partners", location, locale],
    queryFn: async () =>
      toArray(await fetchMarketing<unknown>(
        `trusted-partners?display_location=${encodeURIComponent(location)}`,
        locale,
      )),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingClientJourney() {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "client-journey", locale],
    queryFn: () => fetchMarketing("client-journey", locale),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingValueStrip() {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "value-strip", locale],
    queryFn: () => fetchMarketing("value-strip", locale),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingFooter() {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "footer", locale],
    queryFn: () => fetchMarketing("footer", locale),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingContact() {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "contact", locale],
    queryFn: () => fetchMarketing("contact", locale),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingHelpCenter() {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "help-center", locale],
    queryFn: () => fetchMarketing("help-center", locale),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingHelpCenterArticles(params?: {
  categoryKey?: string;
  featured?: boolean;
  popular?: boolean;
  search?: string;
}) {
  const locale = useLocale();
  const search = new URLSearchParams();
  if (params?.categoryKey) search.set("category_key", params.categoryKey);
  if (params?.featured !== undefined) search.set("featured", String(params.featured));
  if (params?.popular !== undefined) search.set("popular", String(params.popular));
  if (params?.search) search.set("search", params.search);
  const query = search.toString();
  return useQuery<any[]>({
    queryKey: ["marketing", "help-center-articles", locale, query],
    queryFn: async () => toArray(await fetchMarketing<unknown>(`help-center/articles${query ? `?${query}` : ""}`, locale)),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingLegalPage(pageKey: string) {
  const locale = useLocale();
  return useQuery<any>({
    queryKey: ["marketing", "legal", pageKey, locale],
    queryFn: () => fetchMarketing(`legal/pages/${encodeURIComponent(pageKey)}`, locale),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketingAnnouncements(location?: string) {
  const locale = useLocale();
  const path = location
    ? `announcements?location=${encodeURIComponent(location)}`
    : "announcements";
  return useQuery<any[]>({
    queryKey: ["marketing", "announcements", location ?? "global", locale],
    queryFn: async () => toArray(await fetchMarketing<unknown>(path, locale)),
    staleTime: 2 * 60 * 1000,
  });
}
