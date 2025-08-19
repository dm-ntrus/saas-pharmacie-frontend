import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  PlayCircleIcon,
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import TenantSwitcher from '../components/TenantSwitcher';
import Layout from '@/components/layout/Layout';

const DemoPage: NextPage = () => {
  const [selectedDemo, setSelectedDemo] = useState('interactive');

  const demoOptions = [
    {
      id: 'interactive',
      name: 'Démo Interactive',
      description: 'Explorez la plateforme à votre rythme',
      duration: '15-30 min',
      icon: ComputerDesktopIcon,
      features: [
        'Accès complet aux fonctionnalités',
        'Données de démonstration réalistes',
        'Navigation libre',
        'Support chat intégré'
      ],
      available: true
    },
    {
      id: 'guided',
      name: 'Visite Guidée',
      description: 'Tour complet avec un expert',
      duration: '45 min',
      icon: VideoCameraIcon,
      features: [
        'Présentation personnalisée',
        'Questions & réponses',
        'Conseils d\'implémentation',
        'Analyse de vos besoins'
      ],
      available: true
    },
    {
      id: 'mobile',
      name: 'Démo Mobile',
      description: 'Interface mobile et tablette',
      duration: '20 min',
      icon: DevicePhoneMobileIcon,
      features: [
        'Application mobile native',
        'Mode hors ligne',
        'Scanner codes-barres',
        'Notifications push'
      ],
      available: true
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Mukenge',
      role: 'Pharmacienne Titulaire',
      location: 'Kinshasa, RDC',
      content: 'La démo m\'a convaincue en 10 minutes. L\'interface est intuitive et les fonctionnalités correspondent exactement à nos besoins quotidiens.',
      rating: 5,
      image: '👩‍⚕️'
    },
    {
      name: 'Jean-Pierre Niyonzima',
      role: 'Gérant Pharmacie',
      location: 'Bujumbura, Burundi',
      content: 'Impressionnant ! La gestion des stocks en temps réel et les alertes Mobile Money changent complètement notre façon de travailler.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Fatou Diallo',
      role: 'Pharmacienne',
      location: 'Lubumbashi, RDC',
      content: 'Le module de validation des prescriptions avec détection d\'interactions est un vrai plus pour la sécurité de nos patients.',
      rating: 5,
      image: '👩‍⚕️'
    }
  ];

  return (
    <Layout
      requireAuth={false}
      showSidebar={false}
      title="PharmacySaaS - Gestion Moderne des Pharmacies"
    >

      <div className="bg-white pt-10">

        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <PlayCircleIcon className="h-20 w-20 text-sky-300 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Voir <span className="text-sky-300">en Action</span>
            </h1>
            <p className="text-xl text-sky-200 mb-8">
              Découvrez comment NakiCode PharmaSaaS peut transformer la gestion de votre pharmacie.
              Essayez maintenant, gratuitement et sans engagement.
            </p>
            <div className="flex justify-center">
              <button className="bg-white text-sky-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition-colors inline-flex items-center focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                <PlayCircleIcon className="h-6 w-6 mr-3" />
                Lancer la Démo Interactive
              </button>
            </div>
          </div>
        </section>

        {/* Options de démo */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choisissez Votre Expérience</h2>
              <p className="text-xl text-gray-600">Plusieurs façons de découvrir notre plateforme</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {demoOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedDemo === option.id
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDemo(option.id)}
                >
                  <div className="text-center mb-6">
                    <div className={`${selectedDemo === option.id ? 'bg-sky-600' : 'bg-gray-400'} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h3>
                    <p className="text-gray-600 mb-2">{option.description}</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {option.duration}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      selectedDemo === option.id
                        ? 'bg-sky-600 text-white hover:bg-sky-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.id === 'interactive' ? 'Essayer Maintenant' : 
                     option.id === 'guided' ? 'Planifier une Session' : 
                     'Télécharger l\'App'}
                  </button>
                </div>
              ))}
            </div>

            {/* Démo interactive embed */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-12">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayCircleIcon className="h-20 w-20 mx-auto mb-4 text-sky-400" />
                  <h3 className="text-2xl font-bold mb-2">Démo Interactive Disponible</h3>
                  <p className="text-gray-300 mb-6">Explorez toutes les fonctionnalités en temps réel</p>
                  <button className="bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors">
                    Lancer la Démo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce Que Disent Nos Utilisateurs</h2>
              <p className="text-xl text-gray-600">Plus de 500 pharmacies nous font confiance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{testimonial.image}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planifier une démo personnalisée */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sky-900 rounded-2xl p-12 text-center text-white">
              <CalendarIcon className="h-16 w-16 text-sky-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Démo Personnalisée avec un Expert</h2>
              <p className="text-xl text-sky-200 mb-8">
                Obtenez une présentation adaptée à votre pharmacie et vos besoins spécifiques
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <VideoCameraIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Présentation Live</h3>
                  <p className="text-sm text-sky-200">45 minutes avec un expert produit</p>
                </div>
                <div className="text-center">
                  <ComputerDesktopIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Sur Mesure</h3>
                  <p className="text-sm text-sky-200">Adaptée à votre type de pharmacie</p>
                </div>
                <div className="text-center">
                  <CheckIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Plan d'Action</h3>
                  <p className="text-sm text-sky-200">Roadmap d'implémentation incluse</p>
                </div>
              </div>

              <div className="bg-sky-800 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Créneaux Disponibles Cette Semaine</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { day: 'Mardi', time: '14h00 - 14h45', available: true },
                    { day: 'Mercredi', time: '10h00 - 10h45', available: true },
                    { day: 'Jeudi', time: '16h00 - 16h45', available: false },
                    { day: 'Vendredi', time: '09h00 - 09h45', available: true }
                  ].map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        slot.available
                          ? 'bg-white text-sky-900 hover:bg-sky-50'
                          : 'bg-sky-700 text-sky-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-semibold">{slot.day}</div>
                      <div className="text-xs">{slot.time}</div>
                      {!slot.available && <div className="text-xs mt-1">Complet</div>}
                    </button>
                  ))}
                </div>
              </div>

              <button className="bg-white text-sky-900 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors inline-flex items-center focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                Réserver Ma Démo Personnalisée
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Ressources additionnelles */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ressources Utiles</h2>
              <p className="text-xl text-gray-600">Pour approfondir votre découverte</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Guide de Démarrage',
                  description: 'PDF complet pour bien commencer',
                  action: 'Télécharger',
                  color: 'bg-blue-500'
                },
                {
                  title: 'Webinaire Gratuit',
                  description: 'Session de formation live mensuelle',
                  action: 'S\'inscrire',
                  color: 'bg-green-500'
                },
                {
                  title: 'Cas d\'Usage',
                  description: 'Exemples concrets d\'implémentation',
                  action: 'Lire',
                  color: 'bg-cyan-500'
                },
                {
                  title: 'Support Chat',
                  description: 'Questions en temps réel',
                  action: 'Discuter',
                  color: 'bg-orange-500'
                }
              ].map((resource, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`${resource.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-lg">📄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                  <button className="text-sky-600 font-semibold hover:text-sky-800 transition-colors">
                    {resource.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Multi-Tenant Demo */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Démonstration Multi-Tenant
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chaque pharmacie dispose de son propre domaine personnalisé et de ses données isolées.
                Testez le système multi-tenant avec nos pharmacies de démonstration.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <TenantSwitcher />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoPage;