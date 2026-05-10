import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { notFound } from 'next/navigation'

// Sample explainer data for scaffold
const sampleExplainer = {
  title: 'What is Artificial Intelligence?',
  category: 'technology',
  readingTime: 5,
  publishedAt: new Date().toISOString(),
  summary:
    'A beginner-friendly guide to understanding AI, machine learning, and how these technologies are reshaping our world.',
  content: [
    {
      _type: 'block',
      _key: '1',
      children: [{ _type: 'span', text: 'Sample content for the explainer page.' }],
    },
  ],
  keyPoints: [
    'AI refers to computer systems that can perform tasks requiring human intelligence',
    'Machine learning is a subset of AI where systems learn from data',
    'Neural networks are inspired by the human brain structure',
  ],
}

async function getExplainer(slug: string) {
  try {
    if (!client) return sampleExplainer
    const explainer = await client.fetch(
      `*[_type == "explainer" && slug.current == $slug][0]`,
      { slug }
    )
    return explainer || sampleExplainer
  } catch {
    return sampleExplainer
  }
}

// Generate metadata for each explainer page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const explainer = await getExplainer(slug)
  
  if (!explainer) {
    return {
      title: 'Not Found | The Brief',
    }
  }

  const title = explainer.title
  const description = explainer.summary
  const url = `https://thebrief.nz/explainer/${slug}`

  return {
    title: `${title} | The Brief`,
    description,
    openGraph: {
      title: `${title} | The Brief`,
      description,
      url,
      type: 'article',
      publishedTime: explainer.publishedAt,
      authors: ['The Brief'],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | The Brief`,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
    },
    alternates: {
      canonical: url,
    },
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ExplainerPage({ params }: PageProps) {
  const { slug } = await params
  const explainer = await getExplainer(slug)

  if (!explainer) {
    notFound()
  }

  // JSON-LD for Article
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: explainer.title,
    description: explainer.summary,
    url: `https://thebrief.nz/explainer/${slug}`,
    datePublished: explainer.publishedAt,
    dateModified: explainer.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'The Brief',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Brief',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thebrief.nz/logo/logo-main.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thebrief.nz/explainer/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <article className="py-12" itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={explainer.title} />
        <meta itemProp="description" content={explainer.summary} />
        <meta itemProp="datePublished" content={explainer.publishedAt} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all explainers
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                {explainer.category}
              </span>
              <span className="text-gray-500 text-sm">
                {explainer.readingTime} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" itemProp="headline">
              {explainer.title}
            </h1>
            <p className="text-xl text-gray-600" itemProp="description">
              {explainer.summary}
            </p>
          </header>

          {/* Key Points */}
          {explainer.keyPoints && explainer.keyPoints.length > 0 && (
            <aside className="bg-indigo-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                The essentials
              </h2>
              <ul className="space-y-3">
                {explainer.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-strong:text-gray-900"
            itemProp="articleBody"
          >
            {Array.isArray(explainer.content) ? (
              <PortableText value={explainer.content} />
            ) : (
              <div className="text-gray-600">
                <p>
                  This is a sample explainer page. Once connected to Sanity CMS,
                  the full content will be displayed here.
                </p>
                <p>
                  The PortableText component will render rich text content from
                  Sanity, including headings, paragraphs, links, and more.
                </p>
                <h2>What Makes This Template Special?</h2>
                <p>
                  This template provides a clean, readable layout optimized for
                  explaining complex topics. It includes:
                </p>
                <ul>
                  <li>Clear typography and spacing</li>
                  <li>Key takeaways section</li>
                  <li>Reading time estimate</li>
                  <li>Category tagging</li>
                  <li>Mobile-responsive design</li>
                </ul>
                <p>
                  Connect your Sanity project to start publishing real explainers.
                </p>
              </div>
            )}
          </div>

          {/* Share */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(explainer.title)}&url=${encodeURIComponent(`https://thebrief.nz/explainer/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://thebrief.nz/explainer/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                LinkedIn
              </a>
              <button 
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Copy Link
              </button>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
