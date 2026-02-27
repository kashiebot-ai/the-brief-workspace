#!/usr/bin/env python3
"""
Generate reports from affiliate program database.
"""
import csv
from datetime import datetime

CSV_PATH = '../../affiliate_programs.csv'

def read_programs():
    """Read programs from CSV."""
    programs = []
    with open(CSV_PATH, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            programs.append(row)
    return programs

def generate_top_commissions_report(programs, limit=10):
    """Generate markdown report of programs with highest commissions."""
    # Filter programs with commission data
    filtered = []
    for p in programs:
        commission = p['Commission']
        if commission and commission != '?':
            # Extract numeric percentage if possible
            import re
            match = re.search(r'(\d+)%', commission)
            if match:
                p['numeric_commission'] = int(match.group(1))
            else:
                p['numeric_commission'] = 0
            filtered.append(p)
    
    # Sort by numeric commission descending
    filtered.sort(key=lambda x: x['numeric_commission'], reverse=True)
    
    # Generate markdown
    report = f"# Top Affiliate Programs by Commission\n"
    report += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
    report += "| Program | Category | Commission | Recurring | Notes |\n"
    report += "|---------|----------|------------|-----------|-------|\n"
    
    for p in filtered[:limit]:
        program = p['Program']
        category = p['Category']
        commission = p['Commission']
        recurring = p['Recurring'] if p['Recurring'] != '?' else 'Unknown'
        notes = p['Notes'][:50] + '...' if len(p['Notes']) > 50 else p['Notes']
        report += f"| {program} | {category} | {commission} | {recurring} | {notes} |\n"
    
    return report

def generate_nz_friendly_report(programs):
    """Generate report of programs with NZ access."""
    nz_programs = [p for p in programs if p['NZ Access'] == 'Yes']
    
    report = f"# NZ-Friendly Affiliate Programs\n"
    report += f"Count: {len(nz_programs)}\n\n"
    
    for p in nz_programs:
        report += f"## {p['Program']}\n"
        report += f"- **Category:** {p['Category']}\n"
        report += f"- **Commission:** {p['Commission']}\n"
        report += f"- **Recurring:** {p['Recurring']}\n"
        report += f"- **Link:** {p['Link']}\n"
        report += f"- **Notes:** {p['Notes']}\n\n"
    
    return report

def save_report(content, filename):
    """Save report to file."""
    with open(filename, 'w') as f:
        f.write(content)
    print(f"Report saved to {filename}")

if __name__ == '__main__':
    programs = read_programs()
    
    # Generate reports
    top_commissions = generate_top_commissions_report(programs, limit=15)
    save_report(top_commissions, '../../reports/top_commissions.md')
    
    nz_report = generate_nz_friendly_report(programs)
    save_report(nz_report, '../../reports/nz_friendly_programs.md')
    
    # Print summary
    print(f"Total programs: {len(programs)}")
    print(f"Programs with commission data: {sum(1 for p in programs if p['Commission'] and p['Commission'] != '?')}")
    print(f"NZ-friendly programs: {sum(1 for p in programs if p['NZ Access'] == 'Yes')}")