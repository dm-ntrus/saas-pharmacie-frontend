"use client";

import { motion } from "framer-motion";
import {
  Package,
  BarChart3,
  Users,
  ShieldCheck,
  Cloud,
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
  Truck,
  Gift,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: Package,
    title: "Gestion des stocks intelligente",
    desc: "Suivi en temps réel, alertes de péremption automatiques et gestion multi-dépôts.",
    details: [
      "Inventaire tournant",
      "Codes-barres",
      "Transferts inter-sites",
      "Valorisation du stock",
    ],
  },
  {
    icon: BarChart3,
    title: "Ventes & facturation POS",
    desc: "Interface de vente ultra-rapide compatible avec écrans tactiles et lecteurs de codes-barres.",
    details: [
      "Multi-modes de paiement",
      "Remises gérées",
      "Tickets personnalisés",
      "Mode hors-ligne",
    ],
  },
  {
    icon: Users,
    title: "Gestion des patients & CRM",
    desc: "Historique complet des prescriptions et suivi personnalisé pour chaque patient.",
    details: [
      "Dossier médical partagé",
      "Rappels de traitement",
      "Programmes de fidélité",
      "Notes cliniques",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Conformité & sécurité",
    desc: "Hébergement sécurisé des données de santé et traçabilité complète de chaque action.",
    details: [
      "Chiffrement AES-256",
      "Sauvegardes horaires",
      "Logs d'audit",
      "Accès par rôles",
    ],
  },
  {
    icon: Cloud,
    title: "Accès cloud & mobilité",
    desc: "Gérez votre pharmacie depuis n'importe où, sur PC, tablette ou smartphone.",
    details: [
      "Synchro temps réel",
      "Responsive design",
      "Multi-utilisateurs",
      "Zéro installation",
    ],
  },
  {
    icon: Layers,
    title: "Rapports & analyses",
    desc: "Tableaux de bord prédictifs pour anticiper vos besoins et optimiser votre rentabilité.",
    details: [
      "Prévisions de ventes",
      "Top 10 produits",
      "Marges nettes",
      "Exports Excel / PDF",
    ],
  },
  {
    icon: Truck,
    title: "Livraisons & logistique",
    desc: "Suivi des tournées, statuts de commande et service à domicile structuré.",
    details: [
      "Bons de livraison",
      "Suivi des statuts",
      "Zones de livraison",
      "Notifications client",
    ],
  },
  {
    icon: Gift,
    title: "Fidélité & CRM",
    desc: "Programmes de points, avantages et campagnes ciblées pour fidéliser vos patients.",
    details: [
      "Points de fidélité",
      "Offres personnalisées",
      "Historique client",
      "Segments & ciblage",
    ],
  },
  {
    icon: FileText,
    title: "Supply chain & achats",
    desc: "De la demande d'achat à la réception marchandise, un circuit achat complet.",
    details: [
      "Demandes d'achat",
      "Bons de commande",
      "Réception (GRN)",
      "Devis fournisseurs",
    ],
  },
];

const integrations = [
  {
    title: "Mobile Money",
    desc: "M-Pesa, Airtel Money, Orange Money.",
  },
  {
    title: "Comptabilité",
    desc: "Export direct vers Sage, QuickBooks.",
  },
  {
    title: "Grossistes",
    desc: "Commandes automatiques via EDI.",
  },
  {
    title: "Assurances",
    desc: "Vérification des droits en temps réel.",
  },
];

const deploySteps = [
  {
    step: "01",
    title: "Configuration",
    desc: "Importez vos stocks existants et configurez vos accès utilisateurs en quelques clics.",
  },
  {
    step: "02",
    title: "Formation",
    desc: "Accédez à nos tutoriels interactifs ou demandez une session avec nos experts.",
  },
  {
    step: "03",
    title: "Lancement",
    desc: "Commencez à vendre et à gérer votre officine avec une efficacité décuplée.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
              Fonctionnalités
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              Tout ce dont vous avez besoin pour{" "}
              <span className="text-emerald-600">réussir</span>.
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-6">
              Une plateforme tout-en-un conçue spécifiquement pour les défis de
              la pharmacie moderne en Afrique.
            </p>
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors"
            >
              Catalogue détaillé de tous les modules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-7 sm:p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-emerald-600 transition-colors">
                  <f.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  {f.desc}
                </p>
                <ul className="space-y-2">
                  {f.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-sm text-slate-600 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">
                Écosystème
              </p>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                Connecté à votre{" "}
                <span className="text-emerald-600">monde.</span>
              </h2>
              <p className="text-base text-slate-500 leading-relaxed font-medium mb-10">
                SyntixPharma s&apos;intègre parfaitement avec les outils que vous
                utilisez déjà.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {integrations.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    className="aspect-square bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-4"
                  >
                    <div className="w-full h-full bg-slate-50 rounded-lg" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deploy */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Déploiement
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-3 tracking-tight">
              Prêt en{" "}
              <span className="text-emerald-600">3 étapes.</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium">
              Une transition fluide vers la pharmacie du futur.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
            {deploySteps.map((item) => (
              <div
                key={item.step}
                className="relative z-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="text-5xl font-display font-bold text-emerald-100 mb-4 group-hover:text-emerald-600 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4 leading-tight">
                Une interface{" "}
                <span className="text-emerald-400">intuitive</span>, aucune
                formation requise.
              </h2>
              <p className="text-base text-slate-400 mb-8 leading-relaxed">
                Des milliers d&apos;heures d&apos;observation en officine pour créer
                l&apos;interface la plus fluide du marché. Opérationnel en moins de
                30 minutes.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Mode sombre pour le travail de nuit",
                  "Raccourcis clavier pour les experts",
                  "Recherche universelle ultra-rapide",
                  "Support multilingue (Français, Anglais, Swahili)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 bg-emerald-500/20 blur-[80px] rounded-full" />
              <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-3 shadow-2xl">
                <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/images/tenant.svg"
                    alt="Dashboard"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
