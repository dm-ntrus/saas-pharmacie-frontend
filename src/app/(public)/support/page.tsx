"use client";

import { motion } from "framer-motion";
import { PLATFORM } from "@/config/platform";
import { useTranslations } from "next-intl";
import {
  Book,
  MessageCircle,
  HeadphonesIcon,
  FileQuestion,
  ArrowRight,
  Mail,
  Phone,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const channelsMeta = [
  { icon: HeadphonesIcon, key: "liveSupport", href: "/contact?topic=live-chat" },
  { icon: Book, key: "knowledgeBase", href: "/api-docs" },
  { icon: MessageCircle, key: "community", href: "/about" },
  { icon: FileQuestion, key: "tickets", href: "/contact?topic=ticket" },
] as const;

export default function SupportPage() {
  const t = useTranslations("pages.support");

  const channels = channelsMeta.map((ch) => ({
    icon: ch.icon,
    href: ch.href,
    title: t(`channels.${ch.key}.title`),
    desc: t(`channels.${ch.key}.desc`),
    cta: t(`channels.${ch.key}.cta`),
  }));

  const popularArticles = [
    { label: t("popularArticles.a1"), href: "/api-docs" },
    { label: t("popularArticles.a2"), href: "/api-docs" },
    { label: t("popularArticles.a3"), href: "/api-docs" },
    { label: t("popularArticles.a4"), href: "/api-docs" },
    { label: t("popularArticles.a5"), href: "/api-docs" },
    { label: t("popularArticles.a6"), href: "/api-docs" },
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
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
              {t("desc")}
            </p>
          </motion.div>
        </div>

        {/* Channels */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {channels.map((ch, i) => (
            <motion.div
              key={ch.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-7 sm:p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-emerald-600 transition-colors">
                <ch.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                {ch.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                {ch.desc}
              </p>
              <Link
                href={ch.href}
                className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold hover:text-slate-900 transition-colors"
              >
                {ch.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Popular articles */}
        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 sm:p-12 mb-12">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
            {t("popularArticlesTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {popularArticles.map((article) => (
              <Link
                key={article.label}
                href={article.href}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
              >
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {article.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {t("supportEmailTitle")}
              </h4>
              <p className="text-sm text-slate-600 mb-2">
                {t("supportEmailDesc")}
              </p>
              <a
                href={`mailto:${PLATFORM.email.support}`}
                className="text-emerald-600 text-sm font-bold hover:underline"
              >
                {PLATFORM.email.support}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {t("phoneSupportTitle")}
              </h4>
              <p className="text-sm text-slate-600 mb-2">
                {t("phoneSupportDesc")}
              </p>
              <a
                href="tel:+243990000000"
                className="text-slate-900 text-sm font-bold hover:text-emerald-600 transition-colors"
              >
                {t("phoneSupportValue")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
