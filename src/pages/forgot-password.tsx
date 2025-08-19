import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // setEmailSent(true);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
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

        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Email Envoyé !
              </h2>
              <p className="text-xl text-sky-200 mb-8">
                Nous avons envoyé les instructions de réinitialisation à votre
                adresse email.
              </p>
            </div>

            <div className="bg-white/20 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">
                Prochaines étapes :
              </h3>
              <ul className="space-y-3 text-sky-200">
                <li className="flex items-start">
                  <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    1
                  </span>
                  Vérifiez votre boîte email (et le dossier spam)
                </li>
                <li className="flex items-start">
                  <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    2
                  </span>
                  Cliquez sur le lien de réinitialisation
                </li>
                <li className="flex items-start">
                  <span className="bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    3
                  </span>
                  Créez un nouveau mot de passe sécurisé
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sky-300 text-sm">
                Vous n'avez pas reçu l'email ? Il peut prendre quelques minutes
                à arriver.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setEmailSent(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur border border-white/30"
                >
                  Renvoyer l'email
                </button>
                <Link
                  href="/login"
                  className="flex-1 bg-white text-sky-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
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
        <meta
          name="description"
          content="Réinitialisez votre mot de passe NakiCode PharmaSaaS en quelques clics."
        />
      </Head>

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-50 via-blue-50 to-white relative overflow-hidden px-2 sm:px-0">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-md w-full py-4 z-50">
          <div className="text-center">
            <KeyIcon className="h-16 w-16 text-sky-600 mx-auto mb-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-sky-600 mb-1">
              Mot de Passe Oublié ?
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-2">
              Pas de souci ! Entrez votre email et nous vous enverrons les
              instructions de réinitialisation.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-1">
              {error}
            </div>
          )}

          <form
            className="space-y-4 px-6 pb-4 rounded-2xl bg-white shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email professionnel
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/90 backdrop-blur text-gray-900"
                  placeholder="pharmacien@votrePharmacie.cd"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                size="lg"
                className={`w-full flex justify-center transition-colors ${
                  isLoading ? "bg-gray-300 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-900 mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  "Envoyer les instructions"
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-sky-500 hover:text-sky-700 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </form>

          <div className="bg-black/10 rounded-xl mt-4 px-6 py-4 backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-600 mb-1">
              Besoin d'aide ?
            </h3>
            <div className="text-sm text-sky-600">
              <p>• Vérifiez que l'email utilisé correspond à votre compte</p>
              <p>• Consultez votre dossier spam/courrier indésirable</p>
              <p>• L'email peut prendre jusqu'à 10 minutes à arriver</p>
            </div>
            <div className="mt-1">
              <Link
                href="/contact"
                className="text-gray-500 hover:text-sky-700 font-medium text-sm"
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
