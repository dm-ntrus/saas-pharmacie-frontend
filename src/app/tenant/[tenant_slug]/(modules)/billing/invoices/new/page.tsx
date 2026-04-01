"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useCreateBillingInvoice } from "@/hooks/api/useBilling";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  ErrorBanner,
} from "@/components/ui";
import { formatCurrency } from "@/utils/formatters";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { CreateInvoiceItemDto, InvoiceItemType } from "@/types/billing";
import { PAYMENT_METHOD_LABELS } from "@/types/billing";

const itemSchema = z.object({
  item_type: z.enum(["product", "service", "consultation", "prescription"]),
  item_code: z.string().min(1, "Code requis"),
  item_name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1),
  unit_price: z.coerce.number().min(0),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  tax_rate: z.coerce.number().min(0).max(1).optional(),
});

const formSchema = z.object({
  patient_id: z.string().optional(),
  customer_id: z.string().optional(),
  invoice_type: z.string().optional(),
  items: z.array(itemSchema).min(1, "Au moins une ligne"),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  payment_method: z.string().optional(),
  payment_terms_days: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  terms_and_conditions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewBillingInvoicePage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_CREATE]}>
      <NewInvoiceForm />
    </ModuleGuard>
  );
}

function NewInvoiceForm() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const createInvoice = useCreateBillingInvoice();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [
        {
          item_type: "product",
          item_code: "",
          item_name: "",
          quantity: 1,
          unit_price: 0,
          discount_percentage: 0,
          tax_rate: 0.18,
        },
      ],
      discount_percentage: 0,
      payment_terms_days: 30,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  const items = form.watch("items");
  const subtotal = items.reduce(
    (sum, it) => sum + it.quantity * it.unit_price * (1 - (it.discount_percentage ?? 0) / 100),
    0,
  );
  const discountAmount = subtotal * ((form.watch("discount_percentage") ?? 0) / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = items.reduce(
    (sum, it) =>
      sum +
      it.quantity * it.unit_price * (1 - (it.discount_percentage ?? 0) / 100) * (it.tax_rate ?? 0),
    0,
  );
  const total = afterDiscount + taxAmount;

  const onSubmit = (data: FormValues) => {
    const payload = {
      patient_id: data.patient_id || undefined,
      customer_id: data.customer_id || undefined,
      invoice_type: data.invoice_type || "standard",
      items: data.items.map(
        (it): CreateInvoiceItemDto => ({
          item_type: it.item_type as InvoiceItemType,
          item_code: it.item_code,
          item_name: it.item_name,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          discount_percentage: it.discount_percentage,
          tax_rate: it.tax_rate,
        }),
      ),
      discount_percentage: data.discount_percentage,
      payment_method: data.payment_method,
      payment_terms_days: data.payment_terms_days,
      notes: data.notes,
      terms_and_conditions: data.terms_and_conditions,
    };
    createInvoice.mutate(payload as Record<string, unknown>, {
      onSuccess: (res: any) => {
        const id = res?.id?.includes(":") ? res.id.split(":")[1] : res?.id ?? "";
        router.push(buildPath(`/billing/invoices/${id}`));
      },
    });
  };

  const paymentMethodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/billing/invoices")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Nouvelle facture
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Créer une facture client
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client / Patient</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ID Patient (optionnel)
              </label>
              <Input {...form.register("patient_id")} placeholder="patients:xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ID Client (optionnel)
              </label>
              <Input {...form.register("customer_id")} placeholder="customers:xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Méthode de paiement
              </label>
              <Select
                options={[{ value: "", label: "—" }, ...paymentMethodOptions]}
                value={form.watch("payment_method") ?? ""}
                onChange={(v) => form.setValue("payment_method", v)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Délai de paiement (jours)
              </label>
              <Input type="number" {...form.register("payment_terms_days")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lignes de facture</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  item_type: "product",
                  item_code: "",
                  item_name: "",
                  quantity: 1,
                  unit_price: 0,
                  discount_percentage: 0,
                  tax_rate: 0.18,
                })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Ligne
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Select
                  options={[
                    { value: "product", label: "Produit" },
                    { value: "service", label: "Service" },
                    { value: "consultation", label: "Consultation" },
                    { value: "prescription", label: "Prescription" },
                  ]}
                  value={form.watch(`items.${index}.item_type`)}
                  onChange={(v) => form.setValue(`items.${index}.item_type`, v as InvoiceItemType)}
                  placeholder="Type"
                />
                <Input
                  placeholder="Code"
                  {...form.register(`items.${index}.item_code`)}
                  className="col-span-1"
                />
                <Input
                  placeholder="Nom"
                  {...form.register(`items.${index}.item_name`)}
                  className="col-span-2"
                />
                <Input
                  type="number"
                  placeholder="Qté"
                  {...form.register(`items.${index}.quantity`)}
                  className="col-span-1"
                />
                <Input
                  type="number"
                  placeholder="Prix unit."
                  {...form.register(`items.${index}.unit_price`)}
                  className="col-span-1"
                />
                <div className="col-span-1 flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="% remise"
                    {...form.register(`items.${index}.discount_percentage`)}
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                {form.formState.errors.items?.[index] && (
                  <p className="col-span-full text-xs text-red-500">
                    {form.formState.errors.items[index]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totaux (calculés)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500">Sous-total</p>
              <p className="text-lg font-semibold">{formatCurrency(subtotal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remise globale %</p>
              <Input
                type="number"
                {...form.register("discount_percentage")}
                className="mt-1 w-24"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500">Montant remise</p>
              <p className="text-lg font-semibold">{formatCurrency(discountAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">TVA</p>
              <p className="text-lg font-semibold">{formatCurrency(taxAmount)}</p>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <p className="text-xs text-slate-500">Total TTC</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(total)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes
              </label>
              <textarea
                {...form.register("notes")}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]"
                placeholder="Notes internes ou pour le client"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Conditions générales
              </label>
              <textarea
                {...form.register("terms_and_conditions")}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[60px]"
                placeholder="Conditions générales"
              />
            </div>
          </CardContent>
        </Card>

        {form.formState.errors.items && (
          <ErrorBanner
            message={
              form.formState.errors.items.root?.message ??
              "Vérifiez les champs des lignes de facture"
            }
          />
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={buildPath("/billing/invoices")}>Annuler</Link>
          </Button>
          <Button type="submit" loading={createInvoice.isPending}>
            Créer la facture
          </Button>
        </div>
      </form>
    </div>
  );
}
