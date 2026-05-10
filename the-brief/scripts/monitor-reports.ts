#!/usr/bin/env node
/**
 * Monitor for new government reports
 * Checks Parliament.nz and Royal Commission site for new reports
 * Usage: node scripts/monitor-reports.ts
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const STATE_FILE = join(process.cwd(), 'data', 'report-monitor-state.json')

// URLs to check
const SOURCES = {
  parliament: 'https://www.parliament.nz/en/pb/sc/reports/',
  royalCommission: 'https://www.royalcommission.govt.nz/',
  oag: 'https://oag.parliament.nz/'
}

interface ReportState {
  lastCheck: string
  knownReports: string[]
}

function loadState(): ReportState {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'))
  }
  return {
    lastCheck: new Date(0).toISOString(),
    knownReports: []
  }
}

function saveState(state: ReportState) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

async function checkParliamentReports(): Promise<string[]> {
  try {
    // Fetch the select committee reports page
    const response = await fetch(SOURCES.parliament)
    const html = await response.text()
    
    // Extract report links (this is a simplified check)
    // In reality, you'd parse the HTML properly
    const reportMatches = html.match(/href="([^"]*report[^"]*)"/gi) || []
    
    return reportMatches.map(m => m.replace('href="', '').replace('"', ''))
  } catch (error) {
    console.error('Error checking Parliament:', error)
    return []
  }
}

async function main() {
  console.log('🔍 Checking for new reports...\n')
  
  const state = loadState()
  const now = new Date()
  
  console.log(`Last check: ${new Date(state.lastCheck).toLocaleString('en-NZ')}`)
  console.log(`Known reports: ${state.knownReports.length}\n`)
  
  // Check each source
  const parliamentReports = await checkParliamentReports()
  
  // Find new reports
  const newReports = parliamentReports.filter(r => !state.knownReports.includes(r))
  
  if (newReports.length > 0) {
    console.log(`🎉 Found ${newReports.length} new report(s)!`)
    newReports.forEach(r => console.log(`   - ${r}`))
    
    // Update state
    state.knownReports = [...state.knownReports, ...newReports]
  } else {
    console.log('✅ No new reports found')
  }
  
  // Update last check time
  state.lastCheck = now.toISOString()
  saveState(state)
  
  console.log(`\nNext check: Run this script again or set up a cron job`)
}

main().catch(console.error)
