"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useOrganization } from "@/context/OrganizationContext";
import {
  useBillingInvoice,
  useCancelBillingInvoice,
  useProcessBillingPayment,
  useProcessRefund,
  useSubscriptionCreditNotes,
  useCreateSubscriptionCreditNote,
  useApplySubscriptionCreditNote,
  useVoidSubscriptionCreditNote,
} from "@/hooks/api/useBilling";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  Skeleton,
  EmptyState,
  ErrorBanner,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, CreditCard, XCircle, RotateCcw, ScrollText } from "lucide-react";
import type {
  BillingInvoice,
  SubscriptionCreditNote,
  SubscriptionCreditNoteReasonCode,
} from "@/types/billing";
import {
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  SUBSCRIPTION_CREDIT_NOTE_STATUS_LABELS,
} from "@/types/billing";

function shortRecordId(id: string | undefined): string {
  if (!id) return "";
  const s = String(id);
  return s.includes(":") ? s.split(":").pop() ?? s : s;
}

export default function BillingInvoiceDetailPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <InvoiceDetail />
    </ModuleGuard>
  );
}

function InvoiceDetail() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const invoiceId = (params?.id as string) ?? "";

  const { data: invoice, isLoading, error } = useBillingInvoice(invoiceId);
  const cancelInvoice = useCancelBillingInvoice();
  const processPayment = useProcessBillingPayment();
  const processRefund = useProcessRefund();

  const {
    data: subscriptionCreditNotes,
    isLoading: cnLoading,
    isError: cnListError,
    refetch: refetchCreditNotes,
  } = useSubscriptionCreditNotes(invoiceId || null);
  const createCreditNote = useCreateSubscriptionCreditNote();
  const applyCreditNote = useApplySubscriptionCreditNote();
  const voidCreditNote = useVoidSubscriptionCreditNote();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [showVoidCreditNoteModal, setShowVoidCreditNoteModal] = useState(false);
  const [voidCreditNoteId, setVoidCreditNoteId] = useState("");
  const [cnAmount, setCnAmount] = useState("");
  const [cnReason, setCnReason] = useState("");
  const [cnReasonCode, setCnReasonCode] = useState<string>("requested_by_customer");
  const [voidCnReason, setVoidCnReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cancelReason, setCancelReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const inv = invoice as BillingInvoice | undefined;
  const balanceDue = inv ? Number(inv.balance_due ?? 0) : 0;
  const status = inv ? String((inv as any).status ?? "") : "";
  const canPay = balanceDue > 0 && !!inv && !["cancelled", "refunded"].includes(status);
  const canCancel = !!inv && ["draft", "pending", "sent"].includes(status);
  const canRefund = !!inv && status === "paid";
  const canCreateSubscriptionCreditNote =
    !!inv &&
    balanceDue > 0 &&
    !["void", "cancelled", "canceled", "refunded"].includes(status);

  const handleCreateCreditNote = () => {
    const amount = parseFloat(cnAmount);
    if (!amount || amount <= 0 || !cnReason.trim()) return;
    createCreditNote.mutate(
      {
        invoiceId,
        amount,
        reason: cnReason.trim(),
        reasonCode: cnReasonCode as SubscriptionCreditNoteReasonCode,
        pharmacyId: currentOrganization?.id,
      },
      {
        onSuccess: () => {
          setShowCreditNoteModal(false);
          setCnAmount("");
          setCnReason("");
          setCnReasonCode("requested_by_customer");
        },
      },
    );
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!inv || !amount || amount <= 0) return;
    const invId = String((inv as any).id ?? "");
    const resolvedId = invId.includes(":") ? invId.split(":")[1] : invId;
    processPayment.mutate(
      {
        id: resolvedId || invId,
        data: { amount, payment_method: paymentMethod as any },
      },
      {
        onSuccess: () => {
          setShowPaymentModal(false);
          setPaymentAmount("");
        },
      },
    );
  };

  const handleCancel = () => {
    if (!inv || !cancelReason.trim()) return;
    const invId = String((inv as any).id ?? "");
    const resolvedId = invId.includes(":") ? invId.split(":")[1] : invId;
    cancelInvoice.mutate(
      { id: resolvedId || invId, reason: cancelReason },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          setCancelReason("");
        },
      },
    );
  };

  const handleRefund = () => {
    const amount = parseFloat(refundAmount);
    if (!inv || !amount || amount <= 0 || !refundReason.trim()) return;
    const invId = String((inv as any).id ?? "");
    const resolvedId = invId.includes(":") ? invId.split(":")[1] : invId;
    processRefund.mutate(
      {
        id: resolvedId || invId,
        data: { amount, reason: refundReason },
      },
      {
        onSuccess: () => {
          setShowRefundModal(false);
          setRefundAmount("");
          setRefundReason("");
        },
      },
    );
  };

  if (error) {
    return (
      <ErrorBanner
        title="Erreur"
        message="Impossible de charger la facture"
      />
    );
  }

  if (isLoading || !inv) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/billing/invoices")}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {String((inv as any).invoice_number ?? "")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {formatDate((inv as any).invoice_date as any)} ·{" "}
              <Badge variant="default" size="sm">
                {INVOICE_STATUS_LABELS[status] ?? status}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canPay && (
            <ProtectedAction permission={Permission.PAYMENTS_CREATE}>
              <Button onClick={() => setShowPaymentModal(true)} leftIcon={<CreditCard className="w-4 h-4" />}>
                Enregistrer paiement
              </Button>
            </ProtectedAction>
          )}
          {canCancel && (
            <ProtectedAction permission={Permission.INVOICES_UPDATE}>
              <Button
                variant="outline"
                className="text-red-600"
                onClick={() => setShowCancelModal(true)}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Annuler la facture
              </Button>
            </ProtectedAction>
          )}
          {canRefund && (
            <ProtectedAction permission={Permission.PAYMENTS_CREATE}>
              <Button
                variant="outline"
                onClick={() => setShowRefundModal(true)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Remboursement
              </Button>
            </ProtectedAction>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Client / Patient</span>
              <span className="font-medium">
                {String((inv as any).patient_name ?? (inv as any).customer_name ?? "—")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date d&apos;échéance</span>
              <span>{formatDate((inv as any).due_date as any)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Méthode de paiement</span>
              <span>
                {(() => {
                  const pm = String((inv as any).payment_method ?? "");
                  return (PAYMENT_METHOD_LABELS[pm] ?? pm) || "—";
                })()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Montant payé</span>
              <span className="font-medium text-emerald-600">
                {formatCurrency(Number(inv.amount_paid ?? 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Reste dû</span>
              <span className={`font-semibold ${balanceDue > 0 ? "text-amber-600" : ""}`}>
                {formatCurrency(balanceDue)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sous-total</span>
              <span>{formatCurrency(Number(inv.subtotal ?? 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Remise</span>
              <span>{formatCurrency(Number(inv.discount_amount ?? 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">TVA</span>
              <span>{formatCurrency(Number(inv.tax_amount ?? 0))}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              <span>Total TTC</span>
              <span className="text-emerald-600">{formatCurrency(Number(inv.total_amount ?? 0))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            Notes de crédit (abonnement SaaS)
          </CardTitle>
          {!cnListError && canCreateSubscriptionCreditNote && (
            <ProtectedAction permission={Permission.INVOICES_UPDATE}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCreditNoteModal(true)}
                leftIcon={<ScrollText className="w-4 h-4" />}
              >
                Créer un avoir
              </Button>
            </ProtectedAction>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avoirs sur facture plateforme : numérotation CN-… appliquée si la facture est reconnue pour votre
            tenant.
          </p>
          {cnListError ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Aucun avoir abonnement disponible pour cette facture (facture locale uniquement, ou accès refusé).
            </p>
          ) : cnLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !subscriptionCreditNotes?.length ? (
            <EmptyState
              title="Aucune note de crédit"
              description="Les avoirs créés pour cette facture d'abonnement apparaîtront ici."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-3 py-2 font-medium">N°</th>
                    <th className="px-3 py-2 font-medium">Montant</th>
                    <th className="px-3 py-2 font-medium">Statut</th>
                    <th className="px-3 py-2 font-medium">Motif</th>
                    <th className="px-3 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(subscriptionCreditNotes as SubscriptionCreditNote[]).map((cn) => {
                    const cnId = shortRecordId(cn.id as string | undefined);
                    const st = String(cn.status ?? "");
                    return (
                      <tr key={cnId || String(cn.credit_note_number)} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-3 py-2 font-mono text-xs">{cn.credit_note_number ?? cnId}</td>
                        <td className="px-3 py-2">
                          {formatCurrency(Number(cn.credit_amount ?? 0))}{" "}
                          <span className="text-slate-400">{String(cn.currency ?? "")}</span>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="default" size="sm">
                            {SUBSCRIPTION_CREDIT_NOTE_STATUS_LABELS[st] ?? st}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 max-w-[200px] truncate" title={String(cn.reason ?? "")}>
                          {String(cn.reason ?? "—")}
                        </td>
                        <td className="px-3 py-2 text-right space-x-1">
                          {st === "open" && (
                            <ProtectedAction permission={Permission.INVOICES_UPDATE}>
                              <Button
                                size="sm"
                                variant="outline"
                                loading={applyCreditNote.isPending}
                                onClick={() => {
                                  if (
                                    !window.confirm(
                                      "Appliquer cet avoir sur la facture (écriture de paiement négatif) ?",
                                    )
                                  )
                                    return;
                                  applyCreditNote.mutate({ creditNoteId: cnId, invoiceId });
                                }}
                              >
                                Appliquer
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600"
                                onClick={() => {
                                  setVoidCreditNoteId(cnId);
                                  setVoidCnReason("");
                                  setShowVoidCreditNoteModal(true);
                                }}
                              >
                                Annuler l&apos;avoir
                              </Button>
                            </ProtectedAction>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {cnListError && (
            <Button variant="ghost" size="sm" onClick={() => refetchCreditNotes()}>
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>

      {Array.isArray((inv as any).items) && (inv as any).items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lignes de facture</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left p-3 font-medium">Code</th>
                    <th className="text-left p-3 font-medium">Désignation</th>
                    <th className="text-right p-3 font-medium">Qté</th>
                    <th className="text-right p-3 font-medium">Prix unit.</th>
                    <th className="text-right p-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {((inv as any).items as any[]).map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-mono">{item.item_code}</td>
                      <td className="p-3">{item.item_name}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(Number(item.unit_price ?? 0))}</td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(
                          item.quantity * Number(item.unit_price ?? 0) * (1 - (item.discount_percentage ?? 0) / 100),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!!(inv as any).notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {String((inv as any).notes)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <Modal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        title="Enregistrer un paiement"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Montant *
            </label>
            <Input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={String(balanceDue)}
            />
            <p className="text-xs text-slate-500 mt-1">Reste dû: {formatCurrency(balanceDue)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Méthode de paiement
            </label>
            <Select
              options={Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label }))}
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || processPayment.isPending}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={showCancelModal} onOpenChange={setShowCancelModal} title="Annuler la facture" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Motif *
            </label>
            <Input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Raison de l'annulation"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Retour
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={!cancelReason.trim() || cancelInvoice.isPending}
            >
              Confirmer l&apos;annulation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Création note de crédit abonnement */}
      <Modal
        open={showCreditNoteModal}
        onOpenChange={setShowCreditNoteModal}
        title="Nouvelle note de crédit (abonnement)"
        description={`Montant max. recommandé : ${formatCurrency(balanceDue)} (reste dû affiché sur la fiche)`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Montant *
            </label>
            <Input
              type="number"
              step="0.01"
              value={cnAmount}
              onChange={(e) => setCnAmount(e.target.value)}
              placeholder={String(balanceDue)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Motif *
            </label>
            <Input value={cnReason} onChange={(e) => setCnReason(e.target.value)} placeholder="Ex. correction facture" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Code motif
            </label>
            <Select
              options={[
                { value: "requested_by_customer", label: "À la demande du client" },
                { value: "correction", label: "Correction" },
                { value: "discount", label: "Remise commerciale" },
                { value: "duplicate", label: "Doublon" },
                { value: "fraudulent", label: "Fraude" },
              ]}
              value={cnReasonCode}
              onChange={setCnReasonCode}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreditNoteModal(false)}>
              Fermer
            </Button>
            <Button
              onClick={handleCreateCreditNote}
              disabled={
                !cnAmount ||
                parseFloat(cnAmount) <= 0 ||
                !cnReason.trim() ||
                createCreditNote.isPending
              }
            >
              Créer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showVoidCreditNoteModal}
        onOpenChange={(o) => {
          setShowVoidCreditNoteModal(o);
          if (!o) setVoidCreditNoteId("");
        }}
        title="Annuler la note de crédit"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Motif d'annulation *"
            value={voidCnReason}
            onChange={(e) => setVoidCnReason(e.target.value)}
            placeholder="Raison obligatoire"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowVoidCreditNoteModal(false)}>
              Retour
            </Button>
            <Button
              variant="danger"
              disabled={!voidCnReason.trim() || !voidCreditNoteId || voidCreditNote.isPending}
              onClick={() => {
                voidCreditNote.mutate(
                  {
                    creditNoteId: voidCreditNoteId,
                    invoiceId,
                    voidReason: voidCnReason.trim(),
                  },
                  {
                    onSuccess: () => {
                      setShowVoidCreditNoteModal(false);
                      setVoidCreditNoteId("");
                      setVoidCnReason("");
                    },
                  },
                );
              }}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal open={showRefundModal} onOpenChange={setShowRefundModal} title="Remboursement" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Montant *
            </label>
            <Input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Motif *
            </label>
            <Input
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Raison du remboursement"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowRefundModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleRefund}
              disabled={
                !refundAmount ||
                parseFloat(refundAmount) <= 0 ||
                !refundReason.trim() ||
                processRefund.isPending
              }
            >
              Valider le remboursement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
