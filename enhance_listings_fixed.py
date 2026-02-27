#!/usr/bin/env python3
"""
Enhance existing listings with full descriptions and rescore.
"""

import csv
import re
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup

INPUT_CSV = "property_listings_robust.csv"
OUTPUT_CSV = f"property_listings_enhanced_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

RENOVATION_KEYWORDS = [
    "do-up", "renovator", "needs tlc", "tlc", "as is where is", "as is",
    "handyman", "fixer upper", "potential", "original condition",
    "cosmetic update", "blank canvas", "renovation", "update needed",
    "needs work", "needs some work", "needs love", "needs attention",
    "project", "investment opportunity", "bring your ideas", "do up"
]

NEGOTIATION_KEYWORDS = [
    "deadline sale", "tender", "price by negotiation", "offers over",
    "by negotiation", "negotiation", "auction", "offers", "sale by tender",
    "deadline", "tender"
]

OLDER_HOME_KEYWORDS = [
    "1950s", "1960s", "1970s", "1930s", "1940s", "character home",
    "original features", "vintage", "retro", "classic"
]

def fetch_description(url):
    """Fetch full description from listing page."""
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Meta description
        meta = soup.find('meta', {'name': 'description'})
        if meta and meta.get('content'):
            return meta.get('content').strip()
        
        # Try main content
        desc_div = soup.find('div', class_=re.compile(r'description|content'))
        if desc_div:
            return desc_div.get_text(strip=True)[:500]
        
        return ''
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return ''

def score_listing(listing):
    """Score listing based on renovation potential."""
    score = 0
    flags = []
    
    text = f"{listing['address']} {listing['short_description']} {listing['full_description']}".lower()
    
    # Renovation keywords
    for keyword in RENOVATION_KEYWORDS:
        if keyword in text:
            score += 3
            flags.append(f"Renovation: {keyword}")
            break
    
    # Negotiation keywords
    for keyword in NEGOTIATION_KEYWORDS:
        if keyword in text:
            score += 2
            flags.append(f"Negotiation: {keyword}")
            break
    
    # Older home keywords
    for keyword in OLDER_HOME_KEYWORDS:
        if keyword in text:
            score += 2
            flags.append(f"Older home: {keyword}")
            break
    
    # Urgent sale methods
    sale_method = listing['sale_method'].lower()
    if any(method in sale_method for method in ['deadline', 'tender', 'auction']):
        score += 2
        flags.append(f"Urgent sale: {listing['sale_method']}")
    
    # No price listed
    if not listing['price']:
        score += 1
        flags.append("No price listed")
    
    # Older home based on year
    if any(year in text for year in ['1950', '1960', '1970']):
        score += 2
        flags.append("Likely older home")
    
    listing['renovation_score'] = score
    listing['flags'] = ', '.join(flags)
    
    return listing

def main():
    print(f"Loading listings from {INPUT_CSV}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Read CSV
    listings = []
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Rename 'description' column to 'short_description'
            if 'description' in row:
                row['short_description'] = row['description']
                del row['description']
            else:
                row['short_description'] = ''
            row['full_description'] = ''
            listings.append(row)
    
    print(f"Loaded {len(listings)} listings")
    
    # Fetch full descriptions (with rate limiting)
    for i, listing in enumerate(listings):
        print(f"Fetching description {i+1}/{len(listings)}: {listing['url']}")
        listing['full_description'] = fetch_description(listing['url'])
        time.sleep(0.5)  # Be polite
    
    # Score listings
    scored_listings = []
    for listing in listings:
        scored = score_listing(listing)
        scored_listings.append(scored)
    
    # Sort by score
    scored_listings.sort(key=lambda x: x['renovation_score'], reverse=True)
    
    # Save enhanced CSV
    fieldnames = ['url', 'address', 'price', 'sale_method', 'bedrooms', 'bathrooms', 
                  'land_area', 'property_type', 'agent', 'listing_date', 
                  'short_description', 'full_description', 'renovation_score', 'flags']
    
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for listing in scored_listings:
            # Ensure all fields present
            row = {field: listing.get(field, '') for field in fieldnames}
            # Truncate
            if len(row.get('short_description', '')) > 200:
                row['short_description'] = row['short_description'][:200] + '...'
            if len(row.get('full_description', '')) > 300:
                row['full_description'] = row['full_description'][:300] + '...'
            writer.writerow(row)
    
    print(f"\nSaved enhanced listings to {OUTPUT_CSV}")
    
    # Print top candidates
    print("\n=== TOP RENOVATION CANDIDATES ===")
    top_count = 0
    for listing in scored_listings:
        if listing['renovation_score'] > 0:
            print(f"\nScore: {listing['renovation_score']}")
            print(f"Address: {listing['address']}")
            print(f"Price: {listing['price']} ({listing['sale_method']})")
            print(f"Details: {listing['bedrooms']} bed, {listing['bathrooms']} bath, {listing['land_area']}")
            print(f"Flags: {listing['flags']}")
            if listing['full_description']:
                print(f"Description: {listing['full_description'][:150]}...")
            print(f"URL: {listing['url']}")
            top_count += 1
            if top_count >= 10:
                break
    
    if top_count == 0:
        print("No high-scoring renovation candidates found.")
        print("Sample listings:")
        for listing in scored_listings[:3]:
            print(f"\nAddress: {listing['address']}")
            print(f"Price: {listing['price']} ({listing['sale_method']})")
            print(f"URL: {listing['url']}")
    
    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"Total listings: {len(scored_listings)}")
    print(f"Candidates with score >0: {sum(1 for l in scored_listings if l['renovation_score'] > 0)}")
    score_dist = {}
    for l in scored_listings:
        s = l['renovation_score']
        score_dist[s] = score_dist.get(s, 0) + 1
    print("Score distribution:", dict(sorted(score_dist.items())))

if __name__ == "__main__":
    main()