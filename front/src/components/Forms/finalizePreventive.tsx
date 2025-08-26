import { useState } from "react";
import Dialog from "../Utils/dialog";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: ( code: number) => void;
};

export default function FinalPreventiveForm ({ show, onClose, onSubmit }: Props){
    
    const [code, setCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedCode = Number(code);   
        if (!code.trim()) return;
        if (Number.isNaN(parsedCode)) return;

        onSubmit( parsedCode);
    
        setCode("");
        onClose();
    };

    if (!show) return null;

    return(
        <Dialog onClose= {onClose} closeOnOutsideClick >
            
            <form
              onSubmit={handleSubmit}
              className="bg-white text-black p-6 rounded-lg w-full max-w-7xl mx-auto  gap-6  overflow-y-auto ">
                
                <h2 className="mb-1 font-semibold text-2xl text-center">Clôturer l'entretien</h2>               
                
                <label htmlFor="code" className="font-medium mb-2 block">
                    Code de validation
                </label>
                <input
                    id="code"
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-600 rounded"
                />
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-error"
                        aria-label="Annuler la clôture de l'entretien"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success font-bold border-black"
                        aria-label="Confirmer la clôture de l'entretien"
                    >
                        Confirmer
                    </button>
                </div>                            
            </form>
        </Dialog>
    );
};