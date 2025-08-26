import  type React from 'react';

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  show: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = 'Confirmation',
  message,
  onConfirm,
  onCancel,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center text-black justify-center border-2 border-black bg-opacity-50">
      <div className="bg-white rounded-lg text-center shadow-lg p-6 w-full max-w-md border-2 border-black">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
          type='button'
            className="btn btn-outline"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
          type='button'
            className="btn btn-error hover:text-white"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
