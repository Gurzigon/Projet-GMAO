import { mdiArrowLeftBottom, mdiCheck, mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StockInForm from "../components/Forms/stockInForm";
import Header from "../components/Layout/header";
import { useStoreMaterials } from "../hooks/useMaterials";
import materialService from "../services/material.service";
import movementService from "../services/movement.service";

const StockIn = () => {

  const [showStockInForm, setStockInForm] = useState(false);
  const [stockInList, setStockInList] = useState<
    { materialId: number; quantity: number }[]
  >([]);

  const { data: allMaterials = [] } = useStoreMaterials();

  const handleSubmit = (materialId: number, quantity: number) => {
    setStockInList((prev) => {
      const existing = prev.find(item => item.materialId === materialId);
      if (existing) {
        return prev.map(item =>
          item.materialId === materialId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );      
      };
      return [...prev, { materialId, quantity }];    
    });  
    setStockInForm(false);
  };

  const displayList = stockInList.map((item) => {
    const material = allMaterials.find((mat) => mat.id === item.materialId);
    return {
      id: material?.id ?? item.materialId,
      name: material?.name ?? "Inconnu",
      brand: material?.brand ?? "",
      model: material?.model ?? "",
      quantity: item.quantity,
    };
  }); 

  const handleValidateStockIn = async () => {
    try {    
      for (const item of stockInList) {
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
          statusId: 4
        });
        await movementService.createStockIn(material.id, item.quantity);
      };
      alert("Entrée en  stock validée !");
      setStockInList([]); 
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du stock.");
    };
  };

  const handleDeleteFromList = (materialId: number) => {
    setStockInList((prev) => prev.filter(item => item.materialId !== materialId));
  };

  return (
    <main className="bg-white h-screen text-black">
      <Header />
      <section>
        <h1 className="text-center text-3xl font-bold">Entrée en  stock</h1>

        <div className="flex flex-col items-center my-10">
          <button
            type="button"
            className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
            onClick={() => setStockInForm(true)}>            
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
                        value={item.quantity} 
                        onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        if (newQuantity >= 0) {
                          // Mise à jour de la quantité dans stockInList
                          setStockInList((prev) =>
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

        <div className="flex flex-col justify-center items-center mt-10">
          <button
            type="button"
            className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white" onClick={handleValidateStockIn}
          >
            <Icon path={mdiCheck} size={2} />
          </button>
          <p className="text-black font-bold text-center">Valider mon entrée</p>
        </div>
      </section>

      <StockInForm
        show={showStockInForm}
        onClose={() => setStockInForm(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default StockIn;


