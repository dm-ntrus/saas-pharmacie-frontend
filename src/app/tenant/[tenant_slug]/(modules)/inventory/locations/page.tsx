"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useLocations,
  useCapacityDashboard,
  useOverstockedLocations,
} from "@/hooks/api/useInventory";
import type { InventoryLocation } from "@/types/inventory";
import {
  LocationType,
  LOCATION_TYPE_LABELS,
} from "@/types/inventory";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import {
  ArrowLeft,
  Plus,
  Search,
  MapPin,
  Thermometer,
  Lock,
  Package,
  ChevronRight,
  LayoutGrid,
  Layers,
  BarChart3,
  List,
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
} from "lucide-react";
import { cn } from "@/utils/cn";

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

function normalizeLoc(loc: any): InventoryLocation {
  return {
    id: loc.id,
    code: loc.code ?? loc.id,
    name: loc.name ?? loc.code ?? "—",
    parent_location_id: loc.parent_location_id ?? loc.parentLocationId ?? null,
    location_type: loc.location_type ?? loc.locationType ?? "shelf",
    zone_code: loc.zone_code ?? loc.zoneCode,
    aisle_number: loc.aisle_number ?? loc.aisleNumber,
    shelf_level: loc.shelf_level ?? loc.shelfLevel,
    position_code: loc.position_code ?? loc.positionCode,
    coordinates_3d: loc.coordinates_3d ?? loc.coordinates3d,
    is_secured: loc.is_secured ?? loc.isSecured ?? false,
    requires_badge: loc.requires_badge ?? loc.requiresBadge ?? false,
    is_refrigerated: loc.is_refrigerated ?? loc.isRefrigerated ?? false,
    max_capacity: loc.max_capacity ?? loc.maxCapacity,
    current_item_count: loc.current_item_count ?? loc.currentItemCount ?? loc.current_items ?? 0,
    utilization_percentage: Number(
      loc.utilization_percentage ?? loc.utilizationPercentage ?? loc.usage_percent ?? 
      (loc.max_capacity && loc.current_item_count ? (loc.current_item_count / loc.max_capacity) * 100 : 0)
    ),
    temperature_min: loc.temperature_min ?? loc.temperatureMin,
    temperature_max: loc.temperature_max ?? loc.temperatureMax,
    temperature_current: loc.temperature_current ?? loc.temperatureCurrent,
    active: loc.active !== false,
    temporarily_blocked: loc.temporarily_blocked ?? loc.temporarilyBlocked ?? loc.blocked ?? false,
    blocked_reason: loc.blocked_reason ?? loc.blockedReason,
    blocked_until: loc.blocked_until ?? loc.blockedUntil,
  };
}

function utilizationColor(pct: number): string {
  if (pct < 10) return "bg-slate-300 dark:bg-slate-600";
  if (pct <= 80) return "bg-emerald-500";
  if (pct < 90) return "bg-amber-500";
  return "bg-red-500";
}

export default function InventoryLocationsPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_LOCATIONS_READ]}>
      <TooltipProvider>
        <LocationsContent />
      </TooltipProvider>
    </ModuleGuard>
  );
}

type ViewMode = "hierarchy" | "rack" | "heatmap" | "list";

function LocationsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("hierarchy");
  const [breadcrumb, setBreadcrumb] = useState<InventoryLocation[]>([]);
  const [badgeModalLoc, setBadgeModalLoc] = useState<InventoryLocation | null>(null);
  const [selectedLocForDetail, setSelectedLocForDetail] = useState<InventoryLocation | null>(null);

  const { data: locationsRaw, isLoading, error, refetch } = useLocations();
  const { data: dashboard } = useCapacityDashboard();
  const { data: overstocked } = useOverstockedLocations(90);

  const locations: InventoryLocation[] = useMemo(() => {
    const list = Array.isArray(locationsRaw) ? locationsRaw : dashboard?.locations ?? [];
    if (Array.isArray(list)) return list.map(normalizeLoc);
    return [];
  }, [locationsRaw, dashboard?.locations]);

  const overstockedIds = useMemo(
    () => new Set((overstocked ?? []).map((l: any) => l.id ?? l)),
    [overstocked],
  );

  const tree = useMemo(() => {
    const byParent = new Map<string | null, InventoryLocation[]>();
    byParent.set(null, []);
    locations.forEach((loc) => {
      const pid = loc.parent_location_id ?? null;
      if (!byParent.has(pid)) byParent.set(pid, []);
      byParent.get(pid)!.push(loc);
    });
    byParent.get(null)!.sort((a, b) => (a.name || a.code).localeCompare(b.name || b.code));
    byParent.forEach((arr) => arr.sort((a, b) => (a.name || a.code).localeCompare(b.name || b.code)));
    return byParent;
  }, [locations]);

  const currentLevel = useMemo(() => {
    const parentId = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].id : null;
    return tree.get(parentId) ?? [];
  }, [tree, breadcrumb]);

  const rackLocations = useMemo(() => {
    return locations.filter(
      (l) => (l.shelf_level || l.position_code) && ["shelf", "drawer", "refrigerator", "freezer", "secure_cabinet"].includes(String(l.location_type).toLowerCase()),
    );
  }, [locations]);

  const filteredList = useMemo(() => {
    if (!search.trim()) return locations;
    const q = search.toLowerCase();
    return locations.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.code?.toLowerCase().includes(q) ||
        l.zone_code?.toLowerCase().includes(q),
    );
  }, [locations, search]);

  const handleDrill = (loc: InventoryLocation) => {
    const hasChildren = tree.has(loc.id) && (tree.get(loc.id)?.length ?? 0) > 0;
    if (hasChildren) setBreadcrumb((prev) => [...prev, loc]);
    else router.push(buildPath(`/inventory/locations/${loc.id}`));
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumb((prev) => prev.slice(0, index + 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Emplacements
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Navigation hiérarchique, vue rack et heatmap de capacité
            </p>
          </div>
          <ProtectedAction permission={Permission.INVENTORY_LOCATIONS_CREATE}>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/inventory/locations/new"))}
            >
              Nouvel emplacement
            </Button>
          </ProtectedAction>
        </div>

        {/* Breadcrumb (fil d'Ariane) */}
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => setBreadcrumb([])}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Tous les emplacements</span>
          </button>
          {breadcrumb.map((loc, i) => {
            const Icon = getLocationIcon(loc.location_type);
            return (
              <React.Fragment key={loc.id}>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(i)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{loc.name || loc.code}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* KPIs + View toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {dashboard && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {dashboard.total_locations ?? locations.length}
                  </p>
                  <p className="text-xs text-slate-500">Emplacements</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">
                    {dashboard.available ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500">Disponibles</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">
                    {dashboard.near_capacity ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500">Proches capacité</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xl font-bold text-red-600">
                    {overstocked?.length ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">Surchargés</p>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
            {[
              { key: "hierarchy" as ViewMode, label: "Hiérarchie", icon: Layers },
              { key: "rack" as ViewMode, label: "Rack", icon: LayoutGrid },
              { key: "heatmap" as ViewMode, label: "Remplissage", icon: BarChart3 },
              { key: "list" as ViewMode, label: "Liste", icon: List },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  viewMode === key
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                )}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {viewMode !== "hierarchy" && (
          <Input
            placeholder="Rechercher (nom, code, zone)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les emplacements"
          onRetry={() => refetch()}
        />
      ) : viewMode === "hierarchy" && currentLevel.length === 0 && breadcrumb.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8 text-slate-400" />}
          title="Aucun emplacement"
          description="Configurez vos emplacements de stockage ou créez le premier."
        />
      ) : viewMode === "hierarchy" ? (
        <HierarchyView
          currentLevel={currentLevel}
          tree={tree}
          onDrill={handleDrill}
          onOpenDetail={setSelectedLocForDetail}
          overstockedIds={overstockedIds}
          onSecuredClick={(loc) => (loc.requires_badge ? setBadgeModalLoc(loc) : setSelectedLocForDetail(loc))}
        />
      ) : viewMode === "rack" ? (
        <RackView
          locations={search ? filteredList.filter((l) => l.shelf_level || l.position_code) : rackLocations}
          onOpenDetail={setSelectedLocForDetail}
          onSecuredClick={(loc) => (loc.requires_badge ? setBadgeModalLoc(loc) : setSelectedLocForDetail(loc))}
        />
      ) : viewMode === "heatmap" ? (
        <HeatmapView
          locations={search ? filteredList : locations}
          overstockedIds={overstockedIds}
        />
      ) : (
        <ListView
          locations={filteredList}
          overstockedIds={overstockedIds}
          onOpenDetail={setSelectedLocForDetail}
        />
      )}

      {/* Modal badge requis (zone sécurisée) */}
      {badgeModalLoc && (
        <Modal
          open={!!badgeModalLoc}
          onClose={() => setBadgeModalLoc(null)}
          title="Accès sécurisé"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              L&apos;emplacement <strong>{badgeModalLoc.name || badgeModalLoc.code}</strong> requiert
              une authentification par badge pour toute interaction.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setBadgeModalLoc(null)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  setSelectedLocForDetail(badgeModalLoc);
                  setBadgeModalLoc(null);
                }}
              >
                Continuer (badge validé)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedLocForDetail && (
        <Modal
          open={!!selectedLocForDetail}
          onClose={() => setSelectedLocForDetail(null)}
          title={selectedLocForDetail.name || selectedLocForDetail.code}
        >
          <LocationDetailModal
            loc={selectedLocForDetail}
            onClose={() => setSelectedLocForDetail(null)}
            onNavigate={() => {
              setSelectedLocForDetail(null);
              router.push(buildPath(`/inventory/locations/${selectedLocForDetail.id}`));
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function HierarchyView({
  currentLevel,
  tree,
  onDrill,
  onOpenDetail,
  overstockedIds,
  onSecuredClick,
}: {
  currentLevel: InventoryLocation[];
  tree: Map<string | null, InventoryLocation[]>;
  onDrill: (loc: InventoryLocation) => void;
  onOpenDetail: (loc: InventoryLocation) => void;
  overstockedIds: Set<string>;
  onSecuredClick: (loc: InventoryLocation) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentLevel.map((loc) => {
        const hasChildren = tree.has(loc.id) && (tree.get(loc.id)?.length ?? 0) > 0;
        const Icon = getLocationIcon(loc.location_type);
        const typeLabel = LOCATION_TYPE_LABELS[loc.location_type as LocationType] ?? loc.location_type;
        const utilization = loc.utilization_percentage ?? 0;
        const isOver = overstockedIds.has(loc.id);

        return (
          <Card
            key={loc.id}
            className={cn(
              "transition-all hover:border-emerald-300 dark:hover:border-emerald-700",
              loc.temporarily_blocked && "opacity-90",
              isOver && "border-red-200 dark:border-red-800",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {loc.name || loc.code}
                    </p>
                    <p className="text-xs text-slate-500">{typeLabel}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {loc.is_refrigerated && (
                    <Badge variant="info" size="sm">
                      <Thermometer className="w-3 h-3" />
                    </Badge>
                  )}
                  {loc.is_secured && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSecuredClick(loc);
                      }}
                      className="rounded p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      title="Zone sécurisée"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                  {loc.temporarily_blocked && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="rounded p-1 text-amber-600 bg-amber-100 dark:bg-amber-900/30">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bloqué: {loc.blocked_reason ?? "Inventaire / Nettoyage"}</p>
                        {loc.blocked_until && (
                          <p className="text-xs mt-1">Jusqu&apos;au {formatDate(loc.blocked_until)}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Heatmap bar (vertical) - capacité */}
              {loc.max_capacity != null && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-12 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex flex-col-reverse">
                    <div
                      className={cn("w-full rounded-full transition-all min-h-[2px]", utilizationColor(utilization))}
                      style={{ height: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{Math.round(utilization)}%</span>
                    <br />
                    {loc.current_item_count} / {loc.max_capacity}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                {hasChildren ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onDrill(loc)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Ouvrir
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenDetail(loc)}
                >
                  Détail
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RackView({
  locations,
  onOpenDetail,
  onSecuredClick,
}: {
  locations: InventoryLocation[];
  onOpenDetail: (loc: InventoryLocation) => void;
  onSecuredClick: (loc: InventoryLocation) => void;
}) {
  const grid = useMemo(() => {
    const byShelf = new Map<string, InventoryLocation[]>();
    locations.forEach((loc) => {
      const shelf = loc.shelf_level ?? loc.zone_code ?? "default";
      if (!byShelf.has(shelf)) byShelf.set(shelf, []);
      byShelf.get(shelf)!.push(loc);
    });
    byShelf.forEach((arr) => arr.sort((a, b) => (a.position_code || "").localeCompare(b.position_code || "")));
    return byShelf;
  }, [locations]);

  const shelves = Array.from(grid.keys()).sort();

  return (
    <div className="space-y-6">
      {shelves.length === 0 ? (
        <EmptyState
          title="Aucune donnée rack"
          description="Les emplacements avec niveau d'étagère et code position apparaîtront ici."
        />
      ) : (
        shelves.map((shelfKey) => (
          <Card key={shelfKey}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                Niveau {shelfKey}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                {(grid.get(shelfKey) ?? []).map((loc) => (
                  <RackCell
                    key={loc.id}
                    loc={loc}
                    onOpen={onOpenDetail}
                    onSecuredClick={onSecuredClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function RackCell({
  loc,
  onOpen,
  onSecuredClick,
}: {
  loc: InventoryLocation;
  onOpen: (loc: InventoryLocation) => void;
  onSecuredClick: (loc: InventoryLocation) => void;
}) {
  const temp = loc.temperature_current != null ? Number(loc.temperature_current) : null;
  const tempMax = loc.temperature_max != null ? Number(loc.temperature_max) : null;
  const overTemp = temp != null && tempMax != null && temp > tempMax;
  const utilization = loc.utilization_percentage ?? 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => (loc.requires_badge ? onSecuredClick(loc) : onOpen(loc))}
          className={cn(
            "relative w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all hover:scale-105 hover:border-emerald-400 dark:hover:border-emerald-600",
            "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
            loc.is_refrigerated && "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800",
            loc.temporarily_blocked && "opacity-80 bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)] dark:bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(255,255,255,0.05)_4px,rgba(255,255,255,0.05)_8px)]",
            overTemp && "animate-pulse border-red-400 dark:border-red-500",
          )}
        >
          {loc.is_secured && (
            <span className="absolute top-1 right-1 text-amber-600 dark:text-amber-400">
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
          {temp != null && (
            <span className={cn("absolute top-1 left-1 text-xs font-mono", overTemp ? "text-red-600 font-bold" : "text-slate-500")}>
              {temp}°C
            </span>
          )}
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-full px-1">
            {loc.position_code || loc.code || loc.name}
          </span>
          <span className="text-slate-500 mt-0.5">{Math.round(utilization)}%</span>
          {loc.temporarily_blocked && (
            <span className="absolute inset-0 flex items-center justify-center bg-amber-500/10 rounded-lg" title={`Bloqué: ${loc.blocked_reason ?? ""} Jusqu'au ${loc.blocked_until ?? ""}`} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{loc.name || loc.code}</p>
        <p className="text-xs">Capacité: {Math.round(utilization)}%</p>
        {loc.temperature_current != null && <p className="text-xs">Température: {loc.temperature_current}°C</p>}
        {loc.temporarily_blocked && (
          <p className="text-xs text-amber-600 mt-1">
            Bloqué: {loc.blocked_reason} — Jusqu&apos;au {formatDate(loc.blocked_until)}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function HeatmapView({
  locations,
  overstockedIds,
}: {
  locations: InventoryLocation[];
  overstockedIds: Set<string>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Remplissage par emplacement
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          &lt;10% gris (vide) · 10-80% vert (optimal) · 90%+ orange/rouge (alerte putaway)
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          {locations.map((loc) => {
            const pct = loc.utilization_percentage ?? 0;
            const isOver = overstockedIds.has(loc.id);
            return (
              <div
                key={loc.id}
                className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="w-32 shrink-0 text-sm font-medium text-slate-900 dark:text-slate-100 truncate" title={loc.name || loc.code}>
                  {loc.name || loc.code}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full max-w-xs h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className={cn("h-full rounded-full transition-all", utilizationColor(pct), isOver && "ring-2 ring-red-400")}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-400 w-12 text-right">
                    {Math.round(pct)}%
                  </span>
                </div>
                <span className="text-xs text-slate-500 w-20 text-right">
                  {loc.current_item_count ?? 0} / {loc.max_capacity ?? "—"}
                </span>
              </div>
            );
          })}
        </div>
        {locations.length === 0 && (
          <EmptyState title="Aucun emplacement" description="Aucune donnée à afficher." />
        )}
      </CardContent>
    </Card>
  );
}

function ListView({
  locations,
  overstockedIds,
  onOpenDetail,
}: {
  locations: InventoryLocation[];
  overstockedIds: Set<string>;
  onOpenDetail: (loc: InventoryLocation) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((loc) => {
        const utilization = loc.utilization_percentage ?? 0;
        const isOver = overstockedIds.has(loc.id);
        const Icon = getLocationIcon(loc.location_type);
        return (
          <Card
            key={loc.id}
            className={cn(
              "hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer",
              loc.temporarily_blocked && "opacity-90",
              isOver && "border-red-200 dark:border-red-800",
            )}
            onClick={() => onOpenDetail(loc)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{loc.name ?? loc.code}</p>
                    <p className="text-xs text-slate-500">{loc.zone_code ?? loc.location_type ?? "—"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {loc.is_refrigerated && <Badge variant="info" size="sm"><Thermometer className="w-3 h-3" /></Badge>}
                  {loc.is_secured && <Badge variant="warning" size="sm"><Lock className="w-3 h-3" /></Badge>}
                  {loc.temporarily_blocked && <Badge variant="warning" size="sm">Bloqué</Badge>}
                </div>
              </div>
              {loc.max_capacity != null && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Capacité</span>
                    <span>{Math.round(utilization)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", utilizationColor(utilization))}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {loc.current_item_count ?? 0} / {loc.max_capacity} articles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function LocationDetailModal({
  loc,
  onClose,
  onNavigate,
}: {
  loc: InventoryLocation;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const Icon = getLocationIcon(loc.location_type);
  const typeLabel = LOCATION_TYPE_LABELS[loc.location_type as LocationType] ?? loc.location_type;
  const utilization = loc.utilization_percentage ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{loc.name || loc.code}</p>
          <p className="text-sm text-slate-500">{typeLabel} · {loc.code}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        {loc.zone_code && <><dt className="text-slate-500">Zone</dt><dd>{loc.zone_code}</dd></>}
        {loc.aisle_number && <><dt className="text-slate-500">Allée</dt><dd>{loc.aisle_number}</dd></>}
        {loc.shelf_level && <><dt className="text-slate-500">Niveau</dt><dd>{loc.shelf_level}</dd></>}
        {loc.position_code && <><dt className="text-slate-500">Position</dt><dd>{loc.position_code}</dd></>}
        {loc.max_capacity != null && (
          <>
            <dt className="text-slate-500">Capacité</dt>
            <dd>{loc.current_item_count ?? 0} / {loc.max_capacity} ({Math.round(utilization)}%)</dd>
          </>
        )}
        {loc.temperature_current != null && (
          <><dt className="text-slate-500">Température</dt><dd>{loc.temperature_current}°C</dd></>
        )}
        {loc.temporarily_blocked && (
          <>
            <dt className="text-slate-500">Bloqué</dt>
            <dd className="text-amber-600">{loc.blocked_reason ?? "—"} {loc.blocked_until && `jusqu'au ${formatDate(loc.blocked_until)}`}</dd>
          </>
        )}
      </dl>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>Fermer</Button>
        <Button onClick={onNavigate}>Voir la fiche complète</Button>
      </div>
    </div>
  );
}
