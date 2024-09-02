import { format } from "@formkit/tempo";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, format: 'date' | 'time' | 'datetime' = 'datetime', timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
  // Convertir la cadena de fecha a un objeto Date si es necesario
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  // Verificar si la fecha es válida
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Fecha inválida');
  }

  // Definir las opciones de formato
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour12: false // Usar formato de 24 horas
  };

  switch (format) {
    case 'date':
      Object.assign(options, { year: 'numeric', month: '2-digit', day: '2-digit' });
      break;
    case 'time':
      Object.assign(options, { hour: '2-digit', minute: '2-digit', second: '2-digit'});
      break;
    case 'datetime':
    default:
      Object.assign(options, { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
  }

  // Formatear la fecha
  let formattedDate = parsedDate.toLocaleString('es-ES', options);

  // Ajustar el formato para que coincida con el ejemplo proporcionado
  if (format === 'datetime' || format === 'time') {
    formattedDate = formattedDate.replace(',', '').replace(' ', ' ');
  }

  return formattedDate;
}


export function formatRelativeDate(date: string | Date): string {
  console.log('dia', date)
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Fecha inválida');
  }

  if (parsedDate.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (parsedDate.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else if (parsedDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()) && parsedDate <= today) {
    return format(parsedDate, 'dddd', 'es'); // Full day of the week in Spanish
  } else if (parsedDate.getFullYear() === today.getFullYear()) {
    return format(parsedDate,  'ddd, DD MMM', 'es'); // Abbreviated day and month in Spanish
  } else {
    return format(parsedDate, 'medium', 'es');
  }
}