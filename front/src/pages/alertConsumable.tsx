import { mdiArrowLeftBottom, mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/header";
import SearchBarConsumable from "../components/SearchBars/searchBarConsumable";
import { useStoreMaterials,  useUpdateMaterialStore } from "../hooks/useMaterials";
import materialService from "../services/material.service";
import type { IStoreMaterial } from "../types/Imaterial";

const AlertConsumable = () => {
  
    const { data: materials = [] } = useStoreMaterials();
    const consumables = materials.filter((mat) => mat.statusId === 6);
    const [consumablesToOrder, setConsumablesToOrder] = useState<typeof consumables>([]);
    const updateMaterial = useUpdateMaterialStore();
    // biome-ignore lint/suspicious/noExplicitAny: <linter capricieux>
    const sanitizeMaterial = (material: any): IStoreMaterial => {
      return {
        id: material.id,
        name: material.name,
        brand: material.brand,
        model: material.model,
        quantity: material.quantity,
        categoryId: material.categoryId,
        reference: material.reference,
        is_store: material.is_store,
        statusId: material.statusId,
      };
    };

    const handleSelectConsumable = async  (id: number) => {
      
      const selected = consumables.find((mat) => mat.id === id);
      if (!selected) return;

      try {        
        const cleanedMaterial = {
          ...sanitizeMaterial(selected),
          statusId: 7,
          categoryId: selected.categoryId ?? undefined,
        };
     await updateMaterial.mutateAsync(cleanedMaterial);

    // Mise à jour locale
    setConsumablesToOrder(prev => [...prev, { ...cleanedMaterial }]);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du consommable :", error);
        alert("Erreur lors de la mise à jour du consommable.");
      }
    };

    const handleResetList = async() => {
      try {
    for (const consumable of consumablesToOrder) {
      await materialService.updateMaterialStore({
        id: consumable.id,
        name: consumable.name,
        brand: consumable.brand,
        model: consumable.model,
        quantity: consumable.quantity,
        is_store: consumable.is_store,
        reference: consumable.reference,
        categoryId: consumable.categoryId,
        statusId: 6, 
      });
    }
    alert("Liste réinitialisée avec succès !");
    window.location.reload(); 
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la réinitialisation.");
  }
    }
    
  return (

    <main className="bg-white h-screen text-black">
      <Header />
      <section>
        <h1 className="text-center text-3xl font-bold">Consommables à recommander</h1>

        <div className="flex flex-col items-center my-10">
          <SearchBarConsumable onSelect={handleSelectConsumable}/>          
        </div>

        <div className="fixed top-20 left-4 flex flex-col justify-center rounded-xl p-1 items-center z-50 hover:text-white hover:bg-primary">
          <Link to={`/magasin/atelier`} className="flex flex-col items-center">
            <Icon path={mdiArrowLeftBottom} size={2} />
            <p className="font-bold text-center mt-1">Retour magasin</p>
          </Link>
        </div>

         <div className="w-full px-10 space-y-4 mt-6">
          {consumablesToOrder.length === 0 ? (
            <p className="text-center">Aucun consommable à recommander.</p>
          ) : (
            consumablesToOrder.map((item) => (
              <div key={item.id} className="bg-red-100 rounded p-4 shadow">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.brand} – {item.model}
                </p>
                <p className="text-sm text-gray-600">Quantité en stock : {item.quantity}</p>
              </div>
            ))
          )}
        </div>
      
        {/* Bouton de validation */}
        <div className="flex flex-col justify-center items-center mt-10">
          <button
            type="button"
            className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
            onClick={handleResetList}
          >
            <Icon path={mdiCheck} size={2} />
          </button>
          <p className="text-black font-bold text-center">Réinitialiser la liste</p>
        </div>
      </section>      
    </main>
  );
};

export default AlertConsumable;




