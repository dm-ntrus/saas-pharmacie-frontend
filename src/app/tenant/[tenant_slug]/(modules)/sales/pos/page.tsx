"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useCreateSale } from "@/hooks/api/useSales";
import { useProducts } from "@/hooks/api/useInventory";
import { usePatientSearch } from "@/hooks/api/usePatients";
import { usePharmacyConfigResolve } from "@/hooks/api/usePharmacyConfig";
import { PaymentMethod, PAYMENT_METHOD_LABELS } from "@/types/sales";
import { SaleReceipt, type ReceiptData } from "@/components/sales/SaleReceipt";
import {
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Loader,
  Badge,
} from "@/components/ui";
import {
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  Banknote,
  CreditCard,
  Smartphone,
  Shield,
  ScanBarcode,
  UserPlus,
  Printer,
  CheckCircle2,
  FileText,
  Percent,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface CartItem {
  productId: string;
  productName: string;
  barcode?: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  maxStock: number;
  prescriptionLineId?: string;
}

interface PaymentLine {
  method: PaymentMethod;
  amount: number;
}

export default function POSPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_CREATE]}>
      <POSContent />
    </ModuleGuard>
  );
}

function POSContent() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const createSale = useCreateSale();
  const barcodeRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const [barcode, setBarcode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSaleResult, setLastSaleResult] = useState<any>(null);
  const [showInsuranceFields, setShowInsuranceFields] = useState(false);

  // Payment split state
  const [payments, setPayments] = useState<PaymentLine[]>([
    { method: PaymentMethod.CASH, amount: 0 },
  ]);
  const [addingPaymentMethod, setAddingPaymentMethod] = useState(false);

  // Insurance state
  const [insuranceProviderId, setInsuranceProviderId] = useState("");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [insuranceCoveragePercent, setInsuranceCoveragePercent] = useState(0);

  // Discount state
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(0);

  // Fetch tax rate from pharmacy config
  const taxRateConfig = usePharmacyConfigResolve("tax_rate");
  const taxRate = useMemo(() => {
    const val = taxRateConfig.data;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0.18 : parsed > 1 ? parsed / 100 : parsed;
    }
    if (val && typeof val === "object" && "value" in (val as any)) {
      const v = (val as any).value;
      const parsed = parseFloat(v);
      return isNaN(parsed) ? 0.18 : parsed > 1 ? parsed / 100 : parsed;
    }
    return 0.18;
  }, [taxRateConfig.data]);

  const taxLabel = `TVA (${Math.round(taxRate * 100)}%)`;

  // Product search
  const { data: productResults, isLoading: productsLoading } = useProducts(
    searchTerm.length >= 2 ? { search: searchTerm, limit: 20 } : undefined,
  );
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return productResults?.data ?? [];
  }, [productResults, searchTerm]);

  // Barcode lookup — use useProducts with barcode as search term
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const { data: barcodeResults } = useProducts(
    barcodeQuery ? { search: barcodeQuery, limit: 5 } : undefined,
  );

  useEffect(() => {
    if (!barcodeQuery || !barcodeResults?.data) return;
    const products = barcodeResults.data;
    const match = products.find(
      (p: any) => p.barcode === barcodeQuery || p.sku === barcodeQuery,
    );
    if (match) {
      addProductToCart(match);
      toast.success(`${match.name || (match as any).productName} ajouté`);
    } else if (products.length > 0) {
      addProductToCart(products[0]);
      toast.success(`${products[0].name || (products[0] as any).productName} ajouté`);
    } else {
      toast.error(`Produit non trouvé: ${barcodeQuery}`);
    }
    setBarcodeQuery("");
  }, [barcodeResults]);

  // Patient search
  const { data: patientResults } = usePatientSearch(patientSearchTerm);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  // Barcode scan handler
  const handleBarcodeScan = useCallback(
    (code: string) => {
      if (!code.trim()) return;
      const existingIndex = cart.findIndex((i) => i.barcode === code);
      if (existingIndex >= 0) {
        const item = cart[existingIndex];
        if (item.quantity < item.maxStock) {
          const newCart = [...cart];
          newCart[existingIndex] = { ...item, quantity: item.quantity + 1 };
          setCart(newCart);
          toast.success(`${item.productName} — quantité: ${item.quantity + 1}`);
        } else {
          toast.error("Stock insuffisant");
        }
        setBarcode("");
        return;
      }
      setBarcodeQuery(code);
      setBarcode("");
    },
    [cart],
  );

  const addProductToCart = (product: any) => {
    const pid = product.id || product.productId;
    const existingIndex = cart.findIndex((i) => i.productId === pid);
    if (existingIndex >= 0) {
      const item = cart[existingIndex];
      if (item.quantity < item.maxStock) {
        const newCart = [...cart];
        newCart[existingIndex] = { ...item, quantity: item.quantity + 1 };
        setCart(newCart);
      } else {
        toast.error("Stock insuffisant");
      }
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId: pid,
          productName: product.name || product.productName || "Produit",
          barcode: product.barcode || product.sku,
          quantity: 1,
          unitPrice: product.sellingPrice || product.price || 0,
          discountAmount: 0,
          maxStock: product.availableStock ?? product.quantity ?? 999,
        },
      ]);
    }
    setSearchTerm("");
  };

  // Calculations
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    [cart],
  );
  const itemDiscounts = useMemo(
    () => cart.reduce((s, i) => s + i.discountAmount, 0),
    [cart],
  );
  const globalDiscount = subtotal * (globalDiscountPercent / 100);
  const totalDiscount = itemDiscounts + globalDiscount;
  const taxableAmount = subtotal - totalDiscount;
  const taxAmount = taxableAmount * taxRate;
  const grossTotal = taxableAmount + taxAmount;
  const insurancePart = showInsuranceFields ? grossTotal * (insuranceCoveragePercent / 100) : 0;
  const totalAmount = grossTotal - insurancePart;
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const changeGiven = Math.max(0, totalPaid - totalAmount);
  const isPaymentSufficient = totalPaid >= totalAmount;

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    const index = cart.findIndex((i) => i.productId === productId);
    if (index < 0) return;
    const item = cart[index];
    if (qty > item.maxStock) {
      toast.error("Stock insuffisant");
      return;
    }
    const newCart = [...cart];
    newCart[index] = { ...item, quantity: qty };
    setCart(newCart);
  };

  const updateItemDiscount = (productId: string, discount: number) => {
    const index = cart.findIndex((i) => i.productId === productId);
    if (index < 0) return;
    const newCart = [...cart];
    const item = newCart[index];
    newCart[index] = { ...item, discountAmount: Math.max(0, discount) };
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedPatient(null);
    setPayments([{ method: PaymentMethod.CASH, amount: 0 }]);
    setShowInsuranceFields(false);
    setInsuranceProviderId("");
    setInsurancePolicyNumber("");
    setInsuranceCoveragePercent(0);
    setGlobalDiscountPercent(0);
    toast.success("Panier vidé");
  };

  // Payment methods management
  const updatePaymentAmount = (idx: number, amount: number) => {
    const next = [...payments];
    next[idx] = { ...next[idx], amount: Math.max(0, amount) };
    setPayments(next);
  };

  const updatePaymentMethod = (idx: number, method: PaymentMethod) => {
    const next = [...payments];
    next[idx] = { ...next[idx], method };
    setPayments(next);
    if (method === PaymentMethod.INSURANCE) {
      setShowInsuranceFields(true);
    }
  };

  const addPaymentLine = (method: PaymentMethod) => {
    setPayments((p) => [...p, { method, amount: 0 }]);
    setAddingPaymentMethod(false);
    if (method === PaymentMethod.INSURANCE) {
      setShowInsuranceFields(true);
    }
  };

  const removePaymentLine = (idx: number) => {
    if (payments.length <= 1) return;
    const removed = payments[idx];
    setPayments((p) => p.filter((_, i) => i !== idx));
    if (removed.method === PaymentMethod.INSURANCE && !payments.some((p, i) => i !== idx && p.method === PaymentMethod.INSURANCE)) {
      setShowInsuranceFields(false);
    }
  };

  const setExactAmount = () => {
    if (payments.length === 1) {
      setPayments([{ ...payments[0], amount: Math.ceil(totalAmount) }]);
    }
  };

  const onFinalizePayment = () => {
    if (cart.length === 0) return;
    if (!isPaymentSufficient) {
      toast.error("Le montant payé est insuffisant");
      return;
    }

    const primaryPayment = payments.reduce((max, p) => (p.amount > max.amount ? p : max), payments[0]);

    createSale.mutate(
      {
        cashierId: user?.id ?? "",
        patientId: selectedPatient?.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || undefined,
          prescriptionLineId: item.prescriptionLineId || undefined,
        })),
        paymentMethod: primaryPayment.method,
        amountPaid: totalPaid,
        taxRate,
        insuranceProviderId: showInsuranceFields ? insuranceProviderId || undefined : undefined,
        insurancePolicyNumber: showInsuranceFields ? insurancePolicyNumber || undefined : undefined,
        insuranceCoveragePercent: showInsuranceFields ? insuranceCoveragePercent || undefined : undefined,
        internalNotes: payments.length > 1
          ? `Paiement fractionné: ${payments.map((p) => `${PAYMENT_METHOD_LABELS[p.method]}: ${formatCurrency(p.amount)}`).join(", ")}`
          : undefined,
      },
      {
        onSuccess: (result) => {
          setLastSaleResult(result);
          setShowSuccessModal(true);
          setCart([]);
          setSelectedPatient(null);
          setPayments([{ method: PaymentMethod.CASH, amount: 0 }]);
          setShowInsuranceFields(false);
          setGlobalDiscountPercent(0);
        },
      },
    );
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setLastSaleResult(null);
    barcodeRef.current?.focus();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const receiptData: ReceiptData | null = lastSaleResult
    ? {
        saleNumber: lastSaleResult.sale?.saleNumber || lastSaleResult.saleNumber || lastSaleResult.sale?.sale_number || "—",
        date: new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
        pharmacyName: currentOrganization?.name || "Pharmacie",
        pharmacyAddress: (currentOrganization as any)?.address || undefined,
        pharmacyPhone: (currentOrganization as any)?.phone || undefined,
        cashierName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Caissier",
        patientName: selectedPatient?.name,
        items: (lastSaleResult.sale?.items || lastSaleResult.items || []).map((it: any) => ({
          name: it.productName || it.product?.name || "Produit",
          quantity: it.quantity,
          unitPrice: it.unitPrice || it.unit_price || 0,
          discountAmount: it.discountAmount || it.discount_amount || 0,
        })),
        subtotal: parseFloat(lastSaleResult.sale?.subtotal || lastSaleResult.subtotal || "0"),
        totalDiscount: parseFloat(lastSaleResult.sale?.discount_amount || lastSaleResult.discount_amount || "0"),
        taxLabel,
        taxAmount: parseFloat(lastSaleResult.sale?.tax_amount || lastSaleResult.tax_amount || "0"),
        totalAmount: parseFloat(lastSaleResult.sale?.total_amount || lastSaleResult.total_amount || "0"),
        payments: payments.map((p) => ({
          method: PAYMENT_METHOD_LABELS[p.method],
          amount: p.amount,
        })),
        changeGiven: parseFloat(lastSaleResult.sale?.change_given || lastSaleResult.change_given || "0"),
        insuranceProvider: showInsuranceFields ? insuranceProviderId : undefined,
        insuranceCoverage: showInsuranceFields ? insuranceCoveragePercent : undefined,
      }
    : null;

  const paymentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    [PaymentMethod.CASH]: Banknote,
    [PaymentMethod.CARD]: CreditCard,
    [PaymentMethod.MOBILE_MONEY]: Smartphone,
    [PaymentMethod.INSURANCE]: Shield,
  };

  const availableMethods = [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    PaymentMethod.MOBILE_MONEY,
    PaymentMethod.INSURANCE,
  ];

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <>
      <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 no-print">
        {/* Left — Products & Cart */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
          <Card>
            <CardContent className="p-3 sm:p-4 space-y-3">
              {/* Barcode scanner */}
              <div className="relative">
                <Input
                  ref={barcodeRef}
                  placeholder="Scanner le code-barres..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBarcodeScan(barcode);
                    }
                  }}
                  leftIcon={<ScanBarcode className="w-4 h-4" />}
                />
              </div>

              {/* Product search */}
              <div className="relative">
                <Input
                  placeholder="Rechercher produit par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
                {searchTerm.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                    {productsLoading ? (
                      <div className="p-4 flex items-center justify-center">
                        <Loader size="sm" />
                        <span className="ml-2 text-sm text-slate-500">Recherche...</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-sm text-slate-500 text-center">
                        Aucun produit trouvé
                      </div>
                    ) : (
                      searchResults.map((product: any) => (
                        <button
                          key={product.id || product.productId}
                          type="button"
                          onClick={() => {
                            addProductToCart(product);
                            toast.success(`${product.name || product.productName} ajouté`);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                                {product.name || product.productName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {product.barcode || product.sku || "—"} · Stock:{" "}
                                {product.availableStock ?? product.quantity ?? "—"}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600 ml-3 shrink-0">
                              {formatCurrency(product.sellingPrice || product.price || 0)}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Patient + discount row */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedPatient ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm text-slate-900 dark:text-slate-100 flex-1">
                      <span className="text-xs text-slate-500">Client: </span>
                      <span className="font-medium">{selectedPatient.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded"
                      aria-label="Retirer le patient"
                    >
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPatientModal(true)}
                    leftIcon={<UserPlus className="h-4 w-4" />}
                  >
                    Patient
                  </Button>
                )}

                {/* Global discount */}
                <div className="flex items-center gap-1">
                  <Percent className="h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={globalDiscountPercent || ""}
                    onChange={(e) => setGlobalDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    placeholder="Remise %"
                    className="w-20 h-8 px-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Panier ({cart.length})
              </h3>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={clearCart}>
                  Vider
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ScanBarcode className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Scannez ou recherchez des produits
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(item.unitPrice)} / unité
                            {item.prescriptionLineId && (
                              <Badge variant="info" className="ml-2 text-[10px]">
                                <FileText className="h-3 w-3 mr-0.5" /> Ordonnance
                              </Badge>
                            )}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)} aria-label={`Retirer ${item.productName}`}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-12 h-7 text-center border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                            min={1}
                            max={item.maxStock}
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Per-item discount */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.discountAmount || ""}
                            onChange={(e) => updateItemDiscount(item.productId, parseFloat(e.target.value) || 0)}
                            placeholder="Remise"
                            className="w-16 h-7 px-1.5 text-xs text-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 shrink-0">
                          {formatCurrency(item.quantity * item.unitPrice - item.discountAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right — Payment & Summary */}
        <div className="flex flex-col gap-3 lg:gap-4">
          {/* Summary */}
          <Card>
            <CardContent className="p-3 sm:p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Remises</span>
                  <span>-{formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{taxLabel}</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              {insurancePart > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Part assurance ({insuranceCoveragePercent}%)</span>
                  <span>-{formatCurrency(insurancePart)}</span>
                </div>
              )}
              <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                    A PAYER
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods — Split capable */}
          <Card>
            <CardContent className="p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Paiement{payments.length > 1 ? " fractionné" : ""}
                </h3>
                {payments.length === 1 && (
                  <Button variant="ghost" size="sm" onClick={setExactAmount}>
                    Montant exact
                  </Button>
                )}
              </div>

              {payments.map((payment, idx) => {
                const Icon = paymentIcons[payment.method] || CreditCard;
                return (
                  <div key={idx} className="space-y-2">
                    {/* Method selector */}
                    <div className="flex items-center gap-2">
                      <div className="grid grid-cols-4 gap-1 flex-1">
                        {availableMethods.map((method) => {
                          const MIcon = paymentIcons[method] || CreditCard;
                          return (
                            <button
                              type="button"
                              key={method}
                              onClick={() => updatePaymentMethod(idx, method)}
                              className={`p-2 flex items-center justify-center border rounded-lg transition-all text-xs ${
                                payment.method === method
                                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-500"
                              }`}
                              title={PAYMENT_METHOD_LABELS[method]}
                            >
                              <MIcon className="h-4 w-4" />
                            </button>
                          );
                        })}
                      </div>
                      {payments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePaymentLine(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          aria-label="Supprimer ce paiement"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Amount input */}
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-500 shrink-0 w-20 truncate">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                      </span>
                      <input
                        type="number"
                        step="1"
                        value={payment.amount || ""}
                        onChange={(e) => updatePaymentAmount(idx, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="flex-1 h-10 px-3 text-right font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Add another payment method */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setAddingPaymentMethod(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Ajouter un mode de paiement
              </Button>

              {addingPaymentMethod && (
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  {availableMethods.map((method) => {
                    const MIcon = paymentIcons[method] || CreditCard;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => addPaymentLine(method)}
                        className="p-2 flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors text-xs"
                      >
                        <MIcon className="h-4 w-4" />
                        {PAYMENT_METHOD_LABELS[method]}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick amounts for single payment */}
              {payments.length === 1 && payments[0].method === PaymentMethod.CASH && (
                <div className="grid grid-cols-5 gap-1.5">
                  {quickAmounts.map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => updatePaymentAmount(0, amount)}
                      className="px-2 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                    >
                      {formatNumber(amount)}
                    </button>
                  ))}
                </div>
              )}

              {/* Change */}
              {changeGiven > 0 && isPaymentSufficient && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                  <p className="text-xs text-slate-500">Monnaie à rendre</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(changeGiven)}
                  </p>
                </div>
              )}

              {!isPaymentSufficient && totalPaid > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Insuffisant — manque {formatCurrency(totalAmount - totalPaid)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Insurance fields */}
          {showInsuranceFields && (
            <Card>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Assurance
                </h3>
                <Input
                  placeholder="Fournisseur d'assurance"
                  value={insuranceProviderId}
                  onChange={(e) => setInsuranceProviderId(e.target.value)}
                />
                <Input
                  placeholder="N° de police"
                  value={insurancePolicyNumber}
                  onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="% couverture"
                    value={insuranceCoveragePercent || ""}
                    onChange={(e) => setInsuranceCoveragePercent(Math.min(100, parseFloat(e.target.value) || 0))}
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={cart.length === 0 || !isPaymentSufficient || createSale.isPending}
            loading={createSale.isPending}
            onClick={onFinalizePayment}
          >
            Finaliser la vente
          </Button>
        </div>
      </div>

      {/* Patient search modal */}
      <Modal isOpen={showPatientModal} onClose={() => setShowPatientModal(false)} title="Rechercher un patient" size="md">
        <div className="space-y-4">
          <Input
            placeholder="Nom, prénom ou numéro..."
            value={patientSearchTerm}
            onChange={(e) => setPatientSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />
          <div className="max-h-64 overflow-y-auto space-y-1">
            {patientSearchTerm.length < 2 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Tapez au moins 2 caractères
              </p>
            ) : !patientResults || patientResults.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Aucun patient trouvé</p>
            ) : (
              patientResults.map((patient: any) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => {
                    setSelectedPatient({
                      id: patient.id,
                      name: `${patient.firstName || ""} ${patient.lastName || patient.name || ""}`.trim(),
                    });
                    setShowPatientModal(false);
                    setPatientSearchTerm("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                    {patient.firstName || ""} {patient.lastName || patient.name || ""}
                  </p>
                  <p className="text-xs text-slate-500">{patient.phone || patient.email || "—"}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Sale success modal */}
      <Modal isOpen={showSuccessModal} onClose={handleSuccessClose} title="Vente enregistrée" size="md">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Vente effectuée avec succès
          </p>
          {lastSaleResult && (
            <p className="text-sm text-slate-500">
              N° {lastSaleResult.sale?.saleNumber || lastSaleResult.saleNumber || lastSaleResult.sale?.sale_number || "—"}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleSuccessClose}>
              Nouvelle vente
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handlePrintReceipt}
              leftIcon={<Printer className="h-4 w-4" />}
            >
              Imprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hidden receipt for printing */}
      {receiptData && (
        <div className="hidden print:block">
          <SaleReceipt ref={receiptRef} data={receiptData} />
        </div>
      )}
    </>
  );
}
