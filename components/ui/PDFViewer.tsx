'use client'
import React, { useEffect } from 'react';
import { Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar'
import { dropPlugin } from '@react-pdf-viewer/drop'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/toolbar/lib/styles/index.css'
import '@react-pdf-viewer/drop/lib/styles/index.css'

import usePDFViewer from './usePDFViewer'
import Toolbar from './viewer/toolbar'
import LoadingComponent from './loading-component'
import { usePDFContext } from '@/context/useCurrentPageContext';
import { usePDFText } from '@/context/usePDFTextExtractionContext';

interface PDFViewerProps {
  initialFileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ initialFileUrl }) => {
  const { fileUrl, setFileUrl, setCurrentPage } = usePDFContext();

  const { isPending:isLoading } = usePDFText()
  
  const { 
    workerSrc, 
    DynamicViewer, 
    viewerProps, 
    pageNavigationPluginInstance,
  } = usePDFViewer(fileUrl || initialFileUrl)

  const toolbarPluginInstance = toolbarPlugin()
  const { Toolbar: ToolbarSlot } = toolbarPluginInstance
  const dropPluginInstance = dropPlugin()

  const plugins = [
    pageNavigationPluginInstance,
    toolbarPluginInstance,
    dropPluginInstance
  ]

  useEffect(() => {
    if (!fileUrl && initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [initialFileUrl, fileUrl, setFileUrl]);

  const handlePageChange = (e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1);
  };

  if (!workerSrc) {
    return (
      <div className=' w-full h-full flex justify-center items-center'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <Worker workerUrl={workerSrc}>
      <div className='relative flex flex-col h-full bg-transparent'>
        <div className='relative flex-grow overflow-hidden'>
          {
            isLoading && (
              <div className='absolute top-0 z-50 left-0 w-full h-full flex justify-center items-center'>
                <span>se esta cargando el texto</span>
              </div>
            )
          }
          <DynamicViewer
            {...viewerProps}
            plugins={plugins}
            onDocumentLoad={(props) => {
              setFileUrl(props.file.data as string);
            }}
            onPageChange={handlePageChange}
          />
        </div>
        <ToolbarSlot>
          {(props) => <Toolbar toolbarSlot={props} className='' />}
        </ToolbarSlot>
      </div>
    </Worker>
  )
}

export default PDFViewer;