"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierById, useSupplierPerformance } from "@/hooks/api/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft, FileText, Package, FileSignature, TrendingUp, ShoppingCart } from "lucide-react";
import type { Supplier } from "@/types/suppliers";
import { SUPPLIER_TYPE_LABELS } from "@/types/suppliers";

export default function SupplierDetailPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_READ]}>
      <SupplierProfile />
    </ModuleGuard>
  );
}

function SupplierProfile() {
  const params = useParams();
  const path = useTenantPath();
  const id = (params?.id as string) ?? "";

  const { data: supplier, isLoading, error } = useSupplierById(id);
  const { data: performance } = useSupplierPerformance(id);

  const s = supplier as Supplier | undefined;

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger le fournisseur" />;
  if (isLoading || !s) return <Skeleton className="h-64 w-full" />;

  const rating = s.rating != null ? Number(s.rating) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={path("/suppliers")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {s.supplier_code ?? s.supplierCode ?? ""} · {SUPPLIER_TYPE_LABELS[s.type ?? ""] ?? s.type ?? "—"}
              {s.status && <Badge variant="default" size="sm" className="ml-2">{s.status}</Badge>}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Coordonnées</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-slate-500">Adresse :</span> {s.address ?? "—"}{s.city ? `, ${s.city}` : ""} {s.zipCode ?? ""} {s.country ?? ""}</p>
            <p><span className="text-slate-500">Tél :</span> {s.phone ?? "—"}</p>
            {s.email && <p><span className="text-slate-500">Email :</span> {s.email}</p>}
            <p><span className="text-slate-500">Contact :</span> {s.contact_person ?? s.contactPerson ?? "—"}</p>
            {rating != null && <p><span className="text-slate-500">Note :</span> <strong>{rating}/5</strong></p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={path(`/suppliers/${id}/orders`)}><ShoppingCart className="w-4 h-4 mr-2" /> Commandes</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={path(`/suppliers/${id}/products`)}><Package className="w-4 h-4 mr-2" /> Catalogue</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={path(`/suppliers/${id}/contracts`)}><FileSignature className="w-4 h-4 mr-2" /> Contrats</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={path(`/suppliers/${id}/performance`)}><TrendingUp className="w-4 h-4 mr-2" /> Performance</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {performance && (
        <Card>
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(performance, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {s.notes && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{s.notes}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
