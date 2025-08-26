import { mdiArrowLeftBottom, mdiCheck, mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StockOutForm from "../components/Forms/stockOutForm";
import Header from "../components/Layout/header";
import { useStoreMaterials } from "../hooks/useMaterials";
import materialService from "../services/material.service";
import movementService from "../services/movement.service";

const StockOut = () => {
  const [showStockOutForm, setStockOutForm] = useState(false);
  const [stockOutList, setStockOutList] = useState<
    { materialId: number; quantity: number; toRecommend: boolean }[]
  >([]);

  const { data: allMaterials = [] } = useStoreMaterials();

  const handleSubmit = (materialId: number, quantity: number) => {
    setStockOutList((prev) => [...prev, { materialId, quantity, toRecommend: false }]);
    setStockOutForm(false);
  };

  const displayList = stockOutList.map((item) => {
    const material = allMaterials.find((mat) => mat.id === item.materialId);
    return {
      id: material?.id ?? item.materialId,
      name: material?.name ?? "Inconnu",
      brand: material?.brand ?? "",
      model: material?.model ?? "",
      quantityToRemove: item.quantity,
      toRecommend: item.toRecommend,
    };    
  }); 

  const handleValidateStockOut = async () => {
    try {    
      for (const item of stockOutList) {
        const material = allMaterials.find((mat) => mat.id === item.materialId);
        if (!material) continue;       

        await materialService.updateMaterialStore({ 
              id: material.id,
              name: material.name,
              brand: material.brand,
              model: material.model,
              quantity: material.quantity,
              is_store: true,           
              reference: material.reference,
              statusId: item.toRecommend ? 5 : material.statusId,
        });
          await movementService.createStockOut(material.id, item.quantity);
      };
      alert("Sortie de stock validée !");
      setStockOutList([]); 
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du stock.");
    }
  };

  const handleDeleteFromList = (materialId: number) => {
    setStockOutList((prev) => prev.filter(item => item.materialId !== materialId));
  };

  return (

    <main className="bg-white h-screen text-black">
      <Header />
      <section>
        <h1 className="text-center text-3xl font-bold">Sortie de stock</h1>

        <div className="flex flex-col items-center my-10">
          <button
            type="button"
            className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
            onClick={() => setStockOutForm(true)}>            
            <Icon path={mdiPlus} size={2} />
          </button>
          <p className="text-black font-bold text-center">Ajout article</p>
        </div>

        <div className="fixed top-40 left-4 flex flex-col justify-center rounded-xl p-1 items-center z-50 hover:text-white hover:bg-primary">
          <Link to={`/magasin/atelier`} className="flex flex-col items-center">
            <Icon path={mdiArrowLeftBottom} size={2} />
            <p className="font-bold text-center mt-1">Retour magasin</p>
          </Link>
        </div>

        {displayList.length > 0 && (
          <div className="w-full px-10 space-y-4 ">
            {displayList.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 rounded p-4 shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.brand} – {item.model}
                  </p>
                </div>
                <div className="text-right flex flex-col items-center">
                  <p className="font-bold">Quantité</p>
                  <form action="">
                      <input type="number" className=" w-15 bg-white text-black border-black-2 text-center"
                      value={item.quantityToRemove} 
                      onChange={(e) => {
                  const newQuantity = Number(e.target.value);
                  if (newQuantity >= 0) {                    
                    setStockOutList((prev) =>
                      prev.map((entry) =>
                        entry.materialId === item.id
                          ? { ...entry, quantity: newQuantity }
                          : entry
                              )
                            );
                          }
                        }}
                      />
                    </form>
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                  type="checkbox"
                  checked={item.toRecommend}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setStockOutList((prev) =>
                      prev.map((entry) =>
                        entry.materialId === item.id
                          ? { ...entry, toRecommend: checked }
                          : entry
                      )
                    );
                  }} 
                  />
                  <p className="font-semibold">à recommander</p>
                </div>
                 <div className='flex gap-1'>                                           
                    <button
                        type="button"
                        className="btn btn-error" onClick= {() => handleDeleteFromList(item.id)}>
                        <Icon path={mdiTrashCan} size={1} />
                    </button>
                </div>                            
              </div>              
            ))}
          </div>
        )}
        {/* Bouton de validation */}
        <div className="flex flex-col justify-center items-center mt-10">
          <button
            type="button"
            className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white" onClick={handleValidateStockOut}
          >
            <Icon path={mdiCheck} size={2} />
          </button>
          <p className="text-black font-bold text-center">Valider ma sortie</p>
        </div>
      </section>

      <StockOutForm
        show={showStockOutForm}
        onClose={() => setStockOutForm(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default StockOut;


