"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { keycloakOidc } from "@/services/keycloak-oidc.service";
import { tokenService } from "@/services/token.service";
import { jwtService, normalizeJwtOrganizations } from "@/services/jwt.service";
import { setCookie } from "@/utils/cookies";
import AuthShell from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";

export default function TenantAuthCallbackPage() {
  const t = useTranslations("authPages.callback");
  const tTenant = useTranslations("authPages.tenant");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const tenantSlug = String(params?.tenant_slug || "");
  const [error, setError] = useState<string | null>(null);
  const [crossTenantInfo, setCrossTenantInfo] = useState<{
    actualSlug: string;
    requestedSlug: string;
  } | null>(null);

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
          throw new Error(t("missingCodeState"));

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

        // System admin → admin panel
        const isAdmin =
          decoded.realm_access?.roles?.includes("system_admin");
        if (isAdmin) {
          router.replace("/admin");
          return;
        }

        // Normalize KC26 map format → array
        const orgs = normalizeJwtOrganizations(decoded.organizations);

        // Cross-tenant verification
        const userOrgSlugs = orgs
          .map((o) => o.attributes?.subdomain?.[0] || o.name)
          .filter((s): s is string => !!s)
          .map((s) => s.toLowerCase());

        if (
          userOrgSlugs.length > 0 &&
          !userOrgSlugs.includes(tenantSlug.toLowerCase())
        ) {
          const actualSlug = userOrgSlugs[0];
          setCrossTenantInfo({
            actualSlug,
            requestedSlug: tenantSlug,
          });
          tokenService.clearTokens();
          return;
        }

        const firstOrg = orgs[0];
        const slug =
          firstOrg?.attributes?.subdomain?.[0] || firstOrg?.name || tenantSlug;
        setCookie("slug_organization", slug);
        if (firstOrg?.attributes?.tenant_id?.[0]) {
          setCookie("tenant_id", firstOrg.attributes.tenant_id[0]);
        }

        const post = keycloakOidc.getPostLoginRedirect();
        keycloakOidc.clearPostLoginRedirect();
        router.replace(post || `/tenant/${slug}/dashboard`);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("callbackError"));
      }
    })();
  }, [code, state, err, errDesc, router, tenantSlug]);

  // Cross-tenant access blocked
  if (crossTenantInfo) {
    return (
      <AuthShell>
        <div className="space-y-6 py-8">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
              {tTenant("wrongOrganization")}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {tTenant("crossTenantPart1")}{" "}
              <strong className="text-slate-700">
                {crossTenantInfo.requestedSlug}
              </strong>
              . {tTenant("crossTenantBelong")}{" "}
              <strong className="text-emerald-600">
                {crossTenantInfo.actualSlug}
              </strong>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={`/tenant/${crossTenantInfo.actualSlug}/auth/login`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all group"
            >
              {tTenant("goTo")} {crossTenantInfo.actualSlug}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/tenant/${crossTenantInfo.requestedSlug}/auth/login`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              {tTenant("retryAnotherAccount")}
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

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
            href={`/tenant/${tenantSlug}/auth/login`}
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
