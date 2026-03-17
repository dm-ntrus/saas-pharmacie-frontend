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
  useUpdateDeliveryStatus,
  useAssignDriver,
  useAvailableDrivers,
  useCreateDriver,
  useDeliveryZones,
  useCreateDeliveryZone,
  useDeliveryMetrics,
} from "@/hooks/api/useDelivery";
import { createOrderSchema, type CreateOrderFormData } from "@/schemas/delivery.schema";
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
} from "lucide-react";

type TabKey = "orders" | "drivers" | "zones" | "metrics";

const ORDER_STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  pending: "default",
  assigned: "info",
  in_transit: "warning",
  delivered: "success",
  cancelled: "danger",
  returned: "danger",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  assigned: "Assignée",
  in_transit: "En transit",
  delivered: "Livrée",
  cancelled: "Annulée",
  returned: "Retournée",
};

const createDriverSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  phone: z.string().min(1, "Champ requis"),
  vehicle_type: z.string(),
});
type CreateDriverData = z.infer<typeof createDriverSchema>;

const createZoneSchema = z.object({
  name: z.string().min(1, "Champ requis"),
  description: z.string(),
  radius_km: z.string(),
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

  const { data: orders, isLoading, error, refetch } = useDeliveryOrders();
  const { data: drivers } = useAvailableDrivers();
  const { data: zones = [] } = useDeliveryZones();
  const assignDriver = useAssignDriver();
  const createOrder = useCreateDeliveryOrder();

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
      deliveryZoneId: 1,
      deliveryFee: 0,
      totalAmount: 0,
      deliveryInstructions: "",
      notes: "",
    },
  });

  const onOrderSubmit = (data: CreateOrderFormData) => {
    const payload = {
      orderNumber: data.orderNumber || `CMD-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      deliveryAddress: data.deliveryAddress,
      city: data.city,
      postalCode: data.postalCode,
      deliveryZoneId: Number(data.deliveryZoneId) || (Array.isArray(zones) && zones[0] ? parseInt(String((zones[0] as any).id).split(":")[1] || "1", 10) : 1),
      deliveryFee: Number(data.deliveryFee),
      totalAmount: Number(data.totalAmount),
      deliveryInstructions: data.deliveryInstructions || undefined,
      notes: data.notes || undefined,
    };
    createOrder.mutate(payload, {
      onSuccess: () => { setShowCreateOrder(false); orderForm.reset(); },
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
                          onClick={() => router.push(buildPath(`/delivery/${typeof order.id === "string" && order.id.includes(":") ? order.id.split(":")[1] : order.id}`))}
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
                          <button onClick={() => router.push(buildPath(`/delivery/${typeof order.id === "string" && order.id.includes(":") ? order.id.split(":")[1] : order.id}`))}>
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
                      onClick={() => router.push(buildPath(`/delivery/${typeof order.id === "string" && order.id.includes(":") ? order.id.split(":")[1] : order.id}`))}
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
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{driver.name}</p>
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
          {Array.isArray(zones) && zones.length > 0 && (
            <Select
              label="Zone de livraison"
              value={String(orderForm.watch("deliveryZoneId"))}
              onChange={(v) => orderForm.setValue("deliveryZoneId", parseInt(v, 10) || 1)}
              options={zones.map((z: any, i: number) => {
                const numId = typeof z.id === "number" ? z.id : (typeof z.id === "string" && z.id.includes(":") ? parseInt(z.id.split(":")[1], 10) : i + 1);
                return { value: String(numId || i + 1), label: z.name ?? "Zone" };
              })}
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
              label="Total (€)"
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

/* ─── Drivers Tab ─── */

function DriversTab() {
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateDriverData>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: { name: "", phone: "", vehicle_type: "" },
  });

  const { data: drivers, isLoading, error, refetch } = useAvailableDrivers();
  const createDriver = useCreateDriver();

  const allDrivers: any[] = Array.isArray(drivers) ? drivers : [];

  const onValid = (data: CreateDriverData) => {
    createDriver.mutate(data, {
      onSuccess: () => {
        setShowCreate(false);
        reset();
      },
    });
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
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{driver.name}</p>
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
              <option value="">Sélectionner...</option>
              <option value="moto">Moto</option>
              <option value="voiture">Voiture</option>
              <option value="velo">Vélo</option>
              <option value="tricycle">Tricycle</option>
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
    defaultValues: { name: "", description: "", radius_km: "" },
  });

  const { data: zones, isLoading, error, refetch } = useDeliveryZones();
  const createZone = useCreateDeliveryZone();

  const allZones: any[] = Array.isArray(zones) ? zones : [];

  const onValid = (data: CreateZoneData) => {
    createZone.mutate(
      { ...data, radius_km: data.radius_km ? parseFloat(data.radius_km) : undefined },
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
                  <span className="flex items-center gap-1">
                    <Map className="w-3 h-3" /> {zone.radius_km ? `${zone.radius_km} km` : "—"}
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
        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rayon (km)</label>
            <Input type="number" placeholder="Ex: 5" leftIcon={<Map className="w-4 h-4" />} {...register("radius_km")} />
          </div>
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

  const m = metrics ?? {};

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
