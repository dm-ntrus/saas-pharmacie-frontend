"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Données collectées",
    content:
      "Nous collectons les données nécessaires à la fourniture de nos services : informations de compte (nom, email, téléphone), données d'utilisation (logs, préférences), et données métier (inventaire, ventes, patients) saisies par vos soins.",
  },
  {
    title: "2. Utilisation des données",
    content:
      "Vos données sont utilisées exclusivement pour fournir, améliorer et sécuriser nos services. Nous n'utilisons jamais les données de santé de vos patients à des fins publicitaires ou de marketing.",
  },
  {
    title: "3. Stockage et sécurité",
    content:
      "Les données sont hébergées sur des serveurs sécurisés avec chiffrement AES-256 au repos et TLS 1.3 en transit. Des sauvegardes automatiques sont réalisées toutes les heures. L'accès aux données est strictement contrôlé par rôle.",
  },
  {
    title: "4. Partage des données",
    content:
      "Nous ne vendons jamais vos données. Le partage est limité aux prestataires techniques nécessaires au fonctionnement du service (hébergement, paiement) et aux obligations légales.",
  },
  {
    title: "5. Vos droits",
    content:
      "Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à privacy@syntixpharma.com.",
  },
  {
    title: "6. Cookies",
    content:
      "Nous utilisons des cookies strictement nécessaires au fonctionnement du service (session, préférences). Aucun cookie de tracking publicitaire n'est utilisé.",
  },
  {
    title: "7. Conservation",
    content:
      "Les données de compte sont conservées pendant la durée de l'abonnement plus 30 jours. Les données d'utilisation anonymisées peuvent être conservées à des fins statistiques.",
  },
  {
    title: "8. Contact",
    content:
      "Pour toute question relative à la protection de vos données, contactez notre Délégué à la Protection des Données : privacy@syntixpharma.com",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Légal
              </p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Politique de confidentialité
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Dernière mise à jour : 1er avril 2026
          </p>
        </motion.div>

        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 mb-10">
          <p className="text-sm text-emerald-800 font-medium leading-relaxed">
            Chez SyntixPharma, la protection de vos données et de celles de vos
            patients est notre priorité absolue. Nous nous engageons à une
            transparence totale sur la collecte, l&apos;utilisation et la
            protection de vos informations.
          </p>
        </div>

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
            Questions sur vos données ?{" "}
            <a
              href="mailto:privacy@syntixpharma.com"
              className="text-emerald-600 font-bold hover:underline"
            >
              privacy@syntixpharma.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
