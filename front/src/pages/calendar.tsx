import { mdiArrowLeftBottom } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnnualCalendarWithDatePickers from '../components/Layout/calendar';
import Header from '../components/Layout/header';
import { usePreventives } from '../hooks/usePreventive';
import { useService } from '../hooks/useService';
import type { IMaterial } from '../types/Imaterial';
import type { IPreventive } from '../types/IPreventive';

const CalendarPreventive = () => {
  const { serviceLabel } = useParams();
  const { service } = useService(serviceLabel);
  const { data: preventives } = usePreventives();

  const [selectedMaterial, _setSelectedMaterial] = useState<IMaterial | null>(null);

  // Filtrage des preventives selon le matériel sélectionné ou le service courant
  const servicePreventives = selectedMaterial
  ? preventives?.filter((preventive: IPreventive) =>
      preventive.materialLinks.some(link => link.material.id === selectedMaterial.id) &&
      preventive.statusId !== 3
    )
  : preventives?.filter((preventive: IPreventive) =>
      preventive.materialLinks.some(link => link.material.serviceId === service?.id) &&
      preventive.statusId !== 3
    );

  // Extraction des dates des preventives filtrées
  const preventiveDates = servicePreventives
    ?.map(p => p.date)
    .filter(Boolean)
    .map(d => new Date(d)) || []

  return (
    <div>
      <div className="bg-white">
        <Header />
      </div>

      <div className="text-black bg-white flex items-start pl-15">
        <Link to={`/preventifs/${serviceLabel}`} className='hover:bg-primary hover:text-white rounded-lg p-1'>
          <div className="flex flex-col items-center">
            <Icon path={mdiArrowLeftBottom} size={1.9} />
            <p>Retour préventif</p>
          </div>
        </Link>
      </div>

      <AnnualCalendarWithDatePickers preventiveDates={preventiveDates} preventives={servicePreventives ||[]} />
    </div>
  );
};

export default CalendarPreventive;
