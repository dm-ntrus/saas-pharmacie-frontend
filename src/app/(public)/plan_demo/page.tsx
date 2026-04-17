"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Monitor, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";

export default function PlanDemoPage() {
  const t = useTranslations("pages.planDemo");
  const benefits = [
    t("benefits.b1"),
    t("benefits.b2"),
    t("benefits.b3"),
    t("benefits.b4"),
    t("benefits.b5"),
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-14 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                {t("tag")}
              </p>
              <h1 className="text-2xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-[1.1] sm:leading-[1.05]">
                {t("title")}{" "}
                <span className="text-emerald-600">{t("titleHighlight")}</span> {t("titleEnd")}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium mb-7 sm:mb-8 max-w-md">
                {t("desc")}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-3 sm:gap-6 mb-7 sm:mb-8">
              {[
                { icon: Clock, text: t("quickInfo.duration") },
                { icon: Monitor, text: t("quickInfo.remote") },
                { icon: Calendar, text: t("quickInfo.flexible") },
              ].map((b) => (
                <span
                  key={b.text}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium"
                >
                  <b.icon className="w-4 h-4 text-emerald-600" />
                  {b.text}
                </span>
              ))}
            </div>

            <ul className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-8">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-xs sm:text-sm text-slate-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                &quot;{t("testimonial.quote")}&quot;
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-3">
                — {t("testimonial.author")}
              </p>
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-slate-50 rounded-3xl border border-slate-100 p-5 sm:p-10"
            >
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                {t("form.title")}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("form.fullName")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder={t("form.fullNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("form.workEmail")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder={t("form.workEmailPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("form.phone")}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder={t("form.phonePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("form.pharmacyName")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    placeholder={t("form.pharmacyNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("form.preferredSlot")}
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
                    <option>{t("form.slotMorning")}</option>
                    <option>{t("form.slotAfternoon")}</option>
                    <option>{t("form.slotEvening")}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {t("form.submit")}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                {t("form.footnote")}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
