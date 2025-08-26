import type React from 'react';
import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import type { IMaterial } from '../../types/Imaterial';

interface MaterialDraggableProps {
  material: IMaterial;
  onClick: (material: IMaterial) => void;
}

const MaterialDraggable: React.FC<MaterialDraggableProps> = ({ material, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'MATERIAL',
    item: { id: material.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  

  // Création d'un ref React normal
  const ref = useRef<HTMLLIElement>(null);

  // Branche dragRef sur le ref DOM dans un useEffect
  useEffect(() => {
    if (ref.current) {
      dragRef(ref.current);
    }
  }, [dragRef]);


  return (
    <li
      ref={ref}
      className={`bg-white rounded shadow text-sm text-black p-1 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={() => onClick(material)}
        className="w-full text-left"
      >
        {material.name}
      </button>
    </li>
  );
};

export default MaterialDraggable;
