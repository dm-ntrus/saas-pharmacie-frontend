"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";

type WorkflowStatus = "draft" | "review" | "scheduled" | "published" | "archived";
type NewsletterRow = {
  subscription_key: string;
  email: string;
  status: string;
  active: boolean;
  locale?: string;
  source?: string;
  created_at?: string;
  updated_at?: string;
};

type MarketingTable =
  | "announcements"
  | "legalPages"
  | "helpCenterArticles"
  | "contactSubmissions";

const TABLE_TO_API: Record<MarketingTable, string> = {
  announcements: "announcements",
  legalPages: "legalPages",
  helpCenterArticles: "helpCenterArticles",
  contactSubmissions: "contactSubmissions",
};

export default function AdminMarketingContentPage() {
  const [table, setTable] = useState<MarketingTable>("announcements");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [transitionStatus, setTransitionStatus] = useState<WorkflowStatus>("review");
  const [scheduledPublishAt, setScheduledPublishAt] = useState<string>("");
  const [audit, setAudit] = useState<any[]>([]);
  const [expandedAuditKey, setExpandedAuditKey] = useState<string>("");
  const [newsletterRows, setNewsletterRows] = useState<NewsletterRow[]>([]);
  const [newsletterLoading, setNewsletterLoading] = useState<boolean>(false);
  const [newsletterSearch, setNewsletterSearch] = useState<string>("");
  const [newsletterStatus, setNewsletterStatus] = useState<string>("");
  const [newsletterActive, setNewsletterActive] = useState<"" | "true" | "false">("");
  const [newsletterPage, setNewsletterPage] = useState<number>(1);
  const [newsletterLimit, setNewsletterLimit] = useState<number>(25);
  const [newsletterTotal, setNewsletterTotal] = useState<number>(0);
  const [newsletterMessage, setNewsletterMessage] = useState<string>("");
  const [newsletterError, setNewsletterError] = useState<string>("");

  const listUrl = useMemo(() => {
    const q = new URLSearchParams();
    if (statusFilter) q.set("status", statusFilter);
    if (search) q.set("search", search);
    return `${getApiBaseUrl()}/admin/marketing/${TABLE_TO_API[table]}?${q.toString()}`;
  }, [table, statusFilter, search]);

  async function loadRows() {
    setLoading(true);
    try {
      const res = await fetch(listUrl, { credentials: "include" });
      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : payload.data ?? [];
      setRows(list);
      if (list.length > 0) {
        const first = list[0];
        const key =
          first.announcement_key ||
          first.page_key ||
          first.article_key ||
          first.submission_key ||
          "";
        setSelectedKey(String(key));
      } else {
        setSelectedKey("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadAudit() {
    const params = new URLSearchParams();
    params.set("table", TABLE_TO_API[table]);
    if (selectedKey) params.set("record_key", selectedKey);
    const res = await fetch(`${getApiBaseUrl()}/admin/marketing/audit?${params.toString()}`, {
      credentials: "include",
    });
    const payload = await res.json();
    setAudit(payload?.data ?? []);
  }

  async function loadNewsletter() {
    setNewsletterLoading(true);
    setNewsletterError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(newsletterPage));
      params.set("limit", String(newsletterLimit));
      if (newsletterSearch) params.set("search", newsletterSearch);
      if (newsletterStatus) params.set("status", newsletterStatus);
      if (newsletterActive) params.set("active", newsletterActive);
      const res = await fetch(
        `${getApiBaseUrl()}/admin/marketing/newsletter/subscriptions?${params.toString()}`,
        { credentials: "include" },
      );
      const payload = await res.json();
      if (!res.ok) {
        setNewsletterError(payload?.message || payload?.error || "Chargement newsletter impossible");
        setNewsletterRows([]);
        return;
      }
      const list = Array.isArray(payload?.data) ? payload.data : [];
      setNewsletterRows(list);
      const total = Number(payload?.filtered_total ?? payload?.total ?? list.length);
      setNewsletterTotal(Number.isFinite(total) ? total : list.length);
    } catch {
      setNewsletterError("Erreur reseau lors du chargement newsletter");
      setNewsletterRows([]);
    } finally {
      setNewsletterLoading(false);
    }
  }

  async function unsubscribeFromAdmin(email: string) {
    setNewsletterMessage("");
    setNewsletterError("");
    try {
      const res = await fetch(`${getApiBaseUrl()}/marketing/newsletter/unsubscribe`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNewsletterError(payload?.message || payload?.error || "Desabonnement impossible");
        return;
      }
      setNewsletterMessage(payload?.message || `Desabonnement effectue pour ${email}`);
      await loadNewsletter();
    } catch {
      setNewsletterError("Erreur reseau lors du desabonnement");
    }
  }

  async function exportNewsletterCsv() {
    setNewsletterMessage("");
    setNewsletterError("");
    try {
      const params = new URLSearchParams();
      if (newsletterSearch) params.set("search", newsletterSearch);
      if (newsletterStatus) params.set("status", newsletterStatus);
      if (newsletterActive) params.set("active", newsletterActive);
      const res = await fetch(
        `${getApiBaseUrl()}/admin/marketing/newsletter/subscriptions/export?${params.toString()}`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setNewsletterError(payload?.message || payload?.error || "Export CSV impossible");
        return;
      }
      const csvContent = await res.text();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setNewsletterMessage("Export CSV genere avec succes.");
    } catch {
      setNewsletterError("Erreur reseau lors de l export CSV");
    }
  }

  useEffect(() => {
    loadRows().catch(() => undefined);
  }, [listUrl]);

  useEffect(() => {
    if (selectedKey) loadAudit().catch(() => undefined);
  }, [table, selectedKey]);

  useEffect(() => {
    loadNewsletter().catch(() => undefined);
  }, [newsletterPage, newsletterLimit]);

  async function onTransition(e: FormEvent) {
    e.preventDefault();
    if (!selectedKey) return;
    if (transitionStatus === "scheduled" && scheduledPublishAt) {
      await fetch(
        `${getApiBaseUrl()}/admin/marketing/${TABLE_TO_API[table]}/${encodeURIComponent(
          selectedKey,
        )}/transition`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to_status: transitionStatus,
            scheduled_publish_at: new Date(scheduledPublishAt).toISOString(),
          }),
        },
      );
    } else {
      await fetch(
        `${getApiBaseUrl()}/admin/marketing/${TABLE_TO_API[table]}/${encodeURIComponent(
          selectedKey,
        )}/transition`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to_status: transitionStatus }),
        },
      );
    }
    await loadRows();
    await loadAudit();
  }

  async function onRollback(auditKey: string) {
    if (!selectedKey) return;
    await fetch(
      `${getApiBaseUrl()}/admin/marketing/${TABLE_TO_API[table]}/${encodeURIComponent(
        selectedKey,
      )}/rollback/${encodeURIComponent(auditKey)}`,
      { method: "POST", credentials: "include" },
    );
    await loadRows();
    await loadAudit();
  }

  function getChangedKeys(entry: any): string[] {
    const prev = entry?.previous_value ?? {};
    const next = entry?.next_value ?? {};
    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    return Array.from(keys).filter((key) => JSON.stringify(prev[key]) !== JSON.stringify(next[key]));
  }

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Marketing Content Workflow</h1>
        <p className="text-sm text-slate-500">
          Gestion enterprise: filtre, transition, audit et rollback.
        </p>
      </header>

      <section className="bg-white border border-slate-200 rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={table}
          onChange={(e) => setTable(e.target.value as MarketingTable)}
        >
          <option value="announcements">Announcements</option>
          <option value="legalPages">Legal Pages</option>
          <option value="helpCenterArticles">Help Center Articles</option>
          <option value="contactSubmissions">Contact Submissions</option>
        </select>
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Status (draft/published/...)"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <button
          className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold"
          onClick={() => loadRows()}
        >
          Rafraichir
        </button>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Records</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Chargement...</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-auto">
              {rows.map((row: any, index: number) => {
                const key =
                  row.announcement_key ||
                  row.page_key ||
                  row.article_key ||
                  row.submission_key ||
                  String(index);
                const isSelected = selectedKey === key;
                return (
                  <button
                    key={key}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-sm ${
                      isSelected ? "border-emerald-400 bg-emerald-50" : "border-slate-200"
                    }`}
                    onClick={() => setSelectedKey(String(key))}
                  >
                    <p className="font-medium text-slate-900">{String(key)}</p>
                    <p className="text-xs text-slate-500">
                      {row.workflow_status ?? row.status ?? "n/a"} • active: {String(!!row.active)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <form
            onSubmit={onTransition}
            className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
          >
            <h2 className="font-semibold">Workflow Transition</h2>
            <p className="text-xs text-slate-500">Record: {selectedKey || "none"}</p>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={transitionStatus}
              onChange={(e) => setTransitionStatus(e.target.value as WorkflowStatus)}
            >
              <option value="draft">draft</option>
              <option value="review">review</option>
              <option value="scheduled">scheduled</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            {transitionStatus === "scheduled" && (
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={scheduledPublishAt}
                onChange={(e) => setScheduledPublishAt(e.target.value)}
              />
            )}
            <button
              type="submit"
              disabled={!selectedKey}
              className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Appliquer transition
            </button>
          </form>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Audit Trail</h2>
            <div className="space-y-2 max-h-[280px] overflow-auto">
              {audit.map((entry: any) => (
                <div key={entry.audit_key} className="rounded-lg border border-slate-200 p-2">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-xs text-slate-500">
                    {entry.table_key} / {entry.record_key}
                  </p>
                  <p className="text-xs text-slate-400">{entry.created_at}</p>
                  <div className="mt-2">
                    <button
                      className="text-xs font-semibold text-slate-700 hover:underline"
                      onClick={() =>
                        setExpandedAuditKey((current) =>
                          current === entry.audit_key ? "" : entry.audit_key,
                        )
                      }
                    >
                      {expandedAuditKey === entry.audit_key
                        ? "Masquer comparaison"
                        : "Voir comparaison before/after"}
                    </button>
                  </div>
                  {expandedAuditKey === entry.audit_key && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-emerald-700">
                        Champs modifies:{" "}
                        {getChangedKeys(entry).length
                          ? getChangedKeys(entry).join(", ")
                          : "aucun"}
                      </p>
                      <div className="rounded border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-3 text-[11px] font-semibold bg-slate-100">
                          <div className="px-2 py-1">Champ</div>
                          <div className="px-2 py-1">Before</div>
                          <div className="px-2 py-1">After</div>
                        </div>
                        {getChangedKeys(entry).map((field) => (
                          <div key={field} className="grid grid-cols-3 text-[11px] border-t border-slate-100">
                            <div className="px-2 py-1 font-medium text-slate-700">{field}</div>
                            <div className="px-2 py-1 text-slate-500 break-all">
                              {formatValue(entry?.previous_value?.[field])}
                            </div>
                            <div className="px-2 py-1 text-emerald-700 break-all">
                              {formatValue(entry?.next_value?.[field])}
                            </div>
                          </div>
                        ))}
                        {!getChangedKeys(entry).length && (
                          <div className="px-2 py-1 text-[11px] text-slate-500">
                            Aucun changement detecte.
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="rounded border border-slate-200 p-2 bg-slate-50">
                          <p className="text-[11px] font-semibold text-slate-600 mb-1">Before</p>
                          <pre className="text-[10px] whitespace-pre-wrap overflow-auto max-h-40">
                            {JSON.stringify(entry.previous_value ?? {}, null, 2)}
                          </pre>
                        </div>
                        <div className="rounded border border-slate-200 p-2 bg-emerald-50/30">
                          <p className="text-[11px] font-semibold text-emerald-700 mb-1">After</p>
                          <pre className="text-[10px] whitespace-pre-wrap overflow-auto max-h-40">
                            {JSON.stringify(entry.next_value ?? {}, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
                    onClick={() => onRollback(entry.audit_key)}
                    disabled={!entry.previous_value}
                  >
                    Rollback vers cet etat
                  </button>
                </div>
              ))}
              {!audit.length && <p className="text-sm text-slate-500">Aucun evenement.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Newsletter Subscriptions</h2>
            <p className="text-xs text-slate-500">
              Listing, filtres, desabonnement manuel et export CSV.
            </p>
          </div>
          <button
            type="button"
            onClick={() => exportNewsletterCsv()}
            className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold"
          >
            Export CSV
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Recherche email/source..."
            value={newsletterSearch}
            onChange={(e) => setNewsletterSearch(e.target.value)}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Status (active/unsubscribed)"
            value={newsletterStatus}
            onChange={(e) => setNewsletterStatus(e.target.value)}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={newsletterActive}
            onChange={(e) => setNewsletterActive(e.target.value as "" | "true" | "false")}
          >
            <option value="">Tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={String(newsletterLimit)}
            onChange={(e) => {
              setNewsletterLimit(Number(e.target.value) || 25);
              setNewsletterPage(1);
            }}
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
          <button
            type="button"
            className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-semibold"
            onClick={() => {
              setNewsletterPage(1);
              loadNewsletter().catch(() => undefined);
            }}
          >
            Appliquer filtres
          </button>
        </div>

        {newsletterMessage ? (
          <p className="text-sm text-emerald-700">{newsletterMessage}</p>
        ) : null}
        {newsletterError ? <p className="text-sm text-red-600">{newsletterError}</p> : null}

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs text-slate-600">
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Active</th>
                <th className="px-3 py-2 font-semibold">Locale</th>
                <th className="px-3 py-2 font-semibold">Source</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {newsletterLoading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={7}>
                    Chargement newsletter...
                  </td>
                </tr>
              ) : newsletterRows.length ? (
                newsletterRows.map((row) => (
                  <tr key={row.subscription_key} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-900">{row.email}</td>
                    <td className="px-3 py-2 text-slate-600">{row.status || "n/a"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.active ? "true" : "false"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.locale || "-"}</td>
                    <td className="px-3 py-2 text-slate-600">{row.source || "-"}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        disabled={!row.active}
                        className="rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs font-semibold disabled:opacity-40"
                        onClick={() => unsubscribeFromAdmin(row.email)}
                      >
                        Desabonner
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={7}>
                    Aucun abonnement newsletter trouve.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <p>
            Page {newsletterPage} • Total affiche: {newsletterRows.length} / {newsletterTotal}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={newsletterPage <= 1}
              onClick={() => setNewsletterPage((p) => Math.max(1, p - 1))}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40"
            >
              Precedent
            </button>
            <button
              type="button"
              disabled={newsletterRows.length < newsletterLimit}
              onClick={() => setNewsletterPage((p) => p + 1)}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

