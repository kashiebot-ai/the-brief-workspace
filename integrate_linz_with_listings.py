#!/usr/bin/env python3
"""
Integrate LINZ Council Valuation data with existing property listings.
"""

import csv
import re
import json
import time
import requests
from typing import Optional, Dict, List, Tuple
from datetime import datetime

LINZ_API_KEY = "4c5b18e5c1e04cb8b9819538260cdb18"
BASE_URL = f"https://data.linz.govt.nz/services;key={LINZ_API_KEY}/wfs/table-114085/"

# Hawke's Bay territorial authority codes (confirmed: 60=Napier, 62=Hastings)
# Central Hawke's Bay likely 61, Wairoa likely 63 (to verify)
HAWKE_BAY_TA_CODES = [60, 62, 61, 63]  # Include guessed codes

def normalize_street_name(street: str) -> List[str]:
    """
    Generate multiple variations of street name for matching.
    Returns list of possible street name strings.
    """
    street = street.upper().strip()
    variations = [street]
    
    # Abbreviate common terms
    abbrev_map = {
        "ROAD": "RD",
        "STREET": "ST",
        "AVENUE": "AVE",
        "DRIVE": "DR",
        "PLACE": "PL",
        "COURT": "CT",
        "LANE": "LN",
        "BOULEVARD": "BLVD",
        "TERRACE": "TER",
        "CRESCENT": "CRES",
        "HIGHWAY": "HWY",
        "PARADE": "PDE",
        "NORTH": "N",
        "SOUTH": "S",
        "EAST": "E",
        "WEST": "W"
    }
    
    # Create abbreviated version
    abbreviated = street
    for full, abbr in abbrev_map.items():
        abbreviated = re.sub(rf'\b{full}\b', abbr, abbreviated)
    if abbreviated != street:
        variations.append(abbreviated)
    
    # Also try without suffix (e.g., "MARKET STREET SOUTH" -> "MARKET STREET")
    # Remove directional suffixes
    for suffix in [" NORTH", " SOUTH", " EAST", " WEST", " N", " S", " E", " W"]:
        if street.endswith(suffix):
            variations.append(street[:-len(suffix)].strip())
    
    # Remove street type (last word)
    words = street.split()
    if len(words) > 1:
        variations.append(" ".join(words[:-1]))
    
    return list(set(variations))

