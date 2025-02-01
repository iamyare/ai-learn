'use client'
import React, { useEffect, useCallback, useMemo } from 'react'
import { Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar'
import { SpecialZoomLevel } from '@react-pdf-viewer/core'
import { highlightPlugin } from '@react-pdf-viewer/highlight'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/toolbar/lib/styles/index.css'
import { usePDFWorker } from '@/hooks/usePDFWorker'

import usePDFViewer from './usePDFViewer'
import Toolbar from './viewer/toolbar'
import LoadingComponent from './loading-component'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { usePDFStore } from '@/stores/usePDFStore'
import { useExportStore } from '@/stores/useExportStore'

import {
  renderHighlightContent,
  renderHighlightTarget
} from './viewer/PDFHighlighter'

interface PDFViewerProps {
  initialFileUrl: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ initialFileUrl }) => {
  const { extractTextFromPDF } = usePDFTextStore()
  const { setFileUrl, setCurrentPage } = usePDFStore()
  const { text } = usePDFTextStore()
  const { setPdfText, setPdfUrl } = useExportStore()
  const { isWorkerInitialized } = usePDFWorker()


  const findTextNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const found = findTextNode(node.childNodes[i])
      if (found) {
        return found
      }
    }
    return null
  }

  const normalizeSelection = useCallback((selection: Selection) => {
    if (!selection.rangeCount) return null

    const range = selection.getRangeAt(0)
    let { startContainer, endContainer, startOffset, endOffset } = range

    const startTextNode = findTextNode(startContainer) || startContainer
    const endTextNode = findTextNode(endContainer) || endContainer

    if (!startTextNode || !endTextNode) return null

    if (startTextNode !== startContainer) {
      startOffset = 0
    }
    if (endTextNode !== endContainer) {
      endOffset = endTextNode.textContent?.length || 0
    }

    const startText = startTextNode.textContent || ''
    const endText = endTextNode.textContent || ''

    while (
      startOffset < startText.length &&
      /\s/.test(startText[startOffset])
    ) {
      startOffset++
    }
    while (endOffset > 0 && /\s/.test(endText[endOffset - 1])) {
      endOffset--
    }

    const newRange = document.createRange()
    try {
      newRange.setStart(startTextNode, startOffset)
      newRange.setEnd(endTextNode, endOffset)
    } catch (error) {
      console.error('Error setting range:', error)
      return null
    }

    return newRange
  }, [])

  const handleTextLayerRendered = useCallback(
    (e: CustomEvent) => {
      const textLayerElement = e.detail.textLayerElement as HTMLElement
      textLayerElement.addEventListener('mouseup', () => {
        const selection = window.getSelection()
        if (selection) {
          const normalizedRange = normalizeSelection(selection)
          if (normalizedRange) {
            selection.removeAllRanges()
            selection.addRange(normalizedRange)
          }
        }
      })
    },
    [normalizeSelection]
  )

  const { isPending: isLoading } = usePDFTextStore()

  const pdfProxyUrl = useMemo(() => {
    try {
      // Extraer solo la parte después de .com/
      const match = initialFileUrl.match(/\.com\/(.*)/)
      if (!match) throw new Error('URL malformada')

      const path = match[1]
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/')

      console.log('URL procesada:', `/api/pdf/${path}`)
      return `/api/pdf/${path}`
    } catch (err) {
      console.error('Error procesando URL:', {
        error: err,
        originalUrl: initialFileUrl
      })
      console.log('Se usará la URL original:', initialFileUrl)
      return null
    }
  }, [initialFileUrl])



  useEffect(() => {
    setPdfText(text)
    setPdfUrl(pdfProxyUrl || '')
  }, [text, pdfProxyUrl, setPdfText, setPdfUrl])

  const {
    workerSrc,
    DynamicViewer,
    viewerProps,
    pageNavigationPluginInstance
  } = usePDFViewer(pdfProxyUrl || '')

  const toolbarPluginInstance = toolbarPlugin()
  const { Toolbar: ToolbarSlot } = toolbarPluginInstance
  const highlightPluginInstance = highlightPlugin({
    renderHighlightContent,
    renderHighlightTarget
  })

  const plugins = [
    pageNavigationPluginInstance,
    toolbarPluginInstance,
    highlightPluginInstance
  ]

  useEffect(() => {
    if (pdfProxyUrl && isWorkerInitialized) {
      setFileUrl(pdfProxyUrl)
      extractTextFromPDF(pdfProxyUrl)
    }
  }, [pdfProxyUrl, isWorkerInitialized, setFileUrl, extractTextFromPDF])


  useEffect(() => {
    document.addEventListener(
      'textlayerrendered',
      handleTextLayerRendered as EventListener
    )
    return () => {
      document.removeEventListener(
        'textlayerrendered',
        handleTextLayerRendered as EventListener
      )
    }
  }, [handleTextLayerRendered])

  const handlePageChange = (e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1)
  }

  if (!workerSrc) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <Worker workerUrl={workerSrc}>
      <div className='relative flex flex-col h-full bg-transparent'>
        <div className='relative flex-grow overflow-hidden'>
          {isLoading && (
            <div className='absolute top-0 z-50 left-0 w-full h-full flex justify-center items-center scanner_text'></div>
          )}

          <DynamicViewer
            {...viewerProps}
            plugins={plugins}
            onDocumentLoad={(props) => {
              setFileUrl(props.file.data as string)
            }}
            onPageChange={handlePageChange}
            defaultScale={Number(SpecialZoomLevel.PageWidth) - 0.1}
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
