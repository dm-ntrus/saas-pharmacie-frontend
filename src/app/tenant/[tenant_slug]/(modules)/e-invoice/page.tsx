"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter,
  Button, Badge, Input, Select, Modal, Skeleton, EmptyState, ErrorBanner,
  DataTable, type Column,
  Tabs, TabsList, TabsTrigger, TabsContent,
  BarChartWidget, PieChartWidget,
} from "@/components/ui";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "@/utils/formatters";
import {
  FileText, Settings, BarChart3, Send, Download, CheckCircle,
  XCircle, AlertTriangle, RefreshCw, Shield, Globe, Eye,
  RotateCcw, Plus,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════════════════════════════

const credentialsSchema = z.object({
  provider: z.enum(["obr", "dgi"]),
  tin: z.string().min(4, "NIF requis"),
  username: z.string().min(2, "Identifiant requis"),
  password: z.string().min(4, "Mot de passe requis"),
  environment: z.enum(["sandbox", "production"]),
  api_url: z.string().url("URL API invalide").optional().or(z.literal("")),
});

const submitInvoiceSchema = z.object({
  invoice_id: z.string().min(1, "Facture requise"),
  customer_tin: z.string().optional(),
  customer_name: z.string().optional(),
  customer_address: z.string().optional(),
  is_b2b: z.boolean().optional(),
});

const cancelInvoiceSchema = z.object({
  reason: z.string().min(5, "Motif requis (min. 5 caractères)"),
});

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "primary";

const FISCAL_STATUS_BADGE: Record<string, BadgeVariant> = {
  pending: "warning",
  submitted: "info",
  accepted: "success",
  rejected: "danger",
  cancelled: "default",
};

const FISCAL_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  submitted: "Soumise",
  accepted: "Acceptée",
  rejected: "Rejetée",
  cancelled: "Annulée",
};

// ═══════════════════════════════════════════════════════════════
// API HOOKS
// ═══════════════════════════════════════════════════════════════

function useFiscalInvoices(params?: { status?: string }) {
  return useQuery({
    queryKey: ["fiscal-invoices", params],
    queryFn: () => apiService.get("/e-invoice/invoices", { params }),
  });
}

function useFiscalInvoiceById(id: string) {
  return useQuery({
    queryKey: ["fiscal-invoice", id],
    queryFn: () => apiService.get(`/e-invoice/invoices/${id}`),
    enabled: !!id,
  });
}

function useCredentialsSummary() {
  return useQuery({
    queryKey: ["e-invoice-credentials-summary"],
    queryFn: () => apiService.get("/e-invoice/credentials/summary"),
  });
}

function useSaveCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post("/e-invoice/credentials", data),
    onSuccess: () => {
      toast.success("Credentials sauvegardées");
      qc.invalidateQueries({ queryKey: ["e-invoice-credentials-summary"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useTestCredentials() {
  return useMutation({
    mutationFn: (provider: string) =>
      apiService.post("/e-invoice/credentials/test", { provider }),
    onSuccess: (data: any) => {
      if (data?.success) toast.success("Connexion réussie");
      else toast.error(data?.message ?? "Échec de connexion");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useSwitchEnvironment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (environment: string) =>
      apiService.patch("/e-invoice/credentials/environment", { environment }),
    onSuccess: () => {
      toast.success("Environnement modifié");
      qc.invalidateQueries({ queryKey: ["e-invoice-credentials-summary"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useSubmitInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post("/e-invoice/invoices/submit", data),
    onSuccess: () => {
      toast.success("Facture soumise");
      qc.invalidateQueries({ queryKey: ["fiscal-invoices"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useCancelFiscalInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.post(`/e-invoice/invoices/${id}/cancel`, { reason }),
    onSuccess: () => {
      toast.success("Facture annulée");
      qc.invalidateQueries({ queryKey: ["fiscal-invoices"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useRetryInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      apiService.post(`/e-invoice/invoices/${id}/retry`, { force }),
    onSuccess: () => {
      toast.success("Nouvelle tentative lancée");
      qc.invalidateQueries({ queryKey: ["fiscal-invoices"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useFiscalReport(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ["fiscal-report", params],
    queryFn: () => apiService.get("/e-invoice/reports", { params }),
    enabled: !!params?.start_date && !!params?.end_date,
  });
}

function useAuditLogs() {
  return useQuery({
    queryKey: ["fiscal-audit-logs"],
    queryFn: () => apiService.get("/e-invoice/audit-logs"),
  });
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function EInvoicePage() {
  return (
    <ModuleGuard module="e-invoice" requiredPermissions={[Permission.FISCAL_INVOICES_READ]}>
      <EInvoiceContent />
    </ModuleGuard>
  );
}

function EInvoiceContent() {
  const tabItems = [
    { value: "invoices", label: "Factures fiscales", icon: FileText },
    { value: "config", label: "Configuration", icon: Settings },
    { value: "stats", label: "Statistiques", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Facturation Électronique</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Soumission et suivi des factures fiscales OBR/DGI
        </p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="max-sm:hidden">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="invoices"><FiscalInvoicesTab /></TabsContent>
        <TabsContent value="config"><ConfigurationTab /></TabsContent>
        <TabsContent value="stats"><StatisticsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. FACTURES FISCALES TAB
// ═══════════════════════════════════════════════════════════════

function FiscalInvoicesTab() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: invoices, isLoading, error } = useFiscalInvoices(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const submitInvoice = useSubmitInvoice();
  const cancelInvoice = useCancelFiscalInvoice();
  const retryInvoice = useRetryInvoice();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [detailId, setDetailId] = useState("");
  const { data: detail, isLoading: loadingDetail } = useFiscalInvoiceById(detailId);

  const submitForm = useForm<z.infer<typeof submitInvoiceSchema>>({
    resolver: zodResolver(submitInvoiceSchema),
    defaultValues: { invoice_id: "", customer_tin: "", customer_name: "", customer_address: "", is_b2b: false },
  });

  const cancelForm = useForm<z.infer<typeof cancelInvoiceSchema>>({
    resolver: zodResolver(cancelInvoiceSchema),
    defaultValues: { reason: "" },
  });

  const onSubmitInvoice = (data: z.infer<typeof submitInvoiceSchema>) => {
    submitInvoice.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowSubmitModal(false); submitForm.reset(); },
    });
  };

  const onCancelInvoice = (data: z.infer<typeof cancelInvoiceSchema>) => {
    if (!cancelTarget) return;
    cancelInvoice.mutate({ id: cancelTarget, reason: data.reason }, {
      onSuccess: () => { setCancelTarget(null); cancelForm.reset(); },
    });
  };

  const invList = (invoices ?? []) as any[];

  const handleDownloadPdf = async (id: string) => {
    try {
      const res = await apiService.get<{ pdf?: string | { type: string; data: number[] }; filename?: string }>(`/e-invoice/invoices/${id}/pdf`);
      const filename = res?.filename ?? "facture-fiscale.pdf";
      let blob: Blob;
      if (typeof res?.pdf === "string") {
        const bin = atob(res.pdf);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        blob = new Blob([bytes], { type: "application/pdf" });
      } else if (res?.pdf && typeof res.pdf === "object" && Array.isArray((res.pdf as { data?: number[] }).data)) {
        blob = new Blob([new Uint8Array((res.pdf as { data: number[] }).data)], { type: "application/pdf" });
      } else {
        toast.error("PDF non disponible");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erreur lors du téléchargement du PDF");
    }
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "invoice_number", title: "N° Facture", sortable: true,
      render: (_, row: any) => (
        <button className="text-sm font-mono text-emerald-600 hover:underline" onClick={() => setDetailId(row.id)}>
          {row.invoice_number ?? row.fiscal_invoice_number ?? "—"}
        </button>
      ) },
    { key: "customer_name", title: "Client" },
    { key: "total_amount", title: "Montant", align: "right", sortable: true,
      render: (_, row: any) => <span className="font-semibold">{formatCurrency(row.total_amount ?? row.amount ?? 0)}</span> },
    { key: "created_at", title: "Date", hideOnMobile: true, sortable: true,
      render: (_, row: any) => formatDate(row.created_at ?? row.submission_date) },
    { key: "fiscal_status", title: "Statut",
      render: (_, row: any) => {
        const s = row.fiscal_status ?? row.status;
        return <Badge variant={FISCAL_STATUS_BADGE[s] ?? "default"} size="sm">{FISCAL_STATUS_LABELS[s] ?? s}</Badge>;
      } },
    { key: "actions", title: "", align: "right",
      render: (_, row: any) => {
        const s = row.fiscal_status ?? row.status;
        return (
          <div className="flex items-center gap-1">
            {s === "rejected" && (
              <ProtectedAction permission={Permission.FISCAL_INVOICES_RETRY}>
                <Button size="sm" variant="ghost" onClick={() => retryInvoice.mutate({ id: row.id })}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Retenter</Button>
              </ProtectedAction>
            )}
            {(s === "accepted" || s === "submitted") && (
              <ProtectedAction permission={Permission.FISCAL_INVOICES_CANCEL}>
                <Button size="sm" variant="ghost" onClick={() => setCancelTarget(row.id)}
                  leftIcon={<XCircle className="w-3.5 h-3.5 text-red-500" />} />
              </ProtectedAction>
            )}
            <ProtectedAction permission={Permission.FISCAL_INVOICES_READ}>
              <Button size="sm" variant="ghost" onClick={() => handleDownloadPdf(row.id)}
                leftIcon={<Download className="w-3.5 h-3.5" />} title="Télécharger PDF" />
            </ProtectedAction>
          </div>
        );
      } },
  ];

  if (error) return <ErrorBanner title="Erreur" message="Impossible de charger les factures fiscales" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select
          options={[
            { value: "", label: "Tous statuts" },
            ...Object.entries(FISCAL_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-48"
        />
        <ProtectedAction permission={Permission.FISCAL_INVOICES_SUBMIT}>
          <Button onClick={() => setShowSubmitModal(true)} leftIcon={<Send className="w-4 h-4" />}>
            Soumettre une facture
          </Button>
        </ProtectedAction>
      </div>

      <DataTable
        columns={columns}
        data={invList as Record<string, unknown>[]}
        loading={isLoading}
        emptyTitle="Aucune facture fiscale"
        emptyDescription="Les factures soumises à l'OBR/DGI apparaîtront ici"
        rowKey={r => (r as any).id}
      />

      {/* Detail Modal */}
      <Modal open={!!detailId} onOpenChange={() => setDetailId("")} title="Détails de la facture fiscale" size="lg">
        {loadingDetail ? <Skeleton className="h-48 w-full rounded-xl" /> : detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["N° Facture", (detail as any).invoice_number ?? (detail as any).fiscal_invoice_number],
                ["Client", (detail as any).customer_name],
                ["Montant", formatCurrency((detail as any).total_amount ?? (detail as any).amount ?? 0)],
                ["Date de soumission", formatDateTime((detail as any).created_at ?? (detail as any).submission_date)],
                ["NIF Client", (detail as any).customer_tin ?? "—"],
                ["Signature fiscale", (detail as any).fiscal_signature ? "Oui" : "Non"],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-xs text-slate-500">{label as string}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Statut:</span>
              <Badge variant={FISCAL_STATUS_BADGE[(detail as any).fiscal_status ?? (detail as any).status] ?? "default"}>
                {FISCAL_STATUS_LABELS[(detail as any).fiscal_status ?? (detail as any).status] ?? (detail as any).fiscal_status}
              </Badge>
            </div>
            {(detail as any).rejection_reason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Motif de rejet: {(detail as any).rejection_reason}
                </p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState title="Facture non trouvée" />
        )}
      </Modal>

      {/* Submit Modal */}
      <Modal open={showSubmitModal} onOpenChange={setShowSubmitModal} title="Soumettre une facture" size="md">
        <form onSubmit={submitForm.handleSubmit(onSubmitInvoice)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Facture *</label>
            <Input {...submitForm.register("invoice_id")} placeholder="ID de la facture à soumettre" />
            {submitForm.formState.errors.invoice_id && <p className="text-xs text-red-500 mt-1">{submitForm.formState.errors.invoice_id.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIF Client</label>
              <Input {...submitForm.register("customer_tin")} placeholder="NIF (optionnel)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom Client</label>
              <Input {...submitForm.register("customer_name")} placeholder="Nom" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse Client</label>
            <Input {...submitForm.register("customer_address")} placeholder="Adresse" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...submitForm.register("is_b2b")}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Facture B2B (inter-entreprises)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)}>Annuler</Button>
            <Button type="submit" loading={submitInvoice.isPending} leftIcon={<Send className="w-4 h-4" />}>
              Soumettre
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)} title="Annuler la facture fiscale" size="sm">
        <form onSubmit={cancelForm.handleSubmit(onCancelInvoice)} className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Cette action est irréversible. La facture sera annulée auprès de l&apos;administration fiscale.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Motif d&apos;annulation *</label>
            <Input {...cancelForm.register("reason")} placeholder="Raison de l'annulation" />
            {cancelForm.formState.errors.reason && <p className="text-xs text-red-500 mt-1">{cancelForm.formState.errors.reason.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setCancelTarget(null)}>Retour</Button>
            <Button type="submit" variant="danger" loading={cancelInvoice.isPending}>Confirmer l&apos;annulation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. CONFIGURATION TAB
// ═══════════════════════════════════════════════════════════════

function ConfigurationTab() {
  const { data: summary, isLoading } = useCredentialsSummary();
  const saveCredentials = useSaveCredentials();
  const testCredentials = useTestCredentials();
  const switchEnv = useSwitchEnvironment();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      provider: "obr",
      tin: "",
      username: "",
      password: "",
      environment: "sandbox",
      api_url: "",
    },
  });

  const onSubmit = (data: z.infer<typeof credentialsSchema>) => {
    saveCredentials.mutate(data as Record<string, unknown>, {
      onSuccess: () => { setShowForm(false); form.reset(); },
    });
  };

  const cred = summary as any;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-5 h-5 text-emerald-600" />
              État de la configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-32 w-full rounded-lg" /> : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Statut global</span>
                  <Badge variant={cred?.configured ? "success" : "warning"} size="sm">
                    {cred?.configured ? "Configuré" : "Non configuré"}
                  </Badge>
                </div>
                {cred?.provider && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Fournisseur</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 uppercase">{cred.provider}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Environnement</span>
                  <Badge variant={cred?.environment === "production" ? "success" : "info"} size="sm">
                    {cred?.environment ?? "Non défini"}
                  </Badge>
                </div>
                {cred?.tin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">NIF</span>
                    <span className="text-sm font-mono text-slate-900 dark:text-slate-100">{cred.tin}</span>
                  </div>
                )}
                {cred?.last_test_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Dernier test</span>
                    <span className="text-xs text-slate-500">{formatDateTime(cred.last_test_at)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 dark:border-slate-700/50 p-4">
            <div className="flex gap-2 w-full">
              <ProtectedAction permission={Permission.FISCAL_CREDENTIALS_WRITE}>
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(true)}
                  leftIcon={<Settings className="w-4 h-4" />}>
                  {cred?.configured ? "Modifier" : "Configurer"}
                </Button>
              </ProtectedAction>
              {cred?.configured && (
                <ProtectedAction permission={Permission.FISCAL_CREDENTIALS_WRITE}>
                  <Button variant="outline" className="flex-1"
                    loading={testCredentials.isPending}
                    onClick={() => testCredentials.mutate(cred.provider ?? "obr")}
                    leftIcon={<CheckCircle className="w-4 h-4" />}>
                    Tester
                  </Button>
                </ProtectedAction>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Environment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-5 h-5 text-blue-600" />
              Environnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Basculez entre l&apos;environnement de test (sandbox) et la production pour les soumissions réelles.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["sandbox", "production"] as const).map(env => {
                  const active = cred?.environment === env;
                  return (
                    <button
                      key={env}
                      onClick={() => !active && switchEnv.mutate(env)}
                      disabled={switchEnv.isPending}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        active
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                      }`}
                    >
                      <div className={`text-sm font-semibold ${active ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {env === "sandbox" ? "Sandbox" : "Production"}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {env === "sandbox" ? "Test sans impact fiscal" : "Soumissions officielles"}
                      </p>
                      {active && <Badge variant="success" size="sm" className="mt-2">Actif</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credentials Form Modal */}
      <Modal open={showForm} onOpenChange={setShowForm} title="Configuration des credentials OBR/DGI" size="lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Fournisseur *"
              options={[{ value: "obr", label: "OBR (Burundi)" }, { value: "dgi", label: "DGI" }]}
              value={form.watch("provider")}
              onChange={v => form.setValue("provider", v as "obr" | "dgi")}
            />
            <Select
              label="Environnement *"
              options={[{ value: "sandbox", label: "Sandbox (Test)" }, { value: "production", label: "Production" }]}
              value={form.watch("environment")}
              onChange={v => form.setValue("environment", v as "sandbox" | "production")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIF (Numéro d&apos;identification fiscale) *</label>
            <Input {...form.register("tin")} placeholder="400000000" />
            {form.formState.errors.tin && <p className="text-xs text-red-500 mt-1">{form.formState.errors.tin.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Identifiant *</label>
              <Input {...form.register("username")} placeholder="Nom d'utilisateur API" />
              {form.formState.errors.username && <p className="text-xs text-red-500 mt-1">{form.formState.errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe *</label>
              <Input {...form.register("password")} type="password" placeholder="••••••••" />
              {form.formState.errors.password && <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL API (optionnel)</label>
            <Input {...form.register("api_url")} placeholder="https://api.obr.gov.bi/..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button type="submit" loading={saveCredentials.isPending}>Sauvegarder</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. STATISTIQUES TAB
// ═══════════════════════════════════════════════════════════════

function StatisticsTab() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const { data: report, isLoading: loadingReport } = useFiscalReport({ start_date: startDate, end_date: endDate });
  const { data: allInvoices, isLoading: loadingAll } = useFiscalInvoices();

  const stats = useMemo(() => {
    const invs = (allInvoices ?? []) as any[];
    const total = invs.length;
    const accepted = invs.filter(i => (i.fiscal_status ?? i.status) === "accepted").length;
    const rejected = invs.filter(i => (i.fiscal_status ?? i.status) === "rejected").length;
    const pending = invs.filter(i => (i.fiscal_status ?? i.status) === "pending").length;
    const submitted = invs.filter(i => (i.fiscal_status ?? i.status) === "submitted").length;
    const cancelled = invs.filter(i => (i.fiscal_status ?? i.status) === "cancelled").length;
    const totalAmount = invs.reduce((s: number, i: any) => s + parseFloat(i.total_amount ?? i.amount ?? "0"), 0);
    const acceptanceRate = total > 0 ? ((accepted / total) * 100) : 0;
    return { total, accepted, rejected, pending, submitted, cancelled, totalAmount, acceptanceRate };
  }, [allInvoices]);

  const statusDistribution = [
    { name: "Acceptées", value: stats.accepted },
    { name: "Rejetées", value: stats.rejected },
    { name: "En attente", value: stats.pending },
    { name: "Soumises", value: stats.submitted },
    { name: "Annulées", value: stats.cancelled },
  ].filter(d => d.value > 0);

  const loading = loadingReport || loadingAll;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Du</label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Au</label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-40" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total factures", value: String(stats.total), icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Taux d'acceptation", value: `${stats.acceptanceRate.toFixed(1)}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Rejetées", value: String(stats.rejected), icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
              { label: "Montant total", value: formatCurrency(stats.totalAmount), icon: Receipt, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
                    </div>
                    <div className={`rounded-lg ${bg} p-2.5`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {statusDistribution.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Répartition par statut</CardTitle></CardHeader>
                <CardContent>
                  <PieChartWidget
                    data={statusDistribution as Record<string, unknown>[]}
                    dataKey="value"
                    nameKey="name"
                    height={250}
                    colors={["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#94a3b8"]}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle className="text-base">Résumé du rapport fiscal</CardTitle></CardHeader>
              <CardContent>
                {report ? (
                  <div className="space-y-3">
                    {Object.entries(report as Record<string, unknown>).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                        <span className="text-sm text-slate-500 capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {typeof val === "number" ? formatNumber(val) : String(val ?? "—")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Aucun rapport" description="Sélectionnez une période pour générer le rapport" />
                )}
              </CardContent>
            </Card>
          </div>

          {stats.total > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Performance de soumission</CardTitle></CardHeader>
              <CardContent>
                <BarChartWidget
                  data={[
                    { name: "Acceptées", count: stats.accepted },
                    { name: "Rejetées", count: stats.rejected },
                    { name: "En attente", count: stats.pending },
                    { name: "Soumises", count: stats.submitted },
                  ] as Record<string, unknown>[]}
                  xKey="name"
                  yKey="count"
                  height={250}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
