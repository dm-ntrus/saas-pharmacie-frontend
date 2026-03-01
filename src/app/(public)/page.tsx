"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from "@/design-system";
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Globe, 
  MessageSquare,
  BarChart3,
  Package,
  Users,
  FileText,
  Star,
  Mail,
  Plus,
  ArrowUpRight,
  Smartphone,
  Check
} from 'lucide-react';
import {
  HeartIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import TrustedBy from "@/components/public/trusted-by"
import Testimonials from "@/components/public/testimonials"
import FAQ from "@/components/public/faq"

const PublicHomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);

  const features = [
    {
      icon: BuildingStorefrontIcon,
      title: "Gestion d'Inventaire Intelligente",
      description:
        "Suivez automatiquement vos stocks, alertes d'expiration et commandes fournisseurs avec IA prédictive",
      highlight: "IA Intégrée",
      color: "from-sky-500 to-sky-600",
    },
    {
      icon: ClipboardDocumentListIcon,
      title: "Gestion des Prescriptions",
      description:
        "Traitement numérique des ordonnances avec vérification d'interactions médicamenteuses en temps réel",
      highlight: "Sécurité Médicale",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: UserGroupIcon,
      title: "Dossiers Patients",
      description:
        "Base de données complète des patients avec historique médical et programme de fidélité personnalisé",
      highlight: "Fidélisation +40%",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Point de Vente Moderne",
      description:
        "Interface POS intuitive avec gestion des paiements multiples (Stripe, Mobile Money, Crypto)",
      highlight: "Multi-Paiements",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: ChartBarIcon,
      title: "Rapports & Analytics",
      description:
        "Tableaux de bord temps réel avec analyses prédictives, ML et rapports financiers avancés",
      highlight: "Analytics ML",
      color: "from-rose-500 to-rose-600",
    },
    // {
    //   icon: TruckIcon,
    //   title: "Livraison & Logistique",
    //   description:
    //     "Système de livraison intégré avec suivi GPS en temps réel et notifications clients automatisées",
    //   highlight: "Suivi GPS",
    //   color: "from-indigo-500 to-indigo-600",
    // },
    {
      icon: ShieldCheckIcon,
      title: "Conformité & Sécurité",
      description:
        "Respect total des réglementations pharmaceutiques avec sécurité de niveau bancaire et audit trail",
      highlight: "Conformité 100%",
      color: "from-green-500 to-green-600",
    },
    // {
    //   icon: HeartIcon,
    //   title: "Support Client 24/7",
    //   description:
    //     "Assistance technique dédiée multilingue et formation continue pour votre équipe",
    //   highlight: "Support Multilingue",
    //   color: "from-pink-500 to-pink-600",
    // },
  ];

  const pricingPlans = [
    {
      name: 'Simple',
      price: '29',
      desc: 'Pour les petites pharmacies de quartier.',
      features: ['1 Pharmacien', 'Inventaire de base', 'Ventes POS', 'Support Email', '14 jours d&apos;essai'],
      color: 'slate',
      cta: 'Démarrer'
    },
    {
      name: 'Standard',
      price: '99',
      desc: 'La solution complète pour pharmacies établies.',
      features: ['Illimité', 'IA Prédictive', 'Comptabilité', 'Multi-devises', 'Support 24/7', 'Mobile Money'],
      color: 'emerald',
      popular: true,
      cta: 'Choisir Standard'
    },
    {
      name: 'Grossiste',
      price: '199',
      desc: 'Pour les distributeurs et chaînes.',
      features: ['Multi-sites', 'Gestion Entrepôt', 'API Accès', 'Manager Dédié', 'Formation sur site', 'SLA Garanti'],
      color: 'slate',
      cta: 'Contacter Ventes'
    }
  ];

  const testimonials = [
    {
      name: "Dr. Marie Kabange",
      role: "Pharmacienne, Kinshasa",
      content:
        "PharmacySaaS a révolutionné notre gestion quotidienne. Nos ventes ont augmenté de 40% en 3 mois et nos erreurs de stock ont diminué de 90%.",
      avatar: "/images/testimonials/marie.jpg",
      rating: 5,
      metrics: "+40% ventes, -90% erreurs",
    },
    {
      name: "Jean-Baptiste Mukendi",
      role: "Gérant Pharmacie, Lubumbashi",
      content:
        "La gestion des stocks automatisée nous fait économiser 10 heures par semaine. Un investissement qui s'est amorti en 2 mois !",
      avatar: "/images/testimonials/jean.jpg",
      rating: 5,
      metrics: "10h économisées/semaine",
    },
    {
      name: "Dr. Agnès Ngoy",
      role: "Pharmacienne, Goma",
      content:
        "L'interface est intuitive et le support client exceptionnel. Mes patients sont plus satisfaits grâce au service rapide.",
      avatar: "/images/testimonials/agnes.jpg",
      rating: 5,
      metrics: "95% satisfaction client",
    },
  ];

  const stats = [
    {
      value: 500,
      suffix: "+",
      label: "Pharmacies Actives",
      icon: BuildingStorefrontIcon,
    },
    {
      value: 50,
      suffix: "M+",
      label: "Transactions Traitées",
      icon: CurrencyDollarIcon,
    },
    {
      value: 99.9,
      suffix: "%",
      label: "Temps de Disponibilité",
      icon: ShieldCheckIcon,
    },
    { value: 24, suffix: "/7", label: "Support Client", icon: HeartIcon },
  ];

  // Animation des statistiques
  useEffect(() => {
    const timer = setTimeout(() => {
      stats.forEach((stat, index) => {
        const targetValue =
          typeof stat.value === "number"
            ? stat.value
            : parseInt(stat.value.toString());
        let currentValue = 0;
        const increment = targetValue / 50;

        const interval = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(interval);
          }
          setAnimatedStats((prev) => {
            const newStats = [...prev];
            newStats[index] = Math.floor(currentValue);
            return newStats;
          });
        }, 30);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Rotation automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const partners = [
    "Pharmacie Plus",
    "MediCare",
    "PharmaSanté",
    "Wellness Pharma",
    "HealthFirst",
    "VitalCare",
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Ultra Editorial / Split Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Left Side - Content */}
        <div className="flex-1 relative z-20 pt-32 pb-4 px-8 lg:px-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-full text-[8px] font-black mb-4 uppercase tracking-[0.4em] shadow-2xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Intégration IA pour l'optimisation des stocks
            </div>
            
            <h1 className="text-6xl lg:text-[90px] font-display font-bold text-slate-900 leading-[0.82] mb-4 tracking-[-0.06em]">
              Votre pharmacie, plus rentable <br />
              <span className="text-emerald-600 italic">avec la Gestion Intelligente.</span>
            </h1>
            
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-2">
              <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-medium max-w-md">
              Automatisation complète, optimisation des ventes et conformité garantie.
              </p>
              
            </div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <Link 
                  href="/auth/register" 
                  className="px-6 py-4 bg-emerald-600 text-white rounded-[2rem] font-bold text-xl hover:bg-slate-900 transition-all shadow-2xl shadow-emerald-600/20 flex items-center gap-4 group"
                >
                  Démarrer l&apos;aventure
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  href="/features" 
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-emerald-600 transition-colors ml-4"
                >
                  Découvrir nos solutions →
                </Link>
              </div>

            {/* Micro Stats */}
            <div className="mt-6 grid grid-cols-3 gap-12 border-t border-slate-100 pt-4">
              <div>
                <p className="text-4xl font-display font-bold text-slate-900 mb-1">500+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pharmacies</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-slate-900 mb-1">1M+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-slate-900 mb-1">24/7</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Visual / Immersive */}
        <div className="hidden lg:block flex-1 h-screen relative bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-slate-900/95 z-10"></div>
          <Image 
            src="/images/hero.png" 
            alt="SyntixPharma Visual" 
            fill
            className="object-cover opacity-50 grayscale"
            referrerPolicy="no-referrer"
          />
          
          {/* Skewed Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10, x: 100 }}
            animate={{ opacity: 1, scale: 1, rotate: -5, x: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-2/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-video bg-white rounded-[3rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden z-20"
          >
            <div className="absolute top-0 left-0 w-full h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="pt-12 p-12 h-full bg-slate-50/50">
              <div className="grid grid-cols-12 gap-8 h-full">
                <div className="col-span-3 space-y-6">
                  <div className="h-40 bg-white rounded-3xl shadow-sm border border-slate-100"></div>
                  <div className="h-full bg-white rounded-3xl shadow-sm border border-slate-100"></div>
                </div>
                <div className="col-span-9 space-y-6">
                  <div className="h-24 bg-white rounded-3xl shadow-sm border border-slate-100"></div>
                  <div className="h-full bg-white rounded-3xl shadow-sm border border-slate-100"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badges */}
          {/* <div className="absolute bottom-20 right-20 z-30 flex gap-6">
            <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold text-sm">
              Sécurisé SSL
            </div>
            <div className="px-8 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-bold text-sm shadow-2xl shadow-emerald-500/20">
              Certifié ISO
            </div>
          </div> */}
        </div>
      </section>
      
      {/* Trusted By Section  */}
      <TrustedBy/>

      {/* Features Grid  */}
      <section id="features" className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black mb-6 border border-slate-100 uppercase tracking-[0.2em]">
                Capacités
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[0.85]">
              Tout ce dont votre pharmacie a besoin <br />
                <span className="text-emerald-600 italic">pour maximiser sa rentabilité.</span>
              </h2>
            </div>
            <p className="text-xl text-slate-500 max-w-md font-medium leading-relaxed">
            Une plateforme complète conçue spécialement pour les pharmacies africaines modernes, avec intelligence artificielle intégrée pour l'optimisation des performances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-100">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-12 border-r border-b border-slate-100 hover:bg-slate-50 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-display font-bold text-slate-100 group-hover:text-emerald-100 transition-colors">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Fonctionnalité</h3>
                <h4 className="text-3xl font-display font-bold text-slate-900 mb-6 italic">{feature.title}</h4>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
                <Link href="/auth"  className="mt-10 flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid  */}
      <section id="features" className="py-0 bg-white">
          <div className="max-w-7xl mx-auto px-4">

            <div className="grid md:grid-cols-12 gap-6">
              {/* Bento Item 1 */}
              <div className="md:col-span-8 bg-slate-50 rounded-[3rem] p-12 relative overflow-hidden group">
                <div className="relative z-10 max-w-md">
                  {/* <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8">
                    <Zap className="w-7 h-7" />
                  </div> */}
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">Point de Vente Ultra-Rapide</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Une interface intuitive conçue pour la rapidité. Gérez les files d&apos;attente sans effort et encaissez via mobile money en un clic.
                  </p>
                  <ul className="space-y-3">
                    {['Scan code-barres instantané', 'Multi-paiement intégré', 'Tickets numériques'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute top-12 -right-20 w-1/2 h-full bg-slate-200 rounded-[2rem] rotate-12 group-hover:rotate-6 transition-transform duration-700 hidden lg:block overflow-hidden">
                  <Image 
                    src="/images/tenant.jpg" 
                    className="object-cover opacity-50" 
                    alt="POS" 
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bento Item 2 */}
              <div className="md:col-span-4 bg-emerald-600 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-display">Analyses IA</h3>
                  <p className="text-emerald-50 text-lg leading-relaxed">
                    Prédisez vos besoins en stock et identifiez vos produits les plus rentables grâce à nos algorithmes avancés.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* Bento Item 3 */}
              <div className="md:col-span-4 bg-slate-900 rounded-[3rem] p-12 text-white group">
                <div className="w-14 h-14 bg-slate-600 rounded-2xl flex items-center justify-center mb-8">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display">Conformité Totale</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Rapports fiscaux automatisés et traçabilité complète des médicaments sensibles.
                </p>
              </div>

              {/* Bento Item 4 */}
              <div className="md:col-span-8 bg-slate-100 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 group">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-slate-600 text-white rounded-2xl flex items-center justify-center mb-4">
                    <Users className="text-white w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2 font-display">Gestion Patients</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Suivez l&apos;historique médical, gérez les prescriptions récurrentes et envoyez des rappels automatiques par SMS.
                  </p>
                </div>
                <div className="flex-1 w-full h-full bg-white rounded-[2rem] p-4 shadow-xl">
                  <div className="w-full h-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center">
                    <Users className="w-20 h-20 text-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      {/* Pricing Section */}
      <section
        className="pt-16 px-6 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-4 border border-emerald-100 uppercase tracking-[0.2em]">
              Innovation
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-slate-900 mb-8 tracking-tight">
            Choisissez <span className="text-emerald-600">le plan</span> qui correspond à la taille de votre pharmacie.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 mb-24">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-12 rounded-[3rem] border ${
                plan.popular 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-2xl shadow-emerald-600/20' 
                  : 'bg-slate-50 border-slate-100 text-slate-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Recommandé
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-display font-bold">${plan.price}</span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/ mois</span>
                </div>
                <p className={`mt-6 text-lg leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/auth/register"
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  plan.popular 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20' 
                    : 'bg-slate-900 text-white hover:bg-emerald-600'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[6rem] p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[120px]"></div>
            <div className="grid lg:grid-cols-3 gap-16 items-center relative z-10">
              <div className="lg:col-span-2">
                <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">
                Prêt à <br />
                  <span className="text-emerald-500">Moderniser</span> <br />Votre Pharmacie?
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                Rejoignez plus de 500 pharmacies qui font confiance à PharmacySaaS pour optimiser leurs opérations quotidiennes.
                </p>
              </div>
              <div className="space-y-6">
              <div className="flex flex-col gap-6 justify-center">
              <Link href="/auth/register" className="px-10 py-5 text-center bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 hover:scale-105">
                Essayer Gratuitement
              </Link>
              <Link href="/contact" className="px-10 py-5 text-center bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:scale-105">
                Contacter l&apos;équipe
              </Link>
            </div>
                <p className="text-xs text-slate-500 font-medium">
                Installation en 24h - Formation incluse - Support 7j/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <FAQ />

      {/* Newsletter Section - Recipe 11 Inspired */}
      {/* <section className="py-16 bg-emerald-600 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-slate-900 font-display mb-4 leading-tight">Restez à la pointe de <span className="text-emerald-600 italic">l&apos;innovation</span>.</h2>
                <p className="text-slate-500 text-lg">Recevez nos conseils experts et les dernières mises à jour de SyntixPharma directement dans votre boîte mail.</p>
              </div>
              <div className="flex-1 w-full">
                <form className="flex flex-col gap-4">
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="votre@email.com"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                    S&apos;abonner à la newsletter
                  </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-4">Nous respectons votre vie privée. Désabonnez-vous à tout moment.</p>
              </div>
            </div>
          </div>
        </section> */}
    </div>
  );
};

export default PublicHomePage;
