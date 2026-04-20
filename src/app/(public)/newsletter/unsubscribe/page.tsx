"use client";

import { FormEvent, useState } from "react";
import { MailX } from "lucide-react";

export default function NewsletterUnsubscribePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Impossible de traiter votre desabonnement.");
        return;
      }
      setMessage(data.message || "Votre desabonnement a bien ete pris en compte.");
      setEmail("");
    } catch {
      setError("Erreur reseau. Merci de reessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] px-4 py-10 sm:py-14">
      <section className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2.5">
            <MailX className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Desabonnement newsletter</h1>
            <p className="text-sm text-slate-600">Saisissez votre adresse pour vous desabonner.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            placeholder="votre@email.com"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Traitement..." : "Me desabonner"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>
    </main>
  );
}
