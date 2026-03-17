"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCreateInsuranceProvider } from "@/hooks/api/useInsurance";
import type { CreateInsuranceProviderDto, InsuranceProviderType } from "@/types/insurance";
import { INSURANCE_PROVIDER_TYPE_LABELS } from "@/types/insurance";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const TYPES: InsuranceProviderType[] = ["private", "public", "ngo", "mutual", "corporate"];

export default function NewInsurancePage() {
  return (
    <ModuleGuard module="insurance" requiredPermissions={[Permission.INSURANCE_PROVIDERS_CREATE]}>
      <NewInsuranceContent />
    </ModuleGuard>
  );
}

function NewInsuranceContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createMutation = useCreateInsuranceProvider();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<InsuranceProviderType>("private");
  const [defaultCoveragePercent, setDefaultCoveragePercent] = useState(80);
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    const dto: CreateInsuranceProviderDto = {
      name: name.trim(),
      code: code.trim(),
      type,
      defaultCoveragePercent,
      contactPerson: contactPerson || undefined,
      phoneNumber: phoneNumber || undefined,
      email: email || undefined,
      address: address || undefined,
      notes: notes || undefined,
      coverageTypes: ["medication"],
      paymentTermsDays: 30,
      requiresPolicyNumber: true,
      requiresMemberCard: true,
    };
    createMutation.mutate(dto, {
      onSuccess: (data: { id?: string }) => {
        const id = data?.id?.replace?.("insurance_providers:", "") ?? data?.id;
        if (id) router.push(buildPath(`/insurance/${id}`));
        else router.push(buildPath("/insurance"));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/insurance"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau provider</h1>
          <p className="text-sm text-slate-500">Assureur / mutuelle</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input label="Nom *" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Code *" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ex: MFP" required />
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
          <Button type="button" variant="outline" onClick={() => router.push(buildPath("/insurance"))}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending || !name.trim() || !code.trim()}>{createMutation.isPending ? "Création..." : "Créer"}</Button>
        </div>
      </form>
    </div>
  );
}
