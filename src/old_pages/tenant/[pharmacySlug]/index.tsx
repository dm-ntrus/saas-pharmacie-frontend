import React, { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface PharmacyData {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  license: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  certifications: string[];
  rating: number;
  reviewsCount: number;
  logo?: string;
  banner?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

interface TenantPageProps {
  pharmacy: PharmacyData | null;
  error?: string;
}

const TenantPage: NextPage<TenantPageProps> = ({ pharmacy, error }) => {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  if (error || !pharmacy) {
    return (
      <>
        <Head>
          <title>Pharmacie Non Trouvée - NakiCode PharmaSaaS</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <BuildingStorefrontIcon className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pharmacie Non Trouvée</h1>
            <p className="text-gray-600 mb-8">Cette pharmacie n'existe pas ou n'est plus active.</p>
            <Link
              href="/"
              className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Rediriger vers le tableau de bord spécifique à cette pharmacie
    router.push(`/tenant/${pharmacy.slug}/dashboard`);
  };

  return (
    <>
      <Head>
        <title>{pharmacy.name} - Pharmacie en ligne</title>
        <meta name="description" content={`${pharmacy.name} - ${pharmacy.description}. Située à ${pharmacy.address}, ${pharmacy.city}.`} />
        <meta name="keywords" content={`pharmacie, ${pharmacy.city}, médicaments, ordonnance, ${pharmacy.name}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header avec branding de la pharmacie */}
        <header 
          className="relative py-12 px-4"
          style={{
            background: `linear-gradient(135deg, ${pharmacy.theme.primaryColor}, ${pharmacy.theme.secondaryColor})`
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {pharmacy.logo && (
                  <img
                    src={pharmacy.logo}
                    alt={`Logo ${pharmacy.name}`}
                    className="h-16 w-16 rounded-lg bg-white p-2"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold text-white">{pharmacy.name}</h1>
                  <p className="text-xl text-white opacity-90">{pharmacy.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowLoginForm(!showLoginForm)}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Espace Personnel
              </button>
            </div>

            {/* Informations essentielles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="flex items-center text-white">
                  <MapPinIcon className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="opacity-90">{pharmacy.address}</p>
                    <p className="opacity-90">{pharmacy.city}, {pharmacy.country}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="flex items-center text-white">
                  <PhoneIcon className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">Contact</p>
                    <p className="opacity-90">{pharmacy.phone}</p>
                    <p className="opacity-90">{pharmacy.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="flex items-center text-white">
                  <ClockIcon className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">Horaires</p>
                    <p className="opacity-90">Lun-Ven: {pharmacy.hours.monday}</p>
                    <p className="opacity-90">Sam: {pharmacy.hours.saturday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Formulaire de connexion modal */}
        {showLoginForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Connexion Employé</h2>
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="votre.email@{pharmacy.slug}.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  style={{ backgroundColor: pharmacy.theme.primaryColor, color: 'white' }}
                >
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  Accéder au système
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Réservé aux employés de {pharmacy.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <main className="max-w-6xl mx-auto py-12 px-4">
          {/* Services et certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Services</h2>
              <div className="space-y-4">
                {pharmacy.services.map((service, index) => (
                  <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                    <HeartIcon className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-medium text-gray-900">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
              <div className="space-y-4">
                {pharmacy.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                    <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-3" />
                    <span className="font-medium text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Évaluations */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-8 w-8 ${
                        i < Math.floor(pharmacy.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900 ml-3">
                  {pharmacy.rating}/5
                </span>
              </div>
              <p className="text-gray-600">
                Basé sur {pharmacy.reviewsCount} avis clients vérifiés
              </p>
            </div>
          </div>

          {/* Informations réglementaires */}
          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Réglementaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <strong>Numéro de licence:</strong> {pharmacy.license}
              </div>
              <div>
                <strong>Pharmacien responsable:</strong> Dr. Jean Mukasa
              </div>
              <div>
                <strong>Autorité de contrôle:</strong> Ministère de la Santé - RDC
              </div>
              <div>
                <strong>Certification qualité:</strong> ISO 9001:2015
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer 
          className="py-8 px-4 text-white"
          style={{ backgroundColor: pharmacy.theme.primaryColor }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <p className="mb-2">© 2025 {pharmacy.name}. Tous droits réservés.</p>
            <p className="text-sm opacity-75">
              Propulsé par{' '}
              <Link href="/" className="hover:text-white font-semibold">
                NakiCode PharmaSaaS
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pharmacySlug } = context.params!;

  try {
    // Simulation de récupération des données de la pharmacie depuis l'API
    // En production, cela ferait un appel à votre API backend
    const pharmacyData: PharmacyData = {
      id: '1',
      slug: pharmacySlug as string,
      name: 'Pharmacie Moderne',
      description: 'Votre santé, notre priorité',
      address: 'Avenue de la Paix, Q/Socimat',
      city: 'Kinshasa',
      country: 'RD Congo',
      phone: '+243 99 123 4567',
      email: 'contact@pharmacie-moderne.cd',
      license: 'PH/KIN/2024/001',
      hours: {
        monday: '08h00 - 20h00',
        tuesday: '08h00 - 20h00',
        wednesday: '08h00 - 20h00',
        thursday: '08h00 - 20h00',
        friday: '08h00 - 20h00',
        saturday: '08h00 - 18h00',
        sunday: '10h00 - 16h00'
      },
      services: [
        'Dispensation de médicaments sur ordonnance',
        'Conseil pharmaceutique personnalisé',
        'Préparations magistrales',
        'Dispositifs médicaux',
        'Vaccinations (selon disponibilité)',
        'Tests rapides (glycémie, tension)',
        'Livraison à domicile'
      ],
      certifications: [
        'Certification ISO 9001:2015',
        'Bonnes Pratiques Pharmaceutiques (BPP)',
        'Certification OMS pour médicaments essentiels',
        'Agrément Ministère de la Santé RDC'
      ],
      rating: 4.8,
      reviewsCount: 247,
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6'
      }
    };

    // Vérifier si la pharmacie existe (simulation)
    if (pharmacySlug !== 'pharmacie1') {
      return {
        props: {
          pharmacy: null,
          error: 'Pharmacie non trouvée'
        }
      };
    }

    return {
      props: {
        pharmacy: pharmacyData
      }
    };
  } catch (error) {
    return {
      props: {
        pharmacy: null,
        error: 'Erreur lors du chargement des données'
      }
    };
  }
};

export default TenantPage;