"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getCookie, setCookie } from "@/utils/cookies";
import {
  Building,
  CheckCircle2,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  roles: string[];
  tenantId: string;
  subdomain: string;
}

export default function SelectOrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const base = api.replace(/\/+$/, "");

    axios
      .get(`${base}/api/v1/bff/auth/me`, { withCredentials: true })
      .then((r) => {
        const u = r.data?.user;
        const orgs: Organization[] = (u?.keycloakOrganizations || []).map(
          (org: any) => ({
            id: org.id,
            name: org.name,
            roles: org.roles || [],
            tenantId: org.attributes?.tenant_id?.[0] || "",
            subdomain: org.attributes?.subdomain?.[0] || "",
          }),
        );
        setOrganizations(orgs);

        const savedOrg = getCookie("current_organization");
        if (savedOrg && orgs.some((o) => o.id === savedOrg)) {
          setSelectedOrg(savedOrg);
        } else if (orgs.length > 0) {
          setSelectedOrg(orgs[0].id);
        }
      })
      .catch(() => {
        setError(
          "Impossible de charger vos organisations. Veuillez vous reconnecter.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = () => {
    if (!selectedOrg) return;
    setCookie("current_organization", selectedOrg);
    localStorage.setItem("current_organization", selectedOrg);

    const org = organizations.find((o) => o.id === selectedOrg);
    if (org?.subdomain) {
      window.location.href = `/tenant/${org.subdomain}/dashboard`;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <AuthShell
      testimonial={{
        quote:
          "Gérer plusieurs pharmacies n'a jamais été aussi simple. Un clic et je suis dans le bon environnement.",
        name: "Dr. Amisi Kabila",
        title: "Groupe Médical Horizon",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
            <Building className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Choisissez votre{" "}
            <span className="text-emerald-600">organisation</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sélectionnez l&apos;espace de travail auquel vous souhaitez accéder.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">{error}</p>
              <Link
                href="/auth/login"
                className="text-sm text-red-600 font-bold hover:underline mt-1 inline-block"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && organizations.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-4">
              Aucune organisation trouvée pour ce compte.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Créer une pharmacie
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!loading && organizations.length > 0 && (
          <>
            <div className="space-y-2">
              {organizations.map((org, i) => (
                <motion.button
                  key={org.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedOrg(org.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedOrg === org.id
                      ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-600/5"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg transition-colors ${
                      selectedOrg === org.id
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {org.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {org.roles.join(", ") || "Membre"}
                      {org.subdomain && (
                        <span className="ml-2 font-mono text-emerald-600">
                          {org.subdomain}
                        </span>
                      )}
                    </p>
                  </div>
                  {selectedOrg === org.id && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedOrg}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-900/15 group"
            >
              Continuer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </motion.div>
    </AuthShell>
  );
}
