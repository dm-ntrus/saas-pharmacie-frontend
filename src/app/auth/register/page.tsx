'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  CreditCard,
  Loader2,
  Building2,
  Shield,
  Sparkles,
  Info,
  Landmark,
  Banknote,
  Wallet,
  FileText,
  Plus,
  X,
  Pill,
  Copy
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { Link, useRouter } from '@/i18n/navigation';
import { useCreateTenant } from '@/hooks/useTenants';
import {
  TenantType,
  BillingCycle,
  PaymentMethod,
  PharmacyType,
  type CreateTenantDto,
} from '@/types/tenant.types';
import { toast } from 'react-hot-toast';
import {
  normalizeTenantSubdomain,
  validateTenantSubdomainFormat,
} from '@/lib/tenant/subdomain-rules';
import { usePublicPlans } from '@/hooks/api/usePublicPlans';
import type { Plan } from '@/types/billing';
import CountrySelect from '@/components/form/CountrySelect';
import PhoneInput from '@/components/form/PhoneInput';
import { getTimezonesByCountry, getCurrencyByCountry } from '@/lib/countries';
import type { Country } from 'react-phone-number-input';

/* ────────────────── Plan helpers ────────────────── */

const TIER_ORDER: Record<string, number> = { free: 0, starter: 1, professional: 2, enterprise: 3, custom: 4 };

interface TierGroup {
  tier: string;
  name: string;
  description: string;
  monthly?: Plan;
  yearly?: Plan;
  features: string[];
  maxUsers: number;
  maxPharmacies: number;
  trialAvailable: boolean;
  currency: string;
}

function extractPlanFeatures(plan: Plan): string[] {
  const items: string[] = [];
  if (plan.max_users === -1) items.push('Utilisateurs illimités');
  else if (plan.max_users) items.push(`${plan.max_users} utilisateurs`);
  if (plan.max_pharmacies && plan.max_pharmacies > 1)
    items.push(plan.max_pharmacies === -1 ? 'Multi-sites illimités' : `${plan.max_pharmacies} sites`);
  if (plan.is_trial_available) items.push('Essai gratuit');
  if (plan.feature_flags?.length) {
    for (const ff of plan.feature_flags.slice(0, 4)) {
      if (ff.is_included && ff.feature_name) items.push(ff.feature_name);
    }
  }
  if (items.length < 2) items.push('Support inclus');
  return items.slice(0, 6);
}

function groupPlansByTier(plans: Plan[]): TierGroup[] {
  const tiers = new Map<string, TierGroup>();

  for (const p of plans) {
    const tier = p.plan_tier || 'other';
    if (!tiers.has(tier)) {
      tiers.set(tier, {
        tier,
        name: p.name.replace(/\s*\(.*\)/, ''),
        description: p.description || '',
        features: extractPlanFeatures(p),
        maxUsers: p.max_users ?? 1,
        maxPharmacies: p.max_pharmacies ?? 1,
        trialAvailable: p.is_trial_available ?? false,
        currency: p.currency || 'USD',
      });
    }
    const group = tiers.get(tier)!;
    if (p.billing_interval === 'monthly') group.monthly = p;
    else if (p.billing_interval === 'yearly') group.yearly = p;
    if (p.max_users && p.max_users > group.maxUsers) group.maxUsers = p.max_users;
    if (p.feature_flags?.length && extractPlanFeatures(p).length > group.features.length) {
      group.features = extractPlanFeatures(p);
    }
  }

  return Array.from(tiers.values())
    .filter((g) => g.monthly || g.yearly)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99));
}

const PHARMACY_TYPE_OPTIONS: { value: PharmacyType; label: string; group: string }[] = [
  { value: PharmacyType.COMMUNITY, label: 'Pharmacie communautaire (officine)', group: 'Officines de ville' },
  { value: PharmacyType.INDEPENDENT, label: 'Pharmacie indépendante', group: 'Officines de ville' },
  { value: PharmacyType.CHAIN, label: 'Pharmacie de chaîne', group: 'Officines de ville' },
  { value: PharmacyType.FRANCHISE, label: 'Pharmacie franchisée', group: 'Officines de ville' },
  { value: PharmacyType.COOPERATIVE, label: 'Pharmacie coopérative', group: 'Officines de ville' },
  { value: PharmacyType.RURAL, label: 'Pharmacie rurale', group: 'Officines de ville' },
  { value: PharmacyType.URBAN, label: 'Pharmacie urbaine', group: 'Officines de ville' },
  { value: PharmacyType.PARAPHARMACY, label: 'Parapharmacie', group: 'Grande distribution' },
  { value: PharmacyType.SUPERMARKET, label: 'Pharmacie de supermarché', group: 'Grande distribution' },
  { value: PharmacyType.HOSPITAL, label: 'Pharmacie hospitalière', group: 'Hospitalier & clinique' },
  { value: PharmacyType.CLINIC, label: 'Pharmacie de clinique', group: 'Hospitalier & clinique' },
  { value: PharmacyType.POLYCLINIC, label: 'Pharmacie de polyclinique', group: 'Hospitalier & clinique' },
  { value: PharmacyType.UNIVERSITY_HOSPITAL, label: 'Pharmacie de CHU', group: 'Hospitalier & clinique' },
  { value: PharmacyType.COMPOUNDING, label: 'Pharmacie de préparation (magistrale)', group: 'Spécialisées' },
  { value: PharmacyType.HOMEOPATHIC, label: 'Pharmacie homéopathique', group: 'Spécialisées' },
  { value: PharmacyType.HERBAL, label: 'Herboristerie / phytothérapie', group: 'Spécialisées' },
  { value: PharmacyType.VETERINARY, label: 'Pharmacie vétérinaire', group: 'Spécialisées' },
  { value: PharmacyType.ONCOLOGY, label: 'Pharmacie oncologique', group: 'Spécialisées' },
  { value: PharmacyType.PEDIATRIC, label: 'Pharmacie pédiatrique', group: 'Spécialisées' },
  { value: PharmacyType.GERIATRIC, label: 'Pharmacie gériatrique', group: 'Spécialisées' },
  { value: PharmacyType.OPHTHALMIC, label: 'Pharmacie ophtalmique', group: 'Spécialisées' },
  { value: PharmacyType.DERMATOLOGY, label: 'Pharmacie dermatologique', group: 'Spécialisées' },
  { value: PharmacyType.NUCLEAR, label: 'Pharmacie nucléaire', group: 'Spécialisées' },
  { value: PharmacyType.INFUSION, label: 'Pharmacie de perfusion', group: 'Spécialisées' },
  { value: PharmacyType.WHOLESALE, label: 'Grossiste / répartiteur', group: 'Distribution' },
  { value: PharmacyType.CENTRAL_PURCHASING, label: "Centrale d'achat", group: 'Distribution' },
  { value: PharmacyType.DISTRIBUTOR, label: 'Distributeur pharmaceutique', group: 'Distribution' },
  { value: PharmacyType.ONLINE, label: 'Pharmacie en ligne', group: 'En ligne' },
  { value: PharmacyType.MAIL_ORDER, label: 'Pharmacie par correspondance', group: 'En ligne' },
  { value: PharmacyType.TELEPHARMACY, label: 'Télépharmacie', group: 'En ligne' },
  { value: PharmacyType.MILITARY, label: 'Pharmacie militaire', group: 'Institutionnelles' },
  { value: PharmacyType.PRISON, label: 'Pharmacie pénitentiaire', group: 'Institutionnelles' },
  { value: PharmacyType.GOVERNMENT, label: 'Pharmacie gouvernementale', group: 'Institutionnelles' },
  { value: PharmacyType.NGO_HUMANITARIAN, label: 'ONG / humanitaire', group: 'Institutionnelles' },
  { value: PharmacyType.INDUSTRIAL, label: 'Pharmacie industrielle', group: 'Industrie & recherche' },
  { value: PharmacyType.RESEARCH, label: 'Pharmacie de recherche', group: 'Industrie & recherche' },
  { value: PharmacyType.TEACHING, label: "Pharmacie d'enseignement", group: 'Industrie & recherche' },
  { value: PharmacyType.LONG_TERM_CARE, label: 'Soins de longue durée (EHPAD)', group: 'Soins continus' },
  { value: PharmacyType.HOME_HEALTH, label: 'Soins à domicile (HAD)', group: 'Soins continus' },
  { value: PharmacyType.ON_CALL, label: 'Pharmacie de garde', group: 'Garde & urgences' },
  { value: PharmacyType.EMERGENCY, label: "Pharmacie d'urgence", group: 'Garde & urgences' },
  { value: PharmacyType.OTHER, label: 'Autre', group: 'Autre' },
];
const PHARMACY_TYPE_GROUPS = [...new Set(PHARMACY_TYPE_OPTIONS.map((o) => o.group))];

