"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send, ArrowUpRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n-simple";
import { PLATFORM } from "@/config/platform";
import { Link } from "@/i18n/navigation";

export default function ContactPage() {
  const t = useTranslations("pages.contact");

  const contacts = [
    {
      icon: Mail,
      title: t("email"),
      value: PLATFORM.email.contact,
      href: `mailto:${PLATFORM.email.contact}`,
    },
    {
      icon: Phone,
      title: t("phone"),
      value: "+243 99 000 0000",
      href: "tel:+243990000000",
    },
    {
      icon: MapPin,
      title: t("address"),
      value: "Kinshasa, RD Congo",
      href: "https://maps.google.com/?q=Kinshasa%2C%20RD%20Congo",
    },
    {
      icon: Clock,
      title: t("hours"),
      value: t("hoursValue"),
      href: "/support",
    },
  ];

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("title")}{" "}
              <span className="text-emerald-600">{t("titleHighlight")}</span>
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              {t("desc")}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            {contacts.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all group"
              >
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-50 transition-colors">
                  <c.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                    {c.title}
                  </p>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}

            <div className="p-5 bg-slate-900 rounded-2xl text-white mt-4">
              <h3 className="font-bold text-sm mb-2">{t("techSupport")}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                {t("techSupportDesc")}
              </p>
              <Link
                href="/support"
                className="text-emerald-400 text-sm font-bold inline-flex items-center gap-1 hover:text-emerald-300 transition-colors"
              >
                {t("accessSupport")}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-10"
            >
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                {t("formTitle")}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder={t("fullNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("phoneLabel")}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    placeholder={t("phonePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("subject")}
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all">
                    <option>{t("subjectDemo")}</option>
                    <option>{t("subjectPricing")}</option>
                    <option>{t("subjectPartnership")}</option>
                    <option>{t("subjectSupport")}</option>
                    <option>{t("subjectOther")}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {t("message")}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  placeholder={t("messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                {t("sendButton")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
