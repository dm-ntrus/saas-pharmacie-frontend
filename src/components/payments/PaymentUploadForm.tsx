'use client';

import React, { useState, useCallback } from 'react';
import { usePaymentUpload } from '@/hooks/usePayments';
import { paymentsService } from '@/services/payments.service';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

interface PaymentUploadFormProps {
  invoiceId?: string;
  tenantId: string;
  onSuccess?: (payment: any) => void;
  onCancel?: () => void;
}

export function PaymentUploadForm({
  invoiceId: initialInvoiceId,
  tenantId,
  onSuccess,
  onCancel,
}: PaymentUploadFormProps) {
  const [invoiceId, setInvoiceId] = useState(initialInvoiceId || '');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { isLoading, error, uploadPaymentProofFile } = usePaymentUpload();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      setFileError(null);
      return;
    }

    // Valider le fichier
    const validation = paymentsService.validatePaymentFile(selectedFile);
    
    if (!validation.valid) {
      setFileError(validation.error || 'Fichier invalide');
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setFileError(null);

    // Créer une URL de prévisualisation pour les images
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceId.trim()) {
      setFileError('L\'ID de la facture est requis');
      return;
    }

    if (!file) {
      setFileError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      const payment = await uploadPaymentProofFile(invoiceId, file);
      
      if (onSuccess) {
        onSuccess(payment);
      }

      // Réinitialiser le formulaire
      setFile(null);
      setPreviewUrl(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Payment upload failed:', err);
    }
  }, [invoiceId, file, uploadPaymentProofFile, onSuccess, previewUrl]);

  const handleCancel = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    
    if (onCancel) {
      onCancel();
    }
  }, [previewUrl, onCancel]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Uploader une preuve de paiement
        </CardTitle>
        <CardDescription>
          Téléchargez une photo ou un scan de votre reçu de paiement
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID de la facture */}
          <div className="space-y-2">
            <Label htmlFor="invoiceId">ID de la facture *</Label>
            <Input
              id="invoiceId"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              placeholder="ex: INV-2024-001"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              L'identifiant unique de la facture à payer
            </p>
          </div>

          {/* Upload de fichier */}
          <div className="space-y-2">
            <Label htmlFor="paymentProof">Preuve de paiement *</Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="paymentProof"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                disabled={isLoading}
              />
              
              <label htmlFor="paymentProof" className="cursor-pointer">
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    
                    {previewUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Aperçu :</p>
                        <img
                          src={previewUrl}
                          alt="Aperçu"
                          className="max-h-48 mx-auto rounded-md border"
                        />
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                      }}
                      disabled={isLoading}
                    >
                      Changer de fichier
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="font-medium">Cliquez pour sélectionner un fichier</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, GIF, WEBP ou PDF (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {fileError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-800 mb-2">Instructions :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Assurez-vous que le reçu est lisible</li>
              <li>• Vérifiez que le montant correspond à la facture</li>
              <li>• Incluez la date et la référence du paiement</li>
              <li>• Après upload, un admin vérifiera votre paiement</li>
            </ul>
          </div>

          {/* Erreurs globales */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !file || !invoiceId.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Uploader la preuve
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}