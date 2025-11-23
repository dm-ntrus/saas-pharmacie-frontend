import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const SignupPage: NextPage = () => {
  const router = useRouter();

  const plans = [
    {
      id: 'simple',
      name: 'Simple',
      price: 25,
      originalPrice: 30,
      discount: '17% OFF',
      description: 'Idéal pour les petites pharmacies',
      popular: false,
      features: [
        'Point de vente basique',
        'Gestion inventaire',
        'Dossiers clients',
        'Rapports essentiels',
        'Support email',
        '1 utilisateur',
        'Sauvegarde quotidienne',
        'Mobile Money de base'
      ],
      limits: {
        products: '500 produits',
        customers: '1,000 clients',
        storage: '2 GB stockage'
      }
    },
    {
      id: 'moyenne',
      name: 'Moyenne',
      price: 45,
      originalPrice: 55,
      discount: '18% OFF',
      description: 'Le choix le plus populaire',
      popular: true,
      features: [
        'Toutes les fonctionnalités Simple',
        'Gestion prescriptions avancée',
        'Analytics et tableaux de bord',
        'Mobile Money complet (5 opérateurs)',
        'Intégration DCI/OMS',
        'Jusqu\'à 3 utilisateurs',
        'Support prioritaire',
        'Formation incluse'
      ],
      limits: {
        products: '2,000 produits',
        customers: '5,000 clients',
        storage: '10 GB stockage'
      }
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 85,
      originalPrice: 105,
      discount: '19% OFF',
      description: 'Solution complète pour pharmacies moyennes',
      popular: false,
      features: [
        'Toutes les fonctionnalités Moyenne',
        'Validation IA des prescriptions',
        'Module e-commerce intégré',
        'API et intégrations',
        'Utilisateurs illimités',
        'Support téléphonique 24/7',
        'Rapports avancés et BI',
        'Gestion multi-localisations'
      ],
      limits: {
        products: '10,000 produits',
        customers: '25,000 clients',
        storage: '50 GB stockage'
      }
    },
    {
      id: 'grossiste',
      name: 'Grossiste',
      price: 150,
      originalPrice: 180,
      discount: '17% OFF',
      description: 'Pour distributeurs et chaînes',
      popular: false,
      features: [
        'Toutes les fonctionnalités Standard',
        'Gestion grossiste avancée',
        'Traçabilité blockchain',
        'Intégrations ERP tierces',
        'Support dédié',
        'Formation sur site',
        'Rapports personnalisés',
        'Conformité réglementaire'
      ],
      limits: {
        products: 'Illimité',
        customers: 'Illimité',
        storage: '500 GB stockage'
      }
    }
  ];

  const handleSelectPlan = (planId: string) => {
    router.push(`/register?plan=${planId}`);
  };

  return (
    <>
      <Head>
        <title>Choisir un Plan - NakiCode PharmaSaaS</title>
        <meta name="description" content="Sélectionnez le plan NakiCode PharmaSaaS qui correspond à vos besoins. Premier mois gratuit, aucun engagement." />
        <meta name="keywords" content="plans, tarifs, pharmacie, saas, abonnement" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 py-12">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-bold text-white">
              NakiCode PharmaSaaS
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-sky-200 hover:text-white">
                Se connecter
              </Link>
              <Link
                href="/demo"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors backdrop-blur"
              >
                Essai Gratuit
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choisissez Votre Plan
            </h1>
            <p className="text-xl text-sky-200 mb-8 max-w-3xl mx-auto">
              Sélectionnez l'offre qui correspond parfaitement aux besoins de votre pharmacie. 
              Premier mois gratuit, aucun engagement.
            </p>
            
            {/* Avantages exclusifs */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center text-sky-200">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                30 jours gratuits
              </div>
              <div className="flex items-center text-sky-200">
                <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-2" />
                Aucun engagement
              </div>
              <div className="flex items-center text-sky-200">
                <CreditCardIcon className="h-5 w-5 text-green-400 mr-2" />
                Annulation en 1 clic
              </div>
              <div className="flex items-center text-sky-200">
                <DevicePhoneMobileIcon className="h-5 w-5 text-green-400 mr-2" />
                Mobile Money accepté
              </div>
            </div>

            {/* Badge promo */}
            <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
              <StarIcon className="h-4 w-4 mr-2" />
              Offre de Lancement : Jusqu'à 19% de réduction !
            </div>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-yellow-400 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 text-sm font-bold rounded-full shadow-lg">
                      ⭐ PLUS POPULAIRE
                    </span>
                  </div>
                )}

                {plan.discount && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      {plan.discount}
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* En-tête du plan */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-sky-600">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 ml-2">/mois</span>
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ${plan.originalPrice}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          Économie ${plan.originalPrice - plan.price}/mois
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limites */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Inclus dans ce plan :</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>📦 {plan.limits.products}</div>
                      <div>👥 {plan.limits.customers}</div>
                      <div>💾 {plan.limits.storage}</div>
                    </div>
                  </div>

                  {/* Bouton de sélection */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      plan.popular
                        ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Choisir {plan.name}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>

                  {plan.popular && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Choisi par 78% de nos clients
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comparaison détaillée */}
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Besoin d'aide pour choisir ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏪</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Petite Pharmacie</h3>
                <p className="text-sky-200 mb-4">1-2 employés, 200-500 produits</p>
                <span className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
                  → Plan Simple
                </span>
              </div>

              <div className="text-center">
                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏥</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Pharmacie Moyenne</h3>
                <p className="text-sky-200 mb-4">3-5 employés, 500-2000 produits</p>
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">
                  → Plan Moyenne
                </span>
              </div>

              <div className="text-center">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Grande Structure</h3>
                <p className="text-sky-200 mb-4">5+ employés, distribution</p>
                <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                  → Plan Standard/Grossiste
                </span>
              </div>
            </div>
          </div>

          {/* FAQ Rapide */}
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Questions Fréquentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Puis-je changer de plan plus tard ?
                </h3>
                <p className="text-sky-200">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                  Les changements sont effectifs immédiatement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Y a-t-il des frais cachés ?
                </h3>
                <p className="text-sky-200">
                  Non, le prix affiché est tout inclus. Pas de frais d'installation, 
                  de formation ou de support supplémentaires.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Comment fonctionne l'essai gratuit ?
                </h3>
                <p className="text-sky-200">
                  30 jours complets avec toutes les fonctionnalités. 
                  Aucune carte bancaire requise pour commencer.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Support technique inclus ?
                </h3>
                <p className="text-sky-200">
                  Oui, tous nos plans incluent le support technique. 
                  Les plans supérieurs ont un support prioritaire.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <p className="text-xl text-sky-200 mb-6">
              Plus de 2,500 pharmacies nous font confiance en Afrique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-colors backdrop-blur border border-white/30"
              >
                Essayer Gratuitement
              </Link>
              <Link
                href="/contact"
                className="bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Parler à un Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;