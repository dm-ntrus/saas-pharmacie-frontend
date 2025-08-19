import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CheckCircleIcon,
  SparklesIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const RegistrationSuccessPage: NextPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         router.push('/dashboard?welcome=true');
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   const confettiTimer = setTimeout(() => {
  //     setShowConfetti(false);
  //   }, 3000);

  //   return () => {
  //     clearInterval(timer);
  //     clearTimeout(confettiTimer);
  //   };
  // }, [router]);

  return (
    <>
      <Head>
        <title>Inscription Réussie - NakiCode PharmaSaaS</title>
        <meta name="description" content="Félicitations ! Votre compte NakiCode PharmaSaaS a été créé avec succès." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-cyan-600 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Effet de confettis */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <SparklesIcon className="h-6 w-6 text-yellow-300" />
              </div>
            ))}
          </div>
        )}

        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/95 rounded-3xl shadow-2xl p-12 backdrop-blur-lg">
            <div className="mb-8">
              <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6 animate-pulse" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎉 Félicitations !
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Votre compte a été créé avec succès
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Bienvenue dans l'écosystème NakiCode PharmaSaaS ! 
                Votre essai gratuit de 30 jours commence maintenant.
              </p>
            </div>

            {/* Informations du compte */}
            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📋 Récapitulatif de votre inscription</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Plan Sélectionné</h4>
                  <div className="flex items-center">
                    <div className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium">
                      Plan Moyenne
                    </div>
                    <span className="ml-2 text-gray-600">$45/mois</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">✨ Premier mois GRATUIT</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Votre Pharmacie</h4>
                  <p className="text-gray-700">Pharmacie Moderne</p>
                  <p className="text-sm text-gray-500">Kinshasa, RD Congo</p>
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🚀 Vos prochaines étapes</h3>
              
              <div className="space-y-4">
                <div className="flex items-start bg-blue-50 rounded-lg p-4">
                  <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">1. Vérifiez votre email</h4>
                    <p className="text-gray-600 text-sm">
                      Un email de confirmation avec vos identifiants vous a été envoyé.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-green-50 rounded-lg p-4">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">2. Téléchargez l'app mobile</h4>
                    <p className="text-gray-600 text-sm">
                      Accédez à votre pharmacie depuis votre smartphone (iOS et Android).
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-cyan-50 rounded-lg p-4">
                  <ShieldCheckIcon className="h-6 w-6 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">3. Configuration initiale</h4>
                    <p className="text-gray-600 text-sm">
                      Notre assistant vous guidera pour importer vos données existantes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-yellow-50 rounded-lg p-4">
                  <CreditCardIcon className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">4. Formation gratuite</h4>
                    <p className="text-gray-600 text-sm">
                      Session de formation personnalisée avec votre conseiller dédié.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avantages exclusifs */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎁 Bonus de bienvenue inclus</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>✅ Formation personnalisée (valeur $200)</div>
                <div>✅ Import gratuit de vos données</div>
                <div>✅ Support prioritaire 30 jours</div>
                <div>✅ Consultation stratégique offerte</div>
              </div>
            </div>

            {/* Compteur et redirection */}
            <div className="bg-sky-600 text-white rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Redirection automatique vers votre tableau de bord
              </h3>
              <div className="text-3xl font-bold mb-4">{countdown}</div>
              <div className="w-full bg-sky-400 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(10 - countdown) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/dashboard?welcome=true')}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg flex items-center justify-center"
              >
                Accéder au Tableau de Bord
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
              
              <Link
                href="/support"
                className="flex-1 border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-4 rounded-xl font-semibold transition-colors text-center"
              >
                Centre d'Aide
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Des questions ? Contactez notre équipe au{' '}
                <a href="tel:+243991234567" className="text-sky-600 hover:text-sky-800 font-semibold">
                  +243 99 123 4567
                </a>{' '}
                ou par email à{' '}
                <a href="mailto:support@nakicode.com" className="text-sky-600 hover:text-sky-800 font-semibold">
                  support@nakicode.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationSuccessPage;