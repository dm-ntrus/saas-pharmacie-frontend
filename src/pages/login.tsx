import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulation de connexion - en production, connecter à l'API
      if (formData.email === 'demo@pharmacie.cd' && formData.password === 'demo123') {
        // Redirection vers le tableau de bord
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const demoCredentials = [
    {
      role: 'Pharmacien Titulaire',
      email: 'pharmacien@demo.cd',
      password: 'demo123',
      description: 'Accès complet à tous les modules'
    },
    {
      role: 'Caissier',
      email: 'caissier@demo.cd',
      password: 'demo123',
      description: 'Point de vente et gestion clients'
    },
    {
      role: 'Technicien',
      email: 'technicien@demo.cd',
      password: 'demo123',
      description: 'Inventaire et approvisionnement'
    }
  ];

  return (
    <>
      <Head>
        <title>Connexion - NakiCode PharmaSaaS</title>
        <meta name="description" content="Connectez-vous à votre tableau de bord NakiCode PharmaSaaS ou essayez notre démo gratuite." />
        <meta name="keywords" content="connexion, login, démo, tableau de bord, pharmacie" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800">
        <div className="flex">
          {/* Panel gauche - Formulaire */}
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <Link href="/" className="text-3xl font-bold text-white mb-2 block">
                  NakiCode PharmaSaaS
                </Link>
                <p className="text-indigo-200 mb-8">
                  Connectez-vous à votre espace de gestion pharmaceutique
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white bg-opacity-90 backdrop-blur text-gray-900"
                      placeholder="pharmacien@votrePharmacie.cd"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white bg-opacity-90 backdrop-blur text-gray-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-white">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-indigo-200 hover:text-white font-medium">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-indigo-900 transition-colors ${
                      isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-white'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-900 mr-2"></div>
                        Connexion...
                      </div>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-indigo-200">Pas encore de compte ? </span>
                  <Link href="/register" className="text-white font-semibold hover:text-indigo-200">
                    Créer un compte
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Panel droit - Démo */}
          <div className="hidden lg:block relative flex-1 bg-white bg-opacity-10 backdrop-blur">
            <div className="absolute inset-0 flex flex-col justify-center p-12">
              <div className="text-center mb-8">
                <BuildingStorefrontIcon className="h-16 w-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Essai Gratuit Immédiat
                </h2>
                <p className="text-xl text-indigo-200 mb-8">
                  Testez toutes les fonctionnalités sans engagement avec nos comptes de démonstration
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {demoCredentials.map((demo, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{demo.role}</h3>
                      <UserIcon className="h-5 w-5 text-indigo-200" />
                    </div>
                    <p className="text-sm text-indigo-200 mb-3">{demo.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-indigo-300">Email:</span>
                        <p className="text-white font-mono text-xs">{demo.email}</p>
                      </div>
                      <div>
                        <span className="text-indigo-300">Mot de passe:</span>
                        <p className="text-white font-mono text-xs">{demo.password}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setFormData({
                      email: demoCredentials[0].email,
                      password: demoCredentials[0].password,
                      rememberMe: false
                    });
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur border border-white border-opacity-30"
                >
                  Utiliser le Compte Démo Principal
                </button>
                <p className="text-xs text-indigo-300 mt-3">
                  Aucune carte bancaire requise • Données réalistes • Support inclus
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white border-opacity-20">
                <h3 className="text-lg font-semibold text-white mb-4">Fonctionnalités Démo Incluses:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-indigo-200">
                  <div>✓ Point de vente complet</div>
                  <div>✓ Gestion inventaire</div>
                  <div>✓ Prescriptions & DCI</div>
                  <div>✓ Analytics avancées</div>
                  <div>✓ Mobile Money simulé</div>
                  <div>✓ Support technique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;