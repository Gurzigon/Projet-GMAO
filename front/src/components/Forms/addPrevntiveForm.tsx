/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <Linter capricieux> */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useCreatePreventive } from "../../hooks/usePreventive";
import serviceService from "../../services/services.service";
import type { IPreventiveFormData } from "../../types/IPreventive";
import SearchBarMaterial from "../SearchBars/searchbarMaterial";
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
};

export default function FormPreventiveRequest ({ show, onClose }: Props) {
  
  const [toasts, setToasts] = React.useState<
    { id: number; type: "info" | "success" | "error"; message: string }[]
    >([]);
  const { serviceLabel } = useParams<{ serviceLabel: string }>();
  const [serviceId, setServiceId] = useState<number | null>(null);

  // fonction pour ajouter un toast
  const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    // Supprimer automatiquement le toast après 3 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 1000);
  };

useEffect(() => {
  const fetchServiceId = async () => {
    try {
      const services = await serviceService.getAllServices();
      const matchedService = services.find((s) => s.label === serviceLabel);
      if (matchedService) {
        setServiceId(matchedService.id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du service :", error);
    }
  };
  fetchServiceId();
}, [serviceLabel]);
    
const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; 
};

const [form, setForm] = useState<IPreventiveFormData>({
  title: "",
  description: "",    
  date:null,
  serviceId: null,
  materialId: 0,
});

const { mutate: createPreventive } = useCreatePreventive(); 

if (!show) return null;

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  if (name === "date") {
    setForm(prev => ({
      ...prev,
      date: value ? new Date(value) : null,
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};

 const handleSubmit =async (e: React.FormEvent) => {
  e.preventDefault();

  if (!serviceId) {
    addToast("Service introuvable !", "error");
    return;
  };

  try {
    
    if (!form.date) {
        addToast("La date est requise", "error");
        return;
    };

    const dateToSend = new Date(form.date);
   
    createPreventive(
      { ...form, serviceId, date: dateToSend },
      {
        onSuccess: () => {          
          setForm({
            title: "",
            description: "",
            date: null ,
            materialId: 0,
            serviceId: serviceId
          });
          addToast("Préventif créée avec succès", "success");          
          setTimeout(() => {
            onClose()
          }, 1000);          
        },        
        onError: (err) => {
          console.error("Erreur création préventif", err);
          addToast("Erreur lors de la création du préventif", "error");
        },
      }
    );   
  } catch(error){
    console.error("Erreur lors de la récupération des utilisateurs", error);
    addToast("Erreur lors de la vérification du code.", "error");
  }
};

  return (
        <>
          <Dialog onClose= {onClose} closeOnOutsideClick >
         
          <form
            onSubmit={handleSubmit}
            className="bg-white text-black p-6 rounded-lg w-full max-w-7xl mx-auto gap-6 overflow-y-auto ">
          <div className="">
            <h2 className="mb-1 font-semibold text-2xl text-center">Créer un entretien préventif</h2>
            <hr className="mb-1 border-gray-300" />
          </div>   

          <div className="grid grid-cols-2 gap-2">
  
  {/* Colonne 2 : Informations principales */}
          <div className="col-span-1 ">
            <div>
              <label htmlFor="title" className=" font-medium">Titre</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="text-black bg-white">
              <label htmlFor="materialId" className=" font-medium">Matériel concerné</label>  
              <SearchBarMaterial
                onSelect={(id) => setForm((prev) => ({ ...prev, materialId: id }))} 
              /> 
            </div>

            <div>
              <label htmlFor="date" className="  font-medium">À effectuer avant le </label>
              <input
              type="date"
                id="date"
                name="date"
                value={formatDateForInput(form.date)}
                onChange={handleChange}
                required        
                className="w-full p-1 border [color-scheme:light] border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              />
            </div>
    
     {/* <div>
      <label htmlFor="categoryId" className="block mb-1 font-medium">Catégorie</label>
      <SearchBarCategory
        onSelect={(id) => setForm((prev) => ({ ...prev, categoryId: id }))} 
      />   
      
    </div> */}
          </div>

          <div className="col-span- ">

            <div>
              <label htmlFor="description" className="  font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

          </div>

    {/* Boutons d'action sur la ligne entière */}
          <div className="col-span-3 flex justify-center gap-4 mt-6">
              <button type="button" onClick={onClose} className="btn btn-error hover:text-white">
              Annuler
              </button>
              <button type="submit" className="btn btn-success font-bold hover:text-white">
              Confirmer ma demande
              </button>
          </div>
        </div>
        </form>
        </Dialog>
        <ToastContainer toasts={toasts} />
        </>    
  );
}
