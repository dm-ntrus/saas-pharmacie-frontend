'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ArrowRight, 
  User, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Phone,
  Mail,
  ArrowLeft,
  Zap,
  Shield
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const plans = [
  { id: 'simple', name: 'Simple', price: '29', features: ['1 Pharmacien', 'Inventaire de base', 'Ventes POS', 'Support Email'] },
  { id: 'standard', name: 'Standard', price: '99', features: ['Illimité', 'IA Prédictive', 'Comptabilité', 'Multi-devises'] },
  { id: 'grossiste', name: 'Grossiste', price: '199', features: ['Multi-sites', 'Gestion Entrepôt', 'API Accès', 'Manager Dédié'] },
];

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Étape 1 - Plan
    plan: 'standard',

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
    country: "RD Congo",
    pharmacyType: "retail",

    // Étape 4 - Paiement
    paymentMethod: "mobile_money",
    acceptTerms: false,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Récupérer le plan depuis l'URL si disponible
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setFormData((prev) => ({ ...prev, plan }));
    }
  }, [searchParams]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const update = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push('/auth/registration-success');
  };

  const inputClass = "w-full px-5 py-3 rounded-2xl text-slate-900 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50 focus:bg-white shadow-sm transition-all font-medium";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]";

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Panel - Editorial */}
      <div className="hidden lg:flex w-[450px] bg-slate-900 p-20 flex-col text-white relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-slate-900/90 z-10"></div>
        <Image
          src="/images/tenant.jpg"
          alt="Pharmacy"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        
        <Link href="/" className="flex items-center gap-4 relative z-20 group mb-24">
          <span className="font-display font-bold text-2xl text-emerald-600 tracking-tight">Syntix<span className="text-slate-900">Pharma</span></span>
        </Link>

        <div className="relative z-20 mt-auto">
          <div className="flex gap-1 text-emerald-500 mb-4">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
          </div>
          <h2 className="text-2xl font-display font-bold leading-[1.1] mb-12 italic">
            &quot;La technologie au service de la santé. SyntixPharma redéfinit l&apos;excellence opérationnelle en officine.&quot;
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-bold text-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden relative border-2 border-white/20">
            </div>
            <div>
              <p className="text-lg font-bold">Dr. David Luvuezo</p>
              <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[8px]">Pharmacie de l&apos;Espoir</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-20 right-20 flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] z-20">
          <span>© {new Date().getFullYear()} SyntixPharma</span>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white relative">
        {/* Top Progress Indicator */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl px-12 pt-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-12">
            <div className="flex-1">
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s}
                  className={`relative group transition-all duration-500 ${step === s ? 'scale-110' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${
                    step === s 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl shadow-emerald-600/30' 
                      : step > s 
                        ? 'bg-white border-emerald-500 text-emerald-600' 
                        : 'bg-white border-slate-100 text-slate-300'
                  }`}>
                    {step > s ? <Check className="w-5 h-5" /> : `0${s}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full mx-auto px-8 py-2">
          <form onSubmit={handleSubmit}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* ── STEP 1 – Plan ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[8px] font-black mb-2 border border-emerald-100 uppercase tracking-[0.2em]">
                      Configuration
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-1 tracking-tight leading-[0.9]">
                      Choisissez Votre{" "}
                      <span className="text-emerald-600">Plan.</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Sélectionnez l&apos;offre qui correspond le mieux à la taille et aux besoins de votre officine.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        whileHover={{ y: -10 }}
                        onClick={() => setFormData({ ...formData, plan: plan.id })}
                        className={`p-8 rounded-[3rem] border-2 cursor-pointer transition-all duration-500 relative group flex flex-col ${
                          formData.plan === plan.id 
                            ? 'border-emerald-500 bg-white shadow-[0_50px_100px_-20px_rgba(16,185,129,0.15)] scale-105 z-10' 
                            : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <h3 className="font-display font-bold text-2xl mb-1 text-slate-900">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-4xl font-display font-bold text-slate-900">{plan.price} $</span>
                          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ mois</span>
                        </div>
                        <ul className="space-y-1 mb-4 flex-1">
                          {plan.features.map(f => (
                            <li key={f} className="text-sm text-slate-600 flex items-center gap-4 font-medium">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all duration-500 ${
                          formData.plan === plan.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-white text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white'
                        }`}>
                          {formData.plan === plan.id ? 'Sélectionné' : 'Choisir'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 2 – Compte ── */}
              {step === 2 && (
                <div className="space-y-2">
                  <div className="max-w-2xl pb-2">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-2 border border-emerald-100 uppercase tracking-[0.2em]">
                      Identité
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-1 tracking-tight leading-[0.9]">
                      Créez Votre{" "}
                      <span className="text-emerald-600">Compte.</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Ces informations seront utilisées pour votre accès administrateur principal.
                    </p>
                  </div>

                  {/* Prénom / Nom */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Prénom</label>
                      <input
                        type="text"
                        required
                        placeholder="Jean"
                        className={inputClass}
                        value={formData.firstName}
                        onChange={update('firstName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Mukasa"
                        className={inputClass}
                        value={formData.lastName}
                        onChange={update('lastName')}
                      />
                    </div>
                  </div>

                  {/* Email / Téléphone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Email professionnel</label>
                      <input
                        type="email"
                        required
                        placeholder="jean@pharmacie.cd"
                        className={inputClass}
                        value={formData.email}
                        onChange={update('email')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+243 800 000 000"
                        className={inputClass}
                        value={formData.phone}
                        onChange={update('phone')}
                      />
                    </div>
                  </div>

                  {/* Mot de passe / Confirmation */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Mot de passe</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          className={`${inputClass} pr-12`}
                          value={formData.password}
                          onChange={update('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Confirmer le mot de passe</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          className={`${inputClass} pr-12`}
                          value={formData.confirmPassword}
                          onChange={update('confirmPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Minimum 8 caractères, incluant une majuscule et un chiffre.
                  </p>
                </div>
              )}

              {/* ── STEP 3 – Pharmacie ── */}
              {step === 3 && (
                <div className="space-y-2">
                  <div className="max-w-2xl pb-2">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-2 border border-emerald-100 uppercase tracking-[0.2em]">
                      Établissement
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-1 tracking-tight leading-[0.9]">
                      Votre{" "}
                      <span className="text-emerald-600">Pharmacie.</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Dites-nous en plus sur votre établissement pour configurer votre environnement.
                    </p>
                  </div>

                  {/* Nom pharmacie */}
                  <div className="space-y-2">
                    <label className={labelClass}>Nom de la Pharmacie</label>
                    <input
                      type="text"
                      required
                      placeholder="Pharmacie de la Paix"
                      className={inputClass}
                      value={formData.pharmacyName}
                      onChange={update('pharmacyName')}
                    />
                  </div>

                  {/* Licence / Type */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Numéro de Licence</label>
                      <input
                        type="text"
                        required
                        placeholder="LIC-2024-XXXX"
                        className={inputClass}
                        value={formData.licenseNumber}
                        onChange={update('licenseNumber')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Type d&apos;établissement</label>
                      <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.pharmacyType}
                        onChange={update('pharmacyType')}
                      >
                        <option value="retail">Officine (Détail)</option>
                        <option value="wholesale">Grossiste</option>
                        <option value="hospital">Pharmacie Hospitalière</option>
                        <option value="clinic">Clinique</option>
                      </select>
                    </div>
                  </div>

                  {/* Pays / Ville */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Pays</label>
                      <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.country}
                        onChange={update('country')}
                      >
                        <option value="RD Congo">RD Congo</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Congo-Brazzaville">Congo-Brazzaville</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Ville</label>
                      <input
                        type="text"
                        required
                        placeholder="Kinshasa"
                        className={inputClass}
                        value={formData.city}
                        onChange={update('city')}
                      />
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-2">
                    <label className={labelClass}>Adresse Complète</label>
                    <input
                      type="text"
                      required
                      placeholder="Avenue de la Justice, Gombe"
                      className={inputClass}
                      value={formData.address}
                      onChange={update('address')}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 4 – Paiement ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-2 border border-emerald-100 uppercase tracking-[0.2em]">
                      Paiement
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-1 tracking-tight leading-[0.9]">
                      Mode de{" "}
                      <span className="text-emerald-600">Paiement.</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Choisissez comment vous souhaitez régler votre abonnement SyntixPharma.
                    </p>
                  </div>

                  {/* Plan recap */}
                  <div className="p-6 rounded-[2rem] bg-emerald-600 text-white flex items-center justify-between shadow-2xl shadow-emerald-600/20">
                    <div>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em] mb-1">Plan Sélectionné</p>
                      <p className="text-3xl font-display font-bold">
                        {plans.find(p => p.id === formData.plan)?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-display font-bold">
                        {plans.find(p => p.id === formData.plan)?.price} $
                      </p>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">/ mois</p>
                    </div>
                  </div>

                  {/* Méthode de paiement */}
                  <div className="space-y-3">
                    <label className={labelClass}>Méthode de paiement</label>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                      {[
                        { id: 'mobile_money', label: 'Mobile Money', desc: 'M-Pesa, Airtel Money, Orange Money' },
                        { id: 'bank_transfer', label: 'Virement Bancaire', desc: 'Transfert depuis votre compte bancaire' },
                        { id: 'card', label: 'Carte Bancaire', desc: 'Visa, Mastercard — paiement sécurisé' },
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                          className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                            formData.paymentMethod === method.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                          }`}
                        >
                          <div>
                            <p className={`text-sm font-black uppercase tracking-widest ${formData.paymentMethod === method.id ? 'text-emerald-700' : 'text-slate-500'}`}>
                              {method.label}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-200'
                          }`}>
                            {formData.paymentMethod === method.id && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 5 – Récapitulatif ── */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-2 border border-emerald-100 uppercase tracking-[0.2em]">
                      Récapitulatif
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-1 tracking-tight leading-[0.9]">
                      Presque{" "}
                      <span className="text-emerald-600">Terminé.</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Vérifiez vos informations avant de lancer votre espace SyntixPharma.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Administrateur</p>
                      <p className="text-lg font-display font-bold text-slate-900 mb-0">{formData.firstName} {formData.lastName}</p>
                      <p className="text-slate-500 font-medium">{formData.email}</p>
                      {formData.phone && <p className="text-slate-400 text-sm font-medium">{formData.phone}</p>}
                    </div>
                    <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Établissement</p>
                      <p className="text-lg font-display font-bold text-slate-900 mb-0">{formData.pharmacyName}</p>
                      <p className="text-slate-500 font-medium">{formData.city}, {formData.country}</p>
                      {formData.licenseNumber && <p className="text-slate-400 text-sm font-medium">{formData.licenseNumber}</p>}
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-emerald-600 text-white flex items-center justify-between shadow-2xl shadow-emerald-600/20">
                    <div>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em] mb-1">Plan Sélectionné</p>
                      <p className="text-3xl font-display font-bold">
                        {plans.find(p => p.id === formData.plan)?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-display font-bold">
                        {plans.find(p => p.id === formData.plan)?.price} $
                      </p>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">/ mois • {
                        { mobile_money: 'Mobile Money', bank_transfer: 'Virement', card: 'Carte Bancaire' }[formData.paymentMethod]
                      }</p>
                    </div>
                  </div>

                  {/* Consentements */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-5 h-5 mt-0.5 text-emerald-600 border-slate-200 rounded-lg focus:ring-emerald-500 cursor-pointer transition-all shrink-0"
                        checked={formData.acceptTerms}
                        onChange={update('acceptTerms')}
                      />
                      <label htmlFor="terms" className="text-sm font-bold text-slate-600 cursor-pointer leading-relaxed">
                        J&apos;accepte les <Link href="/terms" className="text-emerald-600 underline">conditions d&apos;utilisation</Link> et la <Link href="/privacy" className="text-emerald-600 underline">politique de confidentialité</Link> de SyntixPharma.
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <input
                        id="marketing"
                        type="checkbox"
                        className="w-5 h-5 mt-0.5 text-emerald-600 border-slate-200 rounded-lg focus:ring-emerald-500 cursor-pointer transition-all shrink-0"
                        checked={formData.marketingConsent}
                        onChange={update('marketingConsent')}
                      />
                      <label htmlFor="marketing" className="text-sm font-bold text-slate-500 cursor-pointer leading-relaxed">
                        J&apos;accepte de recevoir des communications marketing et des mises à jour produit.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-3 text-slate-600 font-bold hover:text-slate-900 transition-colors group"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    Retour
                  </button>
                ) : (
                  <p className="text-slate-500 font-medium">
                    Déjà un compte ?{' '}
                    <Link href="/auth/login" className="font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest text-[10px] ml-2">
                      Se connecter
                    </Link>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-emerald-600 text-white rounded-[2rem] font-bold text-lg hover:bg-emerald-700 transition-all flex items-center gap-3 disabled:opacity-70 shadow-xl shadow-emerald-600/20 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      {step === 5 ? 'Créer mon compte' : 'Continuer'}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}