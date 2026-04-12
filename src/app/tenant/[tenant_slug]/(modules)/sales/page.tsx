"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useSalesList, useRefundSale } from "@/hooks/api/useSales";
import {
  SaleStatus,
  SALE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type Sale,
} from "@/types/sales";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  SkeletonCard,
  EmptyState,
  ErrorBanner,
  Modal,
} from "@/components/ui";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

const STATUS_BADGE_MAP: Record<SaleStatus, "success" | "danger" | "warning" | "default" | "info"> = {
  [SaleStatus.COMPLETED]: "success",
  [SaleStatus.REFUNDED]: "danger",
  [SaleStatus.CANCELLED]: "default",
  [SaleStatus.PENDING]: "warning",
  [SaleStatus.PARTIALLY_PAID]: "info",
};

export default function SalesPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_READ]}>
      <SalesContent />
    </ModuleGuard>
  );
}

function SalesContent() {
  const { buildPath } = useTenantPath();
  const router = useRouter();
  const { data: sales, isLoading, error, refetch } = useSalesList();
  const refundMutation = useRefundSale();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<SaleStatus | "">("");
  const [refundModal, setRefundModal] = useState<Sale | null>(null);
  const [refundReason, setRefundReason] = useState("");

  const filteredSales = (sales ?? []).filter((sale) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesNumber = sale.sale_number?.toLowerCase().includes(term);
      const matchesPatient =
        sale.patient &&
        `${sale.patient.firstName} ${sale.patient.lastName}`
          .toLowerCase()
          .includes(term);
      if (!matchesNumber && !matchesPatient) return false;
    }
    if (filterStatus && sale.status !== filterStatus) return false;
    return true;
  });

  const totalRevenue = filteredSales.reduce(
    (sum, s) => sum + parseFloat(s.total_amount || "0"),
    0,
  );
  const completedCount = filteredSales.filter(
    (s) => s.status === SaleStatus.COMPLETED,
  ).length;

  const handleRefund = () => {
    if (!refundModal) return;
    refundMutation.mutate(
      { id: refundModal.id, reason: refundReason },
      {
        onSuccess: () => {
          setRefundModal(null);
          setRefundReason("");
        },
      },
    );
  };

  if (error) {
    return (
      <ErrorBanner
        message="Impossible de charger les ventes"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Ventes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez les transactions et les ventes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/sales/reports"))}
          >
            Rapports
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/sales/pos"))}
          >
            Point de vente
          </Button>
          <ProtectedAction permission={Permission.SALES_CREATE}>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/sales/new"))}
            >
              Nouvelle vente
            </Button>
          </ProtectedAction>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total ventes
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isLoading ? "—" : filteredSales.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chiffre d&apos;affaires
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isLoading ? "—" : formatCurrency(totalRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complétées
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isLoading ? "—" : completedCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par numéro, patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtres
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Exporter
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Statut
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as SaleStatus | "")
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Tous</option>
                  {Object.entries(SALE_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus("");
                    setSearchTerm("");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales List */}
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredSales.length === 0 ? (
        <EmptyState
          icon={
            <ShoppingCart className="w-8 h-8 text-slate-400" />
          }
          title="Aucune vente"
          description="Commencez par enregistrer une nouvelle vente."
          actionLabel="Nouvelle vente"
          onAction={() => router.push(buildPath("/sales/new"))}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    N&deg;
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paiement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(buildPath(`/sales/${sale.id}`))
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {sale.sale_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {formatDateTime(sale.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {sale.patient
                        ? `${sale.patient.firstName} ${sale.patient.lastName}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="sm">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {PAYMENT_METHOD_LABELS[sale.payment_method] ??
                          sale.payment_method}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={STATUS_BADGE_MAP[sale.status] ?? "default"}
                        size="sm"
                      >
                        {SALE_STATUS_LABELS[sale.status] ?? sale.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(sale.total_amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(buildPath(`/sales/${sale.id}`))
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {sale.status === SaleStatus.COMPLETED && (
                          <ProtectedAction permission={Permission.SALES_UPDATE}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRefundModal(sale)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </ProtectedAction>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredSales.map((sale) => (
              <Card
                key={sale.id}
                className="cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/50"
                onClick={() =>
                  router.push(buildPath(`/sales/${sale.id}`))
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {sale.sale_number}
                    </span>
                    <Badge
                      variant={STATUS_BADGE_MAP[sale.status] ?? "default"}
                      size="sm"
                    >
                      {SALE_STATUS_LABELS[sale.status]}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>{formatDateTime(sale.created_at)}</p>
                    {sale.patient && (
                      <p>
                        {sale.patient.firstName} {sale.patient.lastName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    <Badge variant="default" size="sm">
                      {PAYMENT_METHOD_LABELS[sale.payment_method]}
                    </Badge>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(sale.total_amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Refund Modal */}
      <Modal
        open={!!refundModal}
        onOpenChange={() => {
          setRefundModal(null);
          setRefundReason("");
        }}
        title="Rembourser la vente"
        description={`Vente ${refundModal?.sale_number} — ${formatCurrency(refundModal?.total_amount ?? "0")}`}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Raison du remboursement"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Ex: Retour produit défectueux"
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRefundModal(null);
                setRefundReason("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleRefund}
              loading={refundMutation.isPending}
              disabled={!refundReason.trim()}
            >
              Confirmer le remboursement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
