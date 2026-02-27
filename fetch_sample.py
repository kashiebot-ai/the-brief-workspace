#!/usr/bin/env python3
import requests
import sys

url = "https://data.napier.govt.nz/geo/ows?&service=wfs&request=GetFeature&version=1.0.0&srs=EPSG:2108&typeName=NCC:LINZ_NAPIERPARCEL&outputFormat=csv"

try:
    # Stream the response to get first few lines
    resp = requests.get(url, stream=True, timeout=30)
    resp.raise_for_status()
    lines = []
    for i, line in enumerate(resp.iter_lines(decode_unicode=True)):
        if i >= 10:  # first 10 lines
            break
        lines.append(line)
    print("\n".join(lines))
except Exception as e:
    print(f"Error: {e}")