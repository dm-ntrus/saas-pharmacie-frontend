"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import { ArrowLeft, Send, User, MessageSquare, Plus, Hash, Settings, Lightbulb, Puzzle, Bug, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const CATEGORIES = [
  { id: "general", labelKey: "c1", color: "slate", icon: Hash },
  { id: "features", labelKey: "c2", color: "blue", icon: Settings },
  { id: "best-practices", labelKey: "c3", color: "emerald", icon: Lightbulb },
  { id: "integrations", labelKey: "c4", color: "purple", icon: Puzzle },
  { id: "bugs", labelKey: "c5", color: "red", icon: Bug },
];

const COLOR_CLASSES: Record<string, { bg: string; text: string; ring: string }> = {
  slate: { bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-300" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-300" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-300" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-300" },
  red: { bg: "bg-red-100", text: "text-red-600", ring: "ring-red-300" },
};

export default function NewDiscussionPage() {
  const t = useTranslations("pages.community");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [showPreview, setShowPreview] = useState(false);

  const selectedCat = CATEGORIES.find(c => c.id === category);
  const colorClasses = COLOR_CLASSES[selectedCat?.color || "slate"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Discussion créée! (Fonctionnalité à implémenter)");
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/support/community"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la communauté
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  Nouvelle discussion
                </h1>
                <p className="text-xs text-slate-300">
                  Partagez votre sujet avec la communauté
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Titre de la discussion
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Un titre clair et concis..."
                required
                style={{ color: '#0f172a !important', fontSize: '14px' }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Catégorie
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const colors = COLOR_CLASSES[cat.color];
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `${colors.bg} ${colors.ring} shadow-sm`
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? colors.text : "text-slate-600"}`}>
                          {t(cat.labelKey)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Contenu
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  {showPreview ? "Éditer" : "Aperçu"}
                </button>
              </div>
              {showPreview ? (
                <div className="min-h-[200px] p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                    {content || "Aucun contenu..."}
                  </p>
                </div>
              ) : (
<textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Décrivez votre sujet en détail. Soyez précis et donnez des examples..."
                  rows={8}
                  required
                  style={{ color: '#0f172a !important', fontSize: '14px' }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              )}
              <p className="text-xs text-slate-400 mt-1 text-right">
                {content.length} caractères
              </p>
            </div>

            {/* Preview Card */}
            {title && content && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Aperçu
                </p>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses?.bg || "bg-slate-100"}`}>
                    {selectedCat && <selectedCat.icon className={`w-5 h-5 ${colorClasses?.text || "text-slate-600"}`} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <User className="w-3 h-3" />
                      <span>Vous</span>
                      <span>•</span>
                      <span>À l'instant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={!title || !content}
                className="flex-1 px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Publier la discussion
              </button>
              <Link
                href="/support/community"
                className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <h4 className="text-sm font-bold text-amber-800 mb-2">💡 Tips pour une bonne discussion</h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>•Choisissez une catégorie adapté pour une meilleure visibilité</li>
            <li>•Soyez précis dans le titre pour attracted les réponses</li>
            <li>• Ajoutez des details et screenshots si possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}