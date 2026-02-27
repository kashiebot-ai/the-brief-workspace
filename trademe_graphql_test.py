#!/usr/bin/env python3
"""
Test TradeMe GraphQL API for property search.
"""

import requests
import json
import time

GRAPHQL_URL = 'https://api.trademe.co.nz/graphql/'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Content-Type': 'application/json',
    'Origin': 'https://www.trademe.co.nz',
    'Referer': 'https://www.trademe.co.nz/a/property/residential/sale'
}

def run_query(query, variables=None):
    """Run GraphQL query."""
    payload = {'query': query}
    if variables:
        payload['variables'] = variables
    
    try:
        response = requests.post(GRAPHQL_URL, json=payload, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Query error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response text: {e.response.text[:200]}")
        return None

def test_property_search():
    """Test property search query."""
    # Try to find a query from the website by looking for common patterns
    # This is a guess - we need to reverse engineer the actual query
    query = '''
    query PropertySearch($input: PropertySearchInput) {
      propertySearch(input: $input) {
        totalCount
        items {
          id
          title
          priceDisplay
          address {
            fullAddress
            suburb
            city
          }
          listingType
          propertyType
          bedrooms
          bathrooms
          landArea
          listingDate
        }
      }
    }
    '''
    
    variables = {
        'input': {
            'region': 9,  # Hawke's Bay
            'district': 43,  # Napier
            'priceMin': 300000,
            'priceMax': 350000,
            'propertyType': 'House'
        }
    }
    
    print("Testing property search query...")
    result = run_query(query, variables)
    
    if result:
        print(f"Result keys: {result.keys()}")
        if 'errors' in result:
            print(f"Errors: {result['errors']}")
        elif 'data' in result:
            print(f"Data keys: {result['data'].keys()}")
            if 'propertySearch' in result['data']:
                search_result = result['data']['propertySearch']
                print(f"Total count: {search_result.get('totalCount', 'N/A')}")
                items = search_result.get('items', [])
                print(f"Found {len(items)} items")
                for i, item in enumerate(items[:3]):
                    print(f"  {i+1}. {item.get('title', 'N/A')}")
                    print(f"     Price: {item.get('priceDisplay', 'N/A')}")
                    print(f"     Address: {item.get('address', {}).get('fullAddress', 'N/A')}")
            else:
                print("No propertySearch in data")
                # Print first 500 chars to see what's there
                print(json.dumps(result['data'], indent=2)[:500])
        else:
            print("No data in result")
    
    return result

def find_query_from_page():
    """Try to extract actual GraphQL queries from the page."""
    # Download the page and look for GraphQL queries
    import re
    url = 'https://www.trademe.co.nz/a/property/residential/sale?price_min=300000&price_max=350000&region=9&district=43'
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        # Look for GraphQL query patterns
        patterns = [
            r'query\s+\w+\s*\([^)]*\)\s*\{[^}]+(?:\{[^}]*\}[^}]*)*\}',
            r'propertySearch',
            r'PropertySearch'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, response.text, re.DOTALL)
            if matches:
                print(f"Found {len(matches)} matches for pattern: {pattern[:20]}...")
                for match in matches[:2]:
                    print(f"Match: {match[:200]}...")
                break
        
        # Also look for JSON with queries
        if 'GraphQL' in response.text or 'graphql' in response.text:
            print("Found GraphQL references")
            
    except Exception as e:
        print(f"Error fetching page: {e}")

if __name__ == "__main__":
    print("TradeMe GraphQL API Test")
    print("=" * 50)
    
    # First try to find queries from page
    # find_query_from_page()
    
    # Then test our guess
    test_property_search()