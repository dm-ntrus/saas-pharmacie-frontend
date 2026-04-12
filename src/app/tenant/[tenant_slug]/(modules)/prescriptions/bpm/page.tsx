"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { formatDate } from "@/utils/formatters";
import { toast } from "react-hot-toast";
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
  Skeleton,
  Select,
  Stepper,
} from "@/components/ui";
import type { StepItem } from "@/components/ui";
import {
  Search,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  User,
  Pill,
  Shield,
  FileText,
  ChevronRight,
  ChevronLeft,
  Heart,
  Stethoscope,
} from "lucide-react";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

export default function BPMPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <BPMContent />
    </ModuleGuard>
  );
}

const BPM_STEPS: StepItem[] = [
  { label: "Patient", description: "Sélection du patient" },
  { label: "Recueil", description: "Recueil des informations" },
  { label: "Analyse", description: "Analyse pharmaceutique" },
  { label: "Interactions", description: "Vérification interactions" },
  { label: "Plan", description: "Plan de soins" },
];

const patientProfileSchema = z.object({
  age: z.coerce.number().min(1, "Âge requis").max(150),
  pathologies: z.string().default(""),
  allergies: z.string().default(""),
  currentMedications: z.string().default(""),
  livingSituation: z.enum(["alone", "with_family", "institution"]),
  polypharmacy: z.boolean().default(false),
  recentHospitalization: z.boolean().default(false),
  adherenceIssues: z.boolean().default(false),
  complexRegimen: z.boolean().default(false),
  chronicConditions: z.boolean().default(false),
});

type PatientProfileData = z.infer<typeof patientProfileSchema>;

const reviewSchema = z.object({
  medicationComplaints: z.string().default(""),
  sideEffectsReported: z.string().default(""),
  selfMedicationProducts: z.string().default(""),
  lifestyleNotes: z.string().default(""),
  adherenceAssessment: z.enum(["good", "moderate", "poor"]).default("good"),
  cognitiveStatus: z.enum(["normal", "mild_impairment", "significant_impairment"]).default("normal"),
});

type ReviewData = z.infer<typeof reviewSchema>;

