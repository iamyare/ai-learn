'use client'

import { Button } from "@/components/ui/button"
import CoursorText from "@/components/ui/coursor-text"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSpeechRecognitionContext } from "@/context/useSpeechRecognitionContext"
// import { useSpeechRecognition } from "@/components/ui/useSpeechRecognition"
import { cn } from "@/lib/utils"
import { Mic, Play, SkipBack, SkipForward } from "lucide-react"

interface SpeechRecognitionProps {
  classNameContainer?: string
  classNameHeader?: string
  classNameTranscript?: string
}

export default function SpeechRecognition({classNameContainer, classNameHeader, classNameTranscript}: SpeechRecognitionProps) {
  const { isListening, transcript, history, startListening, stopListening } = useSpeechRecognitionContext()
  return (
    <section className={cn(" flex flex-col h-full w-full", classNameContainer)}>
      <header className={cn(" flex justify-center py-2 w-full", classNameHeader)}>
      <Button size={'icon'} variant={'ghost'}>
          <SkipBack className=" size-4" />
        </Button>
        <Button size={'icon'} variant={'ghost'}>
          <Play className=" size-4" />
        </Button>
        <Button size={'icon'} variant={'ghost'} onClick={isListening ? stopListening : startListening}>
          {
            isListening ? (
              <Mic className=" size-4 text-red-500" />
            ):(
              <Mic className=" size-4" />
            )
          }
        </Button>
        <Button size={'icon'} variant={'ghost'}>
          <SkipForward className=" size-4" />
        </Button>
      </header>
      <ScrollArea className={cn(" w-full h-full px-4 overflow-scroll ", classNameTranscript)}>
      {history.length !== 0 ? (
            <>
              {history.map((entry, index) => (
                <p key={index} className='flex flex-col'>
                  <span className=' ml-2 text-muted-foreground text-sm'>
                    {entry.timestamp} - Pagina 2
                  </span>
                  {entry.text}
                  {
                    //si es la última entrada, anexar puntos suspensivos
                    index === history.length - 1
                      ? isListening && (
                          <span>
                            {' '}{transcript}<CoursorText />
                          </span>
                        )
                      : null
                  }
                  {/* {index < history.length - 1 ? '\n' : ''} */}
                </p>
              ))}
            </>
          ) : (
            isListening && (
              <span>
                {transcript}<CoursorText />
              </span>
            )
          )}
      </ScrollArea>
    </section>
  )
}
