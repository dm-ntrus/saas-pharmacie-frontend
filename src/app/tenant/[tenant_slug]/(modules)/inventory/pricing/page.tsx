"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useProductPrices,
  useCreateProductPrice,
  useUpdateProductPrice,
  useDeleteProductPrice,
} from "@/hooks/api/useInventory";
import { formatCurrency, formatDate } from "@/utils/formatters";
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
  DataTable,
} from "@/components/ui";
import type { Column } from "@/components/ui";
import {
  ArrowLeft,
  Plus,
  Search,
  Tag,
  Pencil,
  Trash2,
  DollarSign,
} from "lucide-react";

type PriceType = "sale" | "wholesale" | "insurance" | "promotional";

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  sale: "Vente",
  wholesale: "Gros",
  insurance: "Assurance",
  promotional: "Promotionnel",
};

const PRICE_TYPE_BADGE: Record<PriceType, "primary" | "info" | "warning" | "success"> = {
  sale: "primary",
  wholesale: "info",
  insurance: "warning",
  promotional: "success",
};

const priceSchema = z.object({
  product_id: z.string().min(1, "Le produit est requis"),
  product_name: z.string().optional(),
  price_type: z.enum(["sale", "wholesale", "insurance", "promotional"], {
    required_error: "Le type de prix est requis",
  }),
  price: z.coerce.number().positive("Le prix doit être positif"),
  min_quantity: z.coerce.number().int().min(1).optional(),
  effective_from: z.string().optional(),
  effective_to: z.string().optional(),
  notes: z.string().optional(),
});

type PriceFormData = z.infer<typeof priceSchema>;

interface ProductPrice extends Record<string, unknown> {
  id: string;
  product_id: string;
  product_name?: string;
  price_type: PriceType;
  price: number;
  min_quantity?: number;
  effective_from?: string;
  effective_to?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default function InventoryPricingPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.ORGANIZATION_PRODUCT_PRICES_READ]}
    >
      <PricingContent />
    </ModuleGuard>
  );
}

function PricingContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PriceType | "">("");
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null);

  const pricesQuery = useProductPrices();
  const pricesData = pricesQuery.data as any;
  const isLoading = pricesQuery.isLoading;
  const error = pricesQuery.error as any;
  const refetch = pricesQuery.refetch;
  const deleteMutation = useDeleteProductPrice();

  const prices: ProductPrice[] = useMemo(() => {
    const raw = pricesData?.data ?? (Array.isArray(pricesData) ? pricesData : []);
    return raw as ProductPrice[];
  }, [pricesData]);

  const filtered = useMemo(() => {
    return prices.filter((p) => {
      if (typeFilter && p.price_type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (p.product_name ?? "").toLowerCase().includes(q) ||
          (p.product_id ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prices, search, typeFilter]);

  const handleEdit = (price: ProductPrice) => {
    setEditingPrice(price);
    setShowModal(true);
  };

  const handleDelete = (priceId: string) => {
    if (confirm("Supprimer ce prix ?")) {
      deleteMutation.mutate(priceId);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrice(null);
  };

  const columns: Column<ProductPrice>[] = [
    {
      key: "product_name",
      title: "Produit",
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {row.product_name ?? row.product_id}
          </p>
        </div>
      ),
    },
    {
      key: "price_type",
      title: "Type",
      render: (_, row) => (
        <Badge variant={PRICE_TYPE_BADGE[row.price_type] ?? "default"} size="sm">
          {PRICE_TYPE_LABELS[row.price_type] ?? row.price_type}
        </Badge>
      ),
    },
    {
      key: "price",
      title: "Prix",
      align: "right",
      render: (_, row) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {formatCurrency(row.price)}
        </span>
      ),
    },
    {
      key: "min_quantity",
      title: "Qté min",
      align: "center",
      hideOnMobile: true,
      render: (_, row) => (
        <span className="text-sm text-slate-500">{row.min_quantity ?? "—"}</span>
      ),
    },
    {
      key: "effective_from",
      title: "Début",
      hideOnMobile: true,
      render: (_, row) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.effective_from as string | undefined)}
        </span>
      ),
    },
    {
      key: "effective_to",
      title: "Fin",
      hideOnMobile: true,
      render: (_, row) => (
        <span className="text-sm text-slate-500">
          {formatDate(row.effective_to as string | undefined)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (_, row) => (
        <div className="flex gap-1">
          <ProtectedAction permission={Permission.ORGANIZATION_PRODUCT_PRICES_UPDATE}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row)}
              leftIcon={<Pencil className="w-3 h-3" />}
            >
              Modifier
            </Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.ORGANIZATION_PRODUCT_PRICES_DELETE}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.id)}
              leftIcon={<Trash2 className="w-3 h-3 text-red-500" />}
              loading={deleteMutation.isPending}
            />
          </ProtectedAction>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Gestion des prix
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configurez les prix personnalisés de vos produits
            </p>
          </div>
        </div>
        <ProtectedAction permission={Permission.ORGANIZATION_PRODUCT_PRICES_CREATE}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingPrice(null);
              setShowModal(true);
            }}
          >
            Nouveau prix
          </Button>
        </ProtectedAction>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={typeFilter === "" ? "info" : "default"}
            className="cursor-pointer"
            onClick={() => setTypeFilter("")}
          >
            Tous
          </Badge>
          {(Object.keys(PRICE_TYPE_LABELS) as PriceType[]).map((t) => (
            <Badge
              key={t}
              variant={typeFilter === t ? "info" : "default"}
              className="cursor-pointer"
              onClick={() => setTypeFilter(t)}
            >
              {PRICE_TYPE_LABELS[t]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les prix"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-8 h-8 text-slate-400" />}
          title="Aucun prix configuré"
          description={
            search || typeFilter
              ? "Aucun résultat pour ces filtres."
              : "Ajoutez votre premier prix personnalisé."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
        />
      )}

      {/* Create/Edit Modal */}
      <PriceFormModal
        open={showModal}
        onOpenChange={handleCloseModal}
        editingPrice={editingPrice}
      />
    </div>
  );
}

