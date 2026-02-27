#!/usr/bin/env python3
"""
Test address parsing and normalization.
"""

import re

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
}

def parse_address(address: str):
    """Return (number, street, suburb)."""
    address = address.replace('"', '').strip()
    parts = [p.strip() for p in address.split(',')]
    main = parts[0]
    suburb = parts[1] if len(parts) > 1 else ''
    
    # Match unit numbers like 153A
    match = re.match(r'^(\d+[A-Z]?)\s+(.+)', main)
    if match:
        return match.group(1), match.group(2).upper(), suburb.lower()
    
    match = re.match(r'^(\d+)\s+(.+)', main)
    if match:
        return match.group(1), match.group(2).upper(), suburb.lower()
    
    return None, None, suburb.lower()

def normalize_street(street: str):
    """Generate variations."""
    street = street.upper().strip().rstrip(',')
    variations = set([street])
    
    # Abbreviate
    abbrev = street
    for full, abbr in STREET_ABBREVIATIONS.items():
        abbrev = re.sub(rf'\b{full}\b', abbr, abbrev)
    if abbrev != street:
        variations.add(abbrev)
    
    # Expand abbreviations
    expanded = street
    for full, abbr in STREET_ABBREVIATIONS.items():
        expanded = re.sub(rf'\b{abbr}\b', full, expanded)
    if expanded != street:
        variations.add(expanded)
    
    # Remove directional suffixes
    for suffix in [' NORTH', ' SOUTH', ' EAST', ' WEST', ' N', ' S', ' E', ' W']:
        if street.endswith(suffix):
            base = street[:-len(suffix)].strip()
            variations.add(base)
    
    # Remove street type
    words = street.split()
    if len(words) > 1:
        variations.add(' '.join(words[:-1]))
    
    return list(variations)

# Test addresses from CSV
addresses = [
    '"1005 Oliphant Road, Raureka"',
    '"65 Margaret Avenue, Havelock North"',
    '"607 Market Street South, Hastings"',
    '"102 Newcastle Street, Mahia"',
    '"153A Middle Road, Havelock North"',
    '"8 Hikanui Drive, Havelock North"',
    '"17 Addington Place, Taradale"',
    '"14 Francis Drake Street, Waipukurau"',
    '"148 Battery Road, Ahuriri"',
    '"20 Faraday Street, Hospital Hill"',
    '"7D Whakatomo Place, Havelock North"',
    '"9 Russell Robertson Drive, Havelock North"',
    '"1200 Caroline Road, Mayfair"',
    '"36 Hikawera Drive, Frimley"',
    '"35 Pukeko Place, Westshore"',
    '"12 Jellicoe Avenue, Wairoa"',
]

print("=== Address Parsing Test ===")
for addr in addresses:
    num, street, suburb = parse_address(addr)
    vars = normalize_street(street) if street else []
    print(f"\n{addr}")
    print(f"  Number: {num}, Street: {street}, Suburb: {suburb}")
    print(f"  Variations: {vars[:3]}...")
    if len(vars) > 3:
        print(f"            +{len(vars)-3} more")