"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import toast from "react-hot-toast";
import { toastErrorSafe } from "@/lib/toast-safe";

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

type SortBy = "created_at_desc" | "created_at_asc" | "email_asc" | "email_desc" | "status_asc";

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<NewsletterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [active, setActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>("created_at_desc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pendingUnsubscribeEmail, setPendingUnsubscribeEmail] = useState<string | null>(null);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function loadNewsletter() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (active) params.set("active", active);

      const res = await fetch(
        `${getApiBaseUrl()}/admin/marketing/newsletter/subscriptions?${params.toString()}`,
        { credentials: "include" },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const nextError = payload?.message || payload?.error || "Chargement newsletter impossible";
        setError(nextError);
        toastErrorSafe(nextError);
        setRows([]);
        setTotal(0);
        return;
      }
      const list = Array.isArray(payload?.data) ? payload.data : [];
      setRows(list);
      const parsedTotal = Number(payload?.filtered_total ?? payload?.total ?? list.length);
      setTotal(Number.isFinite(parsedTotal) ? parsedTotal : list.length);
    } catch {
      const nextError = "Erreur reseau lors du chargement";
      setError(nextError);
      toastErrorSafe(nextError);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNewsletter().catch(() => undefined);
  }, [page, limit, search, status, active]);

  const displayRows = useMemo(() => {
    let list = [...rows];

    if (fromDate) {
      const from = new Date(`${fromDate}T00:00:00`);
      list = list.filter((row) => row.created_at && new Date(row.created_at) >= from);
    }
    if (toDate) {
      const to = new Date(`${toDate}T23:59:59`);
      list = list.filter((row) => row.created_at && new Date(row.created_at) <= to);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "created_at_asc":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "email_asc":
          return (a.email || "").localeCompare(b.email || "");
        case "email_desc":
          return (b.email || "").localeCompare(a.email || "");
        case "status_asc":
          return (a.status || "").localeCompare(b.status || "");
        case "created_at_desc":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    return list;
  }, [rows, fromDate, toDate, sortBy]);

  async function unsubscribe(email: string) {
    setMessage("");
    setError("");
    setUnsubscribeLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/marketing/newsletter/unsubscribe`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const nextError = payload?.message || payload?.error || "Desabonnement impossible";
        setError(nextError);
        toastErrorSafe(nextError);
        return;
      }
      const nextMessage = payload?.message || `Desabonnement effectue pour ${email}`;
      setMessage(nextMessage);
      toast.success(nextMessage);
      await loadNewsletter();
    } catch {
      const nextError = "Erreur reseau lors du desabonnement";
      setError(nextError);
      toastErrorSafe(nextError);
    } finally {
      setUnsubscribeLoading(false);
      setPendingUnsubscribeEmail(null);
    }
  }

  useEffect(() => {
    if (!pendingUnsubscribeEmail) return;

    const container = dialogRef.current;
    if (!container) return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));

    if (focusables.length) {
      focusables[0].focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!unsubscribeLoading) setPendingUnsubscribeEmail(null);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!activeEl || activeEl === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!activeEl || activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pendingUnsubscribeEmail, unsubscribeLoading]);

  async function exportCsv() {
    setMessage("");
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (active) params.set("active", active);
      const res = await fetch(
        `${getApiBaseUrl()}/admin/marketing/newsletter/subscriptions/export?${params.toString()}`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const nextError = payload?.message || payload?.error || "Export CSV impossible";
        setError(nextError);
        toastErrorSafe(nextError);
        return;
      }
      const content = await res.text();
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const nextMessage = "Export CSV termine.";
      setMessage(nextMessage);
      toast.success(nextMessage);
    } catch {
      const nextError = "Erreur reseau pendant l export.";
      setError(nextError);
      toastErrorSafe(nextError);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Newsletter Admin</h1>
        <p className="text-sm text-slate-500">
          Gestion CRM newsletter: recherche, filtres, tri, desabonnement, export CSV.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-6">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            placeholder="Recherche email/source..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Recherche newsletter"
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            placeholder="Status (active/unsubscribed)"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            value={active}
            onChange={(e) => {
              setActive(e.target.value as "" | "true" | "false");
              setPage(1);
            }}
          >
            <option value="">Tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="Date de debut"
          />
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="Date de fin"
          />
          <button
            type="button"
            onClick={() => exportCsv()}
            className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
          >
            Export CSV
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="created_at_desc">Plus recents</option>
            <option value="created_at_asc">Plus anciens</option>
            <option value="email_asc">Email A-Z</option>
            <option value="email_desc">Email Z-A</option>
            <option value="status_asc">Status A-Z</option>
          </select>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            value={String(limit)}
            onChange={(e) => {
              setLimit(Number(e.target.value) || 25);
              setPage(1);
            }}
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
          <button
            type="button"
            onClick={() => loadNewsletter()}
            className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
          >
            Rafraichir
          </button>
        </div>
      </section>

      {message ? <p className="text-sm text-emerald-700" aria-live="polite">{message}</p> : null}
      {error ? <p className="text-sm text-red-600" aria-live="assertive">{error}</p> : null}

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Active</th>
              <th className="px-3 py-2 text-left font-semibold">Locale</th>
              <th className="px-3 py-2 text-left font-semibold">Source</th>
              <th className="px-3 py-2 text-left font-semibold">Date creation</th>
              <th className="px-3 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-t border-slate-100 animate-pulse">
                  <td className="px-3 py-3" colSpan={7}>
                    <div className="h-4 rounded bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : displayRows.length ? (
              displayRows.map((row) => (
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
                      onClick={() => setPendingUnsubscribeEmail(row.email)}
                      className="rounded border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                    >
                      Desabonner
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={7}>
                  Aucun resultat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="flex items-center justify-between text-xs text-slate-600">
        <p>
          Page {page} • Resultats courants: {displayRows.length} • Total backend: {total}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
          >
            Precedent
          </button>
          <button
            type="button"
            disabled={rows.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
          >
            Suivant
          </button>
        </div>
      </section>

      {pendingUnsubscribeEmail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unsubscribe-dialog-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && !unsubscribeLoading) {
              setPendingUnsubscribeEmail(null);
            }
          }}
        >
          <div ref={dialogRef} className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h2 id="unsubscribe-dialog-title" className="text-base font-semibold text-slate-900">
              Confirmer le desabonnement
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cette action desactive l abonnement newsletter pour{" "}
              <span className="font-medium text-slate-900">{pendingUnsubscribeEmail}</span>.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingUnsubscribeEmail(null)}
                disabled={unsubscribeLoading}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={unsubscribeLoading}
                onClick={() => unsubscribe(pendingUnsubscribeEmail)}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 disabled:opacity-60"
              >
                {unsubscribeLoading ? "Confirmation..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
