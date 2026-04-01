'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronRight,
  User,
  CreditCard,
  Loader2,
  ChevronLeft,
  MapPin,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { useCreateTenant } from '@/hooks/useTenants';
import {
  TenantType,
  BillingCycle,
  PaymentMethod,
  OrganizationType,
  type CreateTenantDto,
} from '@/types/tenant.types';
import { toast } from 'react-hot-toast';
import {
  normalizeTenantSubdomain,
  validateTenantSubdomainFormat,
} from '@/lib/tenant/subdomain-rules';
import { usePublicPlans } from '@/hooks/api/usePublicPlans';
import type { Plan } from '@/types/billing';

const STATIC_FALLBACK_PLANS = [
  {
    id: 'starter',
    plan_key: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    priceAnnual: 290,
    users: 3,
    features: ['POS basique', 'Inventaire', 'Support email'],
  },
  {
    id: 'professional',
    plan_key: 'professional',
    name: 'Standard',
    priceMonthly: 99,
    priceAnnual: 990,
    users: -1,
    features: ['Supply chain', 'Analytics', 'Support 24/7', 'Mobile Money'],
  },
  {
    id: 'enterprise',
    plan_key: 'enterprise',
    name: 'Entreprise',
    priceMonthly: 199,
    priceAnnual: 1990,
    users: -1,
    features: ['Multi-sites', 'API & ERP', 'Manager dédié', 'SLA garanti'],
  },
];

function extractPlanFeatures(plan: Plan): string[] {
  const items: string[] = [];
  if (plan.max_users === -1) items.push('Utilisateurs illimités');
  else if (plan.max_users) items.push(`${plan.max_users} utilisateurs`);
  if (plan.max_pharmacies && plan.max_pharmacies > 1)
    items.push(plan.max_pharmacies === -1 ? 'Multi-sites' : `${plan.max_pharmacies} sites`);
  if (plan.is_trial_available) items.push('Essai gratuit');
  if (plan.feature_flags?.length) {
    for (const ff of plan.feature_flags.slice(0, 4)) {
      if (ff.is_included && ff.feature_name) items.push(ff.feature_name);
    }
  }
  if (items.length < 2) items.push('Support inclus');
  return items.slice(0, 6);
}

const initialFormData: CreateTenantDto = {
  tenantData: {
    name: '',
    subdomain: '',
    companyName: '',
    contact: { email: '', phone: '' },
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'FR',
    },
    website: '',
    licenseNumber: '',
    taxId: '',
    localization: {
      timezone: 'Europe/Paris',
      currency: 'EUR',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
    },
    tenantType: TenantType.SINGLE_PHARMACY,
  },
  ownerData: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    enable2FA: false,
    acceptTerms: false,
    acceptPrivacyPolicy: false,
    acceptDataProcessing: false,
    acceptMarketing: false,
  },
  planSelection: {
    planId: 'starter',
    billingInterval: BillingCycle.MONTHLY,
  },
  paymentInfo: {
    paymentMethod: PaymentMethod.CREDIT_CARD,
    paymentProviderCode: 'stripe',
  },
  organisationData: {
    type: OrganizationType.PHARMACY,
  },
  pharmacyData: {
    licenseNumber: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'FR',
    phone: '',
    email: '',
    website: '',
    pharmacistInCharge: '',
    pharmacistLicenseNumber: '',
    licenseExpiryDate: '',
  },
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterInner />
    </Suspense>
  );
}

function RegisterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const createTenant = useCreateTenant();
  const { data: apiPlans } = usePublicPlans({ active: true });

  const displayPlans = useMemo(() => {
    if (apiPlans && apiPlans.length > 0) {
      return apiPlans.map((p: Plan) => ({
        id: p.plan_key || p.id,
        plan_key: p.plan_key,
        name: p.name,
        priceMonthly: p.price,
        priceAnnual: Math.round(p.price * 10),
        users: p.max_users ?? 1,
        features: extractPlanFeatures(p),
      }));
    }
    return STATIC_FALLBACK_PLANS;
  }, [apiPlans]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateTenantDto>(initialFormData);

  useEffect(() => {
    const planParam = searchParams?.get('plan');
    if (planParam) {
      const match = displayPlans.find(
        (p) => p.plan_key === planParam || p.id === planParam,
      );
      if (match) {
        setFormData((prev) => ({
          ...prev,
          planSelection: { ...prev.planSelection, planId: match.id },
        }));
      }
    }
  }, [searchParams, displayPlans]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pharmacyData: {
        ...prev.pharmacyData,
        name: prev.tenantData.name,
        licenseNumber: prev.tenantData.licenseNumber,
        website: prev.tenantData.website ?? prev.pharmacyData.website,
        address: prev.tenantData.address?.street ?? prev.pharmacyData.address,
        city: prev.tenantData.address?.city ?? prev.pharmacyData.city,
        postalCode: prev.tenantData.address?.postalCode ?? prev.pharmacyData.postalCode,
        country: prev.tenantData.address?.country ?? prev.pharmacyData.country,
        phone: prev.tenantData.contact.phone || prev.pharmacyData.phone,
        email: prev.tenantData.contact.email || prev.pharmacyData.email,
      },
    }));
  }, [
    formData.tenantData.name,
    formData.tenantData.licenseNumber,
    formData.tenantData.website,
    formData.tenantData.address?.street,
    formData.tenantData.address?.city,
    formData.tenantData.address?.postalCode,
    formData.tenantData.address?.country,
    formData.tenantData.contact.phone,
    formData.tenantData.contact.email,
  ]);

  const totalSteps = 4;
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateTenantData = <K extends keyof CreateTenantDto['tenantData']>(
    field: K,
    value: CreateTenantDto['tenantData'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      tenantData: { ...prev.tenantData, [field]: value },
    }));
  };

  const updateOwnerData = <K extends keyof CreateTenantDto['ownerData']>(
    field: K,
    value: CreateTenantDto['ownerData'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      ownerData: { ...prev.ownerData, [field]: value },
    }));
  };

  const updatePlanSelection = <K extends keyof CreateTenantDto['planSelection']>(
    field: K,
    value: CreateTenantDto['planSelection'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      planSelection: { ...prev.planSelection, [field]: value },
    }));
  };

  const updatePaymentInfo = (field: keyof CreateTenantDto['paymentInfo'], value: string | PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, [field]: value },
    }));
  };

  const updatePharmacyData = <K extends keyof CreateTenantDto['pharmacyData']>(
    field: K,
    value: CreateTenantDto['pharmacyData'][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      pharmacyData: { ...prev.pharmacyData, [field]: value },
    }));
  };

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 1:
        return !!(
          formData.tenantData.name &&
          formData.tenantData.subdomain &&
          formData.tenantData.contact.email &&
          formData.tenantData.licenseNumber &&
          formData.pharmacyData.pharmacistInCharge &&
          formData.pharmacyData.pharmacistLicenseNumber
        );
      case 2:
        return !!(
          formData.tenantData.address?.street &&
          formData.tenantData.address?.city &&
          formData.tenantData.address?.postalCode &&
          formData.tenantData.address?.country &&
          formData.pharmacyData.state &&
          formData.pharmacyData.licenseExpiryDate
        );
      case 3:
        return !!(
          formData.ownerData.firstName &&
          formData.ownerData.lastName &&
          formData.ownerData.email &&
          formData.ownerData.acceptTerms &&
          formData.ownerData.acceptPrivacyPolicy &&
          formData.ownerData.acceptDataProcessing
        );
      case 4:
        return !!formData.planSelection.planId;
      default:
        return false;
    }
  };

  const calculatePrice = () => {
    const plan = displayPlans.find((p) => p.id === formData.planSelection.planId);
    if (!plan) return 0;
    return formData.planSelection.billingInterval === BillingCycle.YEARLY
      ? plan.priceAnnual / 12
      : plan.priceMonthly;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      if (step === 1) {
        const normalized = normalizeTenantSubdomain(formData.tenantData.subdomain);
        const subErr = validateTenantSubdomainFormat(normalized);
        if (subErr) {
          toast.error(subErr);
          return;
        }
        const step1Ok =
          !!formData.tenantData.name &&
          !!normalized &&
          !!formData.tenantData.contact.email &&
          !!formData.tenantData.licenseNumber &&
          !!formData.pharmacyData.pharmacistInCharge &&
          !!formData.pharmacyData.pharmacistLicenseNumber;
        if (!step1Ok) {
          toast.error("Merci de remplir tous les champs obligatoires de cette étape.");
          return;
        }
        updateTenantData("subdomain", normalized);
        nextStep();
        return;
      }
      if (!validateStep(step)) {
        toast.error("Merci de remplir tous les champs obligatoires de cette étape.");
        return;
      }
      nextStep();
      return;
    }
    if (!validateStep(4)) return;
    const normalizedSub = normalizeTenantSubdomain(formData.tenantData.subdomain);
    const finalSubErr = validateTenantSubdomainFormat(normalizedSub);
    if (finalSubErr) {
      toast.error(finalSubErr);
      return;
    }
    const payload: CreateTenantDto = {
      ...formData,
      tenantData: { ...formData.tenantData, subdomain: normalizedSub },
    };
    try {
      const res = await createTenant.mutateAsync(payload);
      const subQ = encodeURIComponent(normalizedSub);
      if ('provisioningId' in res && res.provisioningId) {
        router.push(
          `/auth/registration-success?provisioningId=${encodeURIComponent(res.provisioningId)}&subdomain=${subQ}`,
        );
        return;
      }
      if ('tenantId' in res && res.tenantId) {
        const syncSub =
          'subdomain' in res && typeof (res as { subdomain?: string }).subdomain === 'string'
            ? encodeURIComponent((res as { subdomain?: string }).subdomain!.trim().toLowerCase())
            : subQ;
        router.push(`/auth/registration-success?subdomain=${syncSub}`);
        return;
      }
      router.push(`/auth/registration-success?subdomain=${subQ}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Inscription impossible pour le moment.";
      toast.error(msg);
    }
  };

  const inputClass =
    'w-full px-5 py-3 rounded-2xl text-slate-900 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50 focus:bg-white shadow-sm transition-all font-medium';
  const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]';

  return (
    <AuthShell
      testimonial={{
        quote: "La technologie au service de la santé. SyntixPharma redéfinit l'excellence opérationnelle en officine.",
        name: "Dr. David Luvuezo",
        title: "Pharmacie de l'Espoir",
      }}
    >
      <div className="space-y-4">
        {/* Step progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all border-2 ${
                  step === s
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : step > s
                      ? 'bg-white border-emerald-500 text-emerald-600'
                      : 'bg-white border-slate-100 text-slate-300'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Step 1: Informations Pharmacie */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-3 border border-emerald-100 uppercase tracking-[0.2em]">
                      Étape 1 · Établissement
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1 tracking-tight">
                      Informations <span className="text-emerald-600">Pharmacie</span>
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Nom, sous-domaine, contact et licence de votre officine.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Nom de la pharmacie *</label>
                      <input
                        type="text"
                        required
                        placeholder="Pharmacie Centrale Paris"
                        className={inputClass}
                        value={formData.tenantData.name}
                        onChange={(e) => updateTenantData('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Sous-domaine *</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="pharmacie-centrale"
                          className={inputClass}
                          value={formData.tenantData.subdomain}
                          onChange={(e) =>
                            updateTenantData(
                              'subdomain',
                              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                            )
                          }
                        />
                        <span className="text-sm text-slate-400 whitespace-nowrap">.saas-pharma.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Nom de la société (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Pharmacie Centrale SARL"
                      className={inputClass}
                      value={formData.tenantData.companyName ?? ''}
                      onChange={(e) => updateTenantData('companyName', e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Email de contact *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@pharmacie.fr"
                        className={inputClass}
                        value={formData.tenantData.contact.email}
                        onChange={(e) =>
                          updateTenantData('contact', {
                            ...formData.tenantData.contact,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 1 23 45 67 89"
                        className={inputClass}
                        value={formData.tenantData.contact.phone}
                        onChange={(e) =>
                          updateTenantData('contact', {
                            ...formData.tenantData.contact,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Numéro de licence *</label>
                      <input
                        type="text"
                        required
                        placeholder="RP-2024-12345678"
                        className={inputClass}
                        value={formData.tenantData.licenseNumber}
                        onChange={(e) => updateTenantData('licenseNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Numéro TVA (optionnel)</label>
                      <input
                        type="text"
                        placeholder="FR12345678901"
                        className={inputClass}
                        value={formData.tenantData.taxId ?? ''}
                        onChange={(e) => updateTenantData('taxId', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Pharmacien responsable *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Sophie Martin"
                        className={inputClass}
                        value={formData.pharmacyData.pharmacistInCharge}
                        onChange={(e) => updatePharmacyData('pharmacistInCharge', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>N° licence du pharmacien *</label>
                      <input
                        type="text"
                        required
                        placeholder="PHARM-123456"
                        className={inputClass}
                        value={formData.pharmacyData.pharmacistLicenseNumber}
                        onChange={(e) => updatePharmacyData('pharmacistLicenseNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Site web (optionnel)</label>
                    <input
                      type="url"
                      placeholder="https://www.pharmacie-centrale.fr"
                      className={inputClass}
                      value={formData.tenantData.website ?? ''}
                      onChange={(e) => updateTenantData('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Type de tenant</label>
                    <select
                      className={`${inputClass} appearance-none cursor-pointer`}
                      value={formData.tenantData.tenantType}
                      onChange={(e) => updateTenantData('tenantType', e.target.value as TenantType)}
                    >
                      <option value={TenantType.SINGLE_PHARMACY}>Pharmacie individuelle</option>
                      <option value={TenantType.PHARMACY_CHAIN}>Chaîne de pharmacies</option>
                      <option value={TenantType.WHOLESALER}>Grossiste / Distributeur</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Adresse & Localisation */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-3 border border-emerald-100 uppercase tracking-[0.2em]">
                      <MapPin className="w-3 h-3" />
                      Étape 2 · Adresse
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1 tracking-tight">
                      Adresse & <span className="text-emerald-600">Localisation</span>
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Adresse postale et paramètres régionaux.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Rue / Adresse *</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Avenue des Champs-Élysées"
                      className={inputClass}
                      value={formData.tenantData.address?.street ?? ''}
                      onChange={(e) =>
                        updateTenantData('address', {
                          ...(formData.tenantData.address ?? {
                            street: '',
                            city: '',
                            postalCode: '',
                            country: 'FR',
                          }),
                          street: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Ville *</label>
                      <input
                        type="text"
                        required
                        placeholder="Paris"
                        className={inputClass}
                        value={formData.tenantData.address?.city ?? ''}
                        onChange={(e) =>
                          updateTenantData('address', {
                            ...(formData.tenantData.address ?? {
                              street: '',
                              city: '',
                              postalCode: '',
                              country: 'FR',
                            }),
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Code postal *</label>
                      <input
                        type="text"
                        required
                        placeholder="75008"
                        className={inputClass}
                        value={formData.tenantData.address?.postalCode ?? ''}
                        onChange={(e) =>
                          updateTenantData('address', {
                            ...(formData.tenantData.address ?? {
                              street: '',
                              city: '',
                              postalCode: '',
                              country: 'FR',
                            }),
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Pays *</label>
                      <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.tenantData.address?.country ?? 'FR'}
                        onChange={(e) =>
                          updateTenantData('address', {
                            ...(formData.tenantData.address ?? {
                              street: '',
                              city: '',
                              postalCode: '',
                              country: 'FR',
                            }),
                            country: e.target.value,
                          })
                        }
                      >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="CA">Canada</option>
                        <option value="US">États-Unis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Région / État *</label>
                      <input
                        type="text"
                        required
                        placeholder="Île-de-France"
                        className={inputClass}
                        value={formData.pharmacyData.state}
                        onChange={(e) => updatePharmacyData('state', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Expiration licence pharmacie *</label>
                      <input
                        type="date"
                        required
                        className={inputClass}
                        value={String(formData.pharmacyData.licenseExpiryDate ?? '').slice(0, 10)}
                        onChange={(e) => updatePharmacyData('licenseExpiryDate', e.target.value)}
                      />
                      <p className="text-xs text-slate-400">Format ISO attendu par le backend (YYYY-MM-DD)</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Paramètres régionaux</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Fuseau horaire</label>
                        <select
                          className={`${inputClass} appearance-none cursor-pointer`}
                          value={formData.tenantData.localization?.timezone ?? 'Europe/Paris'}
                          onChange={(e) =>
                            updateTenantData('localization', {
                              ...(formData.tenantData.localization ?? {
                                timezone: 'Europe/Paris',
                                currency: 'EUR',
                                language: 'fr',
                                dateFormat: 'DD/MM/YYYY',
                              }),
                              timezone: e.target.value,
                            })
                          }
                        >
                          <option value="Europe/Paris">Europe/Paris</option>
                          <option value="Europe/Brussels">Europe/Brussels</option>
                          <option value="Europe/Zurich">Europe/Zurich</option>
                          <option value="America/Montreal">America/Montreal</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Devise</label>
                        <select
                          className={`${inputClass} appearance-none cursor-pointer`}
                          value={formData.tenantData.localization?.currency ?? 'EUR'}
                          onChange={(e) =>
                            updateTenantData('localization', {
                              ...(formData.tenantData.localization ?? {
                                timezone: 'Europe/Paris',
                                currency: 'EUR',
                                language: 'fr',
                                dateFormat: 'DD/MM/YYYY',
                              }),
                              currency: e.target.value,
                            })
                          }
                        >
                          <option value="EUR">EUR €</option>
                          <option value="USD">USD $</option>
                          <option value="CHF">CHF</option>
                          <option value="CAD">CAD $</option>
                          <option value="GBP">GBP £</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Langue</label>
                        <select
                          className={`${inputClass} appearance-none cursor-pointer`}
                          value={formData.tenantData.localization?.language ?? 'fr'}
                          onChange={(e) =>
                            updateTenantData('localization', {
                              ...(formData.tenantData.localization ?? {
                                timezone: 'Europe/Paris',
                                currency: 'EUR',
                                language: 'fr',
                                dateFormat: 'DD/MM/YYYY',
                              }),
                              language: e.target.value,
                            })
                          }
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Format de date</label>
                        <select
                          className={`${inputClass} appearance-none cursor-pointer`}
                          value={formData.tenantData.localization?.dateFormat ?? 'DD/MM/YYYY'}
                          onChange={(e) =>
                            updateTenantData('localization', {
                              ...(formData.tenantData.localization ?? {
                                timezone: 'Europe/Paris',
                                currency: 'EUR',
                                language: 'fr',
                                dateFormat: 'DD/MM/YYYY',
                              }),
                              dateFormat: e.target.value,
                            })
                          }
                        >
                          <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                          <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                          <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Propriétaire / Admin */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-3 border border-emerald-100 uppercase tracking-[0.2em]">
                      <User className="w-3 h-3" />
                      Étape 3 · Administrateur
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1 tracking-tight">
                      Propriétaire / <span className="text-emerald-600">Admin</span>
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Compte administrateur principal de l&apos;officine.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Prénom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Jean"
                        className={inputClass}
                        value={formData.ownerData.firstName}
                        onChange={(e) => updateOwnerData('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Nom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dupont"
                        className={inputClass}
                        value={formData.ownerData.lastName}
                        onChange={(e) => updateOwnerData('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="jean.dupont@email.com"
                        className={inputClass}
                        value={formData.ownerData.email}
                        onChange={(e) => updateOwnerData('email', e.target.value)}
                      />
                      <p className="text-xs text-slate-400">Cet email sera le compte administrateur principal</p>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        className={inputClass}
                        value={formData.ownerData.phone ?? ''}
                        onChange={(e) => updateOwnerData('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <p className="text-sm font-bold text-slate-800">
                      Sécurité du compte administrateur
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Le mot de passe provisoire est généré côté serveur et envoyé par e-mail (Keycloak).
                      Vous devrez le changer à la première connexion.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable2FA"
                      className="w-5 h-5 text-emerald-600 border-slate-200 rounded-lg focus:ring-emerald-500"
                      checked={formData.ownerData.enable2FA ?? false}
                      onChange={(e) => updateOwnerData('enable2FA', e.target.checked)}
                    />
                    <label htmlFor="enable2FA" className="text-sm font-bold text-slate-600 cursor-pointer">
                      Activer 2FA pour cet administrateur
                    </label>
                  </div>

                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="font-semibold text-slate-900">Acceptations obligatoires *</h3>
                    {[
                      {
                        id: 'acceptTerms',
                        checked: formData.ownerData.acceptTerms,
                        set: (v: boolean) => updateOwnerData('acceptTerms', v),
                        label: <>J&apos;accepte les <Link href="/terms" className="text-emerald-600 underline">Conditions Générales d&apos;Utilisation</Link> *</>,
                      },
                      {
                        id: 'acceptPrivacyPolicy',
                        checked: formData.ownerData.acceptPrivacyPolicy,
                        set: (v: boolean) => updateOwnerData('acceptPrivacyPolicy', v),
                        label: <>J&apos;accepte la <Link href="/privacy" className="text-emerald-600 underline">Politique de Confidentialité</Link> *</>,
                      },
                      {
                        id: 'acceptDataProcessing',
                        checked: formData.ownerData.acceptDataProcessing,
                        set: (v: boolean) => updateOwnerData('acceptDataProcessing', v),
                        label: "J'accepte le traitement de mes données personnelles *",
                      },
                      {
                        id: 'acceptMarketing',
                        checked: formData.ownerData.acceptMarketing ?? false,
                        set: (v: boolean) => updateOwnerData('acceptMarketing', v),
                        label: 'J\'accepte de recevoir les communications marketing (optionnel)',
                      },
                    ].map(({ id, checked, set, label }) => (
                      <div key={id} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={id}
                          required={id !== 'acceptMarketing'}
                          className="w-5 h-5 mt-0.5 text-emerald-600 border-slate-200 rounded-lg focus:ring-emerald-500 cursor-pointer shrink-0"
                          checked={checked}
                          onChange={(e) => set(e.target.checked)}
                        />
                        <label htmlFor={id} className="text-sm font-bold text-slate-600 cursor-pointer leading-relaxed">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Plan & Paiement */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black mb-3 border border-emerald-100 uppercase tracking-[0.2em]">
                      <CreditCard className="w-3 h-3" />
                      Étape 4 · Plan & Paiement
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1 tracking-tight">
                      Plan & <span className="text-emerald-600">Paiement</span>
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Choisissez votre plan et mode de paiement.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {displayPlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        whileHover={{ y: -4 }}
                        onClick={() => updatePlanSelection('planId', plan.id)}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col ${
                          formData.planSelection.planId === plan.id
                            ? 'border-emerald-500 bg-white shadow-[0_50px_100px_-20px_rgba(16,185,129,0.15)]'
                            : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <h4 className="font-display font-bold text-lg text-slate-900 mb-2">{plan.name}</h4>
                        <div className="mb-4">
                          <span className="text-2xl font-display font-bold text-slate-900">
                            €
                            {formData.planSelection.billingInterval === BillingCycle.YEARLY
                              ? (plan.priceAnnual / 12).toFixed(0)
                              : plan.priceMonthly}
                          </span>
                          <span className="text-slate-400 text-sm">/mois</span>
                          {formData.planSelection.billingInterval === BillingCycle.YEARLY && (
                            <p className="text-xs text-emerald-600 mt-1">Économisez 20% avec l&apos;annuel</p>
                          )}
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1 flex-1">
                          {plan.features.map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                        <div
                          className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center mt-4 ${
                            formData.planSelection.planId === plan.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {formData.planSelection.planId === plan.id ? 'Sélectionné' : 'Sélectionner'}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Cycle de facturation</label>
                      <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.planSelection.billingInterval}
                        onChange={(e) => updatePlanSelection('billingInterval', e.target.value as BillingCycle)}
                      >
                        <option value={BillingCycle.MONTHLY}>Mensuel</option>
                        <option value={BillingCycle.YEARLY}>Annuel</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Code promo</label>
                      <input
                        type="text"
                        placeholder="WELCOME20"
                        className={inputClass}
                        value={formData.planSelection.promoCode ?? ''}
                        onChange={(e) => updatePlanSelection('promoCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Méthode de paiement</label>
                    <select
                      className={`${inputClass} appearance-none cursor-pointer`}
                      value={formData.paymentInfo.paymentMethod}
                      onChange={(e) => updatePaymentInfo('paymentMethod', e.target.value as PaymentMethod)}
                    >
                      <option value={PaymentMethod.CREDIT_CARD}>Carte de crédit</option>
                      <option value={PaymentMethod.DEBIT_CARD}>Carte de débit</option>
                      <option value={PaymentMethod.BANK_TRANSFER}>Virement bancaire</option>
                      <option value={PaymentMethod.PAYPAL}>PayPal</option>
                    </select>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-emerald-600 text-white flex items-center justify-between shadow-2xl shadow-emerald-600/20">
                    <div>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em] mb-1">
                        Résumé
                      </p>
                      <p className="text-2xl font-display font-bold">
                        {displayPlans.find((p) => p.id === formData.planSelection.planId)?.name} • €
                        {calculatePrice().toFixed(2)}/mois
                      </p>
                      <p className="text-sm text-emerald-200 mt-1">
                        La période d&apos;essai est appliquée automatiquement selon le plan sélectionné.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-display font-bold">€0.00</p>
                      <p className="text-[10px] font-black text-emerald-200 uppercase">aujourd&apos;hui</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 group"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Retour
                  </button>
                ) : (
                  <p className="text-sm text-slate-500">
                    Déjà un compte ?{' '}
                    <Link
                      href="/auth/login"
                      className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Connexion
                    </Link>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    (step < totalSteps && !validateStep(step)) ||
                    (step === totalSteps && (!validateStep(4) || createTenant.isPending))
                  }
                  className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xl shadow-slate-900/15 group"
                >
                  {createTenant.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création…
                    </>
                  ) : (
                    <>
                      {step === totalSteps ? 'Créer mon compte' : 'Continuer'}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </form>
        </div>
    </AuthShell>
  );
}
