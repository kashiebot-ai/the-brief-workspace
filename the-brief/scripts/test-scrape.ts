/**
 * Quick test of Parliament.nz scraping - extracts just 5 bills
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testScrape() {
  console.log('🧪 Testing Parliament.nz scraper (5 bills only)\n');
  
  let targetId: string;
  
  try {
    // Start browser
    console.log('🚀 Starting browser...');
    runCommand('npx openclaw browser start --profile=openclaw');
    await sleep(2000);
    
    // Open bills page
    const result = runCommand(
      'npx openclaw browser open --profile=openclaw  "https://www.parliament.nz/en/pb/bills-and-laws/bills-proposed-laws/"'
    );
    targetId = result.match(/"targetId":\s*"([^"]+)"/)?.[1]!;
    console.log(`✅ Browser started\n`);
    await sleep(3000);
    
    // Get snapshot
    console.log('📸 Getting page snapshot...');
    const snapshotResult = runCommand(
      `npx openclaw browser snapshot --profile=openclaw --targetId=${targetId}`
    );
    
    // Extract JSON
    const jsonMatch = snapshotResult.match(/<<<EXTERNAL_UNTRUSTED_CONTENT[^>]*>>>([\s\S]*?)<<<END_EXTERNAL_UNTRUSTED_CONTENT/);
    if (!jsonMatch) {
      throw new Error('Could not parse snapshot');
    }
    
    const snapshot = JSON.parse(jsonMatch[1]);
    console.log('✅ Got snapshot\n');
    
    // Find and extract first 5 bills from table
    const bills: any[] = [];
    
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
    
    const rows = findRows(snapshot).slice(1, 6); // Skip header, take 5
    
    for (const row of rows) {
      const cells = row.cells || [];
      if (cells.length < 5) continue;
      
      // Find link in first cell
      const findLink = (node: any): any => {
        if (node.link) return node;
        if (node.children) {
          for (const child of node.children) {
            const result = findLink(child);
            if (result) return result;
          }
        }
        return null;
      };
      
      const linkNode = findLink(cells[0]);
      
      bills.push({
        title: linkNode?.text || cells[0]?.text || '',
        billNumber: cells[1]?.text?.trim() || '',
        stage: cells[2]?.text?.trim() || '',
        committee: cells[3]?.text?.trim() || null,
        lastActivity: cells[4]?.text?.trim() || '',
        detailUrl: linkNode?.link?.url || ''
      });
    }
    
    console.log(`✅ Found ${bills.length} bills\n`);
    console.log('📋 Bill List:');
    bills.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.title} (${b.billNumber}) - Stage: ${b.stage}`);
    });
    
    // Scrape first bill detail
    console.log('\n🔍 Scraping first bill detail...');
    const firstBill = bills[0];
    
    runCommand(
      `npx openclaw browser open --profile=openclaw ${targetId} "${firstBill.detailUrl}"`
    );
    await sleep(2500);
    
    const detailSnapshotResult = runCommand(
      `npx openclaw browser snapshot --profile=openclaw --targetId=${targetId}`
    );
    
    const detailJsonMatch = detailSnapshotResult.match(/<<<EXTERNAL_UNTRUSTED_CONTENT[^>]*>>>([\s\S]*?)<<<END_EXTERNAL_UNTRUSTED_CONTENT/);
    const detailSnapshot = JSON.parse(detailJsonMatch![1]);
    
    // Find heading
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
    
    const heading = findHeading(detailSnapshot);
    console.log(`  Full Title: ${heading?.text || firstBill.title}`);
    
    // Find MP in charge from table
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
    
    const table = findTable(detailSnapshot);
    let mpInCharge = '';
    if (table?.table?.rows) {
      for (const row of table.table.rows) {
        const header = row.cells?.[0]?.text || '';
        const value = row.cells?.[1]?.text || '';
        if (header.includes('Member') && header.includes('charge')) {
          mpInCharge = value;
        }
      }
    }
    console.log(`  MP in Charge: ${mpInCharge || 'Not found'}`);
    
    // Save test results
    const output = {
      testRun: new Date().toISOString(),
      billsFound: bills.length,
      bills,
      firstBillDetail: {
        fullTitle: heading?.text || firstBill.title,
        mpInCharge
      }
    };
    
    writeFileSync('data/test-scrape-results.json', JSON.stringify(output, null, 2));
    console.log('\n✅ Test complete! Results saved to data/test-scrape-results.json');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Stop browser
    try {
      runCommand('npx openclaw browser stop --profile=openclaw');
    } catch (e) {
      // Ignore
    }
  }
}

testScrape();
