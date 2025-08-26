import { useState } from 'react';
import { useUsers } from '../../hooks/useUser';
import type { IUser } from '../../types/IUser';

type Props = {
  onSelect: (user: IUser) => void;
  onChange?: (value: string) => void;
};

export default function SearchBarUsers({ onSelect, onChange }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allUsers, error, status } = useUsers();

  const filteredUsers = allUsers?.filter((user) => {
    const search = searchText.toLowerCase();
    const firstname = user.firstname?.toLowerCase() || "";
    const lastname = user.lastname?.toLowerCase() || "";
    return firstname.includes(search) || lastname.includes(search);
  }) || [];

  const handleSelect = (user: IUser) => {
    onSelect(user); 
    setSearchText(`${user.firstname} ${user.lastname}`); 
    setShowResults(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchText(e.target.value);
  if (onChange) onChange(e.target.value); 
};

  return (
    <>
      {status === 'pending' && <div>Chargement...</div>}
      {status === 'error' && <div>Erreur : {error.message}</div>}
      {status === 'success' && (
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher un utilisateur"
            value={searchText}
            onClick={() => setShowResults(true)}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            className="w-full p-2 border border-gray-600 rounded-full bg-white text-black"
          />

          {showResults && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg text-black">
              {(searchText ? filteredUsers : allUsers)?.map((user) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
                <li
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.firstname} {user.lastname}
                </li>
              ))}
              {searchText && filteredUsers.length === 0 && (
                <li className="p-2 text-gray-500">Aucun utilisateur trouvé</li>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};
