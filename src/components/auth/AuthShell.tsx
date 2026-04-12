"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

interface AuthShellProps {
  children: ReactNode;
  /** Hide the right panel entirely (e.g. registration-success fullscreen) */
  fullWidth?: boolean;
  /** Testimonial override */
  testimonial?: { quote: string; name: string; title: string };
  /** Stats override */
  stats?: { value: string; labelKey: string }[];
  /** Right panel variant */
  variant?: "default" | "dark";
}

const DEFAULT_STATS = [
  { value: "500+", labelKey: "authShellStatsPharmacies" },
  { value: "1M+", labelKey: "authShellStatsSalesPerMonth" },
];

export default function AuthShell({
  children,
  fullWidth = false,
  testimonial,
  stats = DEFAULT_STATS,
  variant = "default",
}: AuthShellProps) {
  const t = useTranslations("marketing");

  const resolvedTestimonial = testimonial ?? {
    quote: t("authShellTestimonial"),
    name: t("authShellName"),
    title: t("authShellTitle"),
  };

  if (fullWidth) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex flex-col">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white overflow-x-hidden">
      {/* Left — Form area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative bg-white">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 sm:px-10 lg:px-16 py-4 border-b border-slate-50">
          <Link href="/" className="inline-block">
            <span className="font-display font-bold text-xl sm:text-2xl text-emerald-600 tracking-tight">
              Syntix<span className="text-slate-900">Pharma</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
          <div className="w-full h-full">{children}</div>
        </div>

        <div className="px-6 sm:px-10 lg:px-16 py-4 border-t border-slate-50 text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} SyntixPharma</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-600 transition-colors">
              {t("termsShort")}
            </Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">
              {t("privacyShort")}
            </Link>
            <Link href="/support" className="hover:text-slate-600 transition-colors">
              {t("help")}
            </Link>
          </div>
        </div>
      </div>

      {/* Right — Branding panel */}
      <div className="hidden lg:flex w-[440px] xl:w-[500px] bg-slate-900 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-slate-900/95 z-10" />
        <Image
          src="/images/hero.svg"
          alt=""
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-20 flex flex-col justify-between h-full p-12 xl:p-16 text-white">
          {/* Stats */}
          <div className="flex gap-10">
            {stats.map((s) => (
              <div key={s.labelKey} className="space-y-1">
                <p className="text-4xl xl:text-5xl font-display font-bold">
                  {s.value}
                </p>
                <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[9px]">
                  {t(s.labelKey)}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-sm"
          >
            <div className="flex gap-1 text-emerald-500 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-lg xl:text-xl font-display font-bold leading-snug italic mb-6">
              &quot;{resolvedTestimonial.quote}&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm border border-emerald-500/30">
                {resolvedTestimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold">{resolvedTestimonial.name}</p>
                <p className="text-emerald-400 font-black uppercase tracking-[0.15em] text-[8px]">
                  {resolvedTestimonial.title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom brand */}
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-lg text-emerald-500/40 tracking-tight">
              SyntixPharma
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
