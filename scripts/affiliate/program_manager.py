#!/usr/bin/env python3
"""
Manage affiliate program database.
"""
import csv
import sys
import os
from typing import List, Dict

# Get absolute path to CSV file (relative to this script)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../..'))
CSV_PATH = os.path.join(WORKSPACE_ROOT, 'affiliate_programs.csv')

def read_programs() -> List[Dict]:
    """Read all programs from CSV."""
    programs = []
    with open(CSV_PATH, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            programs.append(row)
    return programs

def write_programs(programs: List[Dict]):
    """Write programs to CSV."""
    fieldnames = ['Program', 'Category', 'Commission', 'Cookie Duration', 'Recurring', 'NZ Access', 'Link', 'Notes']
    with open(CSV_PATH, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(programs)

def add_program(program: Dict):
    """Add a new program."""
    programs = read_programs()
    programs.append(program)
    write_programs(programs)
    print(f"Added: {program['Program']}")

def list_programs():
    """List all programs."""
    programs = read_programs()
    for i, p in enumerate(programs, 1):
        print(f"{i}. {p['Program']} ({p['Category']}): {p['Commission']}")

def search_programs(query: str):
    """Search programs by name or category."""
    programs = read_programs()
    results = [p for p in programs if query.lower() in p['Program'].lower() or query.lower() in p['Category'].lower()]
    for p in results:
        print(f"{p['Program']} | {p['Category']} | {p['Commission']} | {p['Recurring']}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python program_manager.py [list|add|search]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    if cmd == 'list':
        list_programs()
    elif cmd == 'search':
        if len(sys.argv) < 3:
            print("Usage: python program_manager.py search <query>")
            sys.exit(1)
        search_programs(sys.argv[2])
    elif cmd == 'add':
        # Quick add from command line args
        if len(sys.argv) < 9:
            print("Usage: python program_manager.py add <name> <category> <commission> <cookie> <recurring> <nz> <link> <notes>")
            sys.exit(1)
        program = {
            'Program': sys.argv[2],
            'Category': sys.argv[3],
            'Commission': sys.argv[4],
            'Cookie Duration': sys.argv[5],
            'Recurring': sys.argv[6],
            'NZ Access': sys.argv[7],
            'Link': sys.argv[8],
            'Notes': sys.argv[9]
        }
        add_program(program)
    else:
        print(f"Unknown command: {cmd}")