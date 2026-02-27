#!/usr/bin/env python3
"""
Property scraper parsing HTML tiles from realestate.co.nz
"""

import requests
import re
import csv
import time
from datetime import datetime
from bs4 import BeautifulSoup

BASE_URL = "https://www.realestate.co.nz"
SEARCH_URL = BASE_URL + "/residential/sale/hawkes-bay"
OUTPUT_FILE = "property_listings_tiles.csv"

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
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_listings_from_tiles(soup):
    """Extract property listings from listing tiles."""
    listings = []
    
    # Find all listing tiles
    tiles = soup.find_all('div', class_=re.compile(r'listing-tile'))
    print(f"Found {len(tiles)} listing tiles")
    
    for tile in tiles:
        listing = {
            'url': '',
            'address': '',
            'price': '',
            'bedrooms': '',
            'bathrooms': '',
            'land_area': '',
            'property_type': '',
            'sale_method': '',
            'description': '',
            'agency': ''
        }
        
        # Extract URL from link within tile
        link = tile.find('a', href=re.compile(r'^/\d+/residential/sale/'))
        if link:
            listing['url'] = BASE_URL + link['href']
        
        # Extract address - look for address element
        address_elem = tile.find('address') or tile.find('span', class_=re.compile(r'address'))
        if address_elem:
            listing['address'] = address_elem.get_text(strip=True)
        else:
            # Try to find in h2 or strong text
            for tag in tile.find_all(['h2', 'h3', 'strong']):
                text = tag.get_text(strip=True)
                if text and len(text) > 10 and ',' in text:
                    listing['address'] = text
                    break
        
        # Extract price - look for price patterns
        price_pattern = r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\$\d+'
        tile_text = tile.get_text()
        price_matches = re.findall(price_pattern, tile_text)
        if price_matches:
            listing['price'] = price_matches[0]
        
        # Extract bedrooms, bathrooms, land area
        # Pattern like "3 1 761m2" or "3 bed 1 bath 761m²"
        bed_bath_area = re.search(r'(\d+)\s+(\d+)\s+(\d+\s*m²?)', tile_text)
        if bed_bath_area:
            listing['bedrooms'] = bed_bath_area.group(1)
            listing['bathrooms'] = bed_bath_area.group(2)
            listing['land_area'] = bed_bath_area.group(3)
        else:
            # Try alternative patterns
            bed_match = re.search(r'(\d+)\s*bed', tile_text, re.I)
            bath_match = re.search(r'(\d+)\s*bath', tile_text, re.I)
            area_match = re.search(r'(\d+)\s*m²?', tile_text, re.I)
            if bed_match:
                listing['bedrooms'] = bed_match.group(1)
            if bath_match:
                listing['bathrooms'] = bath_match.group(1)
            if area_match:
                listing['land_area'] = area_match.group(1) + 'm²'
        
        # Extract sale method
        sale_methods = ['Deadline Sale', 'Negotiation', 'Tender', 'Auction', 'Price by Negotiation']
        for method in sale_methods:
            if method.lower() in tile_text.lower():
                listing['sale_method'] = method
                break
        
        # Extract property type (House, Section, Unit, etc.)
        property_types = ['House', 'Section', 'Unit', 'Apartment', 'Townhouse']
        for ptype in property_types:
            if ptype.lower() in tile_text.lower():
                listing['property_type'] = ptype
                break
        
        # Extract agency/agent name
        agent_elem = tile.find('div', class_=re.compile(r'agent|agency'))
        if agent_elem:
            listing['agency'] = agent_elem.get_text(strip=True)[:50]
        
        # Only add if we have at least a URL
        if listing['url']:
            listings.append(listing)
    
    return listings

def fetch_listing_details(listing):
    """Fetch individual listing page for description."""
    if not listing['url']:
        return listing
    
    soup = fetch_page(listing['url'])
    if not soup:
        return listing
    
    # Extract description from meta or content
    desc_elem = soup.find('meta', {'name': 'description'})
    if desc_elem:
        listing['description'] = desc_elem.get('content', '')
    
    # If no meta description, look for main content
    if not listing['description']:
        content = soup.find('div', class_=re.compile(r'description|content'))
        if content:
            listing['description'] = content.get_text(strip=True)[:300]
    
    return listing

def score_listing(listing):
    """Score listing based on renovation potential."""
    score = 0
    flags = []
    
    text = f"{listing['address']} {listing['description']}".lower()
    
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
    
    # Older home based on year (if we can extract)
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
    
    fieldnames = ['url', 'address', 'price', 'bedrooms', 'bathrooms', 
                  'land_area', 'property_type', 'sale_method', 'agency',
                  'renovation_score', 'flags', 'description']
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for listing in listings:
            # Truncate description
            desc = listing.get('description', '')
            if len(desc) > 200:
                listing['description'] = desc[:200] + '...'
            writer.writerow(listing)
    
    print(f"Saved {len(listings)} listings to {filename}")

def main():
    print(f"Scraping property listings from {SEARCH_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    soup = fetch_page(SEARCH_URL)
    if not soup:
        print("Failed to fetch page")
        return
    
    listings = extract_listings_from_tiles(soup)
    print(f"Extracted {len(listings)} listings from tiles")
    
    # Fetch details for each listing (with rate limiting)
    detailed_listings = []
    for i, listing in enumerate(listings[:15]):  # Limit for testing
        print(f"Fetching details {i+1}/{min(15, len(listings))}: {listing['url']}")
        detailed = fetch_listing_details(listing)
        scored = score_listing(detailed)
        detailed_listings.append(scored)
        time.sleep(1)  # Be polite
    
    # Sort by renovation score
    detailed_listings.sort(key=lambda x: x['renovation_score'], reverse=True)
    
    # Save results
    save_to_csv(detailed_listings, OUTPUT_FILE)
    
    # Print top candidates
    print("\n=== TOP RENOVATION CANDIDATES ===")
    top_count = 0
    for listing in detailed_listings:
        if listing['renovation_score'] > 0:
            print(f"\nScore: {listing['renovation_score']}")
            print(f"Address: {listing['address']}")
            print(f"Price: {listing['price']}")
            print(f"Details: {listing['bedrooms']} bed, {listing['bathrooms']} bath, {listing['land_area']}")
            print(f"Sale method: {listing['sale_method']}")
            print(f"Flags: {listing['flags']}")
            print(f"URL: {listing['url']}")
            top_count += 1
            if top_count >= 10:
                break
    
    if top_count == 0:
        print("No high-scoring renovation candidates found.")
        print("Sample listings:")
        for listing in detailed_listings[:3]:
            print(f"\nAddress: {listing['address']}")
            print(f"Price: {listing['price']}")
            print(f"URL: {listing['url']}")

if __name__ == "__main__":
    main()