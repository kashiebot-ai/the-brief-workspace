import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

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

// Sample explainers for fallback when Sanity is not connected
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
    keyPoints: [
      'AI refers to computer systems that can perform tasks requiring human intelligence',
      'Machine learning is a subset of AI where systems learn from data',
      'Neural networks are inspired by the human brain structure'
    ]
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
    keyPoints: [
      'Inflation is the rate at which prices increase over time',
      'Central banks use interest rates to manage inflation',
      'High inflation reduces purchasing power'
    ]
  },
  {
    _id: '3',
    title: 'The Electoral College Explained',
    summary: 'How the US presidential election really works. Why the popular vote does not always decide the winner.',
    category: 'politics',
    slug: { current: 'electoral-college-explained' },
    readingTime: 6,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: [
      'The Electoral College has 538 electors',
      'A candidate needs 270 electoral votes to win',
      'Each state gets electors based on congressional representation'
    ]
  },
  {
    _id: '4',
    title: 'Climate Change: The Basics',
    summary: 'The science behind global warming, its impacts, and what we can do about it.',
    category: 'science',
    slug: { current: 'climate-change-basics' },
    readingTime: 7,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: [
      'Greenhouse gases trap heat in the atmosphere',
      'Global temperatures have risen 1.1°C since pre-industrial times',
      'Urgent action is needed to limit warming to 1.5°C'
    ]
  },
  {
    _id: '5',
    title: 'What is Cryptocurrency?',
    summary: 'Bitcoin, blockchain, and the future of money. Making sense of digital currencies.',
    category: 'technology',
    slug: { current: 'what-is-cryptocurrency' },
    readingTime: 5,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: [
      'Cryptocurrency is digital money using cryptography for security',
      'Blockchain technology records all transactions publicly',
      'Bitcoin was the first cryptocurrency, created in 2009'
    ]
  },
  {
    _id: '6',
    title: 'The Filibuster: A Senate Tradition',
    summary: 'Why one senator can hold up legislation. The history and controversy of this procedural tool.',
    category: 'politics',
    slug: { current: 'the-filibuster-explained' },
    readingTime: 4,
    publishedAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    keyPoints: [
      'A filibuster allows unlimited debate to delay legislation',
      'The cloture rule requires 60 votes to end debate',
      'The filibuster has been used for over 150 years'
    ]
  }
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

export async function GET() {
  const explainers = await getExplainers()
  
  // Format for AI consumption - clean, structured data
  const formattedExplainers = explainers.map(explainer => ({
    id: explainer._id,
    title: explainer.title,
    summary: explainer.summary,
    category: explainer.category,
    url: `https://thebrief.nz/explainer/${explainer.slug.current}`,
    slug: explainer.slug.current,
    readingTime: explainer.readingTime,
    publishedAt: explainer.publishedAt,
    lastModified: explainer._updatedAt,
    keyPoints: explainer.keyPoints || []
  }))

  return NextResponse.json(
    {
      site: 'The Brief',
      description: 'NZ Politics Without The Spin',
      totalExplainers: formattedExplainers.length,
      categories: Array.from(new Set(formattedExplainers.map(e => e.category))),
      explainers: formattedExplainers
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  )
}
