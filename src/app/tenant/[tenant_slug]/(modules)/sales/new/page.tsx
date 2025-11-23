"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BanknotesIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, PaymentMethod, type CreateSaleDto } from "@/types";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Validation Schema
const saleItemSchema = Yup.object().shape({
  productId: Yup.string().required("Produit requis"),
  quantity: Yup.number()
    .min(1, "Quantité minimum: 1")
    .required("Quantité requise"),
  unitPrice: Yup.number().min(0, "Prix invalide").required("Prix requis"),
  discountAmount: Yup.number().min(0, "Remise invalide").optional(),
  batchNumber: Yup.string().optional(),
});

const createSaleSchema = Yup.object().shape({
  patientId: Yup.string().optional(),
  cashierId: Yup.string().required("Caissier requis"),
  items: Yup.array().of(saleItemSchema).min(1, "Au moins un article requis"),
  paymentMethod: Yup.string()
    .oneOf(Object.values(PaymentMethod))
    .required("Mode de paiement requis"),
  amountPaid: Yup.number()
    .min(0, "Montant invalide")
    .required("Montant payé requis"),
  notes: Yup.string().optional(),
});

const NewSalePage: React.FC = () => {
  const router = useRouter();
  const user = useRequireAuth([
    UserRole.ADMIN,
    UserRole.PHARMACIST,
    UserRole.TECHNICIAN,
    UserRole.CASHIER,
  ]);

  const [searchProduct, setSearchProduct] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Query products
  const { data: productsData } = useQuery({
    queryKey: ["products", searchProduct],
    queryFn: () => apiClient.getProducts({ search: searchProduct, limit: 10 }),
    enabled: searchProduct.length > 0,
  });

  // Query patients
  const { data: patientsData } = useQuery({
    queryKey: ["patients", searchPatient],
    queryFn: () => apiClient.getPatients({ search: searchPatient, limit: 10 }),
    enabled: searchPatient.length > 0,
  });

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: (data: CreateSaleDto) => apiClient.createSale(data),
    onSuccess: (response) => {
      toast.success("Vente créée avec succès!");
      router.push(`/sales/${response.sale.id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      patientId: "",
      cashierId: user?.id || "",
      items: [] as any[],
      paymentMethod: PaymentMethod.CASH,
      amountPaid: 0,
      notes: "",
    },
    validationSchema: createSaleSchema,
    onSubmit: (values) => {
      createSaleMutation.mutate(values);
    },
  });

  // Calculations
  const calculations = useMemo(() => {
    const subtotal = formik.values.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const totalDiscount = formik.values.items.reduce(
      (sum, item) => sum + (item.discountAmount || 0),
      0
    );
    const taxAmount = (subtotal - totalDiscount) * 0.18; // 18% TVA
    const totalAmount = subtotal - totalDiscount + taxAmount;
    const changeGiven = Math.max(0, formik.values.amountPaid - totalAmount);

    return {
      subtotal,
      totalDiscount,
      taxAmount,
      totalAmount,
      changeGiven,
      isPaymentSufficient: formik.values.amountPaid >= totalAmount,
    };
  }, [formik.values.items, formik.values.amountPaid]);

  const addProduct = (product: any) => {
    const existingIndex = formik.values.items.findIndex(
      (item) => item.productId === product.id
    );

    if (existingIndex >= 0) {
      const newItems = [...formik.values.items];
      newItems[existingIndex].quantity += 1;
      formik.setFieldValue("items", newItems);
    } else {
      formik.setFieldValue("items", [
        ...formik.values.items,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discountAmount: 0,
          batchNumber: "",
        },
      ]);
    }
    setSearchProduct("");
  };

  const removeItem = (index: number) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newItems);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...formik.values.items];
    newItems[index].quantity = quantity;
    formik.setFieldValue("items", newItems);
  };

  const updateItemDiscount = (index: number, discount: number) => {
    if (discount < 0) return;
    const newItems = [...formik.values.items];
    newItems[index].discountAmount = discount;
    formik.setFieldValue("items", newItems);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            icon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle vente</h1>
            <p className="text-gray-600">
              Enregistrez une nouvelle transaction
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Client (Optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPatient ? (
                    <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedPatient.phone}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(null);
                          formik.setFieldValue("patientId", "");
                        }}
                        icon={<XMarkIcon className="h-4 w-4" />}
                      >
                        Retirer
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        placeholder="Rechercher un patient..."
                        value={searchPatient}
                        onChange={(e) => setSearchPatient(e.target.value)}
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      />
                      {patientsData?.data && patientsData.data.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {patientsData.data.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                setSelectedPatient(patient);
                                formik.setFieldValue("patientId", patient.id);
                                setSearchPatient("");
                              }}
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
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Search & Add */}
            <Card>
              <CardHeader>
                <CardTitle>Ajouter des produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Rechercher par nom, SKU ou code-barres..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                  {productsData?.data && productsData.data.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {productsData.data.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                          onClick={() => addProduct(product)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                SKU: {product?.sku} | Stock: {product.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-sky-600">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Articles ({formik.values.items.length}){" "}
                  <span className="text-red-600">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formik.values.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Aucun article ajouté. Recherchez et ajoutez des produits.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Prix unitaire
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantité
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Remise
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formik.values.items.map((item, index) => {
                          const itemTotal =
                            item.quantity * item.unitPrice -
                            (item.discountAmount || 0);
                          return (
                            <tr key={index}>
                              <td className="px-4 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.productName}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm text-gray-900">
                                  {formatCurrency(item.unitPrice)}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItemQuantity(
                                      index,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.discountAmount || 0}
                                  onChange={(e) =>
                                    updateItemDiscount(
                                      index,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {formatCurrency(itemTotal)}
                                </p>
                              </td>
                              <td className="px-4 py-4">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(index)}
                                  icon={<TrashIcon className="h-4 w-4" />}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                {formik.errors.items && formik.touched.items && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.items as string}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Payment */}
          <div className="space-y-4">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">
                    {formatCurrency(calculations.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remise totale</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(calculations.totalDiscount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (18%)</span>
                  <span className="font-medium">
                    {formatCurrency(calculations.taxAmount)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total à payer
                    </span>
                    <span className="text-lg font-bold text-sky-600">
                      {formatCurrency(calculations.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode de paiement
                    </label> */}
                  {/* <div className="grid grid-cols-2 gap-2">
                      {Object.values(PaymentMethod).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() =>
                            formik.setFieldValue("paymentMethod", method)
                          }
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                            formik.values.paymentMethod === method
                              ? "border-sky-600 bg-sky-50 text-sky-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {method === PaymentMethod.CASH && "Espèces"}
                          {method === PaymentMethod.CARD && "Carte Bancaire"}
                          {method === PaymentMethod.INSURANCE && "Assurance"}
                          {method === PaymentMethod.MOBILE && "Mobile Money"}
                          {method === PaymentMethod.MIXED && "Mixte"}
                        </button>
                      ))}
                    </div> */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "paymentMethod",
                          PaymentMethod.CASH
                        )
                      }
                      className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                        formik.values.paymentMethod === PaymentMethod.CASH
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <BanknotesIcon className="h-6 w-6" />
                      <p className="text-sm font-medium">Espèces</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "paymentMethod",
                          PaymentMethod.CARD
                        )
                      }
                      className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                        formik.values.paymentMethod === PaymentMethod.CARD
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCardIcon className="h-6 w-6" />
                      <p className="text-sm font-medium">Carte Bancaire</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "paymentMethod",
                          PaymentMethod.INSURANCE
                        )
                      }
                      className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                        formik.values.paymentMethod === PaymentMethod.INSURANCE
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ReceiptPercentIcon className="h-6 w-6" />
                      <p className="text-sm font-medium">Assurance</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "paymentMethod",
                          PaymentMethod.MOBILE
                        )
                      }
                      className={`p-3 flex items-center justify-center gap-2 border-2 rounded-lg transition-all ${
                        formik.values.paymentMethod === PaymentMethod.MOBILE
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <QrCodeIcon className="h-6 w-6" />
                      <p className="text-sm font-medium">Mobile Money</p>
                    </button>
                  </div>
                </div>

                <Input
                  type="number"
                  label="Montant payé"
                  required
                  step="0.01"
                  {...formik.getFieldProps("amountPaid")}
                  error={
                    formik.touched.amountPaid && formik.errors.amountPaid
                      ? formik.errors.amountPaid
                      : undefined
                  }
                />

                {calculations.changeGiven > 0 && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      Monnaie à rendre
                    </p>
                    <p className="text-2xl font-bold text-green-600 text-center">
                      {formatCurrency(calculations.changeGiven)}
                    </p>
                  </div>
                )}

                {!calculations.isPaymentSufficient &&
                  formik.values.amountPaid > 0 && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-sm text-red-600 text-center">
                        Montant insuffisant. Manquant:{" "}
                        {formatCurrency(
                          calculations.totalAmount - formik.values.amountPaid
                        )}
                      </p>
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    {...formik.getFieldProps("notes")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Ajouter des notes..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={
                    !calculations.isPaymentSufficient ||
                    formik.values.items.length === 0 ||
                    createSaleMutation.isPending
                  }
                  loading={createSaleMutation.isPending}
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
};

export default NewSalePage;
