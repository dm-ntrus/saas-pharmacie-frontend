"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ThumbsUp, MessageSquare, Clock, User, ExternalLink, Hash, Settings, Lightbulb, Puzzle, Bug } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  general: { color: "text-slate-600", bg: "bg-slate-100", icon: Hash },
  features: { color: "text-blue-600", bg: "bg-blue-100", icon: Settings },
  "best-practices": { color: "text-emerald-600", bg: "bg-emerald-100", icon: Lightbulb },
  integrations: { color: "text-purple-600", bg: "bg-purple-100", icon: Puzzle },
  bugs: { color: "text-red-600", bg: "bg-red-100", icon: Bug },
};

const TOPICS_DATA: Record<string, { titleKey: string; contentKey: string; author: string; category: string; replies: number; likes: number; createdAt: string; lastActivity: string; isPinned?: boolean }> = {
  "1": {
    titleKey: "topicData.t1.title",
    author: "Dr. K. M.",
    category: "general",
    contentKey: "topicData.t1.content",
    replies: 12,
    likes: 34,
    createdAt: "2024-01-10",
    lastActivity: "2h",
    isPinned: true,
  },
  "2": {
    titleKey: "topicData.t2.title",
    author: "Pharmacien A.",
    category: "best-practices",
    contentKey: "topicData.t2.content",
    replies: 8,
    likes: 22,
    createdAt: "2024-01-08",
    lastActivity: "5h",
  },
  "3": {
    titleKey: "topicData.t3.title",
    author: "Tech Lead",
    category: "integrations",
    contentKey: "topicData.t3.content",
    replies: 15,
    likes: 45,
    createdAt: "2024-01-05",
    lastActivity: "1d",
  },
  "4": {
    titleKey: "topicData.t4.title",
    author: "Dr. B.",
    category: "features",
    contentKey: "topicData.t4.content",
    replies: 6,
    likes: 18,
    createdAt: "2024-01-03",
    lastActivity: "2d",
  },
  "5": {
    titleKey: "topicData.t5.title",
    author: "Officine Plus",
    category: "bugs",
    contentKey: "topicData.t5.content",
    replies: 3,
    likes: 8,
    createdAt: "2024-01-01",
    lastActivity: "3d",
  },
};

export default function TopicDetailPage() {
  const t = useTranslations("pages.community");
  const params = useParams<{ id?: string }>();
  const topicId = typeof params?.id === "string" ? params.id : "";
  const topic = TOPICS_DATA[topicId];
  
  if (!topic) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/support/community" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> {t("backToCommunity")}
          </Link>
          <div className="mt-8 p-8 bg-slate-50 rounded-2xl text-center">
            <p className="text-slate-500">{t("discussionNotFound")}</p>
          </div>
        </div>
      </div>
    );
  }

  const catConfig = CATEGORY_CONFIG[topic.category];
  const Icon = catConfig?.icon || Hash;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/support/community" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> {t("backToCommunity")}
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {topic.isPinned && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{t("pinned")}</span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catConfig?.bg} ${catConfig?.color}`}>
                {topic.category === "general" ? t("c1") :
                 topic.category === "features" ? t("c2") :
                 topic.category === "best-practices" ? t("c3") :
                 topic.category === "integrations" ? t("c4") :
                 topic.category === "bugs" ? t("c5") : ""}
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-4">{t(topic.titleKey)}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <span className="font-medium">{topic.author}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {topic.lastActivity}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 whitespace-pre-wrap">{t(topic.contentKey)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition-colors">
              <ThumbsUp className="w-4 h-4" /> {topic.likes}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition-colors">
              <MessageSquare className="w-4 h-4" /> {topic.replies} {t("replies")}
            </button>
          </div>
        </motion.div>

        {/* Replies */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{topic.replies} {t("repliesTitle")}</h3>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
                <span className="text-sm font-bold text-slate-900">{t("sampleReplyAuthor")}</span>
                <span className="text-xs text-slate-400">{t("sampleReplyTime")}</span>
              </div>
              <p className="text-sm text-slate-600">{t("sampleReplyText")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}