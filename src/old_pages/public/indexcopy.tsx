"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Button } from "@/design-system";
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

const PublicHomePage: React.FC = () => {
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
    {
      icon: TruckIcon,
      title: "Livraison & Logistique",
      description:
        "Système de livraison intégré avec suivi GPS en temps réel et notifications clients automatisées",
      highlight: "Suivi GPS",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Conformité & Sécurité",
      description:
        "Respect total des réglementations pharmaceutiques avec sécurité de niveau bancaire et audit trail",
      highlight: "Conformité 100%",
      color: "from-green-500 to-green-600",
    },
    {
      icon: HeartIcon,
      title: "Support Client 24/7",
      description:
        "Assistance technique dédiée multilingue et formation continue pour votre équipe",
      highlight: "Support Multilingue",
      color: "from-pink-500 to-pink-600",
    },
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
    "Pharmacie Plus", "MediCare", "PharmaSanté", "Wellness Pharma", "HealthFirst", "VitalCare"
  ];

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >
      <div className="bg-white">
        {/* Hero Section  */}
        <section className="pt-20 bg-gradient-to-br from-sky-50 via-sky-50 to-white relative overflow-hidden">
          {/* Background decorative elements  */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-sky-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-purple-200/20 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-green-200/10 rounded-full animate-bounce delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-sky-100 to-sky-100 text-sky-900 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105">
                <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
                Nouveau: Intégration IA pour l'optimisation des stocks
                <ArrowRightIcon className="w-4 h-4 ml-2 animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                <span className="inline-block animate-fade-in-up">
                  Boostez la Rentabilité de
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-600 block animate-gradient-x">
                  Votre Pharmacie
                </span>
                <span className="text-gray-900 inline-block animate-fade-in-up delay-300">
                  avec la Gestion Intelligente
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed font-light animate-fade-in-up delay-500">
                Automatisation complète, optimisation des ventes et conformité
                garantie. Jusqu'à{" "}
                <span className="font-extralight text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                  45% d'augmentation des marges
                </span>{" "}
                avec notre plateforme SaaS tout-en-un.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up delay-700">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-700 hover:to-sky-700"
                  >
                    Demander une démo gratuite
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group w-full sm:w-auto px-8 py-4 text-lg font-medium border-2 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-50 transition-all duration-300"
                  >
                    Voir nos plans tarifaires
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600 mx-auto animate-fade-in-up delay-1000">
                <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 animate-pulse" />
                  <span className="font-medium text-nowrap">
                    Essai Gratuit de 14 Jours
                  </span>
                </div>
                <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 animate-pulse delay-100" />
                  <span className="font-medium text-nowrap">
                    Aucune Carte de Crédit Requise
                  </span>
                </div>
                <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 animate-pulse delay-200" />
                  <span className="font-medium text-nowrap">
                    Configuration en 5 Minutes
                  </span>
                </div>
                <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 animate-pulse delay-300" />
                  <span className="font-medium text-nowrap">Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Hero Dashboard Mockup  */}
            <div className="mt-16 relative animate-fade-in-up delay-1200">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto border border-white/20 hover:shadow-3xl transition-all duration-500">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-200/30 to-sky-200/20 rounded-full translate-x-16 -translate-y-16"></div>
                  <div className="flex items-center mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="text-center flex-1">
                      <span className="text-gray-700 font-bold text-lg bg-gradient-to-r from-sky-600 to-sky-600 bg-clip-text text-transparent">
                        NakiCode PharmacySaaS - Tableau de Bord
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <GlobeAltIcon className="w-4 h-4 text-green-500 animate-spin" /> */}
                      {/* <span className="text-xs text-green-600 font-medium">
                        En Ligne
                      </span> */}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 space-y-6 shadow-inner">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 animate-pulse"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 bg-gradient-to-r from-sky-200 to-sky-200 rounded-full w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-sky-50 to-green-50 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-3 bg-gradient-to-r from-sky-200 to-green-300 rounded w-20"></div>
                          <CurrencyDollarIcon className="w-5 h-5 text-sky-600 animate-pulse" />
                        </div>
                        <div className="h-8 bg-gradient-to-r from-sky-400 to-green-500 rounded-lg w-20 animate-pulse shadow-sm"></div>
                        <div className="text-xs text-sky-600 mt-2 flex items-center">
                          <ArrowRightIcon className="w-3 h-3 mr-1 rotate-[-45deg]" />
                          +25% ce mois
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-sky-50 to-sky-50 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-3 bg-gradient-to-r from-sky-200 to-sky-300 rounded w-20"></div>
                          <ChartBarIcon className="w-5 h-5 text-sky-600 animate-pulse" />
                        </div>
                        <div className="h-8 bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg w-20 animate-pulse shadow-sm"></div>
                        <div className="text-xs text-sky-600 mt-2 flex items-center">
                          <ChartBarIcon className="w-3 h-3 mr-1" />
                          Analytics
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-3 bg-gradient-to-r from-amber-200 to-orange-300 rounded w-20"></div>
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                        </div>
                        <div className="h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg w-20 animate-pulse shadow-sm"></div>
                        <div className="text-xs text-amber-600 mt-2 flex items-center">
                          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />3
                          Alertes Stock
                        </div>
                      </div>
                    </div>
                    {/* <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <BoltIcon className="w-4 h-4 mr-1 text-sky-500" />
                          Optimisation IA en Temps Réel
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                          <span className="text-xs text-green-600 font-semibold">
                            ACTIF
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-500 h-3 rounded-full animate-pulse shadow-inner"
                          style={{ width: "87%" }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 flex justify-between">
                        <span>Performance: 87%</span>
                        <span className="font-semibold text-green-600">
                          +12% aujourd'hui
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section Animée */}
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group hover:scale-110 transition-all duration-500 cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl px-6 py-4 shadow-soft hover:shadow-soft-lg border border-gray-100 hover:border-sky-200">
                    {/* <stat.icon className="w-8 h-8 text-sky-500 mx-auto mb-3 group-hover:animate-bounce" /> */}
                    <div className="text-2xl md:text-3xl font-bold text-sky-600 mb-2">
                      {animatedStats[index]}
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section  */}
        <section
          id="features"
          className="py-20 bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-sky-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                {/* <BoltIcon className="w-4 h-4 text-green-600 mr-2 animate-pulse" /> */}
                Solutions Orientées Bénéfices Commerciaux
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Tout ce dont votre pharmacie a besoin
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-600 to-sky-600 animate-gradient-x">
                  pour maximiser sa rentabilité
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Une plateforme complète conçue spécialement pour les pharmacies
                africaines modernes, avec intelligence artificielle intégrée
                pour l'optimisation des performances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-sky-200 overflow-hidden"
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div
                    className={`h-12 w-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sky-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      En savoir plus
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:animate-pulse" />
                    </div>
                    <div className="w-8 h-1 bg-gradient-to-r from-sky-200 to-sky-300 rounded-full group-hover:from-sky-400 group-hover:to-sky-500 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section IA Avancée */}
            <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 rounded-4xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div> */}
              {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 animate-pulse"></div>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/10 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              ></div>
            ))}
          </div>

              <div className="text-center mb-8 relative">
                {/* <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Powered by GPT-4 & Machine Learning
                </div> */}
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Boostez vos résultats avec l'Intelligence Artificielle
                </h3>
                <p className="text-sky-100 text-lg max-w-3xl mx-auto">
                  Notre IA révolutionne la gestion pharmaceutique avec des
                  prédictions ultra-précises et des optimisations automatiques
                  qui transforment votre business
                </p>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="h-8 w-8 text-white group-hover:animate-pulse" />
                  </div>
                  <h4 className="font-bold mb-3 text-lg">
                    Prédiction de la Demande
                  </h4>
                  <p className="text-sky-100 text-sm leading-relaxed">
                    Évitez les ruptures et optimisez vos commandes avec des
                    prévisions IA précises
                  </p>
                </div>

                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-white group-hover:animate-pulse" />
                  </div>
                  <h4 className="font-bold mb-3 text-lg">
                    Optimisation des Prix
                  </h4>
                  <p className="text-sky-100 text-sm leading-relaxed">
                    Maximisez vos marges avec des stratégies de prix dynamiques
                    et intelligentes
                  </p>
                </div>
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-8 w-8 text-white group-hover:animate-pulse" />
                  </div>
                  <h4 className="font-bold mb-3 text-lg">
                    Fidélisation Client
                  </h4>
                  <p className="text-sky-100 text-sm leading-relaxed">
                    Personnalisez les promotions et améliorez l'expérience
                    client avec l'IA
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              {/* <div className="inline-flex items-center bg-gradient-to-r from-sky-100 to-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft">
                <HeartIcon className="w-4 h-4 text-sky-600 mr-2 animate-pulse" />
                Témoignages Clients
              </div> */}
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Ce que disent nos clients
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-600 animate-gradient-x">
                  qui nous font confiance
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment NakiCode PharmacySaaS transforme la gestion
                des pharmacies en République Démocratique du Congo et au Burundi
              </p>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="bg-white max-w-4xl mx-auto rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/30 to-sky-100/20 rounded-full translate-x-16 -translate-y-16"></div>

                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-6 h-6 text-amber-400 fill-current animate-pulse"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-6">
                      "{testimonials[activeTestimonial].content}"
                    </blockquote>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {testimonials[activeTestimonial].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonials[activeTestimonial].role}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? "bg-sky-500 scale-125"
                            : "bg-gray-300 hover:bg-sky-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Autres témoignages en aperçu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-2xs hover:shadow-soft-lg transition-all duration-300 border border-gray-100 hover:border-sky-200 cursor-pointer group hover:scale-105"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-gray-900 text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                      {testimonial.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Call to action to see more testimonials */}
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-3xl p-8 border border-sky-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Voir plus de témoignages en vidéo
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Découvrez les retours d'expérience complets de nos clients
                    partenaires.
                  </p>
                  <Button className="rounded-full  flex items-center gap-2 mx-auto">
                    Voir les vidéos témoignages
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-20 bg-gradient-to-b from-gray-50 to-sky-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                {/* Investissez dans l'Excellence */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-600 animate-gradient-x">
                  Tarifs Transparents pour Tous
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez le plan qui correspond à la taille de votre
                pharmacie.
              </p>
            </div>

            {/* Grille des plans tarifaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Plan Simple */}
              <div className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-sky-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                      Simple
                    </h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-4xl font-bold text-gray-900">
                        $29
                      </span>
                      <span className="text-lg text-gray-600 ml-1">/mois</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-sky-50 py-1 px-3 rounded-full inline-block">
                      Pour petites pharmacies
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Jusqu'à 3 utilisateurs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">1000 produits max</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Gestion de base</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Support email</span>
                    </li>
                  </ul>
                  <Link href="/register?plan=simple">
                    <Button variant="secondary" className="w-full">
                      Choisir Simple
                      {/* <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> */}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Plan Moyenne - POPULAIRE */}
              <div className="group bg-sky-50 rounded-2xl hover:rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-sky-500 relative transform scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-sky-600 to-sky-600 text-white px-4 py-1 text-xs font-bold rounded-full shadow-lg">
                    POPULAIRE
                  </span>
                </div>
                {/* <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                      Moyenne
                    </h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-4xl font-bold text-gray-900">
                        $59
                      </span>
                      <span className="text-lg text-gray-600 ml-1">/mois</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-sky-100 py-1 px-3 rounded-full inline-block">
                      Pour pharmacies moyennes
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Jusqu'à 10 utilisateurs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">5000 produits max</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Analytics avancés</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Support prioritaire</span>
                    </li>
                  </ul>
                  <Link href="/register?plan=moyenne">
                    <Button className="w-full">
                      Choisir Moyenne
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Plan Standard */}
              <div className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-sky-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                      Standard
                    </h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-4xl font-bold text-gray-900">
                        $99
                      </span>
                      <span className="text-lg text-gray-600 ml-1">/mois</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-sky-50 py-1 px-3 rounded-full inline-block">
                      Pour grandes pharmacies
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Jusqu'à 25 utilisateurs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">15000 produits max</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">
                        Toutes les fonctionnalités
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Support téléphonique</span>
                    </li>
                  </ul>
                  <Link href="/register?plan=standard">
                    <Button variant="secondary" className="w-full ">
                      Choisir Standard
                      {/* <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> */}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Plan Grossiste */}
              <div className="group bg-gradient-to-br from-sky-900 to-cyan-800 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-800 to-cyan-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                      Grossiste
                    </h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-4xl font-bold">$199</span>
                      <span className="text-lg text-gray-300 ml-1">/mois</span>
                    </div>
                    <p className="text-sm text-gray-50 bg-cyan-700 py-1 px-3 rounded-full inline-block">
                      Pour réseaux et grossistes
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Utilisateurs illimités</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Produits illimités</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Multi-localisations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Support dédié</span>
                    </li>
                  </ul>
                  <Link href="/register?plan=grossiste">
                    <Button
                      variant="secondary"
                      className="w-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                    >
                      Choisir Grossiste
                      {/* <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> */}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Garantie de satisfaction */}
            {/* <div className="text-center mt-16 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100">
              <div className="inline-flex items-center bg-white text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft">
                <ShieldCheckIcon className="w-4 h-4 mr-2 text-sky-500" />
                Garantie de Satisfaction 30 Jours
              </div>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Essayez PharmacySaaS sans risque. Si vous n'êtes pas satisfait
                dans les 30 premiers jours, nous vous remboursons intégralement.
              </p>
            </div> */}
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 bg-sky-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                La confiance de plus de 500 pharmacies
              </h2>
              <p className="text-gray-600">
                Rejoignez les pharmacies leaders qui utilisent déjà NakiCode
                PharmacySaaS
              </p>
            </div>

            {/* Partner Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div
                  key={index}
                  className="h-12 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span className="text-gray-500 font-medium">
                    Pharmacie {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br bg-gradi from-sky-900 via-sky-800 to-cyan-800 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight text-nowrap">
              Prêt à{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-300">
                Moderniser
              </span>{" "}
              Votre Pharmacie ?
            </h2>

            <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Rejoignez plus de 500 pharmacies qui font confiance à PharmacySaaS
              pour optimiser leurs opérations quotidiennes.
            </p>

            {/* Benefits list */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              {["Installation en 24h", "Formation incluse", "Support 7j/7"].map(
                (benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center text-sky-100"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-3 text-emerald-300" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group shadow-2xl hover:shadow-3xl"
                >
                  Essai gratuit 30 jours
                </Button>
              </Link>
              <Link href="mailto:contact@nakicode.com">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto group"
                >
                  Parler à un expert
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PublicHomePage;
