import * as React from "react"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from "lucide-react"
import { useSpeechRecognitionContext } from '@/context/useSpeechRecognitionContext'
import { VisualizationOptions } from "@/types/speechRecognition"

const options = [
  { value: 'copy', label: 'Copiar Transcripcion' },
  { value: 'copy-no-transcript', label: 'Copiar Transcripcion sin fecha' },
  { value: 'delete', label: 'Eliminar Transcripcion' },
]

const hiddenTranscription = [
  { value: 'showDate', label: 'Fecha' },
  { value: 'showTime', label: 'Hora' },
  { value: 'showPage', label: 'Pagina' },
]

export function MoreOptionsTranscript() {
  const { history, updateOptions, visualizationOptions, setVisualizationOptions } = useSpeechRecognitionContext()

  const handleChange = (value: keyof VisualizationOptions) => {
    setVisualizationOptions(prev => ({
      ...prev,
      [value]: !prev[value]
    }))
  }

  const handleCopy = (withMetadata: boolean) => {
    const textToCopy = history.map(entry => {
      let entryText = ''
      if (withMetadata) {
        if (visualizationOptions.showDate) entryText += `[${new Date(entry.timestamp).toLocaleDateString()}] `
        if (visualizationOptions.showTime) entryText += `[${new Date(entry.timestamp).toLocaleTimeString()}] `
        if (visualizationOptions.showPage && entry.page) entryText += `[Página ${entry.page}] `
      }
      entryText += entry.text
      return entryText
    }).join('\n')

    navigator.clipboard.writeText(textToCopy)
  }

  const handleDelete = () => {
    updateOptions({ history: [] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant="ghost">
          <MoreVertical className='text-muted-foreground size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            onClick={() => {
              if (option.value === 'copy') handleCopy(true)
              if (option.value === 'copy-no-transcript') handleCopy(false)
              if (option.value === 'delete') handleDelete()
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Visualizar</DropdownMenuLabel>
        {hiddenTranscription.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={visualizationOptions[option.value as keyof VisualizationOptions]}
            onCheckedChange={() => {
              handleChange(option.value as keyof VisualizationOptions)
              console.log(`${option.value}: ${!visualizationOptions[option.value as keyof VisualizationOptions]}`)
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}