"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const code = useMemo(() => searchParams?.get("code") ?? null, [searchParams]);
  const state = useMemo(
    () => searchParams?.get("state") ?? null,
    [searchParams],
  );
  const err = useMemo(() => searchParams?.get("error") ?? null, [searchParams]);
  const errDesc = useMemo(
    () => searchParams?.get("error_description") ?? null,
    [searchParams],
  );

  useEffect(() => {
    (async () => {
      try {
        if (err) {
          throw new Error(`${err}${errDesc ? `: ${errDesc}` : ""}`);
        }
        if (!code || !state)
          throw new Error("Missing code/state in callback URL");

        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const base = api.replace(/\/+$/, "");
        const cb = new URL(`${base}/api/v1/bff/auth/callback`);
        cb.searchParams.set("code", code);
        cb.searchParams.set("state", state);

        window.location.assign(cb.toString());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Callback error");
      }
    })();
  }, [code, state, err, errDesc, router]);

  if (error) {
    return (
      <AuthShell>
        <div className="space-y-6 py-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
              Connexion échouée
            </h1>
            <p className="text-sm text-slate-500 break-words leading-relaxed">
              {error}
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all group"
          >
            Réessayer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <div className="text-center">
          <h1 className="text-xl font-display font-bold text-slate-900 mb-1">
            Connexion en cours…
          </h1>
          <p className="text-sm text-slate-500">
            Finalisation de votre session sécurisée.
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
