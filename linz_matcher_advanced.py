#!/usr/bin/env python3
"""
Advanced LINZ address matcher with fuzzy matching and multiple variations.
"""

import csv
import re
import requests
import time
from datetime import datetime
from typing import List, Tuple, Optional, Dict

LINZ_API_KEY = "4c5b18e5c1e04cb8b9819538260cdb18"
BASE_URL = f"https://data.linz.govt.nz/services;key={LINZ_API_KEY}/wfs/table-114085/"

# Hawke's Bay TA codes (confirmed: 60=Napier, 62=Hastings)
# Unknown: 61=Central Hawke's Bay? 63=Wairoa? Include for search
HAWKE_BAY_TA_CODES = [60, 62, 61, 63]

# Suburb to TA mapping (case-insensitive)
SUBURB_TA_MAP = {
    # Napier (60)
    'napier': 60, 'taradale': 60, 'ahuriri': 60, 'hospital hill': 60,
    'westshore': 60, 'pirimai': 60, 'onekawa': 60, 'mclean park': 60,
    'napier central': 60, 'napier south': 60, 'bluff hill': 60,
    # Hastings (62)
    'hastings': 62, 'havelock north': 62, 'raureka': 62, 'flaxmere': 62,
    'camria': 62, 'mayfair': 62, 'frimley': 62, 'st leonards': 62,
    'mahora': 62, 'parkvale': 62, 'akina': 62, 'clive': 62,
    # Central Hawke's Bay (likely 61)
    'waipukurau': 61, 'waipawa': 61, 'otane': 61, 'tikokino': 61,
    'takapau': 61,
    # Wairoa (likely 63)
    'wairoa': 63, 'mahia': 63, 'frasertown': 63, 'tuai': 63,
}

# Street type abbreviations
STREET_ABBREVIATIONS = {
    'ROAD': 'RD',
    'STREET': 'ST',
    'AVENUE': 'AVE',
    'DRIVE': 'DR',
    'PLACE': 'PL',
    'COURT': 'CT',
    'LANE': 'LN',
    'BOULEVARD': 'BLVD',
    'TERRACE': 'TER',
    'CRESCENT': 'CRES',
    'HIGHWAY': 'HWY',
    'PARADE': 'PDE',
    'WAY': 'WY',
    'GROVE': 'GR',
    'CLOSE': 'CL',
    'WALK': 'WK',
    'MALL': 'ML',
    'CIRCUIT': 'CCT',
    'RISE': 'RSE',
}

def extract_suburb(address: str) -> str:
    """Extract suburb name from address string."""
    # Format: "1005 Oliphant Road, Raureka" or "... , Havelock North"
    parts = address.split(',')
    if len(parts) > 1:
        suburb = parts[-1].strip().lower()
        # Remove any trailing region info like "Hawke's Bay 4120"
        suburb = re.sub(r'\s*hawkes?\s*bay\s*\d*', '', suburb)
        suburb = suburb.strip()
        return suburb
    return ''

def guess_ta_from_suburb(suburb: str) -> List[int]:
    """Return list of probable TA codes for suburb."""
    if not suburb:
        return HAWKE_BAY_TA_CODES  # Search all
    
    codes = []
    for key, code in SUBURB_TA_MAP.items():
        if key in suburb:
            codes.append(code)
    
    if not codes:
        # Default to Napier & Hastings
        return [60, 62]
    
    return list(set(codes))

def normalize_street_name(street: str) -> List[str]:
    """
    Generate multiple street name variations for matching.
    Returns list of candidate strings.
    """
    street = street.upper().strip()
    # Remove any trailing comma (LINZ data sometimes has it)
    street = street.rstrip(',')
    
    variations = set()
    variations.add(street)
    
    # Abbreviate street types
    abbreviated = street
    for full, abbr in STREET_ABBREVIATIONS.items():
        # Replace whole word only
        pattern = rf'\b{full}\b'
        abbreviated = re.sub(pattern, abbr, abbreviated)
    if abbreviated != street:
        variations.add(abbreviated)
    
    # Also try expanding abbreviations (if present)
    expanded = street
    for full, abbr in STREET_ABBREVIATIONS.items():
        pattern = rf'\b{abbr}\b'
        expanded = re.sub(pattern, full, expanded)
    if expanded != street:
        variations.add(expanded)
    
    # Remove directional suffixes (NORTH, SOUTH, EAST, WEST)
    for suffix in [' NORTH', ' SOUTH', ' EAST', ' WEST', ' N', ' S', ' E', ' W']:
        if street.endswith(suffix):
            base = street[:-len(suffix)].strip()
            variations.add(base)
            # Also try abbreviated version of base
            base_abbr = base
            for full, abbr in STREET_ABBREVIATIONS.items():
                base_abbr = re.sub(rf'\b{full}\b', abbr, base_abbr)
            if base_abbr != base:
                variations.add(base_abbr)
    
    # Remove street type entirely (last word)
    words = street.split()
    if len(words) > 1:
        base_name = ' '.join(words[:-1])
        variations.add(base_name)
    
    # Try removing "THE " prefix
    if street.startswith('THE '):
        variations.add(street[4:])
    
    # Try with and without punctuation
    no_punct = re.sub(r'[^\w\s]', '', street)
    if no_punct != street:
        variations.add(no_punct)
    
    return list(variations)

