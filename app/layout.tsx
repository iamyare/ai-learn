import type { Metadata } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
})

export const metadata: Metadata = {
  title: 'AulaAssist',
  description: 'Algo se me va a ocurrir'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${libreBaskerville.variable} font-sans`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}