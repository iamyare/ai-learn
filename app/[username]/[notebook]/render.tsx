'use client'

import Chat from '@/components/chat'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { SpeechRecognitionProvider } from '@/context/useSpeechRecognitionContext'
import { PDFTextProvider } from '@/context/usePDFTextExtractionContext'
import { PDFProvider } from '@/context/useCurrentPageContext'
import SpeechRecognition from './components/SpeechRecognition'
import PDFViewer from '@/components/ui/PDFViewer'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import ConfigModal from '@/components/modals/config'
import LogOut from '@/components/ui/log-out'
import { useMediaQuery } from '@/components/ui/use-media-query'
import { useState } from 'react'

export default function RenderView({
  notebookInfo
}: {
  notebookInfo: NotebookInfo
}) {
  const router = useRouter()
  const [chatOpen, setChatOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 600px)')
  return (
    <PDFTextProvider>
      <PDFProvider>
        <SpeechRecognitionProvider>
          <main className='flex relative flex-col w-screen h-screen overflow-hidden'>
            <header className='w-screen flex justify-between items-center h-10 py-1 px-2 border-b'>
              <div className=' flex items-center gap-2'>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  className='p-1 size-8'
                  onClick={() => router.back()}
                >
                  <ChevronLeft className=' size-4' />
                </Button>
                <h2 className=' font-medium'>{notebookInfo.notebook_name}</h2>
              </div>

              <div className=' flex items-center'>
                <ThemeToggle className='h-full ' />
                <ConfigModal />
                <LogOut />
              </div>
            </header>
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full h-full'
            >
              {/* Primer ResizablePanel */}
              <ResizablePanel defaultSize={isDesktop ? 100 : 70}>
                <ResizablePanelGroup direction='vertical'>
                  <ResizablePanel defaultSize={65} minSize={30}>
                    <PDFViewer
                      initialFileUrl={notebookInfo.pdf_document.file_path}
                    />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={35} className=''>
                    <SpeechRecognition notebookId={notebookInfo.notebook_id} />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              {/* Segundo ResizablePanel */}

              {isDesktop ? (
                <ResizablePanel defaultSize={30} maxSize={50}>
                  <Chat notebookId={notebookInfo.notebook_id} />
                </ResizablePanel>
              ) : (
                <>
                  {chatOpen && (
                    <Chat
                      notebookId={notebookInfo.notebook_id}
                      className='fixed top-0 left-0 backdrop-blur-sm bg-background/70 z-50'
                    />
                  )}
                  <Button
                    size={'icon'}
                    className='fixed bottom-2 right-2 z-[51]'
                  >
                    <MessageCircle
                      className='size-4'
                      onClick={() => setChatOpen((prev) => !prev)}
                    />
                  </Button>
                </>
              )}
            </ResizablePanelGroup>

            <footer className='w-screen h-5 border-t'></footer>
          </main>
        </SpeechRecognitionProvider>
      </PDFProvider>
    </PDFTextProvider>
  )
}
