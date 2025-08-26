import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useCreateUser } from "../../hooks/useUser";
import type { ICreateUser, IUser } from "../../types/IUser";
import Dialog from "../Utils/dialog";

type Props = {
  show: boolean;
  onClose: () => void;
  userToCreate?: IUser | null;
  onSuccess: (user: IUser) => void  
};

type Toast = {
  id: number;
  type: "info" | "success" | "error";
  message: string;
};

type ToastContainerProps = {
  toasts: Toast[];
};

function ToastContainer({ toasts }: ToastContainerProps) {
  return ReactDOM.createPortal(
    <div className="toast fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
      {toasts.map(({ id, type, message }) => (
        <div key={id} className={`alert alert-${type} shadow-lg mb-2`}>
          <span>{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default function  CreateUserForm({ onClose}: Props) {
    const createUserMutation = useCreateUser();
    const queryClient = useQueryClient();
    const [toasts, setToasts] = React.useState<
        { id: number; type: "info" | "success" | "error"; message: string }[]
        >([]);

    // fonction pour ajouter un toast
    const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);     
      // Supprimer automatiquement le toast après 3 secondes
      setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 1000);
    };

    const [form, setForm] = useState<ICreateUser>({
        firstname: "",
        lastname:"",
        email: "",
        password: "",
        validation_code:0,
        roleId: "",
        serviceId:"",
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      setForm(prev => ({
        ...prev,
        [name]:
          name === "validation_code" || name === "roleId" || name === "serviceId"
            ? value === '' ? '' : Number(value)
            : value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      createUserMutation.mutate({
        ...form,
        validation_code: Number(form.validation_code),
      }, {
        onSuccess: () => {
          addToast("Utilisateur créé avec succès", "success");
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setForm({ firstname: "", lastname: "", email: "", password: "", validation_code: 0, roleId: "", serviceId: "" });
          onClose();
          
        },
        onError: () => {
          addToast("Erreur lors de la création de l'utilisateur", "error");
        }
      });
    };

      return (
              <>
                <Dialog onClose= {onClose} closeOnOutsideClick >
                 
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white text-black p-6 rounded-lg w-full mx-auto gap-6 overflow-y-auto ">
                    <div className="">
                      <h2 className="mb-1 font-semibold text-2xl text-center">Créer un utilisateur</h2>
                      <hr className="mb-1 border-gray-300" />
                    </div>           
        
          <div className="grid grid-cols-1 gap-2">        
          
          {/* Colonne 2 : Informations principales */}
            <div className="col-span-1 ">
              <div>
                <label htmlFor="lastname" className=" font-medium">Nom</label>
                <input
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>
        
              <div>
                <label htmlFor="firstname" className=" font-medium">Prénom</label>
                <input
                  id="firstname"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>
        
              <div>
                <label htmlFor="email" className=" font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>
        
              <div>
                <label htmlFor="password" className=" font-medium">Mot de passe</label>
                <input
                type="password"
                  id="password"
                  name="password"
                  value={form.password ?? ""}
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>
            
              <div>
                <label htmlFor="validation_code" className=" font-medium">Code</label>
                <input
                type="number"
                  id="validation_code"
                  name="validation_code"
                  value={form.validation_code }
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>
            
              <div>
                <label htmlFor="roleId" className=" font-medium">Rôle</label>
                <input
                  type="number"
                  id="roleId"
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label htmlFor="serviceId" className=" font-medium">Service</label>
                <input
                  type="number"
                  id="serviceId"
                  name="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}        
                  className="w-full p-1 border border-gray-600 rounded"
                />
              </div>        
            </div>
        
          {/* Boutons d'action sur la ligne entière */}
            <div className="col-span-3 flex justify-center gap-4 mt-6">
              <button type="button" onClick={onClose} className="btn btn-error">
                Annuler
              </button>
              <button type="submit" className="btn btn-success font-bold border-black hover:text-white hover:border-none">
                Créer
              </button>
            </div>
          </div>
        </form>
      </Dialog>
      <ToastContainer toasts={toasts} />
    </>                         
  );    
}