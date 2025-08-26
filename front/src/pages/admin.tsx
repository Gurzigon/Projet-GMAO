/** biome-ignore-all lint/correctness/noUnusedVariables: <linter capricieux> */

import { mdiAccountPlusOutline, mdiCheck, mdiLogout, mdiPencilOutline, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ConfirmDialog from "../components/Confirmation/confirmDialog";
import CreateUserForm from "../components/Forms/addUserForm";
import SearchBarUsers from "../components/SearchBars/searchBarUser";
import { useDeleteUser, useUpdateUser, useUsers } from "../hooks/useUser";
import userService from "../services/user.service";
import type { IUser } from "../types/IUser";

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
        <div key={id} className={`alert shadow-lg mb-2 ${
          type === "success" ? "alert-success" :
          type === "error" ? "alert-error" :
          "alert-info"
        }`}>
          <span>{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

const AdminPage = () => {
  const { data: allUsers, status, error } = useUsers();
  const [userSearched, setUserSearched] = useState<IUser | null>(null);
  const [editableUsers, setEditableUsers] = useState<IUser[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const updateUserMutation = useUpdateUser();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const deleteUserMutation = useDeleteUser();
  const [_users, setUsers] = useState<IUser[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [_loading, setLoading] = useState(false);
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
 
  useEffect(() => {
    const usersToDisplay = userSearched ? [userSearched] : allUsers || [];
    setEditableUsers(usersToDisplay);
  }, [allUsers, userSearched]);

  const handleChange = (id: number, field: keyof IUser, value: string) => {
    setEditableUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user;
        if (field === "service" && user.service) {
          return { ...user, service: { ...user.service, label: value } };
        }
        return { ...user, [field]: value };
        })
      );
  };

  const handleEditClick = (id: number) => {
    setEditingId(id);
  };

  const handleSaveClick = (id: number) => {
    const userToUpdate = editableUsers.find(u => u.id === id);
    if (!userToUpdate) return;

    // N' envoyer que les champs modifiés
    const { id: _, created_at, updated_at, role, service, ...allowedFields } = userToUpdate;

    updateUserMutation.mutate(
        { userId: id, updatedFields: allowedFields },
        {
        onSuccess: () => {            
            setEditingId(null); // sortir du mode édition
        },
        onError: (error) => {
            console.error("Erreur lors de la mise à jour :", error);
        },
        }
    );
  };

  const handleResetSearch = () => {
      setSearchValue("");
      setUserSearched(null);
    };

  // Annuler l'édition
  const handleCancelClick = () => {
    setEditingId(null);    
  };

  // Supprime un utilisateur
  const confirmDelete = (id: number) => {
    setUserToDelete(id);
  };
    
  const handleConfirm = () => {
    if (userToDelete === null) return;

    deleteUserMutation.mutate(userToDelete, {
      onSuccess: () => {
        addToast("Utilisateur supprimé avec succès", "success");
      },
      onError: () => {
        addToast("Erreur lors de la suppression de l'utilisateur", "error");
      },
      onSettled: () => {
        setUserToDelete(null);
      },
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    const success = await userService.logout();

    if (success) {
      window.location.href = '/admin';
    };
    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden bg-white px-4 md:px-8">    

      <section className="flex flex-col justify-center items-center w-full max-w-full mt-10">
        <div className="w-full ">
          <div className="flex justify-center mb-4">
            <h1 className="font-bold text-black text-4xl">Admin</h1>
          </div>
          <div className="flex-end">
            <button type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-white hover:text-red-500 cursor-pointer">
              <Icon path={mdiLogout} size={1} />
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <SearchBarUsers onSelect={(user) => setUserSearched(user)}
          onChange={(value) => setSearchValue(value)} />
            {searchValue && (
            <button
              type="button"
              onClick={handleResetSearch}
              className=" text-white px-3 py-1 border border-black rounded-full bg-black hover:bg-white hover:text-black">
              Réinitialiser
            </button>
            )}
        </div>
        <div>
          <div className="flex flex-col items-center mt-4">
            <button type="button" className="btn btn-circle w-15 h-15 md:w-15 md:h-15 lg:w-15 lg:h-15 btn-accent hover:bg-accent-focus hover:text-white " onClick={() => setShowCreateForm(true)} ><Icon path={mdiAccountPlusOutline} size={1.5} /></button>
            <p className="text-black font-bold text-center">Ajouter utilisateur</p> 
          </div>
            {showCreateForm && (
        <div className="w-full max-w-2xl mt-4 p-4 border rounded shadow">
          <CreateUserForm show={true} onClose={() => setShowCreateForm(false)  } onSuccess={(newUser) => setUsers(prev => [...prev, newUser])}  />
        </div>
      )}
        </div>       
        <div className="w-full max-w-4xl my-6 text-black">
          {status === "pending" && <p>Chargement des utilisateurs...</p>}
          {status === "error" && <p className="text-red-500">Erreur : {error.message}</p>}
          {status === "success" && editableUsers.length === 0 && <p>Aucun utilisateur trouvé</p>}
          {status === "success" && editableUsers.length > 0 && (
            <table className="w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Prénom</th>
                  <th className="p-2 border">Nom</th>
                  <th className="p-2 border">Service</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Rôle</th>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {editableUsers.map((user) => {
                  const isEditing = editingId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{user.id}</td>
                      <td className="p-2 border">
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.firstname}
                            onChange={(e) => handleChange(user.id, "firstname", e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.firstname
                        )}
                      </td>
                      <td className="p-2 border">
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.lastname}
                            onChange={(e) => handleChange(user.id, "lastname", e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.lastname
                        )}
                      </td>
                      <td className="p-2 border">
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.service?.label}
                            onChange={(e) => handleChange(user.id, "service", e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.service?.label
                        )}
                      </td>
                      <td className="p-2 border">
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.email}
                            onChange={(e) => handleChange(user.id, "email", e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          user.email
                        )}                        
                      </td>
                      
                      <td className="p-2 border">{user.role?.label}</td>
                       <td className="p-2 border">
                        {isEditing ? (
                          <input
                            type="password"
                            value={user.validation_code}
                            onChange={(e) => handleChange(user.id, "validation_code", e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          "****"
                        )}
                      </td>
                      
                      <td className="p-2 border">
                        <div className="flex justify-center">
                        {isEditing ? (
                           <>
                            <button
                            type="button"
                            onClick={() => handleSaveClick(user.id)}
                            className="btn btn-success text-white px-3 py-1 rounded mr-2"
                            >
                            <Icon path={mdiCheck} size={1} />
                            </button>
                            <button
                            type="button"
                            onClick={() => handleCancelClick()}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                            >
                            Annuler
                            </button>
                        </>
                        ) : (
                          <div className="flex gap-2">
                          <div className="flex gap-2">
                          <button type="button"
                            onClick={() => handleEditClick(user.id)}
                            className="btn btn-warning text-white px-3 py-1 rounded"
                          >
                            <Icon path={mdiPencilOutline} size={1} />
                          </button>
                          </div>
                          <div>
                           <button type="button"
                            onClick={() => confirmDelete(user.id)}
                            className="btn btn-error text-white px-3 py-1 rounded"
                          >
                            <Icon path={mdiTrashCanOutline} size={1} />
                          </button>
                          </div>
                          </div>
                        )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {/* Boîte de confirmation */}
          <ConfirmDialog
            isOpen={userToDelete !== null}
            title="Supprimer l'utilisateur"
            message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            confirmText="Supprimer"
            cancelText="Annuler"
            onConfirm={handleConfirm}
            onCancel={() => setUserToDelete(null)}
          />
        </div>
        <ToastContainer toasts={toasts}/>
      </section>
     
    </main>
  );
};

export default AdminPage;
