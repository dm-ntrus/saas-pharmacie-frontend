'use client';

import { motion } from 'motion/react';
import { 
  Package, 
  BarChart3, 
  Users, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Cloud, 
  Layers,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: Package,
    title: "Gestion des Stocks Intelligente",
    desc: "Suivi en temps réel, alertes de péremption automatiques et gestion multi-dépôts.",
    details: ["Inventaire tournant", "Codes-barres", "Transferts inter-sites", "Valorisation du stock"]
  },
  {
    icon: BarChart3,
    title: "Ventes & Facturation POS",
    desc: "Interface de vente ultra-rapide compatible avec écrans tactiles et lecteurs de codes-barres.",
    details: ["Multi-modes de paiement", "Remises gérées", "Tickets personnalisés", "Mode hors-ligne"]
  },
  {
    icon: Users,
    title: "Gestion des Patients & CRM",
    desc: "Historique complet des prescriptions et suivi personnalisé pour chaque patient.",
    details: ["Dossier médical partagé", "Rappels de traitement", "Programmes de fidélité", "Notes cliniques"]
  },
  {
    icon: ShieldCheck,
    title: "Conformité & Sécurité",
    desc: "Hébergement sécurisé des données de santé et traçabilité complète de chaque action.",
    details: ["Chiffrement AES-256", "Sauvegardes horaires", "Logs d'audit", "Accès par rôles"]
  },
  {
    icon: Cloud,
    title: "Accès Cloud & Mobilité",
    desc: "Gérez votre pharmacie depuis n'importe où, sur PC, tablette ou smartphone.",
    details: ["Synchro temps réel", "App Mobile dédiée", "Multi-utilisateurs", "Zéro installation"]
  },
  {
    icon: Layers,
    title: "Rapports & Analyses IA",
    desc: "Tableaux de bord prédictifs pour anticiper vos besoins et optimiser votre rentabilité.",
    details: ["Prévisions de ventes", "Top 10 produits", "Marges nettes", "Exports Excel/PDF"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-0 bg-white">
      {/* Header */}
      <section className="px-6 mb-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
              Fonctionnalités
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              Tout ce dont vous avez besoin pour <span className="text-emerald-600">réussir</span>.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Une plateforme tout-en-un conçue spécifiquement pour les défis de la pharmacie moderne en Afrique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 transition-colors">
                  <f.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 mb-6 leading-relaxed">{f.desc}</p>
                <ul className="space-y-3">
                  {f.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
                Écosystème
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-tight">Connecté à votre <span className="text-emerald-600">monde.</span></h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                SyntixPharma s&apos;intègre parfaitement avec les outils que vous utilisez déjà, créant un flux de travail sans friction.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: "Mobile Money", desc: "M-Pesa, Airtel Money, Orange Money." },
                  { title: "Comptabilité", desc: "Export direct vers Sage, QuickBooks." },
                  { title: "Grossistes", desc: "Commandes automatiques via EDI." },
                  { title: "Assurances", desc: "Vérification des droits en temps réel." },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center p-6"
                  >
                    <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse"></div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black mb-4 border border-slate-100 uppercase tracking-[0.2em]">
              Déploiement
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-4 tracking-tight">Prêt en <span className="text-emerald-600">3 étapes.</span></h2>
            <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium">
              Une transition fluide vers la pharmacie du futur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0"></div>
            {[
              {
                step: "01",
                title: "Configuration",
                desc: "Importez vos stocks existants et configurez vos accès utilisateurs en quelques clics."
              },
              {
                step: "02",
                title: "Formation",
                desc: "Accédez à nos tutoriels interactifs ou demandez une session avec nos experts."
              },
              {
                step: "03",
                title: "Lancement",
                desc: "Commencez à vendre et à gérer votre officine avec une efficacité décuplée."
              }
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="text-6xl font-display font-bold text-emerald-100 mb-4 group-hover:text-emerald-600 transition-colors duration-500">
                  {item.step}
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 bg-slate-900 text-white px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold mb-2 leading-tight">
                Une interface <span className="text-emerald-400">intuitive</span>, aucune formation requise.
              </h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Nous avons passé des milliers d&apos;heures à observer le travail en officine pour créer l&apos;interface la plus fluide du marché. Vos employés seront opérationnels en moins de 30 minutes.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Mode sombre pour le travail de nuit",
                  "Raccourcis clavier pour les experts",
                  "Recherche universelle ultra-rapide",
                  "Support multilingue (Français, Anglais, Swahili)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-lg font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/register" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                Essayer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-slate-800 rounded-[2.5rem] border border-slate-700 p-4 shadow-2xl">
                <div className="bg-slate-900 rounded-[2rem] aspect-video flex items-center justify-center overflow-hidden">
                   <Image 
                    src="/images/tenant.jpg" 
                    alt="Dashboard Preview" 
                    fill
                    className="object-cover opacity-80"
                    referrerPolicy="no-referrer"
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
