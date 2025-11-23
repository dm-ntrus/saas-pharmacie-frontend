"use client";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  PlayCircleIcon,
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import TenantSwitcher from "@/components/TenantSwitcher";
import { Button } from "@/design-system";

const DemoPage = () => {
  const [selectedDemo, setSelectedDemo] = useState("interactive");

  const demoOptions = [
    {
      id: "interactive",
      name: "Démo Interactive",
      description: "Explorez la plateforme à votre rythme",
      duration: "15-30 min",
      icon: ComputerDesktopIcon,
      features: [
        "Accès complet aux fonctionnalités",
        "Données de démonstration réalistes",
        "Navigation libre",
        "Support chat intégré",
      ],
      available: true,
    },
    {
      id: "guided",
      name: "Visite Guidée",
      description: "Tour complet avec un expert",
      duration: "45 min",
      icon: VideoCameraIcon,
      features: [
        "Présentation personnalisée",
        "Questions & réponses",
        "Conseils d'implémentation",
        "Analyse de vos besoins",
      ],
      available: true,
    },
    {
      id: "mobile",
      name: "Démo Mobile",
      description: "Interface mobile et tablette",
      duration: "20 min",
      icon: DevicePhoneMobileIcon,
      features: [
        "Application mobile native",
        "Mode hors ligne",
        "Scanner codes-barres",
        "Notifications push",
      ],
      available: true,
    },
  ];

  const testimonials = [
    {
      name: "Dr. Marie Mukenge",
      role: "Pharmacienne Titulaire",
      location: "Kinshasa, RDC",
      content:
        "La démo m'a convaincue en 10 minutes. L'interface est intuitive et les fonctionnalités correspondent exactement à nos besoins quotidiens.",
      rating: 5,
      image: "👩‍⚕️",
    },
    {
      name: "Jean-Pierre Niyonzima",
      role: "Gérant Pharmacie",
      location: "Bujumbura, Burundi",
      content:
        "Impressionnant ! La gestion des stocks en temps réel et les alertes Mobile Money changent complètement notre façon de travailler.",
      rating: 5,
      image: "👨‍💼",
    },
    {
      name: "Fatou Diallo",
      role: "Pharmacienne",
      location: "Lubumbashi, RDC",
      content:
        "Le module de validation des prescriptions avec détection d'interactions est un vrai plus pour la sécurité de nos patients.",
      rating: 5,
      image: "👩‍⚕️",
    },
  ];

  return (
    <div className="bg-white pt-10">
      {/* Hero Section  */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-8">
                <PlayCircleIcon className="h-16 w-16 text-sky-500 mr-4" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold">
                    Essayez <span className="text-sky-600">Gratuitement</span>
                  </h1>
                  <p className="text-gray-700 mt-2 text-lg">
                    Aucun engagement requis
                  </p>
                </div>
              </div>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Découvrez en temps réel comment NakiCode PharmaSaaS transforme
                la gestion des pharmacies. Interface moderne, fonctionnalités
                complètes, support Mobile Money intégré.
              </p>

              <div className="grid grid-cols-3 gap-4 justify-items-start mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-700">Pharmacies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">0€</div>
                  <div className="text-sm text-gray-700">Essai gratuit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-700">Support</div>
                </div>
              </div>

              <Button size="lg">
                <PlayCircleIcon className="h-6 w-6 mr-3" />
                Démarrer la Démo Maintenant
              </Button>
            </div>

            {/* Demo preview on the right */}
            <div className="lg:block">
              <div className="bg-gray-900/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <PlayCircleIcon className="h-16 w-16 text-sky-400 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">
                      Aperçu de l'Interface
                    </p>
                    <p className="text-gray-300 text-sm">Cliquez pour lancer</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 mb-4">
                    Interface complète disponible immédiatement
                  </p>
                  <Button size="lg">Lancer l'Aperçu</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - Full width */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Démo Interactive Complète
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez toutes les fonctionnalités avec des données réalistes.
              Aucune inscription requise.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <PlayCircleIcon className="h-24 w-24 text-sky-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">
                  Système Complet En Action
                </h3>
                <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                  Point de vente, gestion des stocks, comptabilité, Mobile Money
                  - tout y est
                </p>
                <Button size="lg">Lancer la Démo Interactive</Button>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-900/20 to-cyan-900/20"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-sky-400/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl"></div>
            </div>

            {/* Key features preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { name: "Point de Vente", icon: "🏪" },
                { name: "Gestion Stock", icon: "📦" },
                { name: "Mobile Money", icon: "📱" },
                { name: "Rapports", icon: "📊" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="font-semibold text-gray-900">{feature.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Options - Horizontal Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez Votre Expérience
            </h2>
            <p className="text-xl text-gray-600">
              Plusieurs façons de découvrir notre plateforme
            </p>
          </div>

          <div className="space-y-6">
            {demoOptions.map((option) => (
              <div
                key={option.id}
                className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedDemo === option.id
                    ? "border-sky-500 bg-sky-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => setSelectedDemo(option.id)}
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left mb-6 lg:mb-0">
                    <div
                      className={`${
                        selectedDemo === option.id
                          ? "bg-sky-600"
                          : "bg-gray-400"
                      } w-20 h-20 rounded-2xl flex items-center justify-center mb-6 lg:mb-0 lg:mr-8 transition-colors`}
                    >
                      <option.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-center lg:justify-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 mr-4">
                          {option.name}
                        </h3>
                        <div className="flex items-center text-gray-500">
                          <ClockIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">{option.duration}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg mb-6">
                        {option.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {option.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-gray-700"
                          >
                            <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      variant={
                        selectedDemo === option.id ? "default" : "secondary"
                      }
                    >
                      {option.id === "interactive"
                        ? "Essayer Maintenant"
                        : option.id === "guided"
                        ? "Planifier une Session"
                        : "Télécharger l'App"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Tenant Demo - Moved up and redesigned */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Démonstration Multi-Tenant
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Chaque pharmacie dispose de son propre domaine personnalisé et de
              ses données isolées. Testez le système multi-tenant avec nos
              pharmacies de démonstration.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Sélectionnez une pharmacie de test
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Pharmacie Centrale",
                      type: "Pharmacie urbaine",
                      features: [
                        "POS avancé",
                        "Multi-utilisateurs",
                        "Comptabilité",
                      ],
                    },
                    {
                      name: "Pharmacie Populaire",
                      type: "Pharmacie de quartier",
                      features: ["POS simple", "Mobile Money", "Alertes SMS"],
                    },
                    {
                      name: "Pharmacie Hospitalière",
                      type: "Établissement hospitalier",
                      features: [
                        "Gestion hospitalière",
                        "Prescriptions",
                        "Traçabilité",
                      ],
                    },
                  ].map((pharmacy, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {pharmacy.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {pharmacy.type}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pharmacy.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:pl-8">
                <TenantSwitcher />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 500 pharmacies nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sky-600 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-6 w-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="text-sky-600 font-semibold hover:text-sky-800 transition-colors">
                      Lire le témoignage complet →
                    </button>
                  </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Demo Booking */}
      <section className="py-20 bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <CalendarIcon className="h-16 w-16 text-sky-300 mb-6" />
              <h2 className="text-4xl font-bold mb-6">
                Démo Personnalisée avec Expert
              </h2>
              <p className="text-xl text-sky-200 mb-8 leading-relaxed">
                Obtenez une présentation adaptée à votre pharmacie et vos
                besoins spécifiques
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <VideoCameraIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Présentation Live</h3>
                  <p className="text-sm text-sky-200">45 min avec expert</p>
                </div>
                <div className="text-center">
                  <ComputerDesktopIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Sur Mesure</h3>
                  <p className="text-sm text-sky-200">Adaptée à vos besoins</p>
                </div>
                <div className="text-center">
                  <CheckIcon className="h-12 w-12 text-sky-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Plan d'Action</h3>
                  <p className="text-sm text-sky-200">Roadmap incluse</p>
                </div>
              </div>

              <button className="bg-white text-sky-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-50 transition-colors inline-flex items-center shadow-lg">
                Réserver Ma Démo Personnalisée
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </button>
            </div>

            <div className="bg-sky-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Créneaux Disponibles
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    day: "Mardi 28 Août",
                    time: "14h00 - 14h45",
                    expert: "Marie K.",
                    available: true,
                  },
                  {
                    day: "Mercredi 29 Août",
                    time: "10h00 - 10h45",
                    expert: "Jean-Paul M.",
                    available: true,
                  },
                  {
                    day: "Jeudi 30 Août",
                    time: "16h00 - 16h45",
                    expert: "Sarah D.",
                    available: false,
                  },
                  {
                    day: "Vendredi 31 Août",
                    time: "09h00 - 09h45",
                    expert: "David L.",
                    available: true,
                  },
                ].map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl transition-colors ${
                      slot.available
                        ? "bg-white text-gray-900 hover:bg-sky-50 cursor-pointer"
                        : "bg-sky-700 text-sky-300 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{slot.day}</div>
                        <div className="text-sm opacity-75">{slot.time}</div>
                      </div>
                      <div className="text-right">
                        {/* <div className="text-sm">Expert: {slot.expert}</div> */}
                        {!slot.available && (
                          <div className="text-xs mt-1 text-cyan-100">
                            Complet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources - Compact grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ressources Utiles
            </h2>
            <p className="text-xl text-gray-600">
              Pour approfondir votre découverte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Guide de Démarrage",
                description:
                  "PDF complet pour bien commencer avec la plateforme",
                action: "Télécharger",
                color: "bg-blue-500",
                icon: "📚",
              },
              {
                title: "Webinaire Gratuit",
                description: "Session de formation live mensuelle avec Q&A",
                action: "S'inscrire",
                color: "bg-green-500",
                icon: "🎥",
              },
              {
                title: "Cas d'Usage",
                description: "Exemples concrets d'implémentation réussie",
                action: "Lire",
                color: "bg-cyan-500",
                icon: "📈",
              },
              {
                title: "Support Chat",
                description: "Questions en temps réel avec notre équipe",
                action: "Discuter",
                color: "bg-orange-500",
                icon: "💬",
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div
                  className={`${resource.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6`}
                >
                  <span className="text-2xl">{resource.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {resource.description}
                </p>
                <Button variant="secondary" className="w-full">
                  {resource.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
