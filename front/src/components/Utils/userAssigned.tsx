import { useInterventionsWithUser } from '../../hooks/useUser';

const UsersAssigned = ({ interventionId }: { interventionId: number }) => {
  const { data: users, isLoading, isError } = useInterventionsWithUser(interventionId);

  if (isLoading) return <p>Chargement des utilisateurs...</p>;
  if (isError) return <p className="text-red-500">Erreur lors du chargement</p>;
    console.log(users)
  return (
    <ul className="list-disc list-inside text-sm text-black ">
      {users && users.length > 0 ? (
        users.map((ua) => (
          <li key={ua.user.id}>
            {ua.user.firstname} {ua.user.lastname}
          </li>
        ))
      ) : (
        <li className="italic text-gray-600">Aucun utilisateur assigné</li>
      )}
    </ul>
  );
};


export default UsersAssigned