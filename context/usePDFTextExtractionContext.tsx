'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PDFTextContextType {
    text: string;
    isLoading: boolean;
    error: string | null;
    extractTextFromPDF: (fileUrl: string) => void;
}

const PDFTextContext = createContext<PDFTextContextType | undefined>(undefined);

export const usePDFText = () => {
    const context = useContext(PDFTextContext);
    if (!context) {
        throw new Error('usePDFText must be used within a PDFTextProvider');
    }
    return context;
};

interface PDFTextProviderProps {
    children: ReactNode;
}

export const PDFTextProvider: React.FC<PDFTextProviderProps> = ({ children }) => {
    const [text, setText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const extractTextFromPDF = async (fileUrl: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const pdfjsLib = await import('pdfjs-dist');
            const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdf = await loadingTask.promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }

            setText(fullText.trim());
            setIsLoading(false);
        } catch (err) {
            setError('Error extracting text from PDF');
            setIsLoading(false);
        }
    };

    const value = {
        text,
        isLoading,
        error,
        extractTextFromPDF
    };

    return (
        <PDFTextContext.Provider value={value}>
            {children}
        </PDFTextContext.Provider>
    );
};