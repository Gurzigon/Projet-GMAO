import { mdiAlertOutline, mdiBellAlertOutline, mdiCart, mdiHammerScrewdriver, mdiHistory, mdiOil, mdiPackageVariantClosedPlus, mdiPencil, mdiPlusCircleOutline, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ConfirmModal from '../components/Confirmation/ConfirmModal';
import FormCategoryRequest from '../components/Forms/addCategoryForm';
import FormConsumableRequest from '../components/Forms/addConsumableForm';
import FormMaterialStoreRequest from '../components/Forms/addStoreArticle';
import Header from '../components/Layout/header';
import SearchBarStore from '../components/SearchBars/searchBarStore';
import { useCategory } from '../hooks/useCategory';
import { useDeleteMaterial, useStoreMaterials, useUpdateMaterialStore } from '../hooks/useMaterials';
import type { IStoreMaterial } from '../types/Imaterial';

const Store = () => {
     
    const {serviceLabel} = useParams();
    const { data: storeMaterial = []} = useStoreMaterials(); 
    const deleteMaterialMutation = useDeleteMaterial();
    const updateMaterial = useUpdateMaterialStore()
    const {data: categories} = useCategory()
    // Donnée à modifier
    const [editValuesMap, setEditValuesMap] = useState<Record<number, Partial<IStoreMaterial>>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    // Données filtrées
    const [filteredMaterialId, setFilteredMaterialId] = useState<number | null>(null);
    // Formulaire ajout matériel
    const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
    // Formulaire ajout consommable
    const [showAddConsumableForm, setShowAddConsumableForm] = useState(false)
    const serviceCategories = categories?.filter(category => category.serviceId === 1)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const hasArticlesToRecommend = storeMaterial.some(mat => mat.statusId === 5);
    const [localMaterials, setLocalMaterials] = useState<IStoreMaterial[]>([]);

    useEffect(() => {
        setLocalMaterials(storeMaterial);
    }, [storeMaterial]);

    // Formulaire création catégorie
    const [showFormCategory, setShowFormCategory] = useState(false);
    
    const filteredMaterialsCombined = localMaterials
        .filter(material => material.statusId !== 6) 
        .filter(material => !selectedCategoryId || material.categoryId === selectedCategoryId)
        .filter(material => !filteredMaterialId || material.id === filteredMaterialId)
        .filter(material => {
        const category = categories?.find(cat => cat.id === material.categoryId);
        return category?.serviceId === 1;
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);      
    const [materialToDelete, setMaterialToDelete] = useState<{ id: number; name: string } | null>(null);
    
    // Supprime un article
    const handleDeleteClick = (id: number, name: string) => {
        setMaterialToDelete({ id, name });
        setShowConfirmModal(true);
        };
        const confirmDelete = () => {
        if (materialToDelete) {
            deleteMaterialMutation.mutate(materialToDelete.id);
            setMaterialToDelete(null);
            setShowConfirmModal(false);
        }
        };
        const cancelDelete = () => {
        setMaterialToDelete(null);
        setShowConfirmModal(false);
    };

    const handleSave = (id: number) => {
        const edited = editValuesMap[id];        

        const original = storeMaterial.find((mat) => mat.id === id);
        if (!original) {
            alert("Matériel non trouvé.");
            return;
        }

        // On prend soit la valeur modifiée, soit la valeur originale
        const finalName = edited?.name ?? original.name;
        const finalQuantity = edited?.quantity ?? original.quantity;

        // Validation : name obligatoire non vide, quantity défini (même 0)
        if (!finalName || finalQuantity === undefined) {
            alert("Les champs obligatoires ne sont pas remplis.");
            return;
        }

        const updatedPayload = {
            id,
            name: finalName,
            brand: edited?.brand ?? original.brand,
            model: edited?.model ?? original.model,
            reference: edited?.reference ?? original.reference,
            quantity: finalQuantity,
            is_store: original.is_store,
            statusId: original.statusId,
            categoryId: original.categoryId,
        };

        updateMaterial.mutate(updatedPayload, {
            onSuccess: () => {
            setLocalMaterials((prev) =>
                prev.map((mat) =>
                mat.id === id ? { ...mat, ...updatedPayload } : mat
                )
            );
            // Nettoyer le state d'édition
            setEditValuesMap((prev) => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            setEditingId(null);
            },
            onError: () => {
            alert("Erreur lors de la mise à jour");
            },
        });
    };

    return(
        <main className='bg-white min-h-screen  '>

            <div className=" justify-end">
                <Header />
            </div>

            <section className=' text-black w-full  p-2 '>
                 <h1 className='text-center text-3xl font-bold mb-10'>Magasin</h1>

                <div className='flex flex-col md:flex-row justify-between gap-4'>

                    {/* Boutons à gauche de l'écran */}
                    <div className='flex flex-row  md:flex-col my-6 md:my-30 gap-4 items-center md:items-start justify-center md:justify-start'>
                        <div className="flex flex-col  items-center">
                            <Link to={`/magasin/sortie/${serviceLabel}`}>                            
                                <button type="button" className=" p-2 btn btn-circle btn-warning w-15 h-15  btn-accent hover:bg-accent-focus hover:text-white">                               
                                    <Icon path={mdiCart} size={2} />                                
                                </button>                                
                                <p className="text-black font-bold text-center">Sortie</p>
                            </Link>
                        </div>

                        <div className="flex flex-col items-center">
                            <Link to={`/magasin/entree/${serviceLabel}`}>
                                <button type="button" className="btn btn-circle btn-success w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white" ><Icon path={mdiPackageVariantClosedPlus} size={2} /></button>
                                <p className="text-black font-bold text-center">Entrée</p> 
                            </Link>
                        </div>

                            <div className="flex flex-col items-center">
                                <Link to={`/magasin/historique/${serviceLabel}`}>
                                    <button type="button" className="btn btn-circle bg-fuchsia-500 text-black w-15 h-15 border-none hover:bg-accent-focus hover:text-white">
                                        <Icon path={mdiHistory} size={2} />
                                         {hasArticlesToRecommend && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full 00 border border-white"></span>
                                        )}
                                    </button>
                                    <p className="text-black font-bold text-center">Historique</p>
                            </Link> 
                        </div>
                    </div>
                    {/* Fin boutons à gauche de l'écran */}
                    {/* Partie centrale */}
                    <div className="flex flex-col lg:w-full">

                        {/* Boutons actions */}
                        <div className='flex flex-wrap justify-center gap-4 md:gap-6 w-full'>

                            <Link to={`/magasin/consommable/${serviceLabel}`}>
                                <div className="flex flex-col  items-center">
                                    <button type="button" className="btn btn-circle w-15 h-15 btn-error hover:bg-accent-focus hover:text-white p-2" ><Icon path={mdiAlertOutline} size={2} /></button>
                                    <p className="text-black font-bold text-center">Alerte consommable</p>
                                </div>
                            </Link>

                            <div className="flex flex-col items-center">
                                <button type="button" className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white" onClick={() => setShowAddConsumableForm(true)} ><Icon path={mdiOil} size={2} /></button>
                                <p className="text-black font-bold text-center">Ajout consommable</p> 
                            </div>

                            <Link to={`/magasin/recommander/${serviceLabel}`}>
                                <div className="relative flex flex-col justify-center items-center">
                                    <button
                                    type="button"
                                    className="btn btn-circle w-15 h-15 btn-error hover:bg-accent-focus hover:text-white p-2 relative"
                                    >
                                    <Icon path={mdiBellAlertOutline} size={2} />
                                    {hasArticlesToRecommend && (
                                        <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-500  "></span>
                                    )}
                                    </button>
                                    <p className="text-black font-bold text-center">Alerte article</p>
                                </div>
                            </Link>                            

                            <div className="flex flex-col items-center">
                                <button type="button" className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white "  onClick={() => setShowAddMaterialForm(true)}><Icon path={mdiHammerScrewdriver} size={2} /></button>
                            <p className="text-black font-bold text-center">Ajout article</p> 
                            </div>

                            <div className="flex flex-col items-center">
                                <button type="button" className="btn btn-circle w-15 h-15 bg-emerald-500 hover:bg-accent-focus text-black hover:text-white border-none"  onClick={() => setShowFormCategory(true)}><Icon path={mdiPlusCircleOutline} size={2} /></button>
                            <p className="text-black font-bold text-center">Ajout catégorie</p> 
                            </div>
                        </div>
                        {/* Fin boutons d'action */}

                        {/* Boutons de filtre par catégorie */}
                        <div className='hidden md:flex justify-center w-full flex-wrap'>
                            <div className="flex flex-wrap gap-4 m-4 justify-center max-w-screen-xl ">
                                <button
                                        type="button"
                                        className={`btn btn-outline ${selectedCategoryId === null ? 'bg-black text-white' : ''}`}
                                        onClick={() => setSelectedCategoryId(null)}
                                    >
                                        Tous
                                    </button>
                                {(serviceCategories ?? []).map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`btn hover:cursor-pointer hover:text-black hover:bg-white ${selectedCategoryId === category.id ? 'bg-black text-white' : ''}`}
                                        onClick={() => setSelectedCategoryId(category.id)}                                        
                                    >
                                        {category.label}
                                    </button>
                                    ))}
                            </div>
                        </div>
                        {/* Fin boutons filtre par catégorie */}

                        {/* Barre de recherche  */}
                        <div className='flex justify-center'>
                            <SearchBarStore onSelect={(materialId: number) => {
                            setFilteredMaterialId(materialId);
                            }} />                            
                        </div>                        

                        {filteredMaterialId && (
                            <div className="text-center mt-2">
                                <button
                                type='button'
                                onClick={() => setFilteredMaterialId(null)}
                                className="btn btn-outline btn-sm"
                                >
                                Réinitialiser la recherche
                                </button>
                            </div>
                        )}
                        {/* Fin barre de recherche */}

                        {/* Liste articles */}
                        <div className="flex flex-col justify-center mt-2 gap-2">
                    {filteredMaterialsCombined.length === 0 && (
                        <p className="text-center font-bold">Aucun matériel en stock.</p>
                    )}

                    {/* Affichage Desktop */}
                    <div className="hidden md:block">
                        <table className="table w-full table-zebra bg-gray-100 text-black">
                        <thead>
                            <tr className="text-center font-bold text-white bg-slate-700">
                            <th>Nom</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Quantité</th>
                            <th>Référence</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterialsCombined.map((material) => {
                            const editValues = editValuesMap[material.id] || {
                                name: material.name,
                                brand: material.brand,
                                model: material.model,
                                reference: material.reference ?? "",
                                quantity: material.quantity,
                            };

                            const handleChange = (
                                field: keyof IStoreMaterial,
                                value: string | number
                            ) => {
                                setEditValuesMap((prev) => ({
                                ...prev,
                                [material.id]: {
                                    ...prev[material.id],
                                    [field]: value,
                                },
                                }));
                            };

                            return (
                                <tr
                                key={material.id}
                                className="text-center odd:bg-gray-400 even:bg-gray-200"
                                >
                                <td>
                                    <input
                                    type="text"
                                    value={editValues.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="input input-bordered bg-white w-full"
                                    readOnly={editingId !== material.id}
                                    />
                                </td>
                                <td>
                                    <input
                                    type="text"
                                    value={editValues.brand}
                                    onChange={(e) => handleChange("brand", e.target.value)}
                                    className="input input-bordered bg-white w-full"
                                    readOnly={editingId !== material.id}
                                    />
                                </td>
                                <td>
                                    <input
                                    type="text"
                                    value={editValues.model}
                                    onChange={(e) => handleChange("model", e.target.value)}
                                    className="input input-bordered bg-white w-full"
                                    readOnly={editingId !== material.id}
                                    />
                                </td>
                                <td>
                                    <input
                                    type="number"
                                    value={editValues.quantity}
                                    onChange={(e) =>
                                        handleChange("quantity", Number(e.target.value))
                                    }
                                    className="input input-bordered bg-white w-full"
                                    readOnly
                                    />
                                </td>
                                <td>
                                    <input
                                    type="text"
                                    value={editValues.reference ?? ""}
                                    onChange={(e) =>
                                        handleChange("reference", e.target.value)
                                    }
                                    className="input input-bordered bg-white w-full"
                                    readOnly={editingId !== material.id}
                                    />
                                </td>
                                <td className="flex justify-center gap-2 flex-wrap">
                                    {editingId !== material.id && (
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm hover:text-white"
                                        title="Modifier"
                                        onClick={() => {
                                        setEditingId(material.id);
                                        setEditValuesMap((prev) => ({
                                            ...prev,
                                            [material.id]: prev[material.id] ?? {
                                            name: material.name,
                                            brand: material.brand,
                                            model: material.model,
                                            reference: material.reference,
                                            quantity: material.quantity,
                                            },
                                        }));
                                        }}
                                    >
                                        <Icon path={mdiPencil} size={1} />
                                    </button>
                                    )}
                                    {editingId === material.id && (
                                    <>
                                        <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        onClick={() => setEditingId(null)}
                                        >
                                        Annuler
                                        </button>
                                        <button
                                        type="button"
                                        className="btn btn-success btn-sm hover:text-white"
                                        onClick={() => {
                                            handleSave(material.id);
                                            setEditingId(null);
                                        }}
                                        >
                                        Enregistrer
                                        </button>
                                    </>
                                    )}
                                    <button
                                    type="button"
                                    className="btn btn-error btn-sm hover:text-white"
                                    title="Supprimer"
                                    onClick={() =>
                                        handleDeleteClick(material.id, material.name)
                                    }
                                    >
                                    <Icon path={mdiTrashCan} size={1} />
                                    </button>
                                </td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>

                    {/* Affichage Mobile */}
                    <div className="block md:hidden">
                        {filteredMaterialsCombined.map((material) => {
                        const editValues = editValuesMap[material.id] || {
                            name: material.name,
                            brand: material.brand,
                            model: material.model,
                            reference: material.reference ?? "",
                            quantity: material.quantity,
                        };

                        return (
                            <div
                            key={material.id}
                            className="bg-gray-100 rounded-lg shadow p-4 mb-3 border border-gray-300"
                            >
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-bold">Nom :</span>
                                <input
                                type="text"
                                value={editValues.name}
                                className="input input-bordered bg-white w-full"
                                readOnly={editingId !== material.id}
                                onChange={(e) =>
                                    setEditValuesMap((prev) => ({
                                    ...prev,
                                    [material.id]: {
                                           ...prev[material.id],  
                                             name: e.target.value,                                    
                                    },
                                }))
                                }
                                />
                                <span className="font-bold">Marque :</span>
                                <input
                                type="text"
                                value={editValues.brand}
                                className="input input-bordered bg-white w-full"
                                readOnly={editingId !== material.id}
                                onChange={(e) =>
                                    setEditValuesMap((prev) => ({
                                    ...prev,
                                    [material.id]: {
                                        ...prev[material.id],
                                        brand: e.target.value,
                                    },
                                    }))
                                }
                                />
                                <span className="font-bold">Modèle :</span>
                                <input
                                type="text"
                                value={editValues.model}
                                className="input input-bordered bg-white w-full"
                                readOnly={editingId !== material.id}
                                onChange={(e) =>
                                    setEditValuesMap((prev) => ({
                                    ...prev,
                                    [material.id]: {
                                        ...prev[material.id],
                                        model: e.target.value,
                                    },
                                    }))
                                }
                                />
                                <span className="font-bold">Quantité :</span>
                                <input
                                type="number"
                                value={editValues.quantity}
                                className="input input-bordered bg-white w-full"
                                readOnly
                                />
                                <span className="font-bold">Référence :</span>
                                <input
                                type="text"
                                value={editValues.reference ?? ""}
                                className="input input-bordered bg-white w-full"
                                readOnly={editingId !== material.id}
                                onChange={(e) =>
                                    setEditValuesMap((prev) => ({
                                    ...prev,
                                    [material.id]: {
                                        ...prev[material.id],
                                        reference: e.target.value,
                                    },
                                    }))
                                }
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-3 flex-wrap">
                                {editingId !== material.id && (
                                <button
                                    type="button"
                                    className="btn btn-warning btn-sm hover:text-white"
                                    onClick={() => {
                                    setEditingId(material.id);
                                    }}
                                >
                                    <Icon path={mdiPencil} size={1} />
                                </button>
                                )}
                                {editingId === material.id && (
                                <>
                                    <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setEditingId(null)}
                                    >
                                    Annuler
                                    </button>
                                    <button
                                    type="button"
                                    className="btn btn-success btn-sm hover:text-white"
                                    onClick={() => {
                                        handleSave(material.id);
                                        setEditingId(null);
                                    }}
                                    >
                                    Enregistrer
                                    </button>
                                </>
                                )}
                                <button
                                type="button"
                                className="btn btn-error btn-sm hover:text-white"
                                onClick={() =>
                                    handleDeleteClick(material.id, material.name)
                                }
                                >
                                <Icon path={mdiTrashCan} size={1} />
                                </button>
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                    </div>

                </div>
            </section>        
                {showAddMaterialForm && (
                    <FormMaterialStoreRequest show={true} onClose={() => setShowAddMaterialForm(false)}
                     />
                )} 

                <ConfirmModal
                    show={showConfirmModal}
                    title="Confirmer la suppression"
                    message={`Supprimer l'article "${materialToDelete?.name}" ?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />

                {showAddConsumableForm && (
                    <FormConsumableRequest show={true} onClose={() => setShowAddConsumableForm(false)} />
                )}

                <FormCategoryRequest show={showFormCategory} onClose={() => setShowFormCategory(false)} />                  
                    
        </main>        
    );
};

export default Store;


