import type { Metadata, Viewport } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ViewTransitions } from 'next-view-transitions'
import QueryProvider from '@/hooks/query-provider'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import { getUserSession } from '@/actions/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville'
})

export const metadata: Metadata = {
  title: 'Stick Note',
  description:
    'Convierte tus clases en notas organizadas con transcripción en tiempo real, gráficos automáticos y almacenamiento en la nube. La herramienta definitiva para estudiantes.',
  keywords:
    'notebooks inteligentes, transcripción en tiempo real, notas de clase, IA para estudiantes, toma de notas, gráficos automáticos',
  authors: [{ name: 'Stick Note' }],
  creator: 'Yamir Alejandro Rodas Elvir',
  publisher: 'Stick Note',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://sticky-notes-yare.vercel.app/',
    siteName: 'Stick Note',
    title: 'Stick Note - Notebooks Inteligentes para Estudiantes',
    description:
      'Potencia tu aprendizaje con transcripción en tiempo real y organización inteligente de notas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stick Note - Notebooks Inteligentes'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stick Note - Revoluciona tu forma de tomar notas',
    description:
      'Transcripción en tiempo real, gráficos automáticos y más para estudiantes.',
    images: ['/og-image.png']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient()

  // Prefetch session data
  await queryClient.prefetchQuery({
    queryKey: ['session'],
    queryFn: getUserSession
  })

  return (
    <ViewTransitions>
      <html lang='es' suppressHydrationWarning>
        <head>
          <link rel='manifest' href='/manifest.json' />
          <meta name='theme-color' content='#000000' />
          <link rel='apple-touch-icon' href='/icon-512x512.png' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta
            name='apple-mobile-web-app-status-bar-style'
            content='black-translucent'
          />
        </head>
        <body
          className={`${inter.variable} ${libreBaskerville.variable} font-sans`}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
              </HydrationBoundary>
              <Toaster />
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
