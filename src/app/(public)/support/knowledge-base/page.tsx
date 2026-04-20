"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  Search,
  BookOpen,
  ChevronRight,
  FileText,
  ArrowLeft,
  ThumbsUp,
  Clock,
  Eye,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useMarketingHelpCenter, useMarketingHelpCenterArticles } from "@/hooks/api/usePublicDynamicModules";

interface Article {
  id: string;
  titleKey: string;
  excerptKey: string;
  category: string;
  readTime: number;
  views: number;
}

interface Category {
  id: string;
  titleKey: string;
  icon: string;
  articleCount: number;
}

const KNOWLEDGE_BASE_CATEGORIES: Category[] = [
  { id: "getting-started", titleKey: "k1", icon: "Rocket", articleCount: 8 },
  { id: "inventory", titleKey: "k2", icon: "Package", articleCount: 12 },
  { id: "pos-sales", titleKey: "k3", icon: "ShoppingCart", articleCount: 10 },
  { id: "patients", titleKey: "k4", icon: "Users", articleCount: 7 },
  { id: "prescriptions", titleKey: "k5", icon: "FileText", articleCount: 9 },
  { id: "billing", titleKey: "k6", icon: "CreditCard", articleCount: 6 },
  { id: "integrations", titleKey: "k7", icon: "Plug", articleCount: 5 },
  { id: "security", titleKey: "k8", icon: "ShieldCheck", articleCount: 4 },
];

const SAMPLE_ARTICLES: Article[] = [
  { id: "1", titleKey: "articleGettingStarted1", excerptKey: "articleGettingStarted1Excerpt", category: "getting-started", readTime: 5, views: 1250 },
  { id: "2", titleKey: "articleGettingStarted2", excerptKey: "articleGettingStarted2Excerpt", category: "getting-started", readTime: 8, views: 980 },
  { id: "3", titleKey: "articleInventory1", excerptKey: "articleInventory1Excerpt", category: "inventory", readTime: 10, views: 856 },
  { id: "4", titleKey: "articlePos1", excerptKey: "articlePos1Excerpt", category: "pos-sales", readTime: 7, views: 743 },
  { id: "5", titleKey: "articlePatients1", excerptKey: "articlePatients1Excerpt", category: "patients", readTime: 6, views: 621 },
  { id: "6", titleKey: "articlePrescriptions1", excerptKey: "articlePrescriptions1Excerpt", category: "prescriptions", readTime: 12, views: 589 },
];

export default function KnowledgeBasePage() {
  const t = useTranslations("pages.knowledgeBase");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: helpCenter } = useMarketingHelpCenter();
  const { data: articlesData } = useMarketingHelpCenterArticles({
    categoryKey: selectedCategory ?? undefined,
    search: searchQuery || undefined,
  });
  const categories = helpCenter?.categories?.length
    ? helpCenter.categories.map((c: any) => ({
        id: c.category_key,
        titleKey: c.name,
        icon: c.icon ?? "BookOpen",
        articleCount: c.article_count ?? 0,
      }))
    : KNOWLEDGE_BASE_CATEGORIES;
  const filteredArticles = articlesData?.length
    ? articlesData.map((a: any, index: number) => ({
        id: a.article_key ?? String(index),
        titleKey: a.title,
        excerptKey: a.summary ?? "",
        category: a.category_key,
        readTime: a.reading_time_minutes ?? 5,
        views: a.view_count ?? 0,
      }))
    : selectedCategory
    ? SAMPLE_ARTICLES.filter((a) => a.category === selectedCategory)
    : searchQuery
    ? SAMPLE_ARTICLES.filter(
        (a) =>
          t(`articles.${a.titleKey}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
          t(`articles.${a.excerptKey}`).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SAMPLE_ARTICLES;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au support
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
              {t("desc")}
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat: Category, i: number) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedCategory === cat.id
                  ? "bg-emerald-50 border-emerald-200 shadow-md"
                  : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedCategory === cat.id ? "bg-emerald-100" : "bg-slate-100"
                  }`}
                >
                  <BookOpen
                    className={`w-5 h-5 ${
                      selectedCategory === cat.id ? "text-emerald-600" : "text-slate-600"
                    }`}
                  />
                </div>
                <span className="font-bold text-sm text-slate-900">
                  {cat.titleKey}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {cat.articleCount} {t("articlesCount")}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Articles List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-slate-900">
              {selectedCategory ? t("allArticles") : t("allArticles")}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-emerald-600 font-bold hover:underline"
              >
                {t("clearFilter")}
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article: Article, i: number) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {t("allArticles")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {article.titleKey}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {article.excerptKey}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} {t("minRead")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views.toLocaleString()} {t("views")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">{t("noResults")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Help CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-3">
            {t("ctaTitle")}
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            {t("ctaDesc")}
          </p>
          <Link
            href="/support/tickets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}