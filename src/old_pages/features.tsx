import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BeakerIcon,
  ShieldCheckIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  DocumentTextIcon,
  CheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import { Button } from "@/design-system";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  featured?: boolean;
  category: string;
  benefits: string[];
  specifications?: string[];
}

const FeaturesPage: NextPage = () => {
  const features: Feature[] = [
    {
      id: "pos",
      name: "Point de Vente Intégré",
      description:
        "Système de caisse moderne avec gestion complète des transactions",
      icon: CurrencyDollarIcon,
      category: "Opérations",
      featured: true,
      benefits: [
        "Interface tactile intuitive",
        "Support multi-devises (USD, CDF, EUR)",
        "Paiements Mobile Money intégrés",
        "Reçus électroniques automatiques",
        "Gestion des remises et promotions",
      ],
      specifications: [
        "Temps de réponse < 2 secondes",
        "Support hors ligne",
        "Impression thermique",
        "Scanner code-barres",
      ],
    },
    {
      id: "inventory",
      name: "Gestion Intelligente des Stocks",
      description: "Suivi automatisé avec alertes prédictives et optimisation",
      icon: CubeIcon,
      category: "Inventaire",
      featured: true,
      benefits: [
        "Suivi temps réel par lot et DCI",
        "Alertes automatiques de rupture",
        "Gestion des dates d'expiration",
        "Optimisation des commandes",
        "Traçabilité pharmaceutique complète",
      ],
      specifications: [
        "Synchronisation en temps réel",
        "API fournisseurs intégrée",
        "Historique complet",
        "Rapports automatisés",
      ],
    },
    {
      id: "prescriptions",
      name: "Validation des Prescriptions",
      description:
        "Traitement sécurisé avec contrôle des interactions médicamenteuses",
      icon: ClipboardDocumentListIcon,
      category: "Santé",
      benefits: [
        "Validation pharmaceutique automatique",
        "Détection d'interactions médicamenteuses",
        "Historique patient sécurisé",
        "Alerte allergies et contre-indications",
        "Conformité réglementaire DRC/Burundi",
      ],
    },
    {
      id: "analytics",
      name: "Analyses Avancées & BI",
      description:
        "Intelligence économique avec tableaux de bord personnalisés",
      icon: ChartBarIcon,
      category: "Analytics",
      benefits: [
        "KPI temps réel multi-niveaux",
        "Prévisions de ventes IA",
        "Analyse de rentabilité par produit",
        "Segmentation clientèle avancée",
        "Benchmarking concurrentiel",
      ],
    },
    {
      id: "quality",
      name: "Contrôle Qualité Pharmaceutique",
      description: "Conformité réglementaire et audits automatisés",
      icon: ShieldCheckIcon,
      category: "Conformité",
      benefits: [
        "Audits automatisés quotidiens",
        "Traçabilité produits complète",
        "Conformité WHO/EMA standards",
        "Gestion des rappels produits",
        "Certification qualité digitale",
      ],
    },
    {
      id: "communication",
      name: "Communication Client Multi-Canal",
      description: "Campagnes SMS/Email avec personnalisation avancée",
      icon: ChatBubbleLeftRightIcon,
      category: "Marketing",
      benefits: [
        "Campagnes marketing automatisées",
        "SMS/Email personnalisés",
        "Rappels médicaments patients",
        "Programme fidélité intégré",
        "Support Mobile Money notifications",
      ],
    },
    {
      id: "ecommerce",
      name: "E-commerce Pharmaceutique",
      description: "Boutique en ligne avec livraison et téléconsultation",
      icon: BuildingStorefrontIcon,
      category: "Digital",
      benefits: [
        "Site web responsive automatique",
        "Commandes en ligne sécurisées",
        "Livraison géolocalisée",
        "Paiement Mobile Money",
        "Intégration télémédecine",
      ],
    },
    {
      id: "telemedicine",
      name: "Télémédecine Intégrée",
      description: "Consultations à distance avec prescriptions digitales",
      icon: HeartIcon,
      category: "Santé Digital",
      benefits: [
        "Consultations vidéo HD",
        "Dossiers patients électroniques",
        "Prescriptions digitales sécurisées",
        "Suivi thérapeutique à distance",
        "Intégration assurance maladie",
      ],
    },
  ];

  const categories = Array.from(new Set(features.map((f) => f.category)));
  const featuredFeatures = features.filter((f) => f?.featured);

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >
      <div className="bg-white pt-10">
        {/*  Hero Section with animated background */}
        <section className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 overflow-hidden">
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

          <div className="relative text-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 bg-sky-700/50 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                    Plus de 500 pharmacies nous font confiance
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Fonctionnalités{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-cyan-200">
                      Révolutionnaires
                    </span>
                  </h1>
                  <p className="text-xl text-sky-200 mb-8 leading-relaxed">
                    Une suite complète d'outils pharmaceutiques conçus pour
                    optimiser vos opérations, respecter les réglementations
                    africaines et maximiser votre rentabilité.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg">
                      <Link
                        href="/demo"
                        className="inline-flex items-center justify-center"
                      >
                        Voir la Démo Interactive
                        <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg">
                    <Link
                      href="/contact"
                      // className="border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-sky-900 transition-all duration-300 backdrop-blur-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
                    >
                      Nous Contacter
                    </Link>
                    </Button>
                  </div>
                </div>

                {/* Feature highlights preview */}
                <div className="grid grid-cols-2 gap-4">
                  {featuredFeatures.slice(0, 4).map((feature, index) => (
                    <div
                      key={feature.id}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <feature.icon className="h-8 w-8 text-sky-200 mb-3" />
                      <h3 className="font-semibold text-white mb-2 text-sm">
                        {feature.name}
                      </h3>
                      <p className="text-sky-200 text-xs leading-relaxed">
                        {feature.description.substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-sky-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Fonctionnalités Phares
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez nos solutions les plus populaires qui transforment la
                gestion pharmaceutique
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-600 to-cyan-600 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-sky-100/50"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-sky-100 to-cyan-100 p-4 rounded-2xl group-hover:from-sky-200 group-hover:to-cyan-200 transition-all duration-300">
                        <feature.icon
                          className="h-10 w-10 text-sky-600 group-hover:scale-110 transition-transform duration-300"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-2xl font-bold text-gray-900 mr-3">
                          {feature.name}
                        </h3>
                        {/* <div className="bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          POPULAIRE
                        </div> */}
                      </div>
                      <p className="text-gray-600 leading-5">
                        {feature.description}
                      </p>
                      
                    </div>
                  </div>
                    <div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {feature.benefits.slice(0, 4).map((benefit, idx) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-2 group/benefit"
                          >
                            <CheckIcon
                              className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0 group-hover/benefit:scale-110 transition-transform"
                              aria-hidden="true"
                            />
                            <span className="text-gray-700 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>

                      {feature.specifications && (
                        <div className="bg-gradient-to-r from-sky-50 to-cyan-50 p-4 rounded-xl border border-sky-100">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <BeakerIcon className="h-4 w-4 mr-2 text-sky-600" />
                            Spécifications Techniques
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {feature.specifications.map((spec, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2"
                              >
                                <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                  {spec}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Features by Category - Masonry Style */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Suite Complète de Fonctionnalités
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explorez toutes nos fonctionnalités organisées par domaine
                d'expertise
              </p>
            </div>

            {categories.map((category, categoryIndex) => {
              const categoryFeatures = features.filter(
                (f) => f.category === category && !f.featured
              );

              if (categoryFeatures.length === 0) return null;

              return (
                <div key={category} className="mb-20">
                  <div className="flex items-center mb-12">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                    <div className="px-6">
                      <h3 className="text-xl font-bold text-sky-900 bg-white px-4 py-2 rounded-full border-2 border-sky-200">
                        {category}
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center  gap-8">
                    {categoryFeatures.map((feature, index) => (
                      <div
                        key={feature.id}
                        className="group bg-gradient-to-br from-white to-sky-50/50 rounded-2xl p-6 border border-sky-100 hover:border-sky-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <feature.icon
                              className="h-6 w-6 text-sky-600 group-hover:scale-110 transition-transform"
                              aria-hidden="true"
                            />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 ml-3">
                            {feature.name}
                          </h4>
                        </div>

                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {feature.description}
                        </p>

                        <div className="space-y-2">
                          {feature.benefits.map((benefit, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <CheckIcon
                                className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-gray-600">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/*  Africa-specific advantages */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-sky-50/30 to-cyan-50">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-green-600/20"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              {/* <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium mb-4">
                🌍 Conçu pour l'Afrique
              </div> */}
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Conçu pour l'Afrique
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre plateforme intègre parfaitement les spécificités du marché pharmaceutique africain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Mobile Money Intégré",
                  description:
                    "Support natif d'AirtelMoney, OrangeMoney, M-Pesa, EcoCash et LumiCash",
                  icon: "📱",
                  color: "from-blue-100 to-sky-100",
                },
                {
                  title: "Multi-Devises",
                  description:
                    "Gestion simultanée USD, CDF, BIF, EUR avec taux de change temps réel",
                  icon: "💱",
                  color: "from-green-100 to-emerald-100",
                },
                {
                  title: "Conformité Réglementaire",
                  description:
                    "Respect des normes DRC, Burundi, EAC et standards internationaux WHO/EMA",
                  icon: "⚖️",
                  color: "from-purple-100 to-indigo-100",
                },
                {
                  title: "Langues Locales",
                  description:
                    "Interface en Français, Anglais, Lingala et Swahili",
                  icon: "🗣️",
                  color: "from-yellow-100 to-orange-100",
                },
                {
                  title: "Mode Hors Ligne",
                  description:
                    "Fonctionnement complet même sans connexion internet",
                  icon: "📶",
                  color: "from-red-100 to-pink-100",
                },
                {
                  title: "Support Local",
                  description: "Équipe support basée à Kinshasa et Bujumbura",
                  icon: "🌍",
                  color: "from-cyan-100 to-teal-100",
                },
              ].map((advantage, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${advantage.color} mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-3xl">{advantage.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-sky-900 transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {advantage.description}
                  </p>
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
                Révolutionner
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

export default FeaturesPage;