const PAYMENT_METHOD_META: Record<string, { icon: typeof CreditCard; label: string; desc: string; providerCode: string }> = {
  [PaymentMethod.CREDIT_CARD]: { icon: CreditCard, label: 'Carte de crédit', desc: 'Visa, Mastercard — paiement sécurisé via Stripe', providerCode: 'stripe' },
  [PaymentMethod.DEBIT_CARD]: { icon: CreditCard, label: 'Carte de débit', desc: 'Paiement direct depuis votre compte bancaire', providerCode: 'stripe' },
  [PaymentMethod.STRIPE]: { icon: Wallet, label: 'Stripe', desc: 'Paiement sécurisé via la plateforme Stripe', providerCode: 'stripe' },
  [PaymentMethod.BANK_TRANSFER]: { icon: Landmark, label: 'Virement bancaire', desc: 'Transfert depuis votre banque — activation sous 48h', providerCode: 'bank_transfer' },
  [PaymentMethod.PAYPAL]: { icon: Wallet, label: 'PayPal', desc: 'Paiement via votre compte PayPal', providerCode: 'paypal' },
  [PaymentMethod.CASH]: { icon: Banknote, label: 'Espèces', desc: 'Paiement en personne — contactez notre équipe', providerCode: 'cash' },
};

const IDENTITY_DOC_TYPES = [
  { value: 'ID_CARD', label: "Carte d'identité nationale" },
  { value: 'PASSPORT', label: 'Passeport' },
  { value: 'DRIVING_LICENSE', label: 'Permis de conduire' },
  { value: 'RESIDENCE_PERMIT', label: 'Titre de séjour' },
  { value: 'PROFESSIONAL_LICENSE', label: 'Carte professionnelle' },
];

const STEP_META = [
  { icon: Building2, label: 'Entreprise', color: 'emerald' },
  { icon: Pill, label: 'Pharmacie', color: 'blue' },
  { icon: User, label: 'Administrateur', color: 'violet' },
  { icon: CreditCard, label: 'Plan & paiement', color: 'amber' },
] as const;

const DEFAULT_LOCALIZATION = { timezone: 'Africa/Kinshasa', currency: 'CDF', language: 'fr', dateFormat: 'DD/MM/YYYY' };

const initialFormData: CreateTenantDto = {
  tenantData: {
    name: '',
    subdomain: '',
    companyName: '',
    contact: { email: '', phone: '' },
    address: { street: '', city: '', postalCode: '', state: '', country: 'CD' },
    website: '',
    licenseNumber: '',
    taxId: '',
    customDomain: '',
    localization: { ...DEFAULT_LOCALIZATION },
    tenantType: TenantType.SINGLE_PHARMACY,
  },
  ownerData: {
    email: '', firstName: '', lastName: '', phone: '',
    enable2FA: false, acceptTerms: false, acceptPrivacyPolicy: false, acceptDataProcessing: false, acceptMarketing: false,
    dateOfBirth: '', placeOfBirth: '', nationality: '', profession: '',
    identityDocumentType: '', identityNumber: '', professionalLicenseNumber: '',
  },
  planSelection: { planId: '', billingInterval: BillingCycle.MONTHLY },
  paymentInfo: { paymentMethod: PaymentMethod.CREDIT_CARD, paymentProviderCode: 'stripe' },
  pharmacyData: {
    licenseNumber: '', name: '', address: '', city: '', state: '', postalCode: '', country: 'CD',
    phone: '', email: '', website: '',
    pharmacistInCharge: '', pharmacistLicenseNumber: '', licenseExpiryDate: '',
    services: [], certifications: [],
  },
};

