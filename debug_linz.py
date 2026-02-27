#!/usr/bin/env python3
import requests
import re

LINZ_API_KEY = "4c5b18e5c1e04cb8b9819538260cdb18"
BASE_URL = f"https://data.linz.govt.nz/services;key={LINZ_API_KEY}/wfs/table-114085/"

def test_address(address):
    print(f"\nTesting: {address}")
    # Parse
    main = address.split(',')[0].strip()
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main)
    if not match:
        print("Cannot parse")
        return
    number = match.group(1)
    street = match.group(2).upper()
    print(f"Number: {number}, Street: {street}")
    
    # Variations
    variations = [street]
    # Abbreviate
    abbrev = street.replace('ROAD', 'RD').replace('STREET', 'ST').replace('AVENUE', 'AVE').replace('DRIVE', 'DR')
    if abbrev != street:
        variations.append(abbrev)
    
    for ta in [60, 62, 61, 63]:
        for street_var in variations:
            # Try exact number match
            cql = f"situation_number = '{number}' AND situation_name ILIKE '%{street_var}%' AND district_ta_code = {ta}"
            params = {
                'service': 'WFS',
                'version': '2.0.0',
                'request': 'GetFeature',
                'typeName': 'data.linz.govt.nz:table-114085',
                'count': 3,
                'outputFormat': 'json',
                'CQL_FILTER': cql
            }
            try:
                r = requests.get(BASE_URL, params=params, timeout=5)
                data = r.json()
                if data.get('features'):
                    print(f"  ✅ TA {ta}, street '{street_var}': FOUND {len(data['features'])} matches")
                    for f in data['features']:
                        props = f['properties']
                        print(f"    - {props.get('situation_number')} {props.get('situation_name')}, CV: ${props.get('capital_value')}")
                    return
                else:
                    print(f"  ❌ TA {ta}, street '{street_var}': no matches")
            except Exception as e:
                print(f"  Error: {e}")

# Test addresses
addresses = [
    "1005 Oliphant Road, Raureka",
    "65 Margaret Avenue, Havelock North",
    "607 Market Street South, Hastings",
    "102 Newcastle Street, Mahia",
    "153A Middle Road, Havelock North",
    "8 Hikanui Drive, Havelock North",
    "17 Addington Place, Taradale",
    "14 Francis Drake Street, Waipukurau",
    "148 Battery Road, Ahuriri",
    "20 Faraday Street, Hospital Hill"
]

for addr in addresses:
    test_address(addr)