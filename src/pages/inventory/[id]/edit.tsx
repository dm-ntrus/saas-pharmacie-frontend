import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import Layout from "@/components/layout/Layout";
import { Button, Input, Card, CardContent } from "@/design-system";
import { apiClient } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";
import { UserRole, ProductType } from "@/types";
import { toast } from "react-hot-toast";

const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .required("Le nom est requis"),
  sku: Yup.string()
    .min(3, "Le SKU doit contenir au moins 3 caractères")
    .required("Le SKU est requis"),
  barcode: Yup.string().optional(),
  description: Yup.string().optional(),
  manufacturer: Yup.string().required("Le fabricant est requis"),
  activeIngredient: Yup.string().optional(),
  strength: Yup.string().required("La force est requise"),
  dosageForm: Yup.string().required("La forme posologique est requise"),
  type: Yup.string()
    .oneOf(Object.values(ProductType))
    .required("Le type est requis"),
  price: Yup.number()
    .min(0, "Le prix doit être positif")
    .required("Le prix est requis"),
  costPrice: Yup.number()
    .min(0, "Le coût doit être positif")
    .required("Le coût est requis"),
  requiresPrescription: Yup.boolean(),
  minStockLevel: Yup.number().min(0, "Valeur invalide").optional(),
  maxStockLevel: Yup.number()
    .min(0, "Valeur invalide")
    .test(
      "is-greater",
      "Le stock max doit être supérieur au stock min",
      function (value) {
        return !value || value >= (this.parent.minStockLevel || 0);
      }
    )
    .optional(),
  reorderPoint: Yup.number().min(0, "Valeur invalide").optional(),
  shelfLocation: Yup.string().optional(),
});

const ProductFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = !!id;

  useRequireAuth([UserRole.ADMIN, UserRole.PHARMACIST]);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Fetch product if editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiClient.getProduct(id as string),
    enabled: isEditMode,
  });

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.createProduct(data),
    onSuccess: () => {
      toast.success("Produit créé avec succès!");
      router.push("/inventory/products");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiClient.updateProduct(id as string, data),
    onSuccess: () => {
      toast.success("Produit mis à jour avec succès!");
      router.push("/inventory/products");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      description: product?.description || "",
      manufacturer: product?.manufacturer || "",
      activeIngredient: product?.activeIngredient || "",
      strength: product?.strength || "",
      dosageForm: product?.dosageForm || "",
      type: product?.type || ProductType.MEDICATION,
      price: product?.price || 0,
      costPrice: product?.costPrice || 0,
      requiresPrescription: product?.requiresPrescription || false,
      minStockLevel: product?.minStockLevel || 10,
      maxStockLevel: product?.maxStockLevel || 100,
      reorderPoint: product?.reorderPoint || 20,
      shelfLocation: product?.shelfLocation || "",
    },
    validationSchema: productSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEditMode) {
        updateMutation.mutate(values);
      } else {
        createMutation.mutate(values);
      }
    },
  });

  const steps = [
    {
      number: 1,
      title: "Informations de base",
      fields: ["name", "sku", "barcode", "description"],
    },
    {
      number: 2,
      title: "Détails médicaux",
      fields: [
        "manufacturer",
        "activeIngredient",
        "strength",
        "dosageForm",
        "type",
        "requiresPrescription",
      ],
    },
    { number: 3, title: "Prix et coûts", fields: ["price", "costPrice"] },
    {
      number: 4,
      title: "Stock et emplacement",
      fields: [
        "minStockLevel",
        "maxStockLevel",
        "reorderPoint",
        "shelfLocation",
      ],
    },
  ];

  const isStepValid = (stepNumber: number) => {
    const step = steps.find((s) => s.number === stepNumber);
    if (!step) return true;

    return step.fields.every((field) => {
      const error = formik.errors[field as keyof typeof formik.errors];
      const touched = formik.touched[field as keyof typeof formik.touched];
      return !error || !touched;
    });
  };

  const goToNextStep = () => {
    const step = steps.find((s) => s.number === currentStep);
    if (step) {
      step.fields.forEach((field) => {
        formik.setFieldTouched(field, true);
      });
    }

    if (isStepValid(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <Layout title="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditMode ? "Modifier le produit" : "Nouveau produit"}>
      <div className=" mx-auto space-y-4">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Modifier le produit" : "Nouveau produit"}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? "Modifiez les informations du produit"
                  : "Ajoutez un nouveau produit à l'inventaire"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step.number
                          ? "bg-sky-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <p className="mt-2 text-xs text-center font-medium text-gray-600 max-w-[100px]">
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.number ? "bg-sky-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations de base
                  </h2>

                  <Input
                    label="Nom du produit *"
                    placeholder="Ex: Paracétamol 500mg"
                    {...formik.getFieldProps("name")}
                    error={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : undefined
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="SKU *"
                      placeholder="Ex: PARA500-001"
                      {...formik.getFieldProps("sku")}
                      error={
                        formik.touched.sku && formik.errors.sku
                          ? formik.errors.sku
                          : undefined
                      }
                    />

                    <Input
                      label="Code-barres"
                      placeholder="Ex: 1234567890123"
                      {...formik.getFieldProps("barcode")}
                      error={
                        formik.touched.barcode && formik.errors.barcode
                          ? formik.errors.barcode
                          : undefined
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...formik.getFieldProps("description")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Description détaillée du produit..."
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Medical Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Détails médicaux
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Fabricant *"
                      placeholder="Ex: PharmaCorp"
                      {...formik.getFieldProps("manufacturer")}
                      error={
                        formik.touched.manufacturer &&
                        formik.errors.manufacturer
                          ? formik.errors.manufacturer
                          : undefined
                      }
                    />

                    <Input
                      label="Ingrédient actif"
                      placeholder="Ex: Paracétamol"
                      {...formik.getFieldProps("activeIngredient")}
                      error={
                        formik.touched.activeIngredient &&
                        formik.errors.activeIngredient
                          ? formik.errors.activeIngredient
                          : undefined
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Force/Dosage *"
                      placeholder="Ex: 500mg"
                      {...formik.getFieldProps("strength")}
                      error={
                        formik.touched.strength && formik.errors.strength
                          ? formik.errors.strength
                          : undefined
                      }
                    />

                    <Input
                      label="Forme posologique *"
                      placeholder="Ex: Comprimé"
                      {...formik.getFieldProps("dosageForm")}
                      error={
                        formik.touched.dosageForm && formik.errors.dosageForm
                          ? formik.errors.dosageForm
                          : undefined
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de produit *
                    </label>
                    <select
                      {...formik.getFieldProps("type")}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value={ProductType.MEDICATION}>Médicament</option>
                      <option value={ProductType.OTC}>Sans ordonnance</option>
                      <option value={ProductType.MEDICAL_DEVICE}>
                        Dispositif médical
                      </option>
                      <option value={ProductType.SUPPLEMENT}>Complément</option>
                      <option value={ProductType.COSMETIC}>Cosmétique</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requiresPrescription"
                      {...formik.getFieldProps("requiresPrescription")}
                      checked={formik.values.requiresPrescription}
                      className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <label
                      htmlFor="requiresPrescription"
                      className="text-sm text-gray-700"
                    >
                      Nécessite une ordonnance
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Prix et coûts
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      step="0.01"
                      label="Prix de vente *"
                      placeholder="0.00"
                      {...formik.getFieldProps("price")}
                      error={
                        formik.touched.price && formik.errors.price
                          ? formik.errors.price
                          : undefined
                      }
                    />

                    <Input
                      type="number"
                      step="0.01"
                      label="Coût d'achat *"
                      placeholder="0.00"
                      {...formik.getFieldProps("costPrice")}
                      error={
                        formik.touched.costPrice && formik.errors.costPrice
                          ? formik.errors.costPrice
                          : undefined
                      }
                    />
                  </div>

                  {formik.values.price > 0 && formik.values.costPrice > 0 && (
                    <div className="p-4 bg-sky-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Marge brute</p>
                          <p className="text-lg font-bold text-gray-900">
                            $
                            {(
                              formik.values.price - formik.values.costPrice
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Taux de marge</p>
                          <p className="text-lg font-bold text-gray-900">
                            {(
                              ((formik.values.price - formik.values.costPrice) /
                                formik.values.costPrice) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Markup</p>
                          <p className="text-lg font-bold text-gray-900">
                            {(
                              ((formik.values.price - formik.values.costPrice) /
                                formik.values.price) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Stock & Location */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Stock et emplacement
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      label="Stock minimum"
                      placeholder="10"
                      {...formik.getFieldProps("minStockLevel")}
                      error={
                        formik.touched.minStockLevel &&
                        formik.errors.minStockLevel
                          ? formik.errors.minStockLevel
                          : undefined
                      }
                    />

                    <Input
                      type="number"
                      label="Stock maximum"
                      placeholder="100"
                      {...formik.getFieldProps("maxStockLevel")}
                      error={
                        formik.touched.maxStockLevel &&
                        formik.errors.maxStockLevel
                          ? formik.errors.maxStockLevel
                          : undefined
                      }
                    />

                    <Input
                      type="number"
                      label="Point de réapprovisionnement"
                      placeholder="20"
                      {...formik.getFieldProps("reorderPoint")}
                      error={
                        formik.touched.reorderPoint &&
                        formik.errors.reorderPoint
                          ? formik.errors.reorderPoint
                          : undefined
                      }
                    />
                  </div>

                  <Input
                    label="Emplacement en rayon"
                    placeholder="Ex: A-1-15"
                    {...formik.getFieldProps("shelfLocation")}
                    error={
                      formik.touched.shelfLocation &&
                      formik.errors.shelfLocation
                        ? formik.errors.shelfLocation
                        : undefined
                    }
                  />

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Info:</strong> Le système vous alertera
                      automatiquement lorsque le stock atteint le point de
                      réapprovisionnement.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>

            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <Button type="button" onClick={goToNextStep}>
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                  disabled={!formik.isValid}
                >
                  {isEditMode ? "Mettre à jour" : "Créer le produit"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductFormPage;
