import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, format: 'date' | 'time' | 'datetime' = 'datetime'): string {
  const options: Intl.DateTimeFormatOptions = format === 'date' ? { day: '2-digit', month: '2-digit', year: 'numeric' } : format === 'time' ? { hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('es-ES', options);
}