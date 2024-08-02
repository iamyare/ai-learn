'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/components/ui/use-media-query'

import Chat from '@/components/chat'
import SpeechRecognition from './components/SpeechRecognition'
import PDFViewer from '@/components/ui/PDFViewer'
import ConfigModal from '@/components/modals/config'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import LogOut from '@/components/ui/log-out'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MessageCircle, XIcon } from 'lucide-react'

import { SpeechRecognitionProvider } from '@/context/useSpeechRecognitionContext'
import { PDFTextProvider } from '@/context/usePDFTextExtractionContext'
import { PDFProvider } from '@/context/useCurrentPageContext'
import { cn } from '@/lib/utils'
import MenuUser from '@/components/menu-user'
import { useUser } from '@/context/useUserContext'

export default function RenderView({
  notebookInfo
}: {
  notebookInfo: NotebookInfo
}) {
  const router = useRouter()
  const [chatOpen, setChatOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 600px)')
  const {user} = useUser()

  const toggleChat = useCallback(() => setChatOpen((prev) => !prev), [])

  const headerContent = useMemo(
    () => (
      <header className='w-screen flex justify-between items-center h-10 py-1 px-2 border-b'>
        <div className='flex items-center gap-2'>
          <Button
            size='icon'
            variant='ghost'
            className='p-1 size-8'
            onClick={() => router.back()}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <h2 className='font-medium'>{notebookInfo.notebook_name}</h2>
        </div>
        <div className='flex items-center'>
          <ThemeToggle className='h-full' />
          {user && <MenuUser user={user} />}
        </div>
      </header>
    ),
    [notebookInfo.notebook_name, router]
  )

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

  return (
    <PDFTextProvider>
      <PDFProvider>
        <SpeechRecognitionProvider>
          <main className='flex relative flex-col w-screen h-screen overflow-hidden'>
            {headerContent}
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full h-full'
            >
              <ResizablePanel defaultSize={isDesktop ? 100 : 70}>
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
                <ResizablePanel defaultSize={30} maxSize={50}>
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
        </SpeechRecognitionProvider>
      </PDFProvider>
    </PDFTextProvider>
  )
}
