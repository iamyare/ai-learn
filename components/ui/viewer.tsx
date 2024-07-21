'use client'
import React from 'react'
import { Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'
import '@react-pdf-viewer/toolbar/lib/styles/index.css'
import usePDFViewer from './usePDFViewer' // Adjust the import path as needed
import Toolbar from './viewer/toolbar'
import LoadingComponent from './loading-component'
import { usePDFText } from '@/context/usePDFTextExtractionContext'

interface PDFViewerProps {
  fileUrl: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const { 
    workerSrc, 
    DynamicViewer, 
    viewerProps, 
    pageNavigationPluginInstance,
    pdfDocument
  } = usePDFViewer(fileUrl)

  const toolbarPluginInstance = toolbarPlugin()
  const { Toolbar: ToolbarSlot } = toolbarPluginInstance

  const { extractTextFromPDF } = usePDFText()

  if (!workerSrc || !pdfDocument) {
    return (
      <div className='flex w-full h-full justify-center items-center'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <Worker workerUrl={workerSrc}>
      <div className='relative flex flex-col h-full bg-transparent'>
        <div className='flex-grow overflow-hidden'>
          <DynamicViewer
            {...viewerProps}
            plugins={[pageNavigationPluginInstance, toolbarPluginInstance]}
            onDocumentLoad={() => {
              console.log('Document loaded')
              // You can call extractTextFromPDF here if needed
              extractTextFromPDF(fileUrl)
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

export default PDFViewer