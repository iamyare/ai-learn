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