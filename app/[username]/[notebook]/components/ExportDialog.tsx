'use client'

import * as React from 'react'
import { FileText, FileType, Download, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Config = {
  includeMetadata?: boolean
  includeTableOfContents?: boolean
  syntaxHighlighting?: boolean
  pageSize?: string
  orientation?: string
  margin?: string
  includeStyles?: boolean
  includeAssets?: boolean
  minify?: boolean
}

type ConfigurationPanelProps = {
  format: string
  config: Config
  onChange: (newConfig: Config) => void
}

const exportOptions = [
  {
    label: 'Markdown (.md)',
    icon: FileText,
    description: 'Exportar como documento Markdown',
    config: {
      includeMetadata: false,
      includeTableOfContents: false,
      syntaxHighlighting: true
    }
  },
  {
    label: 'PDF (.pdf)',
    icon: FileType,
    description: 'Exportar como documento PDF',
    config: {
      pageSize: 'a4',
      orientation: 'portrait',
      margin: 'normal'
    }
  },
  {
    label: 'HTML (.html)',
    icon: Download,
    description: 'Exportar como página web HTML',
    config: {
      includeStyles: true,
      includeAssets: false,
      minify: false
    }
  }
]

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  format,
  config,
  onChange
}) => {
  const handleCheckedChange =
    (key: keyof Config) => (checked: boolean | 'indeterminate') => {
      if (typeof checked === 'boolean') {
        onChange({ ...config, [key]: checked })
      }
    }

  switch (format) {
    case 'Markdown (.md)':
      return (
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='metadata'
              checked={config.includeMetadata}
              onCheckedChange={handleCheckedChange('includeMetadata')}
            />
            <Label htmlFor='metadata'>Incluir metadatos</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='toc'
              checked={config.includeTableOfContents}
              onCheckedChange={handleCheckedChange('includeTableOfContents')}
            />
            <Label htmlFor='toc'>Incluir tabla de contenidos</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='syntax'
              checked={config.syntaxHighlighting}
              onCheckedChange={handleCheckedChange('syntaxHighlighting')}
            />
            <Label htmlFor='syntax'>Resaltado de sintaxis</Label>
          </div>
        </div>
      )
    case 'PDF (.pdf)':
      return (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Tamaño de página</Label>
            <Select
              value={config.pageSize}
              onValueChange={(value) =>
                onChange({ ...config, pageSize: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='a4'>A4</SelectItem>
                <SelectItem value='letter'>Carta</SelectItem>
                <SelectItem value='legal'>Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Orientación</Label>
            <Select
              value={config.orientation}
              onValueChange={(value) =>
                onChange({ ...config, orientation: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='portrait'>Vertical</SelectItem>
                <SelectItem value='landscape'>Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case 'HTML (.html)':
      return (
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='styles'
              checked={config.includeStyles}
              onCheckedChange={handleCheckedChange('includeStyles')}
            />
            <Label htmlFor='styles'>Incluir estilos CSS</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='assets'
              checked={config.includeAssets}
              onCheckedChange={handleCheckedChange('includeAssets')}
            />
            <Label htmlFor='assets'>Incluir recursos (imágenes, fuentes)</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='minify'
              checked={config.minify}
              onCheckedChange={handleCheckedChange('minify')}
            />
            <Label htmlFor='minify'>Minimizar código</Label>
          </div>
        </div>
      )
    default:
      return null
  }
}

export function ExportDialog() {
  const [open, setOpen] = React.useState(false)
  const [configs, setConfigs] = React.useState<{ [key: string]: Config }>(
    exportOptions.reduce((acc, option) => {
      acc[option.label] = option.config
      return acc
    }, {} as { [key: string]: Config })
  )

  const handleExport = (format: string) => {
    console.log(`Exportando como ${format}`, configs[format])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className='flex items-center'>
          <ArrowUp className='mr-3 h-4 w-4' />
          Exportar
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Exportar documento</DialogTitle>
          <DialogDescription>
            Elige el formato para exportar tu documento
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <p className=' text-primary'>
            Actualmente estamos trabajando en ello
          </p>
          <Accordion type='single' collapsible>
            {exportOptions.map((option, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>
                  <div className='flex items-center'>
                    <option.icon className='mr-2 h-4 w-4' />
                    <span>{option.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='pt-4'>
                    <ConfigurationPanel
                      format={option.label}
                      config={configs[option.label]}
                      onChange={(newConfig) =>
                        setConfigs({
                          ...configs,
                          [option.label]: newConfig
                        })
                      }
                    />
                    <Button
                      className='mt-4 w-full'
                      onClick={() => handleExport(option.label)}
                    >
                      Exportar como {option.label}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
