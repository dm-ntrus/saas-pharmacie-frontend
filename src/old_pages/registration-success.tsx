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

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-50 via-blue-50 to-white relative overflow-hidden px-2 sm:px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-200/15 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto py-8 z-50 w-full">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">
              Félicitations !
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
              Votre compte a été créé avec succès
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Bienvenue dans l'écosystème NakiCode PharmaSaaS ! 
              Votre essai gratuit de 30 jours commence maintenant.
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Récapitulatif de votre inscription
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-lg p-4 border border-sky-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Plan Sélectionné</h4>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Plan Moyenne
                    </span>
                    <span className="text-gray-600 font-medium">$45/mois</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2 font-medium">Premier mois GRATUIT</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Votre Pharmacie</h4>
                  <p className="text-gray-700 font-medium">Pharmacie Moderne</p>
                  <p className="text-sm text-gray-500">Kinshasa, RD Congo</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                Vos prochaines étapes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">1. Vérifiez votre email</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Un email de confirmation avec vos identifiants vous a été envoyé.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">2. Téléchargez l'app mobile</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Accédez à votre pharmacie depuis votre smartphone (iOS et Android).
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                  <ShieldCheckIcon className="h-6 w-6 text-cyan-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">3. Configuration initiale</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Notre assistant vous guidera pour importer vos données existantes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <CreditCardIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">4. Formation gratuite</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Session de formation personnalisée avec votre conseiller dédié.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Bonus */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-xl border border-yellow-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎁</span>
                Bonus de bienvenue inclus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-gray-700">Formation personnalisée (valeur $200)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-gray-700">Import gratuit de vos données</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-gray-700">Support prioritaire 30 jours</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-gray-700">Consultation stratégique offerte</span>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-3 text-center">
                Redirection automatique vers votre tableau de bord
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2">{countdown}</div>
                <div className="w-full bg-sky-400/50 rounded-full h-3 backdrop-blur">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${(10 - countdown) * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard?welcome=true')}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center group"
                >
                  Accéder au Tableau de Bord
                  <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                
                <Link
                  href="/support"
                  className="flex-1 border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-6 py-4 rounded-xl font-semibold transition-all duration-200 text-center hover:shadow-md"
                >
                  Centre d'Aide
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Des questions ? Contactez notre équipe au{' '}
                  <a href="tel:+243991234567" className="text-sky-600 hover:text-sky-800 font-semibold transition-colors">
                    +243 99 123 4567
                  </a>{' '}
                  ou par email à{' '}
                  <a href="mailto:support@nakicode.com" className="text-sky-600 hover:text-sky-800 font-semibold transition-colors">
                    support@nakicode.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationSuccessPage;