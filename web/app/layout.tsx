import './globals.css'
import type {Metadata} from 'next'
import {Figtree} from 'next/font/google'
import {ReduxProvider} from '@/redux/provider'
import ToasterProvider from '@/providers/ToasterProvider'

const font = Figtree({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Rosatom clusterization',
  description: 'Try our Rosatom clusterization',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <ToasterProvider />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
