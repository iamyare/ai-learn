import React from 'react'
import { format } from '@formkit/tempo'

interface EventListProps {
  events: ImportantEventType[]
}

const EventList: React.FC<EventListProps> = ({ events }) => (
  <div className='flex flex-col gap-2'>
    <h2 className='text-xl font-semibold'>Eventos importantes</h2>
    <ul className='space-y-2'>
      {events.map((event, index) => (
        <li
          key={index}
          className='bg-muted p-2 rounded-md transform-gpu transition-[box-shadow,transform] duration-300 hover:scale-105 hover:shadow-md'
        >
          <h4 className='font-medium'>{event.title}</h4>
          <p className='text-xs text-muted-foreground'>{event.description}</p>
          <div className='flex justify-between mt-1 text-xs text-muted-foreground'>
            <span>
              Fecha:{' '}
              {(() => {
                try {
                  console.log(event.date)
                  const date = new Date(event.date)
                  return format(date, 'DD/MM/YY HH:mm A')
                } catch (error) {
                  return event.date.toString()
                }
              })()}
            </span>

            <span>Prioridad: {event.priority}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default EventList
