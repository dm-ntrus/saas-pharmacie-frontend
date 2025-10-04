import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  XMarkIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Modal } from "@/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";
import { CreatePrescriptionDto } from "@/types";

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const prescriptionItemSchema = Yup.object().shape({
  productId: Yup.string().required("Le produit est requis"),
  quantity: Yup.number()
    .min(1, "La quantité doit être au moins 1")
    .required("La quantité est requise"),
  dosage: Yup.string().required("Le dosage est requis"),
  frequency: Yup.string().required("La fréquence est requise"),
  duration: Yup.string().required("La durée est requise"),
  instructions: Yup.string().optional(),
});

const prescriptionSchema = Yup.object().shape({
  doctorName: Yup.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .required("Le nom du médecin est requis"),
  doctorLicense: Yup.string().optional(),
  doctorPhone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Numéro de téléphone invalide")
    .optional(),
  prescriptionDate: Yup.date().required("La date est requise"),
  validUntil: Yup.date()
    .min(
      Yup.ref("prescriptionDate"),
      "La date de validité doit être postérieure"
    )
    .required("La date de validité est requise"),
  items: Yup.array()
    .of(prescriptionItemSchema)
    .min(1, "Au moins un médicament est requis"),
  notes: Yup.string().optional(),
});

export const CreatePrescriptionModal: React.FC<
  CreatePrescriptionModalProps
> = ({ isOpen, onClose, patientId, patientName }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products } = useQuery({
    queryKey: ["products-search", searchTerm],
    queryFn: () => apiClient.getProducts({ search: searchTerm, limit: 10 }),
    enabled: searchTerm.length > 2,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePrescriptionDto) =>
      apiClient.createPrescription(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-prescriptions", patientId],
      });
      toast.success("Ordonnance créée avec succès");
      handleClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'ordonnance");
    },
  });

  const formik = useFormik({
    initialValues: {
      doctorName: "",
      doctorLicense: "",
      doctorPhone: "",
      prescriptionDate: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [
        {
          productId: "",
          quantity: 1,
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
      notes: "",
    },
    validationSchema: prescriptionSchema,
    onSubmit: (values) => {
      createMutation.mutate(values);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        productId: "",
        quantity: 1,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newItems);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<DocumentTextIcon className="h-5 w-5 text-sky-600" />}
      title={`Nouvelle ordonnance - ${patientName}`}
      size="4xl"
    >
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        {/* Doctor Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Informations du médecin
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Nom du médecin"
              required
              {...formik.getFieldProps("doctorName")}
              error={
                formik.touched.doctorName && formik.errors.doctorName
                  ? formik.errors.doctorName
                  : undefined
              }
            />
            <Input
              label="Licence"
              {...formik.getFieldProps("doctorLicense")}
              error={
                formik.touched.doctorLicense && formik.errors.doctorLicense
                  ? formik.errors.doctorLicense
                  : undefined
              }
            />
            <Input
              label="Téléphone"
              {...formik.getFieldProps("doctorPhone")}
              error={
                formik.touched.doctorPhone && formik.errors.doctorPhone
                  ? formik.errors.doctorPhone
                  : undefined
              }
            />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Dates de validité
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date de prescription"
              required
              {...formik.getFieldProps("prescriptionDate")}
              error={
                formik.touched.prescriptionDate &&
                formik.errors.prescriptionDate
                  ? formik.errors.prescriptionDate
                  : undefined
              }
            />
            <Input
              type="date"
              label="Valide jusqu'au"
              required
              {...formik.getFieldProps("validUntil")}
              error={
                formik.touched.validUntil && formik.errors.validUntil
                  ? formik.errors.validUntil
                  : undefined
              }
            />
          </div>
        </div>

        {/* Prescription Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Médicaments prescrits
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              icon={<PlusIcon className="h-4 w-4" />}
            >
              Ajouter
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {formik.values.items.map((item, index) => (
              <div
                key={index}
                className="p-4 border-2 border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Médicament #{index + 1}
                  </span>
                  {formik.values.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produit
                    </label>
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                    {products && products.length > 0 && (
                      <div className="mt-1 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                        {products.map((product: any) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              formik.setFieldValue(
                                `items.${index}.productId`,
                                product.id
                              );
                              setSearchTerm("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          >
                            {product.name} - {product.sku}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Input
                    type="number"
                    label="Quantité"
                    min="1"
                    {...formik.getFieldProps(`items.${index}.quantity`)}
                  />

                  <Input
                    label="Dosage"
                    placeholder="Ex: 500mg"
                    {...formik.getFieldProps(`items.${index}.dosage`)}
                  />

                  <Input
                    label="Fréquence"
                    placeholder="Ex: 3x par jour"
                    {...formik.getFieldProps(`items.${index}.frequency`)}
                  />

                  <Input
                    label="Durée"
                    placeholder="Ex: 7 jours"
                    {...formik.getFieldProps(`items.${index}.duration`)}
                  />

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions
                    </label>
                    <textarea
                      {...formik.getFieldProps(`items.${index}.instructions`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Instructions spéciales..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes additionnelles
          </label>
          <textarea
            {...formik.getFieldProps("notes")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
            placeholder="Notes pour le pharmacien..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={createMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={createMutation.isPending}
            disabled={createMutation.isPending}
          >
            Créer l'ordonnance
          </Button>
        </div>
      </form>
    </Modal>
  );
};
