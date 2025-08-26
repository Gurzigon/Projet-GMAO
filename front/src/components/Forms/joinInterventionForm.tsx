// components/JoinInterventionForm.tsx
import type React from 'react';
import { useState } from 'react';
import Dialog from '../Utils/dialog';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (validationCode: number) => void;
};

const JoinInterventionForm: React.FC<Props> = ({ show, onClose, onSubmit }) => {
  const [validationCode, setValidationCode] = useState<string>("");

  const handleSubmit = () => {
    const numericCode = Number(validationCode);
    if (!Number.isInteger(numericCode)) {
      return; 
    }
    onSubmit(numericCode);
    setValidationCode("");
    onClose();
  };

  if (!show) return null;

  return (
    <Dialog onClose= {onClose} closeOnOutsideClick >
      <div className="w-full flex justify-center items-center bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded    ">
          <h2 className="text-xl text-center text-black font-bold mb-4">Rejoindre l'intervention</h2>
          <div className='flex justify-center'>
            <input
              type="text"
              placeholder="Code de validation"
              className="input border border-black bg-white text-black w-2/3 mb-4"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-2">
            <button type= "button" className="btn btn-error hover:text-white" onClick={onClose}>Annuler</button>
            <button type= "button" className="btn btn-success hover:text-white" onClick={handleSubmit}>Rejoindre</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinInterventionForm;
