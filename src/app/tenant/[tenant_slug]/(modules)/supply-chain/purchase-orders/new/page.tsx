"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreateSupplyChainPurchaseOrder } from "@/hooks/api/useSupplyChain";
import { useSuppliers } from "@/hooks/api/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Skeleton } from "@/components/ui";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const itemSchema = z.object({ product_id: z.string().optional(), product_name: z.string().min(1, "Produit requis"), quantity: z.string().min(1, "Quantité requise"), unit_price: z.string().min(1, "Prix unitaire requis") });
const schema = z.object({ supplier_id: z.string().min(1, "Fournisseur requis"), order_date: z.string().min(1, "Date requise"), expected_delivery_date: z.string().optional(), notes: z.string().optional(), items: z.array(itemSchema).min(1, "Au moins une ligne") });
type FormData = z.infer<typeof schema>;

export default function NewPurchaseOrderPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_CREATE]}>
      <NewPurchaseOrderForm />
    </ModuleGuard>
  );
}

function NewPurchaseOrderForm() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createPo = useCreateSupplyChainPurchaseOrder();
  const { data: suppliers, isLoading: ls } = useSuppliers();
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { supplier_id: "", order_date: new Date().toISOString().slice(0, 10), expected_delivery_date: "", notes: "", items: [{ product_name: "", quantity: "1", unit_price: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const supplierOptions = (suppliers ?? []).map((s: { id: string; name?: string }) => ({ value: s.id, label: s.name ?? s.id }));

  const onSubmit = (data: FormData) => {
    const payload = { supplierId: data.supplier_id, order_date: data.order_date, expected_delivery_date: data.expected_delivery_date || undefined, notes: data.notes || undefined, items: data.items.map((it) => ({ product_id: it.product_id, product_name: it.product_name, quantity: parseInt(it.quantity, 10), unit_price: parseFloat(it.unit_price) })) };
    createPo.mutate(payload as unknown as Record<string, unknown>, {
      onSuccess: (res: { id?: string; data?: { id?: string } }) => {
        const id = (res as { id?: string })?.id ?? (res as { data?: { id?: string } })?.data?.id;
        if (id) router.push(buildPath(`/supply-chain/purchase-orders/${id}`)); else router.push(buildPath("/supply-chain/purchase-orders"));
      },
    });
  };

  if (ls && supplierOptions.length === 0) return <Skeleton className="h-64 w-full" />;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain/purchase-orders")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouvelle commande d&apos;achat</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Créer un bon de commande</p></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card><CardHeader><CardTitle>En-tête</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Controller name="supplier_id" control={control} render={({ field }) => <Select label="Fournisseur" value={field.value} onChange={field.onChange} options={[{ value: "", label: "Sélectionner…" }, ...supplierOptions]} error={errors.supplier_id?.message} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Date de commande" type="date" {...register("order_date")} error={errors.order_date?.message} /><Input label="Date de livraison prévue" type="date" {...register("expected_delivery_date")} /></div>
            <Input label="Notes" {...register("notes")} />
          </CardContent>
        </Card>
        <Card className="mt-6"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Lignes de commande</CardTitle><Button type="button" variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => append({ product_name: "", quantity: "1", unit_price: "" })}>Ajouter une ligne</Button></CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Input label="Produit" className="flex-1 min-w-[180px]" {...register(`items.${index}.product_name`)} error={errors.items?.[index]?.product_name?.message} />
                <Input label="Quantité" type="number" className="w-24" {...register(`items.${index}.quantity`)} error={errors.items?.[index]?.quantity?.message} />
                <Input label="Prix unit." type="number" step="0.01" className="w-28" {...register(`items.${index}.unit_price`)} error={errors.items?.[index]?.unit_price?.message} />
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={fields.length <= 1} leftIcon={<Trash2 className="w-4 h-4" />} />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 mt-6"><Button variant="outline" type="button" asChild><Link href={buildPath("/supply-chain/purchase-orders")}>Annuler</Link></Button><Button type="submit" loading={createPo.isPending}>Créer la commande</Button></div>
      </form>
    </div>
  );
}
