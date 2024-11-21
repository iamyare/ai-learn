import React from 'react'
import { format } from '@formkit/tempo'
import { Calendar } from 'lucide-react'

interface EventListProps {
  events: ImportantEventType[]
}

const formatWithDynamicUTC = (dateString: string) => {
  const date = new Date(dateString)
  // Obtenemos el offset dinámicamente
  const localOffset = date.getTimezoneOffset()
  // Ajustamos la fecha a UTC
  const utcDate = new Date(date.getTime() + localOffset * 60 * 1000)
  console.log('UTC date:', utcDate)
  return format(utcDate, 'DD/MM/YY HH:mm A')
}

const EventList: React.FC<EventListProps> = ({ events }) => (
  <div className='flex flex-col gap-2'>
    <h2 className='text-xl font-semibold'>Eventos importantes</h2>
    <ul className='space-y-2'>
      {events.map((event, index) => (
        <li
          key={index}
          className='bg-muted p-2 rounded-md transition-colors duration-300 cursor-pointer hover:bg-muted-foreground/15'
        >
          <h4 className='font-medium'>{event.title}</h4>
          <p className='text-xs text-muted-foreground'>{event.description}</p>
          <div className='flex justify-between mt-1 text-xs text-muted-foreground'>
            <p className='flex items-center'>
              <Calendar className='size-3 mr-1' />
              {(() => {
                try {
                  const date = formatWithDynamicUTC(event.date)
                  return date
                } catch (error) {
                  return event.date.toString()
                }
              })()}
            </p>

            <span>Prioridad: {event.priority}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default EventList
