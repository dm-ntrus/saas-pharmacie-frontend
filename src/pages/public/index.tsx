import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Button } from '@/design-system';
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
} from '@heroicons/react/24/outline';

const PublicHomePage: React.FC = () => {
  const features = [
    {
      icon: BuildingStorefrontIcon,
      title: 'Gestion d\'Inventaire Intelligente',
      description: 'Suivez automatiquement vos stocks, alertes d\'expiration et commandes fournisseurs',
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Gestion des Prescriptions',
      description: 'Traitement numérique des ordonnances avec vérification d\'interactions médicamenteuses',
    },
    {
      icon: UserGroupIcon,
      title: 'Dossiers Patients',
      description: 'Base de données complète des patients avec historique médical et programme de fidélité',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Point de Vente Moderne',
      description: 'Interface POS intuitive avec gestion des paiements multiples (Stripe, Mobile Money)',
    },
    {
      icon: ChartBarIcon,
      title: 'Rapports & Analytics',
      description: 'Tableaux de bord temps réel avec analyses prédictives et rapports financiers',
    },
    {
      icon: TruckIcon,
      title: 'Livraison & Logistique',
      description: 'Système de livraison intégré avec suivi GPS et notifications clients',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Conformité & Sécurité',
      description: 'Respect total des réglementations pharmaceutiques avec sécurité de niveau bancaire',
    },
    {
      icon: HeartIcon,
      title: 'Support Client 24/7',
      description: 'Assistance technique dédiée et formation continue pour votre équipe',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Kabange',
      role: 'Pharmacienne, Kinshasa',
      content: 'PharmacySaaS a révolutionné notre gestion quotidienne. Nos ventes ont augmenté de 40% en 3 mois.',
      avatar: '/images/testimonials/marie.jpg',
    },
    {
      name: 'Jean-Baptiste Mukendi',
      role: 'Gérant Pharmacie, Lubumbashi',
      content: 'La gestion des stocks automatisée nous fait économiser 10 heures par semaine. Un investissement rentable !',
      avatar: '/images/testimonials/jean.jpg',
    },
    {
      name: 'Dr. Agnès Ngoy',
      role: 'Pharmacienne, Goma',
      content: 'L\'interface est intuitive et le support client exceptionnel. Je recommande vivement !',
      avatar: '/images/testimonials/agnes.jpg',
    },
  ];

  const stats = [
    { value: '500+', label: 'Pharmacies Actives' },
    { value: '50M+', label: 'Transactions Traitées' },
    { value: '99.9%', label: 'Temps de Disponibilité' },
    { value: '24/7', label: 'Support Client' },
  ];

  return (
    <Layout requireAuth={false} showSidebar={false} title="PharmacySaaS - Gestion Moderne des Pharmacies">
      <div className="bg-white">

        {/* Hero Section */}
        <section className="pt-20 bg-gradient-to-br from-sky-50 via-blue-50 to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
            <div className="text-center">
              <div className="inline-flex items-center bg-sky-100 text-sky-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
                Nouveau: Intégration IA pour l'optimisation des stocks
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Boostez la Rentabilité de
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600 block">
                  Votre Pharmacie
                </span>
                <span className="text-gray-900">avec la Gestion Intelligente</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed font-light">
                Automatisation complète, optimisation des ventes et conformité garantie. 
                Jusqu'à <span className="font-semibold text-green-600">30% d'augmentation des marges</span>{" "}
                avec notre plateforme SaaS tout-en-un.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                    Demander une Démo Gratuite
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2">
                    Voir nos Plans Tarifaires
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Essai Gratuit de 14 Jours
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Aucune Carte de Crédit Requise
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Configuration en 5 Minutes
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Support Français 24/7
                </div>
              </div>
            </div>
            
            {/* Hero image/mockup */}
            <div className="mt-16 relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border">
                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-center flex-1">
                      <span className="text-gray-600 font-medium">NakiCode PharmacySaaS - Tableau de Bord</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-sky-200 rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-3 rounded transform hover:scale-105 transition-transform">
                          <div className="h-3 bg-green-200 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-green-300 rounded w-16 animate-pulse"></div>
                          <div className="text-xs text-green-600 mt-1">↗ +15%</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded transform hover:scale-105 transition-transform">
                          <div className="h-3 bg-blue-200 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-blue-300 rounded w-16 animate-pulse"></div>
                          <div className="text-xs text-blue-600 mt-1">📊 Analytics</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded transform hover:scale-105 transition-transform">
                          <div className="h-3 bg-yellow-200 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-yellow-300 rounded w-16 animate-pulse"></div>
                          <div className="text-xs text-yellow-600 mt-1">⚠ Alertes</div>
                        </div>
                      </div>
                      {/* <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-600">Optimisation IA</span>
                          <span className="text-xs text-green-600">Actif</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                      </div> */}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Solutions Orientées Bénéfices Commerciaux
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Tout ce dont votre pharmacie a besoin
                <span className="block text-sky-600">pour maximiser sa rentabilité</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Une plateforme complète conçue spécialement pour les pharmacies africaines modernes, 
                avec intelligence artificielle intégrée pour l'optimisation des performances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="h-14 w-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sky-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    En savoir plus
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Benefits Section */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Boostez vos résultats avec l'Intelligence Artificielle
                </h3>
                <p className="text-sky-100 text-lg max-w-3xl mx-auto">
                  Notre IA révolutionne la gestion pharmaceutique avec des prédictions précises et des optimisations automatiques
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Prédiction de la Demande</h4>
                  <p className="text-sky-100 text-sm">Évitez les ruptures et optimisez vos commandes avec des prévisions IA précises</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Optimisation des Prix</h4>
                  <p className="text-sky-100 text-sm">Maximisez vos marges avec des stratégies de prix dynamiques et intelligentes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Fidélisation Client</h4>
                  <p className="text-sky-100 text-sm">Personnalisez les promotions et améliorez l'expérience client avec l'IA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tarifs Transparents pour Tous
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez le plan qui correspond à la taille de votre pharmacie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Plan Simple */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">$29<span className="text-lg text-gray-600">/mois</span></div>
                  <p className="text-sm text-gray-600 mb-6">Pour petites pharmacies</p>
                </div>
                <ul className="space-y-3 mb-6 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Jusqu'à 3 utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">1000 produits max</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Gestion de base</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Support email</span>
                  </li>
                </ul>
                <Link href="/register?plan=simple">
                  <Button className="w-full">Choisir Simple</Button>
                </Link>
              </div>

              {/* Plan Moyenne */}
              <div className="bg-white border-2 border-sky-500 rounded-lg p-6 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-sky-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                    POPULAIRE
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Moyenne</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">$59<span className="text-lg text-gray-600">/mois</span></div>
                  <p className="text-sm text-gray-600 mb-6">Pour pharmacies moyennes</p>
                </div>
                <ul className="space-y-3 mb-6 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Jusqu'à 10 utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">5000 produits max</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Analytics avancés</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/register?plan=moyenne">
                  <Button className="w-full">Choisir Moyenne</Button>
                </Link>
              </div>

              {/* Plan Standard */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">$99<span className="text-lg text-gray-600">/mois</span></div>
                  <p className="text-sm text-gray-600 mb-6">Pour grandes pharmacies</p>
                </div>
                <ul className="space-y-3 mb-6 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Jusqu'à 25 utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">15000 produits max</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Toutes les fonctionnalités</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">Support téléphonique</span>
                  </li>
                </ul>
                <Link href="/register?plan=standard">
                  <Button className="w-full">Choisir Standard</Button>
                </Link>
              </div>

              {/* Plan Grossiste */}
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Grossiste</h3>
                  <div className="text-3xl font-bold mb-1">$199<span className="text-lg text-gray-300">/mois</span></div>
                  <p className="text-sm text-gray-300 mb-6">Pour réseaux et grossistes</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm">Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm">Produits illimités</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm">Multi-localisations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm">Support dédié</span>
                  </li>
                </ul>
                <Link href="/register?plan=grossiste">
                  <Button variant="secondary" className="w-full">Choisir Grossiste</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 bg-white border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                La confiance de plus de 500 pharmacies
              </h2>
              <p className="text-gray-600">Rejoignez les pharmacies leaders qui utilisent déjà NakiCode PharmacySaaS</p>
            </div>
            
            {/* Partner Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Pharmacie {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Témoignages Clients
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Ce que disent nos clients
                <span className="block text-sky-600">qui nous font confiance</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Découvrez comment NakiCode PharmacySaaS transforme la gestion des pharmacies 
                en République Démocratique du Congo et au Burundi
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="h-14 w-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-sky-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Testimonial CTA */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-soft max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Voir plus de témoignages en vidéo
                </h3>
                <p className="text-gray-600 mb-6">
                  Découvrez les retours d'expérience complets de nos clients partenaires
                </p>
                <Button size="lg" variant="outline" className="inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Voir les vidéos témoignages
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-sky-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à Moderniser Votre Pharmacie ?
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-3xl mx-auto">
              Rejoignez plus de 500 pharmacies qui font confiance à PharmacySaaS pour optimiser leurs opérations quotidiennes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Essai gratuit 30 jours
                </Button>
              </Link>
              <Link href="mailto:contact@nakicode.com">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white hover:bg-white hover:text-sky-600">
                  Parler à un expert
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