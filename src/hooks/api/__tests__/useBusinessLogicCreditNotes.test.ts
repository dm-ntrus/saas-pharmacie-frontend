import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useBusinessLogicCreditNotes } from '../useBusinessLogicCreditNotes.enterprise';
import { apiService } from '@/lib/api';

// Mock de l'API
vi.mock('@/lib/api', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock du contexte tenant
vi.mock('@/hooks/useTenantApiContext', () => ({
  useTenantApiContext: () => ({
    pharmacyId: 'pharmacy-123',
    tenantId: 'tenant-456',
  }),
}));

// Mock du debounce
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

// Mock des schémas
vi.mock('@/schemas/business-logic-credit-notes.schema', () => ({
  validateCreateCreditNoteDto: vi.fn((data) => data),
  validateApplyCreditNoteDto: vi.fn((data) => data),
  validateVoidCreditNoteDto: vi.fn((data) => data),
}));

// Wrapper pour les tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useBusinessLogicCreditNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBusinessLogicCreditNotes hook', () => {
    it('devrait récupérer les notes de crédit avec succès', async () => {
      const mockData = {
        creditNotes: [
          {
            id: 'cn-1',
            credit_note_number: 'CN-2024-001',
            pharmacy_id: 'pharmacy-123',
            original_invoice_id: 'invoice-456',
            total_amount: 100.50,
            status: 'issued',
            reason: 'Remise commerciale',
            reason_code: 'customer_discount',
            currency: 'EUR',
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      (apiService.get as any).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useBusinessLogicCreditNotes({ page: 1, limit: 20 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(apiService.get).toHaveBeenCalledWith(
        '/business-logic/pharmacies/pharmacy-123/credit-notes?page=1&limit=20',
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs de l\'API', async () => {
      const mockError = new Error('Network error');
      (apiService.get as any).mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useBusinessLogicCreditNotes(),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('devrait appliquer les filtres correctement', async () => {
      const mockData = { creditNotes: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
      (apiService.get as any).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useBusinessLogicCreditNotes({
          filters: {
            status: 'issued',
            patientId: 'patient-789',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            search: 'test',
          },
        }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.get).toHaveBeenCalledWith(
        '/business-logic/pharmacies/pharmacy-123/credit-notes?page=1&limit=20&status=issued&patientId=patient-789&startDate=2024-01-01&endDate=2024-01-31&search=test',
        expect.any(Object)
      );
    });
  });

  describe('useCreateBusinessLogicCreditNote hook', () => {
    it('devrait créer une note de crédit avec succès', async () => {
      const mockResponse = {
        id: 'cn-new',
        credit_note_number: 'CN-2024-002',
        pharmacy_id: 'pharmacy-123',
        original_invoice_id: 'invoice-456',
        total_amount: 50.00,
        status: 'issued',
        reason: 'Test',
        reason_code: 'customer_discount',
        currency: 'EUR',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      };

      (apiService.post as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useCreateBusinessLogicCreditNote(),
        { wrapper: createWrapper() }
      );

      const createDto = {
        originalInvoiceId: 'invoice-456',
        pharmacyId: 'pharmacy-123',
        patientId: 'patient-789',
        reason: 'Test',
        reasonCode: 'customer_discount' as const,
        totalAmount: 50.00,
        currency: 'EUR',
      };

      result.current.mutate(createDto);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiService.post).toHaveBeenCalledWith(
        '/business-logic/pharmacies/pharmacy-123/credit-notes',
        expect.objectContaining({
          originalInvoiceId: 'invoice-456',
          reason: 'Test',
          totalAmount: 50.00,
        })
      );
    });
  });

  describe('usePatientCreditBalance hook', () => {
    it('devrait récupérer le solde d\'un patient avec succès', async () => {
      const mockResponse = {
        patient_id: 'patient-789',
        total_issued: 200.00,
        total_applied: 100.00,
        available_credit: 100.00,
        credit_note_numbers: ['CN-2024-001', 'CN-2024-002'],
      };

      (apiService.get as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePatientCreditBalance('patient-789'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(apiService.get).toHaveBeenCalledWith(
        '/business-logic/pharmacies/pharmacy-123/credit-notes/patients/patient-789/balance',
        expect.any(Object)
      );
    });

    it('devrait retourner null quand patientId est null', () => {
      const { result } = renderHook(
        () => usePatientCreditBalance(null),
        { wrapper: createWrapper() }
      );

      expect(result.current.isPending).toBe(true);
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCreditNoteSummary hook', () => {
    it('devrait récupérer le résumé avec succès', async () => {
      const mockResponse = {
        total_issued: 5,
        total_applied: 3,
        total_void: 1,
        total_pending: 1,
        total_amount_issued: 500.00,
        total_amount_applied: 300.00,
      };

      (apiService.get as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useCreditNoteSummary(),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(apiService.get).toHaveBeenCalledWith(
        '/business-logic/pharmacies/pharmacy-123/credit-notes/summary',
        expect.any(Object)
      );
    });
  });
});