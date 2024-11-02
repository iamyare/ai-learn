import React, { useState, useEffect, useRef } from 'react'
import { Header } from '../header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  microphone: z.string().optional(),
  speaker: z.string().optional()
})

const NUM_VOLUME_BARS = 10
const LOCAL_STORAGE_KEY = 'audioDevices'

export default function AudioConfig() {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [microphoneVolume, setMicrophoneVolume] = useState<number[]>(
    new Array(NUM_VOLUME_BARS).fill(0)
  )
  const [isMicTesting, setIsMicTesting] = useState<boolean>(false)
  const [isSpeakerTesting, setIsSpeakerTesting] = useState<boolean>(false)
  const audioContext = useRef<AudioContext | null>(null)
  const audioStream = useRef<MediaStream | null>(null)
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const rafId = useRef<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      microphone: '',
      speaker: ''
    }
  })

  useEffect(() => {
    async function initializeAudioConfig() {
      try {
        // Obtener dispositivos de audio
        const devices = await navigator.mediaDevices.enumerateDevices()
        const audioDevices = devices.filter(
          (device) =>
            device.kind === 'audioinput' || device.kind === 'audiooutput'
        )
        setAudioDevices(audioDevices)

        // Verificar si existe configuración en localStorage
        const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedConfig) {
          const { microphone, speaker } = JSON.parse(savedConfig)
          form.setValue('microphone', microphone)
          form.setValue('speaker', speaker)
        } else {
          // Si no hay configuración guardada, usar los primeros dispositivos disponibles
          const firstMicrophone = audioDevices.find(
            (device) => device.kind === 'audioinput'
          )
          const firstSpeaker = audioDevices.find(
            (device) => device.kind === 'audiooutput'
          )
          if (firstMicrophone) form.setValue('microphone', firstMicrophone.deviceId)
          if (firstSpeaker) form.setValue('speaker', firstSpeaker.deviceId)
        }
      } catch (error) {
        console.error('Error initializing audio config:', error)
      }
    }

    initializeAudioConfig()

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      stopMicrophoneTest()
    }
  }, [form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values))
    console.log('Audio configuration saved:', values)
  }

  const startMicrophoneTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: form.getValues().microphone }
      })
      audioStream.current = stream
      audioContext.current = new AudioContext()
      const source = audioContext.current.createMediaStreamSource(stream)
      const analyser = audioContext.current.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateMicrophoneVolume = () => {
        analyser.getByteFrequencyData(dataArray)
        const sum = dataArray.reduce((acc, val) => acc + val, 0)
        const average = sum / bufferLength
        const dB = 20 * Math.log10(average / 255)
        const normalizedDB = Math.max(-80, Math.min(0, dB))
        const percentage = (normalizedDB + 80) / 80

        const newVolumeBars = new Array(NUM_VOLUME_BARS)
          .fill(0)
          .map((_, index) => (percentage > index / NUM_VOLUME_BARS ? 1 : 0))
        setMicrophoneVolume(newVolumeBars)
        rafId.current = requestAnimationFrame(updateMicrophoneVolume)
      }

      setIsMicTesting(true)
      updateMicrophoneVolume()
    } catch (error) {
      console.error('Error starting microphone test:', error)
    }
  }

  const stopMicrophoneTest = () => {
    setIsMicTesting(false)
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }
    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContext.current) {
      audioContext.current.close()
    }
    setMicrophoneVolume(new Array(NUM_VOLUME_BARS).fill(0))
  }

  const toggleMicrophoneTest = () => {
    if (isMicTesting) {
      stopMicrophoneTest()
    } else {
      startMicrophoneTest()
    }
  }

  const toggleSpeakerTest = () => {
    if (isSpeakerTesting) {
      if (audioElement.current) {
        audioElement.current.pause()
        audioElement.current.currentTime = 0
      }
      setIsSpeakerTesting(false)
    } else {
      if (!audioElement.current) {
        audioElement.current = new Audio('/path/to/test-sound.mp3') // Replace with actual path to a test sound
        audioElement.current.loop = true
      }
      audioElement.current.setSinkId(form.getValues().speaker ?? '')
      audioElement.current.play()
      setIsSpeakerTesting(true)
    }
  }

  return (
    <section className='flex flex-col gap-4'>
      <Header.Container>
        <Header.Title>Configuración de Dispositivos de Audio</Header.Title>
        <Header.Description>
          Selecciona y prueba tus dispositivos de audio preferidos para
          micrófono y altavoces.
        </Header.Description>
      </Header.Container>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='microphone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Micrófono</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='text-start'>
                      <SelectValue placeholder='Selecciona un micrófono' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {audioDevices
                      .filter((device) => device.kind === 'audioinput')
                      .map((device) => (
                        <SelectItem
                          key={device.deviceId}
                          value={device.deviceId}
                        >
                          {device.label ||
                            `Micrófono ${device.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona el micrófono que deseas utilizar.
                </FormDescription>
                <FormMessage />
                <div className='flex justify-between gap-2'>
                  <Button
                    type='button'
                    variant={'ghost'}
                    size={'sm'}
                    onClick={toggleMicrophoneTest}
                  >
                    {isMicTesting
                      ? 'Detener prueba de micrófono'
                      : 'Iniciar prueba de micrófono'}
                  </Button>
                  <div className='group flex flex-col justify-center w-fit mx-auto'>
                    <div className='flex items-end space-x-1.5'>
                      {microphoneVolume.map((level, index) => {
                        const length = microphoneVolume.length
                        const yellowThreshold = Math.floor(length * 0.2)
                        const greenThreshold = Math.floor(length * 0.7)
                        let colorClass

                        if (index < yellowThreshold) {
                          colorClass = 'bg-yellow-500'
                        } else if (index < greenThreshold) {
                          colorClass = 'bg-green-500'
                        } else {
                          colorClass = 'bg-red-500'
                        }

                        return (
                          <div
                            key={index}
                            className={cn(
                              'w-1 h-4 rounded-full shadow-sm',
                              level ? colorClass : 'bg-muted'
                            )}
                          />
                        )
                      })}
                    </div>
                    <p className='group-hover:h-4 transition-[height] duration-300 ease-in-out text-xs text-muted-foreground h-0 overflow-hidden flex items-center justify-between w-full'>
                      <span>-80 dB</span>
                      <span>0 dB</span>
                    </p>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='speaker'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altavoces</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='text-start'>
                      <SelectValue placeholder='Selecciona los altavoces' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {audioDevices
                      .filter(
                        (device) =>
                          device.kind === 'audiooutput' && device.deviceId
                      )
                      .map((device) => (
                        <SelectItem
                          key={device.deviceId}
                          value={device.deviceId}
                        >
                          {device.label ||
                            `Altavoces ${device.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona los altavoces que deseas utilizar.
                </FormDescription>
                <FormMessage />
                <Button
                  type='button'
                  variant={'ghost'}
                  size={'sm'}
                  disabled
                  onClick={toggleSpeakerTest}
                >
                  {isSpeakerTesting
                    ? 'Detener prueba de altavoces'
                    : 'Iniciar prueba de altavoces'}
                </Button>
              </FormItem>
            )}
          />

          <footer className='flex justify-end'>
            <Button type='submit'>Guardar configuración de audio</Button>
          </footer>
        </form>
      </Form>
    </section>
  )
}