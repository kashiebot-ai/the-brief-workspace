#!/usr/bin/env python3
import requests
import json
from bs4 import BeautifulSoup
from collections import Counter

url = "https://www.realestate.co.nz/residential/sale/hawkes-bay"
headers = {'User-Agent': 'Mozilla/5.0'}
resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')
scripts = soup.find_all('script', type='application/ld+json')

types = Counter()
for i, script in enumerate(scripts):
    try:
        data = json.loads(script.string)
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict):
                    t = item.get('@type', '')
                    types[t] += 1
        elif isinstance(data, dict):
            t = data.get('@type', '')
            types[t] += 1
    except:
        pass

print("Found @type counts:")
for t, count in types.most_common():
    print(f"  {t}: {count}")

# Look for RealEstateListing
print("\nSearching for RealEstateListing...")
for i, script in enumerate(scripts):
    try:
        data = json.loads(script.string)
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'RealEstateListing' in str(item.get('@type', '')):
                    print(f"\nFound RealEstateListing in script {i}:")
                    print(json.dumps(item, indent=2)[:800])
                    break
        elif isinstance(data, dict) and 'RealEstateListing' in str(data.get('@type', '')):
            print(f"\nFound RealEstateListing in script {i}:")
            print(json.dumps(data, indent=2)[:800])
    except:
        continue