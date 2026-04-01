"use client";

import { motion } from "framer-motion";
import { VALUE_STRIP } from "@/content/platform-marketing";

export default function ValueStrip() {
  return (
    <section
      className="border-y border-slate-100 bg-slate-50/80"
      aria-label="Propositions de valeur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {VALUE_STRIP.map((item, i) => (
            <motion.li
              key={item.title}
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
