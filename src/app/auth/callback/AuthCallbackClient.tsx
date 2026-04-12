"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { Link } from "@/i18n/navigation";

export function AuthCallbackClient() {
  const t = useTranslations("authPages.callback");
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
          throw new Error(t("missingCodeState"));

        const base = getApiBaseUrl();
        const cb = new URL(`${base}/bff/auth/callback`);
        cb.searchParams.set("code", code);
        cb.searchParams.set("state", state);

        window.location.assign(cb.toString());
      } catch (e) {
        setError(e instanceof Error ? e.message : t("callbackError"));
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
              {t("failedTitle")}
            </h1>
            <p className="text-sm text-slate-500 break-words leading-relaxed">
              {error}
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all group"
          >
            {t("retry")}
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
            {t("inProgressTitle")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("inProgressDesc")}
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
