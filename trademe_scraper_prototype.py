#!/usr/bin/env python3
"""
TradeMe Property scraper prototype for price bracket mapping.
"""

import requests
import time
import csv
import json
from datetime import datetime
from bs4 import BeautifulSoup
import re

BASE_URL = "https://www.trademe.co.nz/a/property/residential/sale"

# Napier/Hawke's Bay region parameters
REGION_ID = 9  # Hawke's Bay
DISTRICT_ID = 43  # Napier

# Price brackets in $1000 increments for testing (will use $50k for production)
PRICE_BRACKETS = [
    (0, 50000),
    (50000, 100000),
    (100000, 150000),
    (150000, 200000),
    (200000, 250000),
    (250000, 300000),
    (300000, 350000),
    (350000, 400000),
    (400000, 450000),
    (450000, 500000),
    # Add more as needed
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

def fetch_price_bracket(min_price, max_price):
    """Fetch listings for a specific price bracket."""
    params = {
        'price_min': min_price,
        'price_max': max_price,
        'region': REGION_ID,
        'district': DISTRICT_ID
    }
    
    print(f"  Fetching ${min_price:,} - ${max_price:,}...")
    
    try:
        response = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.content
    except Exception as e:
        print(f"    Error fetching bracket: {e}")
        return None

def extract_listings_from_html(html_content):
    """Extract listing data from HTML page."""
    soup = BeautifulSoup(html_content, 'html.parser')
    listings = []
    
    # Try different selectors for TradeMe listings
    # Look for listing cards
    listing_cards = soup.find_all('div', {'class': re.compile(r'tm-property-search-card.*')})
    
    if not listing_cards:
        # Alternative: look for article tags with data-element="listing-card"
        listing_cards = soup.find_all('article', {'data-element': 'listing-card'})
    
    if not listing_cards:
        # Last resort: look for anything with listing in class
        listing_cards = soup.find_all('div', {'class': re.compile(r'.*listing.*')})
    
    print(f"    Found {len(listing_cards)} potential listing cards")
    
    # For now, just get basic info
    for card in listing_cards[:5]:  # Limit for testing
        # Try to extract address/title
        title_elem = card.find('div', {'class': re.compile(r'.*title.*')})
        if title_elem:
            title = title_elem.text.strip()
        else:
            title = "Unknown"
        
        # Try to extract price
        price_elem = card.find('div', {'class': re.compile(r'.*price.*')})
        price = price_elem.text.strip() if price_elem else "Unknown"
        
        # Try to extract URL
        link_elem = card.find('a', href=True)
        url = link_elem['href'] if link_elem else "Unknown"
        if url and not url.startswith('http'):
            url = 'https://www.trademe.co.nz' + url
        
        listings.append({
            'title': title,
            'price_display': price,
            'url': url,
            'card_html': str(card)[:200] + '...'  # For debugging
        })
    
    return listings

def main():
    print("TradeMe Property Scraper Prototype")
    print("=" * 50)
    
    # Test with a single price bracket first
    print("\nTesting with $300k-350k bracket:")
    html = fetch_price_bracket(300000, 350000)
    
    if html:
        listings = extract_listings_from_html(html)
        print(f"\nExtracted {len(listings)} listings:")
        for i, listing in enumerate(listings):
            print(f"  {i+1}. {listing['title']}")
            print(f"     Price: {listing['price_display']}")
            print(f"     URL: {listing['url']}")
    
    # Save HTML for manual inspection
    if html:
        with open('trademe_sample.html', 'w', encoding='utf-8') as f:
            f.write(html.decode('utf-8', errors='ignore'))
        print("\nSaved sample HTML to 'trademe_sample.html' for inspection")

if __name__ == "__main__":
    main()