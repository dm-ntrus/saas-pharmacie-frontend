import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <Head>
          <title>Email Envoyé - NakiCode PharmaSaaS</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Email Envoyé !</h2>
              <p className="text-xl text-indigo-200 mb-8">
                Nous avons envoyé les instructions de réinitialisation à votre adresse email.
              </p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">Prochaines étapes :</h3>
              <ul className="space-y-3 text-indigo-200">
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  Vérifiez votre boîte email (et le dossier spam)
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  Cliquez sur le lien de réinitialisation
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  Créez un nouveau mot de passe sécurisé
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <p className="text-indigo-300 text-sm">
                Vous n'avez pas reçu l'email ? Il peut prendre quelques minutes à arriver.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setEmailSent(false)}
                  className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur border border-white border-opacity-30"
                >
                  Renvoyer l'email
                </button>
                <Link
                  href="/login"
                  className="flex-1 bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Mot de Passe Oublié - NakiCode PharmaSaaS</title>
        <meta name="description" content="Réinitialisez votre mot de passe NakiCode PharmaSaaS en quelques clics." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <KeyIcon className="h-16 w-16 text-indigo-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Mot de Passe Oublié ?
            </h2>
            <p className="text-xl text-indigo-200 mb-8">
              Pas de souci ! Entrez votre email et nous vous enverrons les instructions de réinitialisation.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white bg-opacity-90 backdrop-blur text-gray-900"
                  placeholder="pharmacien@votrePharmacie.cd"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-indigo-900 transition-colors ${
                  isLoading || !email
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-900 mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer les instructions'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-indigo-200 hover:text-white font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </form>

          <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Besoin d'aide ?</h3>
            <div className="space-y-2 text-sm text-indigo-200">
              <p>• Vérifiez que l'email utilisé correspond à votre compte</p>
              <p>• Consultez votre dossier spam/courrier indésirable</p>
              <p>• L'email peut prendre jusqu'à 10 minutes à arriver</p>
            </div>
            <div className="mt-4">
              <Link
                href="/contact"
                className="text-white hover:text-indigo-200 font-medium text-sm"
              >
                Contacter le support technique →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;