#!/usr/bin/env python3
"""
Quick LINZ CV integration - process existing listings with heuristic TA mapping.
"""

import csv
import re
import requests
import time
from datetime import datetime

LINZ_API_KEY = "4c5b18e5c1e04cb8b9819538260cdb18"
BASE_URL = f"https://data.linz.govt.nz/services;key={LINZ_API_KEY}/wfs/table-114085/"

# TA code mapping based on suburb
TA_MAP = {
    'napier': 60,
    'taradale': 60,
    'ahuriri': 60,
    'hospital hill': 60,
    'hastings': 62,
    'raureka': 62,
    'havelock north': 62,
    'waipukurau': 61,  # guess
    'wairoa': 63,  # guess
    'mahia': 63,  # guess
    'clive': 62,  # likely Hastings district
}

def guess_ta_code(address: str) -> int:
    """Guess TA code from address substring."""
    addr_lower = address.lower()
    for key, code in TA_MAP.items():
        if key in addr_lower:
            return code
    # Default to Napier (60) if cannot guess
    return 60

def parse_address(address: str):
    """Return (number, street)"""
    main = address.split(',')[0].strip()
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main)
    if match:
        return match.group(1), match.group(2).upper()
    return None, None

def query_linz_single(number: str, street: str, ta_code: int):
    """Single attempt query."""
    # Try with ROAD -> RD etc.
    street_var = street.replace('ROAD', 'RD').replace('STREET', 'ST').replace('AVENUE', 'AVE').replace('DRIVE', 'DR')
    
    cql = f"situation_number = '{number}' AND situation_name ILIKE '%{street_var}%' AND district_ta_code = {ta_code}"
    params = {
        'service': 'WFS',
        'version': '2.0.0',
        'request': 'GetFeature',
        'typeName': 'data.linz.govt.nz:table-114085',
        'count': 2,
        'outputFormat': 'json',
        'CQL_FILTER': cql
    }
    try:
        r = requests.get(BASE_URL, params=params, timeout=10)
        data = r.json()
        if data.get('features'):
            return data['features'][0]['properties']
    except Exception as e:
        print(f"    Query error: {e}")
    return None

def parse_price(price_str):
    """Extract numeric price."""
    if not price_str:
        return None
    # Find first number with $ or commas
    match = re.search(r'[\$]?([\d,]+(?:\.\d+)?)', price_str.replace(',', ''))
    if match:
        try:
            return float(match.group(1))
        except:
            pass
    return None

def main():
    input_csv = "property_listings_enhanced_20260219_0858.csv"
    output_csv = f"property_listings_cv_quick_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    
    print("=== Quick CV Integration ===")
    print(f"Time: {datetime.now().strftime('%H:%M:%S')}")
    
    # Read
    listings = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            listings.append(row)
    
    print(f"Processing {len(listings)} listings...")
    
    enhanced = []
    matched = 0
    
    for i, listing in enumerate(listings):
        address = listing['address']
        price_str = listing['price']
        score = int(listing.get('renovation_score', 0))
        
        print(f"\n{i+1}. {address}")
        print(f"   Price: {price_str}, Score: {score}")
        
        # Guess TA
        ta_guess = guess_ta_code(address)
        number, street = parse_address(address)
        
        cv_data = None
        if number and street:
            print(f"   Query: {number} {street}, TA guess: {ta_guess}")
            cv_data = query_linz_single(number, street, ta_guess)
            # If no match, try other TA codes
            if not cv_data and ta_guess != 60:
                cv_data = query_linz_single(number, street, 60)
            if not cv_data and ta_guess != 62:
                cv_data = query_linz_single(number, street, 62)
        
        if cv_data:
            matched += 1
            cv = cv_data.get('capital_value')
            land = cv_data.get('land_area')
            condition = cv_data.get('building_condition_indicator')
            age = cv_data.get('building_age_indicator')
            ta = cv_data.get('district_ta_code')
            
            # Calculate gap
            asking = parse_price(price_str)
            gap_pct = None
            if cv and asking:
                gap_pct = (cv - asking) / cv * 100
            
            # Combined score (renovation score + gap score)
            gap_score = 0
            if gap_pct:
                if gap_pct > 20:
                    gap_score = 5
                elif gap_pct > 15:
                    gap_score = 4
                elif gap_pct > 10:
                    gap_score = 3
                elif gap_pct > 5:
                    gap_score = 2
                elif gap_pct > 0:
                    gap_score = 1
                elif gap_pct < 0:
                    gap_score = -1  # Overpriced
            
            total_score = score + gap_score
            
            print(f"   ✅ MATCH (TA {ta}) CV: ${cv:,}")
            if gap_pct:
                print(f"   Gap: {gap_pct:.1f}%")
            print(f"   Condition: {condition}, Age: {age}")
            print(f"   Total score: {total_score}")
            
            # Add fields
            listing['ta_code'] = ta
            listing['capital_value'] = cv
            listing['land_area_ha'] = land
            listing['cv_condition'] = condition
            listing['cv_age'] = age
            listing['gap_percent'] = f"{gap_pct:.1f}" if gap_pct else ''
            listing['total_score'] = total_score
            listing['linz_match'] = 'YES'
        else:
            print(f"   ❌ NO MATCH")
            for f in ['ta_code', 'capital_value', 'land_area_ha', 'cv_condition', 'cv_age', 'gap_percent', 'total_score']:
                listing[f] = ''
            listing['total_score'] = score  # fallback
            listing['linz_match'] = 'NO'
        
        enhanced.append(listing)
        time.sleep(0.2)  # be polite
    
    # Write CSV
    fieldnames = list(enhanced[0].keys())
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(enhanced)
    
    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"Matched {matched}/{len(listings)} ({matched/len(listings)*100:.1f}%)")
    
    # Top 5 by total score
    sorted_list = sorted(enhanced, key=lambda x: int(x['total_score']) if x['total_score'] else 0, reverse=True)
    print("\n🏆 TOP 5 OPPORTUNITIES:")
    for i, lst in enumerate(sorted_list[:5]):
        gap = lst.get('gap_percent', '')
        cv = lst.get('capital_value', '')
        if cv:
            cv_fmt = f"${int(cv):,}"
        else:
            cv_fmt = "N/A"
        print(f"{i+1}. {lst['address']}")
        print(f"   Price: {lst['price']}, CV: {cv_fmt}, Gap: {gap}%")
        print(f"   Score: {lst['total_score']}, URL: {lst['url']}")
        print()
    
    print(f"\nFull results saved to: {output_csv}")
    return output_csv

if __name__ == "__main__":
    main()