"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "@/lib/i18n-simple";
import { useMarketingTrustedPartners } from "@/hooks/api/usePublicDynamicModules";

export default function TrustedBy() {
  const t = useTranslations("marketing");
  const messages = useMessages() as {
    platformModules?: { trustedLogos?: string[] };
  };
  const { data } = useMarketingTrustedPartners("home");
  const logosFromApi = (data ?? [])
    .map((partner: any) => partner?.name)
    .filter((name: unknown): name is string => typeof name === "string" && name.trim().length > 0);
  const logos = logosFromApi.length
    ? logosFromApi
    : (messages.platformModules?.trustedLogos ?? []);

  return (
    <section className="py-12 sm:py-16 overflow-hidden border-y border-slate-100 bg-slate-50/50">
      <div className="container mx-auto px-4 mb-8 sm:mb-12">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          {t("trustedBy")}
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-200 hover:text-emerald-600 transition-colors duration-500 font-display cursor-default select-none"
            >
              {logo}
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
