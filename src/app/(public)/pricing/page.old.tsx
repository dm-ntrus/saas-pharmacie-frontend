"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ChartBarIcon,
  HeartIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    usd: number;
    cdf: number;
    bif: number;
  };
  period: string;
  popular?: boolean;
  icon: React.ComponentType<any>;
  features: Array<{
    name: string;
    included: boolean | string;
    description?: string;
  }>;
  limits: {
    users: number | "unlimited";
    transactions: number | "unlimited";
    products: number | "unlimited";
    storage: string;
  };
  target: string;
  color: string;
  gradient: string;
  recommended?: boolean;
}

const PricingPage = () => {
  const [currency, setCurrency] = useState<"usd" | "cdf" | "bif">("usd");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "monthly"
  );

  const plans: PricingPlan[] = [
    {
      id: "simple",
      name: "Simple",
      description: "Parfait pour les petites pharmacies débutantes",
      price: {
        usd: billingPeriod === "monthly" ? 29 : 290,
        cdf: billingPeriod === "monthly" ? 75000 : 750000,
        bif: billingPeriod === "monthly" ? 85000 : 850000,
      },
      period: billingPeriod === "monthly" ? "/mois" : "/an",
      icon: BuildingStorefrontIcon,
      target: "Pharmacies de 1-3 employés",
      color: "bg-blue-500",
      gradient: "from-blue-400 to-blue-600",
      features: [
        {
          name: "Point de Vente",
          included: true,
          description: "Caisse complète avec tickets",
        },
        {
          name: "Gestion Stocks de Base",
          included: true,
          description: "Suivi inventaire essentiel",
        },
        {
          name: "Gestion Clients",
          included: true,
          description: "Base clients et fidélité",
        },
        {
          name: "Rapports Standard",
          included: true,
          description: "Ventes et stocks",
        },
        { name: "Support Email", included: true },
        { name: "Mobile Money", included: "AirtelMoney uniquement" },
        { name: "Multi-devises", included: false },
        { name: "API Access", included: false },
        { name: "Télémédecine", included: false },
        { name: "E-commerce", included: false },
        { name: "Analytics Avancées", included: false },
        { name: "Formation Premium", included: false },
      ],
      limits: {
        users: 3,
        transactions: 1000,
        products: 500,
        storage: "2 GB",
      },
    },
    {
      id: "moyenne",
      name: "Moyenne",
      description: "Solution complète pour pharmacies en croissance",
      price: {
        usd: billingPeriod === "monthly" ? 79 : 790,
        cdf: billingPeriod === "monthly" ? 200000 : 2000000,
        bif: billingPeriod === "monthly" ? 230000 : 2300000,
      },
      period: billingPeriod === "monthly" ? "/mois" : "/an",
      popular: true,
      icon: ChartBarIcon,
      target: "Pharmacies de 4-10 employés",
      color: "bg-sky-500",
      gradient: "from-sky-400 to-cyan-500",
      features: [
        { name: "Toutes fonctionnalités Simple", included: true },
        {
          name: "Gestion Fournisseurs",
          included: true,
          description: "Commandes et livraisons",
        },
        {
          name: "Contrôle Qualité",
          included: true,
          description: "Audits et conformité",
        },
        {
          name: "Analytics Business",
          included: true,
          description: "Tableaux de bord avancés",
        },
        {
          name: "Mobile Money Complet",
          included: true,
          description: "Tous opérateurs",
        },
        {
          name: "Multi-devises",
          included: true,
          description: "USD, CDF, BIF, EUR",
        },
        { name: "API Basique", included: true, description: "1000 calls/mois" },
        { name: "Support Téléphone", included: true },
        { name: "Formation Standard", included: true },
        { name: "E-commerce Basic", included: "Site vitrine" },
        { name: "Télémédecine", included: false },
        { name: "White Label", included: false },
      ],
      limits: {
        users: 10,
        transactions: 10000,
        products: 2000,
        storage: "10 GB",
      },
    },
    {
      id: "standard",
      name: "Standard",
      description: "Plateforme avancée pour pharmacies établies",
      price: {
        usd: billingPeriod === "monthly" ? 149 : 1490,
        cdf: billingPeriod === "monthly" ? 375000 : 3750000,
        bif: billingPeriod === "monthly" ? 435000 : 4350000,
      },
      period: billingPeriod === "monthly" ? "/mois" : "/an",
      icon: StarIcon,
      target: "Pharmacies de 11-25 employés",
      color: "bg-cyan-500",
      gradient: "from-cyan-400 to-sky-600",
      // recommended: true,
      features: [
        { name: "Toutes fonctionnalités Moyenne", included: true },
        {
          name: "Laboratoire & Préparations",
          included: true,
          description: "Gestion magistrales",
        },
        {
          name: "RH & Paie",
          included: true,
          description: "Gestion personnel complète",
        },
        {
          name: "Comptabilité Avancée",
          included: true,
          description: "Grand livre et fiscalité",
        },
        {
          name: "Télémédecine Complète",
          included: true,
          description: "Consultations vidéo",
        },
        {
          name: "E-commerce Pro",
          included: true,
          description: "Boutique complète",
        },
        {
          name: "API Premium",
          included: true,
          description: "10,000 calls/mois",
        },
        {
          name: "Support Prioritaire",
          included: true,
          description: "24/7 chat & téléphone",
        },
        { name: "Formation Premium", included: true },
        { name: "Rapports Personnalisés", included: true },
        { name: "White Label", included: "Logo personnalisé" },
        { name: "Intégrations Tiers", included: true },
      ],
      limits: {
        users: 25,
        transactions: 50000,
        products: 10000,
        storage: "50 GB",
      },
    },
    {
      id: "grossiste",
      name: "Grossiste",
      description: "Solution enterprise pour grossistes et chaînes",
      price: {
        usd: billingPeriod === "monthly" ? 299 : 2990,
        cdf: billingPeriod === "monthly" ? 750000 : 7500000,
        bif: billingPeriod === "monthly" ? 875000 : 8750000,
      },
      period: billingPeriod === "monthly" ? "/mois" : "/an",
      icon: TruckIcon,
      target: "Grossistes et chaînes 25+ employés",
      color: "bg-green-500",
      gradient: "from-green-400 to-emerald-600",
      features: [
        { name: "Toutes fonctionnalités Standard", included: true },
        {
          name: "Multi-Sites",
          included: true,
          description: "Gestion centralisée",
        },
        {
          name: "EDI & B2B",
          included: true,
          description: "Échanges automatisés",
        },
        {
          name: "BI Avancée",
          included: true,
          description: "Machine Learning & IA",
        },
        {
          name: "API Unlimited",
          included: true,
          description: "Appels illimités",
        },
        {
          name: "Support Dédié",
          included: true,
          description: "Account Manager assigné",
        },
        { name: "SLA 99.9%", included: true, description: "Garantie uptime" },
        { name: "Formation Sur-Mesure", included: true },
        {
          name: "White Label Complet",
          included: true,
          description: "Marque personnalisée",
        },
        { name: "Infrastructure Dédiée", included: true },
        {
          name: "Conformité Enterprise",
          included: true,
          description: "SOC2, ISO27001",
        },
        { name: "Développements Custom", included: "Sur devis" },
      ],
      limits: {
        users: "unlimited",
        transactions: "unlimited",
        products: "unlimited",
        storage: "500 GB",
      },
    },
  ];

  const currencySymbols = {
    usd: { symbol: "$", name: "USD" },
    cdf: { symbol: "CDF", name: "Franc Congolais" },
    bif: { symbol: "BIF", name: "Franc Burundais" },
  };

  const formatPrice = (price: number) => {
    if (currency === "usd") {
      return `$${price}`;
    }
    return `${price.toLocaleString()} ${currencySymbols[currency].symbol}`;
  };

  return (
    <div className=" bg-white pt-10">
      {/*  Hero Section */}
      <section className="relative bg-gradient-to-b from-sky-50 via-white to-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 animate-pulse"></div>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 15 + 8}px`,
                height: `${Math.random() * 15 + 8}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative text-gray-900 pt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-6 py-3 bg-sky-600/10 backdrop-blur-sm rounded-full text-sky-900 font-medium mb-6">
                {/* <SparklesIcon className="h-5 w-5 mr-2" /> */}
                Essai gratuit 14 jours • Aucune carte requise
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                Tarifs{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">
                  Transparents
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 max-w-6xl mx-auto leading-relaxed">
                Choisissez le plan parfait pour votre pharmacie. Tous les plans
                incluent un essai gratuit de 14 jours.
              </p>
            </div>

            {/*  Controls */}
            <div className="flex flex-col lg:flex-row justify-center items-center space-y-6 lg:space-y-0 lg:space-x-12">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">Devise:</span>
                </div>
                <div className="flex bg-gray-900/10 backdrop-blur-md rounded-xl px-1.5 py-1 border border-white/20">
                  {Object.entries(currencySymbols).map(([key, curr]) => (
                    <button
                      key={key}
                      onClick={() => setCurrency(key as "usd" | "cdf" | "bif")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        currency === key
                          ? "bg-white text-sky-900 shadow-lg transform scale-105"
                          : "text-gray-500 hover:text-gray-700 hover:bg-white/10"
                      }`}
                    >
                      {curr.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <LightBulbIcon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">
                    Facturation:
                  </span>
                </div>
                <div className="flex bg-gray-900/10 backdrop-blur-md rounded-xl px-1.5 py-1 border border-white/20">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      billingPeriod === "monthly"
                        ? "bg-white text-sky-900 shadow-lg transform scale-105"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/10"
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annually")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative ${
                      billingPeriod === "annually"
                        ? "bg-white text-sky-900 shadow-lg transform scale-105"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/10"
                    }`}
                  >
                    Annuel
                    <span className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      -17%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  Pricing Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`group relative bg-white rounded-3xl transition-all duration-500 transform hover:-translate-y-4 ${
                  plan.popular || plan?.recommended
                    ? "shadow-2xl border-2 border-sky-200 scale-105 z-10"
                    : "shadow-lg border border-gray-200 hover:shadow-2xl"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Badge */}
                {(plan.popular || plan?.recommended) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div
                      className={`px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg ${
                        plan.popular
                          ? "bg-gradient-to-r from-sky-500 to-cyan-500"
                          : "bg-gradient-to-r from-cyan-500 to-sky-600"
                      }`}
                    >
                      {plan.popular ? "Le Plus Populaire" : "Recommandé"}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan?.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                    >
                      <plan.icon
                        className="h-10 w-10 text-white"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-2 leading-relaxed">
                      {plan.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                      {plan.target}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        {formatPrice(plan.price[currency])}
                      </span>
                      <span className="text-xl text-gray-500 ml-1">
                        {plan.period}
                      </span>
                    </div>
                    {billingPeriod === "annually" && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
                        <span className="text-green-800 text-sm font-semibold">
                          💰 Économisez{" "}
                          {formatPrice(
                            Math.round(plan.price[currency] * 12 * 0.17)
                          )}{" "}
                          par an
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
                    <Link
                      href={`/signup?plan=${plan.id}`}
                      className={`group/btn w-full py-4 px-6 rounded-2xl font-bold text-center block transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 shadow-lg ${
                        plan.popular || plan?.recommended
                          ? `bg-gradient-to-r ${plan?.gradient} text-white hover:shadow-2xl focus:ring-sky-500`
                          : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl focus:ring-gray-500"
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        Commencer Gratuitement
                        <ArrowRightIcon className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>

                  {/* Limits */}
                  <div
                    className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border ${
                      plan.popular || plan?.recommended
                        ? "border-sky-100"
                        : "border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-sky-600" />
                      Limites incluses
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-2xl text-sky-600 mb-1">
                          {plan.limits.users === "unlimited"
                            ? "∞"
                            : plan.limits.users}
                        </div>
                        <div className="text-gray-600">Utilisateurs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl text-sky-600 mb-1">
                          {plan.limits.transactions === "unlimited"
                            ? "∞"
                            : (plan.limits.transactions as number) / 1000 + "K"}
                        </div>
                        <div className="text-gray-600">Transactions/mois</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl text-sky-600 mb-1">
                          {plan.limits.products === "unlimited"
                            ? "∞"
                            : (plan.limits.products as number) / 1000 + "K"}
                        </div>
                        <div className="text-gray-600">Produits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl text-sky-600 mb-1">
                          {plan.limits.storage.replace(" GB", "")}
                        </div>
                        <div className="text-gray-600">GB Storage</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <HeartIcon className="h-5 w-5 mr-2 text-sky-600" />
                      Fonctionnalités incluses
                    </h4>
                    <ul className="space-y-3  overflow-y-auto custom-scrollbar">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start group/feature"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {feature.included === true ? (
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center group-hover/feature:scale-110 transition-transform">
                                <CheckIcon
                                  className="h-3 w-3 text-green-600"
                                  aria-hidden="true"
                                />
                              </div>
                            ) : feature.included === false ? (
                              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                <XMarkIcon
                                  className="h-3 w-3 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                            ) : (
                              <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center group-hover/feature:scale-110 transition-transform">
                                <CheckIcon
                                  className="h-3 w-3 text-yellow-600"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          <div className="ml-3 min-w-0 flex-1">
                            <span
                              className={`text-sm font-medium ${
                                feature.included === false
                                  ? "text-gray-400"
                                  : "text-gray-700"
                              }`}
                            >
                              {feature.name}
                              {typeof feature.included === "string" && (
                                <span className="text-yellow-600 font-semibold ml-1">
                                  ({feature.included})
                                </span>
                              )}
                            </span>
                            {feature.description && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full text-sky-800 font-medium mb-4">
              💡 Questions Fréquentes
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce que vous devez savoir sur nos tarifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des réponses claires à vos questions les plus importantes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer:
                  "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement et la facturation est ajustée au prorata.",
                icon: "🔄",
              },
              {
                question: "Y a-t-il des frais de configuration ?",
                answer:
                  "Non, tous nos plans incluent la configuration gratuite, la formation de base et la migration de vos données existantes.",
                icon: "💰",
              },
              {
                question: "Que se passe-t-il si je dépasse les limites ?",
                answer:
                  "Nous vous enverrons des notifications avant d'atteindre les limites. Vous pouvez alors upgrader ou nous proposons des forfaits additionnels à des tarifs préférentiels.",
                icon: "📊",
              },
              {
                question: "Acceptez-vous les paiements Mobile Money ?",
                answer:
                  "Oui, nous acceptons AirtelMoney, OrangeMoney, M-Pesa, EcoCash et LumiCash en plus des cartes bancaires traditionnelles.",
                icon: "📱",
              },
              {
                question: "Remises pour paiements annuels ?",
                answer:
                  "Oui, vous économisez 17% en choisissant la facturation annuelle, soit l'équivalent de 2 mois gratuits.",
                icon: "🎁",
              },
              {
                question: "Support technique inclus ?",
                answer:
                  "Tous les plans incluent un support technique. Le niveau varie selon le plan : email (Simple), téléphone (Moyenne+), et support dédié 24/7 (Grossiste).",
                icon: "🛠️",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-sky-100/50"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{faq.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-900 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
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
  );
};

export default PricingPage;
