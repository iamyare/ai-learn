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
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function RenderView({
  notebookInfo
}: {
  notebookInfo: NotebookInfo
}) {
  const router = useRouter()
  return (
    <PDFTextProvider>
      <PDFProvider>
        <SpeechRecognitionProvider>
          <main className='flex relative flex-col w-screen h-screen overflow-hidden'>
            <header className='w-screen flex justify-between h-10 py-1 px-2 border-b'>
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

              <ThemeToggle />
            </header>
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full h-full'
            >
              {/* Primer ResizablePanel */}
              <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup direction='vertical'>
                  <ResizablePanel defaultSize={65} minSize={30}>
                    <PDFViewer
                      initialFileUrl={notebookInfo.pdf_document.file_path}
                    />
                  </ResizablePanel>
                  <ResizableHandle  />
                  <ResizablePanel defaultSize={35} className=''>
                    <SpeechRecognition />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle  />
              {/* Segundo ResizablePanel */}
              <ResizablePanel defaultSize={30} maxSize={50}>
                <Chat />
              </ResizablePanel>
            </ResizablePanelGroup>

            <footer className='w-screen h-5 border-t'></footer>
          </main>
        </SpeechRecognitionProvider>
      </PDFProvider>
    </PDFTextProvider>
  )
}
