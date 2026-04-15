"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n-simple";
import {
  ArrowLeft,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Erreur lors de la synchronisation des stocks",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "TKT-002",
    subject: "Demande de fonctionnalité: Export PDF des factures",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-10T14:22:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
  },
  {
    id: "TKT-003",
    subject: "Guide d'installation de l'application mobile",
    status: "resolved",
    priority: "low",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-06T11:20:00Z",
  },
];

const statusConfig: Record<string, { labelKey: string; color: string; bg: string }> = {
  open: { labelKey: "statusOpen", color: "text-amber-700", bg: "bg-amber-50" },
  pending: { labelKey: "statusPending", color: "text-blue-700", bg: "bg-blue-50" },
  resolved: { labelKey: "statusResolved", color: "text-emerald-700", bg: "bg-emerald-50" },
  closed: { labelKey: "statusClosed", color: "text-slate-500", bg: "bg-slate-50" },
};

const priorityConfig: Record<string, { labelKey: string; color: string }> = {
  low: { labelKey: "priorityLow", color: "text-slate-500" },
  medium: { labelKey: "priorityMedium", color: "text-amber-600" },
  high: { labelKey: "priorityHigh", color: "text-orange-600" },
  critical: { labelKey: "priorityCritical", color: "text-red-600" },
};

export default function TicketsPage() {
  const t = useTranslations("pages.tickets");
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [filter, setFilter] = useState<string>("all");

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((tk) => tk.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
  };

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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {["all", "open", "pending", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter === "all" ? t("filterAll") : t(`filters.${f}`)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            {t("newTicket")}
          </button>
        </div>

        {/* New Ticket Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-slate-50 rounded-3xl border border-slate-100 p-8"
          >
            <h2 className="text-lg font-display font-bold text-slate-900 mb-6">
              {t("formTitle")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {t("subjectLabel")}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {t("priorityLabel")}
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
                  <option value="low">{t("priorityLow")}</option>
                  <option value="medium">{t("priorityMedium")}</option>
                  <option value="high">{t("priorityHigh")}</option>
                  <option value="critical">{t("priorityCritical")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {t("descriptionLabel")}
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {t("attachmentsLabel")}
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">{t("attachmentsHint")}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t("submitTicket")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          statusConfig[ticket.status].bg
                        } ${statusConfig[ticket.status].color}`}
                      >
                        {t(`status.${statusConfig[ticket.status].labelKey}`)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          priorityConfig[ticket.priority].color
                        }`}
                      >
                        {t(`priority.${priorityConfig[ticket.priority].labelKey}`)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChevronDown className="w-3.5 h-3.5" />
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/support/tickets/${ticket.id}`}
                    className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">{t("noTickets")}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-sm text-slate-900">{t("infoResponseTime")}</span>
            </div>
            <p className="text-xs text-slate-500">{t("infoResponseTimeDesc")}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm text-slate-900">{t("infoSLA")}</span>
            </div>
            <p className="text-xs text-slate-500">{t("infoSLADesc")}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-sm text-slate-900">{t("infoUrgency")}</span>
            </div>
            <p className="text-xs text-slate-500">{t("infoUrgencyDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}