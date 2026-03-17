"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useLocationById, useBlockLocation, useUnblockLocation } from "@/hooks/api/useInventory";
import type { InventoryLocation, Coordinates3D } from "@/types/inventory";
import { LocationType, LOCATION_TYPE_LABELS } from "@/types/inventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  EmptyState,
  ErrorBanner,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import {
  ArrowLeft,
  MapPin,
  Thermometer,
  Lock,
  Package,
  Building2,
  Snowflake,
  Archive,
  Shield,
  Layout,
  Box,
  FlaskConical,
  Presentation,
  Megaphone,
  Truck,
  AlertTriangle,
  Navigation,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const LOCATION_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  warehouse: Building2,
  pharmacy_floor: Layout,
  shelf: Package,
  drawer: Archive,
  refrigerator: Thermometer,
  freezer: Snowflake,
  secure_cabinet: Lock,
  safe: Shield,
  counter: Layout,
  storage_room: Box,
  dispensary: FlaskConical,
  display: Presentation,
  promotional_stand: Megaphone,
  receiving_area: Truck,
  shipping_area: Truck,
};

function getLocationIcon(type: string) {
  const key = (type || "").toLowerCase().replace(/-/g, "_");
  return LOCATION_TYPE_ICONS[key] ?? MapPin;
}

function utilizationColor(pct: number): string {
  if (pct < 10) return "bg-slate-300 dark:bg-slate-600";
  if (pct <= 80) return "bg-emerald-500";
  if (pct < 90) return "bg-amber-500";
  return "bg-red-500";
}

export default function LocationDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_LOCATIONS_READ]}>
      <TooltipProvider>
        <LocationDetailContent />
      </TooltipProvider>
    </ModuleGuard>
  );
}

function LocationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = params?.id as string;

  const { data: locRaw, isLoading, error, refetch } = useLocationById(id);
  const blockMutation = useBlockLocation();
  const unblockMutation = useUnblockLocation();

  const loc: InventoryLocation | null = useMemo(() => {
    if (!locRaw) return null;
    const l = locRaw as any;
    return {
      id: l.id,
      code: l.code ?? l.id,
      name: l.name ?? l.code ?? "—",
      parent_location_id: l.parent_location_id ?? l.parentLocationId ?? null,
      location_type: l.location_type ?? l.locationType ?? "shelf",
      zone_code: l.zone_code ?? l.zoneCode,
      aisle_number: l.aisle_number ?? l.aisleNumber,
      shelf_level: l.shelf_level ?? l.shelfLevel,
      position_code: l.position_code ?? l.positionCode,
      coordinates_3d: l.coordinates_3d ?? l.coordinates3d,
      is_secured: l.is_secured ?? l.isSecured ?? false,
      requires_badge: l.requires_badge ?? l.requiresBadge ?? false,
      is_refrigerated: l.is_refrigerated ?? l.isRefrigerated ?? false,
      max_capacity: l.max_capacity ?? l.maxCapacity,
      current_item_count: l.current_item_count ?? l.currentItemCount ?? 0,
      utilization_percentage: Number(
        l.utilization_percentage ?? l.utilizationPercentage ?? 0,
      ),
      temperature_min: l.temperature_min ?? l.temperatureMin,
      temperature_max: l.temperature_max ?? l.temperatureMax,
      temperature_current: l.temperature_current ?? l.temperatureCurrent,
      active: l.active !== false,
      temporarily_blocked: l.temporarily_blocked ?? l.temporarilyBlocked ?? false,
      blocked_reason: l.blocked_reason ?? l.blockedReason,
      blocked_until: l.blocked_until ?? l.blockedUntil,
    };
  }, [locRaw]);

  if (isLoading || !id) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !loc) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/locations"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <ErrorBanner message="Emplacement introuvable" onRetry={() => refetch()} />
      </div>
    );
  }

  const Icon = getLocationIcon(loc.location_type);
  const typeLabel = LOCATION_TYPE_LABELS[loc.location_type as LocationType] ?? loc.location_type;
  const utilization = loc.utilization_percentage ?? 0;
  const temp = loc.temperature_current != null ? Number(loc.temperature_current) : null;
  const tempMax = loc.temperature_max != null ? Number(loc.temperature_max) : null;
  const overTemp = temp != null && tempMax != null && temp > tempMax;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory/locations"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              loc.temporarily_blocked ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30",
            )}>
              <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {loc.name || loc.code}
              </h1>
              <p className="text-sm text-slate-500">
                {typeLabel} · {loc.code}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {loc.is_refrigerated && <Badge variant="info"><Thermometer className="w-3.5 h-3.5 mr-1" /> Réfrigéré</Badge>}
          {loc.is_secured && <Badge variant="warning"><Lock className="w-3.5 h-3.5 mr-1" /> Sécurisé</Badge>}
          {loc.temporarily_blocked && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="warning" className="cursor-help">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Bloqué
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{loc.blocked_reason ?? "Inventaire / Nettoyage"}</p>
                {loc.blocked_until && <p className="text-xs mt-1">Jusqu&apos;au {formatDate(loc.blocked_until)}</p>}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Bloqué : overlay visuel type "ruban scène de crime" */}
      {loc.temporarily_blocked && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Emplacement temporairement bloqué</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{loc.blocked_reason ?? "Inventaire ou nettoyage en cours"}</p>
                {loc.blocked_until && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    Jusqu&apos;au {formatDateTime(loc.blocked_until)}
                  </p>
                )}
              </div>
            </div>
            <ProtectedAction permission={Permission.INVENTORY_LOCATIONS_UPDATE}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => unblockMutation.mutate({ locationId: loc.id, body: { userId: "", userName: "Utilisateur" } })}
                disabled={unblockMutation.isPending}
              >
                Débloquer
              </Button>
            </ProtectedAction>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fiche technique */}
        <Card className={cn(loc.temporarily_blocked && "opacity-95")}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Fiche emplacement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-slate-500">Zone</dt>
              <dd className="text-slate-900 dark:text-slate-100">{loc.zone_code ?? "—"}</dd>
              <dt className="text-slate-500">Allée</dt>
              <dd>{loc.aisle_number ?? "—"}</dd>
              <dt className="text-slate-500">Niveau étagère</dt>
              <dd>{loc.shelf_level ?? "—"}</dd>
              <dt className="text-slate-500">Code position</dt>
              <dd>{loc.position_code ?? "—"}</dd>
              <dt className="text-slate-500">Capacité</dt>
              <dd>{loc.max_capacity != null ? `${loc.current_item_count ?? 0} / ${loc.max_capacity}` : "—"}</dd>
              <dt className="text-slate-500">Remplissage</dt>
              <dd>
                <span className={cn("font-medium", utilization >= 90 ? "text-red-600" : utilization >= 70 ? "text-amber-600" : "text-emerald-600")}>
                  {Math.round(utilization)}%
                </span>
              </dd>
              {temp != null && (
                <>
                  <dt className="text-slate-500">Température actuelle</dt>
                  <dd className={cn("font-mono", overTemp && "text-red-600 font-bold")}>{temp}°C</dd>
                </>
              )}
              {loc.temperature_min != null && (
                <>
                  <dt className="text-slate-500">Temp. min / max</dt>
                  <dd>{loc.temperature_min}°C / {loc.temperature_max ?? "—"}°C</dd>
                </>
              )}
            </dl>
            {/* Barre de capacité (heatmap fine) */}
            {loc.max_capacity != null && (
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-1">Remplissage</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", utilizationColor(utilization))}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-10 text-right">
                    {Math.round(utilization)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Find my Med — Carte de localisation 3D */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Find my Med — Localisation
            </CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              Plan de masse : le point indique la position (X, Y). La flèche indique la hauteur (Z).
            </p>
          </CardHeader>
          <CardContent>
            {loc.coordinates_3d ? (
              <FindMyMedMap coords={loc.coordinates_3d} name={loc.name || loc.code} />
            ) : (
              <EmptyState
                title="Coordonnées non définies"
                description="Ajoutez des coordonnées 3D (x, y, z) à cet emplacement pour activer la localisation « Find my Med »."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Température en direct + alerte si dépassement */}
      {loc.is_refrigerated && temp != null && (
        <Card className={cn(overTemp && "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/20")}>
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Thermometer className={cn("w-8 h-8", overTemp ? "text-red-600 animate-pulse" : "text-cyan-600")} />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Température en direct</p>
                <p className={cn("text-2xl font-mono font-bold", overTemp ? "text-red-600" : "text-slate-700 dark:text-slate-300")}>
                  {temp}°C
                </p>
                {overTemp && tempMax != null && (
                  <p className="text-sm text-red-600">Dépasse la limite max ({tempMax}°C)</p>
                )}
              </div>
            </div>
            {loc.temperature_max != null && (
              <p className="text-sm text-slate-500">Limite : {loc.temperature_min ?? "—"}°C à {loc.temperature_max}°C</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Zone sécurisée : rappel badge */}
      {loc.is_secured && loc.requires_badge && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Accès sécurisé</p>
              <p className="text-sm text-slate-500">Toute interaction avec cet emplacement requiert une authentification par badge.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FindMyMedMap({ coords, name }: { coords: Coordinates3D; name: string }) {
  const { x, y, z } = coords;
  const cx = Math.min(90, Math.max(10, 50 + (x ?? 0) * 2));
  const cy = Math.min(90, Math.max(10, 50 + (y ?? 0) * 2));
  const zLabel = z != null ? (z < 1.5 ? "Bas" : z < 2.5 ? "Milieu" : "Haut (escabeau)") : null;

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-square max-w-sm mx-auto bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
        {/* Grille de repère */}
        <div className="absolute inset-0 opacity-30">
          {[1, 2, 3, 4].map((i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-slate-400" style={{ top: `${20 * i}%` }} />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-slate-400" style={{ left: `${20 * i}%` }} />
          ))}
        </div>
        {/* Point rayonnant (Pulse) */}
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"
          style={{ left: `${cx}%`, top: `${cy}%` }}
        />
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500 border-opacity-60 animate-ping"
          style={{ left: `${cx}%`, top: `${cy}%`, animationDuration: "2s" }}
        />
      </div>
      <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
        <span className="font-mono">X: {x} · Y: {y} · Z: {z}</span>
        {zLabel && (
          <span className="flex items-center gap-1">
            {z != null && z >= 2.5 && <ArrowUp className="w-4 h-4 text-amber-500" title="Hauteur : escabeau" />}
            {z != null && z >= 1.5 && z < 2.5 && <Minus className="w-4 h-4" title="Hauteur : milieu" />}
            {z != null && z < 1.5 && <ArrowDown className="w-4 h-4 text-emerald-500" title="Hauteur : bas" />}
            {zLabel}
          </span>
        )}
      </div>
    </div>
  );
}
