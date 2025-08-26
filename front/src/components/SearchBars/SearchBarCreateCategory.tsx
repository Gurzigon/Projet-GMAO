import {  useEffect, useMemo, useRef, useState } from 'react';
import { useCategory } from '../../hooks/useCategory';

type Props = {
  onSelect: (category: { id: number; label: string } | null) => void;
  onChangeText: (text: string) => void; 
};

export default function SearchBarCreateCategory({ onSelect, onChangeText }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); 
  const { data: allCategories, error, status } = useCategory();

  const filtered = useMemo(() => {
    const lower = searchText.toLowerCase();
    return (
      allCategories?.filter((category) =>
        category.label?.toLowerCase().includes(lower)
      ) || []
    );
  }, [searchText, allCategories]); 

const handleSelect = (category: { id: number; label: string }) => {    
  setSearchText(category.label);
  setShowResults(false);
  onSelect(category);
};

useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      };
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {status === 'pending' && <div>Chargement...</div>}
      {status === 'error' && <div>Erreur : {error.message}</div>}
      {status === 'success' && (
        <div ref={containerRef} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Sélectionner une catégorie"
            value={searchText}             
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowResults(true);
              onSelect(null); 
              onChangeText(e.target.value);             
            }}
            onFocus={() => setShowResults(true)}            
            className="w-full p-2 border border-gray-600 rounded bg-white text-black"
          />

          {showResults &&  filtered.length > 0 &&  (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filtered.map((category) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
                <li
                  key={category.id}
                  onClick={() => handleSelect(category)}
                  className="p-2 hover:bg-gray-100 cursor-pointer" >                
                  {category.label}
                </li>                
              ))} ;             
            </ul>
          )}
        </div>
      )}
    </>
  );
};
