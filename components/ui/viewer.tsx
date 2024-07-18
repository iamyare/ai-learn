'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderGoToPageProps } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

// Dynamically import the Viewer component with correct props
const DynamicViewer = dynamic(() => import('@react-pdf-viewer/core').then((mod) => {
    const Viewer = mod.Viewer;
    // Define explicit types for the props to fix the 'any' type issue
    interface ViewerProps {
      fileUrl: string;
      plugins: any[]; // Specify the correct type for plugins if available
    }
    // Assign a display name to the component to fix the missing display name warning
    const DynamicViewerComponent: React.FC<ViewerProps> = ({ fileUrl, plugins }) => (
      <Viewer fileUrl={fileUrl} plugins={plugins} />
    );
    DynamicViewerComponent.displayName = 'DynamicViewerComponent';
    return DynamicViewerComponent;
  }), { ssr: false });
  
  interface PDFViewerProps {
      fileUrl: string;
  }

  
const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
    const [workerSrc, setWorkerSrc] = useState<string | undefined>(undefined);
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { GoToFirstPage, GoToLastPage } = pageNavigationPluginInstance;

    useEffect(() => {
        import('pdfjs-dist/build/pdf.worker.entry').then((worker) => {
            setWorkerSrc(worker.default);
        });
    }, []);

    if (!workerSrc) {
        return <div>Loading...</div>;
    }

    return (
        <Worker workerUrl={workerSrc}>
            <div className="flex flex-col h-full border border-gray-300">
                <div className="flex items-center justify-center p-4 bg-gray-100 border-b border-gray-200">
                    <div className="px-1">
                        <GoToFirstPage>
                            {(props: RenderGoToPageProps) => (
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={props.onClick}
                                >
                                    Primera página
                                </button>
                            )}
                        </GoToFirstPage>
                    </div>
                    {/* ... other navigation buttons ... */}
                    <div className="px-1">
                        <GoToLastPage>
                            {(props: RenderGoToPageProps) => (
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={props.onClick}
                                >
                                    Última página
                                </button>
                            )}
                        </GoToLastPage>
                    </div>
                </div>
                <div className="flex-grow overflow-hidden">
                    <DynamicViewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
                </div>
            </div>
        </Worker>
    );
};

export default PDFViewer;