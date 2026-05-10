#!/usr/bin/env ts-node
/**
 * Content Export Script
 * 
 * Generates /public/content.txt - a plain text export of all explainers
 * for AI consumption and text-first design.
 */

import { client } from '../src/lib/sanity'
import * as fs from 'fs'
import * as path from 'path'

interface Explainer {
  _id: string
  title: string
  summary: string
  category: string
  slug: { current: string }
  readingTime: number
  publishedAt: string
  content?: any[]
  keyPoints?: string[]
}

// Sample explainers for when Sanity is not connected
const sampleExplainers: Explainer[] = [
  {
    _id: '1',
    title: 'What is Artificial Intelligence?',
    summary: 'A beginner-friendly guide to understanding AI, machine learning, and how these technologies are reshaping our world.',
    category: 'technology',
    slug: { current: 'what-is-artificial-intelligence' },
    readingTime: 5,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'AI refers to computer systems that can perform tasks requiring human intelligence',
      'Machine learning is a subset of AI where systems learn from data',
      'Neural networks are inspired by the human brain structure'
    ],
    content: []
  },
  {
    _id: '2',
    title: 'Understanding Inflation',
    summary: 'Why prices are rising and what it means for your wallet. A simple breakdown of economic forces at play.',
    category: 'business',
    slug: { current: 'understanding-inflation' },
    readingTime: 4,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'Inflation is the rate at which prices increase over time',
      'Central banks use interest rates to manage inflation',
      'High inflation reduces purchasing power'
    ],
    content: []
  },
  {
    _id: '3',
    title: 'The Electoral College Explained',
    summary: 'How the US presidential election really works. Why the popular vote does not always decide the winner.',
    category: 'politics',
    slug: { current: 'electoral-college-explained' },
    readingTime: 6,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'The Electoral College has 538 electors',
      'A candidate needs 270 electoral votes to win',
      'Each state gets electors based on congressional representation'
    ],
    content: []
  },
  {
    _id: '4',
    title: 'Climate Change: The Basics',
    summary: 'The science behind global warming, its impacts, and what we can do about it.',
    category: 'science',
    slug: { current: 'climate-change-basics' },
    readingTime: 7,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'Greenhouse gases trap heat in the atmosphere',
      'Global temperatures have risen 1.1°C since pre-industrial times',
      'Urgent action is needed to limit warming to 1.5°C'
    ],
    content: []
  },
  {
    _id: '5',
    title: 'What is Cryptocurrency?',
    summary: 'Bitcoin, blockchain, and the future of money. Making sense of digital currencies.',
    category: 'technology',
    slug: { current: 'what-is-cryptocurrency' },
    readingTime: 5,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'Cryptocurrency is digital money using cryptography for security',
      'Blockchain technology records all transactions publicly',
      'Bitcoin was the first cryptocurrency, created in 2009'
    ],
    content: []
  },
  {
    _id: '6',
    title: 'The Filibuster: A Senate Tradition',
    summary: 'Why one senator can hold up legislation. The history and controversy of this procedural tool.',
    category: 'politics',
    slug: { current: 'the-filibuster-explained' },
    readingTime: 4,
    publishedAt: new Date().toISOString(),
    keyPoints: [
      'A filibuster allows unlimited debate to delay legislation',
      'The cloture rule requires 60 votes to end debate',
      'The filibuster has been used for over 150 years'
    ],
    content: []
  }
]

async function getExplainers(): Promise<Explainer[]> {
  try {
    if (!client) {
      console.log('No Sanity client available, using sample data')
      return sampleExplainers
    }
    
    const explainers = await client.fetch(`
      *[_type == "explainer"] | order(publishedAt desc) {
        _id,
        title,
        summary,
        category,
        slug,
        readingTime,
        publishedAt,
        content,
        keyPoints
      }
    `)
    
    return explainers?.length > 0 ? explainers : sampleExplainers
  } catch (error) {
    console.log('Error fetching from Sanity, using sample data:', error)
    return sampleExplainers
  }
}

function generatePlainText(explainers: Explainer[]): string {
  const header = `================================================================================
THE BRIEF - NEW ZEALAND POLITICS WITHOUT THE SPIN
================================================================================

Plain Text Content Export for AI/LLM Consumption
Generated: ${new Date().toISOString()}
Website: https://thebrief.nz
Language: English (New Zealand)
Region: New Zealand

================================================================================
ABOUT THIS SITE
================================================================================

The Brief is an independent, reader-funded political news source for New 
Zealand. We provide clear explainers on bills, budgets, and elections — 
no jargon, no bias, just facts.

Our mission is to help New Zealanders understand what Parliament is actually 
doing so they can vote with confidence and hold power to account.

Key Features:
- Plain English explainers on political topics
- VoteFinder quiz to match your values with political parties
- MP lookup tool to find your representative
- Non-partisan, independent journalism

================================================================================
TABLE OF CONTENTS
================================================================================

Total Explainers: ${explainers.length}

${explainers.map((e, i) => `${i + 1}. ${e.title} (${e.category})`).join('\n')}

================================================================================
FULL CONTENT
================================================================================

`

  const content = explainers.map((explainer) => {
    const keyPoints = explainer.keyPoints?.length 
      ? '\nKEY POINTS:\n' + explainer.keyPoints.map(kp => `• ${kp}`).join('\n')
      : ''

    return `
--------------------------------------------------------------------------------
${explainer.title.toUpperCase()}
--------------------------------------------------------------------------------

Category: ${explainer.category}
Reading Time: ${explainer.readingTime} minutes
URL: https://thebrief.nz/explainer/${explainer.slug.current}
Published: ${explainer.publishedAt}

SUMMARY:
${explainer.summary}
${keyPoints}

--------------------------------------------------------------------------------
`
  }).join('\n\n')

  const footer = `
================================================================================
END OF CONTENT
================================================================================

Additional Resources:
- Homepage: https://thebrief.nz
- All Explainers: https://thebrief.nz/explainer
- VoteFinder Quiz: https://thebrief.nz/quiz
- MP Lookup: https://thebrief.nz/mp-lookup
- About Us: https://thebrief.nz/about
- Methodology: https://thebrief.nz/methodology
- Contact: https://thebrief.nz/contact

API Endpoints:
- Explainers API: https://thebrief.nz/api/content/explainers
- Parties API: https://thebrief.nz/api/content/parties
- Sitemap: https://thebrief.nz/sitemap.xml
- LLM Discovery: https://thebrief.nz/llms.txt

Contact:
- General: https://thebrief.nz/contact
- Corrections: corrections@thebrief.nz

Last Updated: ${new Date().toISOString()}
================================================================================
`

  return header + content + footer
}

async function main() {
  console.log('Generating content.txt...')
  
  const explainers = await getExplainers()
  console.log(`Found ${explainers.length} explainers`)
  
  const plainText = generatePlainText(explainers)
  
  const outputPath = path.join(process.cwd(), 'public', 'content.txt')
  
  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  fs.writeFileSync(outputPath, plainText, 'utf-8')
  
  console.log(`✅ content.txt generated at ${outputPath}`)
  console.log(`📄 File size: ${(plainText.length / 1024).toFixed(2)} KB`)
}

main().catch(console.error)
