import React from 'react';
import {
  useBusinessLogicCreditNotes,
  useCreateBusinessLogicCreditNote,
  useApplyBusinessLogicCreditNote,
  usePatientCreditBalance,
  useCreditNoteSummary,
} from '@/hooks/api/useBusinessLogicCreditNotes';
import {
  BUSINESS_LOGIC_CREDIT_NOTE_STATUS_LABELS,
  BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS,
  BUSINESS_LOGIC_CREDIT_NOTE_APPLY_MODE_LABELS,
} from '@/types/business-logic-credit-notes';

export const CreditNotesExample: React.FC = () => {
  // Récupérer les notes de crédit de la pharmacie
  const { data: creditNotes, isLoading: isLoadingCreditNotes } = useBusinessLogicCreditNotes();
  
  // Récupérer le résumé des crédits
  const { data: summary, isLoading: isLoadingSummary } = useCreditNoteSummary();
  
  // Hook pour créer une note de crédit
  const { mutate: createCreditNote, isPending: isCreating } = useCreateBusinessLogicCreditNote();
  
  // Hook pour appliquer une note de crédit
  const { mutate: applyCreditNote, isPending: isApplying } = useApplyBusinessLogicCreditNote();
  
  // Exemple: Récupérer le solde d'un patient
  const patientId = "patient-123"; // À remplacer par l'ID réel du patient
  const { data: patientBalance, isLoading: isLoadingBalance } = usePatientCreditBalance(patientId);
  
  const handleCreateCreditNote = () => {
    createCreditNote({
      originalInvoiceId: "invoice-456",
      pharmacyId: "pharmacy-123", // Note: pharmacyId est automatiquement récupéré du contexte
      patientId: "patient-789",
      reason: "Remise commerciale",
      reasonCode: "customer_discount",
      totalAmount: 50.00,
      currency: "EUR",
      lines: [
        {
          description: "Remise sur produit X",
          amount: 50.00,
          quantity: 1,
        }
      ]
    });
  };
  
  const handleApplyCreditNote = (creditNoteId: string) => {
    applyCreditNote({
      creditNoteId,
      applyDto: {
        applyMode: "credit_account",
        comment: "Crédit appliqué sur compte patient"
      }
    });
  };
  
  if (isLoadingCreditNotes || isLoadingSummary) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notes de Crédit - Business Logic</h1>
      
      {/* Résumé */}
      {summary && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Résumé des crédits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total émis</p>
              <p className="text-xl font-bold">{summary.total_issued}</p>
              <p className="text-sm">{summary.total_amount_issued.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total appliqué</p>
              <p className="text-xl font-bold">{summary.total_applied}</p>
              <p className="text-sm">{summary.total_amount_applied.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annulées</p>
              <p className="text-xl font-bold">{summary.total_void}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-xl font-bold">{summary.total_pending}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Solde patient */}
      {patientBalance && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Solde créditeur patient</h2>
          <p className="text-2xl font-bold text-blue-700">{patientBalance.available_credit.toFixed(2)} €</p>
          <p className="text-sm text-gray-600">
            Total émis: {patientBalance.total_issued.toFixed(2)} € • 
            Total appliqué: {patientBalance.total_applied.toFixed(2)} €
          </p>
        </div>
      )}
      
      {/* Liste des notes de crédit */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notes de crédit</h2>
          <button
            onClick={handleCreateCreditNote}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating ? 'Création...' : 'Créer une note'}
          </button>
        </div>
        
        {creditNotes && creditNotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Numéro</th>
                  <th className="px-4 py-2 text-left">Montant</th>
                  <th className="px-4 py-2 text-left">Raison</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{note.credit_note_number}</td>
                    <td className="px-4 py-2">{note.total_amount.toFixed(2)} {note.currency}</td>
                    <td className="px-4 py-2">
                      {BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS[note.reason_code]}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        note.status === 'issued' ? 'bg-green-100 text-green-800' :
                        note.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                        note.status === 'void' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {BUSINESS_LOGIC_CREDIT_NOTE_STATUS_LABELS[note.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {note.status === 'issued' && (
                        <button
                          onClick={() => handleApplyCreditNote(note.id!)}
                          disabled={isApplying}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Appliquer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Aucune note de crédit trouvée</p>
        )}
      </div>
      
      {/* Informations d'utilisation */}
      <div className="p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Comment utiliser les notes de crédit</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>Créez une note de crédit pour une facture payée ou partiellement payée</li>
          <li>Appliquez la note de crédit en mode "remboursement", "crédit sur compte" ou "future facture"</li>
          <li>Consultez le solde créditeur de chaque patient</li>
          <li>Suivez l'historique des crédits appliqués</li>
        </ul>
      </div>
    </div>
  );
};