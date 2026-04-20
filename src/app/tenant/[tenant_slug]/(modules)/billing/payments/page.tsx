"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Card, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { PaymentList } from "@/components/payments/PaymentList";
import { PaymentUploadForm } from "@/components/payments/PaymentUploadForm";
import { useTenantContext } from "@/context/TenantContext";

export default function BillingPaymentsPage() {
  return (
    <ModuleGuard module="billing" requiredPermissions={[Permission.PAYMENTS_READ]}>
      <PaymentsDashboard />
    </ModuleGuard>
  );
}

function PaymentsDashboard() {
  const { buildPath } = useTenantPath();
  const { currentTenant } = useTenantContext();
  const [activeTab, setActiveTab] = useState("list");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const tenantId = currentTenant?.id || '';

  if (!tenantId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Tenant non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/billing")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Gestion des paiements
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gérez les paiements manuels et suivez leur statut
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {showUploadForm ? 'Voir la liste' : 'Nouveau paiement'}
          </Button>
        </div>
      </div>

      {/* Formulaire d'upload ou liste */}
      {showUploadForm ? (
        <div className="max-w-4xl mx-auto">
          <PaymentUploadForm
            tenantId={tenantId}
            onSuccess={() => {
              setShowUploadForm(false);
              // Vous pourriez ajouter une notification ici
            }}
            onCancel={() => setShowUploadForm(false)}
          />
        </div>
      ) : (
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Liste des paiements</TabsTrigger>
            <TabsTrigger value="pending">En attente de vérification</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <PaymentList
              tenantId={tenantId}
              showFilters={true}
              limit={20}
              onPaymentSelect={(payment) => {
                // Navigation vers les détails du paiement
                window.location.href = buildPath(`/billing/payments/${payment.id}`);
              }}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Paiements en attente de vérification</h3>
                <PaymentList
                  tenantId={tenantId}
                  showFilters={false}
                  limit={50}
                />
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Instructions pour la vérification :</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Vérifiez que le montant sur le reçu correspond à la facture</li>
                    <li>• Assurez-vous que la date du paiement est récente</li>
                    <li>• Confirmez que le reçu provient d'une source fiable</li>
                    <li>• Approuvez ou rejetez le paiement après vérification</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Guide rapide */}
      {!showUploadForm && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Comment fonctionne le paiement manuel ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-medium text-blue-700">Upload du reçu</h4>
                </div>
                <p className="text-sm text-blue-600">
                  L'utilisateur upload une photo/scan du reçu de paiement
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <h4 className="font-medium text-blue-700">Vérification admin</h4>
                </div>
                <p className="text-sm text-blue-600">
                  Un administrateur vérifie le reçu et approuve/rejette le paiement
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <h4 className="font-medium text-blue-700">Facture payée</h4>
                </div>
                <p className="text-sm text-blue-600">
                  Si approuvé, la facture est marquée comme payée et le cycle se termine
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}