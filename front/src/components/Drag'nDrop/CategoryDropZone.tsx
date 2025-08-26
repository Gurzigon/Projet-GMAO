import { mdiCheck, mdiClose, mdiPencil, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import type { ICategory } from '../../types/ICategory';


interface CategoryDropZoneProps {
  category: ICategory;
  children: React.ReactNode;
  onMaterialDropped: (materialId: number, newCategoryId: number) => void;
  onCategoryDeleted: (id: number) => void;
  onCategoryUpdated?: (id: number, newLabel: string) => void;
};

const CategoryDropZone: React.FC<CategoryDropZoneProps> = ({ category, children, onMaterialDropped, onCategoryDeleted, onCategoryUpdated }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: 'MATERIAL',
    drop: (item: { id: number }) => {
    onMaterialDropped(item.id, category.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

   // Crée un ref React classique
  const ref = useRef<HTMLDivElement>(null);

  // Branche dropRef sur le ref courant dans useEffect
  useEffect(() => {
    if (ref.current) {
      dropRef(ref.current);
    }
  }, [dropRef]);

  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(category.label);

  const handleDeleteCategory = () => {
    if (window.confirm(`Voulez-vous vraiment supprimer la catégorie "${category.label}" ?`)) {
        onCategoryDeleted(category.id); // seul rôle de l’enfant
    }
  };

  const handleEditCategory = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setNewLabel(category.label);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (newLabel.trim() && newLabel !== category.label) {
     onCategoryUpdated?.(category.id, newLabel);
    }
    setIsEditing(false);
  };

  const isActive = isOver && canDrop;

return (
    <div
      ref={ref}
      className={`p-2 rounded border ${
        isActive ? "border-green-500 bg-green-100" : "border-transparent"
      }`}
    >
      <div className="flex justify-between my-2 items-center">
        {isEditing ? (
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border border-purple-500 rounded px-2 py-1 text-sm text-black"
            
          />
        ) : (
          <h3 className="font-semibold text-md text-purple-700 mb-2">
            {category.label}
          </h3>
        )}
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-success rounded-full btn-sm text-black hover:text-white"
                onClick={handleSaveEdit}
              >
                <Icon path={mdiCheck} size={0.7} />
              </button>
              <button
                type="button"
                className="btn btn-error rounded-full btn-sm text-black hover:text-white"
                onClick={handleCancelEdit}
              >
                <Icon path={mdiClose} size={0.7} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-error rounded-full btn-sm text-black hover:text-white"
                onClick={handleDeleteCategory}
              >
                <Icon path={mdiTrashCan} size={0.7} />
              </button>
              <button
                type="button"
                className="btn btn-warning rounded-full btn-sm text-black hover:text-white"
                onClick={handleEditCategory}
              >
                <Icon path={mdiPencil} size={0.7} />
              </button>
            </>
          )}
        </div>
      </div>
      <ul className="space-y-1 ml-2">{children}</ul>
    </div>
  );
};

export default CategoryDropZone;
