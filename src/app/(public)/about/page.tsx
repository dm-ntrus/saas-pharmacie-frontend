"use client";
import React from "react";
import Link from "next/link";
import {
  HeartIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";

const AboutPage  = () => {
  const stats = [
    { label: "Pharmacies clientes", value: "500+", icon: BuildingOfficeIcon },
    { label: "Pays couverts", value: "6", icon: GlobeAltIcon },
    { label: "Équipe experte", value: "25+", icon: UserGroupIcon },
    { label: "Années d'expérience", value: "8", icon: TrophyIcon },
  ];

  const team = [
    {
      name: "Jean-Baptiste NAKI",
      role: "CEO & Fondateur",
      image: "👨‍💼",
      description:
        "Expert en transformation digitale pharmaceutique avec 10+ ans d'expérience en Afrique centrale.",
      linkedin: "#",
    },
    {
      name: "Dr. Marie KASONGO",
      role: "CTO & Co-fondatrice",
      image: "👩‍⚕️",
      description:
        "Pharmacienne et développeuse, spécialisée en systèmes de santé digitaux et conformité réglementaire.",
      linkedin: "#",
    },
    {
      name: "Patrick MUKENDI",
      role: "VP Engineering",
      image: "👨‍💻",
      description:
        "Architecte logiciel senior, expert en solutions SaaS scalables et sécurité des données de santé.",
      linkedin: "#",
    },
    {
      name: "Fatou DIALLO",
      role: "VP Sales & Marketing",
      image: "👩‍💼",
      description:
        "Spécialiste du marché pharmaceutique africain avec un réseau étendu dans 12 pays.",
      linkedin: "#",
    },
  ];

  const values = [
    {
      title: "Innovation Africaine",
      description:
        "Nous développons des solutions adaptées aux réalités du marché pharmaceutique africain, avec des fonctionnalités spécifiques comme le Mobile Money et la gestion multi-devises.",
      icon: LightBulbIcon,
      color: "bg-blue-500",
    },
    {
      title: "Accessibilité",
      description:
        "Notre mission est de démocratiser l'accès aux technologies de pointe pour toutes les pharmacies, qu'elles soient en milieu urbain ou rural.",
      icon: HeartIcon,
      color: "bg-green-500",
    },
    {
      title: "Excellence",
      description:
        "Nous visons l'excellence en respectant les standards internationaux tout en restant adaptés aux besoins locaux spécifiques.",
      icon: TrophyIcon,
      color: "bg-cyan-500",
    },
    {
      title: "Partenariat",
      description:
        "Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs défis et co-créer les solutions les plus pertinentes.",
      icon: UserGroupIcon,
      color: "bg-orange-500",
    },
  ];

  const timeline = [
    {
      year: "2017",
      title: "Genèse du Projet",
      description:
        "Identification des défis de digitalisation pharmaceutique en RDC après une étude de marché approfondie.",
    },
    {
      year: "2019",
      title: "Première Version",
      description:
        "Lancement de la première solution pour 5 pharmacies pilotes à Kinshasa avec modules de base POS et inventaire.",
    },
    {
      year: "2021",
      title: "Expansion Régionale",
      description:
        "Extension au Burundi et Rwanda avec 50+ pharmacies clientes et intégration Mobile Money native.",
    },
    {
      year: "2023",
      title: "Innovation IA",
      description:
        "Intégration de l'intelligence artificielle pour l'analyse prédictive et l'optimisation des stocks.",
    },
    {
      year: "2024",
      title: "Certification ISO",
      description:
        "Obtention des certifications ISO 27001 et conformité aux standards internationaux de sécurité des données.",
    },
    {
      year: "2025",
      title: "Vision Pan-Africaine",
      description:
        "Expansion vers l'Afrique de l'Ouest et développement de partenariats stratégiques avec les gouvernements.",
    },
  ];

  return (
    <div className="bg-white pt-10">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sky-300 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-sky-400 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <div className="text-white">
              <RocketLaunchIcon className="h-16 w-16 text-sky-300 mb-6" />
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Notre <span className="text-sky-300">Mission</span>
              </h1>
              <p className="text-xl text-sky-100 mb-10 leading-relaxed">
                Transformer le secteur pharmaceutique africain grâce à des
                technologies innovantes, accessibles et adaptées aux réalités
                locales.
              </p>
              <div className="bg-sky-800/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-600/30">
                <p className="text-sky-200">
                  Depuis 2017, nous accompagnons les pharmacies dans leur
                  digitalisation pour améliorer l'accès aux soins de santé.
                </p>
              </div>
            </div>

            {/* Right Column - Stats in Cards */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-sky-600/30 text-center"
                >
                  <div className="bg-sky-300/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-sky-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sky-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Moved Up */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des experts passionnés par l'innovation en santé, unis par une
              vision commune
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Featured Team Members */}
            {team.slice(0, 2).map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="text-5xl">{member.image}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-sky-600 font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 mb-6">{member.description}</p>
                    <a
                      href={member.linkedin}
                      className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium"
                    >
                      LinkedIn →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.slice(2).map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{member.image}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-sky-600 font-semibold text-sm">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {member.description}
                </p>
                <a
                  href={member.linkedin}
                  className="text-sky-600 hover:text-sky-800 font-medium text-sm"
                >
                  LinkedIn →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action quotidienne
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-sky-50 rounded-3xl p-8 h-full border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-start gap-6">
                    <div
                      className={`${value.color} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Horizontal Design */}
      <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600">
              8 années d'innovation au service de la pharmacie africaine
            </p>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-8 min-w-max">
              {timeline.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-80">
                  {/* Year Circle */}
                  <div className="bg-gradient-to-br from-sky-600 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 shadow-lg">
                    {item.year}
                  </div>

                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center h-40 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                    <div
                      className="absolute top-10 left-10 w-full h-0.5 bg-sky-200 -z-10"
                      style={{ marginLeft: "5rem" }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Split Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Vision Content */}
            <div>
              <GlobeAltIcon className="h-16 w-16 text-sky-600 mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Vision 2030 : L'Afrique Digitale
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Notre ambition est de devenir la plateforme de référence pour la
                gestion pharmaceutique en Afrique subsaharienne, en connectant
                10,000+ pharmacies d'ici 2030.
              </p>
              <p className="text-gray-600 mb-8">
                Contribuer à l'amélioration de l'accès aux médicaments pour 100
                millions d'Africains.
              </p>

              <Link href="/contact">
                <Button size="lg">Rejoignez Notre Vision</Button>
              </Link>
            </div>

            {/* Right - Commitments */}
            <div>
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-3xl p-8 border border-sky-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Nos Engagements
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-sky-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      🌱
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Durabilité
                      </h4>
                      <p className="text-gray-600">
                        Solutions cloud éco-responsables et réduction de
                        l'empreinte papier
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-sky-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      🎓
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Formation
                      </h4>
                      <p className="text-gray-600">
                        Programme de formation gratuite pour 1000+ pharmaciens
                        chaque année
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-sky-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Inclusion
                      </h4>
                      <p className="text-gray-600">
                        Tarifs préférentiels pour les pharmacies rurales et les
                        jeunes entrepreneurs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
