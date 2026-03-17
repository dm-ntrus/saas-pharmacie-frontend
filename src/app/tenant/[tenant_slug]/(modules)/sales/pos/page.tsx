"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAuth } from "@/context/AuthContext";
import { useCreateSale } from "@/hooks/api/useSales";
import { PaymentMethod, PAYMENT_METHOD_LABELS } from "@/types/sales";
import {
  Button,
  Card,
  CardContent,
  Input,
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
} from "lucide-react";
import { toast } from "react-hot-toast";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  maxStock: number;
}

const paymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  amountPaid: z.string().min(1, "Montant requis"),
});
type PaymentFormData = z.infer<typeof paymentSchema>;

export default function POSPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_CREATE]}>
      <POSContent />
    </ModuleGuard>
  );
}

function POSContent() {
  const { user } = useAuth();
  const { buildPath } = useTenantPath();
  const createSale = useCreateSale();
  const barcodeRef = useRef<HTMLInputElement>(null);

  const [barcode, setBarcode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { register, handleSubmit: handlePaymentSubmit, watch, setValue, reset: resetPayment } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: PaymentMethod.CASH, amountPaid: "" },
  });
  const paymentMethod = watch("paymentMethod");
  const amountPaid = watch("amountPaid");

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    [cart],
  );
  const totalDiscount = useMemo(
    () => cart.reduce((s, i) => s + i.discountAmount, 0),
    [cart],
  );
  const taxAmount = (subtotal - totalDiscount) * 0.18;
  const totalAmount = subtotal - totalDiscount + taxAmount;
  const paidNum = parseFloat(amountPaid || "0");
  const changeGiven = Math.max(0, paidNum - totalAmount);
  const isPaymentSufficient = paidNum >= totalAmount;

  const updateQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    const item = cart[index];
    if (qty > item.maxStock) {
      toast.error("Stock insuffisant");
      return;
    }
    const newCart = [...cart];
    newCart[index] = { ...item, quantity: qty };
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedPatient(null);
    resetPayment();
    toast.success("Panier vidé");
  };

  const onPaymentValid = (data: PaymentFormData) => {
    if (cart.length === 0) return;
    const paid = parseFloat(data.amountPaid || "0");
    if (paid < totalAmount) return;

    createSale.mutate(
      {
        cashierId: user?.id ?? "",
        patientId: selectedPatient?.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || undefined,
        })),
        paymentMethod: data.paymentMethod,
        amountPaid: paid,
        taxRate: 0.18,
      },
      {
        onSuccess: () => {
          setCart([]);
          setSelectedPatient(null);
          resetPayment();
          barcodeRef.current?.focus();
        },
      },
    );
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left — Products & Cart */}
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
        {/* Search */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Input
                ref={barcodeRef}
                placeholder="Scanner le code-barres..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                leftIcon={<ScanBarcode className="w-4 h-4" />}
              />
            </div>
            <Input
              placeholder="Rechercher produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              helperText="La recherche sera connectée à l'API backend"
            />
          </CardContent>
        </Card>

        {/* Patient */}
        {selectedPatient && (
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Client</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {selectedPatient.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPatient(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cart */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Panier ({cart.length})
            </h3>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={clearCart}
              >
                Vider
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ScanBarcode className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Scannez ou recherchez des produits
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(item.unitPrice)} / unité
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              index,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-14 h-8 text-center border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(
                          item.quantity * item.unitPrice - item.discountAmount,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right — Payment */}
      <form onSubmit={handlePaymentSubmit(onPaymentValid)} className="flex flex-col gap-4">
        {/* Summary */}
        <Card>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Remise</span>
                <span>-{formatCurrency(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">TVA (18%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                  TOTAL
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Mode de paiement
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  PaymentMethod.CASH,
                  PaymentMethod.CARD,
                  PaymentMethod.MOBILE_MONEY,
                  PaymentMethod.INSURANCE,
                ] as const
              ).map((method) => {
                const icons: Record<string, React.ComponentType<{ className?: string }>> = {
                  [PaymentMethod.CASH]: Banknote,
                  [PaymentMethod.CARD]: CreditCard,
                  [PaymentMethod.MOBILE_MONEY]: Smartphone,
                  [PaymentMethod.INSURANCE]: Shield,
                };
                const Icon = icons[method] || CreditCard;
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setValue("paymentMethod", method)}
                    className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all text-sm font-medium ${
                      paymentMethod === method
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {PAYMENT_METHOD_LABELS[method]}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Montant reçu
            </h3>
            <input
              type="number"
              step="1"
              {...register("amountPaid")}
              placeholder="0"
              className="w-full h-14 px-4 text-2xl font-bold text-center border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-5 gap-1.5">
              {quickAmounts.map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => setValue("amountPaid", amount.toString())}
                  className="px-2 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                >
                  {formatNumber(amount)}
                </button>
              ))}
            </div>

            {changeGiven > 0 && isPaymentSufficient && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                <p className="text-xs text-slate-500">Monnaie à rendre</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(changeGiven)}
                </p>
              </div>
            )}

            {!isPaymentSufficient && paidNum > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Insuffisant — manque {formatCurrency(totalAmount - paidNum)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Complete */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={
            cart.length === 0 ||
            !isPaymentSufficient ||
            createSale.isPending
          }
          loading={createSale.isPending}
        >
          Finaliser la vente
        </Button>
      </form>
    </div>
  );
}
