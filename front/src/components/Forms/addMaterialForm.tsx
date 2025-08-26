/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <Linter capricieux> */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useCreateMaterial } from "../../hooks/useMaterials";
import serviceService from "../../services/services.service";
import type { IMaterialFormData } from "../../types/Imaterial";
import SearchBarCategory from "../SearchBars/searchBarCategory";
import SearchBarLocalisation from "../SearchBars/searchBarLocalisation";
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

export default function FormMaterialRequest ({ show, onClose }: Props) {
  
  const [toasts, setToasts] = React.useState<
    { id: number; type: "info" | "success" | "error"; message: string }[]
    >([]);
  const { serviceLabel } = useParams<{ serviceLabel: string }>();
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [_formValues, _setFormValues] = useState({
      name: "",
      brand: "",
      model: "",
      quantity: 0,
      registration: "",
      serial_number: "",
      engine_number: "",
      category: "",
      categoryId:0,
      statusId: 4,
      localisation: "",
      localisationId: 0,
      buy_date: "",
      comment: "",
      mimetype :"",      
    });  

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
    

const [form, setForm] = useState<IMaterialFormData>({
  name: "",
  brand: "",
  model: "",
  quantity:0,
  registration: "",
  serial_number: "",
  engine_number:  "",
  categoryId: 0 ,
  localisationId: 0 ,
  buy_date: "",
  comment: "",    
  statusId: 4 ,
  serviceId: 0 ,  
  mimetype: "" ,
});

const { mutate: createMaterial } = useCreateMaterial(); 

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
  
    createMaterial(
      { ...form, serviceId },
      {
        onSuccess: () => {          
          setForm({
            name: "",
            brand: "",
            model: "",
            quantity:0,
            registration: "",
            serial_number: "",
            engine_number:  "",
            categoryId: 0 ,
            localisationId: 0 ,
            buy_date: "" ,
            comment: "" ,    
            statusId: 4 ,
            serviceId: serviceId ,            
            mimetype: "" ,
          });
          addToast("Matériel créée avec succès", "success");         
          setTimeout(() => {
            onClose()
          }, 1000);          
        },        
        onError: (err) => {
          console.error("Erreur création du matériel", err);
          addToast("Erreur lors de la création du matériel", "error");
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
            className="bg-white text-black p-6 rounded-lg w-full max-w-7xl mx-auto  gap-6  overflow-y-auto ">
              <div className="">
                <h2 className="mb-1 font-semibold text-2xl text-center">Créer un matériel</h2>
                <hr className="mb-1 border-gray-300" />
              </div>            

              <div className="grid grid-cols-2 gap-2">
  
  {/* Colonne 2 : Informations principales */}
                <div className="col-span-1 ">
                  <div>
                    <label htmlFor="name" className=" font-medium">Nom</label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className=" font-medium">Marque</label>
                    <input
                      id="brand"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className=" font-medium">Modèle</label>
                    <input
                      id="model"
                      name="model"
                      value={form.model}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="registration" className=" font-medium">Immatriculation</label>
                    <input
                      id="registration"
                      name="registration"
                      value={form.registration}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="serial_number" className=" font-medium">Numéro de série</label>
                    <input
                      id="serial_number"
                      name="serial_number"
                      value={form.serial_number}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="engine_number" className=" font-medium">Numéro de moteur</label>
                    <input
                      id="engine_number"
                      name="engine_number"
                      value={form.engine_number}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className=" font-medium">Quantité</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
  
                <div className="col-span-1 ">
                  <div>
                    <label htmlFor="buy_date" className=" font-medium">Date d'achat</label>
                    <input
                      type="date"
                      id="buy_date"
                      name="buy_date"
                      value={form.buy_date || ""}
                      onChange={handleChange}        
                      className="w-full p-1 border border-gray-400 rounded [color-scheme:light] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
   
                  <div>
                      <label htmlFor="localisationId" className=" font-medium">Localisation</label>
                      <SearchBarLocalisation
                        onSelect={(localisation) => setForm((prev) => ({ ...prev, localisationId: localisation.id }))} 
                      />      
                    </div>
    {/* <div>
      <label htmlFor="localisationId" className=" font-medium">Localisation</label>
      <SearchBarLocalisation
        onSelect={(id) => setForm((prev) => ({ ...prev, localisationId: id }))} 
      />      
    </div>     */}

                    <div>
                      <label htmlFor="categoryId" className="block mb-1 font-medium">Catégorie</label>
                      <SearchBarCategory
                        onSelect={(category) => setForm((prev) => ({ ...prev, categoryId: category.id }))} 
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
    </div>   */}
                    <div>
                      <label htmlFor="comment" className="  font-medium">Commentaire</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}        
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
