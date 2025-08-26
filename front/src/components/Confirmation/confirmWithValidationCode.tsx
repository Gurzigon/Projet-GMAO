// components/JoinInterventionForm.tsx
import type React from 'react';
import { useState } from 'react';
import Dialog from '../Utils/dialog';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (validationCode: number) => void;
};

const ValidateInterventionForm: React.FC<Props> = ({ show, onClose, onSubmit }) => {
  const [validationCode, setValidationCode] = useState<string>("");

  const handleSubmit = () => {
    const numericCode = Number(validationCode);
    if (!Number.isInteger(numericCode)) {
      return; 
    };
    onSubmit(numericCode);
    setValidationCode("");
    onClose();
  };

  if (!show) return null;

  return (
     <Dialog onClose= {onClose} closeOnOutsideClick >
    <div className=" inset-0 flex justify-center items-center bg-opacity-50 z-50 ">
      <div className="bg-white p-4 rounded  w-full max-w-md ">
        <h2 className="text-xl text-center text-black font-bold mb-4">Validez avec votre code</h2>
        <input
          type="password"
          placeholder="Code de validation"
          className="input border border-black bg-white text-black w-full mb-4 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
          value={validationCode}
          onChange={(e) => setValidationCode(e.target.value)}
        />
        <div className="flex justify-center gap-2">
          <button type= "button" className="btn btn-error hover:text-white" onClick={onClose}>Annuler</button>
          <button type= "button" className="btn btn-success hover:text-white" onClick={handleSubmit}>Valider</button>
        </div>
      </div>
    </div>
    </Dialog>
  );
};

export default ValidateInterventionForm;
