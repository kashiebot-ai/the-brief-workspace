/**
 * Server-only bills data utilities
 * These functions use Node.js APIs and should only be imported in server components or API routes
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface ScrapedData {
  scrapedAt: string;
  totalBills: number;
  successfulScrapes: number;
  bills: unknown[];
}

/**
 * Get the last scraped timestamp from bills data
 * Server-side only
 */
export function getLastScrapedAt(): string | null {
  try {
    const dataPath = join(process.cwd(), 'data', 'bills-scraped.json');
    const data: ScrapedData = JSON.parse(readFileSync(dataPath, 'utf-8'));
    return data.scrapedAt;
  } catch {
    return null;
  }
}

/**
 * Get the count of scraped bills
 * Server-side only
 */
export function getScrapedBillCount(): number {
  try {
    const dataPath = join(process.cwd(), 'data', 'bills-scraped.json');
    const data: ScrapedData = JSON.parse(readFileSync(dataPath, 'utf-8'));
    return data.totalBills || 0;
  } catch {
    return 0;
  }
}
