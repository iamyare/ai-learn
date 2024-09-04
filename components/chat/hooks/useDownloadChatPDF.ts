import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useDownloadChatPDF = () => {
  const downloadChatPDF = useCallback(async (chatElementId: string, fileName: string = 'chat.pdf') => {
    const chatElement = document.getElementById(chatElementId);
    if (!chatElement) {
      console.error('Chat element not found');
      return;
    }

    try {
      const canvas = await html2canvas(chatElement, {
        scale: 2, // Increase quality
        useCORS: true, // If you have any images in your chat
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, []);

  return { downloadChatPDF };
};