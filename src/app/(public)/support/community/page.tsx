"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  ThumbsUp,
  MessageSquare,
  Clock,
  User,
  Hash,
  Users,
  TrendingUp,
  ExternalLink,
  Settings,
  Puzzle,
  Lightbulb,
  Link2,
  Bug,
} from "lucide-react";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  general: { color: "text-slate-600", bg: "bg-slate-100", icon: Hash },
  features: { color: "text-blue-600", bg: "bg-blue-100", icon: Settings },
  "best-practices": { color: "text-emerald-600", bg: "bg-emerald-100", icon: Lightbulb },
  integrations: { color: "text-purple-600", bg: "bg-purple-100", icon: Puzzle },
  bugs: { color: "text-red-600", bg: "bg-red-100", icon: Bug },
};
import { Link } from "@/i18n/navigation";

interface Topic {
  id: string;
  titleKey: string;
  author: string;
  replies: number;
  likes: number;
  category: string;
  lastActivity: string;
  isPinned?: boolean;
}

interface Category {
  id: string;
  titleKey: string;
  topicCount: number;
}

const CATEGORIES: Category[] = [
  { id: "general", titleKey: "c1", topicCount: 24 },
  { id: "features", titleKey: "c2", topicCount: 18 },
  { id: "best-practices", titleKey: "c3", topicCount: 12 },
  { id: "integrations", titleKey: "c4", topicCount: 8 },
  { id: "bugs", titleKey: "c5", topicCount: 6 },
];

const TOPICS: Topic[] = [
  {
    id: "1",
    titleKey: "topicGettingStarted",
    author: "Dr. K. M.",
    replies: 12,
    likes: 34,
    category: "general",
    lastActivity: "2h",
    isPinned: true,
  },
  {
    id: "2",
    titleKey: "topicInventoryTips",
    author: "Pharmacien A.",
    replies: 8,
    likes: 22,
    category: "best-practices",
    lastActivity: "5h",
  },
  {
    id: "3",
    titleKey: "topicIntegrationMobile",
    author: "Tech Lead",
    replies: 15,
    likes: 45,
    category: "integrations",
    lastActivity: "1d",
  },
  {
    id: "4",
    titleKey: "topicFeatureRequest",
    author: "Dr. B.",
    replies: 6,
    likes: 18,
    category: "features",
    lastActivity: "2d",
  },
  {
    id: "5",
    titleKey: "topicPOSIssue",
    author: "Officine Plus",
    replies: 3,
    likes: 8,
    category: "bugs",
    lastActivity: "3d",
  },
];

export default function CommunityPage() {
  const t = useTranslations("pages.community");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTopics = selectedCategory
    ? TOPICS.filter((topic) => topic.category === selectedCategory)
    : searchQuery
    ? TOPICS.filter((topic) =>
        t(`topics.${topic.titleKey}`).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TOPICS;

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
            {t("backToSupport")}
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, value: "1,247", labelKey: "members" },
            { icon: MessageCircle, value: "3,842", labelKey: "discussions" },
            { icon: ThumbsUp, value: "8,591", labelKey: "answers" },
            { icon: TrendingUp, value: "94%", labelKey: "solved" },
          ].map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-slate-50 rounded-2xl text-center"
            >
              <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{t(`stats.${stat.labelKey}`)}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </div>
          <Link
            href="/support/community/new"
            className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            {t("newDiscussion")}
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              {t("communityCategories")}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                  selectedCategory === null
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <span className="text-sm font-medium text-slate-900">
                  {t("allCategories")}
                </span>
                <span className="text-xs text-slate-500">{TOPICS.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const config = CATEGORY_CONFIG[cat.id];
                const Icon = config?.icon || Hash;
                return (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      selectedCategory === cat.id
                        ? config?.bg + " border-2 " + config?.color?.replace('text-', 'border-').replace('600', '400') + " shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config?.bg || "bg-slate-100"}`}>
                      <Icon className={`w-4 h-4 ${config?.color || "text-slate-600"}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 flex-1">
                      {t(cat.titleKey)}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {cat.topicCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Discord CTA */}
            <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.11.102.262.262.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772.922 1.226.994a.066.066 0 0 0 .084-.028 19.963 19.963 0 0 0 5.994-3.03.078.078 0 0 0 .032-.054c.5-5.457-.838-9.673-3.549-13.666a.06.06 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{t("discordTitle")}</h4>
                  <p className="text-xs text-slate-500 mb-3">{t("discordDescLong")}</p>
                  <a
                    href="https://discord.gg/syntixpharma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.11.102.262.262.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772.922 1.226.994a.066.066 0 0 0 .084-.028 19.963 19.963 0 0 0 5.994-3.03.078.078 0 0 0 .032-.054c.5-5.457-.838-9.673-3.549-13.666a.06.06 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    {t("joinDiscord")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-slate-900">
                {selectedCategory
                  ? t(`community.${CATEGORIES.find((c) => c.id === selectedCategory)?.titleKey}`)
                  : t("recentDiscussions")}
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-emerald-600 font-bold hover:underline"
                >
                  {t("clearFilter")}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {filteredTopics.map((topic, i) => (
                <Link
                  key={topic.id}
                  href={`/support/community/${topic.id}`}
                  className={`block p-5 bg-white rounded-2xl border transition-all hover:shadow-md group cursor-pointer ${
                    topic.isPinned
                      ? "border-amber-200 bg-amber-50/30"
                      : "border-slate-100 hover:border-emerald-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-slate-400 min-w-[40px]">
                      <button 
                        onClick={(e) => { e.preventDefault(); }}
                        className="p-1 hover:text-emerald-600 transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-bold text-slate-600">
                        {topic.likes}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {topic.isPinned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                            {t("pinned")}
                          </span>
                        )}
                        {topic.category === "general" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {t("c1")}
                          </span>
                        )}
                        {topic.category === "features" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                            {t("c2")}
                          </span>
                        )}
                        {topic.category === "best-practices" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded">
                            {t("c3")}
                          </span>
                        )}
                        {topic.category === "integrations" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-600 rounded">
                            {t("c4")}
                          </span>
                        )}
                        {topic.category === "bugs" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded">
                            {t("c5")}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {topic.titleKey === "topicGettingStarted" ? "Bienvenue sur SyntixPharma - présentation" :
                         topic.titleKey === "topicInventoryTips" ? "5 tips pour gérer son inventory" :
                         topic.titleKey === "topicIntegrationMobile" ? "Intégration application mobile" :
                         topic.titleKey === "topicFeatureRequest" ? "Demande: Export PDF" :
                         topic.titleKey === "topicPOSIssue" ? "Bug sur la caisse" :
                         topic.titleKey}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{topic.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{topic.replies} {t("replies")}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{topic.lastActivity}</span>
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                Charger plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}