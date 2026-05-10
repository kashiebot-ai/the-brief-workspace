# Parliament.nz Bill Scraper

Automated pipeline to scrape bills from Parliament.nz and populate Sanity CMS.

## Overview

This scraper uses browser automation to extract bill data from the New Zealand Parliament website and sync it to Sanity CMS. It bypasses the Radware protection by using OpenClaw's browser automation.

## Files

- `scripts/scrape-parliament-bills.ts` - Main scraper script
- `scripts/sync-bills-to-sanity.ts` - Sanity sync script
- `scripts/test-scrape.ts` - Test script for development
- `data/bills-scraped.json` - Output file with scraped bill data

## Usage

### Run Scraper Only

```bash
npx tsx scripts/scrape-parliament-bills.ts
```

This will:
1. Start a browser using the openclaw profile
2. Navigate to Parliament.nz bills page
3. Extract all 95 bills across paginated pages
4. Visit each bill's detail page
5. Save results to `data/bills-scraped.json`

### Sync to Sanity

```bash
# Requires SANITY_API_TOKEN in .env.local
npx tsx scripts/sync-bills-to-sanity.ts
```

This will:
1. Read scraped bills from JSON
2. Check for existing bills in Sanity
3. Create new bills or update existing ones
4. Log sync results

### Run Full Pipeline

```bash
npx tsx scripts/scrape-parliament-bills.ts && npx tsx scripts/sync-bills-to-sanity.ts
```

## Data Structure

Each scraped bill includes:

```typescript
{
  id: string;                    // Generated from bill number
  title: string;                 // Full bill title
  shortTitle: string;            // Truncated title
  billNumber: string;            // e.g., "249-1"
  billType: string;              // Government/Private/Member's Bill
  description: string;           // Bill description
  mpInCharge: string;            // MP name
  committee: string;             // Select committee
  parliament: string;            // Parliament number (54)
  currentStage: string;          // 1, 2, SC, CH, etc.
  stages: Array<{               // Progress stages
    name: string;
    date: string | null;
    completed: boolean;
  }>;
  introducedDate: string | null;
  firstReadingDate: string | null;
  selectCommitteeDate: string | null;
  submissionDeadline: string | null;  // ISO date
  submissionsOpen: boolean;
  daysRemaining: number | null;
  parliamentUrl: string;         // Link to parliament.nz
  legislationUrl: string | null; // Link to legislation.govt.nz
  submissionUrl: string | null;  // Direct submission form URL
  lastActivity: string;
  scrapedAt: string;             // ISO timestamp
}
```

## Automation

### Cron Job Setup

To run the scraper daily:

```bash
openclaw cron add \
  --name="parliament-bill-scraper" \
  --every="24h" \
  --command="cd /Users/viannicaro-watts/clawd/the-brief && npx tsx scripts/scrape-parliament-bills.ts && npx tsx scripts/sync-bills-to-sanity.ts"
```

### Manual Run

```bash
# From the project directory
cd /Users/viannicaro-watts/clawd/the-brief

# Run scraper only
npx tsx scripts/scrape-parliament-bills.ts

# Run sync only
npx tsx scripts/sync-bills-to-sanity.ts

# Run both
npx tsx scripts/scrape-parliament-bills.ts && npx tsx scripts/sync-bills-to-sanity.ts
```

## Environment Variables

Required for Sanity sync:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=72hng9ka
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-token>  # Requires write access
```

## Notes

- The scraper respects rate limits (1-2 second delay between requests)
- Browser automation bypasses Radware protection
- 95 bills are currently accessible
- Submissions deadline dates are in NZ timezone
- The scraper continues on individual bill failures

## Troubleshooting

### Browser fails to start

```bash
# Stop any running browsers
openclaw browser stop --profile=openclaw
pkill -f "Google Chrome"

# Try again
npx tsx scripts/scrape-parliament-bills.ts
```

### Missing data

If bills-scraped.json is empty or missing:
1. Check browser is accessible
2. Verify Parliament.nz is loading
3. Check for network issues
4. Review logs for parsing errors

### Sanity sync fails

1. Verify `SANITY_API_TOKEN` is set in `.env.local`
2. Check token has write permissions
3. Verify project ID and dataset
