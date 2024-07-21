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

interface PDFViewerProps {
  initialFileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ initialFileUrl }) => {
  const { fileUrl, setFileUrl } = usePDFContext();
  
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

  if (!workerSrc) {
    return <LoadingComponent />
  }

  return (
    <Worker workerUrl={workerSrc}>
      <div className='relative flex flex-col h-full bg-transparent'>
        <div className='flex-grow overflow-hidden'>
          <DynamicViewer
            {...viewerProps}
            plugins={plugins}
            onDocumentLoad={(props) => {
              console.log('onDocumentLoad', props.file.data);
              setFileUrl(props.file.data as string);
            }}
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