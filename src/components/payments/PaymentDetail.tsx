'use client';

import { useState, useEffect } from 'react';
import { usePaymentDetails, usePaymentVerification } from '@/hooks/usePayments';
import {
  Payment,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_PROVIDER_ICONS,
} from '@/types/payments';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Alert,
  AlertDescription,
  Separator,
  Textarea,
  Label,
  Switch,
} from '@/components/ui';
import {
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface PaymentDetailProps {
  paymentId: string;
  tenantId: string;
  showActions?: boolean;
  onUpdate?: (payment: Payment) => void;
}

export function PaymentDetail({
  paymentId,
  tenantId,
  showActions = true,
  onUpdate,
}: PaymentDetailProps) {
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  
  const {
    isLoading: isLoadingDetails,
    error: detailsError,
    data: payment,
    loadPayment,
  } = usePaymentDetails();

  const {
    isLoading: isLoadingVerification,
    error: verificationError,
    verifyPayment,
  } = usePaymentVerification();

  // Charger les détails du paiement
  useEffect(() => {
    if (paymentId) {
      loadPayment(paymentId);
    }
  }, [paymentId, loadPayment]);

  const handleRefresh = () => {
    loadPayment(paymentId);
  };

  const handleVerifyPayment = async () => {
    if (!payment) return;

    try {
      const verifiedPayment = await verifyPayment({
        paymentId: payment.id,
        approved: isApproved,
        notes: verificationNotes,
      });

      if (onUpdate && verifiedPayment) {
        onUpdate(verifiedPayment);
      }

      // Réinitialiser le formulaire
      setVerificationNotes('');
      setShowVerificationForm(false);

      // Recharger les détails
      loadPayment(paymentId);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleDownloadProof = () => {
    if (payment?.proofUrl) {
      window.open(payment.proofUrl, '_blank');
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const formatAmount = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (detailsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur lors du chargement du paiement : {detailsError}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingDetails || !payment) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isLoading = isLoadingDetails || isLoadingVerification;

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Détails du paiement</h2>
          <p className="text-muted-foreground">ID: {payment.id}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          {payment.proofUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadProof}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger la preuve
            </Button>
          )}
          
          {showActions && payment.status === 'pending' && (
            <Button
              variant={showVerificationForm ? "outline" : "default"}
              size="sm"
              onClick={() => setShowVerificationForm(!showVerificationForm)}
              className="gap-2"
            >
              {showVerificationForm ? 'Annuler' : 'Vérifier'}
            </Button>
          )}
        </div>
      </div>

      {/* Grille d'informations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informations du paiement
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <Badge className={`mt-1 ${PAYMENT_STATUS_COLORS[payment.status]}`}>
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Méthode</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{PAYMENT_PROVIDER_ICONS[payment.provider]}</span>
                  <span>{PAYMENT_PROVIDER_LABELS[payment.provider]}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant</p>
                <p className="text-xl font-bold mt-1">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Devise</p>
                <p className="text-lg font-medium mt-1">{payment.currency}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Facture associée</p>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4" />
                <Link
                  href={`/tenant/${tenantId}/billing/invoices/${payment.invoiceId}`}
                  className="text-blue-600 hover:underline"
                >
                  {payment.invoiceId}
                </Link>
              </div>
            </div>
            
            {payment.transactionId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID de transaction</p>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                  {payment.transactionId}
                </code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates et métadonnées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates et historique
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Créé le</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Mis à jour le</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(payment.updatedAt)}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Métadonnées */}
            {payment.metadata && Object.keys(payment.metadata).length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Métadonnées</p>
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(payment.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Vérification admin */}
            {payment.metadata?.verifiedBy && (
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Vérification admin</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Vérifié par: {payment.metadata.verifiedBy}</span>
                  </div>
                  {payment.metadata.verifiedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Le: {formatDate(payment.metadata.verifiedAt)}
                      </span>
                    </div>
                  )}
                  {payment.metadata.verificationNotes && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Notes: {payment.metadata.verificationNotes}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preuve de paiement */}
      {payment.proofUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Preuve de paiement
            </CardTitle>
            <CardDescription>
              Document uploadé comme preuve de paiement
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Fichier de preuve</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.metadata?.fileName || 'Document'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadProof}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Ouvrir
                </Button>
              </div>
              
              {/* Aperçu pour les images */}
              {payment.proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Aperçu :</p>
                  <img
                    src={payment.proofUrl}
                    alt="Preuve de paiement"
                    className="max-h-64 rounded-md border mx-auto"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de vérification (admin) */}
      {showVerificationForm && payment.status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isApproved ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Vérification du paiement
            </CardTitle>
            <CardDescription>
              Approuver ou rejeter ce paiement manuel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {verificationError && (
              <Alert variant="destructive">
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="approval-switch" className="text-base">
                  {isApproved ? 'Approuver le paiement' : 'Rejeter le paiement'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isApproved 
                    ? 'Le paiement sera marqué comme terminé et la facture sera payée'
                    : 'Le paiement sera marqué comme échoué et restera en attente'
                  }
                </p>
              </div>
              
              <Switch
                id="approval-switch"
                checked={isApproved}
                onCheckedChange={setIsApproved}
                disabled={isLoadingVerification}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-notes">Notes de vérification</Label>
              <Textarea
                id="verification-notes"
                placeholder="Ajoutez des notes sur la vérification (optionnel)"
                value={verificationNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVerificationNotes(e.target.value)}
                disabled={isLoadingVerification}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Ces notes seront visibles par l'utilisateur
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowVerificationForm(false)}
                disabled={isLoadingVerification}
              >
                Annuler
              </Button>
              
              <Button
                onClick={handleVerifyPayment}
                disabled={isLoadingVerification}
                className="gap-2"
              >
                {isLoadingVerification ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Traitement...
                  </>
                ) : isApproved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approuver
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      {showActions && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                asChild
                className="gap-2"
              >
                <Link href={`/tenant/${tenantId}/billing/invoices/${payment.invoiceId}`}>
                  <FileText className="h-4 w-4" />
                  Voir la facture
                </Link>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="gap-2"
              >
                <Link href={`/tenant/${tenantId}/billing/payments`}>
                  <CreditCard className="h-4 w-4" />
                  Voir tous les paiements
                </Link>
              </Button>
              
              {payment.status === 'pending' && !showVerificationForm && (
                <Button
                  variant="default"
                  onClick={() => setShowVerificationForm(true)}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Vérifier ce paiement
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}