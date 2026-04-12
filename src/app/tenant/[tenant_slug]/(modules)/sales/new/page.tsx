"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAuth } from "@/context/AuthContext";
import { useCreateSale } from "@/hooks/api/useSales";
import { PaymentMethod, PAYMENT_METHOD_LABELS } from "@/types/sales";
import { formatCurrency } from "@/utils/formatters";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  EmptyState,
} from "@/components/ui";
import {
  ArrowLeft,
  Search,
  X,
  Trash2,
  Banknote,
  CreditCard,
  Smartphone,
  Shield,
} from "lucide-react";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  batchNumber?: string;
}

const salePaymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  amountPaid: z.number({ invalid_type_error: "Le montant est requis" }).min(0, "Le montant payé doit être positif"),
  notes: z.string().optional(),
});

type SalePaymentFormData = z.infer<typeof salePaymentSchema>;

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  [PaymentMethod.CASH]: Banknote,
  [PaymentMethod.CARD]: CreditCard,
  [PaymentMethod.MOBILE_MONEY]: Smartphone,
  [PaymentMethod.INSURANCE]: Shield,
};

export default function NewSalePage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_CREATE]}>
      <NewSaleContent />
    </ModuleGuard>
  );
}

function NewSaleContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { user } = useAuth();
  const createSale = useCreateSale();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SalePaymentFormData>({
    resolver: zodResolver(salePaymentSchema),
    defaultValues: {
      paymentMethod: PaymentMethod.CASH,
      amountPaid: 0,
      notes: "",
    },
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
  } | null>(null);

  const paymentMethod = watch("paymentMethod");
  const amountPaid = watch("amountPaid") ?? 0;

  const calculations = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const totalDiscount = cart.reduce(
      (sum, item) => sum + (item.discountAmount || 0),
      0,
    );
    const taxRate = 0.18;
    const taxAmount = (subtotal - totalDiscount) * taxRate;
    const totalAmount = subtotal - totalDiscount + taxAmount;
    const changeGiven = Math.max(0, amountPaid - totalAmount);
    const isPaymentSufficient = amountPaid >= totalAmount;

    return { subtotal, totalDiscount, taxAmount, totalAmount, changeGiven, isPaymentSufficient };
  }, [cart, amountPaid]);

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = qty;
    setCart(newCart);
  };

  const onSubmit = (formData: SalePaymentFormData) => {
    if (cart.length === 0 || !calculations.isPaymentSufficient) return;

    createSale.mutate(
      {
        cashierId: user?.id ?? "",
        patientId: selectedPatient?.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || undefined,
          batchNumber: item.batchNumber || undefined,
        })),
        paymentMethod: formData.paymentMethod,
        amountPaid: formData.amountPaid,
        notes: formData.notes || undefined,
        taxRate: 0.18,
      },
      {
        onSuccess: () => {
          router.push(buildPath("/sales"));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/sales"))}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Nouvelle vente
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enregistrez une nouvelle transaction
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>Client (optionnel)</CardTitle></CardHeader>
              <CardContent>
                {selectedPatient ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                      {selectedPatient.phone && (
                        <p className="text-xs text-slate-500">{selectedPatient.phone}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPatient(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Input
                    placeholder="Rechercher un patient..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    helperText="La recherche de patients sera connectée à l'API"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Ajouter des produits</CardTitle></CardHeader>
              <CardContent>
                <Input
                  placeholder="Rechercher par nom, SKU ou code-barres..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  helperText="La recherche de produits sera connectée à l'API"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Articles ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <EmptyState
                    title="Aucun article"
                    description="Recherchez et ajoutez des produits pour créer la vente."
                  />
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(item.unitPrice)} / unité
                          </p>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(index, parseInt(e.target.value) || 1)
                          }
                          className="w-16 h-8 text-center border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                        />
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 w-24 text-right">
                          {formatCurrency(
                            item.quantity * item.unitPrice - item.discountAmount,
                          )}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right — Summary & Payment */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sous-total</span>
                  <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Remise</span>
                    <span>-{formatCurrency(calculations.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">TVA (18%)</span>
                  <span>{formatCurrency(calculations.taxAmount)}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(calculations.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Paiement</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      PaymentMethod.CASH,
                      PaymentMethod.CARD,
                      PaymentMethod.MOBILE_MONEY,
                      PaymentMethod.INSURANCE,
                    ] as const
                  ).map((method) => {
                    const Icon = PAYMENT_ICONS[method] || CreditCard;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setValue("paymentMethod", method)}
                        className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all text-sm font-medium ${
                          paymentMethod === method
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {PAYMENT_METHOD_LABELS[method]}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <Input
                    type="number"
                    label="Montant payé"
                    required
                    step="1"
                    min="0"
                    {...register("amountPaid", { valueAsNumber: true })}
                  />
                  {errors.amountPaid && <p className="text-sm text-red-500 mt-1">{errors.amountPaid.message}</p>}
                </div>

                {calculations.changeGiven > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Monnaie à rendre</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.changeGiven)}
                    </p>
                  </div>
                )}

                {!calculations.isPaymentSufficient && amountPaid > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Insuffisant — manque{" "}
                      {formatCurrency(calculations.totalAmount - amountPaid)}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ajouter des notes..."
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={
                    cart.length === 0 ||
                    !calculations.isPaymentSufficient ||
                    isSubmitting ||
                    createSale.isPending
                  }
                  loading={createSale.isPending}
                >
                  Finaliser la vente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
