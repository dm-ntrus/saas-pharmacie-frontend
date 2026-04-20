"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import {
  buildHomepageModuleHighlights,
  TOTAL_PLATFORM_MODULES,
} from "@/content/platform-marketing";
import { MarketingIcon } from "@/components/public/marketing-icons";

const MODULE_IMAGES: Record<string, string> = {
  pos: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
  inventory: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
  patients: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop",
  "supply-chain": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  loyalty: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
  prescriptions: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop",
  vaccination: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  compounding: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
  compliance: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  cold_chain: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=300&fit=crop",
  teleconsultation: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
  traceability: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
  suppliers: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
  partners: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
  billing_ops: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop",
  accounting: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop",
  e_invoice: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  insurance: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
  delivery: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
  quality: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
  hr: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
};

export default function PlatformModulesPreview() {
  const t = useTranslations("pages.home");
  const tp = useTranslations("platformModules");
  const highlights = useMemo(
    () => buildHomepageModuleHighlights((key) => tp(key)),
    [tp],
  );

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
      aria-labelledby="modules-preview-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
              {t("modulesPreviewTag")}
            </p>
            <h2
              id="modules-preview-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]"
            >
              {t("modulesPreviewTitleStart")}{" "}
              <span className="text-emerald-600 italic">{t("modulesPreviewTitleHighlight")}</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-slate-600 max-w-md font-medium leading-relaxed">
            {t("modulesPreviewDesc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-100 transition-all h-full"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={MODULE_IMAGES[m.id] || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop"}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <MarketingIcon name={m.icon} className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6 flex flex-col h-[calc(100%-10rem)]">
                <h3 className="text-lg font-display font-bold text-slate-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                  {m.title}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {m.tagline}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3 min-h-[4rem]">
                  {m.description}
                </p>
                <ul className="space-y-1.5">
                  {m.outcomes.slice(0, 2).map((o) => (
                    <li
                      key={o}
                      className="text-xs text-slate-500 font-medium flex gap-2 before:content-[''] before:w-1 before:rounded-full before:bg-emerald-500 before:shrink-0 before:mt-1.5"
                    >
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
                {m.planNote ? (
                  <p className="mt-3 text-[11px] text-slate-400 italic line-clamp-2">{m.planNote}</p>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center sm:text-left">
          <Link
            href="/modules"
            className="inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
          >
            {t("modulesPreviewCta", { count: TOTAL_PLATFORM_MODULES })}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
