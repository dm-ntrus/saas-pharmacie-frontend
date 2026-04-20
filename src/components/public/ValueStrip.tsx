"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import { useMarketingValueStrip } from "@/hooks/api/usePublicDynamicModules";

const VALUE_KEYS = ["n1", "n2", "n3"] as const;

export default function ValueStrip() {
  const t = useTranslations("platformModules");
  const { data } = useMarketingValueStrip();
  const items = data?.items?.length
    ? data.items
    : VALUE_KEYS.map((key) => ({
        title: t(`valueStrip.${key}.title`),
        text: t(`valueStrip.${key}.text`),
      }));
  const ariaLabel = data?.config?.aria_label ?? t("valueStripAria");

  return (
    <section
      className="border-y border-slate-100 bg-slate-50/80"
      aria-label={ariaLabel}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {items.map((item: any, i: number) => (
            <motion.li
              key={item.item_key ?? `value-${i}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center sm:text-left"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">
                {item.title}
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
