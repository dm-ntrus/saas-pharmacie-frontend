"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { formatDate, formatDateTime } from "@/utils/formatters";
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
} from "@/components/ui";
import {
  Pill,
  User,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Package,
  ShieldCheck,
  Grid3X3,
  ChevronRight,
} from "lucide-react";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

export default function DosesPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <DosesContent />
    </ModuleGuard>
  );
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

const TIME_SLOTS = ["Matin", "Midi", "Soir", "Coucher"];

function DosesContent() {
  const pharmacyId = usePharmacyId();
  const [tab, setTab] = useState<"preparations" | "pilulier">("preparations");
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [showPrepareModal, setShowPrepareModal] = useState(false);

  const prepareMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/dose-preparation/prepare`,
        data,
      ),
    onSuccess: () => {
      toast.success("Préparation de dose enregistrée");
      setShowPrepareModal(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const pillboxMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/dose-preparation/weekly-pillbox`,
        data,
      ),
    onSuccess: () => toast.success("Pilulier hebdomadaire préparé"),
    onError: (err: Error) => toast.error(err.message),
  });

  const verifyMutation = useMutation({
    mutationFn: (doseId: string) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/prescriptions/advanced/dose-preparation/${doseId}/verify`,
        {},
      ),
    onSuccess: () => toast.success("Dose vérifiée par le pharmacien"),
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Préparation des doses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Préparation individualisée et pilulier hebdomadaire
          </p>
        </div>
        <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
          <Button
            leftIcon={<Package className="w-4 h-4" />}
            onClick={() => setShowPrepareModal(true)}
          >
            Préparer des doses
          </Button>
        </ProtectedAction>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-0">
        <button
          onClick={() => setTab("preparations")}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-t-lg transition-colors ${
            tab === "preparations"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium border-b-2 border-blue-600"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Pill className="w-4 h-4" />
          Préparations
        </button>
        <button
          onClick={() => setTab("pilulier")}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-t-lg transition-colors ${
            tab === "pilulier"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium border-b-2 border-blue-600"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          Pilulier
        </button>
      </div>

      {tab === "preparations" && (
        <PreparationsView
          search={search}
          setSearch={setSearch}
          verifyMutation={verifyMutation}
        />
      )}

      {tab === "pilulier" && (
        <PilulierView
          selectedPatientId={selectedPatientId}
          setSelectedPatientId={setSelectedPatientId}
          pillboxMutation={pillboxMutation}
        />
      )}

      <Modal
        isOpen={showPrepareModal}
        onClose={() => setShowPrepareModal(false)}
        title="Préparer des doses unitaires"
      >
        <PrepareForm
          onSubmit={(data) => prepareMutation.mutate(data)}
          isLoading={prepareMutation.isPending}
          onClose={() => setShowPrepareModal(false)}
        />
      </Modal>
    </div>
  );
}

function PreparationsView({
  search,
  setSearch,
  verifyMutation,
}: {
  search: string;
  setSearch: (s: string) => void;
  verifyMutation: any;
}) {
  const mockPreparations: any[] = [];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher un patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      {mockPreparations.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Pill className="w-8 h-8 text-slate-400" />}
              title="Aucune préparation en attente"
              description="Les préparations de doses unitaires apparaîtront ici. Utilisez le bouton ci-dessus pour démarrer."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mockPreparations.map((prep: any) => (
            <Card key={prep.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-slate-400" />
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {prep.patientName}
                      </p>
                      <Badge
                        variant={
                          prep.status === "verified"
                            ? "success"
                            : prep.status === "prepared"
                              ? "warning"
                              : "default"
                        }
                        size="sm"
                      >
                        {prep.status === "verified"
                          ? "Vérifié"
                          : prep.status === "prepared"
                            ? "À vérifier"
                            : prep.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {prep.medicationCount} médicament(s) •{" "}
                      {prep.scheduledTime} • {prep.dayOfWeek}
                    </p>
                  </div>
                  {prep.status === "prepared" && (
                    <ProtectedAction
                      permission={Permission.PRESCRIPTIONS_WRITE}
                    >
                      <Button
                        size="sm"
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        onClick={() => verifyMutation.mutate(prep.id)}
                        loading={verifyMutation.isPending}
                      >
                        Valider
                      </Button>
                    </ProtectedAction>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
            Checklist de préparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {[
              "Vérifier l'identité du patient (nom, prénom, date de naissance)",
              "Vérifier la concordance ordonnance / médicaments",
              "Contrôler les dosages et les posologies",
              "Vérifier les dates de péremption des lots",
              "S'assurer de l'absence d'interactions médicamenteuses",
              "Apposer les étiquettes sur chaque dose",
              "Double contrôle par un second pharmacien",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function PilulierView({
  selectedPatientId,
  setSelectedPatientId,
  pillboxMutation,
}: {
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  pillboxMutation: any;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            Vue pilulier hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              className="flex-1"
              label="ID Patient"
              placeholder="Saisissez l'ID du patient..."
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            />
            <div className="flex items-end">
              <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
                <Button
                  disabled={!selectedPatientId}
                  onClick={() =>
                    pillboxMutation.mutate({
                      patientId: selectedPatientId,
                      weekStarting: new Date().toISOString(),
                      prescriptions: [],
                    })
                  }
                  loading={pillboxMutation.isPending}
                >
                  Préparer pilulier
                </Button>
              </ProtectedAction>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700 w-20">
                    Moment
                  </th>
                  {DAYS_OF_WEEK.map((d) => (
                    <th
                      key={d.key}
                      className="p-2 text-center text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700"
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="p-2 text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                      {slot}
                    </td>
                    {DAYS_OF_WEEK.map((d) => (
                      <td
                        key={d.key}
                        className="p-2 text-center border-b border-slate-100 dark:border-slate-800"
                      >
                        <div className="min-h-[40px] rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <span className="text-xs text-slate-300 dark:text-slate-600">
                            —
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Sélectionnez un patient pour afficher les médicaments dans le
            pilulier
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PrepareForm({
  onSubmit,
  isLoading,
  onClose,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  const [patientId, setPatientId] = useState("");
  const [day, setDay] = useState("monday");
  const [time, setTime] = useState("08:00");
  const [medications, setMedications] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      patientId,
      dayOfWeek: day,
      scheduledTime: time,
      medications: medications
        .split("\n")
        .filter(Boolean)
        .map((m) => ({ name: m.trim() })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="ID Patient"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Jour"
          options={DAYS_OF_WEEK.map((d) => ({ value: d.key, label: d.label }))}
          value={day}
          onChange={(v) => setDay(v)}
        />
        <Input
          label="Heure"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Médicaments (un par ligne)
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Metformine 500mg&#10;Lisinopril 10mg&#10;Atorvastatine 20mg"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" loading={isLoading} disabled={!patientId}>
          Préparer
        </Button>
      </div>
    </form>
  );
}
