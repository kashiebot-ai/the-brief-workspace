import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Brief - Complex Topics, Simply Explained',
  description:
    'Daily explainers on politics, technology, business, and more. Get the context you need to understand what\'s happening in the world.',
  keywords: ['explainers', 'news', 'politics', 'technology', 'business'],
  openGraph: {
    title: 'The Brief',
    description: 'Complex topics, simply explained.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
