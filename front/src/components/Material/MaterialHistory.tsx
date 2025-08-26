import { useInterventionsByMaterial } from "../../hooks/useInterventions";

type Props = {
  materialId: number;
};

const InterventionHistory = ({ materialId }: Props) => {
  const { data, isLoading, isError } = useInterventionsByMaterial(materialId);

  if (isLoading) return <p>Chargement des interventions...</p>;
  if (isError) return <p className="text-red-500">Erreur lors du chargement</p>;

  const finishedInterventions = data?.filter((i) => i.status?.id === 3) ?? [];

  return (
    <div className="bg-gray-100 rounded p-4 w-full my-2">
      <h3 className="font-semibold text-2xl text-black text-center text-md mb-2">Historique des interventions </h3>
      {finishedInterventions.length > 0 ? (
        <ul className="space-y-2 text-sm text-black">
          {finishedInterventions.map((intervention) => (
            <li key={intervention.id} className="border-b pb-2">
              <p className="font-medium">{intervention.title}</p>              
              <p className="text-gray-600 text-sm">{intervention.description}</p>
              <p className="text-gray-600 text-sm">{intervention.type?.label}</p>
              <p className="text-gray-600 text-sm">Demandée par : {intervention.requestor_firstname} {intervention.requestor_lastname}</p>
              <p className="text-gray-400 text-xs">
                Demandée le : {new Date(intervention.created_at).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-gray-400 text-xs">
                Clôturée le : {new Date(intervention.updated_at).toLocaleDateString("fr-FR")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-600">Aucune intervention terminée pour ce matériel.</p>
      )}
    </div>
  );
};

export default InterventionHistory;
