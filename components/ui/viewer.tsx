'use client'
import React from 'react';
import { Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import usePDFViewer from './usePDFViewer'; // Adjust the import path as needed
import Toolbar from './viewer/toolbar';

interface PDFViewerProps {
    fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
    const {
        workerSrc,
        DynamicViewer,
        pageNavigationPluginInstance,
        GoToFirstPage,
        GoToLastPage,
        GoToNextPage,
        GoToPreviousPage,
        NumberOfPages,
        CurrentPageInput,
    } = usePDFViewer(fileUrl);

    const toolbarButtonProps = {
        GoToFirstPage,
        GoToLastPage,
        GoToNextPage,
        GoToPreviousPage,
        NumberOfPages,
        CurrentPageInput,
    };

    if (!workerSrc) {
        return <div>Loading...</div>;
    }

    return (
        <Worker workerUrl={workerSrc}>
            <div className="relative flex flex-col h-full bg-transparent ">
                <div className="flex-grow overflow-hidden">
                    <DynamicViewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
                </div>
                <Toolbar toolbarButtonProps={toolbarButtonProps} />
            </div>
        </Worker>
    );
};

export default PDFViewer;