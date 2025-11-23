"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/design-system";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le plan depuis l'URL si disponible
  React.useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setFormData((prev) => ({ ...prev, selectedPlan: plan }));
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    // Étape 1 - Plan
    selectedPlan: "moyenne",

    // Étape 2 - Compte
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Étape 3 - Pharmacie
    pharmacyName: "",
    licenseNumber: "",
    address: "",
    city: "",
    country: "cd",
    pharmacyType: "retail",

    // Étape 4 - Paiement
    paymentMethod: "mobile_money",
    acceptTerms: false,
    marketingConsent: false,
  });

  const plans = [
    {
      id: "simple",
      name: "Simple",
      price: "25",
      description: "Perfect for small pharmacies",
      features: [
        "POS Basic",
        "Inventory Management",
        "Customer Records",
        "Basic Reports",
      ],
      recommended: false,
    },
    {
      id: "moyenne",
      name: "Moyenne",
      price: "45",
      description: "Most popular choice",
      features: [
        "All Simple features",
        "Prescription Management",
        "Advanced Analytics",
        "Mobile Money",
      ],
      recommended: true,
    },
    {
      id: "standard",
      name: "Standard",
      price: "85",
      description: "Full-featured solution",
      features: [
        "All Moyenne features",
        "AI Validation",
        "E-commerce",
        "API Access",
        "Priority Support",
      ],
      recommended: false,
    },
    {
      id: "grossiste",
      name: "Grossiste",
      price: "150",
      description: "For distributors and chains",
      features: [
        "All Standard features",
        "Multi-location",
        "Wholesale Management",
        "Custom Integrations",
      ],
      recommended: false,
    },
  ];

  const paymentMethods = [
    {
      id: "mobile_money",
      name: "Mobile Money",
      description: "AirtelMoney, OrangeMoney, M-Pesa",
      icon: DevicePhoneMobileIcon,
      popular: true,
    },
    {
      id: "card",
      name: "Carte Bancaire",
      description: "Visa, Mastercard",
      icon: CreditCardIcon,
      popular: false,
    },
    {
      id: "bank_transfer",
      name: "Virement Bancaire",
      description: "Transfert direct",
      icon: BuildingStorefrontIcon,
      popular: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation");
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de création de compte avec API
      console.log("Registration data:", formData);

      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Redirection vers confirmation ou tableau de bord
      router.push("/registration-success");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const steps = [
    {
      step: 1,
      title: "Choisissez Votre Plan",
      description: "Sélectionnez l'offre qui correspond à vos besoins",
    },
    {
      step: 2,
      title: "Créez Votre Compte",
      description: "Vos informations personnelles",
    },
    {
      step: 3,
      title: "Informations Pharmacie",
      description: "Détails de votre établissement",
    },
    {
      step: 4,
      title: "Finaliser l'Inscription",
      description: "Choisissez votre méthode de paiement",
    },
  ];

  const renderStep1 = () => (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-xl p-4 cursor-pointer ring-2 transition-all duration-200 hover:scale-95 ${
              formData.selectedPlan === plan.id
                ? "ring-sky-400 bg-sky-50 shadow-2xl"
                : "ring-gray-200 bg-white shadow-lg hover:shadow-2xl hover:border-gray-300"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, selectedPlan: plan.id }))
            }
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-sky-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
                  Recommandé
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="text-3xl font-bold text-sky-600 mb-2">
                ${plan.price}
                <span className="text-lg text-gray-600">/mois</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-2 mb-2">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div
              className={`w-full mt-auto py-2 px-4 rounded-lg text-center font-semibold text-sm ${
                formData.selectedPlan === plan.id
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {formData.selectedPlan === plan.id
                ? "Sélectionné"
                : "Choisir ce plan"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="Jean"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Prénom *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="Mukasa"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email professionnel *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="jean@pharmacie-moderne.cd"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Téléphone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="+243 99 123 4567"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500">
              Au moins 8 caractères avec majuscules et chiffres
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Type de pharmacie *
            </label>
            <select
              name="pharmacyType"
              required
              value={formData.pharmacyType}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
            >
              <option value="retail">Pharmacie de détail</option>
              <option value="hospital">Pharmacie hospitalière</option>
              <option value="wholesale">Grossiste/Distributeur</option>
              <option value="chain">Chaîne de pharmacies</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nom de la pharmacie *
            </label>
            <input
              type="text"
              name="pharmacyName"
              required
              value={formData.pharmacyName}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="Pharmacie Moderne"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Numéro de licence *
            </label>
            <input
              type="text"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="PH/KIN/2024/001"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Pays *
            </label>
            <select
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
            >
              <option value="cd">RD Congo</option>
              <option value="bi">Burundi</option>
              <option value="rw">Rwanda</option>
              <option value="ug">Ouganda</option>
              <option value="tz">Tanzanie</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="Kinshasa"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Adresse complète *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-900 transition-all"
              placeholder="Avenue de la Paix, Q/Socimat, Kinshasa"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="">
      <div className="">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Récapitulatif
          </h3>
          <div className="bg-sky-50 rounded-xl px-4 py-2 border border-sky-100">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Plan{" "}
                {formData.selectedPlan.charAt(0).toUpperCase() +
                  formData.selectedPlan.slice(1)}
              </span>
              <span className="font-bold text-xl text-sky-600">
                ${plans.find((p) => p.id === formData.selectedPlan)?.price}/mois
              </span>
            </div>
            <div className="flex justify-between items-center text-green-600/70 mb-1">
              <span className="flex items-center font-light">
                Premier mois gratuit
              </span>
              <span className="font-semibold">
                -${plans.find((p) => p.id === formData.selectedPlan)?.price}
              </span>
            </div>
            <hr className="border-gray-300 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total aujourd'hui
              </span>
              <span className="text-xl font-bold text-green-600">$0</span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Méthode de paiement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  className={`relative border-2 rounded-xl p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    formData.paymentMethod === method.id
                      ? "border-sky-400 bg-sky-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: method.id,
                    }))
                  }
                >
                  {method.popular && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Populaire
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <IconComponent
                      className={`h-8 w-8 mx-auto mb-1 ${
                        formData.paymentMethod === method.id
                          ? "text-sky-500"
                          : "text-gray-400"
                      }`}
                    />
                    <h4 className="font-semibold text-gray-900">
                      {method.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-1 mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              J'accepte les{" "}
              <Link
                href="/terms"
                className="text-sky-600 hover:text-sky-800 underline"
              >
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-800 underline"
              >
                politique de confidentialité
              </Link>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              J'accepte de recevoir des communications marketing (optionnel)
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen h-full flex items-center relative overflow-hidden">
        <div className="hidden lg:flex flex-col h-full bg-white/95 p-6 w-[22rem]">
          <div className="text-center mb-4">
            <Link
              href="/"
              className="text-3xl font-bold text-sky-600 mb-0 block"
            >
              MEDPharma
            </Link>
            <p className="text-gray-500 mb-4">Inscrivez-vous</p>
          </div>
          {/* Sidebar Step Indicator */}
          <div className="space-y-3 flex-grow">
            {steps.map((step) => (
              <div
                key={step.step}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  step.step === currentStep
                    ? "bg-gradient-to-r from-sky-600/90 via-sky-600/90 to-cyan-600/90 text-white shadow-xl scale-105"
                    : step.step < currentStep
                    ? "bg-gradient-to-r from-sky-700 via-sky-700 to-cyan-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 border border-gray-200/70"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                    step.step === currentStep
                      ? "bg-white text-sky-600 shadow-lg"
                      : step.step < currentStep
                      ? "bg-white text-green-600"
                      : "bg-white text-gray-400"
                  }`}
                >
                  {step.step < currentStep ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    step.step
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{step.title}</h3>
                  <p className="text-xs opacity-90">{step.description}</p>
                </div>
                {/* {step.step === currentStep && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                )} */}
              </div>
            ))}
          </div>
          <div className="mt-auto text-center">
            <p className="text-gray-700">
              Déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="text-sky-600 font-medium hover:text-sky-800"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full h-full z-10 mx-auto p-4 sm:p-12">
          <div className="block lg:hidden text-center mb-4">
            <Link href="/" className="text-3xl font-bold text-white mb-0 block">
              MEDPharma
            </Link>
            <p className="text-white/70 mb-4">Inscrivez-vous</p>
          </div>
          <div className="md:hidden space-y-2 mb-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  step.step === currentStep
                    ? "bg-gradient-to-r from-sky-600/90 via-sky-600/90 to-cyan-600/90 text-white shadow-lg"
                    : step.step < currentStep
                    ? "bg-gradient-to-r from-sky-700 via-sky-700 to-cyan-700 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step.step === currentStep
                      ? "bg-white text-sky-600"
                      : step.step < currentStep
                      ? "bg-white text-green-600"
                      : "bg-white text-gray-400"
                  }`}
                >
                  {step.step < currentStep ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    step.step
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs opacity-90">{step.description}</p>
                </div>
              </div>
            ))}
            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={currentStep === totalSteps ? handleSubmit : undefined}
            className="bg-white/95 flex flex-col p-4 md:p-8 rounded-2xl shadow-2xl flex-grow h-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-600 mb-1">
                {steps.find((step) => step.step === currentStep)?.title}
              </h2>
              <p className="text-xl text-gray-500/70">
                {steps.find((step) => step.step === currentStep)?.description}
              </p>
            </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div
              className={`flex items-center ${
                currentStep > 1 ? "justify-between" : "justify-end"
              } space-x-4 mt-auto`}
            >
              {currentStep > 1 && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handleBack}
                >
                  Précédent
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button type="button" size="lg" onClick={handleNext}>
                  Continuer
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!formData.acceptTerms || isLoading}
                  className="inline-flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-900 mr-2"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserGroupIcon className="mr-2 h-5 w-5" />
                      Créer mon compte
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
