"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  usePurchaseRequestById,
  useSubmitPurchaseRequest,
  useApprovePurchaseRequest,
  useRejectPurchaseRequest,
  useCancelPurchaseRequest,
  useConvertPurchaseRequest,
} from "@/hooks/api/useSupplyChain";
import { useSuppliers } from "@/hooks/api/useSuppliers";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Modal,
  Input,
  Skeleton,
  ErrorBanner,
} from "@/components/ui";
import { ArrowLeft, CheckCircle, XCircle, Send, Ban, ShoppingCart } from "lucide-react";
import type { PurchaseRequest, PurchaseRequestLine } from "@/types/suppliers";
import { PR_STATUS_LABELS } from "@/types/suppliers";
import { formatCurrency } from "@/utils/formatters";

function shortId(id: string) {
  return id.includes(":") ? id.split(":").pop() ?? id : id;
}

export default function PurchaseRequestDetailPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}
    >
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { buildPath } = useTenantPath();
  const { data, isLoading, error, refetch } = usePurchaseRequestById(id);
  const { data: suppliers } = useSuppliers();
  const submitMut = useSubmitPurchaseRequest();
  const approveMut = useApprovePurchaseRequest();
  const rejectMut = useRejectPurchaseRequest();
  const cancelMut = useCancelPurchaseRequest();
  const convertMut = useConvertPurchaseRequest();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [convertOpen, setConvertOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");

  const pr = (data?.data ?? data) as PurchaseRequest | undefined;
  const lines = (pr?.lines ?? []) as PurchaseRequestLine[];
  const st = pr?.status ?? "";

  if (error)
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain/purchase-requests")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <ErrorBanner message="Demande introuvable" onRetry={() => refetch()} />
      </div>
    );
  if (isLoading || !pr) return <Skeleton className="h-64 w-full" />;

  const poLink = pr.converted_purchase_order_id
    ? buildPath(`/supply-chain/purchase-orders/${shortId(pr.converted_purchase_order_id)}`)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/supply-chain/purchase-requests")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pr.request_number ?? id}
            </h1>
            <Badge variant="default" size="sm" className="mt-1">
              {PR_STATUS_LABELS[st] ?? st}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {st === "draft" && (
            <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}>
              <Button
                size="sm"
                leftIcon={<Send className="w-4 h-4" />}
                loading={submitMut.isPending}
                onClick={() => submitMut.mutate(id, { onSuccess: () => refetch() })}
              >
                Soumettre
              </Button>
            </ProtectedAction>
          )}
          {st === "submitted" && (
            <>
              <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  loading={approveMut.isPending}
                  onClick={() => approveMut.mutate(id, { onSuccess: () => refetch() })}
                >
                  Approuver
                </Button>
              </ProtectedAction>
              <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={() => setRejectOpen(true)}
                >
                  Refuser
                </Button>
              </ProtectedAction>
            </>
          )}
          {["draft", "submitted"].includes(st) && (
            <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Ban className="w-4 h-4" />}
                loading={cancelMut.isPending}
                onClick={() => cancelMut.mutate(id, { onSuccess: () => refetch() })}
              >
                Annuler
              </Button>
            </ProtectedAction>
          )}
          {st === "approved" && (
            <ProtectedAction permission={Permission.PURCHASE_ORDERS_CREATE}>
              <Button
                size="sm"
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                onClick={() => setConvertOpen(true)}
              >
                Transformer en BC
              </Button>
            </ProtectedAction>
          )}
        </div>
      </div>

      {poLink && (
        <p className="text-sm">
          <span className="text-slate-500">Bon de commande :</span>{" "}
          <Link href={poLink} className="text-emerald-600 hover:underline">
            Ouvrir
          </Link>
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {pr.title && (
            <p>
              <span className="text-slate-500">Titre :</span> {pr.title}
            </p>
          )}
          {pr.notes && (
            <p>
              <span className="text-slate-500">Notes :</span> {pr.notes}
            </p>
          )}
          {pr.rejected_reason && (
            <p className="text-red-600">
              <span className="font-medium">Motif refus :</span> {pr.rejected_reason}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lignes</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2">Produit</th>
                <th className="text-right py-2">Qté</th>
                <th className="text-right py-2">Coût est.</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.id ?? i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">
                    {l.product_name}{" "}
                    <span className="text-slate-400 text-xs">({l.product_sku})</span>
                  </td>
                  <td className="text-right py-2">{l.quantity}</td>
                  <td className="text-right py-2">
                    {l.estimated_unit_cost != null
                      ? formatCurrency(Number(l.estimated_unit_cost))
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal open={rejectOpen} onOpenChange={setRejectOpen} title="Refuser la demande">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!rejectReason.trim()) return;
            rejectMut.mutate(
              { id, reason: rejectReason.trim() },
              {
                onSuccess: () => {
                  setRejectOpen(false);
                  setRejectReason("");
                  refetch();
                },
              },
            );
          }}
        >
          <Input
            label="Motif"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" loading={rejectMut.isPending}>
              Confirmer
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={convertOpen} onOpenChange={setConvertOpen} title="Fournisseur pour le bon de commande">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!supplierId) return;
            convertMut.mutate(
              { id, supplierId },
              {
                onSuccess: () => {
                  setConvertOpen(false);
                  refetch();
                },
              },
            );
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Fournisseur</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              required
            >
              <option value="">— Choisir —</option>
              {(suppliers ?? []).map((s: { id: string; name: string }) => {
                const sid = shortId(s.id);
                return (
                  <option key={s.id} value={sid}>
                    {s.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setConvertOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={convertMut.isPending}>
              Créer le BC
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
