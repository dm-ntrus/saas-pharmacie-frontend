import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CubeIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal } from "@/design-system";

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  onConfirm: (data: any) => void;
  isLoading?: boolean;
}

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

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  productId,
  onConfirm,
  isLoading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      productId: productId || "",
      batchNumber: "",
      manufactureDate: "",
      expirationDate: "",
      receivedDate: new Date().toISOString().split("T")[0],
      initialQuantity: 0,
      currentQuantity: 0,
      reservedQuantity: 0,
      unitCost: 0,
      supplierName: "",
    },
    validationSchema: batchSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onConfirm({
        ...values,
        currentQuantity: values.initialQuantity,
        reservedQuantity: 0,
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<CubeIcon className="h-5 w-5 text-sky-600" />}
      title="Nouveau lot"
      size="2xl"
    >
      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <Input
          label="Numéro de lot"
          required
          placeholder="Ex: LOT2025001"
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
              formik.touched.manufactureDate && formik.errors.manufactureDate
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
              formik.touched.expirationDate && formik.errors.expirationDate
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
              formik.touched.initialQuantity && formik.errors.initialQuantity
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

        {formik.values.initialQuantity > 0 && formik.values.unitCost > 0 && (
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Valeur totale du lot</p>
            <p className="text-2xl font-bold text-sky-600">
              $
              {(formik.values.initialQuantity * formik.values.unitCost).toFixed(
                2
              )}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={isLoading}
            disabled={isLoading}
          >
            Créer le lot
          </Button>
        </div>
      </form>
    </Modal>
  );
};
