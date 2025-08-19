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
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
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

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >
      <div className="bg-white pt-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fonctionnalités{" "}
              <span className="text-sky-300">Révolutionnaires</span>
            </h1>
            <p className="text-xl text-sky-200 mb-8 max-w-3xl mx-auto">
              Une suite complète d'outils pharmaceutiques conçus pour optimiser
              vos opérations, respecter les réglementations africaines et
              maximiser votre rentabilité.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/demo"
                className="bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Voir la Démo
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sky-900 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </section>

        {/* Features par Catégorie */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {categories.map((category) => {
              const categoryFeatures = features.filter(
                (f) => f.category === category
              );

              return (
                <div key={category} className="mb-20">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {category}
                    </h2>
                    <div className="w-24 h-1 bg-sky-600 mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {categoryFeatures.map((feature, index) => (
                      <div
                        key={feature.id}
                        className={`flex items-start space-x-6 ${
                          index % 2 === 1
                            ? "lg:flex-row-reverse lg:space-x-reverse lg:space-x-6"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="bg-sky-100 p-4 rounded-xl">
                            <feature.icon
                              className="h-8 w-8 text-sky-600"
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            {feature.name}
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {feature.description}
                          </p>

                          <div className="space-y-3 mb-6">
                            {feature.benefits.map((benefit, idx) => (
                              <div
                                key={idx}
                                className="flex items-start space-x-3"
                              >
                                <CheckIcon
                                  className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>

                          {feature.specifications && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Spécifications Techniques
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {feature.specifications.map((spec, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center space-x-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Avantages Spécifiques Afrique */}
        <section className="bg-green-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Conçu pour l'Afrique
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre plateforme intègre les spécificités du marché
                pharmaceutique africain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Mobile Money Intégré",
                  description:
                    "Support natif d'AirtelMoney, OrangeMoney, M-Pesa, EcoCash et LumiCash",
                  icon: "📱",
                },
                {
                  title: "Multi-Devises",
                  description:
                    "Gestion simultanée USD, CDF, BIF, EUR avec taux de change temps réel",
                  icon: "💱",
                },
                {
                  title: "Conformité Réglementaire",
                  description:
                    "Respect des normes DRC, Burundi, EAC et standards internationaux WHO/EMA",
                  icon: "⚖️",
                },
                {
                  title: "Langues Locales",
                  description:
                    "Interface en Français, Anglais, Lingala et Swahili",
                  icon: "🗣️",
                },
                {
                  title: "Mode Hors Ligne",
                  description:
                    "Fonctionnement complet même sans connexion internet",
                  icon: "📶",
                },
                {
                  title: "Support Local",
                  description: "Équipe support basée à Kinshasa et Bujumbura",
                  icon: "🌍",
                },
              ].map((advantage, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{advantage.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-sky-900 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à Révolutionner Votre Pharmacie ?
            </h2>
            <p className="text-xl text-sky-200 mb-8">
              Rejoignez plus de 500 pharmacies qui font confiance à NakiCode
              PharmaSaaS
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Essai Gratuit 14 Jours
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sky-900 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Planifier une Démo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FeaturesPage;
