"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import { tokenService } from "@/services/token.service";
import { jwtService } from "@/services/jwt.service";
import { setCookie } from "@/utils/cookies";
import AuthShell from "@/components/auth/AuthShell";

export default function TenantAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const tenantSlug = String(params?.tenant_slug || "");
  const [error, setError] = useState<string | null>(null);

  const code = useMemo(
    () => searchParams?.get("code") ?? null,
    [searchParams],
  );
  const state = useMemo(
    () => searchParams?.get("state") ?? null,
    [searchParams],
  );
  const err = useMemo(
    () => searchParams?.get("error") ?? null,
    [searchParams],
  );
  const errDesc = useMemo(
    () => searchParams?.get("error_description") ?? null,
    [searchParams],
  );

  useEffect(() => {
    (async () => {
      try {
        if (err)
          throw new Error(`${err}${errDesc ? `: ${errDesc}` : ""}`);
        if (!code || !state)
          throw new Error("Missing code/state in callback URL");

        const tokens = await keycloakOidc.exchangeCodeForTokens({
          code,
          state,
          redirectPath: `/tenant/${tenantSlug}/auth/callback`,
        });

        tokenService.setTokens(
          tokens.access_token,
          tokens.refresh_token || "",
          tokens.expires_in,
          tokens.id_token,
        );

        const decoded = jwtService.decode(tokens.access_token);
        const isAdmin =
          decoded.realm_access?.roles?.includes("system_admin");
        if (isAdmin) {
          router.replace("/admin");
          return;
        }

        const firstOrg = decoded.organizations?.[0];
        const slug =
          firstOrg?.attributes?.subdomain?.[0] || tenantSlug;
        setCookie("slug_organization", slug);
        if (firstOrg?.attributes?.tenant_id?.[0]) {
          setCookie("tenant_id", firstOrg.attributes.tenant_id[0]);
        }

        const post = keycloakOidc.getPostLoginRedirect();
        keycloakOidc.clearPostLoginRedirect();
        router.replace(post || `/tenant/${slug}/dashboard`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Callback error");
      }
    })();
  }, [code, state, err, errDesc, router, tenantSlug]);

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
            href={`/tenant/${tenantSlug}/auth/login`}
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
