import { mdiArrowDownBold, mdiArrowLeftBottom, mdiArrowUpBold } from "@mdi/js";
import Icon from "@mdi/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/header";
import SearchBarStore from "../components/SearchBars/searchBarStore";
import { Loader } from "../components/Utils/Loader";
import { useMovement } from "../hooks/useMovement";

const StockHistoryPage = () => {
  const { data: movements, isLoading, isError } = useMovement();
  const [filteredMaterialId, setFilteredMaterialId] = useState<number | null>(null);  

  const displayedMovements = movements
  ?.filter(m => m.material) 
  .filter(m => filteredMaterialId ? m.material?.id === filteredMaterialId : true);    
  
  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-600">Erreur lors du chargement de l’historique.</p>;

  return (
    
    <main className="p-6 bg-white min-h-screen text-black">
        <Header />
        <div className="flex flex-col items-center">
          <div>
            <h1 className="text-3xl font-bold text-center mb-6">Historique des mouvements</h1>
          </div>
        <div>
          <SearchBarStore onSelect={(materialId: number) => {
          setFilteredMaterialId(materialId);
          }} />                        
        </div>
        {filteredMaterialId && (
          <div className="text-center mt-2">
              <button
              type='button'
              onClick={() => setFilteredMaterialId(null)}
              className="btn btn-outline btn-sm"
              >
              Réinitialiser la recherche
              </button>
          </div>
          )}
        </div>
            <div className="fixed top-40 left-4 flex flex-col justify-center rounded-xl p-1 items-center z-50 hover:text-white hover:bg-primary">
            <Link to={`/magasin/atelier`} className="flex flex-col items-center">
                <Icon path={mdiArrowLeftBottom} size={2} />
                <p className="font-bold text-center mt-1">Retour magasin</p>
            </Link>
            </div>
      <div className="grid gap-4 max-w-4xl mx-auto mt-25">
         
        {displayedMovements?.map((movement) => (
          <div
            key={movement.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow border-2 ${
              movement.is_incoming ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                path={movement.is_incoming ? mdiArrowDownBold : mdiArrowUpBold}
                size={1.2}
                color={movement.is_incoming ? "green" : "red"}
              />
              <div>
                <p className="font-semibold">{movement.material?.name}</p>
                <p className="text-sm text-gray-600">
                  {movement.material?.brand} {movement.material?.model}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">
                {movement.is_incoming ? "+" : "-"} {movement.quantity}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(movement.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default StockHistoryPage;
