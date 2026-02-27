#!/usr/bin/env python3
"""
Test address matching with LINZ API using existing functions.
"""
import sys
sys.path.insert(0, '.')

from integrate_linz_with_listings import parse_address, query_linz_multiple

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
    "20 Faraday Street, Hospital Hill",
    "15 Rutherglen Avenue, Napier",  # Known to exist in LINZ
]

for addr in test_addresses:
    print(f"\n--- Testing: {addr} ---")
    number, street = parse_address(addr)
    if not number or not street:
        print("  Failed to parse")
        continue
    print(f"  Parsed: number='{number}', street='{street}'")
    result = query_linz_multiple(number, street, ta_codes=[60, 62, 61, 63])
    if result:
        print(f"  ✅ MATCH: CV ${result.get('capital_value'):,}")
        print(f"     Situation: {result.get('situation_number')} {result.get('situation_name')}")
        print(f"     TA: {result.get('district_ta_code')}")
    else:
        print("  ❌ NO MATCH")