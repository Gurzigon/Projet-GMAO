import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalisations } from "../../hooks/useLocalisations";

type Props = {
  onSelect: (localisation: { id: number; label: string } | null) => void;
  onChangeText: (text: string) => void; 
};

export default function SearchBarCreateLocalisation({ onSelect, onChangeText }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); 
  const { data: allLocalisations, error, status } = useLocalisations();
  const [_selectedLocalisation, setSelectedLocalisation] = useState<{id: number; label: string} | null>(null);

  const filtered = useMemo(() => {
    const lower = searchText.toLowerCase();
    return (
      allLocalisations?.filter((localisation) =>
        localisation.label?.toLowerCase().includes(lower)
      ) || []
    );
  }, [searchText, allLocalisations]); 

  const handleSelect = (localisation: { id: number; label: string }) => {
    setSelectedLocalisation(localisation);
    setSearchText(localisation.label);
    setShowResults(false);
    onSelect(localisation); 
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
            placeholder="Sélectionner une localisation"
            value={searchText}             
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowResults(true);
              setSelectedLocalisation(null);
              onChangeText(e.target.value);             
            }}
            onFocus={() => setShowResults(true)}            
            className="w-full p-2 border border-gray-600 rounded bg-white text-black"
          />

          {showResults &&  filtered.length > 0 &&  (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filtered.map((localisation) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
                <li
                  key={localisation.id}
                  onClick={() => handleSelect(localisation)}
                  className="p-2 hover:bg-gray-100 cursor-pointer" >                 
                  {localisation.label}
                </li>                
              ))}              
            </ul>
          )}
        </div>
      )}
    </>
  );
};
