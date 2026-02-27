#!/usr/bin/env python3
"""
Property scraper using JSON-LD structured data from realestate.co.nz
"""

import requests
import json
import re
import csv
import time
from datetime import datetime
from bs4 import BeautifulSoup

BASE_URL = "https://www.realestate.co.nz"
SEARCH_URL = BASE_URL + "/residential/sale/hawkes-bay"
OUTPUT_FILE = "property_listings_json.csv"

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

def extract_jsonld_listings(soup):
    """Extract property listings from JSON-LD scripts."""
    listings = []
    scripts = soup.find_all('script', type='application/ld+json')
    
    for script in scripts:
        try:
            data = json.loads(script.string)
            # Handle both single dict and list
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        process_jsonld_item(item, listings)
            elif isinstance(data, dict):
                process_jsonld_item(data, listings)
        except json.JSONDecodeError:
            continue
        except Exception as e:
            print(f"Error parsing JSON-LD: {e}")
            continue
    
    return listings

def process_jsonld_item(item, listings):
    """Process a JSON-LD item and add to listings if it's a property."""
    # Check if this is a RealEstateListing or similar
    item_type = item.get('@type', '')
    if not any(t in item_type for t in ['RealEstateListing', 'Product', 'Event']):
        return
    
    # Extract relevant fields
    listing = {
        'url': item.get('url', ''),
        'name': item.get('name', ''),
        'description': item.get('description', ''),
        'price': '',
        'price_currency': '',
        'bedrooms': '',
        'bathrooms': '',
        'floor_size': '',
        'land_size': '',
        'address': '',
        'sale_method': '',
        'listing_date': datetime.now().strftime('%Y-%m-%d')
    }
    
    # Extract price
    offers = item.get('offers')
    if offers:
        if isinstance(offers, dict):
            listing['price'] = offers.get('price', '')
            listing['price_currency'] = offers.get('priceCurrency', 'NZD')
            listing['sale_method'] = offers.get('availability', '')
        elif isinstance(offers, list) and offers:
            listing['price'] = offers[0].get('price', '')
            listing['price_currency'] = offers[0].get('priceCurrency', 'NZD')
            listing['sale_method'] = offers[0].get('availability', '')
    
    # Extract address
    address = item.get('address')
    if isinstance(address, dict):
        listing['address'] = address.get('streetAddress', '')
    elif isinstance(address, str):
        listing['address'] = address
    
    # Extract property details
    # Look for numberOfRooms, numberOfBathroomsTotal
    if 'numberOfRooms' in item:
        listing['bedrooms'] = item['numberOfRooms']
    if 'numberOfBathroomsTotal' in item:
        listing['bathrooms'] = item['numberOfBathroomsTotal']
    
    # Floor size and land size
    if 'floorSize' in item:
        floor_size = item['floorSize']
        if isinstance(floor_size, dict):
            listing['floor_size'] = floor_size.get('value', '')
        else:
            listing['floor_size'] = floor_size
    
    # Land size might be in additionalProperty
    additional = item.get('additionalProperty', [])
    if isinstance(additional, list):
        for prop in additional:
            if isinstance(prop, dict):
                name = prop.get('name', '')
                value = prop.get('value', '')
                if 'land' in name.lower() or 'area' in name.lower():
                    listing['land_size'] = value
                elif 'bed' in name.lower():
                    listing['bedrooms'] = value
                elif 'bath' in name.lower():
                    listing['bathrooms'] = value
    
    # Clean up URL
    if listing['url'] and not listing['url'].startswith('http'):
        listing['url'] = BASE_URL + listing['url']
    
    # Only add if we have at least a URL and name
    if listing['url'] and listing['name']:
        listings.append(listing)

def score_listing(listing):
    """Score listing based on renovation potential."""
    score = 0
    flags = []
    
    text = f"{listing['name']} {listing['description']}".lower()
    
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
    
    listing['renovation_score'] = score
    listing['flags'] = ', '.join(flags)
    
    return listing

def save_to_csv(listings, filename):
    """Save listings to CSV."""
    if not listings:
        print("No listings to save")
        return
    
    fieldnames = ['url', 'name', 'address', 'price', 'price_currency', 
                  'bedrooms', 'bathrooms', 'floor_size', 'land_size', 
                  'sale_method', 'listing_date', 'renovation_score', 'flags', 'description']
    
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
    print(f"Scraping JSON-LD data from {SEARCH_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    soup = fetch_page(SEARCH_URL)
    if not soup:
        print("Failed to fetch page")
        return
    
    listings = extract_jsonld_listings(soup)
    print(f"Found {len(listings)} listings in JSON-LD")
    
    # Score listings
    scored_listings = []
    for listing in listings:
        scored = score_listing(listing)
        scored_listings.append(scored)
    
    # Sort by score
    scored_listings.sort(key=lambda x: x['renovation_score'], reverse=True)
    
    # Save results
    save_to_csv(scored_listings, OUTPUT_FILE)
    
    # Print top candidates
    print("\n=== TOP RENOVATION CANDIDATES ===")
    top_count = 0
    for listing in scored_listings:
        if listing['renovation_score'] > 0:
            print(f"\nScore: {listing['renovation_score']}")
            print(f"Name: {listing['name'][:50]}")
            print(f"Address: {listing['address']}")
            print(f"Price: {listing['price']} {listing['price_currency']}")
            print(f"Details: {listing['bedrooms']} bed, {listing['bathrooms']} bath, {listing['land_size']} land")
            print(f"Flags: {listing['flags']}")
            print(f"URL: {listing['url']}")
            top_count += 1
            if top_count >= 10:
                break
    
    if top_count == 0:
        print("No high-scoring renovation candidates found.")
        print("Sample listing:")
        if scored_listings:
            sample = scored_listings[0]
            print(f"Name: {sample['name']}")
            print(f"Price: {sample['price']}")
            print(f"Description: {sample['description'][:100]}...")

if __name__ == "__main__":
    main()