'use client'
import React from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import usePDFViewer from './usePDFViewer'; // Adjust the import path as needed
import Toolbar from './viewer/toolbar';
import useExtractPDFText from './useExtractPDFText';

interface PDFViewerProps {
    fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
    const {
        workerSrc,
        DynamicViewer,
        pageNavigationPluginInstance,
    } = usePDFViewer(fileUrl);

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar: ToolbarSlot } = toolbarPluginInstance;


    const { text, isLoading, error } = useExtractPDFText(fileUrl);

    console.log('text', text);
    console.log('isLoading', isLoading);
    console.log('error', error);


    if (!workerSrc) {
        return <div>Loading...</div>;
    }

    return (
        <Worker workerUrl={workerSrc}>
            <div className="relative flex flex-col h-full bg-transparent">
                <div className="flex-grow overflow-hidden">
                    <DynamicViewer 
                        fileUrl={fileUrl} 
                        plugins={[pageNavigationPluginInstance, toolbarPluginInstance]} 
                    />
                </div>

                    <ToolbarSlot>
                        {(props) => (
                            <Toolbar toolbarSlot={props} className=''   />
                        )}
                    </ToolbarSlot>

            </div>
        </Worker>
    );
};

export default PDFViewer;