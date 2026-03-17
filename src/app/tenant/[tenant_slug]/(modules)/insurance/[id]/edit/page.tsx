"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useInsuranceProviderById, useUpdateInsuranceProvider } from "@/hooks/api/useInsurance";
import type { InsuranceProvider, InsuranceProviderType, UpdateInsuranceProviderDto } from "@/types/insurance";
import { INSURANCE_PROVIDER_TYPE_LABELS } from "@/types/insurance";
import { Button, Card, CardContent, Input, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const TYPES: InsuranceProviderType[] = ["private", "public", "ngo", "mutual", "corporate"];

export default function EditInsurancePage() {
  return (
    <ModuleGuard module="insurance" requiredPermissions={[Permission.INSURANCE_PROVIDERS_UPDATE]}>
      <EditInsuranceContent />
    </ModuleGuard>
  );
}

function EditInsuranceContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { data: provider, isLoading, error, refetch } = useInsuranceProviderById(id);
  const updateMutation = useUpdateInsuranceProvider();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<InsuranceProviderType>("private");
  const [defaultCoveragePercent, setDefaultCoveragePercent] = useState(80);
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (provider) {
      const p = provider as InsuranceProvider;
      setName(p.name ?? "");
      setCode(p.code ?? "");
      setType(p.type ?? "private");
      setDefaultCoveragePercent(p.default_coverage_percent ?? 80);
      setContactPerson(p.contact_person ?? "");
      setPhoneNumber(p.phone_number ?? "");
      setEmail(p.email ?? "");
      setAddress(p.address ?? "");
      setNotes(p.notes ?? "");
    }
  }, [provider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortId = provider && typeof (provider as InsuranceProvider).id === "string" && (provider as InsuranceProvider).id.includes(":") ? (provider as InsuranceProvider).id.split(":")[1] : id;
    const dto: UpdateInsuranceProviderDto = { name, code, type, defaultCoveragePercent, contactPerson: contactPerson || undefined, phoneNumber: phoneNumber || undefined, email: email || undefined, address: address || undefined, notes: notes || undefined };
    updateMutation.mutate({ id: shortId ?? id, dto }, { onSuccess: () => router.push(buildPath(`/insurance/${id}`)) });
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !provider) return <ErrorBanner message="Assureur introuvable" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath(`/insurance/${id}`))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Modifier l&apos;assureur</h1>
          <p className="text-sm text-slate-500">{code}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input label="Nom *" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Code *" value={code} onChange={(e) => setCode(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as InsuranceProviderType)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                {TYPES.map((t) => (
                  <option key={t} value={t}>{INSURANCE_PROVIDER_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <Input label="Couverture %" type="number" min={0} max={100} value={String(defaultCoveragePercent)} onChange={(e) => setDefaultCoveragePercent(Number(e.target.value))} />
            <Input label="Contact" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            <Input label="Téléphone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(buildPath(`/insurance/${id}`))}>Annuler</Button>
          <Button type="submit" disabled={updateMutation.isPending}>Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}
