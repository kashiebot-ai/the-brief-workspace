#!/usr/bin/env python3
import json
import requests
import os

# Load Brave API key from OpenClaw config
CONFIG_PATH = os.path.expanduser("~/.openclaw/openclaw.json")
with open(CONFIG_PATH, 'r') as f:
    config = json.load(f)
key = config.get("tools", {}).get("web", {}).get("search", {}).get("apiKey")
print(f"API Key loaded: {key[:10]}...")

# Test search
headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": key,
}
params = {
    "q": "test",
    "count": 3,
    "freshness": "pd",
}

try:
    print("Testing Brave API...")
    resp = requests.get("https://api.search.brave.com/res/v1/web/search", 
                       headers=headers, params=params, timeout=30)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Success! Got {len(data.get('web', {}).get('results', []))} results")
    else:
        print(f"Error: {resp.text}")
except Exception as e:
    print(f"Exception: {e}")