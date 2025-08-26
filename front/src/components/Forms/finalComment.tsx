import { useState } from "react";
import Dialog from "../Utils/dialog";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (comment: string, code: number) => void;
};

export default function FinalCommentForm ({ show, onClose, onSubmit }: Props){

    const [comment, setComment] = useState("");
    const [code, setCode] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedCode = Number(code);
        if (!comment.trim()) return;
        if (!code.trim()) return;
        if (Number.isNaN(parsedCode)) return;

        onSubmit(comment.trim(), parsedCode);
        setComment("");
        setCode("");
        onClose();
    };

    if (!show) return null;

    return(
        <Dialog onClose= {onClose} closeOnOutsideClick >
            <form
              onSubmit={handleSubmit}
              className="bg-white text-black p-6 rounded-lg w-full max-w-7xl mx-auto  gap-6  overflow-y-auto ">
                
                <h2 className="mb-1 font-semibold text-2xl text-center">Commentaire final</h2>
                
                <label htmlFor="comment" className="font-medium mb-2 block">
                    Commentaire
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                    className="w-full p-2 border border-gray-600 rounded resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                />
                <label htmlFor="code" className="font-medium mb-2 block">
                    Code de validation
                </label>
                <input
                    id="code"
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                />
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-error hover:text-white "
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success font-bold hover:text-white"
                    >
                        Confirmer
                    </button>
                </div>                                    
            </form>
        </Dialog>
    )
}