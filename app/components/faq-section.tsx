'use client'
import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Container from '@/components/ui/container-animation'

const faqs = [
  {
    question: '¿Cómo funciona la transcripción en tiempo real?',
    answer:
      'Stick Note ofrece dos tipos de transcripción: 1) Transcripción en tiempo real que utiliza el motor nativo de JavaScript, perfecta para capturar tus clases en el momento, y 2) Transcripción de audio pregrabado que emplea IA multimodal para procesar y transcribir archivos de audio con alta precisión.'
  },
  {
    question: '¿Qué formatos de archivo puedo importar y exportar?',
    answer:
      'Puedes importar archivos PDF y archivos de audio (.mp3, .wav). Para exportación, ofrecemos múltiples formatos incluyendo PDF, Word (.docx), texto plano (.txt) y Markdown (.md), permitiéndote usar tus notas en cualquier plataforma.'
  },
  {
    question: '¿Cómo funciona la generación de gráficos?',
    answer:
      'Puedes seleccionar datos numéricos o tablas en tus PDFs, y Stick Note automáticamente generará visualizaciones gráficas. Soportamos diferentes tipos de gráficos como barras, líneas, circular y dispersión, adaptándose al tipo de datos seleccionados.'
  },
  {
    question: '¿Funciona con cualquier idioma?',
    answer:
      'Actualmente, Stick Note soporta transcripción en español. Estamos trabajando continuamente para añadir más idiomas y mejorar la precisión de la transcripción.'
  }
]

export default function FAQSection() {
  return (
    <section id='faq' className='-mt-20'>
      <div className='sm:py-20 py-12 container px-10'>
        <div className='text-center space-y-4 pb-10 mx-auto'>
          <h2 className='text-sm text-primary text-balance font-mono font-semibold tracking-wider uppercase'>
            Preguntas Frecuentes
          </h2>
          <h3 className='mx-0 mt-4 max-w-lg text-5xl text-balance font-bold sm:max-w-none sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tighter text-foreground'>
            Todo lo que necesitas saber
          </h3>
        </div>
        <div className='flex justify-center items-center max-w-3xl mx-auto py-10'>
          <Container className='w-full'>
            <Accordion type='single' collapsible className='w-full'>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </div>
      </div>
    </section>
  )
}
