"use client";

import Link from "next/link";
import { useMarketingAnnouncements } from "@/hooks/api/usePublicDynamicModules";

export default function AnnouncementsBar({ location = "home" }: { location?: string }) {
  const { data } = useMarketingAnnouncements(location);
  const items = data ?? [];
  if (!items.length) return null;
  const top = items[0];
  return (
    <div className="bg-emerald-600 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <p className="font-medium text-xs sm:text-sm leading-relaxed">{top.message}</p>
        {top.action_url ? (
          <Link className="underline underline-offset-2 font-semibold text-xs sm:text-sm shrink-0" href={top.action_url}>
            {top.action_label ?? "Voir"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
