"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useDeliveryOrders,
  useCreateDeliveryOrder,
  useAssignDriver,
  useAvailableDrivers,
  useAllDrivers,
  useCreateDriver,
  useDeliveryZones,
  useCreateDeliveryZone,
  useDeliveryMetrics,
  useDeliveryQuote,
  usePlanDeliveryRoute,
  formatDriverName,
} from "@/hooks/api/useDelivery";
import { createOrderSchema, type CreateOrderFormData } from "@/schemas/delivery.schema";
import { toast } from "react-hot-toast";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Modal,
  EmptyState,
  ErrorBanner,
  Skeleton,
  Select,
} from "@/components/ui";
import {
  Plus,
  Search,
  Truck,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Map,
  BarChart3,
  Phone,
  Car,
  CheckCircle,
  XCircle,
  Timer,
  UserPlus,
  TrendingUp,
  Package,
  Route,
} from "lucide-react";

type TabKey = "orders" | "routes" | "drivers" | "zones" | "metrics";

function zoneIdToParam(z: { id?: unknown }): string {
  const raw = z.id;
  if (raw == null) return "";
  const s = typeof raw === "string" ? raw : String(raw);
  return s.includes(":") ? s.split(":")[1] ?? s : s;
}

function orderIdToPath(id: unknown): string {
  if (typeof id !== "string") return String(id ?? "");
  return id.includes(":") ? id.split(":")[1] ?? id : id;
}

const ORDER_STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  pending: "default",
  assigned: "info",
  picked_up: "info",
  in_transit: "warning",
  delivered: "success",
  failed: "danger",
  cancelled: "danger",
  returned: "danger",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  assigned: "Assignée",
  picked_up: "Récupérée",
  in_transit: "En transit",
  delivered: "Livrée",
  failed: "Échouée",
  cancelled: "Annulée",
  returned: "Retournée",
};

const createDriverSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  phone: z.string().min(1, "Champ requis"),
  vehicle_type: z.enum(["bike", "motorcycle", "car", "van"]),
});
type CreateDriverData = z.infer<typeof createDriverSchema>;

const createZoneSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  description: z.string().optional(),
  postal_prefixes: z.string().min(1, "Indiquez des préfixes CP (ex: 75, 92)"),
  cities: z.string().optional(),
  depot_lat: z.string().optional(),
  depot_lng: z.string().optional(),
  radius_km: z.string().optional(),
  delivery_fee: z.string().min(1, "Frais requis"),
  estimated_minutes: z.string().optional(),
  min_order: z.string().optional(),
  mark_default: z.boolean().optional(),
});
type CreateZoneData = z.infer<typeof createZoneSchema>;

export default function DeliveryPage() {
  return (
    <ModuleGuard module="delivery" requiredPermissions={[Permission.DELIVERY_READ]}>
      <DeliveryContent />
    </ModuleGuard>
  );
}

function DeliveryContent() {
  const [tab, setTab] = useState<TabKey>("orders");

  const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "orders", label: "Commandes", icon: Package },
    { key: "routes", label: "Tournée", icon: Route },
    { key: "drivers", label: "Livreurs", icon: Users },
    { key: "zones", label: "Zones", icon: Map },
    { key: "metrics", label: "Métriques", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Livraisons</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gestion des livraisons, livreurs et zones de couverture
        </p>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === key
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "orders" && <OrdersTab />}
      {tab === "routes" && <RoutesTab />}
      {tab === "drivers" && <DriversTab />}
      {tab === "zones" && <ZonesTab />}
      {tab === "metrics" && <MetricsTab />}
    </div>
  );
}

/* ─── Orders Tab ─── */

