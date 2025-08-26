import type React from 'react';
import  { useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from 'react-router-dom';
import { useCreateCategory } from "../../hooks/useCategory";
import { useService } from '../../hooks/useService';
import type { ICategoryFormData } from '../../types/ICategory';
import Dialog from "../Utils/dialog";

type Props = {
  show: boolean;
  onClose: () => void;
};

type Toast = {
  id: number;
  type: "info" | "success" | "error";
  message: string;
};

type ToastContainerProps = {
  toasts: Toast[];
};

function ToastContainer({ toasts }: ToastContainerProps) {
  return ReactDOM.createPortal(
    <div className="toast fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
      {toasts.map(({ id, type, message }) => (
        <div key={id} className={`alert alert-${type} shadow-lg mb-2`}>
          <span>{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}

export default function FormCategoryRequest({ show, onClose }: Props) {
  const {serviceLabel} = useParams();
  const { service} = useService(serviceLabel);
  const [label, setLabel] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { mutateAsync: createCategory } = useCreateCategory();

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      addToast("Le nom de la catégorie est requis", "error");
      return;
    };

    if (!service?.id) {
      addToast("Impossible de récupérer le service", "error");
      return;
    }
    
    const newCategory: ICategoryFormData & { serviceId: number } = {
      id: 0, 
      label: label.trim(),
      serviceId: Number(service?.id),
    };    
    
    try {
      await createCategory(newCategory);
      addToast("Catégorie créée avec succès", "success");

      // Ferme le formulaire après succès
      setTimeout(() => {
        onClose();
        setLabel(""); // Réinitialise le champ
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      addToast("Erreur lors de la création de la catégorie", "error");
    }
  };

  return (
    <>
      <Dialog onClose={onClose} closeOnOutsideClick>
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-6 rounded-lg w-full max-w-md mx-auto space-y-4 "
        >
          <h2 className="text-xl font-semibold text-center">Créer une catégorie</h2>
          <div>
            <label htmlFor="label" className="block font-medium mb-1 text-center">Nom de la catégorie</label>
            <input
              id="label"
              name="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              placeholder="Ex: Tracteur, Outil, etc."
            />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-error hover:text-white">
              Annuler
            </button>
            <button type="submit" className="btn btn-success font-bold hover:text-white">
              Créer
            </button>
          </div>
        </form>
      </Dialog>
      <ToastContainer toasts={toasts} />
    </>
  );
}
