"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import {
  useDocumentTemplates,
  useCreateDocumentTemplate,
  useDeleteDocumentTemplate,
  type DocumentTemplateType,
  type DocumentTemplateRow,
} from "@/hooks/api/useDocumentTemplates";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  ErrorBanner,
  Skeleton,
  Badge,
} from "@/components/ui";
import { FileText, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTenantPath } from "@/hooks/useTenantPath";

const DOC_TYPE_LABELS: Record<DocumentTemplateType, string> = {
  invoice: "Facture",
  receipt: "Ticket / reçu",
  quote: "Devis",
  purchase_order: "Bon de commande",
  credit_note: "Avoir",
  goods_return: "Bon de retour marchandises",
  delivery_note: "Bon de livraison",
};

const DOC_TYPES = Object.keys(DOC_TYPE_LABELS) as DocumentTemplateType[];

export default function DocumentTemplatesSettingsPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.INVOICES_READ]}>
      <DocumentTemplatesContent />
    </ModuleGuard>
  );
}

function DocumentTemplatesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: templates, isLoading, error, refetch } = useDocumentTemplates();
  const createMut = useCreateDocumentTemplate();
  const deleteMut = useDeleteDocumentTemplate();

  const [name, setName] = useState("");
  const [docType, setDocType] = useState<DocumentTemplateType>("invoice");
  const [bodyHtml, setBodyHtml] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMut.mutate(
      {
        docType,
        name: name.trim(),
        engine: "handlebars",
        bodyHtml: bodyHtml.trim() || undefined,
        isDefault,
      },
      {
        onSuccess: () => {
          setName("");
          setBodyHtml("");
          setIsDefault(false);
        },
      },
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/settings"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Modèles de documents
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Factures, tickets, devis, BC… Modèles HTML (handlebars ou texte) par pharmacie.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProtectedAction permission={Permission.INVOICES_UPDATE} hideIfDenied>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau modèle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type de document
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentTemplateType)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {DOC_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corps (HTML / handlebars)
              </label>
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                placeholder="{{pharmacyName}} — {{invoiceNumber}}"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded"
              />
              Définir comme modèle par défaut pour ce type
            </label>
              <Button type="submit" disabled={createMut.isPending || !name.trim()}>
                {createMut.isPending ? "Création…" : "Créer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ProtectedAction>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modèles enregistrés</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : error ? (
            <ErrorBanner message="Impossible de charger les modèles" onRetry={() => refetch()} />
          ) : !templates?.length ? (
            <p className="text-sm text-slate-500">Aucun modèle actif pour cette pharmacie.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-3 py-2">Nom</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Moteur</th>
                    <th className="px-3 py-2">Défaut</th>
                    <th className="px-3 py-2 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {templates.map((row: DocumentTemplateRow) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <td className="px-3 py-2 font-medium">{row.name}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                        {DOC_TYPE_LABELS[row.doc_type as DocumentTemplateType] ?? row.doc_type}
                      </td>
                      <td className="px-3 py-2">{row.engine}</td>
                      <td className="px-3 py-2">
                        {row.is_default ? (
                          <Badge variant="success">Oui</Badge>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <ProtectedAction permission={Permission.INVOICES_DELETE} hideIfDenied>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                            onClick={() => {
                              if (typeof window !== "undefined" && !window.confirm("Supprimer ce modèle ?"))
                                return;
                              deleteMut.mutate(row.id);
                            }}
                            disabled={deleteMut.isPending}
                          >
                            Supprimer
                          </Button>
                        </ProtectedAction>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
