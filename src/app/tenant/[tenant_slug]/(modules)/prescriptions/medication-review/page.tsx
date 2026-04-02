"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { useTenantPath } from "@/hooks/useTenantPath";
import { usePatientSearch } from "@/hooks/api/usePatients";
import type { Patient } from "@/types/patients";
import { cn } from "@/utils/cn";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  EmptyState,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  ArrowLeft,
  Search,
  User,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  MessageSquareText,
  FlaskConical,
  HandHeart,
} from "lucide-react";

type LivingSituation = "alone" | "with_family" | "institution";

type BPMQualifyResponse = {
  qualifies: boolean;
  reasons: string[];
  recommendedFrequency: "6_months" | "12_months";
};

type MedicationReviewStartResponse = {
  reviewId: string;
  patientId: string;
  status: string;
  patientProfile?: {
    age: number;
    pathologies: string[];
    allergies: string[];
    currentMedications: string[];
    livingSituation: LivingSituation;
  };
};

type BpmAction = {
  type: "continue" | "modify" | "stop" | "add" | "refer" | "educate";
  description: string;
  priority: "low" | "medium" | "high";
  assignedTo: "pharmacist" | "physician" | "patient";
  status: "pending" | "completed" | "cancelled";
  drugName?: string;
};

type PhaseDef = {
  id: string;
  tabLabel: string;
  title: string;
  icon: React.ReactNode;
  checklistKeys: { key: string; label: string }[];
};

const BPM_PHASES: PhaseDef[] = [
  {
    id: "recueil",
    tabLabel: "Entretien de recueil",
    title: "Entretien de recueil",
    icon: <MessageSquareText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    checklistKeys: [
      { key: "ctx_vie", label: "Contexte de vie et autonomie évalués" },
      { key: "traitements", label: "Traitements actuels recensés (ordonnance, automédication)" },
      { key: "allergies", label: "Allergies et intolérances confirmées" },
      { key: "biologie", label: "Examens récents / biologie évoqués si pertinent" },
    ],
  },
  {
    id: "analyse",
    tabLabel: "Analyse pharmaceutique",
    title: "Analyse pharmaceutique",
    icon: <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    checklistKeys: [
      { key: "interactions", label: "Interactions et contre-indications analysées" },
      { key: "redondance", label: "Redondances thérapeutiques / iatrogénie évaluées" },
      { key: "posologie", label: "Pertinence posologique et forme galénique vérifiées" },
      { key: "pdp", label: "Problèmes liés aux médicaments identifiés et priorisés" },
    ],
  },
  {
    id: "conseil",
    tabLabel: "Entretien-conseil",
    title: "Entretien-conseil",
    icon: <HandHeart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    checklistKeys: [
      { key: "explications", label: "Points clés expliqués au patient" },
      { key: "observance", label: "Observance et gestion des effets indésirables abordées" },
      { key: "supports", label: "Supports écrits ou consignes données si utile" },
      { key: "suivi", label: "Plan de suivi et relance convenus" },
    ],
  },
];

function computeAge(dateOfBirth: string): number {
  const d = new Date(dateOfBirth);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return Math.max(0, age);
}

