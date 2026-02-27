#!/usr/bin/env python3
"""
Social arbitrage scanner using Brave Search API.
Queries recent mentions of keywords and maps to tickers.
"""

import os
import sys
import json
import csv
import time
import requests
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
CONFIG_PATH = os.path.expanduser("~/.openclaw/openclaw.json")
MAPPING_CSV = Path(__file__).parent / "mapping.csv"
OUTPUT_DIR = Path(__file__).parent / "scans"
OUTPUT_DIR.mkdir(exist_ok=True)

# Load Brave API key from OpenClaw config
def load_brave_key():
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)
        key = config.get("tools", {}).get("web", {}).get("search", {}).get("apiKey")
        if not key:
            raise ValueError("Brave API key not found in config")
        return key
    except Exception as e:
        print(f"Error loading config: {e}")
        sys.exit(1)

BRAVE_API_KEY = load_brave_key()
BRAVE_URL = "https://api.search.brave.com/res/v1/web/search"

def search_keyword(keyword, freshness="pd"):
    """Search Brave for keyword with freshness filter."""
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY,
    }
    params = {
        "q": keyword,
        "count": 10,  # max results per query
        "freshness": freshness,  # pd = past day, pw = past week
    }
    try:
        print(f"  Making request to Brave API...")
        resp = requests.get(BRAVE_URL, headers=headers, params=params, timeout=30)
        print(f"  Response status: {resp.status_code}")
        if resp.status_code == 429:
            print(f"  Rate limited! Waiting 65 seconds...")
            time.sleep(65)
            # Try once more
            resp = requests.get(BRAVE_URL, headers=headers, params=params, timeout=30)
            print(f"  Retry status: {resp.status_code}")
        
        resp.raise_for_status()
        data = resp.json()
        # Extract results
        results = data.get("web", {}).get("results", [])
        print(f"  Got {len(results)} results")
        return {
            "total_results": len(results),
            "results": results,
            "query": keyword,
            "freshness": freshness,
        }
    except Exception as e:
        print(f"Search error for '{keyword}': {e}")
        return {"total_results": 0, "results": [], "error": str(e)}

def load_mapping():
    """Load keyword->ticker mapping."""
    mapping = []
    with open(MAPPING_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            mapping.append(row)
    return mapping

def run_scan():
    """Run scan for all keywords."""
    mapping = load_mapping()
    print(f"Loaded {len(mapping)} keywords")
    
    scan_results = []
    for i, item in enumerate(mapping):
        keyword = item['keyword']
        ticker = item['ticker']
        print(f"{i+1}/{len(mapping)}: Scanning '{keyword}' -> {ticker}")
        result = search_keyword(keyword, freshness="pd")
        print(f"  Search completed for '{keyword}'")
        result['keyword'] = keyword
        result['ticker'] = ticker
        result['company'] = item['company']
        scan_results.append(result)
        # Rate limit: 1 query per minute (Brave free tier)
        if i < len(mapping) - 1:
            print(f"  Sleeping 61 seconds before next query...")
            time.sleep(61)  # sleep 61 seconds to stay safe
            print(f"  Sleep complete, moving to next keyword")
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    output_file = OUTPUT_DIR / f"scan_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump({
            "scan_time": datetime.now().isoformat(),
            "results": scan_results,
        }, f, indent=2)
    print(f"Scan saved to {output_file}")
    
    # Generate briefing
    generate_briefing(scan_results, output_file)

def generate_briefing(scan_results, output_file):
    """Generate a human-readable briefing."""
    # Filter for interesting results (e.g., total_results > 5)
    interesting = [r for r in scan_results if r.get('total_results', 0) >= 5]
    if not interesting:
        print("No significant trends found.")
        return
    
    briefing_file = output_file.with_suffix('.md')
    with open(briefing_file, 'w') as f:
        f.write(f"# Social Arbitrage Scan - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        f.write(f"Total keywords scanned: {len(scan_results)}\n")
        f.write(f"Trending keywords: {len(interesting)}\n\n")
        
        for item in interesting:
            f.write(f"## {item['keyword']} → {item['ticker']} ({item['company']})\n")
            f.write(f"- **Mentions (past day):** {item['total_results']}\n")
            # Show top result snippets
            results = item.get('results', [])[:3]
            for res in results:
                title = res.get('title', '').replace('\n', ' ').strip()
                desc = res.get('description', '').replace('\n', ' ').strip()
                if title:
                    f.write(f"  - {title}\n")
                if desc:
                    f.write(f"    *{desc}*\n")
            f.write("\n")
        
        f.write("\n---\n")
        f.write("*Generated by OpenClaw social arbitrage scanner*\n")
    
    print(f"Briefing saved to {briefing_file}")

if __name__ == "__main__":
    run_scan()