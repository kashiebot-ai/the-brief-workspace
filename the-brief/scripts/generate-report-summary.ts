#!/usr/bin/env node
/**
 * Generate AI summary of government reports using local Llama 3.1
 * Usage: node scripts/generate-report-summary.ts <path-to-report-pdf>
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

const SYSTEM_PROMPT = `You are a political journalist writing for The Brief, a New Zealand political news site. 
Your job is to summarize government reports (Royal Commissions, select committee reports, inquiries) into plain English.

Write for a general audience - no jargon, no academic language. Be factual and neutral.

Structure your response exactly like this:

KEY FINDINGS:
- [3-5 bullet points of the most important findings]

TOP RECOMMENDATIONS:
- [3 bullet points of the key recommendations]

WHY THIS MATTERS:
[2-3 sentences explaining why this report is significant for everyday New Zealanders]

Keep it concise. Total output should be 200-300 words.`

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    // Try pdftotext first (poppler-utils)
    const text = execSync(`pdftotext "${pdfPath}" - 2>/dev/null || echo ""`, { encoding: 'utf-8' })
    if (text.trim().length > 100) return text.slice(0, 15000) // Limit to ~15k chars
    
    // Fallback: try to read as text if it's already text
    return readFileSync(pdfPath, 'utf-8').slice(0, 15000)
  } catch {
    throw new Error('Could not extract text from PDF. Install poppler: brew install poppler')
  }
}

async function generateSummary(text: string): Promise<string> {
  const prompt = `${SYSTEM_PROMPT}\n\nREPORT TEXT:\n${text}\n\nSUMMARY:`
  
  try {
    const result = execSync(`echo ${JSON.stringify(prompt)} | ollama run llama3.1:8b`, {
      encoding: 'utf-8',
      timeout: 120000, // 2 minutes max
      maxBuffer: 1024 * 1024 // 1MB output buffer
    })
    return result.trim()
  } catch (error) {
    throw new Error(`AI generation failed: ${error}`)
  }
}

async function main() {
  const pdfPath = process.argv[2]
  
  if (!pdfPath) {
    console.error('Usage: node scripts/generate-report-summary.ts <path-to-report-pdf>')
    process.exit(1)
  }
  
  console.log('📄 Extracting text from PDF...')
  const text = await extractTextFromPDF(pdfPath)
  
  if (text.length < 100) {
    console.error('❌ Could not extract meaningful text from PDF')
    process.exit(1)
  }
  
  console.log(`✅ Extracted ${text.length} characters`)
  console.log('🤖 Generating summary with Llama 3.1...')
  console.log('   (This may take 30-60 seconds...)\n')
  
  const summary = await generateSummary(text)
  
  console.log('=== GENERATED SUMMARY ===\n')
  console.log(summary)
  console.log('\n=========================')
  console.log('\n⚠️  Review this summary for accuracy before publishing!')
}

main().catch(error => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
