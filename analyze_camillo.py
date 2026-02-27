#!/usr/bin/env python3
import sys
import re

# Read the PDF text from stdin or file
if len(sys.argv) > 1:
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        text = f.read()
else:
    text = sys.stdin.read()

# Extract relevant sections
lines = text.split('\n')
relevant = []
for line in lines:
    line_lower = line.lower()
    if any(keyword in line_lower for keyword in ['social', 'trend', 'arbitrage', 'consumer', 'insight', 'data', 'pattern', 'signal']):
        relevant.append(line.strip())

print("=== RELEVANT LINES ===")
for line in relevant[:50]:
    print(line)

# Try to find chapter summaries
print("\n=== CHAPTER TITLES ===")
for line in lines:
    if 'Chapter' in line and 'Summary' in line:
        print(line.strip())

# Look for "game-changing information"
print("\n=== 'GAME-CHANGING INFORMATION' ===")
for i, line in enumerate(lines):
    if 'game-changing' in line.lower():
        print(f"Line {i}: {line.strip()}")