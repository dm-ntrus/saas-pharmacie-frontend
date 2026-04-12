"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreateSupplier } from "@/hooks/api/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { SUPPLIER_TYPE_LABELS } from "@/types/suppliers";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  supplierCode: z.string().min(1, "Code fournisseur requis"),
  address: z.string().min(2, "Adresse requise"),
  city: z.string().min(1, "Ville requise"),
  state: z.string().min(1, "Région requise"),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Pays requis"),
  phone: z.string().min(6, "Téléphone requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  website: z.string().optional(),
  contactPerson: z.string().min(2, "Contact requis"),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  type: z.enum(["manufacturer", "wholesaler", "distributor", "other"]).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewSupplierPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_CREATE]}>
      <NewSupplierForm />
    </ModuleGuard>
  );
}

function NewSupplierForm() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createSupplier = useCreateSupplier();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      supplierCode: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      email: "",
      contactPerson: "",
      type: "distributor",
    },
  });

  const onSubmit = (data: FormValues) => {
    createSupplier.mutate(data as Record<string, unknown>, {
      onSuccess: (res: { id?: string }) => {
        const id = res?.id?.includes(":") ? res.id.split(":")[1] : res?.id ?? "";
        router.push(buildPath(`/suppliers/${id || ""}`));
      },
    });
  };

  const typeOptions = Object.entries(SUPPLIER_TYPE_LABELS)
    .filter(([k]) => ["manufacturer", "wholesaler", "distributor", "other"].includes(k))
    .map(([value, label]) => ({ value, label }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/suppliers")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau fournisseur</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Créer un fournisseur</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
              <Input {...form.register("name")} placeholder="Raison sociale" />
              {form.formState.errors.name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code fournisseur *</label>
              <Input {...form.register("supplierCode")} placeholder="SUP-001" />
              {form.formState.errors.supplierCode && <p className="text-xs text-red-500 mt-1">{form.formState.errors.supplierCode.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse *</label>
              <Input {...form.register("address")} placeholder="Adresse complète" />
              {form.formState.errors.address && <p className="text-xs text-red-500 mt-1">{form.formState.errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ville *</label>
              <Input {...form.register("city")} />
              {form.formState.errors.city && <p className="text-xs text-red-500 mt-1">{form.formState.errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Région / État *</label>
              <Input {...form.register("state")} />
              {form.formState.errors.state && <p className="text-xs text-red-500 mt-1">{form.formState.errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code postal</label>
              <Input {...form.register("zipCode")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pays *</label>
              <Input {...form.register("country")} />
              {form.formState.errors.country && <p className="text-xs text-red-500 mt-1">{form.formState.errors.country.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone *</label>
              <Input {...form.register("phone")} />
              {form.formState.errors.phone && <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <Input type="email" {...form.register("email")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site web</label>
              <Input {...form.register("website")} placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <Select options={typeOptions} value={form.watch("type")} onChange={(v) => form.setValue("type", v as FormValues["type"])} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact principal</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom du contact *</label>
              <Input {...form.register("contactPerson")} />
              {form.formState.errors.contactPerson && <p className="text-xs text-red-500 mt-1">{form.formState.errors.contactPerson.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email contact</label>
              <Input type="email" {...form.register("contactEmail")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tél. contact</label>
              <Input {...form.register("contactPhone")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent>
            <textarea {...form.register("notes")} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" placeholder="Notes internes" />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild><Link href={buildPath("/suppliers")}>Annuler</Link></Button>
          <Button type="submit" loading={createSupplier.isPending}>Créer le fournisseur</Button>
        </div>
      </form>
    </div>
  );
}
