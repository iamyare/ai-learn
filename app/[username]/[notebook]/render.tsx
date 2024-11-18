'use client'

import { useState, useMemo, useCallback } from 'react'

import { useMediaQuery } from '@/components/ui/use-media-query'

import SpeechRecognition from './components/SpeechRecognition'
import PDFViewer from '@/components/ui/PDFViewer'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { MessageCircle, XIcon } from 'lucide-react'

// Removed import of SpeechRecognitionProvider
import { PDFTextProvider } from '@/context/usePDFTextExtractionContext'
import { cn } from '@/lib/utils'
import { useUser } from '@/context/useUserContext'
import Chat from '@/components/chat/Chat'
import { HighlighterProvider } from '@/context/useHighlighterContext'
import HeaderNotebook from './components/HeaderNotebook'

export default function RenderView({
  notebookInfo
}: {
  notebookInfo: NotebookInfo
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 600px)')
  const { user } = useUser()

  const toggleChat = useCallback(() => setChatOpen((prev) => !prev), [])

  const pdfViewerContent = useMemo(
    () => <PDFViewer initialFileUrl={notebookInfo.pdf_document.file_path} />,
    [notebookInfo.pdf_document.file_path]
  )

  const speechRecognitionContent = useMemo(
    () => <SpeechRecognition notebookId={notebookInfo.notebook_id} />,
    [notebookInfo.notebook_id]
  )

  const chatContent = useMemo(
    () => <Chat notebookId={notebookInfo.notebook_id} />,
    [notebookInfo.notebook_id]
  )
  if (!user) return null

  return (
    <PDFTextProvider>
      {/* Removed SpeechRecognitionProvider */}
      <HighlighterProvider>
        <main className='flex relative flex-col w-screen h-screen overflow-hidden'>
          <HeaderNotebook notebookInfo={notebookInfo} user={user} />
          <ResizablePanelGroup direction='horizontal' className='w-full h-full'>
            <ResizablePanel defaultSize={isDesktop ? 100 : 60}>
              <ResizablePanelGroup direction='vertical'>
                <ResizablePanel defaultSize={65} minSize={30}>
                  {pdfViewerContent}
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={35} minSize={30}>
                  {speechRecognitionContent}
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            {isDesktop ? (
              <ResizablePanel defaultSize={40} maxSize={50}>
                {chatContent}
              </ResizablePanel>
            ) : (
              <>
                {chatOpen && (
                  <div className='fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-background/70 z-50'>
                    {chatContent}
                  </div>
                )}
                <Button
                  size='icon'
                  className={cn(
                    'fixed  z-[51]',
                    chatOpen ? 'top-1 right-2 ' : ' bottom-2 right-2 '
                  )}
                  onClick={toggleChat}
                  variant={chatOpen ? 'ghost' : 'default'}
                >
                  {chatOpen ? (
                    <XIcon className='size-4' />
                  ) : (
                    <MessageCircle className='size-4' />
                  )}
                </Button>
              </>
            )}
          </ResizablePanelGroup>
          <footer className='w-screen h-5 border-t' />
        </main>
      </HighlighterProvider>
    </PDFTextProvider>
  )
}
