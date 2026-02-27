#!/usr/bin/env python3
import sys
sys.path.insert(0, '.')
from scanner import load_brave_key, search_keyword, load_mapping
import time

def test():
    mapping = load_mapping()
    print(f"Total mappings: {len(mapping)}")
    # Test first 2
    for i in range(2):
        item = mapping[i]
        print(f"Testing '{item['keyword']}' -> {item['ticker']}")
        result = search_keyword(item['keyword'], freshness="pd")
        print(f"  Results: {result['total_results']}")
        if result['results']:
            for res in result['results'][:2]:
                title = res.get('title', '').replace('\n', ' ').strip()[:80]
                print(f"    - {title}")
        time.sleep(61)

if __name__ == "__main__":
    test()