"use client";

import { motion } from "framer-motion";
import { Code, Braces, Key, FileText, ArrowRight, Terminal, Webhook } from "lucide-react";
import Link from "next/link";
import { PLATFORM } from "@/config/platform";

const endpoints = [
  { method: "GET", path: "/api/v1/products", desc: "Liste des produits de l'inventaire" },
  { method: "POST", path: "/api/v1/sales", desc: "Créer une nouvelle vente" },
  { method: "GET", path: "/api/v1/patients", desc: "Liste des patients enregistrés" },
  { method: "GET", path: "/api/v1/inventory/alerts", desc: "Alertes de stock et péremption" },
  { method: "POST", path: "/api/v1/prescriptions", desc: "Enregistrer une ordonnance" },
  { method: "GET", path: "/api/v1/analytics/dashboard", desc: "Données du tableau de bord" },
];

const sdks = [
  { lang: "JavaScript / TypeScript", icon: Braces },
  { lang: "Python", icon: Terminal },
  { lang: "cURL / REST", icon: Code },
];

function MethodBadge({ method }: { method: string }) {
  const colors =
    method === "GET"
      ? "bg-emerald-100 text-emerald-700"
      : method === "POST"
        ? "bg-blue-100 text-blue-700"
        : method === "PUT"
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700";
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${colors}`}>
      {method}
    </span>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              Développeurs
            </p>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              API <span className="text-emerald-600">RESTful</span>
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
              Intégrez SyntixPharma à vos systèmes existants grâce à notre API
              sécurisée et bien documentée.
            </p>
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-3 gap-5 mb-12 sm:mb-16">
          {[
            { icon: Key, title: "Auth JWT / OAuth2", desc: "Authentification sécurisée via tokens." },
            { icon: Webhook, title: "Webhooks temps réel", desc: "Notifications push pour chaque événement." },
            { icon: FileText, title: "OpenAPI 3.0", desc: "Spécification complète avec Swagger UI." },
          ].map((h) => (
            <div
              key={h.title}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <h.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                {h.title}
              </h3>
              <p className="text-sm text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Endpoints */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
            Points d&apos;accès populaires
          </h2>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all"
              >
                <MethodBadge method={ep.method} />
                <code className="text-sm font-mono font-bold text-slate-700 flex-1">
                  {ep.path}
                </code>
                <span className="text-sm text-slate-400 hidden sm:block">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code sample */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 mb-12 sm:mb-16 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Exemple rapide
            </span>
          </div>
          <pre className="text-sm text-slate-300 font-mono leading-relaxed">
            <code>{`curl -X GET ${PLATFORM.apiDocsUrl}/v1/products \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"

# Réponse (200)
{
  "data": [
    { "id": "prod_001", "name": "Paracetamol 500mg", "stock": 1200 },
    { "id": "prod_002", "name": "Amoxicilline 250mg", "stock": 340 }
  ],
  "total": 2847,
  "page": 1
}`}</code>
          </pre>
        </div>

        {/* SDKs */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
            SDKs & Bibliothèques
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {sdks.map((sdk) => (
              <div
                key={sdk.lang}
                className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-50 transition-colors">
                  <sdk.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {sdk.lang}
                  </h4>
                  <p className="text-xs text-slate-400">Disponible</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
            Prêt à intégrer ?
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Créez votre compte développeur et obtenez vos clés API en quelques
            minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              Obtenir mes clés API
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:border-emerald-300 transition-all"
            >
              Parler à l&apos;équipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
