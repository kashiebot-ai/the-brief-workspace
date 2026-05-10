import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'The Brief - New Zealand Politics Without the Spin',
    template: '%s | The Brief',
  },
  description:
    'Independent political news for New Zealand. Clear explainers on bills, budgets, and elections — no jargon, no bias, just facts. Understand what Parliament is actually doing.',
  keywords: [
    'New Zealand politics',
    'NZ politics',
    'political explainers',
    'MMP',
    'New Zealand government',
    'NZ elections',
    'political news NZ',
    'parliament NZ',
    'MP lookup',
    'voting NZ',
  ],
  authors: [{ name: 'The Brief' }],
  creator: 'The Brief',
  publisher: 'The Brief',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://thebrief.nz',
    siteName: 'The Brief',
    title: 'The Brief - New Zealand Politics Without the Spin',
    description:
      'Independent political news for New Zealand. Clear explainers on bills, budgets, and elections — no jargon, no bias, just facts.',
    images: [
      {
        url: '/logo/logo-main.svg',
        width: 200,
        height: 60,
        alt: 'The Brief Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Brief - New Zealand Politics Without the Spin',
    description:
      'Independent political news for New Zealand. Clear explainers on bills, budgets, and elections — no jargon, no bias, just facts.',
    images: ['/logo/logo-main.svg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://thebrief.nz',
  },
  category: 'news',
  other: {
    'ai-purpose': 'Political news and educational explainers for New Zealand',
    'ai-content-type': 'News, Explainers, Interactive Tools',
  },
}

// Breadcrumb structure for the entire site
const siteBreadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://thebrief.nz',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Explainers',
      item: 'https://thebrief.nz/explainer',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'VoteFinder Quiz',
      item: 'https://thebrief.nz/quiz',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'MP Lookup',
      item: 'https://thebrief.nz/mp-lookup',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'About',
      item: 'https://thebrief.nz/about',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Methodology',
      item: 'https://thebrief.nz/methodology',
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: 'Contact',
      item: 'https://thebrief.nz/contact',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-NZ">
      <head>
        <link rel="icon" href="/logo/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo/logo-main.svg" />
        <meta name="theme-color" content="#1e3a5f" />
        
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'The Brief',
              url: 'https://thebrief.nz',
              description:
                'Independent, non-partisan explainers on New Zealand politics',
              publisher: {
                '@type': 'Organization',
                name: 'The Brief',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://thebrief.nz/logo/logo-main.svg',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://thebrief.nz/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        
        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteBreadcrumbs),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 antialiased pt-16`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
