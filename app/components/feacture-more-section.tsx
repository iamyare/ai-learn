/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'

import { HoverEffect } from '@/components/ui/card-hover-effect'
import {
  AudioLines,
  BarChart3,
  Cloud,
  Columns2,
  FileText,
  Highlighter,
  Search
} from 'lucide-react'
import Container from '@/components/ui/container-animation'

export const projects = [
  {
    icon: Highlighter,
    title: 'Toma de Notas',
    description:
      'Toma notas mientras revisas tus documentos. Perfecto para añadir tus propias ideas y observaciones.',
    link: '#hero'
  },
  {
    icon: Search,
    title: 'Búsqueda Global',
    description:
      'Encuentra cualquier nota, concepto o tema instantáneamente en todos tus notebooks con búsqueda avanzada.',
    link: '#hero'
  },
  {
    icon: FileText,
    title: 'Exportación Flexible',
    description:
      'Exporta tus notes en múltiples formatos: PDF, Word, Markdown o presentaciones automáticas.',
    link: '#hero'
  },
  {
    icon: BarChart3,
    title: 'Generación de Gráficos',
    description:
      'Selecciona datos de tus PDFs y créa automáticamente gráficos visuales para mejor comprensión del contenido.',
    link: '#hero'
  },
  {
    icon: AudioLines,
    title: 'Transcripción Flexible',
    description:
      'Transcribe en tiempo real durante tus clases o sube notas de voz previamente grabadas para su transcripción automática.',
    link: '#hero'
  },
  {
    icon: Cloud,
    title: 'Almacenamiento en la Nube',
    description:
      'Accede a todos tus notebooks desde cualquier dispositivo con almacenamiento seguro en la nube.',
    link: '#hero'
  }
]

export default function FeatureMoreSection() {
  return (
    <section id='moreFeacture' className='-mt-36'>
      <div className='sm:py-20 py-12 container px-10'>
        <div className='text-center space-y-4 pb-10 mx-auto'>
          <h2 className='text-sm text-primary text-balance font-mono font-semibold tracking-wider uppercase'>
            Descubre más
          </h2>
          <h3 className='mx-0 mt-4 max-w-lg text-5xl text-balance font-bold sm:max-w-none sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tighter text-foreground'>
            Potencia tu aprendizaje
          </h3>
        </div>

        <Container className='max-w-5xl mx-auto px-8'>
          <HoverEffect items={projects} />
        </Container>
      </div>
    </section>
  )
}
