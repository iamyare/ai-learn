'use client'
import { useState, useEffect } from 'react';

const useExtractPDFText = (fileUrl: string) => {
    const [text, setText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const extractText = async () => {
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

        extractText();
    }, [fileUrl]);

    return { text, isLoading, error };
};

export default useExtractPDFText;