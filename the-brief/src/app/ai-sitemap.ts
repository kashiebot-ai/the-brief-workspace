import { client } from '@/lib/sanity'

const BASE_URL = 'https://thebrief.nz'

interface Explainer {
  _id: string
  title: string
  summary: string
  category: string
  slug: { current: string }
  readingTime: number
  publishedAt: string
  _updatedAt: string
  keyPoints?: string[]
}

// Sample explainers for fallback
const sampleExplainers = [
  {
    _id: '1',
    title: 'What is Artificial Intelligence?',
    summary: 'A beginner-friendly guide to understanding AI, machine learning, and how these technologies are reshaping our world.',
    category: 'technology',
    slug: { current: 'what-is-artificial-intelligence' },
    readingTime: 5,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: ['AI refers to computer systems that can perform tasks requiring human intelligence', 'Machine learning is a subset of AI where systems learn from data']
  },
  {
    _id: '2',
    title: 'Understanding Inflation',
    summary: 'Why prices are rising and what it means for your wallet. A simple breakdown of economic forces at play.',
    category: 'business',
    slug: { current: 'understanding-inflation' },
    readingTime: 4,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: ['Inflation is the rate at which prices increase over time', 'Central banks use interest rates to manage inflation']
  },
]

async function getExplainers(): Promise<Explainer[]> {
  try {
    if (!client) return sampleExplainers
    
    const explainers = await client.fetch(`
      *[_type == "explainer"] | order(publishedAt desc) {
        _id,
        title,
        summary,
        category,
        slug,
        readingTime,
        publishedAt,
        _updatedAt,
        keyPoints
      }
    `)
    
    return explainers?.length > 0 ? explainers : sampleExplainers
  } catch {
    return sampleExplainers
  }
}

/**
 * AI-Optimized Sitemap
 * 
 * This sitemap is specifically designed for AI crawlers and LLMs.
 * It provides structured data about all content on the site with
 * rich metadata for better AI understanding.
 */
export async function generateAISitemap() {
  const explainers = await getExplainers()
  
  const staticPages = [
    {
      url: BASE_URL,
      type: 'homepage',
      priority: 1.0,
      description: 'The Brief - New Zealand politics without the spin. Clear explainers on bills, budgets, and elections.',
      keywords: ['New Zealand politics', 'NZ politics', 'political explainers', 'MMP', 'NZ elections'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/explainer`,
      type: 'content_hub',
      priority: 0.95,
      description: 'Browse all political explainers by category. Politics, technology, business, science, health, and culture.',
      keywords: ['explainers', 'political explainers', 'NZ news'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/quiz`,
      type: 'interactive_tool',
      priority: 0.9,
      description: 'VoteFinder - 25-question quiz to match your values with NZ political parties for the 2026 election.',
      keywords: ['NZ election 2026', 'political quiz', 'vote finder', 'party match'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/mp-lookup`,
      type: 'interactive_tool',
      priority: 0.9,
      description: 'Find your Member of Parliament by address or postcode. Electorate information and MP contact details.',
      keywords: ['MP lookup', 'find my MP', 'New Zealand MP', 'electorate'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/about`,
      type: 'informational',
      priority: 0.7,
      description: 'About The Brief - independent, reader-funded political journalism for New Zealand.',
      keywords: ['about The Brief', 'NZ political news', 'independent journalism'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/methodology`,
      type: 'informational',
      priority: 0.7,
      description: 'Our methodology - how we research, write, and fact-check every explainer.',
      keywords: ['fact checking', 'editorial process', 'sources', 'methodology'],
      lastUpdated: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/contact`,
      type: 'contact',
      priority: 0.5,
      description: 'Contact The Brief - feedback, corrections, and topic suggestions.',
      keywords: ['contact', 'feedback', 'corrections'],
      lastUpdated: new Date().toISOString(),
    },
  ]

  const explainerPages = explainers.map((explainer) => ({
    url: `${BASE_URL}/explainer/${explainer.slug.current}`,
    type: 'article',
    priority: 0.85,
    title: explainer.title,
    description: explainer.summary,
    category: explainer.category,
    keywords: [explainer.category, 'NZ politics', 'explainer'],
    readingTime: explainer.readingTime,
    keyPoints: explainer.keyPoints || [],
    publishedAt: explainer.publishedAt,
    lastUpdated: explainer._updatedAt,
  }))

  const sitemap = {
    site: {
      name: 'The Brief',
      url: BASE_URL,
      description: 'New Zealand politics without the spin',
      language: 'en-NZ',
      region: 'New Zealand',
      contentTypes: ['political explainers', 'interactive quizzes', 'MP lookup tool'],
      updateFrequency: 'daily',
    },
    pages: [...staticPages, ...explainerPages],
    apiEndpoints: [
      {
        url: `${BASE_URL}/api/content/explainers`,
        description: 'JSON API returning all explainers for AI consumption',
        format: 'application/json',
      },
      {
        url: `${BASE_URL}/api/content/parties`,
        description: 'JSON API returning NZ political party positions',
        format: 'application/json',
      },
      {
        url: `${BASE_URL}/sitemap.xml`,
        description: 'Standard XML sitemap',
        format: 'application/xml',
      },
      {
        url: `${BASE_URL}/llms.txt`,
        description: 'LLM discovery file with site overview',
        format: 'text/plain',
      },
    ],
    structuredData: {
      schemasImplemented: [
        'WebSite',
        'Organization',
        'Article',
        'BreadcrumbList',
        'FAQPage',
        'SearchAction',
      ],
    },
  }

  return sitemap
}

export default generateAISitemap
