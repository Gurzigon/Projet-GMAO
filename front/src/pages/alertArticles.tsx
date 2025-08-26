import { mdiArrowLeftBottom, mdiCheck} from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/header";
import SearchBarStore from "../components/SearchBars/searchBarStore";
import { useStoreMaterials } from "../hooks/useMaterials";
import materialService from "../services/material.service";

const AlertArticles = () => {
  
    const { data: materials = [] } = useStoreMaterials();
    const [articlesToOrder, setArticlesToOrder] = useState<typeof materials>([]);

    useEffect(() => {
      setArticlesToOrder(materials.filter((mat) => mat.statusId === 5));
    }, [materials]);

    const handleSelectMaterial = async  (id: number) => {
      const selected = materials.find((mat) => mat.id === id);
      if (!selected) return;

      try {        
        await materialService.updateMaterialStore({
          id: selected.id,
          name: selected.name,
          brand: selected.brand,
          model: selected.model,
          quantity: selected.quantity,
          is_store: selected.is_store,
          reference: selected.reference,
          categoryId: selected.categoryId,
          statusId: 5, 
        });
       
        setArticlesToOrder((prev) => [...prev, { ...selected, statusId: 5 }]);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article :", error);
        alert("Impossible d'ajouter l'article à la liste.");
      };
    };

  // Réinitialiser la liste après validation 
  const handleResetList = async () => {
    try {
      for (const article of articlesToOrder) {
        await materialService.updateMaterialStore({
          id: article.id,
          name: article.name,
          brand: article.brand,
          model: article.model,
          quantity: article.quantity,
          is_store: article.is_store,
          reference: article.reference,
          categoryId: article.categoryId,
          statusId: 4, 
        });
      }
      alert("Liste réinitialisée avec succès !");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la réinitialisation.");
    }
  };

  return (

    <main className="bg-white h-screen text-black">
      <Header />
      <section>
        <h1 className="text-center text-3xl font-bold">Articles à recommander</h1>

        <div className="flex flex-col items-center my-10">
          <SearchBarStore onSelect={handleSelectMaterial}/>
        </div>

        <div className="fixed top-30 left-4 flex flex-col justify-center rounded-xl p-1 items-center z-50 hover:text-white hover:bg-primary">
          <Link to={`/magasin/atelier`} className="flex flex-col items-center">
            <Icon path={mdiArrowLeftBottom} size={2} />
            <p className="font-bold text-center mt-1">Retour magasin</p>
          </Link>
        </div>

         <div className="w-full px-10 space-y-4 mt-10">
          {articlesToOrder.length === 0 ? (
            <p className="text-center">Aucun article à recommander.</p>
          ) : (
            articlesToOrder.map((item) => (
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
            onClick={handleResetList}>
            <Icon path={mdiCheck} size={2} />
          </button>
          <p className="text-black font-bold text-center">Réinitialiser la liste</p>
        </div>
      </section>      
    </main>
  );
};

export default AlertArticles;


