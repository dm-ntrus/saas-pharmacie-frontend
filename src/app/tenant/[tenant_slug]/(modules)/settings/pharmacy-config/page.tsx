"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  usePharmacyConfigList,
  useCreatePharmacyConfig,
  useUpdatePharmacyConfig,
  useDeletePharmacyConfig,
  usePharmacyConfigKeys,
  usePharmacyConfigReset,
  usePharmacyConfigBulkImport,
} from "@/hooks/api/usePharmacyConfig";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import {
  Button,
  Card,
  CardContent,
  ErrorBanner,
  Skeleton,
  Badge,
  EmptyState,
  Modal,
} from "@/components/ui";
import {
  ArrowLeft,
  Sliders,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Pencil,
} from "lucide-react";
import { CATEGORY_LABELS, VALUE_TYPE_LABELS, Category, ValueType } from "@/types/pharmacy";
import type { CreatePharmacyConfigDto } from "@/types/pharmacy";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

const createConfigSchema = z.object({
  config_key: z.string().min(1, "Requis"),
  config_value: z.union([z.string(), z.number(), z.boolean()]),
  value_type: z.nativeEnum(ValueType),
  category: z.nativeEnum(Category),
  description: z.string().optional(),
  is_sensitive: z.boolean().optional(),
});

type CreateConfigForm = z.infer<typeof createConfigSchema>;

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

export default function PharmacyConfigPage() {
  return (
    <ModuleGuard
      module="settings"
      requiredPermissions={[Permission.ROLES_READ]}
    >
      <PharmacyConfigContent />
    </ModuleGuard>
  );
}

function PharmacyConfigContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const [categoryFilter, setCategoryFilter] = useState<Category | "">("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error, refetch } = usePharmacyConfigList({
    category: categoryFilter || undefined,
    search: search || undefined,
    limit: 100,
    offset: 0,
  });

  const createConfig = useCreatePharmacyConfig();
  const updateConfig = useUpdatePharmacyConfig();
  const deleteConfig = useDeletePharmacyConfig();
  const resetConfig = usePharmacyConfigReset();
  const bulkImport = usePharmacyConfigBulkImport();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateConfigForm>({
    resolver: zodResolver(createConfigSchema),
    defaultValues: {
      value_type: ValueType.string,
      category: Category.ui,
      config_value: "",
      is_sensitive: false,
    },
  });

  const valueType = watch("value_type");

  const onSubmit = (formData: CreateConfigForm) => {
    let value: unknown = formData.config_value;
    if (formData.value_type === ValueType.integer || formData.value_type === ValueType.float) {
      value = Number(formData.config_value);
    }
    if (formData.value_type === ValueType.boolean) {
      value = formData.config_value === true || formData.config_value === "true";
    }
    if (editingId) {
      updateConfig.mutate(
        {
          id: editingId,
          dto: {
            config_key: formData.config_key,
            config_value: value,
            value_type: formData.value_type,
            category: formData.category,
            description: formData.description,
            is_sensitive: formData.is_sensitive,
          },
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingId(null);
            reset();
          },
        }
      );
    } else {
      createConfig.mutate(
        {
          config_key: formData.config_key,
          config_value: value,
          value_type: formData.value_type,
          category: formData.category,
          description: formData.description,
          is_sensitive: formData.is_sensitive,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            reset();
          },
        }
      );
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result as string;
        const parsed = JSON.parse(raw) as unknown;
        const items = Array.isArray(parsed) ? parsed : [parsed];
        const dtos: CreatePharmacyConfigDto[] = items.map((item: Record<string, unknown>) => ({
          config_key: String(item.config_key ?? item.key ?? ""),
          config_value: item.config_value ?? item.value ?? "",
          value_type: (item.value_type ?? item.type ?? "string") as ValueType,
          category: (item.category ?? "ui") as Category,
          description: item.description != null ? String(item.description) : undefined,
          is_sensitive: Boolean(item.is_sensitive),
        }));
        if (dtos.length === 0 || !dtos[0].config_key) {
          toast.error("Fichier JSON invalide (tableau d'objets avec config_key, config_value, etc.)");
          return;
        }
        bulkImport.mutate(dtos, {
          onSuccess: () => refetch(),
          onSettled: () => {
            e.target.value = "";
          },
        });
      } catch {
        toast.error("Fichier JSON invalide");
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    if (!currentOrganization?.id) return;
    try {
      const url = `/pharmacy-config/export?organization_id=${encodeURIComponent(currentOrganization.id)}`;
      const json = await apiService.get<unknown[]>(url);
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `pharmacy-configs-${currentOrganization.id}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Export téléchargé");
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des configurations"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/settings"))}
        >
          Retour
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Configuration pharmacie
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Paramètres par catégorie pour l&apos;organisation courante
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
            disabled={bulkImport.isPending}
          >
            Importer
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button
            variant="default"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingId(null);
              reset({
                config_key: "",
                config_value: "",
                value_type: ValueType.string,
                category: Category.ui,
                description: "",
                is_sensitive: false,
              });
              setModalOpen(true);
            }}
          >
            Nouvelle configuration
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Rechercher (clé, description)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | "")}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              <option value="">Toutes les catégories</option>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucune configuration"
          description="Créez une entrée ou importez un fichier JSON."
          action={
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setModalOpen(true)}
            >
              Nouvelle configuration
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3">Clé</th>
                    <th className="text-left p-3">Valeur</th>
                    <th className="text-left p-3">Catégorie</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Sensible</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3 font-mono text-xs">{row.config_key}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {row.is_sensitive ? "***" : String(row.config_value)}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {CATEGORY_LABELS[row.category] ?? row.category}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {VALUE_TYPE_LABELS[row.value_type] ?? row.value_type}
                      </td>
                      <td className="p-3">{row.is_sensitive ? "Oui" : "Non"}</td>
                      <td className="p-3 text-right flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Pencil className="w-3 h-3" />}
                          onClick={() => {
                            setEditingId(row.id);
                            reset({
                              config_key: row.config_key,
                              config_value:
                                typeof row.config_value === "boolean"
                                  ? row.config_value
                                  : String(row.config_value ?? ""),
                              value_type: row.value_type,
                              category: row.category,
                              description: row.description ?? "",
                              is_sensitive: row.is_sensitive,
                            });
                            setModalOpen(true);
                          }}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<RefreshCw className="w-3 h-3" />}
                          onClick={() =>
                            resetConfig.mutate(row.id, { onSuccess: () => refetch() })
                          }
                          disabled={resetConfig.isPending}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          leftIcon={<Trash2 className="w-3 h-3" />}
                          onClick={() => {
                            if (window.confirm("Supprimer cette configuration ?")) {
                              deleteConfig.mutate(row.id, { onSuccess: () => refetch() });
                            }
                          }}
                          disabled={deleteConfig.isPending}
                        >
                          Suppr.
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 0 && (
              <p className="p-3 text-xs text-slate-500">
                {items.length} configuration(s)
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingId ? "Modifier la configuration" : "Nouvelle configuration"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Clé</label>
            <input
              {...register("config_key")}
              disabled={!!editingId}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-sm"
            />
            {errors.config_key && (
              <p className="text-xs text-red-500">{errors.config_key.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              {...register("value_type")}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            >
              {(Object.keys(VALUE_TYPE_LABELS) as ValueType[]).map((t) => (
                <option key={t} value={t}>
                  {VALUE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valeur</label>
            {valueType === ValueType.boolean ? (
              <select
                {...register("config_value", { setValueAs: (v) => v === "true" })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            ) : (
              <input
                {...register("config_value")}
                type={valueType === ValueType.integer || valueType === ValueType.float ? "number" : "text"}
                step={valueType === ValueType.float ? "any" : undefined}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            )}
            {errors.config_value && (
              <p className="text-xs text-red-500">{errors.config_value.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              {...register("description")}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_sensitive")} id="is_sensitive" />
            <label htmlFor="is_sensitive" className="text-sm">
              Donnée sensible (masquée)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createConfig.isPending || updateConfig.isPending}>
              {editingId ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
