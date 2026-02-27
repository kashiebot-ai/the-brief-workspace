#!/usr/bin/env python3
import sys
sys.path.append('.')
from social_arbitrage.scanner import load_mapping, search_keyword, load_brave_key
import json

mapping = load_mapping()
print(f"Total mappings: {len(mapping)}")
# Pick one keyword
keyword = mapping[0]['keyword']
print(f"Testing keyword: {keyword}")
result = search_keyword(keyword, freshness='pd')
print(json.dumps(result, indent=2))