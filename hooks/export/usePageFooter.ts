import { jsPDF } from 'jspdf'

export const usePageFooter = () => {
  const renderPageFooter = (doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, notebookName: string) => {
    const currentPage = doc.getCurrentPageInfo().pageNumber
    const totalPages = doc.getNumberOfPages()
    
    // Configuración para el pie de página
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    
    // Posicionamiento
    const footerY = pageHeight - 10
    
    // Texto de paginación (derecha)
    const pageText = `Página ${currentPage} de ${totalPages}`
    const pageTextWidth = doc.getTextWidth(pageText)
    const pageTextX = pageWidth - margin - pageTextWidth

    // Nombre del notebook (izquierda)
    doc.saveGraphicsState()
    doc.text(notebookName, margin, footerY)
    doc.text(pageText, pageTextX, footerY)
    doc.restoreGraphicsState()
  }

  return { renderPageFooter }
}