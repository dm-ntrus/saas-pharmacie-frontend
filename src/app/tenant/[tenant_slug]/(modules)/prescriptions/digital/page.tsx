"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  FileImage,
  Pill,
  Plus,
  QrCode,
  ScanLine,
  Stethoscope,
  Trash2,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
} from "@/components/ui";
import { useOrganization } from "@/context/OrganizationContext";
import { useTenantPath } from "@/hooks/useTenantPath";
import { apiService } from "@/services/api.service";
import { Permission } from "@/types/permissions";
import { cn } from "@/utils/cn";

type VerifyDataMatrixResponse = {
  valid: boolean;
  productId?: string;
  batchId?: string;
  expiryDate?: string | Date;
  gtin?: string;
  serialNumber?: string;
  manufacturer?: string;
  error?: string;
};

type DigitalPrescriptionItem = {
  drugName?: string;
  dosage?: string;
  quantity?: string;
  directions?: string;
};

type DigitalPrescriptionResponse = {
  id: string;
  source?: string;
  prescriptionNumber?: string;
  prescriberName?: string;
  prescriberId?: string;
  patientId?: string;
  patientName?: string;
  items?: DigitalPrescriptionItem[];
  issueDate?: string | Date;
  signatureValid?: boolean;
};

function formatExpiry(value: string | Date | undefined): string {
  if (value == null) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function tryDecodeImageToCode(file: File): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const BD = (
    window as unknown as {
      BarcodeDetector?: new (o: { formats: string[] }) => {
        detect: (src: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
      };
    }
  ).BarcodeDetector;
  if (!BD) return null;
  const detector = new BD({ formats: ["qr_code", "data_matrix"] });
  const bitmap = await createImageBitmap(file);
  try {
    const codes = await detector.detect(bitmap);
    return codes[0]?.rawValue ?? null;
  } finally {
    bitmap.close();
  }
}

function readFileFromDataTransfer(dt: DataTransfer): File | null {
  const f = dt.files?.[0];
  if (f?.type.startsWith("image/")) return f;
  const item = dt.items?.[0];
  if (item?.kind === "file") {
    const file = item.getAsFile();
    if (file?.type.startsWith("image/")) return file;
  }
  return null;
}

export default function DigitalPrescriptionPage() {
  return (
    <ModuleGuard module="prescriptions" requiredPermissions={[Permission.PRESCRIPTIONS_READ]}>
      <DigitalPrescriptionContent />
    </ModuleGuard>
  );
}

function DigitalPrescriptionContent() {
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id;

  const [dataMatrixInput, setDataMatrixInput] = useState("");
  const [imageDecodeHint, setImageDecodeHint] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [verifyResult, setVerifyResult] = useState<VerifyDataMatrixResponse | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [importMode, setImportMode] = useState<"structured" | "raw_epresc">("structured");
  const [rawEprescPayload, setRawEprescPayload] = useState("");
  const [rxNumber, setRxNumber] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [medications, setMedications] = useState<string[]>([""]);

  const [importResult, setImportResult] = useState<DigitalPrescriptionResponse | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!pharmacyId) throw new Error("Aucune pharmacie sélectionnée.");
      return apiService.post<VerifyDataMatrixResponse>(
        `/pharmacies/${encodeURIComponent(pharmacyId)}/prescriptions/advanced/verify-datamatrix`,
        { code },
      );
    },
    onSuccess: (data) => {
      setVerifyError(null);
      setVerifyResult(data);
    },
    onError: (err: Error) => {
      setVerifyResult(null);
      setVerifyError(err.message);
    },
  });

  const importMutation = useMutation({
    mutationFn: async (payload: { scanData: string; source: "QR_CODE" | "E_PRESCRIPTION" }) => {
      if (!pharmacyId) throw new Error("Aucune pharmacie sélectionnée.");
      return apiService.post<DigitalPrescriptionResponse>(
        `/pharmacies/${encodeURIComponent(pharmacyId)}/prescriptions/advanced/digital-prescription`,
        payload,
      );
    },
    onSuccess: (data) => {
      setImportError(null);
      setImportResult(data);
    },
    onError: (err: Error) => {
      setImportResult(null);
      setImportError(err.message);
    },
  });

  const processImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageDecodeHint("Veuillez choisir une image (PNG, JPEG, WebP…).");
      return;
    }
    setImageDecodeHint(null);
    try {
      const decoded = await tryDecodeImageToCode(file);
      if (decoded) {
        setDataMatrixInput(decoded);
        setImageDecodeHint("Code lu depuis l’image. Vous pouvez lancer la vérification.");
      } else {
        setImageDecodeHint(
          "Impossible de lire automatiquement le code. Collez le texte du DataMatrix / QR à la main.",
        );
      }
    } catch {
      setImageDecodeHint(
        "Lecture du code impossible sur ce navigateur. Saisissez le code manuellement.",
      );
    }
  }, []);

  const handleVerify = () => {
    const code = dataMatrixInput.trim();
    if (!code) {
      setVerifyError("Saisissez un code DataMatrix ou importez une image.");
      setVerifyResult(null);
      return;
    }
    verifyMutation.mutate(code);
  };

  const handleImageSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      await processImageFile(file);
    },
    [processImageFile],
  );

  const onDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const onDropZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const onDropZoneDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
      const file = readFileFromDataTransfer(e.dataTransfer);
      if (!file) {
        setImageDecodeHint("Déposez une image (fichier image uniquement).");
        return;
      }
      void processImageFile(file);
    },
    [processImageFile],
  );

  const buildScanDataFromForm = (): string => {
    const num = rxNumber.trim() || `RX-${Date.now()}`;
    const doc = doctorName.trim() || "Dr. Inconnu";
    const pid = patientId.trim() || "unknown";
    const drugs = medications.map((m) => m.trim()).filter(Boolean);
    return `${num}|${doc}|${pid}|${drugs.join(",")}`;
  };

  const handleImport = () => {
    if (importMode === "raw_epresc") {
      const raw = rawEprescPayload.trim();
      if (!raw) {
        setImportError("Collez le contenu de l’e-ordonnance à traiter.");
        setImportResult(null);
        return;
      }
      importMutation.mutate({ scanData: raw, source: "E_PRESCRIPTION" });
      return;
    }

    const drugs = medications.map((m) => m.trim()).filter(Boolean);
    if (!doctorName.trim()) {
      setImportError("Indiquez le nom du médecin prescripteur.");
      setImportResult(null);
      return;
    }
    if (!patientId.trim()) {
      setImportError("Indiquez l’identifiant patient.");
      setImportResult(null);
      return;
    }
    if (drugs.length === 0) {
      setImportError("Ajoutez au moins un médicament à la liste.");
      setImportResult(null);
      return;
    }

    const scanData = buildScanDataFromForm();
    importMutation.mutate({ scanData, source: "QR_CODE" });
  };

  const prescriptionsListPath = buildPath("/prescriptions");
  const backButtonClass =
    "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200";

  if (!pharmacyId) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm" asChild className={backButtonClass}>
            <Link href={prescriptionsListPath} className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            e-Ordonnance numérique
          </h1>
        </div>
        <Card className="border-emerald-200/80 dark:border-emerald-900/50 dark:bg-slate-900/40">
          <CardContent className="py-12">
            <EmptyState
              icon={<QrCode className="w-12 h-12 text-emerald-500/70" />}
              title="Pharmacie requise"
              description="Sélectionnez une pharmacie pour importer une e-ordonnance ou vérifier un DataMatrix."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="sm" asChild className={backButtonClass}>
          <Link href={prescriptionsListPath} className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <QrCode className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            e-Ordonnance / DataMatrix
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Vérifiez un code DataMatrix sur un conditionnement, puis importez une ordonnance
            structurée (QR simulé) ou une charge utile e-ordonnance brute.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-200/80 dark:border-emerald-900/50 shadow-sm dark:bg-slate-900/40">
          <CardHeader className="pb-3 border-b border-emerald-100/80 dark:border-emerald-900/40">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <ScanLine className="w-5 h-5 shrink-0" />
              DataMatrix / QR — vérification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label
                htmlFor="datamatrix-manual"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Saisie manuelle du code
              </label>
              <Input
                id="datamatrix-manual"
                value={dataMatrixInput}
                onChange={(e) => setDataMatrixInput(e.target.value)}
                placeholder="Ex. (01)34009312345678(21)ABC123(17)250630(10)LOT456"
                className="font-mono text-sm dark:bg-slate-950/50 border-emerald-200/60 dark:border-emerald-900/50 focus-visible:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Image du QR / DataMatrix
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelected}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDropZoneDragOver}
                onDragLeave={onDropZoneDragLeave}
                onDrop={onDropZoneDrop}
                className={cn(
                  "w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center gap-2 transition-colors",
                  "border-emerald-300/80 dark:border-emerald-800/60",
                  "bg-emerald-50/50 dark:bg-emerald-950/20",
                  "hover:bg-emerald-50 dark:hover:bg-emerald-950/35",
                  "text-slate-600 dark:text-slate-400",
                  isDraggingFile && "ring-2 ring-emerald-500/50 bg-emerald-100/60 dark:bg-emerald-950/45",
                )}
              >
                <FileImage className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-center">
                  Glisser-déposer une image ou cliquer pour parcourir
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">image/*</span>
              </button>
              {imageDecodeHint && (
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90">{imageDecodeHint}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleVerify}
              loading={verifyMutation.isPending}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              leftIcon={verifyMutation.isPending ? undefined : <CheckCircle className="w-4 h-4" />}
            >
              Vérifier
            </Button>

            {verifyError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifyResult && (
              <div
                className={cn(
                  "rounded-xl border p-4 space-y-3",
                  verifyResult.valid
                    ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                    : "border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20",
                )}
              >
                <div className="flex items-center gap-2">
                  {verifyResult.valid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {verifyResult.valid ? "Résultat de vérification" : "Vérification échouée"}
                  </span>
                </div>
                {verifyResult.error && (
                  <p className="text-sm text-amber-800 dark:text-amber-200">{verifyResult.error}</p>
                )}
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-0.5">
                    <dt className="text-slate-500 dark:text-slate-400">ID produit</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100 break-all">
                      {verifyResult.productId ?? "—"}
                    </dd>
                  </div>
                  <div className="space-y-0.5">
                    <dt className="text-slate-500 dark:text-slate-400">Lot (batch)</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100 break-all">
                      {verifyResult.batchId ?? "—"}
                    </dd>
                  </div>
                  <div className="space-y-0.5">
                    <dt className="text-slate-500 dark:text-slate-400">Numéro de série</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100 break-all">
                      {verifyResult.serialNumber ?? "—"}
                    </dd>
                  </div>
                  <div className="space-y-0.5">
                    <dt className="text-slate-500 dark:text-slate-400">Expiration</dt>
                    <dd className="font-mono text-slate-900 dark:text-slate-100">
                      {formatExpiry(verifyResult.expiryDate)}
                    </dd>
                  </div>
                  {verifyResult.gtin ? (
                    <div className="sm:col-span-2 space-y-0.5">
                      <dt className="text-slate-500 dark:text-slate-400">GTIN</dt>
                      <dd className="font-mono text-slate-900 dark:text-slate-100 break-all">
                        {verifyResult.gtin}
                      </dd>
                    </div>
                  ) : null}
                  {verifyResult.manufacturer ? (
                    <div className="sm:col-span-2 space-y-0.5">
                      <dt className="text-slate-500 dark:text-slate-400">Fabricant (indicatif)</dt>
                      <dd className="text-slate-900 dark:text-slate-100">{verifyResult.manufacturer}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200/80 dark:border-emerald-900/50 shadow-sm dark:bg-slate-900/40">
          <CardHeader className="pb-3 border-b border-emerald-100/80 dark:border-emerald-900/40">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Stethoscope className="w-5 h-5 shrink-0" />
              Importer l’ordonnance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={importMode === "structured" ? "default" : "outline"}
                className={cn(
                  importMode === "structured" &&
                    "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500",
                )}
                onClick={() => {
                  setImportMode("structured");
                  setImportError(null);
                }}
              >
                Formulaire (QR)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={importMode === "raw_epresc" ? "default" : "outline"}
                className={cn(
                  importMode === "raw_epresc" &&
                    "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500",
                )}
                onClick={() => {
                  setImportMode("raw_epresc");
                  setImportError(null);
                }}
              >
                e-Ordonnance brute
              </Button>
            </div>

            {importMode === "raw_epresc" ? (
              <div className="space-y-2">
                <label
                  htmlFor="raw-epresc"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Contenu à traiter (XML / JSON / charge utile)
                </label>
                <textarea
                  id="raw-epresc"
                  value={rawEprescPayload}
                  onChange={(e) => setRawEprescPayload(e.target.value)}
                  rows={12}
                  placeholder="Collez ici les données reçues du système d’e-prescription…"
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm font-mono",
                    "border-emerald-200/60 dark:border-emerald-900/50",
                    "bg-white dark:bg-slate-950/50 text-slate-900 dark:text-slate-100",
                    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                  )}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100"
                    >
                      optionnel
                    </Badge>
                    N° ordonnance
                  </label>
                  <Input
                    value={rxNumber}
                    onChange={(e) => setRxNumber(e.target.value)}
                    placeholder="Laissé vide = généré automatiquement"
                    className="dark:bg-slate-950/50 border-emerald-200/60 dark:border-emerald-900/50"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="doctor-name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <UserRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Médecin prescripteur
                  </label>
                  <Input
                    id="doctor-name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Nom Prénom"
                    className="dark:bg-slate-950/50 border-emerald-200/60 dark:border-emerald-900/50"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="patient-id"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Identifiant patient
                  </label>
                  <Input
                    id="patient-id"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="ID dossier patient"
                    className="dark:bg-slate-950/50 border-emerald-200/60 dark:border-emerald-900/50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Liste des médicaments
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setMedications((m) => [...m, ""])}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="border-emerald-300 dark:border-emerald-800 shrink-0"
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {medications.map((line, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={line}
                          onChange={(e) => {
                            const next = [...medications];
                            next[idx] = e.target.value;
                            setMedications(next);
                          }}
                          placeholder={`Médicament ${idx + 1}`}
                          className="dark:bg-slate-950/50 border-emerald-200/60 dark:border-emerald-900/50"
                          aria-label={`Médicament ${idx + 1}`}
                        />
                        {medications.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Supprimer la ligne"
                            onClick={() => setMedications((m) => m.filter((_, i) => i !== idx))}
                            className="shrink-0 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button
              type="button"
              onClick={handleImport}
              loading={importMutation.isPending}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              leftIcon={importMutation.isPending ? undefined : <Upload className="w-4 h-4" />}
            >
              Importer l’ordonnance
            </Button>

            {importError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {importResult ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/50 dark:bg-emerald-950/35 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Ordonnance importée
                  </span>
                  {importResult.source ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100"
                    >
                      {importResult.source}
                    </Badge>
                  ) : null}
                </div>
                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">N° : </span>
                    {importResult.prescriptionNumber ?? importResult.id}
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Prescripteur : </span>
                    {importResult.prescriberName ?? "—"}
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Patient : </span>
                    {importResult.patientName ?? importResult.patientId ?? "—"}
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Signature : </span>
                    {importResult.signatureValid === false ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                        Non vérifiée
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                      >
                        OK
                      </Badge>
                    )}
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Lignes : </span>
                    {importResult.items?.length ?? 0}
                  </li>
                </ul>
                {importResult.items && importResult.items.length > 0 ? (
                  <ul className="text-sm border-t border-emerald-200/60 dark:border-emerald-800/50 pt-3 space-y-2">
                    {importResult.items.map((it, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-800 dark:text-slate-200"
                      >
                        <span className="font-medium">{it.drugName || "Médicament"}</span>
                        {it.dosage ? (
                          <Badge variant="secondary" className="text-xs">
                            {it.dosage}
                          </Badge>
                        ) : null}
                        {it.quantity ? (
                          <span className="text-slate-500 dark:text-slate-400">× {it.quantity}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Button
                  variant="outline"
                  asChild
                  className="border-emerald-400 text-emerald-800 dark:border-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Link
                    href={buildPath(`/prescriptions/${encodeURIComponent(importResult.id)}`)}
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir l’ordonnance
                  </Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
