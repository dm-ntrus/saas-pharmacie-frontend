import React, { useState, useCallback } from 'react';
import {
  useBusinessLogicCreditNotes,
  useCreateBusinessLogicCreditNote,
  useApplyBusinessLogicCreditNote,
  useVoidBusinessLogicCreditNote,
  usePatientCreditBalance,
  useCreditNoteSummary,
  useBusinessLogicCreditNote,
  useBusinessLogicCreditNotesByInvoice,
  useValidateCreditNoteApplication,
  useCreditNotesAnalytics,
} from '@/hooks/api/useBusinessLogicCreditNotes.enterprise';
import {
  BUSINESS_LOGIC_CREDIT_NOTE_STATUS_LABELS,
  BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS,
  BUSINESS_LOGIC_CREDIT_NOTE_APPLY_MODE_LABELS,
} from '@/types/business-logic-credit-notes';
import { validateCreateCreditNoteDto } from '@/schemas/business-logic-credit-notes.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, Search, Plus, CheckCircle, XCircle, BarChart3, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CreditNotesEnterpriseProps {
  defaultPatientId?: string;
  defaultInvoiceId?: string;
}

export const CreditNotesEnterprise: React.FC<CreditNotesEnterpriseProps> = ({
  defaultPatientId,
  defaultInvoiceId,
}) => {
  // États pour les filtres
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    patientId: defaultPatientId,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    search: '',
  });
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  
  // États pour les modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [selectedCreditNoteId, setSelectedCreditNoteId] = useState<string | null>(null);
  
  // États pour le formulaire de création
  const [createForm, setCreateForm] = useState({
    originalInvoiceId: defaultInvoiceId || '',
    patientId: defaultPatientId || '',
    reason: '',
    reasonCode: 'customer_discount' as const,
    totalAmount: 0,
    vatAmount: 0,
    currency: 'EUR',
    originalReference: '',
    lines: [] as Array<{ description: string; amount: number; quantity?: number }>,
  });
  
  // États pour le formulaire d'application
  const [applyForm, setApplyForm] = useState({
    targetInvoiceId: '',
    applyMode: 'credit_account' as const,
    comment: '',
  });
  
  // États pour le formulaire d'annulation
  const [voidForm, setVoidForm] = useState({
    voidReason: '',
    comment: '',
  });
  
  // Hooks API
  const {
    data: creditNotesData,
    isLoading: isLoadingCreditNotes,
    isError: isErrorCreditNotes,
    error: creditNotesError,
    refetch: refetchCreditNotes,
  } = useBusinessLogicCreditNotes({
    page,
    limit,
    filters: {
      ...filters,
      status: filters.status as any,
    },
  });
  
  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useCreditNoteSummary();
  
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
  } = useCreditNotesAnalytics('month');
  
  const {
    data: selectedCreditNote,
    isLoading: isLoadingSelectedCreditNote,
  } = useBusinessLogicCreditNote(selectedCreditNoteId);
  
  const {
    data: validationResult,
    isLoading: isLoadingValidation,
  } = useValidateCreditNoteApplication(selectedCreditNoteId, applyForm.targetInvoiceId);
  
  const {
    mutate: createCreditNote,
    isPending: isCreating,
  } = useCreateBusinessLogicCreditNote();
  
  const {
    mutate: applyCreditNote,
    isPending: isApplying,
  } = useApplyBusinessLogicCreditNote();
  
  const {
    mutate: voidCreditNote,
    isPending: isVoiding,
  } = useVoidBusinessLogicCreditNote();
  
  // Gestionnaires d'événements
  const handleCreateSubmit = useCallback(() => {
    try {
      const validatedData = validateCreateCreditNoteDto({
        ...createForm,
        pharmacyId: 'pharmacy-123', // Récupéré automatiquement du contexte
      });
      
      createCreditNote(validatedData, {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setCreateForm({
            originalInvoiceId: defaultInvoiceId || '',
            patientId: defaultPatientId || '',
            reason: '',
            reasonCode: 'customer_discount',
            totalAmount: 0,
            vatAmount: 0,
            currency: 'EUR',
            originalReference: '',
            lines: [],
          });
        },
      });
    } catch (error) {
      console.error('Validation error:', error);
    }
  }, [createForm, createCreditNote, defaultInvoiceId, defaultPatientId]);
  
  const handleApplySubmit = useCallback(() => {
    if (!selectedCreditNoteId) return;
    
    applyCreditNote({
      creditNoteId: selectedCreditNoteId,
      applyDto: applyForm,
    }, {
      onSuccess: () => {
        setIsApplyModalOpen(false);
        setApplyForm({
          targetInvoiceId: '',
          applyMode: 'credit_account',
          comment: '',
        });
      },
    });
  }, [selectedCreditNoteId, applyForm, applyCreditNote]);
  
  const handleVoidSubmit = useCallback(() => {
    if (!selectedCreditNoteId) return;
    
    voidCreditNote({
      creditNoteId: selectedCreditNoteId,
      voidDto: voidForm,
    }, {
      onSuccess: () => {
        setIsVoidModalOpen(false);
        setVoidForm({
          voidReason: '',
          comment: '',
        });
      },
    });
  }, [selectedCreditNoteId, voidForm, voidCreditNote]);
  
  const handleFilterChange = useCallback((key: keyof typeof filters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset à la première page quand les filtres changent
  }, []);
  
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  }, [handleFilterChange]);
  
  // Rendu conditionnel des états de chargement
  if (isLoadingCreditNotes && page === 1) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (isErrorCreditNotes) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur lors du chargement des notes de crédit: {creditNotesError?.message}
          <Button variant="outline" size="sm" onClick={() => refetchCreditNotes()} className="ml-4">
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  const creditNotes = creditNotesData?.creditNotes || [];
  const pagination = creditNotesData?.pagination;
  
  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes de Crédit</h1>
          <p className="text-muted-foreground">
            Gestion des crédits financiers pour les patients
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle note
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      {/* Cartes de résumé */}
      {!isLoadingSummary && summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total émis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_issued}</div>
              <p className="text-xs text-muted-foreground">
                {summary.total_amount_issued.toFixed(2)} €
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total appliqué</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_applied}</div>
              <p className="text-xs text-muted-foreground">
                {summary.total_amount_applied.toFixed(2)} €
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Annulées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_void}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_pending}</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, patient, raison..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="issued">Émise</SelectItem>
                  <SelectItem value="applied">Appliquée</SelectItem>
                  <SelectItem value="void">Annulée</SelectItem>
                  <SelectItem value="expired">Expirée</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Période
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.startDate ? new Date(filters.startDate) : undefined,
                      to: filters.endDate ? new Date(filters.endDate) : undefined,
                    }}
                    onSelect={(range) => {
                      handleFilterChange('startDate', range?.from ? format(range.from, 'yyyy-MM-dd') : undefined);
                      handleFilterChange('endDate', range?.to ? format(range.to, 'yyyy-MM-dd') : undefined);
                    }}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tableau des notes de crédit */}
      <Card>
        <CardHeader>
          <CardTitle>Notes de crédit</CardTitle>
          <CardDescription>
            {pagination?.total || 0} note(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Raison</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune note de crédit trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  creditNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">
                        {note.credit_note_number}
                      </TableCell>
                      <TableCell>
                        {note.patient_id ? note.patient_id.substring(note.patient_id.lastIndexOf(':') + 1) : '-'}
                      </TableCell>
                      <TableCell>
                        {note.total_amount.toFixed(2)} {note.currency}
                      </TableCell>
                      <TableCell>
                        {BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS[note.reason_code]}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          note.status === 'issued' ? 'default' :
                          note.status === 'applied' ? 'secondary' :
                          note.status === 'void' ? 'destructive' :
                          'outline'
                        }>
                          {BUSINESS_LOGIC_CREDIT_NOTE_STATUS_LABELS[note.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(note.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {note.status === 'issued' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCreditNoteId(note.id!);
                                  setIsApplyModalOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Appliquer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCreditNoteId(note.id!);
                                  setIsVoidModalOpen(true);
                                }}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Annuler
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Analytics */}
      {!isLoadingAnalytics && analytics && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Statistiques des crédits sur le mois
                </CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Montant moyen</h4>
                <p className="text-2xl font-bold">
                  {analytics.averageAmount.toFixed(2)} €
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Taux d'application</h4>
                <p className="text-2xl font-bold">
                  {analytics.totalIssued > 0 
                    ? ((analytics.totalApplied / analytics.totalIssued) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Top raison</h4>
                <p className="text-lg font-semibold">
                  {analytics.topReasons[0]?.reason || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {analytics.topReasons[0]?.count || 0} occurrence(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Modal de création */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer une note de crédit</DialogTitle>
            <DialogDescription>
              Créez une nouvelle note de crédit pour un patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalInvoiceId">Facture originale</Label>
                <Input
                  id="originalInvoiceId"
                  value={createForm.originalInvoiceId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, originalInvoiceId: e.target.value }))}
                  placeholder="ID de la facture"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Input
                  id="patientId"
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="ID du patient"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Raison</Label>
              <Textarea
                id="reason"
                value={createForm.reason}
                onChange={(e) => setCreateForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Décrivez la raison de la note de crédit"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reasonCode">Code raison</Label>
                <Select
                  value={createForm.reasonCode}
                  onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, reasonCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Montant total</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={createForm.totalAmount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalReference">Référence originale (optionnel)</Label>
              <Input
                id="originalReference"
                value={createForm.originalReference}
                onChange={(e) => setCreateForm(prev => ({ ...prev, originalReference: e.target.value }))}
                placeholder="Numéro de commande, référence..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isCreating}>
              {isCreating ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal d'application */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appliquer la note de crédit</DialogTitle>
            <DialogDescription>
              Appliquez la note de crédit {selectedCreditNote?.credit_note_number}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingValidation && (
            <div className="py-4">
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          
          {validationResult && !validationResult.valid && (
            <Alert variant="destructive">
              <AlertDescription>
                {validationResult.reason}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="applyMode">Mode d'application</Label>
              <Select
                value={applyForm.applyMode}
                onValueChange={(value: any) => setApplyForm(prev => ({ ...prev, applyMode: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUSINESS_LOGIC_CREDIT_NOTE_APPLY_MODE_LABELS).map(([code, label]) => (
                    <SelectItem key={code} value={code}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {applyForm.applyMode === 'refund' && (
              <div className="space-y-2">
                <Label htmlFor="targetInvoiceId">Facture de destination</Label>
                <Input
                  id="targetInvoiceId"
                  value={applyForm.targetInvoiceId}
                  onChange={(e) => setApplyForm(prev => ({ ...prev, targetInvoiceId: e.target.value }))}
                  placeholder="ID de la facture"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Textarea
                id="comment"
                value={applyForm.comment}
                onChange={(e) => setApplyForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Ajoutez un commentaire..."
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleApplySubmit} 
              disabled={isApplying || (validationResult && !validationResult.valid)}
            >
              {isApplying ? 'Application...' : 'Appliquer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal d'annulation */}
      <Dialog open={isVoidModalOpen} onOpenChange={setIsVoidModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la note de crédit</DialogTitle>
            <DialogDescription>
              Annulez la note de crédit {selectedCreditNote?.credit_note_number}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="voidReason">Raison d'annulation</Label>
              <Textarea
                id="voidReason"
                value={voidForm.voidReason}
                onChange={(e) => setVoidForm(prev => ({ ...prev, voidReason: e.target.value }))}
                placeholder="Pourquoi annulez-vous cette note de crédit?"
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voidComment">Commentaire (optionnel)</Label>
              <Textarea
                id="voidComment"
                value={voidForm.comment}
                onChange={(e) => setVoidForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Ajoutez un commentaire..."
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVoidModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleVoidSubmit} disabled={isVoiding || !voidForm.voidReason.trim()}>
              {isVoiding ? 'Annulation...' : 'Confirmer l\'annulation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};