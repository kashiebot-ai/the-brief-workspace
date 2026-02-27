#!/usr/bin/env python3
"""
Robust property scraper using data-test attributes from realestate.co.nz
"""

import requests
import re
import csv
import time
from datetime import datetime
from bs4 import BeautifulSoup

BASE_URL = "https://www.realestate.co.nz"
SEARCH_URL = BASE_URL + "/residential/sale/hawkes-bay"
OUTPUT_FILE = "property_listings_robust.csv"

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
        'description': '',
        'listing_date': '',
        'agent': '',
        'property_type': ''
    }
    
    # Extract URL - find link to property page
    link = tile.find('a', href=re.compile(r'^/\d+/residential/sale/'))
    if link:
        listing['url'] = BASE_URL + link['href']
    
    # Extract using data-test attributes
    # Address
    addr_elem = tile.find(attrs={'data-test': re.compile(r'.*address')})
    if addr_elem:
        listing['address'] = addr_elem.get_text(strip=True)
    
    # Price and sale method
    price_elem = tile.find(attrs={'data-test': re.compile(r'price.*method')})
    if price_elem:
        text = price_elem.get_text(strip=True)
        # Try to separate price and method
        # Pattern: "$XXX,XXX Deadline Sale"
        price_match = re.search(r'(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
        if price_match:
            listing['price'] = price_match.group(1)
            # Remove price from text to get method
            method_text = text.replace(price_match.group(1), '').strip()
            if method_text:
                listing['sale_method'] = method_text
    
    # If price not found, try other price elements
    if not listing['price']:
        price_elem2 = tile.find(attrs={'data-test': re.compile(r'price.*display')})
        if price_elem2:
            listing['price'] = price_elem2.get_text(strip=True)
    
    # Bedrooms
    bed_elem = tile.find(attrs={'data-test': 'bedroom'})
    if bed_elem:
        listing['bedrooms'] = bed_elem.get_text(strip=True)
    
    # Bathrooms
    bath_elem = tile.find(attrs={'data-test': 'bathroom'})
    if bath_elem:
        listing['bathrooms'] = bath_elem.get_text(strip=True)
    
    # Land area
    land_elem = tile.find(attrs={'data-test': 'land-area'})
    if land_elem:
        listing['land_area'] = land_elem.get_text(strip=True)
    
    # Description
    desc_elem = tile.find(attrs={'data-test': re.compile(r'.*description')})
    if desc_elem:
        listing['description'] = desc_elem.get_text(strip=True)
    
    # Listing date
    date_elem = tile.find(attrs={'data-test': re.compile(r'.*date')})
    if date_elem:
        listing['listing_date'] = date_elem.get_text(strip=True)
    
    # Agent
    agent_elem = tile.find(attrs={'data-test': re.compile(r'agent|names')})
    if agent_elem:
        listing['agent'] = agent_elem.get_text(strip=True)
    
    # Property type - infer from description or features
    if 'house' in listing['description'].lower():
        listing['property_type'] = 'House'
    elif 'section' in listing['description'].lower():
        listing['property_type'] = 'Section'
    elif 'unit' in listing['description'].lower() or 'apartment' in listing['description'].lower():
        listing['property_type'] = 'Unit/Apartment'
    
    return listing

def extract_listings(soup):
    """Extract all property listings from page."""
    listings = []
    
    # Find all tiles with data-test="tile"
    tiles = soup.find_all(attrs={'data-test': 'tile'})
    print(f"Found {len(tiles)} tiles with data-test='tile'")
    
    for tile in tiles:
        listing = extract_from_tile(tile)
        if listing['url']:  # Only add if we have a URL
            listings.append(listing)
    
    return listings

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
    
    listings = extract_listings(soup)
    print(f"Extracted {len(listings)} listings")
    
    # Score listings
    scored_listings = []
    for listing in listings:
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

if __name__ == "__main__":
    main()