def parse_address(address: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Parse address into components.
    Returns: (street_number, street_name, suburb)
    """
    # Remove any quotes
    address = address.replace('"', '').strip()
    
    # Split by comma for suburb
    parts = [p.strip() for p in address.split(',')]
    main_part = parts[0]
    suburb = parts[1] if len(parts) > 1 else ''
    
    # Parse street number and name
    # Handle unit numbers like "153A" or "7D"
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main_part)
    if match:
        number = match.group(1)
        street = match.group(2)
        return number, street.upper(), suburb.lower()
    
    # Try without unit letter
    match = re.match(r'^(\d+)\s+(.+)', main_part)
    if match:
        number = match.group(1)
        street = match.group(2)
        return number, street.upper(), suburb.lower()
    
    return None, None, suburb.lower()

def query_linz_advanced(street_number: str, street_name: str, ta_codes: List[int]) -> Optional[Dict]:
    """
    Advanced query with multiple variations and fallbacks.
    """
    street_variations = normalize_street_name(street_name)
    
    # Strategy 1: Exact number + street match
    for street_var in street_variations:
        for ta in ta_codes:
            # Clean street var for CQL
            street_clean = street_var.replace("'", "''")  # Escape single quotes
            cql = f"situation_number = '{street_number}' AND situation_name ILIKE '%{street_clean}%' AND district_ta_code = {ta}"
            
            try:
                data = query_linz(cql)
                if data and data.get('features'):
                    props = data['features'][0]['properties']
                    print(f"    ✓ Exact match: TA {ta}, street '{street_var[:30]}...'")
                    return props
            except Exception as e:
                pass
            
            time.sleep(0.05)
    
    # Strategy 2: Street match only (ignore number)
    for street_var in street_variations:
        for ta in ta_codes:
            street_clean = street_var.replace("'", "''")
            cql = f"situation_name ILIKE '%{street_clean}%' AND district_ta_code = {ta}"
            
            try:
                data = query_linz(cql)
                if data and data.get('features'):
                    # Find the feature with closest number match
                    features = data['features']
                    # Try exact number first
                    for feat in features:
                        props = feat['properties']
                        if props.get('situation_number') == street_number:
                            print(f"    ✓ Street match with number: TA {ta}")
                            return props
                    # Return first
                    print(f"    ✓ Street match (different number): TA {ta}")
                    return features[0]['properties']
            except Exception as e:
                pass
            
            time.sleep(0.05)
    
    # Strategy 3: Try without TA filter (search all Hawke's Bay)
    for street_var in street_variations:
        street_clean = street_var.replace("'", "''")
        ta_filter = " OR ".join([f"district_ta_code = {ta}" for ta in HAWKE_BAY_TA_CODES])
        cql = f"situation_number = '{street_number}' AND situation_name ILIKE '%{street_clean}%' AND ({ta_filter})"
        
        try:
            data = query_linz(cql)
            if data and data.get('features'):
                props = data['features'][0]['properties']
                print(f"    ✓ Match across all Hawke's Bay TAs")
                return props
        except Exception as e:
            pass
        
        time.sleep(0.05)
    
    return None

def query_linz(cql_filter: str) -> Optional[Dict]:
    """Execute LINZ query with given CQL filter."""
    params = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeName": "data.linz.govt.nz:table-114085",
        "count": 10,  # Get more for street-only matches
        "outputFormat": "json",
        "CQL_FILTER": cql_filter
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"    Query error: {e}")
        return None

def parse_price(price_str: str) -> Optional[float]:
    """Extract numeric price."""
    if not price_str:
        return None
    
    # Remove currency and commas
    clean = price_str.replace('$', '').replace(',', '').strip()
    
    # Find first number
    match = re.search(r'(\d+(?:\.\d+)?)', clean)
    if match:
        try:
            return float(match.group(1))
        except:
            pass
    
    return None

def calculate_gap(asking: Optional[float], cv: Optional[int]) -> Optional[float]:
    """Calculate percentage gap (CV - asking) / CV."""
    if not cv or cv <= 0:
        return None
    if not asking or asking <= 0:
        return None
    
    gap = (cv - asking) / cv
    return gap * 100

def main():
    input_csv = "property_listings_enhanced_20260219_0858.csv"
    timestamp = datetime.now().strftime('%Y%m%d_%H%M')
    output_csv = f"property_listings_cv_advanced_{timestamp}.csv"
    
    print("=== Advanced LINZ Matcher ===")
    print(f"Time: {datetime.now().strftime('%H:%M:%S')}")
    
    # Read listings
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
        
        print(f"\n[{i+1}/{len(listings)}] {address}")
        print(f"   Price: {price_str}")
        
        # Parse address
        street_number, street_name, suburb = parse_address(address)
        
        if not street_number or not street_name:
            print(f"   ❌ Cannot parse address")
            # Add empty fields
            add_empty_fields(listing)
            enhanced.append(listing)
            continue
        
        print(f"   Parsed: {street_number} {street_name}, Suburb: {suburb}")
        
        # Guess TA codes from suburb
        ta_codes = guess_ta_from_suburb(suburb)
        print(f"   TA codes to try: {ta_codes}")
        
        # Query LINZ
        cv_data = query_linz_advanced(street_number, street_name, ta_codes)
        
        if cv_data:
            matched += 1
            cv = cv_data.get('capital_value')
            land_ha = cv_data.get('land_area')
            condition = cv_data.get('building_condition_indicator')
            age = cv_data.get('building_age_indicator')
            ta = cv_data.get('district_ta_code')
            bedrooms = cv_data.get('no_of_bedrooms')
            floor_area = cv_data.get('building_total_floor_area')
            
            # Calculate gap if possible
            asking = parse_price(price_str)
            gap_pct = calculate_gap(asking, cv)
            
            # Convert land area to m²
            land_m2 = None
            if land_ha is not None:
                land_m2 = land_ha * 10000
            
            print(f"   ✅ MATCH (TA {ta})")
            print(f"      CV: ${cv:,}" if cv else "      CV: N/A")
            if land_m2:
                print(f"      Land: {land_m2:.0f}m²")
            if condition:
                print(f"      Condition: {condition}")
            if age:
                print(f"      Age indicator: {age}")
            if gap_pct is not None:
                print(f"      Gap: {gap_pct:.1f}%")
            
            # Add fields
            listing['ta_code'] = ta if ta is not None else ''
            listing['capital_value'] = cv if cv is not None else ''
            listing['land_area_m2'] = land_m2 if land_m2 is not None else ''
            listing['cv_condition'] = condition if condition is not None else ''
            listing['cv_age'] = age if age is not None else ''
            listing['cv_bedrooms'] = bedrooms if bedrooms is not None else ''
            listing['cv_floor_area'] = floor_area if floor_area is not None else ''
            listing['gap_percent'] = f"{gap_pct:.1f}" if gap_pct is not None else ''
            listing['linz_match'] = 'YES'
        else:
            print(f"   ❌ NO MATCH after all strategies")
            add_empty_fields(listing)
            listing['linz_match'] = 'NO'
        
        enhanced.append(listing)
        
        # Be polite to API
        time.sleep(0.2)
    
    # Write results
    fieldnames = list(enhanced[0].keys())
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(enhanced)
    
    # Summary
    print(f"\n=== COMPLETE ===")
    print(f"Matched {matched}/{len(listings)} listings ({matched/len(listings)*100:.1f}%)")
    print(f"Output: {output_csv}")
    
    # Show top opportunities with gaps
    opportunities = []
    for lst in enhanced:
        if lst.get('gap_percent') and lst['gap_percent']:
            try:
                gap = float(lst['gap_percent'])
                if gap > 0:  # Only positive gaps (CV > asking)
                    opportunities.append((lst, gap))
            except:
                pass
    
    if opportunities:
        opportunities.sort(key=lambda x: x[1], reverse=True)
        print("\n🏆 TOP CV GAP OPPORTUNITIES:")
        for i, (lst, gap) in enumerate(opportunities[:5]):
            cv = lst.get('capital_value', '')
            cv_fmt = f"${int(cv):,}" if cv else "N/A"
            print(f"{i+1}. {lst['address']}")
            print(f"   Price: {lst['price']}, CV: {cv_fmt}, Gap: {gap:.1f}%")
            print(f"   Condition: {lst.get('cv_condition', 'Unknown')}")
            print(f"   URL: {lst['url']}")
            print()
    
    return output_csv

def add_empty_fields(listing: Dict):
    """Add empty CV fields to listing."""
    fields = ['ta_code', 'capital_value', 'land_area_m2', 'cv_condition',
              'cv_age', 'cv_bedrooms', 'cv_floor_area', 'gap_percent']
    for f in fields:
        listing[f] = ''

if __name__ == "__main__":
    main()