"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import {
  useActiveSession,
  useSessionHistory,
  useOpenSession,
  useCloseSession,
  useXReport,
} from "@/hooks/api/useSales";
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
} from "@/components/ui";
import {
  DoorOpen,
  DoorClosed,
  FileText,
  Clock,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

export default function CashierSessionPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_READ]}>
      <CashierSessionContent />
    </ModuleGuard>
  );
}

function CashierSessionContent() {
  const {
    data: activeSession,
    isLoading: loadingActive,
    error: activeError,
  } = useActiveSession();
  const { data: history, isLoading: loadingHistory } = useSessionHistory({
    limit: 20,
  });

  const openSession = useOpenSession();
  const closeSession = useCloseSession();

  const [openModalOpen, setOpenModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [openingNotes, setOpeningNotes] = useState("");
  const [closingBalance, setClosingBalance] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState("");
  const [discrepancyReason, setDiscrepancyReason] = useState("");

  const handleOpen = () => {
    openSession.mutate(
      { openingBalance, notes: openingNotes || undefined },
      {
        onSuccess: () => {
          setOpenModalOpen(false);
          setOpeningBalance(0);
          setOpeningNotes("");
        },
      },
    );
  };

  const handleClose = () => {
    if (!activeSession) return;
    closeSession.mutate(
      {
        sessionId: activeSession.id,
        dto: {
          closingBalance,
          notes: closingNotes || undefined,
          discrepancyReason: discrepancyReason || undefined,
        },
      },
      {
        onSuccess: () => {
          setCloseModalOpen(false);
          setClosingBalance(0);
          setClosingNotes("");
          setDiscrepancyReason("");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sessions de caisse
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ouverture, clôture et rapports de caisse
          </p>
        </div>
        <div className="flex gap-2">
          {!activeSession && (
            <ProtectedAction permission={Permission.SALES_CREATE}>
              <Button
                leftIcon={<DoorOpen className="w-4 h-4" />}
                onClick={() => setOpenModalOpen(true)}
              >
                Ouvrir une session
              </Button>
            </ProtectedAction>
          )}
        </div>
      </div>

      {/* Active Session */}
      {loadingActive ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : activeError ? (
        <ErrorBanner message="Impossible de charger la session active" />
      ) : activeSession ? (
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              Session active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Solde d&apos;ouverture</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(activeSession.opening_balance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ouvert à</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDateTime(activeSession.opened_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total ventes</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(activeSession.total_sales ?? "0")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Rapport X
              </Button>
              <ProtectedAction permission={Permission.SALES_CREATE}>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<DoorClosed className="w-4 h-4" />}
                  onClick={() => setCloseModalOpen(true)}
                >
                  Clôturer la session
                </Button>
              </ProtectedAction>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={<Clock className="w-8 h-8 text-slate-400" />}
              title="Aucune session active"
              description="Ouvrez une session de caisse pour commencer à enregistrer des ventes."
              actionLabel="Ouvrir une session"
              onAction={() => setOpenModalOpen(true)}
            />
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <EmptyState
              title="Aucun historique"
              description="Les sessions précédentes apparaîtront ici."
            />
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        session.status === "open"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {session.status === "open" ? (
                        <DoorOpen className="w-4 h-4 text-green-600" />
                      ) : (
                        <DoorClosed className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {formatDateTime(session.opened_at)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Ouverture : {formatCurrency(session.opening_balance)}
                        {session.closing_balance &&
                          ` → Clôture : ${formatCurrency(session.closing_balance)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={session.status === "open" ? "success" : "default"}
                      size="sm"
                    >
                      {session.status === "open" ? "Ouverte" : "Clôturée"}
                    </Badge>
                    {session.discrepancy &&
                      parseFloat(session.discrepancy) !== 0 && (
                        <Badge variant="warning" size="sm">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Écart
                        </Badge>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Open Session Modal */}
      <Modal
        open={openModalOpen}
        onOpenChange={setOpenModalOpen}
        title="Ouvrir une session de caisse"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            type="number"
            label="Solde d'ouverture"
            required
            min="0"
            value={openingBalance || ""}
            onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
            leftIcon={<Banknote className="w-4 h-4" />}
          />
          <Input
            label="Notes (optionnel)"
            value={openingNotes}
            onChange={(e) => setOpeningNotes(e.target.value)}
            placeholder="Ex: Début de service matin"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleOpen}
              loading={openSession.isPending}
              disabled={openingBalance <= 0}
            >
              Ouvrir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Close Session Modal */}
      <Modal
        open={closeModalOpen}
        onOpenChange={setCloseModalOpen}
        title="Clôturer la session"
        description="Comptez votre caisse et entrez le solde final pour générer le rapport Z."
        size="sm"
      >
        <div className="space-y-4">
          <Input
            type="number"
            label="Solde de clôture (compté)"
            required
            min="0"
            value={closingBalance || ""}
            onChange={(e) => setClosingBalance(parseFloat(e.target.value) || 0)}
            leftIcon={<Banknote className="w-4 h-4" />}
          />
          <Input
            label="Notes (optionnel)"
            value={closingNotes}
            onChange={(e) => setClosingNotes(e.target.value)}
          />
          <Input
            label="Raison de l'écart (si applicable)"
            value={discrepancyReason}
            onChange={(e) => setDiscrepancyReason(e.target.value)}
            placeholder="Ex: Rendu de monnaie erroné"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCloseModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleClose}
              loading={closeSession.isPending}
              disabled={closingBalance <= 0}
            >
              Clôturer et générer rapport Z
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
