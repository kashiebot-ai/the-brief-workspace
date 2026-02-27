#!/usr/bin/env python3
import requests
import json
from bs4 import BeautifulSoup

url = "https://www.realestate.co.nz/residential/sale/hawkes-bay"
headers = {'User-Agent': 'Mozilla/5.0'}
resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.content, 'html.parser')
scripts = soup.find_all('script', type='application/ld+json')

for i, script in enumerate(scripts[:5]):
    print(f"\n=== Script {i} ===")
    try:
        data = json.loads(script.string)
        if isinstance(data, list):
            for j, item in enumerate(data[:2]):
                print(f"\nItem {j}:")
                print(json.dumps(item, indent=2)[:500])
        else:
            print(json.dumps(data, indent=2)[:800])
    except:
        print("Failed to parse JSON")
        print(script.string[:200])