function splitList(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function countMedications(raw?: string): number {
  return splitList(raw).length;
}

function apiErrorMessage(err: unknown): string {
  const anyErr = err as { message?: string; response?: { data?: { message?: string } } };
  return anyErr.response?.data?.message ?? anyErr.message ?? "Une erreur est survenue";
}

const CRITERIA_FIELDS = [
  ["polypharmacy", "Polymédication (≥ 5 médicaments)"] as const,
  ["recentHospitalization", "Hospitalisation récente"] as const,
  ["adherenceIssues", "Problèmes d’observance"] as const,
  ["complexRegimen", "Schéma posologique complexe"] as const,
  ["chronicConditions", "Pathologies chroniques multiples"] as const,
];

export default function MedicationReviewPage() {
  return (
    <ModuleGuard module="prescriptions" requiredPermissions={[Permission.PRESCRIPTIONS_READ]}>
      <MedicationReviewContent />
    </ModuleGuard>
  );
}

function MedicationReviewContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id ?? "";

  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [livingSituation, setLivingSituation] = useState<LivingSituation>("with_family");
  const [activePhaseTab, setActivePhaseTab] = useState<string>("recueil");

  const [criteria, setCriteria] = useState({
    polypharmacy: false,
    recentHospitalization: false,
    adherenceIssues: false,
    complexRegimen: false,
    chronicConditions: false,
  });

  const [qualifyResult, setQualifyResult] = useState<BPMQualifyResponse | null>(null);
  const [reviewStarted, setReviewStarted] = useState<MedicationReviewStartResponse | null>(null);
  const [completedReviewId, setCompletedReviewId] = useState<string | null>(null);

  const [phaseNotes, setPhaseNotes] = useState<Record<string, string>>({
    recueil: "",
    analyse: "",
    conseil: "",
  });

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const { data: searchResults, isFetching: searchLoading } = usePatientSearch(patientSearch);

  const patientAge = useMemo(
    () => (selectedPatient ? computeAge(selectedPatient.date_of_birth) : null),
    [selectedPatient],
  );

  const medicationCount = useMemo(
    () => (selectedPatient ? countMedications(selectedPatient.current_medications) : null),
    [selectedPatient],
  );

  const reviewId = reviewStarted?.reviewId ?? "";

  const toggleCriterion = useCallback((key: keyof typeof criteria) => {
    setCriteria((c) => ({ ...c, [key]: !c[key] }));
  }, []);

  const toggleChecklist = useCallback((key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setSelectedPatient(null);
    setPatientSearch("");
    setQualifyResult(null);
    setReviewStarted(null);
    setCompletedReviewId(null);
    setPhaseNotes({ recueil: "", analyse: "", conseil: "" });
    setChecklist({});
    setActivePhaseTab("recueil");
    setCriteria({
      polypharmacy: false,
      recentHospitalization: false,
      adherenceIssues: false,
      complexRegimen: false,
      chronicConditions: false,
    });
    setLivingSituation("with_family");
  }, []);

  const qualifyMutation = useMutation({
    mutationFn: async () => {
      if (!pharmacyId || !selectedPatient) throw new Error("Pharmacie ou patient manquant");
      return apiService.post<BPMQualifyResponse>(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/qualify-patient`,
        {
          patientId: selectedPatient.id,
          criteria,
        },
      );
    },
    onSuccess: (data) => {
      setQualifyResult(data);
      if (data.qualifies) toast.success("Patient éligible au BPM");
      else toast.error("Patient non éligible selon les critères saisis");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!pharmacyId || !selectedPatient) throw new Error("Pharmacie ou patient manquant");
      const age = patientAge ?? 0;
      return apiService.post<MedicationReviewStartResponse>(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/start`,
        {
          patientId: selectedPatient.id,
          patientProfile: {
            age,
            pathologies: splitList(selectedPatient.medical_conditions),
            allergies: splitList(selectedPatient.allergies),
            currentMedications: splitList(selectedPatient.current_medications),
            livingSituation,
          },
        },
      );
    },
    onSuccess: (data) => {
      setReviewStarted(data);
      setActivePhaseTab("recueil");
      toast.success("BPM démarré");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!pharmacyId) throw new Error("Pharmacie manquante");

      const actions: BpmAction[] = [];
      for (const phase of BPM_PHASES) {
        for (const { key, label } of phase.checklistKeys) {
          if (checklist[key]) {
            actions.push({
              type: "educate",
              description: `[${phase.title}] ${label}`,
              priority: "medium",
              assignedTo: "pharmacist",
              status: "completed",
            });
          }
        }
      }

      const notesBlock = [
        phaseNotes.recueil && `Entretien de recueil :\n${phaseNotes.recueil}`,
        phaseNotes.analyse && `Analyse pharmaceutique :\n${phaseNotes.analyse}`,
        phaseNotes.conseil && `Entretien-conseil :\n${phaseNotes.conseil}`,
      ]
        .filter(Boolean)
        .join("\n\n---\n\n");

      if (actions.length === 0) {
        actions.push({
          type: "educate",
          description: "BPM complété — voir notes consolidées",
          priority: "high",
          assignedTo: "pharmacist",
          status: "completed",
        });
      }

      return apiService.post<{ reviewId: string; status: string }>(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/${encodeURIComponent(id)}/complete`,
        { actions, notes: notesBlock || undefined },
      );
    },
    onSuccess: (data) => {
      setCompletedReviewId(data.reviewId);
      toast.success("BPM terminé");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  if (!pharmacyId) {
    return (
      <div className="space-y-6">
        <PageHeader buildPath={buildPath} router={router} />
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Stethoscope className="h-12 w-12 text-slate-400" />}
              title="Aucune pharmacie active"
              description="Sélectionnez une pharmacie (organisation) pour accéder au bilan partagé de médication."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completedReviewId) {
    return (
      <div className="space-y-6">
        <PageHeader buildPath={buildPath} router={router} />
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Bilan partagé de médication terminé
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Le BPM a été enregistré. Vous pouvez en démarrer un autre pour un autre patient.
            </p>
            <p className="mt-4 font-mono text-xs text-slate-400">{completedReviewId}</p>
            <Button className="mt-6" onClick={resetWorkflow}>
              Nouveau BPM
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader buildPath={buildPath} router={router} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <User className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Recherche patient
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nom, prénom… (min. 2 caractères)"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />

          {patientSearch.length >= 2 && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700">
              {searchLoading ? (
                <div className="space-y-2 p-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !searchResults?.length ? (
                <div className="p-6">
                  <EmptyState
                    icon={<Search className="h-10 w-10 text-slate-400" />}
                    title="Aucun résultat"
                    description="Affinez la recherche ou vérifiez l’orthographe."
                  />
                </div>
              ) : (
                <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
                  {searchResults.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatient(p);
                          setQualifyResult(null);
                          setReviewStarted(null);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                          "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                          selectedPatient?.id === p.id && "bg-emerald-50 dark:bg-emerald-950/40",
                        )}
                      >
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {p.first_name} {p.last_name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {computeAge(p.date_of_birth)} ans
                        </Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedPatient && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
                Patient sélectionné
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {selectedPatient.first_name} {selectedPatient.last_name}
                <span className="text-slate-500 dark:text-slate-400"> · ID {selectedPatient.id}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <ClipboardList className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Évaluation d’éligibilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Âge (dossier)</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {patientAge != null ? `${patientAge} ans` : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Médicaments déclarés
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {medicationCount != null ? medicationCount : "—"}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Situation de vie (pour le démarrage du BPM)
              </label>
              <select
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value as LivingSituation)}
                disabled={!!reviewStarted}
                className={cn(
                  "h-10 w-full max-w-md rounded-lg border bg-white px-3 text-sm text-slate-900",
                  "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600",
                  "dark:bg-slate-800 dark:text-slate-100",
                )}
              >
                <option value="alone">Vit seul(e)</option>
                <option value="with_family">En famille / entourage</option>
                <option value="institution">Établissement / institution</option>
              </select>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <p className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                Critères BPM (au moins 2 motifs requis côté serveur)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {CRITERIA_FIELDS.map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                      checked={criteria[key]}
                      onChange={() => toggleCriterion(key)}
                      disabled={!!reviewStarted}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                loading={qualifyMutation.isPending}
                disabled={!!reviewStarted}
                onClick={() => qualifyMutation.mutate()}
                leftIcon={<ClipboardList className="h-4 w-4" />}
              >
                Qualifier
              </Button>
              <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
                <Button
                  loading={startMutation.isPending}
                  disabled={!qualifyResult?.qualifies || !!reviewStarted}
                  onClick={() => startMutation.mutate()}
                >
                  Démarrer le BPM
                </Button>
              </ProtectedAction>
            </div>

            {qualifyResult && (
              <div
                className={cn(
                  "rounded-lg border p-4",
                  qualifyResult.qualifies
                    ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/25"
                    : "border-amber-200 bg-amber-50/80 dark:border-amber-900/30 dark:bg-amber-950/20",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {qualifyResult.qualifies ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  )}
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {qualifyResult.qualifies ? "Éligible au BPM" : "Non éligible avec ces critères"}
                  </span>
                  <Badge variant={qualifyResult.qualifies ? "default" : "secondary"}>
                    Suivi{" "}
                    {qualifyResult.recommendedFrequency === "6_months"
                      ? "6 mois recommandé"
                      : "12 mois recommandé"}
                  </Badge>
                </div>
                {qualifyResult.reasons.length > 0 && (
                  <ul className="mt-3 list-inside list-disc text-sm text-slate-600 dark:text-slate-400">
                    {qualifyResult.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-slate-600 dark:text-slate-300">Âge :</span>{" "}
                    {patientAge ?? "—"} ans
                  </p>
                  <p>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Nb. médicaments (dossier) :
                    </span>{" "}
                    {medicationCount ?? "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {reviewStarted && reviewId && (
        <Card className="border-emerald-200/80 dark:border-emerald-900">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Stethoscope className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Déroulement du BPM
            </CardTitle>
            <Badge variant="secondary" className="border border-slate-200 font-mono text-xs dark:border-slate-600">
              {reviewId}
            </Badge>
          </CardHeader>
          <CardContent>
            <Tabs value={activePhaseTab} onValueChange={setActivePhaseTab} className="w-full">
              <TabsList className="flex w-full flex-wrap gap-1 bg-slate-100/80 dark:bg-slate-800/80">
                {BPM_PHASES.map((phase) => (
                  <TabsTrigger
                    key={phase.id}
                    value={phase.id}
                    className="gap-1.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-600"
                  >
                    {phase.icon}
                    <span className="hidden sm:inline">{phase.tabLabel}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {BPM_PHASES.map((phase) => (
                <TabsContent key={phase.id} value={phase.id} className="mt-4 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                    {phase.icon}
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{phase.title}</h3>
                  </div>

                  <div>
                    <label
                      htmlFor={`notes-${phase.id}`}
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Notes
                    </label>
                    <textarea
                      id={`notes-${phase.id}`}
                      rows={5}
                      value={phaseNotes[phase.id] ?? ""}
                      onChange={(e) =>
                        setPhaseNotes((prev) => ({ ...prev, [phase.id]: e.target.value }))
                      }
                      placeholder="Compte rendu de l’entretien, éléments clés, décisions…"
                      className={cn(
                        "w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900",
                        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                        "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600",
                        "dark:bg-slate-800 dark:text-slate-100",
                      )}
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                      Checklist
                    </p>
                    <ul className="space-y-2">
                      {phase.checklistKeys.map(({ key, label }) => (
                        <li key={key}>
                          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                              checked={!!checklist[key]}
                              onChange={() => toggleChecklist(key)}
                            />
                            <span>{label}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
              <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
                <Button
                  loading={completeMutation.isPending}
                  onClick={() => completeMutation.mutate(reviewId)}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Terminer
                </Button>
              </ProtectedAction>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PageHeader({
  buildPath,
  router,
}: {
  buildPath: (p: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(buildPath("/prescriptions"))}
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Retour
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Bilan partagé de médication (BPM)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Qualification, entretien, analyse et clôture du parcours BPM.
        </p>
      </div>
    </div>
  );
}
