"use client"
import React, { useState } from "react";
import Link from "next/link";
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";
import Image from "next/image";

type Step = "email" | "otp" | "password" | "success";

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep("otp");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) {
      setError("Veuillez saisir le code OTP complet.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep("password");
    } catch (err) {
      setError("Code OTP invalide. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep("success");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (currentStep === "success") {
    return (
      <>
        <Head>
          <title>Mot de Passe Réinitialisé - NakiCode PharmaSaaS</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Mot de Passe Réinitialisé !
              </h2>
              <p className="text-xl text-sky-200 mb-8">
                Votre mot de passe a été mis à jour avec succès.
              </p>
            </div>

            <div className="bg-white/20 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">
                Connexion sécurisée :
              </h3>
              <ul className="space-y-3 text-sky-200">
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  Mot de passe mis à jour
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  Compte sécurisé
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  Prêt à vous connecter
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button size="lg">
                <Link href="/login">Se connecter maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case "email":
        return <EnvelopeIcon className="h-12 w-12 text-sky-600 mx-auto mt-2" />;
      case "otp":
        return (
          <ShieldCheckIcon className="h-12 w-12 text-sky-600 mx-auto mt-2" />
        );
      case "password":
        return <KeyIcon className="h-12 w-12 text-sky-600 mx-auto mt-2" />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Mot de Passe Oublié ?";
      case "otp":
        return "Vérification OTP";
      case "password":
        return "Nouveau Mot de Passe";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Entrez votre email et nous vous enverrons un code de vérification.";
      case "otp":
        return `Entrez le code de vérification à 6 chiffres envoyé à ${email}`;
      case "password":
        return "Créez un nouveau mot de passe sécurisé pour votre compte.";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-2 sm:px-0">
<Image src="/images/medpharma.png" width="300" height="100" alt="MEDPharma"/>
        <div className="max-w-md w-full p-8 z-10 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            {/* {getStepIcon()} */}
            <h2 className="text-xl md:text-2xl font-bold text-sky-600 mb-1">
              {getStepTitle()}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {getStepDescription()}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep === "email"
                    ? "bg-sky-600"
                    : currentStep === "otp" || currentStep === "password"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep === "otp"
                    ? "bg-sky-600"
                    : currentStep === "password"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep === "password" ? "bg-sky-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Email Form */}
          {currentStep === "email" && (
            <form
              className="space-y-4 px-2 py-4  border-b border-gray-200"
              onSubmit={handleEmailSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
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
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900"
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
                    "Envoyer le code OTP"
                  )}
                </Button>
              </div>

              <div className="text-center mt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-sky-500 hover:text-sky-700 font-medium"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {currentStep === "otp" && (
            <form
              className="space-y-4 px-2 py-4"
              onSubmit={handleOtpSubmit}
            >
              <div>
                <label className="block text-center text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          const prevInput = document.getElementById(
                            `otp-${index - 1}`
                          );
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading || otp.some((digit) => !digit)}
                  size="lg"
                  className={`w-full flex justify-center transition-colors ${
                    isLoading ? "bg-gray-300 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-900 mr-2"></div>
                      Vérification...
                    </div>
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
              </div>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="text-sm text-sky-500 hover:text-sky-700 font-medium"
                >
                  Renvoyer le code
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="inline-flex cursor-pointer items-center text-sm text-gray-500 hover:text-sky-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Changer l'email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password Form */}
          {currentStep === "password" && (
            <form
              className="space-y-4 px-2 py-4"
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900"
                    placeholder="Répétez le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  size="lg"
                  className={`w-full flex justify-center transition-colors ${
                    isLoading ? "bg-gray-300 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-900 mr-2"></div>
                      Mise à jour...
                    </div>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>
              </div>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep("otp")}
                  className="inline-flex cursor-pointer items-center text-sm text-gray-500 hover:text-sky-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Retour à la vérification
                </button>
              </div>
            </form>
          )}

          {/* Help section - only show on first step */}
          {currentStep === "email" && (
            <div className="bg-black/10 rounded-xl mt-4 px-6 py-4 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-600 mb-1">
                Besoin d'aide ?
              </h3>
              <div className="text-sm text-sky-600">
                <p>• Vérifiez que l'email utilisé correspond à votre compte</p>
                <p>• Consultez votre dossier spam/courrier indésirable</p>
                <p>• Le code OTP peut prendre jusqu'à 2 minutes à arriver</p>
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
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
