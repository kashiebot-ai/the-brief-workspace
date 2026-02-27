#!/usr/bin/env python3
import json
import requests
import os
import time

# Load Brave API key from OpenClaw config
CONFIG_PATH = os.path.expanduser("~/.openclaw/openclaw.json")
with open(CONFIG_PATH, 'r') as f:
    config = json.load(f)
key = config.get("tools", {}).get("web", {}).get("search", {}).get("apiKey")

def search_keyword(keyword):
    """Search Brave for keyword."""
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": key,
    }
    params = {
        "q": keyword,
        "count": 10,
        "freshness": "pd",
    }
    print(f"Searching for '{keyword}'...")
    start = time.time()
    try:
        resp = requests.get("https://api.search.brave.com/res/v1/web/search", 
                           headers=headers, params=params, timeout=10)
        elapsed = time.time() - start
        print(f"  Request took {elapsed:.2f} seconds")
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            results = data.get("web", {}).get("results", [])
            print(f"  Got {len(results)} results")
            return len(results)
        else:
            print(f"  Error: {resp.text[:100]}")
            return 0
    except Exception as e:
        elapsed = time.time() - start
        print(f"  Exception after {elapsed:.2f}s: {e}")
        return 0

# Test with a few keywords
keywords = ["Stanley drinkware", "Tesla", "iPhone"]
for kw in keywords:
    search_keyword(kw)
    print()