function PriceFormModal({
  open,
  onOpenChange,
  editingPrice,
}: {
  open: boolean;
  onOpenChange: () => void;
  editingPrice: ProductPrice | null;
}) {
  const createMutation = useCreateProductPrice();
  const updateMutation = useUpdateProductPrice();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriceFormData>({
    resolver: zodResolver(priceSchema),
    defaultValues: editingPrice
      ? {
          product_id: editingPrice.product_id,
          product_name: editingPrice.product_name ?? "",
          price_type: editingPrice.price_type,
          price: editingPrice.price,
          min_quantity: editingPrice.min_quantity,
          effective_from: editingPrice.effective_from ?? "",
          effective_to: editingPrice.effective_to ?? "",
          notes: editingPrice.notes ?? "",
        }
      : {},
  });

  const onSubmit = (data: PriceFormData) => {
    if (editingPrice) {
      updateMutation.mutate(
        { priceId: editingPrice.id, data },
        {
          onSuccess: () => {
            reset();
            onOpenChange();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onOpenChange();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editingPrice ? "Modifier le prix" : "Nouveau prix personnalisé"}
      description="Configurez un prix spécifique pour un produit"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            ID produit
          </label>
          <input
            {...register("product_id")}
            placeholder="ID du produit"
            disabled={!!editingPrice}
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
          />
          {errors.product_id && (
            <p className="text-xs text-red-500 mt-1">{errors.product_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Type de prix
          </label>
          <select
            {...register("price_type")}
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Sélectionner...</option>
            {(Object.keys(PRICE_TYPE_LABELS) as PriceType[]).map((t) => (
              <option key={t} value={t}>
                {PRICE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {errors.price_type && (
            <p className="text-xs text-red-500 mt-1">{errors.price_type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Prix (XOF)
            </label>
            <input
              {...register("price")}
              type="number"
              step="1"
              min="0"
              placeholder="0"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Quantité minimum
            </label>
            <input
              {...register("min_quantity")}
              type="number"
              min="1"
              placeholder="1"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date début
            </label>
            <input
              {...register("effective_from")}
              type="date"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date fin
            </label>
            <input
              {...register("effective_to")}
              type="date"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes
          </label>
          <input
            {...register("notes")}
            placeholder="Notes optionnelles..."
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onOpenChange}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" loading={isPending}>
            {editingPrice ? "Enregistrer" : "Créer le prix"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
