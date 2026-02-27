#!/usr/bin/env python3
"""
LINZ API integration for property valuation lookups.
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
# Need to identify Central Hawke's Bay (likely 61) and Wairoa (likely 63?)
HAWKE_BAY_TA_CODES = [60, 62]  # Will expand as we identify

def normalize_street_name(street: str) -> str:
    """Normalize street name for matching with LINZ data."""
    # Convert to uppercase
    street = street.upper().strip()
    # Common abbreviations (LINZ may use abbreviations)
    replacements = {
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
    }
    for full, abbr in replacements.items():
        street = re.sub(rf'\b{full}\b', abbr, street)
    return street

def parse_address(address: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Parse street number and street name from address.
    Format: "1005 Oliphant Road, Raureka" or "65 Margaret Avenue, Havelock North"
    Returns: (street_number, street_name)
    """
    # Remove suburb/city after comma
    main_part = address.split(',')[0].strip()
    # Match number at start
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main_part)
    if match:
        number = match.group(1)
        street = match.group(2)
        return number, street
    return None, None

def query_linz(street_number: str, street_name: str, ta_codes: List[int] = None) -> Optional[Dict]:
    """
    Query LINZ WFS API for property matching street number and name.
    Returns first matching feature's properties, or None.
    """
    if ta_codes is None:
        ta_codes = HAWKE_BAY_TA_CODES
    
    # Try exact match first
    normalized_street = normalize_street_name(street_name)
    
    # Build CQL filter
    filters = []
    filters.append(f"situation_number = '{street_number}'")
    filters.append(f"situation_name ILIKE '%{normalized_street}%'")
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
        else:
            # Try without street number (maybe unit number issues)
            filters = []
            filters.append(f"situation_name ILIKE '%{normalized_street}%'")
            if ta_codes:
                ta_filter = " OR ".join([f"district_ta_code = {code}" for code in ta_codes])
                filters.append(f"({ta_filter})")
            
            cql_filter = " AND ".join(filters)
            params["CQL_FILTER"] = cql_filter
            
            response = requests.get(BASE_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if data.get("features") and len(data["features"]) > 0:
                # Find the one with matching street number (approximate)
                for feature in data["features"]:
                    props = feature["properties"]
                    if props.get("situation_number") == street_number:
                        return props
                # Return first anyway
                return data["features"][0]["properties"]
            
    except Exception as e:
        print(f"  LINZ query error: {e}")
    
    return None

def calculate_value_gap(asking_price: Optional[str], capital_value: Optional[int]) -> Optional[float]:
    """
    Calculate percentage gap between asking price and capital value.
    Returns None if cannot calculate.
    """
    if not capital_value or capital_value <= 0:
        return None
    
    # Parse asking price
    if not asking_price:
        return None
    
    # Extract numeric value from strings like "$570,000", "Deadline Sale", "Negotiation"
    asking_price_clean = asking_price.replace('$', '').replace(',', '').strip()
    
    # Check if it's a numeric price
    if asking_price_clean.replace('.', '').isdigit():
        asking = float(asking_price_clean)
        gap = (capital_value - asking) / capital_value
        return gap * 100  # as percentage
    
    # If it's "Offers Over $570,000" or similar
    match = re.search(r'(\$?[\d,]+(?:\.\d+)?)', asking_price)
    if match:
        numeric_str = match.group(1).replace('$', '').replace(',', '')
        try:
            asking = float(numeric_str)
            gap = (capital_value - asking) / capital_value
            return gap * 100
        except ValueError:
            pass
    
    return None

def main():
    print("=== LINZ API Integration Test ===")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test with sample addresses from our CSV
    test_addresses = [
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
    
    for address in test_addresses:
        print(f"\n--- Testing: {address}")
        street_number, street_name = parse_address(address)
        if not street_number or not street_name:
            print(f"  Could not parse address")
            continue
        
        print(f"  Parsed: {street_number} {street_name}")
        
        # Query LINZ
        properties = query_linz(street_number, street_name)
        
        if properties:
            cv = properties.get("capital_value")
            land_area = properties.get("land_area")
            condition = properties.get("building_condition_indicator")
            age = properties.get("building_age_indicator")
            ta_code = properties.get("district_ta_code")
            
            print(f"  ✅ Found in TA code {ta_code}")
            print(f"     CV: ${cv:,}" if cv else "     CV: N/A")
            print(f"     Land area: {land_area} ha" if land_area else "     Land area: N/A")
            print(f"     Condition: {condition}" if condition else "     Condition: N/A")
            print(f"     Age indicator: {age}" if age else "     Age indicator: N/A")
            
            # Test gap calculation with dummy asking price
            gap = calculate_value_gap("$500,000", cv)
            if gap:
                print(f"     Sample gap (vs $500k): {gap:.1f}%")
        else:
            print(f"  ❌ No match found in LINZ")
        
        # Be polite to API
        time.sleep(0.5)
    
    print("\n=== Integration ready for full property scraper ===")

if __name__ == "__main__":
    main()