"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useDeliveryOrderById,
  useUpdateDeliveryStatus,
  useAssignDriver,
  useAvailableDrivers,
  useOrderTracking,
  useProofOfDelivery,
} from "@/hooks/api/useDelivery";
import { DELIVERY_STATUS_LABELS, DELIVERY_PRIORITY_LABELS } from "@/types/delivery";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ErrorBanner,
  Skeleton,
  Modal,
  Select,
  Input,
} from "@/components/ui";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Package,
  Truck,
  Clock,
  CheckCircle,
  UserPlus,
  History,
  ClipboardCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

const ORDER_STATUS_STEPS = ["pending", "assigned", "picked_up", "in_transit", "delivered"] as const;

export default function DeliveryOrderDetailPage() {
  return (
    <ModuleGuard module="delivery" requiredPermissions={[Permission.DELIVERY_READ]}>
      <DeliveryOrderDetailContent />
    </ModuleGuard>
  );
}

function DeliveryOrderDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { buildPath } = useTenantPath();
  const { data: order, isLoading, error, refetch } = useDeliveryOrderById(id);
  const { data: trackingPayload, refetch: refetchTracking } = useOrderTracking(id);
  const updateStatus = useUpdateDeliveryStatus();
  const proofOfDelivery = useProofOfDelivery();
  const assignDriver = useAssignDriver();
  const { data: availableDriversData } = useAvailableDrivers();
  const availableDrivers = Array.isArray((availableDriversData as any)?.data)
    ? (availableDriversData as any).data
    : Array.isArray(availableDriversData)
      ? availableDriversData
      : [];
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [podOpen, setPodOpen] = useState(false);
  const [podRating, setPodRating] = useState("5");
  const [podNotes, setPodNotes] = useState("");
  const [recipientName, setRecipientName] = useState("");

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !order) {
    return (
      <ErrorBanner
        message="Commande introuvable"
        onRetry={() => refetch()}
      />
    );
  }

  const o = order as any;
  const orderNumber = o.order_number ?? `LIV-${String(o.id ?? "").slice(-6)}`;
  const statusIndex = ORDER_STATUS_STEPS.indexOf(o.status as (typeof ORDER_STATUS_STEPS)[number]);
  const canAssign = o.status === "pending" && availableDrivers.length > 0;

  const handleAssign = () => {
    if (!selectedDriverId) return;
    assignDriver.mutate(
      { orderId: id, driverId: selectedDriverId },
      {
        onSuccess: () => {
          setAssignModalOpen(false);
          setSelectedDriverId("");
          refetch();
        },
      }
    );
  };

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    updateStatus.mutate(
      {
        id,
        status: newStatus,
        failure_reason: newStatus === "failed" ? failureReason : undefined,
      },
      {
        onSuccess: () => {
          setStatusModalOpen(false);
          setNewStatus("");
          setFailureReason("");
          refetch();
          refetchTracking();
        },
      }
    );
  };

  const handlePod = () => {
    const r = parseInt(podRating, 10);
    proofOfDelivery.mutate(
      {
        orderId: id,
        body: {
          recipient_name: recipientName || undefined,
          proof_notes: podNotes || undefined,
          customer_rating: Number.isFinite(r) ? r : undefined,
        },
      },
      {
        onSuccess: () => {
          setPodOpen(false);
          refetch();
          refetchTracking();
        },
      }
    );
  };

  const trackingEvents: any[] = Array.isArray((trackingPayload as any)?.events)
    ? (trackingPayload as any).events
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/delivery"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{orderNumber}</h1>
            <p className="text-sm text-slate-500">
              {o.created_at ? formatDate(o.created_at) : ""}
              {o.priority && ` · ${DELIVERY_PRIORITY_LABELS[o.priority as keyof typeof DELIVERY_PRIORITY_LABELS] ?? o.priority}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={o.status === "delivered" ? "success" : o.status === "cancelled" || o.status === "failed" ? "danger" : "info"} size="md">
            {DELIVERY_STATUS_LABELS[o.status as keyof typeof DELIVERY_STATUS_LABELS] ?? o.status}
          </Badge>
          {canAssign && (
            <ProtectedAction permission={Permission.DELIVERY_UPDATE}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus className="h-4 w-4" />}
                onClick={() => setAssignModalOpen(true)}
              >
                Assigner un livreur
              </Button>
            </ProtectedAction>
          )}
          {o.status !== "delivered" && o.status !== "cancelled" && o.status !== "failed" && (
            <ProtectedAction permission={Permission.DELIVERY_UPDATE}>
              <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(true)}>
                Changer le statut
              </Button>
            </ProtectedAction>
          )}
          {["assigned", "picked_up", "in_transit"].includes(o.status) && (
            <ProtectedAction permission={Permission.DELIVERY_UPDATE}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ClipboardCheck className="h-4 w-4" />}
                onClick={() => setPodOpen(true)}
              >
                Preuve de livraison
              </Button>
            </ProtectedAction>
          )}
        </div>
      </div>

      {/* Stepper statut */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {ORDER_STATUS_STEPS.map((step, i) => {
              const done = statusIndex >= i;
              const current = o.status === step;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        done ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400" : "border-slate-200 dark:border-slate-600 text-slate-400"
                      } ${current ? "ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900" : ""}`}
                    >
                      {done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className="text-xs mt-1 text-center text-slate-600 dark:text-slate-400">
                      {DELIVERY_STATUS_LABELS[step as keyof typeof DELIVERY_STATUS_LABELS] ?? step}
                    </span>
                  </div>
                  {i < ORDER_STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 min-w-[20px] ${done ? "bg-emerald-300 dark:bg-emerald-700" : "bg-slate-200 dark:bg-slate-600"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            Suivi & événements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trackingEvents.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun événement enregistré.</p>
          ) : (
            <ul className="space-y-3 border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 ml-1">
              {trackingEvents.map((ev: any) => (
                <li key={ev.id ?? `${ev.created_at}-${ev.status}`} className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-xs text-slate-500">
                    {ev.created_at ? formatDate(ev.created_at) : ""}
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {ev.message ?? ev.status}
                  </p>
                  {ev.driver_name && (
                    <p className="text-xs text-slate-500">Livreur: {ev.driver_name}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Client & adresse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{o.customer_name ?? "—"}</span>
            </div>
            {o.customer_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${o.customer_phone}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  {o.customer_phone}
                </a>
              </div>
            )}
            {o.customer_email && (
              <p className="text-slate-600 dark:text-slate-400">{o.customer_email}</p>
            )}
            <div className="flex items-start gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{o.delivery_address ?? "—"}</p>
                <p className="text-slate-500">{o.city ?? ""} {o.postal_code ?? ""}</p>
              </div>
            </div>
            {o.delivery_instructions && (
              <p className="text-slate-600 dark:text-slate-400 italic">Note: {o.delivery_instructions}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Montants & livreur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Frais de livraison</span>
              <span className="font-medium">{formatCurrency(Number(o.delivery_fee ?? 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-medium">{formatCurrency(Number(o.total_amount ?? 0))}</span>
            </div>
            {o.zone_name && (
              <p className="text-xs text-slate-500">
                Zone: {o.zone_name}
              </p>
            )}
            {o.scheduled_delivery_time && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Livraison prévue: {formatDate(o.scheduled_delivery_time)}</span>
              </div>
            )}
            {o.driver_name || o.driver_id ? (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{o.driver_name ?? "Livreur assigné"}</span>
              </div>
            ) : (
              <p className="text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">Aucun livreur assigné</p>
            )}
            {o.notes && <p className="text-slate-600 dark:text-slate-400 pt-1">Note: {o.notes}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Modal assignation */}
      <Modal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        title="Assigner un livreur"
        description="Choisissez un livreur disponible pour cette commande"
      >
        <div className="space-y-4">
          <Select
            label="Livreur"
            value={selectedDriverId}
            onChange={setSelectedDriverId}
            options={availableDrivers.map((d: any) => ({ value: d.id, label: `${d.first_name ?? d.firstName ?? ""} ${d.last_name ?? d.lastName ?? ""} - ${d.vehicle_type ?? d.vehicleType ?? "—"}` }))}
            placeholder="Sélectionner..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Annuler</Button>
            <Button onClick={handleAssign} disabled={!selectedDriverId || assignDriver.isPending}>
              {assignDriver.isPending ? "Assignation..." : "Assigner"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal changement statut */}
      <Modal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        title="Changer le statut"
        description="Mettre à jour le statut de la commande"
      >
        <div className="space-y-4">
          <Select
            label="Nouveau statut"
            value={newStatus}
            onChange={setNewStatus}
            options={(
              ["pending", "assigned", "picked_up", "in_transit", "delivered", "failed", "cancelled"] as const
            )
              .filter((s) => s !== o.status)
              .map((s) => ({ value: s, label: DELIVERY_STATUS_LABELS[s] ?? s }))}
            placeholder="Sélectionner..."
          />
          {newStatus === "failed" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Motif
              </label>
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Raison de l&apos;échec..."
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Annuler</Button>
            <Button onClick={handleStatusUpdate} disabled={!newStatus || updateStatus.isPending}>
              {updateStatus.isPending ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={podOpen}
        onOpenChange={setPodOpen}
        title="Preuve de livraison"
        description="Confirme la livraison (notation client, destinataire, notes). Les URLs d’image peuvent être saisies si vous les hébergez ailleurs."
      >
        <div className="space-y-4">
          <Input
            label="Nom du destinataire (optionnel)"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              className="w-full min-h-[72px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              value={podNotes}
              onChange={(e) => setPodNotes(e.target.value)}
            />
          </div>
          <Input
            label="Note client (1–5)"
            type="number"
            min={1}
            max={5}
            value={podRating}
            onChange={(e) => setPodRating(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPodOpen(false)}>Annuler</Button>
            <Button onClick={handlePod} disabled={proofOfDelivery.isPending}>
              {proofOfDelivery.isPending ? "Enregistrement..." : "Valider la livraison"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
