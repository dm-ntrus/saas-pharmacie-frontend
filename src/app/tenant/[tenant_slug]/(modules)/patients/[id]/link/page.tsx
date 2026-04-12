"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  ErrorBanner,
} from "@/components/ui";
import {
  Link2,
  Link2Off,
  User,
  Search,
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  Shield,
  UserPlus,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

export default function PatientLinkPage() {
  return (
    <ModuleGuard
      module="patients"
      requiredPermissions={[Permission.PATIENTS_WRITE]}
    >
      <PatientLinkContent />
    </ModuleGuard>
  );
}

function PatientLinkContent() {
  const params = useParams();
  const patientId = (params as any)?.id as string;
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);

  const {
    data: patient,
    isLoading: loadingPatient,
    isError,
  } = useQuery({
    queryKey: ["patient-detail", pharmacyId, patientId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/patients/${patientId}`),
    enabled: !!pharmacyId && !!patientId,
  });

  const searchUsersMutation = useMutation({
    mutationFn: (query: string) =>
      apiService.get(`/pharmacies/${pharmacyId}/users/search`, {
        params: { q: query },
      }),
    onSuccess: (results: any) => {
      setSearchResults(Array.isArray(results) ? results : []);
    },
    onError: () => setSearchResults([]),
  });

  const linkUserMutation = useMutation({
    mutationFn: (userId: string) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/patients/${patientId}/link`,
        { userId },
      ),
    onSuccess: () => {
      toast.success("Patient lié au compte utilisateur");
      qc.invalidateQueries({
        queryKey: ["patient-detail", pharmacyId, patientId],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const unlinkUserMutation = useMutation({
    mutationFn: () =>
      apiService.post(
        `/pharmacies/${pharmacyId}/patients/${patientId}/unlink`,
        {},
      ),
    onSuccess: () => {
      toast.success("Lien patient-utilisateur supprimé");
      setShowUnlinkConfirm(false);
      qc.invalidateQueries({
        queryKey: ["patient-detail", pharmacyId, patientId],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const sendInviteMutation = useMutation({
    mutationFn: (email: string) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/patients/${patientId}/invite`,
        { email },
      ),
    onSuccess: () => {
      toast.success("Invitation envoyée");
      setShowInviteModal(false);
      setInviteEmail("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSearch = () => {
    if (userSearch.trim()) {
      searchUsersMutation.mutate(userSearch.trim());
    }
  };

  if (loadingPatient) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <ErrorBanner
        message={`Patient introuvable (ID: ${patientId})`}
      />
    );
  }

  const p = patient as any;
  const linkedUserId = p.linked_user_id ?? p.linkedUserId;
  const linkedUser = p.linked_user ?? p.linkedUser;
  const isLinked = !!linkedUserId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Liaison patient-utilisateur
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Associer le dossier patient à un compte utilisateur
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informations patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Nom</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {p.last_name ?? p.lastName ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Prénom</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {p.first_name ?? p.firstName ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Date de naissance</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(p.date_of_birth ?? p.dateOfBirth)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">ID Patient</p>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-xs truncate">
                {patientId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={
          isLinked
            ? "border-emerald-200 dark:border-emerald-800"
            : "border-amber-200 dark:border-amber-800"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isLinked ? (
              <>
                <Link2 className="w-5 h-5 text-emerald-600" />
                Utilisateur lié
              </>
            ) : (
              <>
                <Link2Off className="w-5 h-5 text-amber-600" />
                Aucun utilisateur lié
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLinked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-800/50">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {linkedUser?.name ??
                      linkedUser?.email ??
                      `Utilisateur #${linkedUserId}`}
                  </p>
                  {linkedUser?.email && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {linkedUser.email}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    ID: {linkedUserId}
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Lié
                </Badge>
              </div>
              <ProtectedAction permission={Permission.PATIENTS_WRITE}>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/10"
                  leftIcon={<Link2Off className="w-4 h-4" />}
                  onClick={() => setShowUnlinkConfirm(true)}
                >
                  Dissocier l'utilisateur
                </Button>
              </ProtectedAction>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Ce patient n'est associé à aucun compte utilisateur. Il ne
                  peut pas accéder au portail patient.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLinked && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Rechercher un utilisateur existant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  className="flex-1"
                  placeholder="Rechercher par email, nom..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  leftIcon={<Search className="w-4 h-4" />}
                />
                <Button
                  onClick={handleSearch}
                  loading={searchUsersMutation.isPending}
                  disabled={!userSearch.trim()}
                >
                  Rechercher
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500">
                    {searchResults.length} résultat(s)
                  </p>
                  {searchResults.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {user.name ?? user.email}
                          </p>
                          {user.email && (
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <ProtectedAction
                        permission={Permission.PATIENTS_WRITE}
                      >
                        <Button
                          size="sm"
                          leftIcon={<Link2 className="w-3.5 h-3.5" />}
                          onClick={() => linkUserMutation.mutate(user.id)}
                          loading={linkUserMutation.isPending}
                        >
                          Lier
                        </Button>
                      </ProtectedAction>
                    </div>
                  ))}
                </div>
              )}

              {searchUsersMutation.isSuccess && searchResults.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Aucun utilisateur trouvé. Vous pouvez envoyer une invitation.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-violet-600" />
                Envoyer une invitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Envoyez un lien d'invitation par email au patient pour qu'il
                crée son compte et le lie automatiquement à son dossier.
              </p>
              <ProtectedAction permission={Permission.PATIENTS_WRITE}>
                <Button
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => setShowInviteModal(true)}
                >
                  Envoyer une invitation
                </Button>
              </ProtectedAction>
            </CardContent>
          </Card>
        </>
      )}

      <Modal
        isOpen={showUnlinkConfirm}
        onClose={() => setShowUnlinkConfirm(false)}
        title="Confirmer la dissociation"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">
              En dissociant cet utilisateur, le patient perdra l'accès au
              portail patient et ne pourra plus consulter son historique en
              ligne.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUnlinkConfirm(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => unlinkUserMutation.mutate()}
              loading={unlinkUserMutation.isPending}
            >
              Confirmer la dissociation
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Inviter le patient"
      >
        <div className="space-y-4">
          <Input
            label="Adresse email du patient"
            type="email"
            placeholder="patient@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <p className="text-xs text-slate-500">
            Un email sera envoyé avec un lien pour créer un compte et le lier
            automatiquement au dossier patient.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
            >
              Annuler
            </Button>
            <Button
              disabled={!inviteEmail || !inviteEmail.includes("@")}
              onClick={() => sendInviteMutation.mutate(inviteEmail)}
              loading={sendInviteMutation.isPending}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Envoyer l'invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
