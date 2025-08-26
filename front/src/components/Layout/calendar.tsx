import { fr } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import type React from 'react';
import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { IPreventive } from '../../types/IPreventive';

registerLocale('fr', fr)
dayjs.locale('fr')
interface AnnualCalendarProps {
  preventiveDates: Date[]
  preventives: IPreventive[]
};

const AnnualCalendarWithDatePickers: React.FC<AnnualCalendarProps> = ({ preventiveDates, preventives }) => {
  const initialDates = Array.from({ length: 12 }, (_, i) =>
    dayjs().add(i, 'month').startOf('month').toDate()
  );

  const [selectedDates, setSelectedDates] = useState(initialDates)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDateChange = (date: Date | null, monthIndex: number) => {
    if (!date) return
    const newDates = [...selectedDates]
    newDates[monthIndex] = date
    setSelectedDates(newDates)
    setSelectedDate(date) 
  };

  const isPreventiveDate = (date: Date) => {
    return preventiveDates.some(pd => dayjs(pd).isSame(dayjs(date), 'day'))
  };

  const preventivesOnSelectedDate = selectedDate
    ? preventives.filter(p =>
        dayjs(p.date).isSame(dayjs(selectedDate), 'day')
      )
    : [];

  return (
    <div className="min-h-screen bg-white text-black px-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-8">Calendrier annuel</h1>

      {/* Calendriers en grille scrollable */}
      <div className="flex-1 overflow-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {selectedDates.map((date, index) => (
          <div key={dayjs(date).format('YYYY-MM')} className="rounded-lg p-4 flex flex-col items-center hover:bg-gray-200  hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-4 text-center ">
              {dayjs(date).format('MMMM YYYY')}
            </h2>
            <DatePicker
              onChange={(d) => handleDateChange(d, index)}
              inline
              showMonthDropdown={false}
              showYearDropdown={false}
              openToDate={date}
              calendarStartDay={1}
              dateFormat="dd/MM/yyyy"
              minDate={dayjs(date).startOf('month').toDate()}
              maxDate={dayjs(date).endOf('month').toDate()}
              dayClassName={day =>
              {                
              return isPreventiveDate(day) ? 'preventive-day cursor-pointer' : 'cursor-pointer'
              }}
               locale="fr"
            />
          </div>
        ))}
      </div>

      {/* Pop-up liste des entretiens  */}
      {selectedDate && (
        <div
          className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-3xl max-h-[60vh] overflow-auto bg-gray-50 border border-gray-800 border-2 rounded p-6 shadow-lg
          transform -translate-x-1/2 -translate-y-1/2 "
        >
          <button type='button'
            onClick={() => setSelectedDate(null)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            aria-label="Fermer la liste des entretiens"
          >
            &times;
          </button>
          <h3 className="text-2xl mb-4 text-center">
            Préventifs à échéance le {dayjs(selectedDate).format('DD/MM/YYYY')}
          </h3>
          {preventivesOnSelectedDate.length === 0 ? (
            <p>Aucun entretien prévu à cette date.</p>
          ) : (
            <ul>
              {preventivesOnSelectedDate.map(p => (
                <li key={p.id} className="mb-2 p-2 bg-white shadow rounded border border-gray-500">
                  <div className='flex gap-2 text-center w-full justify-around'>
                    <div>
                      <p>Titre</p>
                      <strong>{p.title}</strong>
                    </div>
                    <div>
                      <p>Matériel concerné</p>
                      <strong>{p.materialLinks.map((link) => link.material.name).join(", ")}</strong>
                    </div>
                    <div>
                      <p>Description</p>
                      <strong>{p.description}</strong>
                    </div>
                     <div>
                      <p>Intervenant</p>
                      <strong>{p.users?.[0]?.user
                          ? `${p.users[0].user.firstname} ${p.users[0].user.lastname}`
                          : "Aucun intervenant"}
                      </strong>
                    </div>
                     <div>
                      <p>Statut</p>
                      <strong>
                        {p.statusId === 2
                          ? "En cours"
                          : p.statusId === 3
                            ? "Terminé"
                            : "À faire"}
                      </strong>
                    </div>
                  </div>             
              </li>
            ))}
          </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AnnualCalendarWithDatePickers
