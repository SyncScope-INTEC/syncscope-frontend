import type { Metadata } from 'next'
import { Space_Grotesk, Readex_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/components/providers/redux-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from 'sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const readexPro = Readex_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'SyncScope',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${readexPro.variable}`}>
      <body className="font-sans">
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}