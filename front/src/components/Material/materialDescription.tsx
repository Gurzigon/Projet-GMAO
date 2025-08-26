import { mdiCalendar, mdiPencil, mdiTools, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCreateCategory } from "../../hooks/useCategory";
import { useUpdateMaterial } from "../../hooks/useInterventions";
import { useCreateLocalisation } from "../../hooks/useLocalisations";
import { useDeleteMaterial } from "../../hooks/useMaterials";
import type { IMaterial, IUpdateMaterial } from "../../types/Imaterial";
import FormInterventionRequestFromMaterial from "../Forms/addInterventionFromMaterial";
import FormPreventiveRequestFromMaterial from "../Forms/addPreventiveFromMaterial";
import SearchBarCreateCategory from "../SearchBars/SearchBarCreateCategory";
import SearchBarCreateLocalisation from "../SearchBars/searchBarCreateLocalisation";

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

export default function MaterialDescription({  material, onMaterialUpdated,}: {
  material: IMaterial;
  onMaterialUpdated?: (updatedMaterial: IMaterial) => void;
}) {
  
    const [localMaterial, setLocalMaterial] = useState<IMaterial>({...material});
    const [toasts, setToasts] = React.useState<
      { id: number; type: "info" | "success" | "error"; message: string }[]
      >([]);
    const [showForm, setShowForm] = useState(false);
    const [showFormPreventive, setShowFormPreventive] = useState(false);    
    const [isEditing, setIsEditing] = useState(false);
    const { mutateAsync: updateMaterial} = useUpdateMaterial();
    const createCategory = useCreateCategory()
    const createLocalisation = useCreateLocalisation()
    
  // fonction pour ajouter un toast
  const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    // Supprimer automatiquement le toast après 3 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 1000);
  };
  
  const [formValues, setFormValues] = useState({
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

  // À chaque changement de "material", je mets à jour le state local
  useEffect(() => {
    if (material) {
      setLocalMaterial({ ...material });
      setFormValues({
        name: material.name ?? "",
        brand: material.brand ?? "",
        model: material.model ?? "",
        quantity: material.quantity ?? 0,
        registration: material.registration ?? "",
        serial_number: material.serial_number ?? "",
        engine_number: material.engine_number ?? "",
        category: material.category?.label ?? "",
        categoryId: material.categoryId ?? 0,
        statusId: material.statusId ?? 4,
        localisation: material.localisation?.label ?? "", 
        localisationId :material.localisationId ?? 0,    
        mimetype:  "",
        buy_date:material.buy_date ?  new Date(material.buy_date).toISOString().substring(0, 10) : "",
        comment: material.comment ?? "",        
      });
    }
  }, [material]);

  const { mutate: deleteMaterial } = useDeleteMaterial();

  const handleSave = async () => {
    let localisationIdToUse = formValues.localisationId ?? 0;
    let categoryIdToUse = formValues.categoryId ?? 0;

    try {
    // --- Création de la localisation si nécessaire ---
      if ((!localisationIdToUse || localisationIdToUse === 0) && formValues.localisation.trim() !== "") {
        const response = await createLocalisation.mutateAsync({ label: formValues.localisation });
        if (!response?.id) {
          addToast("Impossible de créer la localisation", "error");
          return;
        }
        localisationIdToUse = response.id ??  0;     

        setFormValues(prev => ({ ...prev, localisationId: localisationIdToUse }));
        addToast(`Localisation "${formValues.localisation}" créée`, "success");
      }

    // --- Création de la catégorie si nécessaire ---
    if ((!categoryIdToUse || categoryIdToUse === 0) && formValues.category.trim() !== "") {
     
      const response = await createCategory.mutateAsync({ label: formValues.category, serviceId: material.serviceId });
      
      categoryIdToUse = response.id ??  0;

      if (!categoryIdToUse) {
        addToast("Impossible de créer la catégorie", "error");
        return;
      };

      setFormValues(prev => ({ ...prev, categoryId: categoryIdToUse }));
      addToast(`Catégorie "${formValues.category}" créée`, "success");
    }

    const updatedMaterial: IUpdateMaterial = {
      id: localMaterial.id,
      name: formValues.name ?? material.name,
      brand: formValues.brand ?? material.brand,
      model: formValues.model ?? material.model,
      quantity: formValues.quantity ?? material.quantity,
      registration: formValues.registration ?? material.registration,
      serial_number: formValues.serial_number ?? material.serial_number,
      engine_number: formValues.engine_number ?? material.engine_number,
      comment: formValues.comment ?? material.comment,
      buy_date: formValues.buy_date
        ? new Date(formValues.buy_date)
        : material.buy_date ?? null,
      localisationId:  localisationIdToUse,
      statusId: formValues.statusId ?? material.statusId,
      categoryId: categoryIdToUse,
    };    
      if (!localisationIdToUse) {
        throw new Error("La localisation n'a pas pu être créée.");
      };
     const updatedMaterialWithRelations: IMaterial = await updateMaterial(updatedMaterial);     

    if (onMaterialUpdated) {
      onMaterialUpdated(updatedMaterialWithRelations);      
    };

    addToast("Matériel modifié avec succès", "success");
    setIsEditing(false);

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    addToast("Erreur lors de la mise à jour", "error");
  }
};

  const handleDelete =async () => {
      if (window.confirm("Confirmer la suppression du matériel ?")) {
        try {
          await deleteMaterial(material.id);
          setShowForm(false); 
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);          
        }        
      }
  } ;   

  return (

    <section className="p-4 bg-white rounded w-full text-black space-y-4 z-10 mb-5">
        <div className="flex justify-between">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex flex-col items-center   ">
                <button type="button" className="btn btn-circle btn-accent hover:bg-accent-focus hover:text-white" onClick={() => setShowForm(true)}><Icon path={mdiTools} size={1} /></button>
                <p className="text-black  ">Créer intervention</p>
            </div>
            <div className="flex flex-col items-center   ">
                <button type="button" className="btn btn-circle  btn-accent hover:bg-accent-focus hover:text-white" onClick={() => setShowFormPreventive(true)} ><Icon path={mdiCalendar} size={1} /></button>
                <p className="text-black  ">Créer préventif</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap justify-end">
           {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                >
                  Sauvegarder
                </button>
                {/* Bouton pour annuler les modifications */}
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    // Réinitialiser les champs avec les données originales
                    setFormValues({
                      name: material.name ?? "",
                      brand: material.brand ?? "",
                      model: material.model ?? "",
                      quantity: material.quantity ?? 0,
                      registration: material.registration ?? "",
                      serial_number: material.serial_number ?? "",
                      engine_number: material.engine_number ?? "",
                      category: material.category?.label ?? "",
                      categoryId: material.categoryId ?? 0,
                      statusId: material.statusId ?? 4,
                      localisation: material.localisation?.label ?? "", 
                      localisationId : material.localisationId ?? 0,    
                      mimetype:  "",
                      buy_date: material.buy_date
                        ? new Date(material.buy_date).toISOString().substring(0, 10)
                        : "",
                      comment: material.comment ?? "",
                    });
                    setIsEditing(false);
                  }}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => setIsEditing(true)}
              >
                <Icon path={mdiPencil} size={1} />
              </button>
            )}
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
            >
              <Icon path={mdiTrashCan} size={1} />
            </button>
          </div>
        
        </div>
          <div className="w-full text-center">
           <h2 className="text-3xl font-bold mb-2 mt-2"> {localMaterial.name}</h2>
          </div>
        <div className="grid grid-cols-1  gap-4 ">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="name" className="font-semibold">Nom :</label>
              <input
                type="text"
                id="name"
                value={formValues.name}
                onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full "
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="brand" className="font-semibold">Marque :</label>
              <input
                type="text"
                id="brand"
                value={formValues.brand}
                onChange={(e) => setFormValues(prev => ({ ...prev, brand: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full "
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="model" className="font-semibold">Modèle :</label>
              <input
                type="text"
                id="model"
                value={formValues.model}
                onChange={(e) => setFormValues(prev => ({ ...prev, model: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="quantity" className="font-semibold">Quantité :</label>
              <input
                type="number"
                id="quantity"
                value={formValues.quantity}
                onChange={(e) => setFormValues(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="registration" className="font-semibold">Immatriculation :</label>
              <input
                type="text"
                id="registration"
                value={formValues.registration}
                onChange={(e) => setFormValues(prev => ({ ...prev, registration: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="serial_number" className="font-semibold">N° de série :</label>
              <input
                type="text"
                id="serial_number"
                value={formValues.serial_number}
                onChange={(e) => setFormValues(prev => ({ ...prev, serial_number: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full "
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="engine_number" className="font-semibold">N° moteur :</label>
              <input
                type="text"
                id="engine_number"
                value={formValues.engine_number}
                onChange={(e) => setFormValues(prev => ({ ...prev, engine_number: e.target.value }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1">
              <label htmlFor="quantity" className="font-semibold">Quantité :</label>
              <input
                type=""
                id="quantity"
                value={formValues.quantity}
                onChange={(e) => setFormValues(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                readOnly={!isEditing}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col w-full min-w-0 col-span-1" >
                  <label htmlFor="categoryId" className=" font-medium col-span-1">Categorie: </label>
                  {isEditing ? (
                    <SearchBarCreateCategory
                    onSelect={(category) => {
                          if (category) {
                            setFormValues((prev) => ({
                              ...prev,
                              categoryId: category.id,
                              category: category.label
                            }));
                          } else {
                            // Si aucune catégorie n’est sélectionnée (on tape du texte libre)
                            setFormValues((prev) => ({
                              ...prev,
                              categoryId: 0,
                            }));
                          }
                        }}
                      onChangeText={(text) =>
                        setFormValues((prev) => ({ ...prev, category: text,categoryId: 0, }))}
                    />
                  ) : (
                    <input
                      type="text"
                      id="category"
                      value={formValues.category || ""}
                      readOnly
                      className="input input-bordered bg-gray-100 w-full"
                    />
                  )}
            </div> 
      
            <div className="flex flex-col w-full min-w-0 col-span-1">
                  <label htmlFor="localisationId" className=" font-medium col-span-1">Localisation</label>
                  {isEditing ? (
                    <SearchBarCreateLocalisation
                    onSelect={(localisation) => {
                          if (localisation) {
                            setFormValues((prev) => ({
                              ...prev,
                              localisationId: localisation.id ?? 0,
                              localisation: localisation.label
                            }));
                          } else {
                            // Si aucune catégorie n’est sélectionnée 
                            setFormValues((prev) => ({
                              ...prev,
                              localisationId: 0,                         
                            }));
                          }
                        }}
                      onChangeText={(text) =>
                        setFormValues((prev) => ({ ...prev, localisation: text,
                          localisationId: 0, }))}
                    />
                  ) : (
                    <input
                      type="text"
                      id="localisation"
                      value={formValues.localisation || ""}
                      readOnly
                      className="input input-bordered bg-gray-100 w-full"
                    />
                  )}
            </div> 
            <div className="flex flex-col min-w-0 col-span-1">
                <label htmlFor="buy_date" className="font-semibold">Date d'achat :</label>
                <input
                  type="date"
                  id="buy_date"
                  value={formValues.buy_date }
                  onChange={(e) => setFormValues(prev => ({ ...prev, buy_date: e.target.value }))}
                  readOnly={!isEditing}
                  className="input text-black input-bordered bg-gray-100 w-full [color-scheme:light]"
                />
              </div>
              <div className="flex flex-col min-w-0 col-span-2">
                <label htmlFor="comment" className="font-semibold">Commentaire :</label>
                <textarea
                  id="comment"
                  value={formValues.comment}
                  onChange={(e) => setFormValues(prev => ({ ...prev, comment: e.target.value }))}
                  readOnly={!isEditing}
                  rows={3}
                  className="textarea textarea-bordered bg-gray-100 w-full "
                />
            </div>
            <div>
            {typeof material.picture === "string" && material.picture.trim() !== "" ? (
                // biome-ignore lint/a11y/noRedundantAlt: <linter ne veut pas du mot image dans alt>
              <img src={material.picture} alt="Image du matériel" className="w-48 h-auto mt-4" />
              ) : (
                <span>Aucune image</span>
              )}
            </div>          
        </form>
      </div>      
      <FormInterventionRequestFromMaterial show={showForm} onClose={() => setShowForm(false)} selectedMaterial={material.id} />
      <FormPreventiveRequestFromMaterial show={showFormPreventive} onClose={() => setShowFormPreventive(false)} selectedMaterial={material.id} />
      <ToastContainer toasts={toasts} />  
    </section>
    
  );  
};



