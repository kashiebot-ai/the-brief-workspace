/**
 * Sync Scraped Bills to Sanity CMS
 * Reads bills from data/bills-scraped.json and syncs to Sanity
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

const DATA_FILE = join(process.cwd(), 'data', 'bills-scraped.json');

// Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Actual data format from bills-scraped.json
interface ScrapedBill {
  title: string;
  url: string;
  billNumber: string;
  stage: string;
  committee: string;
  lastActivity: string;
}

interface SyncResult {
  created: string[];
  updated: string[];
  skipped: string[];
  failed: { billNumber: string; error: string }[];
}

// Map committee names to schema values
function mapCommittee(committeeName: string): string {
  const mappings: Record<string, string> = {
    'Environment': 'environment',
    'Health': 'health',
    'Transport and Infrastructure': 'transport',
    'Social Services and Community': 'social_services',
    'Justice': 'justice',
    'Education and Workforce': 'education',
    'Economic Development, Science and Innovation': 'economic_development',
    'Primary Production': 'primary_production',
    'Governance and Administration': 'governance',
    'Māori Affairs': 'māori_affairs',
    'Commerce': 'economic_development',
    'Finance and Expenditure': 'economic_development',
    'Foreign Affairs, Defence and Trade': 'other',
    'Internal Affairs and Local Government': 'other',
    'Local Government and Environment': 'environment',
  };
  
  // Try exact match first
  if (mappings[committeeName]) {
    return mappings[committeeName];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(mappings)) {
    if (committeeName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return 'other';
}

// Map category based on committee or bill title keywords
function mapCategory(bill: ScrapedBill): string {
  const titleLower = bill.title.toLowerCase();
  const committee = bill.committee.toLowerCase();
  
  // Check title keywords first
  if (titleLower.includes('health') || titleLower.includes('hospital') || titleLower.includes('medical')) return 'health';
  if (titleLower.includes('environment') || titleLower.includes('climate') || titleLower.includes('conservation')) return 'environment';
  if (titleLower.includes('transport') || titleLower.includes('road') || titleLower.includes('rail')) return 'transport';
  if (titleLower.includes('housing') || titleLower.includes('home')) return 'housing';
  if (titleLower.includes('education') || titleLower.includes('school') || titleLower.includes('university')) return 'education';
  if (titleLower.includes('justice') || titleLower.includes('court') || titleLower.includes('crime')) return 'justice';
  if (titleLower.includes('economy') || titleLower.includes('tax') || titleLower.includes('financial')) return 'economy';
  if (titleLower.includes('technology') || titleLower.includes('digital') || titleLower.includes('cyber')) return 'technology';
  if (titleLower.includes('social') || titleLower.includes('welfare') || titleLower.includes('benefit')) return 'social';
  
  // Fall back to committee
  const committeeCategory = mapCommittee(bill.committee);
  const categoryMap: Record<string, string> = {
    'environment': 'environment',
    'health': 'health',
    'transport': 'transport',
    'social_services': 'social',
    'justice': 'justice',
    'education': 'education',
    'economic_development': 'economy',
    'primary_production': 'other',
    'governance': 'other',
    'māori_affairs': 'other',
    'other': 'other',
  };
  
  return categoryMap[committeeCategory] || 'other';
}

// Determine status based on stage
function determineStatus(bill: ScrapedBill): string {
  // SC = Select Committee (submissions usually open)
  // 1R = First Reading
  // 2R = Second Reading
  // 3R = Third Reading
  // RA = Royal Assent
  
  if (bill.stage === 'RA') return 'passed';
  if (bill.stage === 'SC') return 'open'; // Assume open for submissions when in select committee
  if (bill.stage === '1R' || bill.stage === '2R' || bill.stage === '3R') return 'closed';
  
  return 'closed';
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 96);
}

// Create short title
function createShortTitle(title: string): string {
  if (title.length <= 80) return title;
  return title.substring(0, 77) + '...';
}

// Check if bill exists in Sanity
async function getExistingBill(billNumber: string): Promise<{ _id: string; _rev: string } | null> {
  const query = `*[_type == "bill" && billNumber == $billNumber][0] { _id, _rev }`;
  try {
    const result = await client.fetch(query, { billNumber });
    return result || null;
  } catch (error) {
    console.error(`Error checking existing bill ${billNumber}:`, error);
    return null;
  }
}

// Create Sanity document from scraped bill
function createBillDocument(bill: ScrapedBill, existingId?: string): any {
  const now = new Date().toISOString();
  const status = determineStatus(bill);
  const category = mapCategory(bill);
  const committee = mapCommittee(bill.committee);
  const shortTitle = createShortTitle(bill.title);
  const slug = generateSlug(shortTitle);
  
  // Build summary as PortableText
  const summary = [
    {
      _type: 'block',
      _key: 'summary-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span-1',
          text: `This bill (${bill.billNumber}) is currently at the ${bill.stage} stage. Last activity: ${bill.lastActivity}.`,
        },
      ],
    },
  ];

  const doc: any = {
    _type: 'bill',
    title: bill.title,
    shortTitle,
    slug: {
      _type: 'slug',
      current: slug,
    },
    description: `Bill ${bill.billNumber} - ${bill.title}`,
    summary,
    keyPoints: [],
    billNumber: bill.billNumber,
    category,
    committee,
    status,
    parliamentUrl: bill.url,
    legislationUrl: null,
    submissionUrl: '',
    publishedAt: now,
    lastUpdated: now,
    featured: false,
  };

  if (existingId) {
    doc._id = existingId;
  }

  return doc;
}

// Sync a single bill
async function syncBill(bill: ScrapedBill, result: SyncResult): Promise<void> {
  try {
    const shortTitle = createShortTitle(bill.title);
    console.log(`  Processing: ${bill.billNumber} - ${shortTitle.substring(0, 50)}...`);
    
    // Check if bill already exists
    const existing = await getExistingBill(bill.billNumber);
    
    if (existing) {
      // Update existing bill
      const doc = createBillDocument(bill, existing._id);
      doc._rev = existing._rev;
      
      await client.createOrReplace(doc);
      result.updated.push(bill.billNumber);
      console.log(`    ✅ Updated`);
    } else {
      // Create new bill
      const doc = createBillDocument(bill);
      
      await client.create(doc);
      result.created.push(bill.billNumber);
      console.log(`    ✅ Created`);
    }
  } catch (error: any) {
    console.error(`    ❌ Failed:`, error.message);
    result.failed.push({ billNumber: bill.billNumber, error: error.message });
  }
}

// Main sync function
async function syncBills(): Promise<void> {
  console.log('🔄 Sanity Bill Sync');
  console.log('===================\n');
  
  // Check for required env vars
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
    process.exit(1);
  }
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN');
    process.exit(1);
  }
  
  // Read scraped data
  let scrapedData: { bills: ScrapedBill[]; scrapedAt: string; totalBills: number };
  try {
    const fileContent = readFileSync(DATA_FILE, 'utf-8');
    scrapedData = JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Could not read ${DATA_FILE}:`, error);
    process.exit(1);
  }
  
  const { bills } = scrapedData;
  console.log(`📊 Found ${bills.length} bills to sync\n`);
  
  // Track results
  const result: SyncResult = {
    created: [],
    updated: [],
    skipped: [],
    failed: [],
  };
  
  // Process each bill
  for (let i = 0; i < bills.length; i++) {
    await syncBill(bills[i], result);
    
    // Small delay to avoid rate limits
    if (i < bills.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Print summary
  console.log('\n===================');
  console.log('📊 Sync Complete');
  console.log('===================');
  console.log(`Created: ${result.created.length}`);
  console.log(`Updated: ${result.updated.length}`);
  console.log(`Failed: ${result.failed.length}`);
  
  if (result.failed.length > 0) {
    console.log('\n❌ Failed bills:');
    result.failed.forEach(f => console.log(`  - ${f.billNumber}: ${f.error}`));
  }
  
  console.log('\n✅ Done!');
}

// Run sync
syncBills().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
