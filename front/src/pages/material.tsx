import { mdiCog, mdiPlusCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from "react-router";
import CategoryDropZone from "../components/Drag'nDrop/CategoryDropZone";
import MaterialDraggable from "../components/Drag'nDrop/MaterialDraggable";
import FormCategoryRequest from "../components/Forms/addCategoryForm";
import FormMaterialRequest from "../components/Forms/addMaterialForm";
import Header from "../components/Layout/header";
import InterventionHistory from "../components/Material/MaterialHistory";
import MaterialDescription from "../components/Material/materialDescription";
import SearchBarMaterial from "../components/SearchBars/searchbarMaterial";
import { useCategory } from "../hooks/useCategory";
import { useLocalisations } from "../hooks/useLocalisations";
import { useAllMaterials, useUpdateMaterial } from "../hooks/useMaterials";
import { useService } from "../hooks/useService";
import categoryService from "../services/category.service";
import type { ICategory } from "../types/ICategory";
import type { ILocalisation } from "../types/ILocalisation";
import type { IMaterial, IUpdateMaterial } from "../types/Imaterial";
import { toUpdateMaterial } from "../utils/material";

const MaterialPage = () => {
    
    const {serviceLabel} = useParams();
    const { data: materialsData, isLoading: isLoadingMaterials, error: errorMaterials } = useAllMaterials();
    const{data: _categoriesData, refetch: _refetchCategories} = useCategory()
    const [showFormCategory, setShowFormCategory] = useState(false);
    const { service, isLoading: isLoadingService, error: errorService } = useService(serviceLabel);
    const [selectedMaterial, setSelectedMaterial] = useState<IMaterial | null>(null);
    const [_showForm, setShowForm] = useState(false);
    const [showFormMaterial, setShowFormMaterial] = useState(false);
    const [_materials, setMaterials] = useState<IMaterial[]>([]);
    const { data: _localisationsData } = useLocalisations();
    const { mutate: updateMaterial } = useUpdateMaterial();    
    const [listServiceCategories, setListServiceCategories] = useState<ICategory[]>([]); 
    
    const enrichMaterial = (
        material: IMaterial,
        categories: ICategory[],
        localisations: ILocalisation[]      
        ): IMaterial => {
        return {
            ...material,
            category: categories.find(c => c.id === material.categoryId),
            localisation: localisations.find(l => l.id === (material.localisationId ?? 0)) ?? null            
        };
    };

    useEffect(() => {
      const allCategories: ICategory[] = Array.isArray(_categoriesData) ? _categoriesData : [];
      const filtered = allCategories
        .filter((category) => category.serviceId === service?.id)
        .map((category) => ({
          ...category,
          materials: _materials.filter((m) => m.categoryId === category.id),
        }));
      setListServiceCategories(filtered);
    }, [_categoriesData, _materials, service?.id]);

    useEffect(() => {
        if (Array.isArray(materialsData)) {
          setMaterials(materialsData);
        }
    }, [materialsData]);
  
    if (isLoadingMaterials || isLoadingService) return <p>Chargement...</p>;
    if (errorMaterials || errorService) return <p>Erreur lors du chargement</p>;
    if (!service) return <p>Service introuvable</p>;

    const allMaterials: IMaterial[] = Array.isArray(materialsData) ? materialsData : [];
    const allLocalisations: ILocalisation[] = Array.isArray(_localisationsData) ? _localisationsData : [];
    const serviceMaterials = _materials.filter((m) => m.serviceId === service.id);
    const allCategories: ICategory[] = Array.isArray(_categoriesData) ? _categoriesData : [];
    const serviceCategories = allCategories
      .filter((category) => category.serviceId === service.id) 
      .map((category) => ({
      ...category,
      materials: serviceMaterials.filter((m) => m.categoryId === category.id),
      }));
     
   
    const handleMaterialDropped = (materialId: number, newCategoryId: number) => {
        const updatedMaterial= materialsData?.find((m) => m.id === materialId);
        if (!updatedMaterial) return;

        // Je crée une copie nettoyée et mise à jour avant d'envoyer
        const cleanMaterial: IUpdateMaterial = {
            ...toUpdateMaterial(updatedMaterial),
            categoryId: newCategoryId  // Je mets à jour la catégorie
        };        

        updateMaterial(cleanMaterial, {
            onSuccess: () => {                
                setMaterials((prev) =>
                    prev.map((m) =>
                        m.id === materialId ? { ...m, categoryId: newCategoryId } : m
                    )
                );               
                if (selectedMaterial?.id === materialId) {
                    setSelectedMaterial((prev) =>
                        prev ? { ...prev, categoryId: newCategoryId } : null
                    );
                }
            }
        });
    };
    
    const handleCategoryDeleted = async (categoryId: number) => {
      try {
        await categoryService.deleteCategory(categoryId); 
        await _refetchCategories(); 
      } catch (error) {
        console.error("Erreur suppression catégorie :", error);
        alert("Impossible de supprimer la catégorie.");
      }
    };

    const handleCategoryUpdated = async (id: number, newLabel: string) => {
      try {
        // Appel vers le service pour mettre à jour la catégorie côté backend
        await categoryService.updateCategory(id, { label: newLabel, serviceId: service.id });

        // Mise à jour locale pour refléter le changement immédiatement
        setListServiceCategories((prev) =>
          prev.map((cat) =>
            cat.id === id ? { ...cat, label: newLabel } : cat
          )
        );
        
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie :", error);
      }
    };   

    
  return(
    <main className="flex flex-col h-screen max-w-screen overflow-auto  bg-white">
      <div className="w-screen justify-end  bg-white h-20  ">
        <Header />    
      </div>

      <div className="flex flex-col lg:flex-row flex-grow overflow-visible">
        {/* Liste à gauche */}
        <section className="relative w-full lg:w-1/4 bg-[#f3edf7] p-3 overflow-visible border-b lg:border-b-0 lg:border-r lg:h-screen">
          <div className="flex flex-col h-full">
          <SearchBarMaterial
              onSelect={(id) => {
                  const found = allMaterials.find((m) => m.id === id);
                  if (found) {
                  setSelectedMaterial(found);
                  }
              }}
          /> 
          <div>
            <h1 className="text-black text-center font-bold">Ajouter une catégories</h1>
            <div className="flex justify-center my-2 gap-2">
              
                <button type="button"
                    onClick={() => setShowFormCategory(true)}
                    className="btn btn-success btn-sm text-black hover:text-white"
                >
                  <Icon path={mdiPlusCircleOutline} size={1} />
                </button>
                
            </div> 
          </div>
          <div className="hidden lg:block flex-1 overflow-y-auto mt-2">
              <h2 className="font-bold text-black text-xl mb-4 pt-2 ">Liste des matériels</h2>
                <DndProvider backend={HTML5Backend}>
                  {listServiceCategories.map((category) => (
                    <CategoryDropZone
                      key={category.id}
                      category={category}
                      onMaterialDropped={handleMaterialDropped}
                      onCategoryDeleted={handleCategoryDeleted}
                      onCategoryUpdated={handleCategoryUpdated}
                    >
                      <ul className="space-y-1 ml-2 mb-4">
                        {category.materials
                          .filter((m) => m.serviceId === service.id)
                          .map((material) => (
                            <MaterialDraggable
                              key={material.id}
                              material={material}
                              onClick={(mat) => {
                                const enriched = enrichMaterial(mat, serviceCategories, allLocalisations);
                                setSelectedMaterial(enriched);
                                setShowForm(true);
                              }}
                            />
                          ))}
                      </ul>
                    </CategoryDropZone>
                  ))}
                </DndProvider>
              </div>
            </div>
        </section>

        {/* Détail à droite */}
        <section className="flex-1 p-4 overflow-y-auto  ">
            <div className="flex flex-col items-center  justify-center text-center ">
                <button type="button" className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white" onClick={() => setShowFormMaterial(true)}><Icon path={mdiCog} size={1.3}  /></button>
                <p className="text-black text-sm ">Ajout matériel</p> 
            </div>
          <div className="fflex flex-col lg:flex-row gap-4 lg:gap-10 max-h-full">
          {selectedMaterial ? (
            <MaterialDescription
              material={selectedMaterial}
              onMaterialUpdated={(updated) => {
                if (updated?.id) {
                  const cleanMaterial = toUpdateMaterial(updated);
                    updateMaterial(cleanMaterial);
                    setSelectedMaterial(updated);             
                }
              }}
            />
          ) : ""        
          }                     
          </div>
          <div>
          {selectedMaterial && (
            <div className=" w-full">
              <InterventionHistory materialId={selectedMaterial.id} />
            </div>
          )}
          </div>
        </section>
        <FormMaterialRequest show={showFormMaterial} onClose={() => setShowFormMaterial(false)} />
        <FormCategoryRequest show={showFormCategory} onClose={() => setShowFormCategory(false)} />
      </div>
</main>
    );
};

export default MaterialPage