function BPMContent() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [qualificationResult, setQualificationResult] = useState<any>(null);
  const [reviewStarted, setReviewStarted] = useState<any>(null);
  const [interactionAlerts, setInteractionAlerts] = useState<any[]>([]);

  const profileForm = useForm<PatientProfileData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      livingSituation: "with_family",
      polypharmacy: false,
      recentHospitalization: false,
      adherenceIssues: false,
      complexRegimen: false,
      chronicConditions: false,
    },
  });

  const reviewForm = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { adherenceAssessment: "good", cognitiveStatus: "normal" },
  });

  const qualifyMutation = useMutation({
    mutationFn: (data: {
      patientId: string;
      criteria: Record<string, boolean>;
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/qualify-patient`,
        data,
      ),
    onSuccess: (result: any) => {
      setQualificationResult(result);
      if (result?.qualifies || result?.eligible) {
        toast.success("Patient éligible au BPM");
      } else {
        toast.error("Patient non éligible au BPM");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startReviewMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/start`,
        data,
      ),
    onSuccess: (result: any) => {
      setReviewStarted(result);
      toast.success("Bilan partagé démarré");
      setCurrentStep(2);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const completeReviewMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/medication-review/${reviewStarted?.id ?? "unknown"}/complete`,
        data,
      ),
    onSuccess: () => {
      toast.success("Bilan partagé de médication finalisé");
      setCurrentStep(4);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleQualify = () => {
    const values = profileForm.getValues();
    qualifyMutation.mutate({
      patientId: selectedPatientId,
      criteria: {
        polypharmacy: values.polypharmacy,
        recentHospitalization: values.recentHospitalization,
        adherenceIssues: values.adherenceIssues,
        complexRegimen: values.complexRegimen,
        chronicConditions: values.chronicConditions,
      },
    });
  };

  const handleStartReview = () => {
    const values = profileForm.getValues();
    startReviewMutation.mutate({
      patientId: selectedPatientId,
      patientProfile: {
        age: values.age,
        pathologies: values.pathologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        allergies: values.allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        currentMedications: values.currentMedications
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        livingSituation: values.livingSituation,
      },
    });
  };

  const handleComplete = () => {
    const values = reviewForm.getValues();
    completeReviewMutation.mutate({
      actions: [
        {
          type: "medication_review",
          adherence: values.adherenceAssessment,
          complaints: values.medicationComplaints,
          sideEffects: values.sideEffectsReported,
        },
      ],
      notes: values.lifestyleNotes,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Bilan Partagé de Médication (BPM)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Accompagnement pharmaceutique et revue de traitement
        </p>
      </div>

      <Stepper steps={BPM_STEPS} currentStep={currentStep} />

      {currentStep === 0 && (
        <StepPatientSearch
          search={patientSearch}
          setSearch={setPatientSearch}
          selectedPatientId={selectedPatientId}
          setSelectedPatientId={setSelectedPatientId}
          onNext={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 1 && (
        <StepPatientProfile
          form={profileForm}
          qualificationResult={qualificationResult}
          onQualify={handleQualify}
          qualifyLoading={qualifyMutation.isPending}
          onStartReview={handleStartReview}
          startLoading={startReviewMutation.isPending}
          onBack={() => setCurrentStep(0)}
        />
      )}

      {currentStep === 2 && (
        <StepAnalysis
          reviewForm={reviewForm}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <StepInteractions
          interactionAlerts={interactionAlerts}
          onNext={() => handleComplete()}
          completeLoading={completeReviewMutation.isPending}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <StepSummary
          reviewStarted={reviewStarted}
          onReset={() => {
            setCurrentStep(0);
            setSelectedPatientId("");
            setQualificationResult(null);
            setReviewStarted(null);
            profileForm.reset();
            reviewForm.reset();
          }}
        />
      )}
    </div>
  );
}

function StepPatientSearch({
  search,
  setSearch,
  selectedPatientId,
  setSelectedPatientId,
  onNext,
}: {
  search: string;
  setSearch: (s: string) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Recherche et sélection du patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Rechercher par nom, prénom ou ID patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Input
          label="ID Patient (saisie directe)"
          placeholder="Entrez l'ID du patient..."
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            disabled={!selectedPatientId}
            onClick={onNext}
            leftIcon={<ChevronRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepPatientProfile({
  form,
  qualificationResult,
  onQualify,
  qualifyLoading,
  onStartReview,
  startLoading,
  onBack,
}: {
  form: any;
  qualificationResult: any;
  onQualify: () => void;
  qualifyLoading: boolean;
  onStartReview: () => void;
  startLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Profil patient et critères d'éligibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Âge"
              type="number"
              {...form.register("age")}
              error={form.formState.errors.age?.message}
            />
            <Select
              label="Situation de vie"
              options={[
                { value: "alone", label: "Vit seul(e)" },
                { value: "with_family", label: "En famille" },
                { value: "institution", label: "Institution" },
              ]}
              {...form.register("livingSituation")}
            />
          </div>
          <Input
            label="Pathologies (séparées par virgule)"
            placeholder="Diabète, HTA, Insuffisance rénale..."
            {...form.register("pathologies")}
          />
          <Input
            label="Allergies (séparées par virgule)"
            placeholder="Pénicilline, Aspirine..."
            {...form.register("allergies")}
          />
          <Input
            label="Médicaments actuels (séparés par virgule)"
            placeholder="Metformine, Lisinopril, Atorvastatine..."
            {...form.register("currentMedications")}
          />

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Critères de qualification BPM
            </p>
            {[
              { key: "polypharmacy" as const, label: "Polymédication (≥5 médicaments)" },
              { key: "recentHospitalization" as const, label: "Hospitalisation récente" },
              { key: "adherenceIssues" as const, label: "Problèmes d'observance" },
              { key: "complexRegimen" as const, label: "Schéma thérapeutique complexe" },
              { key: "chronicConditions" as const, label: "Pathologies chroniques multiples" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <input type="checkbox" {...form.register(key)} />
                {label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {qualificationResult && (
        <Card
          className={
            qualificationResult.qualifies || qualificationResult.eligible
              ? "border-emerald-200 dark:border-emerald-800"
              : "border-red-200 dark:border-red-800"
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {qualificationResult.qualifies ||
              qualificationResult.eligible ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    qualificationResult.qualifies ||
                    qualificationResult.eligible
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {qualificationResult.qualifies ||
                  qualificationResult.eligible
                    ? "Patient éligible au BPM"
                    : "Patient non éligible"}
                </p>
                {qualificationResult.reason && (
                  <p className="text-xs text-slate-500 mt-1">
                    {qualificationResult.reason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onQualify}
            loading={qualifyLoading}
          >
            Vérifier éligibilité
          </Button>
          <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
            <Button onClick={onStartReview} loading={startLoading}>
              Démarrer le BPM
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </ProtectedAction>
        </div>
      </div>
    </div>
  );
}

function StepAnalysis({
  reviewForm,
  onNext,
  onBack,
}: {
  reviewForm: any;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Analyse pharmaceutique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Plaintes liées aux médicaments"
            placeholder="Décrivez les plaintes du patient..."
            {...reviewForm.register("medicationComplaints")}
          />
          <Input
            label="Effets indésirables rapportés"
            placeholder="Nausées, vertiges, fatigue..."
            {...reviewForm.register("sideEffectsReported")}
          />
          <Input
            label="Automédication"
            placeholder="Compléments alimentaires, OTC..."
            {...reviewForm.register("selfMedicationProducts")}
          />
          <Input
            label="Notes sur le mode de vie"
            placeholder="Alimentation, activité physique, tabac..."
            {...reviewForm.register("lifestyleNotes")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Observance thérapeutique"
              options={[
                { value: "good", label: "Bonne" },
                { value: "moderate", label: "Modérée" },
                { value: "poor", label: "Mauvaise" },
              ]}
              {...reviewForm.register("adherenceAssessment")}
            />
            <Select
              label="État cognitif"
              options={[
                { value: "normal", label: "Normal" },
                { value: "mild_impairment", label: "Trouble léger" },
                {
                  value: "significant_impairment",
                  label: "Trouble significatif",
                },
              ]}
              {...reviewForm.register("cognitiveStatus")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <Button onClick={onNext}>
          Vérifier les interactions
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepInteractions({
  interactionAlerts,
  onNext,
  completeLoading,
  onBack,
}: {
  interactionAlerts: any[];
  onNext: () => void;
  completeLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            Vérification des interactions médicamenteuses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {interactionAlerts.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Aucune interaction détectée
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                  L'analyse n'a révélé aucune interaction médicamenteuse
                  significative.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {interactionAlerts.map((alert: any, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    alert.severity === "high"
                      ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                      : alert.severity === "medium"
                        ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10"
                        : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        alert.severity === "high"
                          ? "text-red-600"
                          : alert.severity === "medium"
                            ? "text-amber-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {alert.drug1} ↔ {alert.drug2}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
          <Button onClick={onNext} loading={completeLoading}>
            Finaliser le BPM
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </ProtectedAction>
      </div>
    </div>
  );
}

function StepSummary({
  reviewStarted,
  onReset,
}: {
  reviewStarted: any;
  onReset: () => void;
}) {
  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Bilan Partagé de Médication finalisé
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Le BPM a été enregistré avec succès. Un plan de suivi sera généré et
          partagé avec le médecin traitant.
        </p>
        {reviewStarted?.id && (
          <p className="text-xs text-slate-400 mb-4">
            Référence : {reviewStarted.id}
          </p>
        )}
        <Button onClick={onReset}>Nouveau BPM</Button>
      </CardContent>
    </Card>
  );
}
