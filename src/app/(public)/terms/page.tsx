"use client";

import { motion } from "framer-motion";
import { PLATFORM } from "@/config/platform";

const sections = [
  {
    title: "1. Acceptation des conditions",
    content:
      "En accédant à SyntixPharma, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas l'ensemble de ces conditions, vous ne devez pas utiliser nos services.",
  },
  {
    title: "2. Description du service",
    content:
      "SyntixPharma est une plateforme SaaS de gestion pharmaceutique proposant des fonctionnalités de point de vente, gestion des stocks, suivi des patients, supply chain, comptabilité et analytique. Le service est fourni « tel quel » et est accessible via navigateur web.",
  },
  {
    title: "3. Comptes utilisateurs",
    content:
      "Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités réalisées sous votre compte. Vous devez nous notifier immédiatement en cas d'utilisation non autorisée de votre compte.",
  },
  {
    title: "4. Protection des données",
    content:
      "Les données de santé sont traitées conformément aux réglementations en vigueur. Nous utilisons un chiffrement AES-256 et des sauvegardes quotidiennes. Les données restent la propriété exclusive du client.",
  },
  {
    title: "5. Abonnements et paiements",
    content:
      "Les abonnements sont facturés mensuellement ou annuellement selon le plan choisi. Les prix sont indiqués en dollars américains (USD). En cas de non-paiement, l'accès au service peut être suspendu après notification.",
  },
  {
    title: "6. Résiliation",
    content:
      "Vous pouvez résilier votre abonnement à tout moment depuis votre tableau de bord. La résiliation prend effet à la fin de la période de facturation en cours. Vos données restent disponibles pendant 30 jours après résiliation.",
  },
  {
    title: "7. Limitation de responsabilité",
    content:
      "SyntixPharma ne saurait être tenu responsable des dommages indirects, accidentels ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service. Notre responsabilité totale est limitée au montant payé par le client au cours des 12 derniers mois.",
  },
  {
    title: "8. Modifications",
    content:
      "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur cette page. La date de dernière mise à jour est indiquée en haut de ce document.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
            Légal
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-sm text-slate-400">
            Dernière mise à jour : 1er avril 2026
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-2">
                {s.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Des questions sur ces conditions ?{" "}
            <a
              href={`mailto:${PLATFORM.email.legal}`}
              className="text-emerald-600 font-bold hover:underline"
            >
              {PLATFORM.email.legal}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
