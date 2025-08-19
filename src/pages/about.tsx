import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  HeartIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';

const AboutPage: NextPage = () => {
  const stats = [
    { label: 'Pharmacies clientes', value: '500+', icon: BuildingOfficeIcon },
    { label: 'Pays couverts', value: '6', icon: GlobeAltIcon },
    { label: 'Équipe experte', value: '25+', icon: UserGroupIcon },
    { label: 'Années d\'expérience', value: '8', icon: TrophyIcon }
  ];

  const team = [
    {
      name: 'Jean-Baptiste NAKI',
      role: 'CEO & Fondateur',
      image: '👨‍💼',
      description: 'Expert en transformation digitale pharmaceutique avec 10+ ans d\'expérience en Afrique centrale.',
      linkedin: '#'
    },
    {
      name: 'Dr. Marie KASONGO',
      role: 'CTO & Co-fondatrice',
      image: '👩‍⚕️',
      description: 'Pharmacienne et développeuse, spécialisée en systèmes de santé digitaux et conformité réglementaire.',
      linkedin: '#'
    },
    {
      name: 'Patrick MUKENDI',
      role: 'VP Engineering',
      image: '👨‍💻',
      description: 'Architecte logiciel senior, expert en solutions SaaS scalables et sécurité des données de santé.',
      linkedin: '#'
    },
    {
      name: 'Fatou DIALLO',
      role: 'VP Sales & Marketing',
      image: '👩‍💼',
      description: 'Spécialiste du marché pharmaceutique africain avec un réseau étendu dans 12 pays.',
      linkedin: '#'
    }
  ];

  const values = [
    {
      title: 'Innovation Africaine',
      description: 'Nous développons des solutions adaptées aux réalités du marché pharmaceutique africain, avec des fonctionnalités spécifiques comme le Mobile Money et la gestion multi-devises.',
      icon: LightBulbIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Accessibilité',
      description: 'Notre mission est de démocratiser l\'accès aux technologies de pointe pour toutes les pharmacies, qu\'elles soient en milieu urbain ou rural.',
      icon: HeartIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Excellence',
      description: 'Nous visons l\'excellence en respectant les standards internationaux tout en restant adaptés aux besoins locaux spécifiques.',
      icon: TrophyIcon,
      color: 'bg-cyan-500'
    },
    {
      title: 'Partenariat',
      description: 'Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs défis et co-créer les solutions les plus pertinentes.',
      icon: UserGroupIcon,
      color: 'bg-orange-500'
    }
  ];

  const timeline = [
    {
      year: '2017',
      title: 'Genèse du Projet',
      description: 'Identification des défis de digitalisation pharmaceutique en RDC après une étude de marché approfondie.'
    },
    {
      year: '2019',
      title: 'Première Version',
      description: 'Lancement de la première solution pour 5 pharmacies pilotes à Kinshasa avec modules de base POS et inventaire.'
    },
    {
      year: '2021',
      title: 'Expansion Régionale',
      description: 'Extension au Burundi et Rwanda avec 50+ pharmacies clientes et intégration Mobile Money native.'
    },
    {
      year: '2023',
      title: 'Innovation IA',
      description: 'Intégration de l\'intelligence artificielle pour l\'analyse prédictive et l\'optimisation des stocks.'
    },
    {
      year: '2024',
      title: 'Certification ISO',
      description: 'Obtention des certifications ISO 27001 et conformité aux standards internationaux de sécurité des données.'
    },
    {
      year: '2025',
      title: 'Vision Pan-Africaine',
      description: 'Expansion vers l\'Afrique de l\'Ouest et développement de partenariats stratégiques avec les gouvernements.'
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
            <RocketLaunchIcon className="h-20 w-20 text-sky-300 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Notre <span className="text-sky-300">Mission</span>
            </h1>
            <p className="text-xl text-sky-200 mb-8">
              Transformer le secteur pharmaceutique africain grâce à des technologies innovantes, 
              accessibles et adaptées aux réalités locales. Depuis 2017, nous accompagnons 
              les pharmacies dans leur digitalisation pour améliorer l'accès aux soins de santé.
            </p>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-sky-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-10 w-10 text-sky-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
              <p className="text-xl text-gray-600">Les principes qui guident notre action quotidienne</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className={`${value.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Parcours</h2>
              <p className="text-xl text-gray-600">8 années d'innovation au service de la pharmacie africaine</p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sky-200"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  <div className="bg-sky-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
              <p className="text-xl text-gray-600">Des experts passionnés par l'innovation en santé</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sky-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-6">{member.description}</p>
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

        {/* Vision Afrique */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <GlobeAltIcon className="h-20 w-20 text-sky-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Vision 2030 : L'Afrique Digitale</h2>
            <p className="text-xl text-gray-600 mb-8">
              Notre ambition est de devenir la plateforme de référence pour la gestion pharmaceutique 
              en Afrique subsaharienne, en connectant 10,000+ pharmacies d'ici 2030 et en contribuant 
              à l'amélioration de l'accès aux médicaments pour 100 millions d'Africains.
            </p>
            
            <div className="bg-sky-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nos Engagements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🌱 Durabilité</h4>
                  <p className="text-sm text-gray-600">Solutions cloud éco-responsables et réduction de l'empreinte papier</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎓 Formation</h4>
                  <p className="text-sm text-gray-600">Programme de formation gratuite pour 1000+ pharmaciens chaque année</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🤝 Inclusion</h4>
                  <p className="text-sm text-gray-600">Tarifs préférentiels pour les pharmacies rurales et les jeunes entrepreneurs</p>
                </div>
              </div>
            </div>

            <Link 
              href="/contact"
              className="bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-700 transition-colors inline-block"
            >
              Rejoignez Notre Vision
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;