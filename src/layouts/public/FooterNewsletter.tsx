"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        toast.error(data.error || "Impossible de s’inscrire pour le moment.");
        return;
      }
      toast.success("Merci ! Vous êtes inscrit·e à la newsletter.");
      setEmail("");
    } catch {
      toast.error("Erreur réseau. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={onSubmit}
      suppressHydrationWarning
    >
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          suppressHydrationWarning
          className="w-full pl-10 pr-6 py-2.5 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        suppressHydrationWarning
        className="w-full cursor-pointer py-3 bg-slate-900 text-white rounded-2xl font-bold text-md hover:bg-slate-800 transition-all shadow-md shadow-slate-200 disabled:opacity-60"
      >
        {loading ? "Envoi…" : "S'abonner à la newsletter"}
      </button>
      <p className="text-center text-[10px] text-slate-400 mt-1">
        Pas de spam. Désinscription possible à tout moment.
      </p>
    </form>
  );
}