def parse_address(address: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Parse street number and street name from address.
    Format: "1005 Oliphant Road, Raureka" or "65 Margaret Avenue, Havelock North"
    Returns: (street_number, street_name)
    """
    # Remove suburb/city after comma
    main_part = address.split(',')[0].strip()
    # Match number at start (including letters like 153A)
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main_part)
    if match:
        number = match.group(1)
        street = match.group(2)
        return number, street
    return None, None

def query_linz_multiple(street_number: str, street_name: str, ta_codes: List[int] = None) -> Optional[Dict]:
    """
    Query LINZ WFS API with multiple street name variations.
    Returns first matching feature's properties, or None.
    """
    if ta_codes is None:
        ta_codes = HAWKE_BAY_TA_CODES
    
    street_variations = normalize_street_name(street_name)
    
    for street_var in street_variations:
        # Try exact street number match first
        filters = []
        filters.append(f"situation_number = '{street_number}'")
        filters.append(f"situation_name ILIKE '%{street_var}%'")
        if ta_codes:
            ta_filter = " OR ".join([f"district_ta_code = {code}" for code in ta_codes])
            filters.append(f"({ta_filter})")
        
        cql_filter = " AND ".join(filters)
        
        params = {
            "service": "WFS",
            "version": "2.0.0",
            "request": "GetFeature",
            "typeName": "data.linz.govt.nz:table-114085",
            "count": 5,
            "outputFormat": "json",
            "CQL_FILTER": cql_filter
        }
        
        try:
            response = requests.get(BASE_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if data.get("features") and len(data["features"]) > 0:
                # Return first matching property
                return data["features"][0]["properties"]
        except Exception as e:
            print(f"    Query error for {street_var}: {e}")
        
        # Be polite
        time.sleep(0.1)
    
    # If still no match, try without street number
    for street_var in street_variations:
        filters = []
        filters.append(f"situation_name ILIKE '%{street_var}%'")
        if ta_codes:
            ta_filter = " OR ".join([f"district_ta_code = {code}" for code in ta_codes])
            filters.append(f"({ta_filter})")
        
        cql_filter = " AND ".join(filters)
        
        params["CQL_FILTER"] = cql_filter
        
        try:
            response = requests.get(BASE_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if data.get("features") and len(data["features"]) > 0:
                # Try to find matching street number
                for feature in data["features"]:
                    props = feature["properties"]
                    if props.get("situation_number") == street_number:
                        return props
                # Return first
                return data["features"][0]["properties"]
        except Exception as e:
            pass
        
        time.sleep(0.1)
    
    return None

def parse_price(price_str: str) -> Optional[float]:
    """
    Extract numeric price from string.
    Returns float or None.
    """
    if not price_str:
        return None
    
    # Remove currency and commas
    price_str = price_str.replace('$', '').replace(',', '').strip()
    
    # Check for "Offers Over $570,000" etc.
    match = re.search(r'(\d+(?:\.\d+)?)', price_str)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    
    return None

def calculate_gap(asking_price: Optional[float], capital_value: Optional[int]) -> Optional[float]:
    """
    Calculate percentage gap (CV - asking) / CV.
    Returns percentage (e.g., 15.5 for 15.5%).
    """
    if not capital_value or capital_value <= 0:
        return None
    if not asking_price or asking_price <= 0:
        return None
    
    gap = (capital_value - asking_price) / capital_value
    return gap * 100

def main():
    input_csv = "property_listings_enhanced_20260219_0858.csv"
    output_csv = f"property_listings_with_cv_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    
    print(f"=== LINZ CV Integration ===")
    print(f"Input: {input_csv}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Read listings
    listings = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            listings.append(row)
    
    print(f"Loaded {len(listings)} listings")
    
    # Process each listing
    enhanced = []
    matched = 0
    
    for i, listing in enumerate(listings):
        address = listing['address']
        price_str = listing['price']
        print(f"\n[{i+1}/{len(listings)}] {address}")
        
        # Parse address
        street_number, street_name = parse_address(address)
        if not street_number or not street_name:
            print(f"  Could not parse address")
            enhanced.append(listing)
            continue
        
        print(f"  Street: {street_number} {street_name}")
        
        # Query LINZ
        cv_data = query_linz_multiple(street_number, street_name)
        
        if cv_data:
            matched += 1
            ta_code = cv_data.get('district_ta_code')
            capital_value = cv_data.get('capital_value')
            land_value = cv_data.get('land_value')
            improvements_value = cv_data.get('improvements_value')
            land_area_ha = cv_data.get('land_area')
            condition = cv_data.get('building_condition_indicator')
            age = cv_data.get('building_age_indicator')
            bedrooms = cv_data.get('no_of_bedrooms')
            floor_area = cv_data.get('building_total_floor_area')
            
            # Convert land area from hectares to m²
            land_area_m2 = None
            if land_area_ha is not None:
                land_area_m2 = land_area_ha * 10000
            
            # Calculate gap if possible
            asking_price = parse_price(price_str)
            gap_pct = calculate_gap(asking_price, capital_value)
            
            print(f"  ✅ MATCH (TA {ta_code})")
            print(f"     CV: ${capital_value:,}" if capital_value else "     CV: N/A")
            print(f"     Land: {land_area_m2:.0f}m²" if land_area_m2 else "     Land: N/A")
            print(f"     Condition: {condition}" if condition else "     Condition: N/A")
            if gap_pct:
                print(f"     Gap: {gap_pct:.1f}%")
            
            # Add CV fields to listing
            listing['ta_code'] = ta_code if ta_code is not None else ''
            listing['capital_value'] = capital_value if capital_value is not None else ''
            listing['land_value'] = land_value if land_value is not None else ''
            listing['improvements_value'] = improvements_value if improvements_value is not None else ''
            listing['land_area_m2'] = land_area_m2 if land_area_m2 is not None else ''
            listing['cv_condition'] = condition if condition is not None else ''
            listing['cv_age'] = age if age is not None else ''
            listing['cv_bedrooms'] = bedrooms if bedrooms is not None else ''
            listing['cv_floor_area'] = floor_area if floor_area is not None else ''
            listing['gap_percent'] = f"{gap_pct:.1f}" if gap_pct is not None else ''
            listing['linz_match'] = 'YES'
        else:
            print(f"  ❌ NO MATCH")
            # Add empty fields
            for field in ['ta_code', 'capital_value', 'land_value', 'improvements_value',
                         'land_area_m2', 'cv_condition', 'cv_age', 'cv_bedrooms',
                         'cv_floor_area', 'gap_percent']:
                listing[field] = ''
            listing['linz_match'] = 'NO'
        
        enhanced.append(listing)
        
        # Be polite to API
        time.sleep(0.3)
    
    # Write enhanced CSV
    fieldnames = list(enhanced[0].keys())
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(enhanced)
    
    print(f"\n=== COMPLETE ===")
    print(f"Matched {matched}/{len(listings)} listings ({matched/len(listings)*100:.1f}%)")
    print(f"Output: {output_csv}")
    
    # Summary of gaps
    gaps = []
    for listing in enhanced:
        if listing.get('gap_percent'):
            try:
                gap = float(listing['gap_percent'])
                gaps.append(gap)
            except:
                pass
    
    if gaps:
        print(f"Gap range: {min(gaps):.1f}% to {max(gaps):.1f}%")
        avg = sum(gaps) / len(gaps)
        print(f"Average gap: {avg:.1f}%")
        
        # Count properties with >15% gap
        high_gap = sum(1 for g in gaps if g > 15)
        print(f"Properties with >15% gap: {high_gap}")
    
    return output_csv

if __name__ == "__main__":
    main()