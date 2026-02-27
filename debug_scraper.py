#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import re

url = "https://www.realestate.co.nz/residential/sale/hawkes-bay"
headers = {'User-Agent': 'Mozilla/5.0'}
resp = requests.get(url, headers=headers)
print(f"Status: {resp.status_code}")
print(f"Length: {len(resp.content)}")

soup = BeautifulSoup(resp.content, 'html.parser')

# Find all links that look like property listings
links = soup.find_all('a', href=True)
listing_links = []
for link in links:
    href = link['href']
    if re.match(r'^/\d+/residential/sale/', href):
        listing_links.append((href, link.get_text(strip=True)))

print(f"Found {len(listing_links)} listing links")
for href, text in listing_links[:5]:
    print(f"  {href} -> {text[:50]}")

# Look for containers that have listing details
# Try to find listing cards
cards = soup.find_all('div', class_=re.compile(r'listing|card|property', re.I))
print(f"Found {len(cards)} potential listing cards")

if cards:
    card = cards[0]
    print("\nFirst card HTML snippet:")
    print(str(card)[:500])

# Also look for script tags with JSON-LD data
scripts = soup.find_all('script', type='application/ld+json')
print(f"\nFound {len(scripts)} JSON-LD scripts")
if scripts:
    print(scripts[0].string[:200])

# Save raw HTML for inspection
with open('debug_page.html', 'w', encoding='utf-8') as f:
    f.write(resp.text)
print("\nSaved raw HTML to debug_page.html")