"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useInventoryPolicies, useCreateInventoryPolicy } from "@/hooks/api/useSupplyChain";
import { Card, CardContent, Button, Input, Modal, Select, Skeleton, EmptyState, ErrorBanner, Badge } from "@/components/ui";
import { formatNumber } from "@/utils/formatters";
import { ArrowLeft, Plus, Package, Search } from "lucide-react";

const policySchema = z.object({ product_name: z.string().min(2, "Produit requis"), reorder_point: z.string().min(1, "Point requis"), safety_stock: z.string().min(1, "Stock sécurité requis"), eoq: z.string().optional(), lead_time_days: z.string().optional(), review_period: z.string().optional() });
type PolicyFormData = z.infer<typeof policySchema>;

export default function SupplyChainPoliciesPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.INVENTORY_POLICIES_READ]}>
      <PoliciesContent />
    </ModuleGuard>
  );
}

function PoliciesContent() {
  const path = useTenantPath();
  const { data: policiesData, isLoading, error, refetch } = useInventoryPolicies();
  const createPolicy = useCreateInventoryPolicy();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const raw = policiesData?.data ?? policiesData;
  const policies = Array.isArray(raw) ? raw : [];
  const filtered = useMemo(() => { if (!search.trim()) return policies; const s = search.toLowerCase(); return policies.filter((p: Record<string, unknown>) => String(p.product_name ?? "").toLowerCase().includes(s)); }, [policies, search]);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PolicyFormData>({ resolver: zodResolver(policySchema), defaultValues: { product_name: "", reorder_point: "", safety_stock: "", eoq: "", lead_time_days: "", review_period: "weekly" } });
  const onSubmit = (data: PolicyFormData) => {
    createPolicy.mutate({ ...data, reorder_point: parseInt(data.reorder_point, 10), safety_stock: parseInt(data.safety_stock, 10), eoq: data.eoq ? parseInt(data.eoq, 10) : undefined, lead_time_days: data.lead_time_days ? parseInt(data.lead_time_days, 10) : undefined } as unknown as Record<string, unknown>, { onSuccess: () => { setCreateOpen(false); reset(); } });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href={path("/supply-chain")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Politiques d&apos;inventaire</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Points de réapprovisionnement et stock de sécurité</p></div>
        </div>
        <ProtectedAction permission={Permission.INVENTORY_POLICIES_CREATE}><Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Nouvelle politique</Button></ProtectedAction>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3"><Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} className="max-w-md" /></div>
      {isLoading ? <Skeleton className="h-48 w-full" /> : error ? <ErrorBanner title="Erreur" message="Impossible de charger les politiques" onRetry={() => refetch()} /> : filtered.length === 0 ? <EmptyState icon={<Package className="w-8 h-8 text-slate-400" />} title="Aucune politique" description={search ? "Aucun résultat." : "Définissez des politiques de réapprovisionnement."} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((policy: Record<string, unknown>) => (
            <Card key={String(policy.id)} className="hover:shadow-md transition-shadow"><CardContent className="p-4">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Package className="w-4 h-4 text-blue-600" /></div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{String(policy.product_name ?? "Produit")}</p></div><Badge variant={policy.is_active !== false ? "success" : "default"} size="sm">{policy.is_active !== false ? "Actif" : "Inactif"}</Badge></div>
              <div className="grid grid-cols-3 gap-3 text-xs"><div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800"><p className="text-slate-400">Point réappro</p><p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(Number(policy.reorder_point ?? 0))}</p></div><div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800"><p className="text-slate-400">Stock sécurité</p><p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatNumber(Number(policy.safety_stock ?? 0))}</p></div><div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800"><p className="text-slate-400">QEO</p><p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{policy.eoq != null ? formatNumber(Number(policy.eoq)) : "—"}</p></div></div>
              {(policy.lead_time_days != null || policy.review_period) && <p className="text-xs text-slate-500 mt-2">Délai: {policy.lead_time_days != null ? `${policy.lead_time_days} j` : "—"} • Révision: {String(policy.review_period ?? "—")}</p>}
            </CardContent></Card>
          ))}
        </div>
      )}
      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle politique" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Produit" {...register("product_name")} error={errors.product_name?.message} />
          <div className="grid grid-cols-2 gap-4"><Input label="Point de réappro" type="number" {...register("reorder_point")} error={errors.reorder_point?.message} /><Input label="Stock de sécurité" type="number" {...register("safety_stock")} error={errors.safety_stock?.message} /></div>
          <div className="grid grid-cols-2 gap-4"><Input label="QEO (optionnel)" type="number" {...register("eoq")} /><Input label="Délai (jours)" type="number" {...register("lead_time_days")} /></div>
          <Controller name="review_period" control={control} render={({ field }) => <Select label="Période de révision" value={field.value ?? "weekly"} onChange={field.onChange} options={[{ value: "daily", label: "Quotidienne" }, { value: "weekly", label: "Hebdomadaire" }, { value: "biweekly", label: "Bi-hebdomadaire" }, { value: "monthly", label: "Mensuelle" }]} />} />
          <div className="flex justify-end gap-2 pt-2"><Button variant="outline" type="button" onClick={() => { setCreateOpen(false); reset(); }}>Annuler</Button><Button type="submit" loading={createPolicy.isPending}>Créer</Button></div>
        </form>
      </Modal>
    </div>
  );
}
