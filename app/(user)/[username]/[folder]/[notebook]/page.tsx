'use client'

import Chat from '@/components/chat'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { SpeechRecognitionProvider } from '@/context/useSpeechRecognitionContext'
import Viewer from '@/components/ui/viewer'
import { PDFTextProvider } from '@/context/usePDFTextExtractionContext'
import { CurrentPageProvider } from '@/context/useCurrentPageContext'
import SpeechRecognition from './components/SpeechRecognition'


export default function Home() {
  const fileUrl = '/somefile.pdf'
  return (
    <PDFTextProvider>
      <CurrentPageProvider>
        <SpeechRecognitionProvider>
          <main className='flex flex-col w-screen h-screen overflow-hidden'>
            <header className='w-screen h-10 border-b'></header>
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full h-full'
            >
              {/* Primer ResizablePanel */}
              <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup direction='vertical'>
                  <ResizablePanel defaultSize={60} minSize={30}>
                    <Viewer fileUrl={fileUrl} />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={40}>
                    <SpeechRecognition />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle />
              {/* Segundo ResizablePanel */}
              <ResizablePanel defaultSize={30} maxSize={50}>
                <Chat />
              </ResizablePanel>
            </ResizablePanelGroup>

            <footer className='w-screen h-5 border-t'></footer>
          </main>
        </SpeechRecognitionProvider>
      </CurrentPageProvider>
    </PDFTextProvider>
  )
}
