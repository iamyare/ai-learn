'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';

// Dynamically import the Viewer component with correct props
const DynamicViewer = dynamic(() => import('@react-pdf-viewer/core').then((mod) => {
    interface ViewerProps {
      fileUrl: string;
      plugins: Plugin[];
    }
    const DynamicViewerComponent: React.FC<ViewerProps> = ({ fileUrl, plugins }) => (
      <Viewer fileUrl={fileUrl} plugins={plugins} />
    );
    DynamicViewerComponent.displayName = 'DynamicViewerComponent';
    return DynamicViewerComponent;
  }), { ssr: false });

const usePDFViewer = (fileUrl: string) => {
    const [workerSrc, setWorkerSrc] = useState<string | undefined>(undefined);
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { 
        GoToFirstPage,
        GoToLastPage,
        GoToNextPage,
        GoToPreviousPage,
        CurrentPageInput,
        CurrentPageLabel,
        NumberOfPages,
        // ... other properties
    } = pageNavigationPluginInstance;

    useEffect(() => {
        import('pdfjs-dist/build/pdf.worker.entry').then((worker) => {
            setWorkerSrc(worker.default);
        });
    }, []);

    return {
        workerSrc,
        DynamicViewer,
        pageNavigationPluginInstance,
        GoToFirstPage,
        GoToLastPage,
        GoToNextPage,
        GoToPreviousPage,
        CurrentPageInput,
        CurrentPageLabel,
        NumberOfPages,
        // ... other properties you want to expose
        fileUrl
    };
};

export default usePDFViewer;