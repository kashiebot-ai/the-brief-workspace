#!/usr/bin/env python3
import requests
import re
from bs4 import BeautifulSoup

url = "https://www.realestate.co.nz/residential/sale/hawkes-bay"
headers = {'User-Agent': 'Mozilla/5.0'}
resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')

# Find first listing tile
tile = soup.find('div', class_=re.compile(r'listing-tile'))
if tile:
    print("Found tile class:", tile.get('class'))
    print("\nHTML snippet (first 1500 chars):")
    print(str(tile)[:1500])
    
    # Find all text within tile
    print("\nText within tile:")
    print(tile.get_text(separator=' ', strip=True)[:500])
    
    # Find all data-test attributes
    print("\nData-test attributes:")
    for elem in tile.find_all(attrs={'data-test': True}):
        print(f"  {elem.name}: {elem.get('data-test')}")
else:
    print("No tile found with listing-tile class")
    # Try other patterns
    tiles = soup.find_all('div', class_=re.compile(r'tile'))
    print(f"Found {len(tiles)} tiles total")
    for t in tiles[:3]:
        print(f"\nTile classes: {t.get('class')}")
        print(t.get_text(separator=' ', strip=True)[:200])