function OrdersTab() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [quotePreview, setQuotePreview] = useState<Record<string, unknown> | null>(null);

  const { data: orders, isLoading, error, refetch } = useDeliveryOrders();
  const { data: drivers } = useAvailableDrivers();
  const { data: zones = [] } = useDeliveryZones();
  const assignDriver = useAssignDriver();
  const createOrder = useCreateDeliveryOrder();
  const quoteDelivery = useDeliveryQuote();

  const orderForm = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      orderNumber: `CMD-${Date.now()}`,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: "",
      city: "",
      postalCode: "",
      deliveryZoneId: "",
      deliveryFee: 0,
      totalAmount: 0,
      deliveryInstructions: "",
      notes: "",
    },
  });

  const runQuote = () => {
    const city = orderForm.getValues("city")?.trim();
    const postal = orderForm.getValues("postalCode")?.trim();
    const sub = Number(orderForm.getValues("totalAmount")) || 0;
    const lat = orderForm.getValues("latitude");
    const lng = orderForm.getValues("longitude");
    if (!city || !postal) {
      return;
    }
    quoteDelivery.mutate(
      {
        postal_code: postal,
        city,
        subtotal: sub,
        ...(typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng)
          ? { latitude: lat, longitude: lng }
          : {}),
      },
      {
        onSuccess: (res: unknown) => {
          setQuotePreview(res as Record<string, unknown>);
          const r = res as { delivery_fee?: number; meets_minimum?: boolean };
          if (r?.delivery_fee != null) {
            orderForm.setValue("deliveryFee", Number(r.delivery_fee));
          }
        },
      },
    );
  };

  const onOrderSubmit = (data: CreateOrderFormData) => {
    const zid = data.deliveryZoneId?.trim();
    const payload: Record<string, unknown> = {
      orderNumber: data.orderNumber || `CMD-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      deliveryAddress: data.deliveryAddress,
      city: data.city,
      postalCode: data.postalCode,
      deliveryFee: Number(data.deliveryFee),
      totalAmount: Number(data.totalAmount),
      deliveryInstructions: data.deliveryInstructions || undefined,
      notes: data.notes || undefined,
    };
    if (zid) payload.deliveryZoneId = zid;
    if (data.latitude != null && data.longitude != null) {
      payload.latitude = data.latitude;
      payload.longitude = data.longitude;
    }
    if (data.priority) payload.priority = data.priority;
    createOrder.mutate(payload, {
      onSuccess: () => {
        setShowCreateOrder(false);
        setQuotePreview(null);
        orderForm.reset();
      },
    });
  };

  const allOrders: any[] = Array.isArray(orders) ? orders : [];
  const filtered = allOrders.filter(
    (o: any) =>
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.delivery_address?.toLowerCase().includes(search.toLowerCase()),
  );
  const allDrivers: any[] = Array.isArray(drivers) ? drivers : [];

  const handleAssign = (driverId: string) => {
    if (!assignModal) return;
    assignDriver.mutate(
      { orderId: assignModal, driverId },
      { onSuccess: () => setAssignModal(null) },
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par n° ou adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <ProtectedAction permission={Permission.DELIVERY_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateOrder(true)}>
            Nouvelle livraison
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Erreur de chargement des livraisons" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucune livraison" description="Pas de commandes de livraison trouvées." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Commande</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Adresse</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Livreur</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filtered.map((order: any) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-left"
                          onClick={() => router.push(buildPath(`/delivery/${orderIdToPath(order.id)}`))}
                        >
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {order.order_number ?? `LIV-${order.id?.slice(0, 6)}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.created_at ? formatDate(order.created_at) : ""}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /> {order.delivery_address ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {order.driver_name ?? "Non assigné"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={ORDER_STATUS_BADGE[order.status] ?? "default"} size="sm">
                          {ORDER_STATUS_LABELS[order.status] ?? order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === "pending" && (
                            <ProtectedAction permission={Permission.DELIVERY_UPDATE}>
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<UserPlus className="w-3 h-3" />}
                                onClick={() => setAssignModal(order.id)}
                              >
                                Assigner
                              </Button>
                            </ProtectedAction>
                          )}
                          <button onClick={() => router.push(buildPath(`/delivery/${orderIdToPath(order.id)}`))}>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((order: any) => (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="text-left flex-1 min-w-0"
                      onClick={() => router.push(buildPath(`/delivery/${orderIdToPath(order.id)}`))}
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {order.order_number ?? `LIV-${order.id?.slice(0, 6)}`}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {order.delivery_address ?? "—"}
                      </p>
                    </button>
                    <Badge variant={ORDER_STATUS_BADGE[order.status] ?? "default"} size="sm">
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                  {order.status === "pending" && (
                    <ProtectedAction permission={Permission.DELIVERY_UPDATE}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<UserPlus className="w-3 h-3" />}
                        onClick={() => setAssignModal(order.id)}
                      >
                        Assigner un livreur
                      </Button>
                    </ProtectedAction>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        open={!!assignModal}
        onOpenChange={(open) => !open && setAssignModal(null)}
        title="Assigner un livreur"
        description="Sélectionnez un livreur disponible pour cette commande"
      >
        {allDrivers.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Aucun livreur disponible</p>
        ) : (
          <div className="space-y-2">
            {allDrivers.map((driver: any) => (
              <button
                key={driver.id}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                onClick={() => handleAssign(driver.id)}
                disabled={assignDriver.isPending}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatDriverName(driver)}</p>
                    <p className="text-xs text-slate-500">{driver.phone} • {driver.vehicle_type ?? "Véhicule"}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Disponible</Badge>
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={showCreateOrder}
        onOpenChange={setShowCreateOrder}
        title="Nouvelle livraison"
        description="Créer une commande de livraison"
      >
        <form onSubmit={orderForm.handleSubmit(onOrderSubmit)} className="space-y-4">
          <Input
            label="N° commande"
            {...orderForm.register("orderNumber")}
            error={orderForm.formState.errors.orderNumber?.message}
            placeholder="CMD-..."
          />
          <Input
            label="Client"
            {...orderForm.register("customerName")}
            error={orderForm.formState.errors.customerName?.message}
            placeholder="Nom du client"
          />
          <Input
            label="Téléphone"
            {...orderForm.register("customerPhone")}
            error={orderForm.formState.errors.customerPhone?.message}
            placeholder="+33..."
          />
          <Input
            label="Email (optionnel)"
            {...orderForm.register("customerEmail")}
            error={orderForm.formState.errors.customerEmail?.message}
            placeholder="client@exemple.fr"
          />
          <Input
            label="Adresse"
            {...orderForm.register("deliveryAddress")}
            error={orderForm.formState.errors.deliveryAddress?.message}
            placeholder="Rue, numéro"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Ville"
              {...orderForm.register("city")}
              error={orderForm.formState.errors.city?.message}
              placeholder="Ville"
            />
            <Input
              label="Code postal"
              {...orderForm.register("postalCode")}
              error={orderForm.formState.errors.postalCode?.message}
              placeholder="75001"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
            <Button type="button" variant="outline" size="sm" onClick={runQuote} disabled={quoteDelivery.isPending}>
              {quoteDelivery.isPending ? "Calcul..." : "Calculer frais & zone"}
            </Button>
            {quotePreview && (
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Zone: {(quotePreview.zone_name as string) ?? "—"} · Frais: {formatCurrency(Number(quotePreview.delivery_fee ?? 0))}
                {quotePreview.meets_minimum === false && (
                  <span className="text-amber-600 ml-1">(montant minimum non atteint)</span>
                )}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Latitude (optionnel)"
              type="number"
              step="any"
              {...orderForm.register("latitude", { valueAsNumber: true })}
            />
            <Input
              label="Longitude (optionnel)"
              type="number"
              step="any"
              {...orderForm.register("longitude", { valueAsNumber: true })}
            />
          </div>
          {Array.isArray(zones) && zones.length > 0 && (
            <Select
              label="Zone de livraison (optionnel)"
              value={String(orderForm.watch("deliveryZoneId") ?? "")}
              onChange={(v) => orderForm.setValue("deliveryZoneId", v)}
              options={[
                { value: "", label: "— Auto (CP / ville / GPS) —" },
                ...zones.map((z: { id?: unknown; name?: string }) => ({
                  value: zoneIdToParam(z),
                  label: z.name ?? "Zone",
                })),
              ]}
              placeholder="Choisir une zone"
            />
          )}
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Frais livraison (€)"
              type="number"
              step="0.01"
              {...orderForm.register("deliveryFee", { valueAsNumber: true })}
              error={orderForm.formState.errors.deliveryFee?.message}
            />
            <Input
              label="Total panier (€)"
              type="number"
              step="0.01"
              {...orderForm.register("totalAmount", { valueAsNumber: true })}
              error={orderForm.formState.errors.totalAmount?.message}
            />
          </div>
          <Input
            label="Instructions (optionnel)"
            {...orderForm.register("deliveryInstructions")}
            placeholder="Étage, code..."
          />
          <Input
            label="Notes (optionnel)"
            {...orderForm.register("notes")}
            placeholder="Note interne"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreateOrder(false)}>Annuler</Button>
            <Button type="submit" disabled={createOrder.isPending}>{createOrder.isPending ? "Création..." : "Créer la livraison"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

/* ─── Tournée (optimisation d’arrêts) ─── */

function RoutesTab() {
  const { data: orders, isLoading, error, refetch } = useDeliveryOrders();
  const planRoute = usePlanDeliveryRoute();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [depotLat, setDepotLat] = useState("");
  const [depotLng, setDepotLng] = useState("");
  const [result, setResult] = useState<{
    ordered_order_ids: string[];
    estimated_distance_km: number;
    stops: Array<{ order_id: string; sequence: number }>;
  } | null>(null);

  const list: any[] = Array.isArray(orders) ? orders : [];
  const eligible = list.filter(
    (o) =>
      o.latitude != null &&
      o.longitude != null &&
      String(o.latitude) !== "" &&
      String(o.longitude) !== "",
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const runPlan = () => {
    const lat = parseFloat(depotLat);
    const lng = parseFloat(depotLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      toast.error("Coordonnées dépôt invalides");
      return;
    }
    const ids = [...selected];
    if (ids.length < 1) {
      toast.error("Sélectionnez au moins une commande avec coordonnées GPS");
      return;
    }
    planRoute.mutate(
      { order_ids: ids, depot_latitude: lat, depot_longitude: lng },
      {
        onSuccess: (data: unknown) => {
          setResult(data as typeof result);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (error) {
    return <ErrorBanner message="Erreur de chargement" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Sélectionnez des commandes géolocalisées, indiquez le point de départ (pharmacie), puis calculez l&apos;ordre de passage optimal (heuristique plus proche voisin).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label="Dépôt — latitude"
          type="number"
          step="any"
          value={depotLat}
          onChange={(e) => setDepotLat(e.target.value)}
          placeholder="ex: 48.8566"
        />
        <Input
          label="Dépôt — longitude"
          type="number"
          step="any"
          value={depotLng}
          onChange={(e) => setDepotLng(e.target.value)}
          placeholder="ex: 2.3522"
        />
        <div className="flex items-end">
          <Button
            className="w-full"
            leftIcon={<Route className="w-4 h-4" />}
            onClick={runPlan}
            disabled={planRoute.isPending}
          >
            {planRoute.isPending ? "Calcul..." : "Planifier la tournée"}
          </Button>
        </div>
      </div>

      {eligible.length === 0 ? (
        <EmptyState
          title="Aucune commande géolocalisée"
          description="Créez des livraisons avec latitude et longitude pour utiliser l’optimisation de tournée."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commandes éligibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-72 overflow-y-auto">
            {eligible.map((o: any) => {
              const oid = orderIdToPath(o.id);
              return (
                <label
                  key={oid}
                  className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(oid)}
                    onChange={() => toggle(oid)}
                    className="rounded border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{o.order_number ?? oid}</p>
                    <p className="text-xs text-slate-500 truncate">{o.delivery_address}</p>
                  </div>
                </label>
              );
            })}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résultat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Distance estimée: <strong>{result.estimated_distance_km.toFixed(2)} km</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              {result.stops.map((s) => (
                <li key={`${s.sequence}-${s.order_id}`}>
                  #{s.sequence} — commande {s.order_id}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─── Drivers Tab ─── */

function DriversTab() {
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateDriverData>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: { name: "", phone: "", vehicle_type: "car" },
  });

  const { data: drivers, isLoading, error, refetch } = useAllDrivers();
  const createDriver = useCreateDriver();

  const allDrivers: any[] = Array.isArray(drivers) ? drivers : [];

  const onValid = (data: CreateDriverData) => {
    createDriver.mutate(
      { name: data.name, phone: data.phone, vehicle_type: data.vehicle_type },
      {
        onSuccess: () => {
          setShowCreate(false);
          reset();
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-end">
        <ProtectedAction permission={Permission.DELIVERY_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
            Nouveau livreur
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Erreur de chargement des livreurs" onRetry={() => refetch()} />
      ) : allDrivers.length === 0 ? (
        <EmptyState
          title="Aucun livreur"
          description="Enregistrez votre premier livreur pour gérer les livraisons."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDrivers.map((driver: any) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatDriverName(driver)}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {driver.phone}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={driver.status === "available" ? "success" : driver.status === "on_delivery" ? "warning" : "default"}
                    size="sm"
                  >
                    {driver.status === "available" ? "Disponible" : driver.status === "on_delivery" ? "En livraison" : driver.status ?? "—"}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" /> {driver.vehicle_type ?? "Non précisé"}
                  </span>
                  {driver.total_deliveries != null && (
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" /> {driver.total_deliveries} livraisons
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onOpenChange={setShowCreate}
        title="Nouveau livreur"
        description="Enregistrer un nouveau livreur"
      >
        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nom complet *
            </label>
            <Input placeholder="Ex: Amadou Diallo" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Téléphone *
            </label>
            <Input placeholder="Ex: +221 77 123 45 67" leftIcon={<Phone className="w-4 h-4" />} {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Type de véhicule
            </label>
            <select
              {...register("vehicle_type")}
              className="w-full h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="bike">Vélo</option>
              <option value="motorcycle">Moto</option>
              <option value="car">Voiture</option>
              <option value="van">Camionnette</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button type="submit" disabled={createDriver.isPending}>
              {createDriver.isPending ? "Création..." : "Créer le livreur"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

/* ─── Zones Tab ─── */

function ZonesTab() {
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateZoneData>({
    resolver: zodResolver(createZoneSchema),
    defaultValues: {
      name: "",
      description: "",
      postal_prefixes: "",
      cities: "",
      depot_lat: "",
      depot_lng: "",
      radius_km: "",
      delivery_fee: "0",
      estimated_minutes: "60",
      min_order: "",
      mark_default: false,
    },
  });

  const { data: zones, isLoading, error, refetch } = useDeliveryZones();
  const createZone = useCreateDeliveryZone();

  const allZones: any[] = Array.isArray(zones) ? zones : [];

  const onValid = (data: CreateZoneData) => {
    const prefixes = data.postal_prefixes
      .split(/[,\s;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const cities = data.cities
      ? data.cities.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const lat = data.depot_lat ? parseFloat(data.depot_lat) : NaN;
    const lng = data.depot_lng ? parseFloat(data.depot_lng) : NaN;
    const rKm = data.radius_km ? parseFloat(data.radius_km) : NaN;
    const boundaries: Record<string, unknown> = {
      postal_prefixes: prefixes,
      cities,
      default: !!data.mark_default,
    };
    if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(rKm) && rKm > 0) {
      boundaries.circle = { lat, lng, radiusKm: rKm };
    }
    createZone.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        boundaries,
        delivery_fee: parseFloat(data.delivery_fee) || 0,
        estimated_delivery_time_minutes: data.estimated_minutes
          ? parseInt(data.estimated_minutes, 10)
          : 60,
        minimum_order_amount: data.min_order ? parseFloat(data.min_order) : undefined,
        max_daily_orders: 100,
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          reset();
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-end">
        <ProtectedAction permission={Permission.DELIVERY_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
            Nouvelle zone
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Erreur de chargement des zones" onRetry={() => refetch()} />
      ) : allZones.length === 0 ? (
        <EmptyState
          title="Aucune zone de livraison"
          description="Définissez vos zones de couverture pour organiser les livraisons."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allZones.map((zone: any) => (
            <Card key={zone.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{zone.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{zone.description ?? "—"}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate max-w-[50%]" title={JSON.stringify(zone.boundaries ?? {})}>
                    <Map className="w-3 h-3 shrink-0" />
                    {Array.isArray(zone.boundaries?.postal_prefixes) && zone.boundaries.postal_prefixes.length
                      ? `CP ${zone.boundaries.postal_prefixes.join(", ")}`
                      : zone.boundaries?.circle?.radiusKm != null
                        ? `Rayon ${zone.boundaries.circle.radiusKm} km`
                        : "—"}
                  </span>
                  {zone.delivery_fee != null && (
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(zone.delivery_fee)}
                    </span>
                  )}
                  <Badge
                    variant={zone.is_active !== false ? "success" : "default"}
                    size="sm"
                  >
                    {zone.is_active !== false ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onOpenChange={setShowCreate}
        title="Nouvelle zone de livraison"
        description="Définir une nouvelle zone de couverture"
      >
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
            <Input placeholder="Ex: Centre-ville" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <Input placeholder="Description de la zone" {...register("description")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Préfixes code postal * (séparés par virgule)
            </label>
            <Input placeholder="75, 92, 93" {...register("postal_prefixes")} />
            {errors.postal_prefixes && (
              <p className="text-xs text-red-500 mt-1">{errors.postal_prefixes.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Villes (optionnel, séparées par virgule)
            </label>
            <Input placeholder="Paris, Levallois" {...register("cities")} />
          </div>
          <p className="text-xs text-slate-500">Cercle optionnel (GPS + rayon km) pour couverture autour du dépôt :</p>
          <div className="grid grid-cols-3 gap-2">
            <Input label="Lat dépôt" type="number" step="any" {...register("depot_lat")} />
            <Input label="Lng dépôt" type="number" step="any" {...register("depot_lng")} />
            <Input label="Rayon km" type="number" step="any" {...register("radius_km")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Frais livraison (€) *"
              type="number"
              step="0.01"
              {...register("delivery_fee")}
            />
            {"delivery_fee" in errors && errors.delivery_fee && (
              <p className="text-xs text-red-500 col-span-2">{errors.delivery_fee.message}</p>
            )}
            <Input label="Délai estimé (min)" type="number" {...register("estimated_minutes")} />
            <Input label="Montant minimum commande (€)" type="number" step="0.01" {...register("min_order")} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" {...register("mark_default")} className="rounded border-slate-300" />
            Zone par défaut si aucune autre ne correspond
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button type="submit" disabled={createZone.isPending}>
              {createZone.isPending ? "Création..." : "Créer la zone"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

/* ─── Metrics Tab ─── */

function MetricsTab() {
  const { data: metrics, isLoading, error, refetch } = useDeliveryMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message="Erreur de chargement des métriques" onRetry={() => refetch()} />;
  }

  const m = (metrics as any) ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total livraisons"
          value={m.total_deliveries?.toString() ?? "0"}
          icon={<Truck className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          label="Temps moyen"
          value={m.avg_delivery_time ? `${m.avg_delivery_time} min` : "—"}
          icon={<Timer className="w-5 h-5 text-blue-600" />}
        />
        <MetricCard
          label="Taux de réussite"
          value={m.success_rate != null ? `${parseFloat(m.success_rate).toFixed(1)}%` : "—"}
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          highlight={m.success_rate != null && parseFloat(m.success_rate) >= 90}
        />
        <MetricCard
          label="Livreurs actifs"
          value={m.active_drivers?.toString() ?? "0"}
          icon={<Users className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Répartition par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            {m.status_breakdown ? (
              <div className="space-y-3">
                {Object.entries(m.status_breakdown as Record<string, number>).map(([status, count]) => {
                  const total = Object.values(m.status_breakdown as Record<string, number>).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((count as number) / total) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">
                          {ORDER_STATUS_LABELS[status] ?? status}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{count as number}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Performance récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Livraisons aujourd&apos;hui</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {m.today_deliveries ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Cette semaine</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {m.week_deliveries ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Taux d&apos;annulation</span>
                <span className={`text-lg font-bold ${(m.cancellation_rate ?? 0) > 10 ? "text-red-600" : "text-slate-900 dark:text-slate-100"}`}>
                  {m.cancellation_rate != null ? `${parseFloat(m.cancellation_rate).toFixed(1)}%` : "0%"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Revenu livraisons</span>
                <span className="text-lg font-bold text-emerald-600">
                  {m.total_revenue ? formatCurrency(m.total_revenue) : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-emerald-200 dark:border-emerald-800" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {highlight && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}
