import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

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
    users: number | 'unlimited';
    transactions: number | 'unlimited';
    products: number | 'unlimited';
    storage: string;
  };
  target: string;
  color: string;
}

const PricingPage: NextPage = () => {
  const [currency, setCurrency] = useState<'usd' | 'cdf' | 'bif'>('usd');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'simple',
      name: 'Simple',
      description: 'Parfait pour les petites pharmacies débutantes',
      price: {
        usd: billingPeriod === 'monthly' ? 29 : 290,
        cdf: billingPeriod === 'monthly' ? 75000 : 750000,
        bif: billingPeriod === 'monthly' ? 85000 : 850000
      },
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      icon: BuildingStorefrontIcon,
      target: 'Pharmacies de 1-3 employés',
      color: 'bg-blue-500',
      features: [
        { name: 'Point de Vente', included: true, description: 'Caisse complète avec tickets' },
        { name: 'Gestion Stocks de Base', included: true, description: 'Suivi inventaire essentiel' },
        { name: 'Gestion Clients', included: true, description: 'Base clients et fidélité' },
        { name: 'Rapports Standard', included: true, description: 'Ventes et stocks' },
        { name: 'Support Email', included: true },
        { name: 'Mobile Money', included: 'AirtelMoney uniquement' },
        { name: 'Multi-devises', included: false },
        { name: 'API Access', included: false },
        { name: 'Télémédecine', included: false },
        { name: 'E-commerce', included: false },
        { name: 'Analytics Avancées', included: false },
        { name: 'Formation Premium', included: false }
      ],
      limits: {
        users: 3,
        transactions: 1000,
        products: 500,
        storage: '2 GB'
      }
    },
    {
      id: 'moyenne',
      name: 'Moyenne',
      description: 'Solution complète pour pharmacies en croissance',
      price: {
        usd: billingPeriod === 'monthly' ? 79 : 790,
        cdf: billingPeriod === 'monthly' ? 200000 : 2000000,
        bif: billingPeriod === 'monthly' ? 230000 : 2300000
      },
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      popular: true,
      icon: ChartBarIcon,
      target: 'Pharmacies de 4-10 employés',
      color: 'bg-sky-500',
      features: [
        { name: 'Toutes fonctionnalités Simple', included: true },
        { name: 'Gestion Fournisseurs', included: true, description: 'Commandes et livraisons' },
        { name: 'Contrôle Qualité', included: true, description: 'Audits et conformité' },
        { name: 'Analytics Business', included: true, description: 'Tableaux de bord avancés' },
        { name: 'Mobile Money Complet', included: true, description: 'Tous opérateurs' },
        { name: 'Multi-devises', included: true, description: 'USD, CDF, BIF, EUR' },
        { name: 'API Basique', included: true, description: '1000 calls/mois' },
        { name: 'Support Téléphone', included: true },
        { name: 'Formation Standard', included: true },
        { name: 'E-commerce Basic', included: 'Site vitrine' },
        { name: 'Télémédecine', included: false },
        { name: 'White Label', included: false }
      ],
      limits: {
        users: 10,
        transactions: 10000,
        products: 2000,
        storage: '10 GB'
      }
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Plateforme avancée pour pharmacies établies',
      price: {
        usd: billingPeriod === 'monthly' ? 149 : 1490,
        cdf: billingPeriod === 'monthly' ? 375000 : 3750000,
        bif: billingPeriod === 'monthly' ? 435000 : 4350000
      },
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      icon: StarIcon,
      target: 'Pharmacies de 11-25 employés',
      color: 'bg-cyan-500',
      features: [
        { name: 'Toutes fonctionnalités Moyenne', included: true },
        { name: 'Laboratoire & Préparations', included: true, description: 'Gestion magistrales' },
        { name: 'RH & Paie', included: true, description: 'Gestion personnel complète' },
        { name: 'Comptabilité Avancée', included: true, description: 'Grand livre et fiscalité' },
        { name: 'Télémédecine Complète', included: true, description: 'Consultations vidéo' },
        { name: 'E-commerce Pro', included: true, description: 'Boutique complète' },
        { name: 'API Premium', included: true, description: '10,000 calls/mois' },
        { name: 'Support Prioritaire', included: true, description: '24/7 chat & téléphone' },
        { name: 'Formation Premium', included: true },
        { name: 'Rapports Personnalisés', included: true },
        { name: 'White Label', included: 'Logo personnalisé' },
        { name: 'Intégrations Tiers', included: true }
      ],
      limits: {
        users: 25,
        transactions: 50000,
        products: 10000,
        storage: '50 GB'
      }
    },
    {
      id: 'grossiste',
      name: 'Grossiste',
      description: 'Solution enterprise pour grossistes et chaînes',
      price: {
        usd: billingPeriod === 'monthly' ? 299 : 2990,
        cdf: billingPeriod === 'monthly' ? 750000 : 7500000,
        bif: billingPeriod === 'monthly' ? 875000 : 8750000
      },
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      icon: TruckIcon,
      target: 'Grossistes et chaînes 25+ employés',
      color: 'bg-green-500',
      features: [
        { name: 'Toutes fonctionnalités Standard', included: true },
        { name: 'Multi-Sites', included: true, description: 'Gestion centralisée' },
        { name: 'EDI & B2B', included: true, description: 'Échanges automatisés' },
        { name: 'BI Avancée', included: true, description: 'Machine Learning & IA' },
        { name: 'API Unlimited', included: true, description: 'Appels illimités' },
        { name: 'Support Dédié', included: true, description: 'Account Manager assigné' },
        { name: 'SLA 99.9%', included: true, description: 'Garantie uptime' },
        { name: 'Formation Sur-Mesure', included: true },
        { name: 'White Label Complet', included: true, description: 'Marque personnalisée' },
        { name: 'Infrastructure Dédiée', included: true },
        { name: 'Conformité Enterprise', included: true, description: 'SOC2, ISO27001' },
        { name: 'Développements Custom', included: 'Sur devis' }
      ],
      limits: {
        users: 'unlimited',
        transactions: 'unlimited',
        products: 'unlimited',
        storage: '500 GB'
      }
    }
  ];

  const currencySymbols = {
    usd: { symbol: '$', name: 'USD' },
    cdf: { symbol: 'CDF', name: 'Franc Congolais' },
    bif: { symbol: 'BIF', name: 'Franc Burundais' }
  };

  const formatPrice = (price: number) => {
    if (currency === 'usd') {
      return `$${price}`;
    }
    return `${price.toLocaleString()} ${currencySymbols[currency].symbol}`;
  };

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >
      <div className=" bg-white pt-10">
        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tarifs <span className="text-sky-300">Transparents</span>
            </h1>
            <p className="text-xl text-sky-200 mb-8">
              Choisissez le plan parfait pour votre pharmacie. Tous les plans incluent un essai gratuit de 14 jours.
            </p>
            
            {/* Contrôles de devise et période */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sky-200">Devise:</span>
                <div className="flex bg-sky-800 rounded-lg p-1">
                  {Object.entries(currencySymbols).map(([key, curr]) => (
                    <button
                      key={key}
                      onClick={() => setCurrency(key as 'usd' | 'cdf' | 'bif')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currency === key ? 'bg-white text-sky-900' : 'text-sky-200 hover:text-white'
                      }`}
                    >
                      {curr.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sky-200">Facturation:</span>
                <div className="flex bg-sky-800 rounded-lg p-1">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      billingPeriod === 'monthly' ? 'bg-white text-sky-900' : 'text-sky-200 hover:text-white'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annually')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      billingPeriod === 'annually' ? 'bg-white text-sky-900' : 'text-sky-200 hover:text-white'
                    }`}
                  >
                    Annuel <span className="text-green-400">(-17%)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans tarifaires */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-transform hover:scale-105 ${
                    plan.popular 
                      ? 'border-sky-500 ring-4 ring-sky-500 ring-opacity-20' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Le Plus Populaire
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* En-tête du plan */}
                    <div className="text-center mb-8">
                      <div className={`${plan.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <plan.icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{plan.target}</p>
                    </div>

                    {/* Prix */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">
                          {formatPrice(plan.price[currency])}
                        </span>
                        <span className="text-xl text-gray-500 ml-1">
                          {plan.period}
                        </span>
                      </div>
                      {billingPeriod === 'annually' && (
                        <p className="text-green-600 text-sm mt-2">
                          Économisez {formatPrice(Math.round(plan.price[currency] * 12 * 0.17))} par an
                        </p>
                      )}
                    </div>

                    {/* Limites */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Limites incluses</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Utilisateurs:</span>
                          <p className="font-medium">{plan.limits.users === 'unlimited' ? 'Illimité' : plan.limits.users}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Transactions/mois:</span>
                          <p className="font-medium">{plan.limits.transactions === 'unlimited' ? 'Illimité' : plan.limits.transactions.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Produits:</span>
                          <p className="font-medium">{plan.limits.products === 'unlimited' ? 'Illimité' : plan.limits.products.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Stockage:</span>
                          <p className="font-medium">{plan.limits.storage}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bouton CTA */}
                    <div className="mb-6">
                      <Link
                        href={`/signup?plan=${plan.id}`}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-center block transition-colors focus:ring-2 focus:ring-offset-2 ${
                          plan.popular
                            ? 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500'
                            : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500'
                        }`}
                      >
                        Commencer Gratuitement
                      </Link>
                    </div>

                    {/* Fonctionnalités */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Fonctionnalités incluses:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            {feature.included === true ? (
                              <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            ) : feature.included === false ? (
                              <XMarkIcon className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            ) : (
                              <CheckIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            )}
                            <div className="min-w-0">
                              <span className={`text-sm ${feature.included === false ? 'text-gray-400' : 'text-gray-700'}`}>
                                {feature.name}
                                {typeof feature.included === 'string' && (
                                  <span className="text-yellow-600 font-medium"> ({feature.included})</span>
                                )}
                              </span>
                              {feature.description && (
                                <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
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

        {/* FAQ Pricing */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
              <p className="text-xl text-gray-600">Tout ce que vous devez savoir sur nos tarifs</p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "Puis-je changer de plan à tout moment ?",
                  answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement et la facturation est ajustée au prorata."
                },
                {
                  question: "Y a-t-il des frais de configuration ?",
                  answer: "Non, tous nos plans incluent la configuration gratuite, la formation de base et la migration de vos données existantes."
                },
                {
                  question: "Que se passe-t-il si je dépasse les limites de mon plan ?",
                  answer: "Nous vous enverrons des notifications avant d'atteindre les limites. Vous pouvez alors upgrader ou nous proposons des forfaits additionnels à des tarifs préférentiels."
                },
                {
                  question: "Acceptez-vous les paiements Mobile Money ?",
                  answer: "Oui, nous acceptons AirtelMoney, OrangeMoney, M-Pesa, EcoCash et LumiCash en plus des cartes bancaires traditionnelles."
                },
                {
                  question: "Offrez-vous des remises pour les paiements annuels ?",
                  answer: "Oui, vous économisez 17% en choisissant la facturation annuelle, soit l'équivalent de 2 mois gratuits."
                },
                {
                  question: "Y a-t-il un support technique inclus ?",
                  answer: "Tous les plans incluent un support technique. Le niveau varie selon le plan : email (Simple), téléphone (Moyenne+), et support dédié 24/7 (Grossiste)."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-sky-900 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-sky-200 mb-8">
              Essayez gratuitement pendant 14 jours. Aucune carte bancaire requise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/signup" 
                className="bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Commencer Gratuitement
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sky-900 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
              >
                Parler à un Expert
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PricingPage;