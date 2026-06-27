import type { Metadata } from 'next'
import { Inter, Sora, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['600', '700'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sol Gateway — API Micropayments',
  description: 'Pay per API call with USDC on Solana',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-text-primary font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
