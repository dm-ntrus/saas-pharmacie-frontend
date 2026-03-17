"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useBillingInvoice,
  useCancelBillingInvoice,
  useProcessBillingPayment,
  useProcessRefund,
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
import { ArrowLeft, CreditCard, XCircle, RotateCcw, FileText } from "lucide-react";
import type { BillingInvoice } from "@/types/billing";
import { INVOICE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types/billing";


export default function BillingInvoiceDetailPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.INVOICES_READ]}>
      <InvoiceDetail />
    </ModuleGuard>
  );
}

function InvoiceDetail() {
  const params = useParams();
  const router = useRouter();
  const path = useTenantPath();
  const invoiceId = (params?.id as string) ?? "";

  const { data: invoice, isLoading, error } = useBillingInvoice(invoiceId);
  const cancelInvoice = useCancelBillingInvoice();
  const processPayment = useProcessBillingPayment();
  const processRefund = useProcessRefund();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cancelReason, setCancelReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const inv = invoice as BillingInvoice | undefined;
  const balanceDue = inv ? Number(inv.balance_due ?? 0) : 0;
  const canPay = balanceDue > 0 && inv && !["cancelled", "refunded"].includes(inv.status);
  const canCancel = inv && ["draft", "pending", "sent"].includes(inv.status);
  const canRefund = inv && inv.status === "paid";

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!inv || !amount || amount <= 0) return;
    const resolvedId = inv.id?.includes(":") ? inv.id.split(":")[1] : inv.id;
    processPayment.mutate(
      {
        invoice_id: resolvedId ?? inv.id,
        amount,
        payment_method: paymentMethod as any,
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
    const resolvedId = inv.id?.includes(":") ? inv.id.split(":")[1] : inv.id;
    cancelInvoice.mutate(
      { id: resolvedId ?? inv.id, reason: cancelReason },
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
    const resolvedId = inv.id?.includes(":") ? inv.id.split(":")[1] : inv.id;
    processRefund.mutate(
      {
        invoiceId: resolvedId ?? inv.id,
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
            <Link href={path("/billing/invoices")}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {inv.invoice_number}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {formatDate(inv.invoice_date)} ·{" "}
              <Badge variant="default" size="sm">
                {INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
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
              <span className="font-medium">{inv.patient_name ?? inv.customer_name ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date d&apos;échéance</span>
              <span>{formatDate(inv.due_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Méthode de paiement</span>
              <span>{PAYMENT_METHOD_LABELS[inv.payment_method] ?? inv.payment_method}</span>
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

      {inv.items && inv.items.length > 0 && (
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
                  {inv.items.map((item, i) => (
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

      {inv.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {inv.notes}
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
