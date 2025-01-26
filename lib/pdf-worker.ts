import { pdfjs } from 'react-pdf'

export const configurePdfWorker = () => {
  if (typeof window === 'undefined') return;

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  }
}
