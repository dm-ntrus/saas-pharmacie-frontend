import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  BanknotesIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import { Button, Input, Card, CardContent } from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, PaymentMethod, type CreateSaleDto } from "@/types";
import { toast } from "react-hot-toast";

const POSPage: React.FC = () => {
  const router = useRouter();
  const user = useRequireAuth([
    UserRole.ADMIN,
    UserRole.PHARMACIST,
    UserRole.TECHNICIAN,
    UserRole.CASHIER,
  ]);

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [showProductResults, setShowProductResults] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

  // Auto focus barcode input
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Search products by barcode
  const { data: barcodeProduct } = useQuery({
    queryKey: ["product-barcode", barcode],
    queryFn: () => apiClient.getProductByBarcode(barcode),
    enabled: barcode.length > 0,
  });

  // Search products by name/SKU
  const { data: productsData } = useQuery({
    queryKey: ["products-search", searchTerm],
    queryFn: () => apiClient.getProducts({ search: searchTerm, limit: 10 }),
    enabled: searchTerm.length > 2,
  });

  // Search patients
  const { data: patientsData } = useQuery({
    queryKey: ["patients-search", searchTerm],
    queryFn: () => apiClient.getPatients({ search: searchTerm, limit: 5 }),
    enabled: searchTerm.length > 2 && showPatientResults,
  });

  // Add barcode product to cart
  useEffect(() => {
    if (barcodeProduct) {
      addToCart(barcodeProduct);
      setBarcode("");
      barcodeInputRef.current?.focus();
    }
  }, [barcodeProduct]);

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: (data: CreateSaleDto) => apiClient.createSale(data),
    onSuccess: (response) => {
      toast.success("Vente enregistrée avec succès!");
      // Reset form
      setCart([]);
      setSelectedPatient(null);
      setAmountPaid("");
      setPaymentMethod(PaymentMethod.CASH);
      barcodeInputRef.current?.focus();
      // Optional: Open print receipt
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la vente");
    },
  });

  const addToCart = (product: any) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discountAmount: 0,
          stock: product.stock,
        },
      ]);
    }
    setSearchTerm("");
    setShowProductResults(false);
    toast.success(`${product.name} ajouté au panier`);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newCart = [...cart];
    if (quantity > newCart[index].stock) {
      toast.error("Stock insuffisant");
      return;
    }
    newCart[index].quantity = quantity;
    setCart(newCart);
  };

  const updateDiscount = (index: number, discount: number) => {
    if (discount < 0) return;
    const newCart = [...cart];
    const maxDiscount = newCart[index].quantity * newCart[index].unitPrice;
    if (discount > maxDiscount) {
      toast.error("Remise trop élevée");
      return;
    }
    newCart[index].discountAmount = discount;
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Panier vidé");
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) => sum + (item.discountAmount || 0),
    0
  );
  const taxAmount = (subtotal - totalDiscount) * 0.18;
  const totalAmount = subtotal - totalDiscount + taxAmount;
  const changeGiven = Math.max(0, parseFloat(amountPaid || "0") - totalAmount);
  const isPaymentSufficient = parseFloat(amountPaid || "0") >= totalAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error("Panier vide");
      return;
    }

    if (!isPaymentSufficient) {
      toast.error("Montant payé insuffisant");
      return;
    }

    const saleData: CreateSaleDto = {
      patientId: selectedPatient?.id,
      cashierId: user?.id || "",
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountAmount: item.discountAmount,
      })),
      paymentMethod,
      amountPaid: parseFloat(amountPaid),
      notes: "",
    };

    createSaleMutation.mutate(saleData);
  };

  const quickAmounts = [10, 20, 50, 100, 200];

  return (
    <Layout title="Point de vente - PharmacySaaS">
      <div className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Products & Cart */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Barcode Scanner */}
                <div className="relative">
                  <Input
                    ref={barcodeInputRef}
                    placeholder="Scanner le code-barres..."
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 border-2 border-sky-600 rounded"></div>
                  </div>
                </div>

                {/* Manual Search */}
                <div className="relative">
                  <Input
                    placeholder="Rechercher produit ou patient..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowProductResults(true);
                      setShowPatientResults(false);
                    }}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />

                  {/* Product Results Dropdown */}
                  {showProductResults &&
                    productsData?.data &&
                    productsData.data.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                        <div className="p-2 border-b border-gray-200 flex gap-2">
                          <button
                            onClick={() => {
                              setShowProductResults(true);
                              setShowPatientResults(false);
                            }}
                            className={`px-3 py-1 text-sm rounded ${
                              showProductResults && !showPatientResults
                                ? "bg-sky-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Produits
                          </button>
                          <button
                            onClick={() => {
                              setShowProductResults(false);
                              setShowPatientResults(true);
                            }}
                            className={`px-3 py-1 text-sm rounded ${
                              showPatientResults
                                ? "bg-sky-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            Patients
                          </button>
                        </div>

                        {!showPatientResults &&
                          productsData.data.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => addToCart(product)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    SKU: {product.sku} | Stock: {product.stock}
                                  </p>
                                </div>
                                <p className="font-bold text-sky-600">
                                  {formatCurrency(product.sellingPrice)}
                                </p>
                              </div>
                            </button>
                          ))}

                        {showPatientResults &&
                          patientsData?.data &&
                          patientsData.data.map((patient) => (
                            <button
                              key={patient.id}
                              onClick={() => {
                                setSelectedPatient(patient);
                                setSearchTerm("");
                                setShowPatientResults(false);
                                toast.success("Patient sélectionné");
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                              <p className="font-medium text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {patient.phone}
                              </p>
                            </button>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          {selectedPatient && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(null)}
                    icon={<XMarkIcon className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart Items */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Panier ({cart.length}) <span className="text-red-600">*</span>
              </h3>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  icon={<TrashIcon className="h-4 w-4" />}
                >
                  Vider
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Scannez ou recherchez des produits pour commencer
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.unitPrice)} / unité
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(index)}
                          icon={<TrashIcon className="h-4 w-4" />}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Quantity */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Quantité</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  index,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 h-8 text-center border border-gray-300 rounded"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Discount */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Remise</p>
                          <input
                            type="number"
                            step="0.01"
                            value={item.discountAmount || 0}
                            onChange={(e) =>
                              updateDiscount(
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Sous-total
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(
                            item.quantity * item.unitPrice -
                              (item.discountAmount || 0)
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

        {/* Right Panel - Payment */}
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Remise totale</span>
                    <span className="font-medium">
                      -{formatCurrency(totalDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (18%)</span>
                  <span className="font-medium">{formatCurrency(taxAmount)}</span>
                </div>

                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      TOTAL
                    </span>
                    <span className="text-xl font-bold text-sky-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Mode de paiement</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                  className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                    paymentMethod === PaymentMethod.CASH
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BanknotesIcon className="h-6 w-6" />
                  <p className="text-sm font-medium">Espèces</p>
                </button>

                <button
                  onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                  className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                    paymentMethod === PaymentMethod.CARD
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <p className="text-sm font-medium">Carte Bancaire</p>
                </button>

                <button
                  onClick={() => setPaymentMethod(PaymentMethod.INSURANCE)}
                  className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                    paymentMethod === PaymentMethod.INSURANCE
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ReceiptPercentIcon className="h-6 w-6" />
                  <p className="text-sm font-medium">Assurance</p>
                </button>

                <button
                  onClick={() => setPaymentMethod(PaymentMethod.MOBILE)}
                  className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                    paymentMethod === PaymentMethod.MOBILE
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <QrCodeIcon className="h-6 w-6" />
                        <p className="text-sm font-medium">Mobile Money</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Amount Paid */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Montant reçu <span className="text-red-600">*</span></h3>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                className="w-full h-14 px-4 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              />

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAmountPaid(amount.toString())}
                    className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {amount}€
                  </button>
                ))}
              </div>

              {/* Change Given */}
              {changeGiven > 0 && isPaymentSufficient && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Monnaie à rendre
                  </p>
                  <p className="text-3xl font-bold text-green-600 text-center mt-1">
                    {formatCurrency(changeGiven)}
                  </p>
                </div>
              )}

              {!isPaymentSufficient && amountPaid && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 text-center">
                    Montant insuffisant : manque{" "}
                    {formatCurrency(totalAmount - parseFloat(amountPaid))}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Complete Sale Button */}
          <Button
            onClick={handleCompleteSale}
            size="lg"
            className="w-full"
            disabled={
              cart.length === 0 ||
              !isPaymentSufficient ||
              createSaleMutation.isPending
            }
            loading={createSaleMutation.isPending}
          >
            Finaliser la vente
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default POSPage;