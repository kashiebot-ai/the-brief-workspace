import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Initialize Sanity client
const client = createClient({
  projectId: '72hng9ka',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Will need this
  useCdn: false,
})

// Read the markdown file
const markdownPath = path.join(process.cwd(), '../projects/the-briefing/content/explainer-how-parliament-works.md')
const markdown = fs.readFileSync(markdownPath, 'utf-8')

// Simple markdown to plain text conversion (for now)
// Removing markdown syntax for Sanity's block content
function markdownToBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  let currentBlock = { _type: 'block', children: [] }
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip frontmatter and metadata
    if (trimmed.startsWith('#') && trimmed.includes('Parliament')) continue
    if (trimmed.startsWith('>')) continue
    if (trimmed.startsWith('---')) continue
    if (trimmed.startsWith('*Draft created:')) continue
    if (trimmed.startsWith('*Last updated:')) continue
    
    // Headers
    if (trimmed.startsWith('## ')) {
      if (currentBlock.children.length > 0) {
        blocks.push(currentBlock)
        currentBlock = { _type: 'block', children: [] }
      }
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmed.replace('## ', '') }]
      })
    }
    // Bullet points
    else if (trimmed.startsWith('- ')) {
      if (currentBlock.children.length > 0) {
        blocks.push(currentBlock)
        currentBlock = { _type: 'block', children: [] }
      }
      blocks.push({
        _type: 'block',
        listItem: 'bullet',
        children: [{ _type: 'span', text: trimmed.replace('- ', '') }]
      })
    }
    // Code blocks / ASCII art (skip for now or handle separately)
    else if (trimmed.startsWith('```') || trimmed.includes('┌')) {
      // Skip ASCII diagrams for now
      continue
    }
    // Regular text
    else if (trimmed) {
      currentBlock.children.push({
        _type: 'span',
        text: trimmed + ' '
      })
    }
    // Empty line - close current block
    else if (!trimmed && currentBlock.children.length > 0) {
      blocks.push(currentBlock)
      currentBlock = { _type: 'block', children: [] }
    }
  }
  
  if (currentBlock.children.length > 0) {
    blocks.push(currentBlock)
  }
  
  return blocks
}

// Extract content after the frontmatter
const contentMatch = markdown.match(/## Why This Matters[\s\S]*/)
const contentText = contentMatch ? contentMatch[0] : markdown

const blocks = markdownToBlocks(contentText)

// Create the explainer document
const explainer = {
  _type: 'explainer',
  title: 'How Parliament Actually Works — The Complete Beginner\'s Guide',
  slug: { _type: 'slug', current: 'how-parliament-works' },
  category: 'politics',
  summary: 'Every law affecting your life went through this process. Understanding Parliament gives you power to participate in democracy.',
  content: blocks,
  keyPoints: [
    'Parliament = 120 MPs, Government needs 61+ seats to govern',
    'Bills become laws through 8 steps including Select Committees',
    'Select Committees accept public submissions — your main point of power',
    'Question Time is political theatre but sometimes revealing'
  ],
  readingTime: 8,
  publishedAt: new Date().toISOString(),
  featured: true
}

// Create the document
client.create(explainer)
  .then(result => {
    console.log('✅ Explainer created:', result._id)
    console.log('View at: https://the-brief.sanity.studio/desk/explainer;')
  })
  .catch(err => {
    console.error('❌ Error:', err.message)
    if (err.message.includes('Insufficient permissions')) {
      console.log('\nYou need to create a Sanity API token with write permissions:')
      console.log('1. Go to https://the-brief.sanity.studio/')
      console.log('2. Click your avatar → Manage Project → API → Tokens')
      console.log('3. Add token with "Editor" permissions')
      console.log('4. Set SANITY_API_TOKEN environment variable')
    }
  })
