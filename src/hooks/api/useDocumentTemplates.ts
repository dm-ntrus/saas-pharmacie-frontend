import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export type DocumentTemplateType =
  | "invoice"
  | "receipt"
  | "quote"
  | "purchase_order"
  | "credit_note"
  | "goods_return"
  | "delivery_note";

export interface DocumentTemplateRow {
  id: string;
  doc_type: DocumentTemplateType | string;
  name: string;
  engine: string;
  header_html?: string;
  body_html?: string;
  footer_html?: string;
  css_overrides?: string;
  is_default: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentTemplatePayload {
  docType: DocumentTemplateType;
  name: string;
  engine?: "handlebars" | "plain";
  headerHtml?: string;
  bodyHtml?: string;
  footerHtml?: string;
  cssOverrides?: string;
  isDefault?: boolean;
}

export type UpdateDocumentTemplatePayload = Partial<
  Pick<
    CreateDocumentTemplatePayload,
    "name" | "engine" | "headerHtml" | "bodyHtml" | "footerHtml" | "cssOverrides" | "isDefault"
  >
> & { isActive?: boolean };

function templateIdParam(id: string): string {
  return String(id).replace(/^document_templates:/, "");
}

export function useDocumentTemplates(docType?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["document-templates", pharmacyId, docType ?? ""],
    queryFn: async () => {
      if (!pharmacyId) return [] as DocumentTemplateRow[];
      const q = docType ? `?docType=${encodeURIComponent(docType)}` : "";
      const res = await apiService.get<DocumentTemplateRow[] | { data?: DocumentTemplateRow[] }>(
        `/pharmacies/${pharmacyId}/document-templates${q}`,
      );
      if (Array.isArray(res)) return res;
      return res?.data ?? [];
    },
    enabled: !!pharmacyId,
  });
}

export function useCreateDocumentTemplate() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDocumentTemplatePayload) =>
      apiService.post<DocumentTemplateRow>(`/pharmacies/${pharmacyId}/document-templates`, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["document-templates", pharmacyId] });
      toast.success("Modèle créé");
    },
    onError: (e: Error) => toast.error(e.message || "Échec création"),
  });
}

export function useUpdateDocumentTemplate() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentTemplatePayload }) =>
      apiService.put<DocumentTemplateRow>(
        `/pharmacies/${pharmacyId}/document-templates/${templateIdParam(id)}`,
        data,
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["document-templates", pharmacyId] });
      toast.success("Modèle mis à jour");
    },
    onError: (e: Error) => toast.error(e.message || "Échec mise à jour"),
  });
}

export function useDeleteDocumentTemplate() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.delete(`/pharmacies/${pharmacyId}/document-templates/${templateIdParam(id)}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["document-templates", pharmacyId] });
      toast.success("Modèle supprimé");
    },
    onError: (e: Error) => toast.error(e.message || "Échec suppression"),
  });
}
