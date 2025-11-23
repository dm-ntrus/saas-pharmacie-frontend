"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  XMarkIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, CardContent, Input } from "@/design-system";
import Layout from "@/components/layout/Layout";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";

const batchSchema = Yup.object().shape({
  productId: Yup.string().required("Le produit est requis"),
  batchNumber: Yup.string()
    .min(3, "Le numéro de lot doit contenir au moins 3 caractères")
    .required("Le numéro de lot est requis"),
  manufactureDate: Yup.date().required("La date de fabrication est requise"),
  expirationDate: Yup.date()
    .min(
      Yup.ref("manufactureDate"),
      "La date d'expiration doit être postérieure à la fabrication"
    )
    .required("La date d'expiration est requise"),
  receivedDate: Yup.date().required("La date de réception est requise"),
  initialQuantity: Yup.number()
    .min(1, "La quantité doit être au moins 1")
    .required("La quantité initiale est requise"),
  unitCost: Yup.number()
    .min(0, "Le coût doit être positif")
    .required("Le coût unitaire est requis"),
  supplierName: Yup.string().optional(),
});

const CreateBatchPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchProduct, setSearchProduct] = useState("");

  // Fetch products pour l'autocomplete
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products", searchProduct],
    queryFn: () => apiClient.getProducts({ search: searchProduct, limit: 10 }),
    enabled: searchProduct.length > 0,
  });

  // Mutation création de lot
  const createBatchMutation = useMutation({
    mutationFn: (data: any) => apiClient.createBatch(data),
    onSuccess: () => {
      toast.success("Lot créé avec succès!");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/inventory/batches");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      productId: "",
      batchNumber: "",
      manufactureDate: "",
      expirationDate: "",
      receivedDate: new Date().toISOString().split("T")[0],
      initialQuantity: 0,
      unitCost: 0,
      supplierName: "",
    },
    validationSchema: batchSchema,
    onSubmit: (values) => {
      createBatchMutation.mutate({
        ...values,
        currentQuantity: values.initialQuantity,
        reservedQuantity: 0,
      });
    },
  });

  return (
    <Layout title="Créer un lot - PharmacySaaS">
      <div className="mx-auto space-y-4">
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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Créer un nouveau lot
              </h1>
              <p className="text-gray-600">Ajoutez un nouveau lot</p>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produit <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
                {searchProduct && (
                  <div className="border mt-2 rounded-md bg-white shadow-sm max-h-48 overflow-auto">
                    {loadingProducts ? (
                      <div className="p-2 text-sm text-gray-500">
                        Chargement...
                      </div>
                    ) : productsData?.data?.length ? (
                      productsData.data.map((p: any) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            formik.setFieldValue("productId", p.id);
                            setSearchProduct(p.name);
                          }}
                          className={`p-2 text-sm cursor-pointer hover:bg-sky-50 ${
                            formik.values.productId === p.id
                              ? "bg-sky-100 font-medium"
                              : ""
                          }`}
                        >
                          {p.name} ({p.sku})
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Aucun produit trouvé
                      </div>
                    )}
                  </div>
                )}
                {formik.touched.productId && formik.errors.productId && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.productId}
                  </p>
                )}
              </div>

              <Input
                label="Numéro de lot"
                required
                {...formik.getFieldProps("batchNumber")}
                error={
                  formik.touched.batchNumber && formik.errors.batchNumber
                    ? formik.errors.batchNumber
                    : undefined
                }
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="date"
                  label="Date de fabrication"
                  required
                  {...formik.getFieldProps("manufactureDate")}
                  error={
                    formik.touched.manufactureDate &&
                    formik.errors.manufactureDate
                      ? formik.errors.manufactureDate
                      : undefined
                  }
                />
                <Input
                  type="date"
                  label="Date d'expiration"
                  required
                  {...formik.getFieldProps("expirationDate")}
                  error={
                    formik.touched.expirationDate &&
                    formik.errors.expirationDate
                      ? formik.errors.expirationDate
                      : undefined
                  }
                />
                <Input
                  type="date"
                  label="Date de réception"
                  required
                  {...formik.getFieldProps("receivedDate")}
                  error={
                    formik.touched.receivedDate && formik.errors.receivedDate
                      ? formik.errors.receivedDate
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Quantité initiale"
                  required
                  min="1"
                  {...formik.getFieldProps("initialQuantity")}
                  error={
                    formik.touched.initialQuantity &&
                    formik.errors.initialQuantity
                      ? formik.errors.initialQuantity
                      : undefined
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  label="Coût unitaire"
                  required
                  {...formik.getFieldProps("unitCost")}
                  error={
                    formik.touched.unitCost && formik.errors.unitCost
                      ? formik.errors.unitCost
                      : undefined
                  }
                />
              </div>

              <Input
                label="Fournisseur"
                placeholder="Ex: Pharma Distribution"
                {...formik.getFieldProps("supplierName")}
                error={
                  formik.touched.supplierName && formik.errors.supplierName
                    ? formik.errors.supplierName
                    : undefined
                }
              />

              {/* Valeur totale */}
              {formik.values.initialQuantity > 0 &&
                formik.values.unitCost > 0 && (
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Valeur totale du lot
                    </p>
                    <p className="text-2xl font-bold text-sky-600">
                      $
                      {(
                        formik.values.initialQuantity * formik.values.unitCost
                      ).toFixed(2)}
                    </p>
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createBatchMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  loading={createBatchMutation.isPending}
                  disabled={createBatchMutation.isPending}
                >
                  Créer le lot
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBatchPage;
