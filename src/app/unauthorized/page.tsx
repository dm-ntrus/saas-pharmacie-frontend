"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function UnauthorizedPage() {
  const t = useTranslations("pages.unauthorized");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mx-auto w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center ring-1 ring-red-100"
        >
          <ShieldOff className="w-10 h-10 text-red-500" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
            {t("desc")}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/15 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backHome")}
        </Link>
      </motion.div>
    </div>
  );
}
