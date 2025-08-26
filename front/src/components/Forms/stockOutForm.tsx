// components/JoinInterventionForm.tsx
import type React from 'react';
import { useState } from 'react';
import { useStoreMaterials } from '../../hooks/useMaterials';
import type { IStoreMaterial } from '../../types/Imaterial';
import SearchBarStore from '../SearchBars/searchBarStore';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (materialId: number, quantity: number) => void;
};

const StockOutForm: React.FC<Props> = ({ show, onClose, onSubmit }) => {

    const { data: storeMaterial = [] } = useStoreMaterials(); 
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
    const [quantityToRemove, setQuantityToRemove] = useState<string>("");
    const selectedMaterial: IStoreMaterial | undefined = storeMaterial.find(
    (mat) => mat.id === selectedMaterialId
    );

    const handleSubmit = () => {
      const quantity = Number(quantityToRemove);
      if (
        selectedMaterial &&
        quantity > 0 &&
        (selectedMaterial.quantity ?? 0) >= quantity
      ) {
        onSubmit(selectedMaterial.id, quantity);
        console.log(selectedMaterial)
      } else {
        alert("Quantité invalide ou insuffisante en stock.");
      }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 z-50 ">
          <div className="bg-white p-4 rounded shadow-lg w-1/3 border-3">
              <form action="" className='w-full' onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="material">
                  <div className='flex flex-col items-center gap-2 '>
                    <div className='w-1/2 '>
                      <SearchBarStore onSelect={(materialId: number) => {
                          setSelectedMaterialId(materialId);
                      }} />
                    </div>
                    
                    <input
                        type="number"
                        className="input validator w-1/2 bg-white text-black border-black border-2 rounded-xl border-gray-600"
                        required
                        placeholder="Quantité"
                        value={quantityToRemove}
                        onChange={(e) => setQuantityToRemove(e.target.value)}                                         
                        />                    
                        <div className="flex justify-center gap-2">
                          <button type= "button" className="btn btn-error" onClick={onClose}>Annuler</button>
                          <button type= "button" className="btn btn-success" onClick={handleSubmit}> Valider </button>
                        </div>
                    </div>
                </label>                
            </form>
        </div>
      </div>        
    );    
};

export default StockOutForm;
