'use client'
import React, { useEffect, useCallback } from 'react'
import { Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar'
import { dropPlugin } from '@react-pdf-viewer/drop'
import { SpecialZoomLevel } from '@react-pdf-viewer/core'
import { highlightPlugin } from '@react-pdf-viewer/highlight'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/toolbar/lib/styles/index.css'
import '@react-pdf-viewer/drop/lib/styles/index.css'

import usePDFViewer from './usePDFViewer'
import Toolbar from './viewer/toolbar'
import LoadingComponent from './loading-component'
import { usePDFTextStore } from '@/stores/usePDFTextStore'
import { usePDFStore } from '@/stores/usePDFStore'

import {
  renderHighlightContent,
  renderHighlightTarget
} from './viewer/PDFHighlighter'

interface PDFViewerProps {
  initialFileUrl: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ initialFileUrl }) => {
  // Usar el store
  const { extractTextFromPDF } = usePDFTextStore()
  const { fileUrl, setFileUrl, setCurrentPage } = usePDFStore()

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

    // Find the nearest text nodes
    const startTextNode = findTextNode(startContainer) || startContainer
    const endTextNode = findTextNode(endContainer) || endContainer

    if (!startTextNode || !endTextNode) return null

    // Adjust offsets if we've changed nodes
    if (startTextNode !== startContainer) {
      startOffset = 0
    }
    if (endTextNode !== endContainer) {
      endOffset = endTextNode.textContent?.length || 0
    }

    // Trim leading and trailing whitespace
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

    // Create a new range with the adjusted positions
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

  const {
    workerSrc,
    DynamicViewer,
    viewerProps,
    pageNavigationPluginInstance
  } = usePDFViewer(fileUrl || initialFileUrl)

  const toolbarPluginInstance = toolbarPlugin()
  const { Toolbar: ToolbarSlot } = toolbarPluginInstance
  const dropPluginInstance = dropPlugin()
  const highlightPluginInstance = highlightPlugin({
    renderHighlightContent,
    renderHighlightTarget
  })

  const plugins = [
    pageNavigationPluginInstance,
    toolbarPluginInstance,
    dropPluginInstance,
    highlightPluginInstance
  ]

  useEffect(() => {
    if (initialFileUrl) {
      setFileUrl(initialFileUrl)
      extractTextFromPDF(initialFileUrl)
    }
  }, [initialFileUrl, setFileUrl, extractTextFromPDF])

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
