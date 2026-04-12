import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingStorefrontIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le plan depuis l'URL si disponible
  React.useEffect(() => {
    const { plan } = router.query;
    if (plan && typeof plan === 'string') {
      setFormData(prev => ({ ...prev, selectedPlan: plan }));
    }
  }, [router.query]);

  const [formData, setFormData] = useState({
    // Étape 1 - Plan
    selectedPlan: 'moyenne',
    
    // Étape 2 - Compte
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Étape 3 - Pharmacie
    pharmacyName: '',
    licenseNumber: '',
    address: '',
    city: '',
    country: 'cd',
    pharmacyType: 'retail',
    
    // Étape 4 - Paiement
    paymentMethod: 'mobile_money',
    acceptTerms: false,
    marketingConsent: false
  });

  const plans = [
    {
      id: 'simple',
      name: 'Simple',
      price: '25',
      description: 'Perfect for small pharmacies',
      features: ['POS Basic', 'Inventory Management', 'Customer Records', 'Basic Reports'],
      recommended: false
    },
    {
      id: 'moyenne',
      name: 'Moyenne',
      price: '45',
      description: 'Most popular choice',
      features: ['All Simple features', 'Prescription Management', 'Advanced Analytics', 'Mobile Money'],
      recommended: true
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '85',
      description: 'Full-featured solution',
      features: ['All Moyenne features', 'AI Validation', 'E-commerce', 'API Access', 'Priority Support'],
      recommended: false
    },
    {
      id: 'grossiste',
      name: 'Grossiste',
      price: '150',
      description: 'For distributors and chains',
      features: ['All Standard features', 'Multi-location', 'Wholesale Management', 'Custom Integrations'],
      recommended: false
    }
  ];

  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'AirtelMoney, OrangeMoney, M-Pesa',
      icon: DevicePhoneMobileIcon,
      popular: true
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard',
      icon: CreditCardIcon,
      popular: false
    },
    {
      id: 'bank_transfer',
      name: 'Virement Bancaire',
      description: 'Transfert direct',
      icon: BuildingStorefrontIcon,
      popular: false
    }
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
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de création de compte avec API
      console.log('Registration data:', formData);
      
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Redirection vers confirmation ou tableau de bord
      router.push('/registration-success');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === currentStep 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : step < currentStep 
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {step < currentStep ? (
                <CheckCircleIcon className="h-6 w-6" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div className={`w-16 h-1 ${
                step < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-8 text-sm">
        <span className={currentStep === 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}>Plan</span>
        <span className={currentStep === 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}>Compte</span>
        <span className={currentStep === 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}>Pharmacie</span>
        <span className={currentStep === 4 ? 'text-indigo-600 font-medium' : 'text-gray-500'}>Paiement</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Choisissez Votre Plan</h2>
        <p className="text-xl text-indigo-200">Sélectionnez l'offre qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all ${
              formData.selectedPlan === plan.id
                ? 'ring-4 ring-indigo-500 shadow-2xl'
                : 'hover:shadow-xl'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan.id }))}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1 text-sm font-semibold rounded-full">
                  Recommandé
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                ${plan.price}<span className="text-lg text-gray-600">/mois</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className={`w-full py-2 px-4 rounded-lg text-center font-semibold ${
              formData.selectedPlan === plan.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {formData.selectedPlan === plan.id ? 'Sélectionné' : 'Choisir ce plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Créez Votre Compte</h2>
        <p className="text-xl text-indigo-200">Vos informations personnelles</p>
      </div>

      <div className="bg-white rounded-xl p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mukasa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email professionnel *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="jean@pharmacie-moderne.cd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+243 99 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Au moins 8 caractères avec majuscules et chiffres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Informations Pharmacie</h2>
        <p className="text-xl text-indigo-200">Détails de votre établissement</p>
      </div>

      <div className="bg-white rounded-xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la pharmacie *</label>
            <input
              type="text"
              name="pharmacyName"
              required
              value={formData.pharmacyName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Pharmacie Moderne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence *</label>
            <input
              type="text"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="PH/KIN/2024/001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de pharmacie *</label>
            <select
              name="pharmacyType"
              required
              value={formData.pharmacyType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="retail">Pharmacie de détail</option>
              <option value="hospital">Pharmacie hospitalière</option>
              <option value="wholesale">Grossiste/Distributeur</option>
              <option value="chain">Chaîne de pharmacies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Avenue de la Paix, Q/Socimat"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Kinshasa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
              <select
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="cd">RD Congo</option>
                <option value="bi">Burundi</option>
                <option value="rw">Rwanda</option>
                <option value="ug">Ouganda</option>
                <option value="tz">Tanzanie</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Finaliser l'Inscription</h2>
        <p className="text-xl text-indigo-200">Choisissez votre méthode de paiement</p>
      </div>

      <div className="bg-white rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span>Plan {formData.selectedPlan.charAt(0).toUpperCase() + formData.selectedPlan.slice(1)}</span>
              <span className="font-semibold">${plans.find(p => p.id === formData.selectedPlan)?.price}/mois</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Premier mois gratuit</span>
              <span>-${plans.find(p => p.id === formData.selectedPlan)?.price}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center font-semibold">
              <span>Total aujourd'hui</span>
              <span>$0</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.paymentMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <method.icon className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  {method.popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Populaire
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              J'accepte les{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
                politique de confidentialité
              </Link>
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
      <Head>
        <title>Inscription - NakiCode PharmaSaaS</title>
        <meta name="description" content="Créez votre compte NakiCode PharmaSaaS en quelques étapes. Premier mois gratuit, aucun engagement." />
        <meta name="keywords" content="inscription, register, compte, pharmacie, saas" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white mb-4 block">
              NakiCode PharmaSaaS
            </Link>
            <p className="text-indigo-200">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-white font-semibold hover:text-indigo-200">
                Se connecter
              </Link>
            </p>
          </div>

          {renderStepIndicator()}

          <form onSubmit={currentStep === totalSteps ? handleSubmit : undefined}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-center space-x-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
                >
                  Précédent
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Continuer
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.acceptTerms || isLoading}
                  className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-900 mr-2"></div>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserGroupIcon className="mr-2 h-5 w-5" />
                      Créer mon compte
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;