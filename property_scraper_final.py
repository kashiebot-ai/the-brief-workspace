#!/usr/bin/env python3
"""
Advanced property scraper for realestate.co.nz with pagination and detailed descriptions.
"""

import requests
import re
import csv
import time
from datetime import datetime
from bs4 import BeautifulSoup

BASE_URL = "https://www.realestate.co.nz"
SEARCH_URL = BASE_URL + "/residential/sale/hawkes-bay"
OUTPUT_FILE = f"property_listings_{datetime.now().strftime('%Y%m%d')}.csv"

# Configuration
MAX_PAGES = 3  # Limit pages for testing
DELAY_BETWEEN_REQUESTS = 1  # Seconds
MAX_LISTINGS = 50  # Overall limit

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

def fetch_page(url):
    """Fetch page and return BeautifulSoup object."""
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_from_tile(tile):
    """Extract property data from a tile using data-test attributes."""
    listing = {
        'url': '',
        'address': '',
        'price': '',
        'sale_method': '',
        'bedrooms': '',
        'bathrooms': '',
        'land_area': '',
        'short_description': '',
        'listing_date': '',
        'agent': '',
        'property_type': ''
    }
    
    # Extract URL
    link = tile.find('a', href=re.compile(r'^/\d+/residential/sale/'))
    if link:
        listing['url'] = BASE_URL + link['href']
    
    # Address
    addr_elem = tile.find(attrs={'data-test': re.compile(r'.*address')})
    if addr_elem:
        listing['address'] = addr_elem.get_text(strip=True)
    
    # Price and sale method
    price_elem = tile.find(attrs={'data-test': re.compile(r'price.*method')})
    if price_elem:
        text = price_elem.get_text(strip=True)
        # Extract price if present
        price_match = re.search(r'(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
        if price_match:
            listing['price'] = price_match.group(1)
            # Remove price to get method
            method_text = text.replace(price_match.group(1), '').strip()
            if method_text:
                listing['sale_method'] = method_text
        else:
            # No price, just method
            listing['sale_method'] = text
    
    # Bedrooms, bathrooms, land area
    bed_elem = tile.find(attrs={'data-test': 'bedroom'})
    if bed_elem:
        listing['bedrooms'] = bed_elem.get_text(strip=True)
    
    bath_elem = tile.find(attrs={'data-test': 'bathroom'})
    if bath_elem:
        listing['bathrooms'] = bath_elem.get_text(strip=True)
    
    land_elem = tile.find(attrs={'data-test': 'land-area'})
    if land_elem:
        listing['land_area'] = land_elem.get_text(strip=True)
    
    # Short description
    desc_elem = tile.find(attrs={'data-test': re.compile(r'.*description')})
    if desc_elem:
        listing['short_description'] = desc_elem.get_text(strip=True)
    
    # Listing date
    date_elem = tile.find(attrs={'data-test': re.compile(r'.*date')})
    if date_elem:
        listing['listing_date'] = date_elem.get_text(strip=True)
    
    # Agent
    agent_elem = tile.find(attrs={'data-test': re.compile(r'agent|names')})
    if agent_elem:
        listing['agent'] = agent_elem.get_text(strip=True)
    
    return listing

def fetch_listing_description(url):
    """Fetch full description from listing page."""
    soup = fetch_page(url)
    if not soup:
        return ''
    
    # Try meta description first
    meta_desc = soup.find('meta', {'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        return meta_desc.get('content').strip()
    
    # Try main content description
    desc_div = soup.find('div', class_=re.compile(r'description|content'))
    if desc_div:
        return desc_div.get_text(strip=True)[:500]
    
    return ''

def extract_listings_from_page(soup):
    """Extract all property listings from a single page."""
    listings = []
    tiles = soup.find_all(attrs={'data-test': 'tile'})
    
    for tile in tiles:
        listing = extract_from_tile(tile)
        if listing['url']:
            listings.append(listing)
    
    return listings

def get_next_page_url(soup, current_page):
    """Find URL for next page of results."""
    # Look for pagination links
    pagination = soup.find('nav', {'aria-label': 'Pagination'})
    if pagination:
        next_link = pagination.find('a', {'aria-label': 'Next page'})
        if next_link and next_link.get('href'):
            return BASE_URL + next_link['href']
    
    # Fallback: increment page number
    # Check if current URL has page parameter
    # We'll implement simple increment
    return None  # Let caller handle

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

def save_to_csv(listings, filename):
    """Save listings to CSV."""
    if not listings:
        print("No listings to save")
        return
    
    fieldnames = ['url', 'address', 'price', 'sale_method', 'bedrooms', 'bathrooms', 
                  'land_area', 'property_type', 'agent', 'listing_date', 
                  'short_description', 'full_description', 'renovation_score', 'flags']
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for listing in listings:
            # Truncate descriptions
            if len(listing.get('short_description', '')) > 200:
                listing['short_description'] = listing['short_description'][:200] + '...'
            if len(listing.get('full_description', '')) > 300:
                listing['full_description'] = listing['full_description'][:300] + '...'
            writer.writerow(listing)
    
    print(f"Saved {len(listings)} listings to {filename}")

def main():
    print(f"Scraping property listings from {SEARCH_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Max pages: {MAX_PAGES}, Delay: {DELAY_BETWEEN_REQUESTS}s")
    
    all_listings = []
    current_url = SEARCH_URL
    
    for page in range(1, MAX_PAGES + 1):
        print(f"\n--- Page {page} ---")
        print(f"Fetching: {current_url}")
        
        soup = fetch_page(current_url)
        if not soup:
            print(f"Failed to fetch page {page}")
            break
        
        page_listings = extract_listings_from_page(soup)
        print(f"Found {len(page_listings)} listings on this page")
        
        # Fetch full descriptions for each listing (with delay)
        for i, listing in enumerate(page_listings):
            print(f"  Fetching description {i+1}/{len(page_listings)}")
            listing['full_description'] = fetch_listing_description(listing['url'])
            time.sleep(DELAY_BETWEEN_REQUESTS)
        
        all_listings.extend(page_listings)
        
        # Check if we've reached max listings
        if len(all_listings) >= MAX_LISTINGS:
            print(f"Reached max listings ({MAX_LISTINGS})")
            all_listings = all_listings[:MAX_LISTINGS]
            break
        
        # Try to get next page URL
        next_url = get_next_page_url(soup, page)
        if not next_url:
            # Try simple page increment
            if '?' in current_url:
                base, query = current_url.split('?', 1)
                next_url = f"{base}?{query}&page={page+1}"
            else:
                next_url = f"{current_url}?page={page+1}"
        
        # Test if next page exists by checking if we got any listings this page
        if len(page_listings) == 0:
            print("No listings on this page, stopping pagination")
            break
        
        current_url = next_url
        time.sleep(DELAY_BETWEEN_REQUESTS)  # Delay between pages
    
    print(f"\nTotal listings collected: {len(all_listings)}")
    
    # Score listings
    scored_listings = []
    for listing in all_listings:
        scored = score_listing(listing)
        scored_listings.append(scored)
    
    # Sort by renovation score
    scored_listings.sort(key=lambda x: x['renovation_score'], reverse=True)
    
    # Save results
    save_to_csv(scored_listings, OUTPUT_FILE)
    
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
                print(f"Description: {listing['full_description'][:100]}...")
            print(f"URL: {listing['url']}")
            top_count += 1
            if top_count >= 10:
                break
    
    if top_count == 0:
        print("No high-scoring renovation candidates found.")
        print("Sample listings:")
        for listing in scored_listings[:5]:
            print(f"\nAddress: {listing['address']}")
            print(f"Price: {listing['price']} ({listing['sale_method']})")
            print(f"URL: {listing['url']}")
    
    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"Total listings: {len(scored_listings)}")
    print(f"Candidates with score >0: {sum(1 for l in scored_listings if l['renovation_score'] > 0)}")
    print(f"Highest score: {max([l['renovation_score'] for l in scored_listings]) if scored_listings else 0}")
    print(f"CSV saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()