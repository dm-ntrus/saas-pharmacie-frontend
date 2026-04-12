"use client";

import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import { CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

function StatusBadge({ status }: { status: "operational" | "degraded" | "maintenance" | "outage" }) {
  const t = useTranslations("pages.status");
  const config = {
    operational: { label: t("badges.operational"), color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    degraded: { label: t("badges.degraded"), color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    maintenance: { label: t("badges.maintenance"), color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    outage: { label: t("badges.outage"), color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default function StatusPage() {
  const t = useTranslations("pages.status");
  const services = [
    { name: t("services.webApp"), status: "operational" as const },
    { name: t("services.apiBackend"), status: "operational" as const },
    { name: t("services.database"), status: "operational" as const },
    { name: t("services.auth"), status: "operational" as const },
    { name: t("services.payments"), status: "operational" as const },
    { name: t("services.mobileMoney"), status: "operational" as const },
    { name: t("services.email"), status: "operational" as const },
    { name: t("services.cdn"), status: "operational" as const },
  ];
  const history = [
    { date: t("history.d1Date"), status: "operational" as const, desc: t("history.d1Desc") },
    { date: t("history.d2Date"), status: "operational" as const, desc: t("history.d2Desc") },
    { date: t("history.d3Date"), status: "maintenance" as const, desc: t("history.d3Desc") },
    { date: t("history.d4Date"), status: "operational" as const, desc: t("history.d4Desc") },
  ];
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              {t("tag")}
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
              {t("title")}
            </h1>
          </motion.div>

          {/* Global status */}
          <div
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${
              allOperational
                ? "bg-emerald-50 border border-emerald-100"
                : "bg-amber-50 border border-amber-100"
            }`}
          >
            {allOperational ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            )}
            <span className="font-bold text-slate-900">
              {allOperational
                ? t("allOperational")
                : t("someIssues")}
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            {t("servicesTitle")}
          </h2>
          <div className="space-y-2">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <span className="text-sm font-bold text-slate-700">
                  {svc.name}
                </span>
                <StatusBadge status={svc.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Uptime bar */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
            {t("uptimeTitle")}
          </h2>
          <div className="flex gap-0.5 h-8 rounded-lg overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${
                  i === 27 ? "bg-blue-400" : "bg-emerald-500"
                } hover:opacity-80 transition-opacity`}
                title={i === 27 ? t("plannedMaintenance") : t("badges.operational")}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold">
            <span>{t("uptimeWindow")}</span>
            <span>
              {t("uptimeLabel")}{" "}
              <span className="text-emerald-600 text-xs font-black">
                99.93%
              </span>
            </span>
            <span>{t("today")}</span>
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            {t("historyTitle")}
          </h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.date}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">
                    {h.date}
                  </span>
                  <StatusBadge status={h.status} />
                </div>
                <p className="text-sm text-slate-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