/* ────────────────── Tag Input ────────────────── */

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) { onChange([...value, trimmed]); setInput(''); }
  };
  return (
    <div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl text-slate-800 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white text-sm" />
        <button type="button" onClick={add} className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────── Main ────────────────── */

export default function RegisterPage() {
  return <Suspense><RegisterInner /></Suspense>;
}

function RegisterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const createTenant = useCreateTenant();
  const { data: apiPlans, isLoading: plansLoading, isError: plansError, refetch: refetchPlans } = usePublicPlans({ active: true });

  const tierGroups = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return [];
    return groupPlansByTier(apiPlans);
  }, [apiPlans]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateTenantDto>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showKyc, setShowKyc] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);

  useEffect(() => {
    const planParam = searchParams?.get('plan');
    if (planParam && tierGroups.length > 0) {
      const match = tierGroups.find((g) => g.tier === planParam || g.monthly?.plan_key === planParam || g.yearly?.plan_key === planParam);
      if (match) {
        const interval = formData.planSelection.billingInterval === BillingCycle.YEARLY ? 'yearly' : 'monthly';
        const target = interval === 'yearly' ? (match.yearly ?? match.monthly) : (match.monthly ?? match.yearly);
        if (target) setFormData((prev) => ({ ...prev, planSelection: { ...prev.planSelection, planId: target.plan_key } }));
      }
    }
  }, [searchParams, tierGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSteps = 4;
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateTenantData = useCallback(<K extends keyof CreateTenantDto['tenantData']>(field: K, value: CreateTenantDto['tenantData'][K]) => {
    setFormData((prev) => ({ ...prev, tenantData: { ...prev.tenantData, [field]: value } }));
  }, []);
  const updateOwnerData = useCallback(<K extends keyof CreateTenantDto['ownerData']>(field: K, value: CreateTenantDto['ownerData'][K]) => {
    setFormData((prev) => ({ ...prev, ownerData: { ...prev.ownerData, [field]: value } }));
  }, []);
  const updatePlanSelection = useCallback(<K extends keyof CreateTenantDto['planSelection']>(field: K, value: CreateTenantDto['planSelection'][K]) => {
    setFormData((prev) => ({ ...prev, planSelection: { ...prev.planSelection, [field]: value } }));
  }, []);
  const updatePharmacyData = useCallback(<K extends keyof CreateTenantDto['pharmacyData']>(field: K, value: CreateTenantDto['pharmacyData'][K]) => {
    setFormData((prev) => ({ ...prev, pharmacyData: { ...prev.pharmacyData, [field]: value } }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    const meta = PAYMENT_METHOD_META[method];
    setFormData((prev) => ({ ...prev, paymentInfo: { ...prev.paymentInfo, paymentMethod: method, paymentProviderCode: meta?.providerCode ?? 'stripe' } }));
  }, []);

  const copyTenantAddressToPharmacy = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      pharmacyData: {
        ...prev.pharmacyData,
        address: prev.tenantData.address?.street ?? '',
        city: prev.tenantData.address?.city ?? '',
        state: prev.tenantData.address?.state || prev.pharmacyData.state || '',
        postalCode: prev.tenantData.address?.postalCode ?? '',
        country: prev.tenantData.address?.country ?? 'CD',
        phone: prev.pharmacyData.phone || prev.tenantData.contact.phone || '',
        email: prev.pharmacyData.email || prev.tenantData.contact.email || '',
      },
    }));
  }, []);

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 1: return !!(
        formData.tenantData.name && formData.tenantData.subdomain &&
        formData.tenantData.contact.email &&
        formData.tenantData.address?.street && formData.tenantData.address?.city &&
        formData.tenantData.address?.postalCode && formData.tenantData.address?.country
      );
      case 2: return !!(
        formData.pharmacyData.name && formData.pharmacyData.pharmacistInCharge &&
        formData.pharmacyData.pharmacistLicenseNumber && formData.pharmacyData.phone &&
        formData.pharmacyData.licenseNumber &&
        formData.pharmacyData.address && formData.pharmacyData.city &&
        formData.pharmacyData.state && formData.pharmacyData.postalCode &&
        formData.pharmacyData.country
      );
      case 3: return !!(
        formData.ownerData.firstName && formData.ownerData.lastName && formData.ownerData.email &&
        formData.ownerData.acceptTerms && formData.ownerData.acceptPrivacyPolicy && formData.ownerData.acceptDataProcessing
      );
      case 4: return !!formData.planSelection.planId;
      default: return false;
    }
  };

  const selectedPlan = useMemo(() => {
    if (!apiPlans) return undefined;
    return apiPlans.find((p) => p.plan_key === formData.planSelection.planId || p.id === formData.planSelection.planId);
  }, [apiPlans, formData.planSelection.planId]);

  const selectedTierGroup = useMemo(() => {
    if (!selectedPlan) return tierGroups[0];
    return tierGroups.find((g) => g.tier === selectedPlan.plan_tier);
  }, [selectedPlan, tierGroups]);

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    if (selectedPlan.billing_interval === 'yearly') return selectedPlan.price / 12;
    return selectedPlan.price || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      if (step === 1) {
        const normalized = normalizeTenantSubdomain(formData.tenantData.subdomain);
        const subErr = validateTenantSubdomainFormat(normalized);
        if (subErr) { toast.error(subErr); return; }
        if (!validateStep(1)) { toast.error('Merci de remplir tous les champs obligatoires.'); return; }
        updateTenantData('subdomain', normalized);
        if (sameAddress) copyTenantAddressToPharmacy();
      } else if (!validateStep(step)) {
        toast.error('Merci de remplir tous les champs obligatoires.');
        return;
      }
      nextStep();
      return;
    }
    if (!validateStep(4)) return;
    const normalizedSub = normalizeTenantSubdomain(formData.tenantData.subdomain);
    const finalSubErr = validateTenantSubdomainFormat(normalizedSub);
    if (finalSubErr) { toast.error(finalSubErr); return; }

    const finalPharmacy = { ...formData.pharmacyData };
    if (sameAddress) {
      finalPharmacy.address = formData.tenantData.address?.street ?? finalPharmacy.address;
      finalPharmacy.city = formData.tenantData.address?.city ?? finalPharmacy.city;
      finalPharmacy.state = formData.tenantData.address?.state ?? finalPharmacy.state;
      finalPharmacy.postalCode = formData.tenantData.address?.postalCode ?? finalPharmacy.postalCode;
      finalPharmacy.country = formData.tenantData.address?.country ?? finalPharmacy.country;
    }

    const payload: CreateTenantDto = {
      tenantData: { ...formData.tenantData, subdomain: normalizedSub },
      ownerData: formData.ownerData,
      planSelection: formData.planSelection,
      paymentInfo: formData.paymentInfo,
      pharmacyData: finalPharmacy,
    };
    try {
      const res = await createTenant.mutateAsync(payload);
      const subQ = encodeURIComponent(normalizedSub);
      if ('provisioningId' in res && res.provisioningId) {
        router.push(`/auth/registration-success?provisioningId=${encodeURIComponent(res.provisioningId)}&subdomain=${subQ}`);
        return;
      }
      if ('tenantId' in res && res.tenantId) {
        const syncSub = 'subdomain' in res && typeof (res as { subdomain?: string }).subdomain === 'string'
          ? encodeURIComponent((res as { subdomain?: string }).subdomain!.trim().toLowerCase()) : subQ;
        router.push(`/auth/registration-success?subdomain=${syncSub}`);
        return;
      }
      router.push(`/auth/registration-success?subdomain=${subQ}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Inscription impossible pour le moment.");
    }
  };

  /* ── Styling helpers ── */
  const inputBase = 'w-full px-4 py-3 rounded-xl text-slate-800 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white placeholder:text-slate-400 transition-all text-sm';
  const inputError = 'w-full px-4 py-3 rounded-xl text-slate-800 border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none bg-red-50/30 placeholder:text-slate-400 transition-all text-sm';
  const getInputClass = (field: string, isValid: boolean) => (!touched[field] ? inputBase : isValid ? inputBase : inputError);
  const selectClass = `${inputBase} appearance-none cursor-pointer`;

  const Lbl = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className="text-xs font-medium text-slate-600">{children}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
  );
  const OptTag = () => <span className="text-slate-400 ml-1 font-normal">— optionnel</span>;

  const tenantAddr = formData.tenantData.address;
  const tenantCountry = tenantAddr?.country ?? 'CD';

  return (
    <AuthShell testimonial={{ quote: "La technologie au service de la santé. SyntixPharma redéfinit l'excellence opérationnelle en officine.", name: "Dr. David Luvuezo", title: "Pharmacie de l'Espoir" }}>
      <div className="space-y-4">
        {/* Stepper */}
        <div className="flex items-center gap-1.5">
          {STEP_META.map((meta, i) => {
            const s = i + 1;
            const Icon = meta.icon;
            const isActive = step === s;
            const isDone = step > s;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button type="button" onClick={() => { if (isDone) setStep(s); }} disabled={!isDone}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : isDone ? 'bg-emerald-50/50 text-emerald-600 cursor-pointer hover:bg-emerald-50' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden sm:inline">{meta.label}</span>
                </button>
                {s < totalSteps && <div className={`flex-1 h-px mx-2 ${isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
              </div>
            );
          })}
        </div>

        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-1.5">

              {/* ═══════════════════════════════════════════
                  Step 1 — ENTREPRISE / SIÈGE (TenantDataDto)
                  ═══════════════════════════════════════════ */}
              {step === 1 && (
                <div className="space-y-2.5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Votre <span className="text-emerald-600">entreprise</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Informations sur l&apos;entité légale qui exploite la pharmacie (siège social).</p>
                  </div>

                  {/* Identity */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>Nom de l&apos;entreprise</Lbl>
                      <input type="text" required placeholder="ex. Pharmacie Centrale" className={getInputClass('name', !!formData.tenantData.name)} value={formData.tenantData.name} onBlur={() => markTouched('name')} onChange={(e) => updateTenantData('name', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl required>Sous-domaine</Lbl>
                      <div className="flex items-center gap-2">
                        <input type="text" required placeholder="pharmacie-centrale" className={getInputClass('subdomain', !!formData.tenantData.subdomain)} value={formData.tenantData.subdomain} onBlur={() => markTouched('subdomain')} onChange={(e) => updateTenantData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
                        <span className="text-xs text-slate-400 whitespace-nowrap">.{process.env.NEXT_PUBLIC_MAIN_DOMAIN || "syntixpharma.com"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl>Raison sociale<OptTag /></Lbl>
                      <input type="text" placeholder="ex. Pharmacie Centrale SARL" className={inputBase} value={formData.tenantData.companyName ?? ''} onChange={(e) => updateTenantData('companyName', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl>Type d&apos;organisation</Lbl>
                      <select className={selectClass} value={formData.tenantData.tenantType} onChange={(e) => updateTenantData('tenantType', e.target.value as TenantType)}>
                        <option value={TenantType.SINGLE_PHARMACY}>Pharmacie individuelle</option>
                        <option value={TenantType.PHARMACY_CHAIN}>Chaîne de pharmacies</option>
                        <option value={TenantType.HOSPITAL_NETWORK}>Réseau hospitalier</option>
                        <option value={TenantType.CLINIC_CHAIN}>Chaîne de cliniques</option>
                        <option value={TenantType.ENTERPRISE}>Entreprise</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="border-t border-slate-100 pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Contact du siège</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Lbl required>Email</Lbl>
                        <input type="email" required placeholder="contact@pharmacie.com" className={getInputClass('contactEmail', !!formData.tenantData.contact.email)} value={formData.tenantData.contact.email} onBlur={() => markTouched('contactEmail')} onChange={(e) => updateTenantData('contact', { ...formData.tenantData.contact, email: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Lbl>Téléphone<OptTag /></Lbl>
                        <PhoneInput value={formData.tenantData.contact.phone ?? ''} onChange={(val) => updateTenantData('contact', { ...formData.tenantData.contact, phone: val })} defaultCountry={tenantCountry as Country} />
                      </div>
                    </div>
                  </div>

                  {/* Legal */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl>N° de licence (entreprise)<OptTag /></Lbl>
                      <input type="text" placeholder="ex. RP-2024-12345678" className={inputBase} value={formData.tenantData.licenseNumber ?? ''} onChange={(e) => updateTenantData('licenseNumber', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl>Numéro TVA<OptTag /></Lbl>
                      <input type="text" placeholder="ex. FR12345678901" className={inputBase} value={formData.tenantData.taxId ?? ''} onChange={(e) => updateTenantData('taxId', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl>Site web<OptTag /></Lbl>
                      <input type="url" placeholder="https://www.pharmacie.com" className={inputBase} value={formData.tenantData.website ?? ''} onChange={(e) => updateTenantData('website', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl>Domaine personnalisé<OptTag /></Lbl>
                      <input type="text" placeholder="ex. pharmacie.mondomaine.com" className={inputBase} value={formData.tenantData.customDomain ?? ''} onChange={(e) => updateTenantData('customDomain', e.target.value)} />
                    </div>
                  </div>

                  {/* Tenant address (siège) */}
                  <div className="border-t border-slate-100 pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Adresse du siège</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Lbl required>Rue / adresse</Lbl>
                        <input type="text" required placeholder="ex. 123 Avenue de la Paix" className={getInputClass('street', !!tenantAddr?.street)} value={tenantAddr?.street ?? ''} onBlur={() => markTouched('street')} onChange={(e) => updateTenantData('address', { ...(tenantAddr ?? {}), street: e.target.value })} />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Lbl required>Ville</Lbl>
                          <input type="text" required placeholder="ex. Kinshasa" className={getInputClass('city', !!tenantAddr?.city)} value={tenantAddr?.city ?? ''} onBlur={() => markTouched('city')} onChange={(e) => updateTenantData('address', { ...(tenantAddr ?? {}), city: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Lbl required>Code postal</Lbl>
                          <input type="text" required placeholder="ex. 75001" className={getInputClass('postalCode', !!tenantAddr?.postalCode)} value={tenantAddr?.postalCode ?? ''} onBlur={() => markTouched('postalCode')} onChange={(e) => updateTenantData('address', { ...(tenantAddr ?? {}), postalCode: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Lbl required>Pays</Lbl>
                          <CountrySelect value={tenantCountry} required onChange={(code) => {
                            updateTenantData('address', { ...(tenantAddr ?? {}), country: code });
                            const tzs = getTimezonesByCountry(code);
                            const currency = getCurrencyByCountry(code);
                            updateTenantData('localization', { ...(formData.tenantData.localization ?? DEFAULT_LOCALIZATION), timezone: tzs[0], currency });
                          }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Lbl>Région / état<OptTag /></Lbl>
                        <input type="text" placeholder="ex. Kinshasa" className={inputBase} value={tenantAddr?.state ?? ''} onChange={(e) => updateTenantData('address', { ...(tenantAddr ?? {}), state: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Localization */}
                  <div className="border-t border-slate-100 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-900">Paramètres régionaux</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Lbl>Fuseau horaire</Lbl>
                        <select className={selectClass} value={formData.tenantData.localization?.timezone ?? 'Africa/Kinshasa'} onChange={(e) => updateTenantData('localization', { ...(formData.tenantData.localization ?? DEFAULT_LOCALIZATION), timezone: e.target.value })}>
                          {getTimezonesByCountry(tenantCountry).map((tz) => (<option key={tz} value={tz}>{tz}</option>))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Lbl>Devise</Lbl>
                        <select className={selectClass} value={formData.tenantData.localization?.currency ?? 'CDF'} onChange={(e) => updateTenantData('localization', { ...(formData.tenantData.localization ?? DEFAULT_LOCALIZATION), currency: e.target.value })}>
                          {(() => { const auto = getCurrencyByCountry(tenantCountry); return Array.from(new Set([auto, 'USD', 'EUR', 'GBP', 'CHF', 'CAD', 'XAF', 'XOF', 'CDF'])).map((c) => (<option key={c} value={c}>{c}{c === auto ? ' (auto)' : ''}</option>)); })()}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Lbl>Langue</Lbl>
                        <select className={selectClass} value={formData.tenantData.localization?.language ?? 'fr'} onChange={(e) => updateTenantData('localization', { ...(formData.tenantData.localization ?? DEFAULT_LOCALIZATION), language: e.target.value })}>
                          <option value="fr">Français</option><option value="en">English</option><option value="de">Deutsch</option><option value="es">Español</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Lbl>Format de date</Lbl>
                        <select className={selectClass} value={formData.tenantData.localization?.dateFormat ?? 'DD/MM/YYYY'} onChange={(e) => updateTenantData('localization', { ...(formData.tenantData.localization ?? DEFAULT_LOCALIZATION), dateFormat: e.target.value })}>
                          <option value="DD/MM/YYYY">JJ/MM/AAAA</option><option value="MM/DD/YYYY">MM/JJ/AAAA</option><option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════
                  Step 2 — PHARMACIE (PharmacyDataDto)
                  ═══════════════════════════════════════════════ */}
              {step === 2 && (
                <div className="space-y-2.5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Votre <span className="text-emerald-600">pharmacie</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Informations spécifiques à l&apos;établissement pharmaceutique (point de vente).</p>
                  </div>

                  {/* Pharmacy identity */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>Nom de la pharmacie</Lbl>
                      <input type="text" required placeholder="ex. Pharmacie Centrale - Gombe" className={getInputClass('pharmaName', !!formData.pharmacyData.name)} value={formData.pharmacyData.name} onBlur={() => markTouched('pharmaName')}
                        onChange={(e) => updatePharmacyData('name', e.target.value)} />
                      {!formData.pharmacyData.name && formData.tenantData.name && (
                        <button type="button" onClick={() => updatePharmacyData('name', formData.tenantData.name)} className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Copy className="w-3 h-3" /> Reprendre le nom de l&apos;entreprise
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Lbl>Type de pharmacie<OptTag /></Lbl>
                      <select className={selectClass} value={formData.pharmacyData.pharmacyType ?? ''} onChange={(e) => updatePharmacyData('pharmacyType', (e.target.value || undefined) as PharmacyType | undefined)}>
                        <option value="">Sélectionnez un type</option>
                        {PHARMACY_TYPE_GROUPS.map((g) => (
                          <optgroup key={g} label={g}>{PHARMACY_TYPE_OPTIONS.filter((o) => o.group === g).map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}</optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pharmacist */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>Pharmacien responsable</Lbl>
                      <input type="text" required placeholder="ex. Dr. Sophie Martin" className={getInputClass('pharmacist', !!formData.pharmacyData.pharmacistInCharge)} value={formData.pharmacyData.pharmacistInCharge} onBlur={() => markTouched('pharmacist')} onChange={(e) => updatePharmacyData('pharmacistInCharge', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl required>N° licence du pharmacien</Lbl>
                      <input type="text" required placeholder="ex. PHARM-123456" className={getInputClass('pharmLicense', !!formData.pharmacyData.pharmacistLicenseNumber)} value={formData.pharmacyData.pharmacistLicenseNumber} onBlur={() => markTouched('pharmLicense')} onChange={(e) => updatePharmacyData('pharmacistLicenseNumber', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>N° licence de la pharmacie</Lbl>
                      <input type="text" required placeholder="ex. PHARM-OFF-2024-001" className={getInputClass('pharmaLicNum', !!formData.pharmacyData.licenseNumber)} value={formData.pharmacyData.licenseNumber} onBlur={() => markTouched('pharmaLicNum')} onChange={(e) => updatePharmacyData('licenseNumber', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl>Expiration de la licence<OptTag /></Lbl>
                      <input type="date" className={inputBase} value={String(formData.pharmacyData.licenseExpiryDate ?? '').slice(0, 10)} onChange={(e) => updatePharmacyData('licenseExpiryDate', e.target.value)} />
                    </div>
                  </div>

                  {/* Pharmacy address with toggle */}
                  <div className="border-t border-slate-100 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-slate-900">Adresse de la pharmacie</h3>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer" checked={sameAddress}
                          onChange={(e) => {
                            setSameAddress(e.target.checked);
                            if (e.target.checked) copyTenantAddressToPharmacy();
                          }} />
                        <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Identique au siège</span>
                      </label>
                    </div>

                    {sameAddress ? (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                          <p className="text-xs text-emerald-700 font-medium mb-2 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Adresse reprise du siège
                          </p>
                          <p className="text-sm text-slate-600">
                            {[tenantAddr?.street, tenantAddr?.postalCode, tenantAddr?.city, tenantAddr?.state, tenantAddr?.country].filter(Boolean).join(', ') || 'Aucune adresse renseignée au siège'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Lbl required>Région / état de la pharmacie</Lbl>
                          <input type="text" required placeholder="ex. Kinshasa" className={getInputClass('pharmaStateSame', !!formData.pharmacyData.state)} value={formData.pharmacyData.state} onBlur={() => markTouched('pharmaStateSame')}
                            onChange={(e) => updatePharmacyData('state', e.target.value)} />
                          <p className="text-[11px] text-slate-400">Obligatoire pour l&apos;enregistrement de la pharmacie, même si identique au siège.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Lbl required>Rue / adresse</Lbl>
                          <input type="text" required placeholder="ex. 45 Blvd du 30 Juin" className={getInputClass('pharmaStreet', !!formData.pharmacyData.address)} value={formData.pharmacyData.address} onBlur={() => markTouched('pharmaStreet')} onChange={(e) => updatePharmacyData('address', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Lbl required>Ville</Lbl>
                            <input type="text" required placeholder="ex. Kinshasa" className={getInputClass('pharmaCity', !!formData.pharmacyData.city)} value={formData.pharmacyData.city} onBlur={() => markTouched('pharmaCity')} onChange={(e) => updatePharmacyData('city', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Lbl required>Code postal</Lbl>
                            <input type="text" required placeholder="ex. 75001" className={getInputClass('pharmaPostal', !!formData.pharmacyData.postalCode)} value={formData.pharmacyData.postalCode} onBlur={() => markTouched('pharmaPostal')} onChange={(e) => updatePharmacyData('postalCode', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Lbl required>Pays</Lbl>
                            <CountrySelect value={formData.pharmacyData.country || 'CD'} required onChange={(code) => updatePharmacyData('country', code)} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Lbl required>Région / état</Lbl>
                          <input type="text" required placeholder="ex. Kinshasa" className={getInputClass('pharmaState', !!formData.pharmacyData.state)} value={formData.pharmacyData.state} onBlur={() => markTouched('pharmaState')} onChange={(e) => updatePharmacyData('state', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pharmacy contact */}
                  <div className="border-t border-slate-100 pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Contact de la pharmacie</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Lbl required>Téléphone</Lbl>
                        <PhoneInput value={formData.pharmacyData.phone} onChange={(val) => updatePharmacyData('phone', val)} defaultCountry={(formData.pharmacyData.country || tenantCountry) as Country} />
                      </div>
                      <div className="space-y-1">
                        <Lbl>Email<OptTag /></Lbl>
                        <input type="email" placeholder="pharmacie@email.com" className={inputBase} value={formData.pharmacyData.email ?? ''} onChange={(e) => updatePharmacyData('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <Lbl>Site web de la pharmacie<OptTag /></Lbl>
                      <input type="url" placeholder="https://www.pharmacie-gombe.com" className={inputBase} value={formData.pharmacyData.website ?? ''} onChange={(e) => updatePharmacyData('website', e.target.value)} />
                    </div>
                  </div>

                  {/* Services & certifications */}
                  <div className="border-t border-slate-100 pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Services & certifications</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Lbl>Services proposés<OptTag /></Lbl>
                        <TagInput value={formData.pharmacyData.services ?? []} onChange={(v) => updatePharmacyData('services', v)} placeholder="ex. Vaccination, Dépistage..." />
                      </div>
                      <div className="space-y-1">
                        <Lbl>Certifications<OptTag /></Lbl>
                        <TagInput value={formData.pharmacyData.certifications ?? []} onChange={(v) => updatePharmacyData('certifications', v)} placeholder="ex. ISO 9001, BPF..." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════
                  Step 3 — ADMINISTRATEUR (OwnerDataDto)
                  ═══════════════════════════════════════════════ */}
              {step === 3 && (
                <div className="space-y-2.5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compte <span className="text-emerald-600">administrateur</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Le compte administrateur principal qui gérera votre espace.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>Prénom</Lbl>
                      <input type="text" required placeholder="ex. Jean" className={getInputClass('firstName', !!formData.ownerData.firstName)} value={formData.ownerData.firstName} onBlur={() => markTouched('firstName')} onChange={(e) => updateOwnerData('firstName', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Lbl required>Nom</Lbl>
                      <input type="text" required placeholder="ex. Dupont" className={getInputClass('lastName', !!formData.ownerData.lastName)} value={formData.ownerData.lastName} onBlur={() => markTouched('lastName')} onChange={(e) => updateOwnerData('lastName', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Lbl required>Email</Lbl>
                      <input type="email" required placeholder="jean.dupont@email.com" className={getInputClass('ownerEmail', !!formData.ownerData.email)} value={formData.ownerData.email} onBlur={() => markTouched('ownerEmail')} onChange={(e) => updateOwnerData('email', e.target.value)} />
                      <p className="text-[11px] text-slate-400 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5 shrink-0" />Cet email sera votre identifiant de connexion.</p>
                    </div>
                    <div className="space-y-1">
                      <Lbl>Téléphone<OptTag /></Lbl>
                      <PhoneInput value={formData.ownerData.phone ?? ''} onChange={(val) => updateOwnerData('phone', val)} defaultCountry={tenantCountry as Country} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Sécurité du compte</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Un mot de passe provisoire sera généré et envoyé par e-mail. Vous devrez le changer lors de votre première connexion.</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer" checked={formData.ownerData.enable2FA ?? false} onChange={(e) => updateOwnerData('enable2FA', e.target.checked)} />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Activer l&apos;authentification à deux facteurs (2FA)</span>
                  </label>

                  {/* KYC section */}
                  <div className="border-t border-slate-100 pt-5">
                    <button type="button" onClick={() => setShowKyc(!showKyc)} className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors w-full">
                      <FileText className="w-4 h-4" />
                      Informations complémentaires (KYC)
                      <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showKyc ? 'rotate-180' : ''}`} />
                    </button>
                    <p className="text-[11px] text-slate-400 mt-1 mb-2">Ces informations permettent de vérifier votre identité. Elles peuvent être complétées plus tard.</p>

                    <AnimatePresence>
                      {showKyc && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden space-y-4">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Lbl>Date de naissance<OptTag /></Lbl>
                              <input type="date" className={inputBase} value={formData.ownerData.dateOfBirth ?? ''} onChange={(e) => updateOwnerData('dateOfBirth', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Lbl>Lieu de naissance<OptTag /></Lbl>
                              <input type="text" placeholder="ex. Kinshasa, RDC" className={inputBase} value={formData.ownerData.placeOfBirth ?? ''} onChange={(e) => updateOwnerData('placeOfBirth', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Lbl>Nationalité<OptTag /></Lbl>
                              <input type="text" placeholder="ex. Congolaise" className={inputBase} value={formData.ownerData.nationality ?? ''} onChange={(e) => updateOwnerData('nationality', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Lbl>Profession<OptTag /></Lbl>
                              <input type="text" placeholder="ex. Pharmacien" className={inputBase} value={formData.ownerData.profession ?? ''} onChange={(e) => updateOwnerData('profession', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Lbl>Type de pièce d&apos;identité<OptTag /></Lbl>
                              <select className={selectClass} value={formData.ownerData.identityDocumentType ?? ''} onChange={(e) => updateOwnerData('identityDocumentType', e.target.value)}>
                                <option value="">Sélectionnez</option>
                                {IDENTITY_DOC_TYPES.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <Lbl>N° de pièce d&apos;identité<OptTag /></Lbl>
                              <input type="text" placeholder="ex. 123456789" className={inputBase} value={formData.ownerData.identityNumber ?? ''} onChange={(e) => updateOwnerData('identityNumber', e.target.value)} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Lbl>N° licence professionnelle<OptTag /></Lbl>
                            <input type="text" placeholder="ex. PHARM123456" className={inputBase} value={formData.ownerData.professionalLicenseNumber ?? ''} onChange={(e) => updateOwnerData('professionalLicenseNumber', e.target.value)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Consents */}
                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">Consentements obligatoires</h3>
                    {([
                      { id: 'acceptTerms', checked: formData.ownerData.acceptTerms, set: (v: boolean) => updateOwnerData('acceptTerms', v), label: (<>J&apos;accepte les <Link href="/terms" className="text-emerald-600 underline underline-offset-2">conditions générales d&apos;utilisation</Link></>), req: true },
                      { id: 'acceptPrivacyPolicy', checked: formData.ownerData.acceptPrivacyPolicy, set: (v: boolean) => updateOwnerData('acceptPrivacyPolicy', v), label: (<>J&apos;accepte la <Link href="/privacy" className="text-emerald-600 underline underline-offset-2">politique de confidentialité</Link></>), req: true },
                      { id: 'acceptDataProcessing', checked: formData.ownerData.acceptDataProcessing, set: (v: boolean) => updateOwnerData('acceptDataProcessing', v), label: "J'accepte le traitement de mes données personnelles", req: true },
                      { id: 'acceptMarketing', checked: formData.ownerData.acceptMarketing ?? false, set: (v: boolean) => updateOwnerData('acceptMarketing', v), label: 'Recevoir les communications et offres promotionnelles', req: false },
                    ] as const).map(({ id, checked, set, label, req }) => (
                      <label key={id} className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" required={req} className="w-4 h-4 mt-0.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer shrink-0" checked={checked} onChange={(e) => set(e.target.checked)} />
                        <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">{label}{req && <span className="text-red-400 ml-0.5">*</span>}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════
                  Step 4 — PLAN & PAIEMENT
                  ═══════════════════════════════════════════ */}
              {step === 4 && (
                <div className="space-y-2.5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plan & <span className="text-emerald-600">paiement</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Choisissez le plan qui correspond à vos besoins.</p>
                  </div>

                  {plansLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                      <p className="text-sm text-slate-500">Chargement des plans disponibles…</p>
                    </div>
                  )}

                  {plansError && !plansLoading && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
                      <p className="text-sm font-semibold text-red-700">Impossible de charger les plans</p>
                      <p className="text-xs text-red-500">Vérifiez votre connexion et réessayez. Les plans sont gérés exclusivement depuis la base de données.</p>
                      <button
                        type="button"
                        onClick={() => void refetchPlans()}
                        className="px-4 py-2 text-xs font-bold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}

                  {!plansLoading && !plansError && tierGroups.length === 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center space-y-2">
                      <p className="text-sm font-semibold text-amber-700">Aucun plan disponible</p>
                      <p className="text-xs text-amber-500">Le catalogue de plans n&apos;a pas encore été configuré. Veuillez contacter l&apos;administrateur.</p>
                    </div>
                  )}

                  {!plansLoading && !plansError && tierGroups.length > 0 && (
                    <>
                      {/* Billing toggle */}
                      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mx-auto">
                        {[{ value: BillingCycle.MONTHLY, label: 'Mensuel' }, { value: BillingCycle.YEARLY, label: 'Annuel' }].map(({ value, label }) => {
                          const hasYearlyPlans = tierGroups.some((g) => g.yearly);
                          if (value === BillingCycle.YEARLY && !hasYearlyPlans) return null;
                          const yearlyDiscount = (() => {
                            const g = tierGroups.find((t) => t.monthly && t.yearly);
                            if (!g || !g.monthly || !g.yearly) return 0;
                            return Math.round((1 - g.yearly.price / (g.monthly.price * 12)) * 100);
                          })();
                          return (
                            <button key={value} type="button" onClick={() => {
                              updatePlanSelection('billingInterval', value);
                              const currentGroup = tierGroups.find((g) => g.monthly?.plan_key === formData.planSelection.planId || g.yearly?.plan_key === formData.planSelection.planId);
                              if (currentGroup) {
                                const target = value === BillingCycle.YEARLY ? (currentGroup.yearly ?? currentGroup.monthly) : (currentGroup.monthly ?? currentGroup.yearly);
                                if (target) updatePlanSelection('planId', target.plan_key);
                              }
                            }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formData.planSelection.billingInterval === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                              {label}
                              {value === BillingCycle.YEARLY && yearlyDiscount > 0 && <span className="ml-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">-{yearlyDiscount}%</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Plan cards — driven by DB */}
                      <div className={`grid gap-3 ${tierGroups.length <= 2 ? 'md:grid-cols-2' : tierGroups.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                        {tierGroups.map((group) => {
                          const isYearly = formData.planSelection.billingInterval === BillingCycle.YEARLY;
                          const plan = isYearly ? (group.yearly ?? group.monthly) : (group.monthly ?? group.yearly);
                          if (!plan) return null;
                          const isSelected = formData.planSelection.planId === plan.plan_key;
                          const monthlyPrice = isYearly && group.yearly ? group.yearly.price / 12 : (group.monthly?.price ?? 0);
                          const currency = plan.currency || 'USD';
                          const isFree = plan.type === 'free' || plan.price === 0;

                          return (
                            <motion.button key={group.tier} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                              onClick={() => updatePlanSelection('planId', plan.plan_key)}
                              className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col ${isSelected ? 'border-emerald-500 bg-emerald-50/30 shadow-lg shadow-emerald-500/10' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-slate-900">{group.name}</h4>
                                  {group.trialAvailable && <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Essai gratuit</span>}
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                              <div className="mb-2">
                                {isFree ? (
                                  <span className="text-2xl font-bold text-slate-900">Gratuit</span>
                                ) : (
                                  <>
                                    <span className="text-2xl font-bold text-slate-900">{Number(monthlyPrice || 0)?.toFixed(0)}</span>
                                    <span className="text-sm text-slate-500 ml-1">{currency}/mois</span>
                                  </>
                                )}
                                {isYearly && group.yearly && !isFree && (
                                  <p className="text-[11px] text-slate-400 mt-0.5">soit {Number(group?.yearly?.price || 0).toFixed(0)} {currency}/an</p>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mb-2 line-clamp-2">{group.description}</p>
                              <ul className="text-sm text-slate-600 space-y-1 flex-1">
                                {group.features.map((f, i) => (<li key={i} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}</li>))}
                              </ul>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="space-y-1">
                        <Lbl>Code promo<OptTag /></Lbl>
                        <input type="text" placeholder="ex. WELCOME20" className={inputBase} value={formData.planSelection.promoCode ?? ''} onChange={(e) => updatePlanSelection('promoCode', e.target.value)} />
                      </div>

                      {/* Payment method */}
                      <div className="space-y-3">
                        <Lbl>Méthode de paiement</Lbl>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {Object.entries(PAYMENT_METHOD_META).map(([method, meta]) => {
                            const Icon = meta.icon;
                            const isActive = formData.paymentInfo?.paymentMethod === method;
                            return (
                              <button key={method} type="button" onClick={() => setPaymentMethod(method as PaymentMethod)}
                                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${isActive ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-800'}`}>{meta.label}</p>
                                  <p className="text-[11px] text-slate-400 leading-snug">{meta.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Payment context */}
                      {formData.paymentInfo?.paymentMethod && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                          {(formData.paymentInfo.paymentMethod === PaymentMethod.CREDIT_CARD || formData.paymentInfo.paymentMethod === PaymentMethod.DEBIT_CARD || formData.paymentInfo.paymentMethod === PaymentMethod.STRIPE) && (
                            <>
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" />Paiement par carte</p>
                              <p className="text-xs text-slate-500 leading-relaxed">Vous serez redirigé vers la page de paiement sécurisée Stripe après la création de votre compte. Aucune carte n&apos;est requise pour commencer votre essai gratuit.</p>
                              <div className="space-y-1">
                                <Lbl>Identifiant Stripe existant<OptTag /></Lbl>
                                <input type="text" placeholder="ex. cus_1234567890" className={inputBase} value={formData.paymentInfo.customerId ?? ''} onChange={(e) => setFormData((prev) => ({ ...prev, paymentInfo: { ...prev.paymentInfo, customerId: e.target.value || undefined } }))} />
                              </div>
                            </>
                          )}
                          {formData.paymentInfo.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                            <>
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-600" />Virement bancaire</p>
                              <p className="text-xs text-slate-500 leading-relaxed">Après la création de votre compte, vous recevrez les coordonnées bancaires par e-mail. Votre abonnement sera activé dès réception du virement (délai de 24 à 48h).</p>
                              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                                <p className="text-xs text-amber-700 font-medium">L&apos;accès à la plateforme sera limité jusqu&apos;à confirmation du paiement.</p>
                              </div>
                            </>
                          )}
                          {formData.paymentInfo.paymentMethod === PaymentMethod.PAYPAL && (
                            <>
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-600" />PayPal</p>
                              <p className="text-xs text-slate-500 leading-relaxed">Vous serez redirigé vers PayPal pour autoriser le paiement récurrent après la création de votre compte.</p>
                            </>
                          )}
                          {formData.paymentInfo.paymentMethod === PaymentMethod.CASH && (
                            <>
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Banknote className="w-4 h-4 text-emerald-600" />Paiement en espèces</p>
                              <p className="text-xs text-slate-500 leading-relaxed">Un agent commercial vous contactera pour organiser le paiement en personne. Votre compte sera activé après confirmation.</p>
                              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-xs text-blue-700 font-medium">Disponible uniquement dans les zones couvertes par notre réseau commercial.</p>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Summary */}
                      {selectedPlan && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-emerald-200 mb-1">Récapitulatif</p>
                            <p className="text-xl font-bold">{selectedTierGroup?.name ?? selectedPlan.name} · {calculatePrice()?.toFixed(2)} {selectedPlan.currency}/mois</p>
                            {selectedTierGroup?.trialAvailable && <p className="text-sm text-emerald-200 mt-1">La période d&apos;essai est appliquée automatiquement.</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold">{selectedTierGroup?.trialAvailable ? `0 ${selectedPlan.currency}` : `${selectedPlan.price} ${selectedPlan.currency}`}</p>
                            <p className="text-xs text-emerald-200">aujourd&apos;hui</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ═══════ Navigation ═══════ */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100 gap-3">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />Retour
                  </button>
                ) : (
                  <p className="text-sm text-slate-500">Déjà un compte ? <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Connexion</Link></p>
                )}
                <button type="submit" disabled={(step < totalSteps && !validateStep(step)) || (step === totalSteps && (!validateStep(4) || createTenant.isPending))}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 group">
                  {createTenant.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" />Création en cours…</>) : (<>{step === totalSteps ? 'Créer mon compte' : 'Continuer'}<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>)}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </AuthShell>
  );
}
