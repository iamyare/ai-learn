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


export default function RenderView({ fileUrl }:{fileUrl: string}) {
  return (
    <PDFTextProvider>
      <PDFProvider>
        <SpeechRecognitionProvider>
          <main className='flex relative flex-col w-screen h-screen overflow-hidden'>
          {/* <DragAndDrop /> */}
            <header className='w-screen h-10 border-b'></header>
            <ResizablePanelGroup
              direction='horizontal'
              className='w-full h-full'
            >
              {/* Primer ResizablePanel */}
              <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup direction='vertical'>
                  <ResizablePanel defaultSize={60} minSize={30}>
                    <PDFViewer initialFileUrl={fileUrl} />
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
      </PDFProvider>
    </PDFTextProvider>
  )
}
