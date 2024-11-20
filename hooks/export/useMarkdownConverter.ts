
import { useCallback } from 'react'

export const useMarkdownConverter = () => {
  const convertToPlainText = useCallback((markdown: string): string => {
    return markdown
      // Eliminar encabezados manteniendo el texto
      .replace(/^#{1,6}\s+(.*$)/gm, '$1')
      // Eliminar énfasis manteniendo el texto
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Eliminar enlaces manteniendo el texto
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      // Eliminar imágenes
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '')
      // Eliminar bloques de código (tanto multilínea como inline)
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Eliminar líneas en blanco extras
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
  }, [])

    return { convertToPlainText }
}