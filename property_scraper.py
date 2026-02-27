#!/usr/bin/env python3
"""
Property scraper for realestate.co.nz
Finds renovation opportunities in Hawke's Bay region.
"""

import requests
from bs4 import BeautifulSoup
import re
import csv
import time
from datetime import datetime
from urllib.parse import urljoin

# Configuration
BASE_URL = "https://www.realestate.co.nz"
SEARCH_URL = BASE_URL + "/residential/sale/hawkes-bay"
OUTPUT_FILE = "property_listings.csv"

# Keywords indicating renovation potential
RENOVATION_KEYWORDS = [
    "do-up", "renovator", "needs tlc", "tlc", "as is where is", "as is",
    "handyman", "fixer upper", "potential", "original condition",
    "cosmetic update", "blank canvas", "renovation", "update needed",
    "needs work", "needs some work", "needs love", "needs attention",
    "project", "investment opportunity", "bring your ideas"
]

# Price negotiation indicators
NEGOTIATION_KEYWORDS = [
    "deadline sale", "tender", "price by negotiation", "offers over",
    "by negotiation", "negotiation", "auction", "offers", "sale by tender"
]

# Older home indicators (pre-1970)
OLDER_HOME_KEYWORDS = [
    "1950s", "1960s", "1970s", "1930s", "1940s", "character home",
    "original features", "vintage", "retro"
]

def fetch_page(url):
    """Fetch a page and return BeautifulSoup object."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_listings(soup):
    """Extract property listings from search page."""
    listings = []
    
    # Look for listing containers - this selector may need adjustment
    # Based on the HTML snippet, listings appear to be in links with specific patterns
    listing_links = soup.find_all('a', href=re.compile(r'^/\d+/residential/sale/'))
    
    for link in listing_links:
        # Get parent container to extract more details
        container = link.parent
        
        # Extract basic info
        listing = {
            'url': urljoin(BASE_URL, link.get('href')),
            'title': link.get_text(strip=True) if link.get_text(strip=True) else '',
            'description': '',
            'price': '',
            'bedrooms': '',
            'bathrooms': '',
            'land_area': '',
            'property_type': '',
            'listing_date': '',
            'sale_method': '',
            'address': ''
        }
        
        # Try to find price - look for price patterns in nearby text
        price_pattern = r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\$\d+'
        # Look in parent container for price
        container_text = container.get_text()
        price_matches = re.findall(price_pattern, container_text)
        if price_matches:
            listing['price'] = price_matches[0]
        
        # Look for bedroom/bathroom/area patterns
        # Pattern like "3 1 761m2" from the HTML snippet
        bed_bath_area = re.search(r'(\d+)\s+(\d+)\s+(\d+m2)', container_text)
        if bed_bath_area:
            listing['bedrooms'] = bed_bath_area.group(1)
            listing['bathrooms'] = bed_bath_area.group(2)
            listing['land_area'] = bed_bath_area.group(3)
        
        # Extract sale method (Deadline Sale, Negotiation, Tender)
        sale_methods = ['Deadline Sale', 'Negotiation', 'Tender', 'Auction']
        for method in sale_methods:
            if method.lower() in container_text.lower():
                listing['sale_method'] = method
                break
        
        listings.append(listing)
    
    # Deduplicate by URL
    seen = set()
    unique_listings = []
    for listing in listings:
        if listing['url'] not in seen:
            seen.add(listing['url'])
            unique_listings.append(listing)
    
    return unique_listings

def fetch_listing_details(listing):
    """Fetch individual listing page for more details."""
    soup = fetch_page(listing['url'])
    if not soup:
        return listing
    
    # Extract description
    description_elem = soup.find('meta', {'name': 'description'})
    if description_elem:
        listing['description'] = description_elem.get('content', '')
    
    # Look for address in title
    title_elem = soup.find('title')
    if title_elem:
        title_text = title_elem.get_text()
        # Extract address - assuming format "Address, Suburb - For Sale"
        address_match = re.search(r'^(.*?), [^-]+ - For Sale', title_text)
        if address_match:
            listing['address'] = address_match.group(1).strip()
    
    return listing

def score_listing(listing):
    """Score listing based on renovation potential indicators."""
    score = 0
    flags = []
    
    text = f"{listing['title']} {listing['description']}".lower()
    
    # Check for renovation keywords
    for keyword in RENOVATION_KEYWORDS:
        if keyword in text:
            score += 3
            flags.append(f"Renovation keyword: {keyword}")
            break  # Count each keyword only once
    
    # Check for negotiation keywords
    for keyword in NEGOTIATION_KEYWORDS:
        if keyword in text:
            score += 2
            flags.append(f"Negotiation indicator: {keyword}")
            break
    
    # Check for older home keywords
    for keyword in OLDER_HOME_KEYWORDS:
        if keyword in text:
            score += 2
            flags.append(f"Older home: {keyword}")
            break
    
    # Score based on sale method
    if listing['sale_method'] in ['Deadline Sale', 'Tender', 'Auction']:
        score += 2
        flags.append(f"Urgent sale method: {listing['sale_method']}")
    
    # Score if price is missing (might indicate negotiation)
    if not listing['price']:
        score += 1
        flags.append("No price listed (may indicate negotiation)")
    
    listing['renovation_score'] = score
    listing['flags'] = ', '.join(flags)
    
    return listing

def save_to_csv(listings, filename):
    """Save listings to CSV file."""
    if not listings:
        print("No listings to save")
        return
    
    fieldnames = ['url', 'title', 'address', 'price', 'bedrooms', 'bathrooms', 
                  'land_area', 'property_type', 'sale_method', 'listing_date',
                  'renovation_score', 'flags', 'description']
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for listing in listings:
            # Truncate description for CSV
            listing['description'] = listing['description'][:200] + '...' if len(listing['description']) > 200 else listing['description']
            writer.writerow(listing)
    
    print(f"Saved {len(listings)} listings to {filename}")

def main():
    print(f"Scraping property listings from {SEARCH_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Fetch main search page
    soup = fetch_page(SEARCH_URL)
    if not soup:
        print("Failed to fetch search page")
        return
    
    # Extract listings
    listings = extract_listings(soup)
    print(f"Found {len(listings)} listings")
    
    # Fetch details for each listing (with rate limiting)
    detailed_listings = []
    for i, listing in enumerate(listings[:20]):  # Limit to first 20 for testing
        print(f"Processing listing {i+1}/{min(20, len(listings))}: {listing['url']}")
        detailed = fetch_listing_details(listing)
        scored = score_listing(detailed)
        detailed_listings.append(scored)
        time.sleep(1)  # Be polite
    
    # Sort by renovation score (highest first)
    detailed_listings.sort(key=lambda x: x['renovation_score'], reverse=True)
    
    # Save results
    save_to_csv(detailed_listings, OUTPUT_FILE)
    
    # Print top candidates
    print("\n=== TOP RENOVATION CANDIDATES ===")
    for listing in detailed_listings[:10]:
        if listing['renovation_score'] > 0:
            print(f"\nScore: {listing['renovation_score']}")
            print(f"Address: {listing['address']}")
            print(f"Price: {listing['price']}")
            print(f"Details: {listing['bedrooms']} bed, {listing['bathrooms']} bath, {listing['land_area']}")
            print(f"Flags: {listing['flags']}")
            print(f"URL: {listing['url']}")

if __name__ == "__main__":
    main()