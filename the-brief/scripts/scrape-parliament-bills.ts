/**
 * Parliament.nz Bill Scraper
 * Scrapes bill data from Parliament.nz and saves to JSON
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ScrapedBill {
  id: string;
  title: string;
  shortTitle: string;
  billNumber: string;
  billType: string;
  description: string;
  mpInCharge: string;
  committee: string;
  parliament: string;
  currentStage: string;
  stages: Array<{
    name: string;
    date: string | null;
    completed: boolean;
  }>;
  introducedDate: string | null;
  firstReadingDate: string | null;
  selectCommitteeDate: string | null;
  submissionDeadline: string | null;
  submissionsOpen: boolean;
  daysRemaining: number | null;
  parliamentUrl: string;
  legislationUrl: string | null;
  submissionUrl: string | null;
  lastActivity: string;
  scrapedAt: string;
}

interface BillListItem {
  title: string;
  billNumber: string;
  stage: string;
  committee: string | null;
  lastActivity: string;
  detailUrl: string;
  billType: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const OUTPUT_FILE = join(DATA_DIR, 'bills-scraped.json');

// Helper to run browser commands
function runCommand(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
  } catch (error: any) {
    console.error('Command failed:', error.stderr || error.message);
    throw error;
  }
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start browser and get target ID
async function startBrowser(): Promise<string> {
  console.log('🚀 Starting browser...');
  
  // Start browser
  runCommand('npx openclaw browser start --profile=openclaw');
  await sleep(2000);
  
  // Open the bills page
  const result = runCommand(
    'npx openclaw browser open --profile=openclaw  "https://www.parliament.nz/en/pb/bills-and-laws/bills-proposed-laws/"'
  );
  
  // Parse targetId from result
  const match = result.match(/"targetId":\s*"([^"]+)"/);
  if (!match) {
    throw new Error('Could not get target ID from browser');
  }
  
  await sleep(3000);
  return match[1];
}

// Stop browser
function stopBrowser() {
  console.log('🛑 Stopping browser...');
  try {
    runCommand('npx openclaw browser stop --profile=openclaw');
  } catch (e) {
    // Ignore errors on stop
  }
}

// Get page snapshot
function getSnapshot(targetId: string): any {
  const result = runCommand(
    `npx openclaw browser snapshot --profile=openclaw --targetId=${targetId}`
  );
  
  // Extract JSON from the result (it has security wrapper)
  const jsonMatch = result.match(/<<<EXTERNAL_UNTRUSTED_CONTENT[^>]*>>>([\s\S]*?)<<<END_EXTERNAL_UNTRUSTED_CONTENT/);
  if (!jsonMatch) {
    throw new Error('Could not parse snapshot');
  }
  
  return JSON.parse(jsonMatch[1]);
}

// Click on element
function clickElement(targetId: string, ref: string) {
  runCommand(
    `npx openclaw browser act --profile=openclaw --targetId=${targetId} --request='{"kind":"click","ref":"${ref}"}'`
  );
}

// Extract bill list from current page
function extractBillListFromSnapshot(snapshot: any): BillListItem[] {
  const bills: BillListItem[] = [];
  
  // Find all rows in the table
  const findRows = (node: any, rows: any[] = []): any[] => {
    if (node.row && node.cells && node.cells.length >= 5) {
      rows.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        findRows(child, rows);
      }
    }
    return rows;
  };
  
  const rows = findRows(snapshot);
  // Skip header row (first row)
  const dataRows = rows.slice(1);
  
  for (const row of dataRows) {
    try {
      const cells = row.cells || [];
      if (cells.length < 5) continue;
      
      // Extract bill name and link from first cell
      const nameCell = cells[0];
      let title = '';
      let detailUrl = '';
      let billType = '';
      
      // Look for link in the cell
      const findLink = (node: any): { text: string; url: string } | null => {
        if (node.link) {
          return { text: node.text || node.link.text || '', url: node.link.url || '' };
        }
        if (node.children) {
          for (const child of node.children) {
            const result = findLink(child);
            if (result) return result;
          }
        }
        return null;
      };
      
      const linkInfo = findLink(nameCell);
      if (linkInfo) {
        title = linkInfo.text;
        detailUrl = linkInfo.url;
      }
      
      // Look for bill type in generic text
      const findBillType = (node: any): string => {
        if (node.text) {
          const text = node.text.trim();
          if (['Government Bill', "Member's Bill", 'Private Bill', 'Local Bill'].includes(text)) {
            return text;
          }
        }
        if (node.children) {
          for (const child of node.children) {
            const result = findBillType(child);
            if (result) return result;
          }
        }
        return '';
      };
      
      billType = findBillType(nameCell);
      
      // Extract other fields
      const billNumber = cells[1]?.text?.trim() || '';
      const stage = cells[2]?.text?.trim() || '';
      const committee = cells[3]?.text?.trim() || null;
      const lastActivity = cells[4]?.text?.trim() || '';
      
      if (title && billNumber) {
        bills.push({
          title,
          billNumber,
          stage,
          committee,
          lastActivity,
          detailUrl,
          billType
        });
      }
    } catch (e) {
      console.log('⚠️  Error parsing row:', e);
    }
  }
  
  return bills;
}

// Get next page button ref
function getNextPageRef(snapshot: any): string | null {
  const findButton = (node: any): any => {
    if (node.button && node.text === 'Next') return node;
    if (node.children) {
      for (const child of node.children) {
        const result = findButton(child);
        if (result) return result;
      }
    }
    return null;
  };
  
  const nextBtn = findButton(snapshot);
  return nextBtn?.ref || null;
}

// Get all bill list pages
async function getAllBillListItems(targetId: string): Promise<BillListItem[]> {
  const allBills: BillListItem[] = [];
  const seenUrls = new Set<string>();
  let pageNum = 1;
  
  while (true) {
    console.log(`📄 Fetching page ${pageNum}...`);
    
    const snapshot = getSnapshot(targetId);
    const bills = extractBillListFromSnapshot(snapshot);
    
    console.log(`  Found ${bills.length} bills on this page`);
    
    // Check if we've seen these bills before (detect last page)
    const newBills = bills.filter(b => !seenUrls.has(b.detailUrl));
    if (newBills.length === 0) {
      console.log('✅ No new bills, stopping pagination');
      break;
    }
    
    for (const bill of newBills) {
      seenUrls.add(bill.detailUrl);
      allBills.push(bill);
    }
    
    // Check for next page
    const nextRef = getNextPageRef(snapshot);
    if (!nextRef) {
      console.log('✅ No next page button');
      break;
    }
    
    // Navigate to next page
    console.log('  Going to next page...');
    clickElement(targetId, nextRef);
    await sleep(2000);
    
    pageNum++;
    
    // Safety limit
    if (pageNum > 20) {
      console.log('⚠️  Hit page limit, stopping');
      break;
    }
  }
  
  return allBills;
}

// Navigate to bill detail page and extract data
async function scrapeBillDetail(targetId: string, bill: BillListItem): Promise<ScrapedBill | null> {
  try {
    console.log(`🔍 Scraping: ${bill.title.substring(0, 60)}...`);
    
    // Navigate to detail page
    runCommand(
      `npx openclaw browser open --profile=openclaw --targetId=${targetId} "${bill.detailUrl}"`
    );
    await sleep(2500);
    
    const snapshot = getSnapshot(targetId);
    
    // Extract full title from heading
    const findHeading = (node: any): any => {
      if (node.heading && node.level === 1) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findHeading(child);
          if (result) return result;
        }
      }
      return null;
    };
    
    const heading = findHeading(snapshot);
    const fullTitle = heading?.text || bill.title;
    
    // Extract description
    let description = '';
    const findDescription = (node: any): string => {
      if (node.paragraph && node.text) {
        const text = node.text.trim();
        // Look for bill description paragraphs
        if (text.length > 50 && 
            !text.includes('Bills are proposals') && 
            !text.includes('schedule of divided') &&
            !text.includes('progress of legislation') &&
            !text.includes('business before committees') &&
            !text.includes('Historical bills') &&
            !text.includes('Hansard website changes')) {
          return text;
        }
      }
      if (node.children) {
        for (const child of node.children) {
          const result = findDescription(child);
          if (result) return result;
        }
      }
      return '';
    };
    
    description = findDescription(snapshot);
    
    // Extract MP in charge from table
    let mpInCharge = '';
    const findTable = (node: any): any => {
      if (node.table) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findTable(child);
          if (result) return result;
        }
      }
      return null;
    };
    
    const table = findTable(snapshot);
    if (table?.table?.rows) {
      for (const row of table.table.rows) {
        const header = row.cells?.[0]?.text || '';
        const value = row.cells?.[1]?.text || '';
        if (header.includes('Member') && header.includes('charge')) {
          mpInCharge = value;
        }
      }
    }
    
    // Extract stages and dates
    const stages: ScrapedBill['stages'] = [];
    let introducedDate: string | null = null;
    let firstReadingDate: string | null = null;
    let selectCommitteeDate: string | null = null;
    
    // Find the progress list
    const findProgressList = (node: any): any => {
      if (node.list) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findProgressList(child);
          if (result) return result;
        }
      }
      return null;
    };
    
    const progressList = findProgressList(snapshot);
    if (progressList?.list?.items) {
      for (const item of progressList.list.items) {
        const text = item.text || '';
        
        if (text.includes('Bill Introduced')) {
          const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
          introducedDate = dateMatch ? parseDate(dateMatch[1]) : null;
          stages.push({ name: 'Bill Introduced', date: introducedDate, completed: true });
        } else if (text.includes('First Reading')) {
          const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
          firstReadingDate = dateMatch ? parseDate(dateMatch[1]) : null;
          stages.push({ name: 'First Reading', date: firstReadingDate, completed: true });
        } else if (text.includes('Select Committee')) {
          const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
          selectCommitteeDate = dateMatch ? parseDate(dateMatch[1]) : null;
          stages.push({ name: 'Select Committee', date: selectCommitteeDate, completed: true });
        } else if (text.includes('Second Reading') && !text.match(/\d{2}\/\d{2}\/\d{4}/)) {
          stages.push({ name: 'Second Reading', date: null, completed: false });
        }
      }
    }
    
    // Extract submission info
    let submissionDeadline: string | null = null;
    let submissionsOpen = false;
    let daysRemaining: number | null = null;
    let submissionUrl: string | null = null;
    
    const findSubmissionInfo = (node: any): void => {
      if (node.text) {
        // Look for submission deadline text
        const deadlineMatch = node.text.match(/Closing date:\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
        if (deadlineMatch) {
          submissionDeadline = `${deadlineMatch[3]}-${getMonthNum(deadlineMatch[2])}-${deadlineMatch[1].padStart(2, '0')}`;
        }
        
        // Also try other formats
        const altMatch = node.text.match(/Submission due[^:]*:\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);
        if (altMatch && !submissionDeadline) {
          submissionDeadline = `${altMatch[3]}-${getMonthNum(altMatch[2])}-${altMatch[1].padStart(2, '0')}`;
        }
        
        // Check if submissions are open
        if (node.text.includes('Submissions are now being accepted')) {
          submissionsOpen = true;
        }
        
        // Extract days remaining
        const daysMatch = node.text.match(/(\d+)\s+days?\s+left/i);
        if (daysMatch) {
          daysRemaining = parseInt(daysMatch[1]);
        }
      }
      
      if (node.link && node.text?.includes('Make a submission')) {
        submissionUrl = node.link.url;
      }
      
      if (node.children) {
        for (const child of node.children) {
          findSubmissionInfo(child);
        }
      }
    };
    
    findSubmissionInfo(snapshot);
    
    // Extract legislation URL
    let legislationUrl: string | null = null;
    const findLegislationUrl = (node: any): void => {
      if (node.link && (node.text?.includes('Read the bill') || node.text?.includes('Link to NZ Legislation'))) {
        legislationUrl = node.link.url;
      }
      if (node.children) {
        for (const child of node.children) {
          findLegislationUrl(child);
        }
      }
    };
    
    findLegislationUrl(snapshot);
    
    // Generate ID from bill number
    const id = bill.billNumber.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Create short title
    const shortTitle = fullTitle.length > 80 ? fullTitle.substring(0, 77) + '...' : fullTitle;
    
    return {
      id,
      title: fullTitle,
      shortTitle,
      billNumber: bill.billNumber,
      billType: bill.billType || 'Unknown',
      description,
      mpInCharge,
      committee: bill.committee || '',
      parliament: '54',
      currentStage: bill.stage,
      stages,
      introducedDate,
      firstReadingDate,
      selectCommitteeDate,
      submissionDeadline,
      submissionsOpen,
      daysRemaining,
      parliamentUrl: bill.detailUrl,
      legislationUrl,
      submissionUrl,
      lastActivity: bill.lastActivity,
      scrapedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error scraping bill ${bill.title}:`, error);
    return null;
  }
}

// Parse date from DD/MM/YYYY format
function parseDate(dateStr: string): string | null {
  try {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

// Get month number from name
function getMonthNum(monthName: string): string {
  const months: Record<string, string> = {
    'jan': '01', 'january': '01',
    'feb': '02', 'february': '02',
    'mar': '03', 'march': '03',
    'apr': '04', 'april': '04',
    'may': '05',
    'jun': '06', 'june': '06',
    'jul': '07', 'july': '07',
    'aug': '08', 'august': '08',
    'sep': '09', 'sept': '09', 'september': '09',
    'oct': '10', 'october': '10',
    'nov': '11', 'november': '11',
    'dec': '12', 'december': '12'
  };
  return months[monthName.toLowerCase()] || '01';
}

// Main scraping function
async function scrapeBills(): Promise<void> {
  console.log('🏛️  Parliament.nz Bill Scraper');
  console.log('==============================\n');
  
  let targetId: string | null = null;
  
  try {
    // Start browser
    targetId = await startBrowser();
    console.log(`✅ Browser started\n`);
    
    // Get all bill list items
    console.log('📋 Getting bill list...');
    const billListItems = await getAllBillListItems(targetId);
    console.log(`\n✅ Found ${billListItems.length} total bills\n`);
    
    // Scrape details for each bill
    const scrapedBills: ScrapedBill[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < billListItems.length; i++) {
      const bill = billListItems[i];
      
      const scrapedBill = await scrapeBillDetail(targetId, bill);
      
      if (scrapedBill) {
        scrapedBills.push(scrapedBill);
        process.stdout.write(`✅`);
      } else {
        errors.push(bill.title);
        process.stdout.write(`❌`);
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(` ${i + 1}/${billListItems.length}`);
      }
      
      // Rate limiting
      if (i < billListItems.length - 1) {
        await sleep(1500);
      }
    }
    
    console.log('\n');
    
    // Save results
    const output = {
      scrapedAt: new Date().toISOString(),
      totalBills: billListItems.length,
      successfulScrapes: scrapedBills.length,
      failedScrapes: errors.length,
      bills: scrapedBills
    };
    
    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log('\n==============================');
    console.log('📊 Scraping Complete');
    console.log('==============================');
    console.log(`Total bills found: ${billListItems.length}`);
    console.log(`Successfully scraped: ${scrapedBills.length}`);
    console.log(`Failed: ${errors.length}`);
    console.log(`\n💾 Output saved to: ${OUTPUT_FILE}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  Failed bills:');
      errors.forEach(e => console.log(`  - ${e.substring(0, 80)}...`));
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (targetId) {
      stopBrowser();
    }
  }
}

// Run scraper
scrapeBills();
