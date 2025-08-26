import { useState } from 'react';
import { useCategory } from '../../hooks/useCategory';

type Props = {
  onSelect: (category: { id: number; label: string }) => void;
};

export default function SearchBarCategory({ onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allCategories, error, status } = useCategory();

  const filteredCategories = allCategories?.filter((category) => {
    const search = searchText.toLowerCase();
    return category.label?.toLowerCase().includes(search);
  }) || [];

  const handleSelect = (category: { id: number; label: string }) => {
    onSelect(category);
    setSearchText(category.label);
    setShowResults(false);
  };

  return (
    <>
      {status === 'pending' && <div>Chargement...</div>}
      {status === 'error' && <div>Erreur : {error.message}</div>}
      {status === 'success' && (
        <div className="relative w-full max-w-md">
          <input
            type="text"            
            placeholder="Sélectionner une catégorie"
            value={searchText}
            onClick={() => setShowResults(true)} 
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowResults(true);              
            }}
            onBlur={() => {
              setTimeout(() => setShowResults(false), 150); 
            }}
            className="w-full p-2 border border-gray-400 rounded bg-white text-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
          />

          {showResults && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
              {(searchText ? filteredCategories : allCategories)?.map((category) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
                <li
                  key={category.id}
                  onClick={() => handleSelect(category)}
                  className="p-2 hover:bg-gray-100 cursor-pointer " >                 
                  {category.label}
                </li>                
              ))}
              {(searchText && filteredCategories.length === 0) && (
                <li className="p-2 text-gray-500">Aucune catégorie trouvée</li>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
