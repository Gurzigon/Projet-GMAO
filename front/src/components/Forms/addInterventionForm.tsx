/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <Linter capricieux> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <Linter capricieux> */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useCreateIntervention } from "../../hooks/useInterventions";
import serviceService from "../../services/services.service";
import type { IInterventionFormData } from '../../types/IInterventions';
import SearchBarLocalisation from "../SearchBars/searchBarLocalisation";
import SearchBarPriority from '../SearchBars/searchBarPriority';
import SearchBarType from "../SearchBars/searchBarTyp";
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

export default function FormInterventionRequest ({ show, onClose }: Props) {
  
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
    

  const [form, setForm] = useState<IInterventionFormData>({
    title: "",
    description: "",    
    categoryId: null,
    localisationId: null,
    priorityId: null,
    picture: "",   
    requestor_firstname: "",
    requestor_lastname: "",
    serviceId: null,
    materialId: null,
    typeId: null,    
  });

  const { mutate: createIntervention } = useCreateIntervention(); 

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit =async (e: React.FormEvent) => {
  e.preventDefault();

  if (!serviceId) {
    addToast("Service introuvable !", "error");
    return;
  };

  try {     
    createIntervention(
      { ...form, serviceId },
      {
        onSuccess: () => {          
          setForm({
            title: "",
            description: "",
            categoryId: null,
            localisationId: null,
            priorityId: null,
            picture: "",
            typeId: null,
            serviceId: null,
            materialId: null,
            requestor_firstname: "",
            requestor_lastname: "",             
          });
          addToast("Intervention créée avec succès", "success");          
          setTimeout(() => {
            onClose()
          }, 1000);          
        },
        
        onError: (err) => {
          console.error("Erreur création intervention", err);
          addToast("Erreur lors de la création de l'intervention", "error");
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
            className="bg-white text-black p-2 rounded-lg w-full max-w-7xl mx-auto gap-6 overflow-y-auto ">
              <div className="">
                <h2 className="mb-1 font-semibold text-2xl text-center">Créer une intervention</h2>
                <hr className=" border-gray-300" />
              </div>
              <fieldset className="border p-2 rounded flex justify-between gap-4 mb-8 ">
              <legend className="font-bold text-lg ">Informations demandeur</legend>

              <div>
                <label htmlFor="requestor_lastname" className=" font-medium">Nom</label>
                <input
                  id="requestor_lastname"
                  name="requestor_lastname"
                  value={form.requestor_lastname}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label htmlFor="requestor_firstname" className=" font-medium">Prénom</label>
                <input
                  id="requestor_firstname"
                  name="requestor_firstname"
                  value={form.requestor_firstname}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </fieldset>

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

                <div className="text-black bg-white">
                  <label htmlFor="materialId" className=" font-medium">Matériel concerné</label>  
                  <SearchBarMaterial
                    onSelect={(id) => setForm((prev) => ({ ...prev, materialId: id }))} 
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

              <div >
                <label htmlFor="typeId" className=" font-medium">Domaine d'intervention</label>
                <SearchBarType
                  onSelect={(id) => setForm((prev) => ({ ...prev, typeId: id }))} 
                />  
              </div>

              <div>
                <label htmlFor="localisationId" className=" font-medium">Localisation</label>
                <SearchBarLocalisation
                  onSelect={(localisation) => setForm((prev) => ({ ...prev, localisationId: localisation.id }))} 
                />      
              </div>

              <div>
                <label htmlFor="priorityId" className=" font-medium">Priorité</label>
                <SearchBarPriority
                  onSelect={(id) => setForm((prev) => ({ ...prev, priorityId: id })) } 
                />
              
              </div>

    {/* <div>
      <label htmlFor="picture" className=" font-medium">Ajouter une photo</label>
      <input
        id="picture"
        name="picture"
        type="file"
        onChange={handleChange}
        className="file-input file-input-neutral w-full"
      />
    </div>

    <div>
      <label htmlFor="wantsToBeContacted" className="block mb-1 font-medium">Me prévenir à la fin</label>
      <input
        type="checkbox"
        id="wantsToBeContacted"
        defaultChecked
        className="toggle toggle-success"
      />
    </div> */}   
            </div>

  {/* Boutons d'action sur la ligne entière */}
            <div className="col-span-3 flex justify-center gap-4 mt-6">
              <button type="button" onClick={onClose} className="btn btn-error p-2 hover:text-white">
                Annuler
              </button>
              <button type="submit" className="btn btn-success font-bold p-2 hover:text-white">
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
