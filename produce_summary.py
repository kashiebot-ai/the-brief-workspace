#!/usr/bin/env python3
"""
Produce a summary report of property flipping opportunities.
"""

import csv
from datetime import datetime

def main():
    # Read the enhanced listings (without CV)
    input_csv = "property_listings_enhanced_20260219_0858.csv"
    
    listings = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert score to int
            row['renovation_score'] = int(row.get('renovation_score', 0))
            listings.append(row)
    
    # Sort by renovation score
    sorted_list = sorted(listings, key=lambda x: x['renovation_score'], reverse=True)
    
    # Generate report
    report = []
    report.append("# 🏠 Property Flipping Opportunities - Hawke's Bay")
    report.append(f"*Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*")
    report.append("")
    report.append("## 🔧 Current Status")
    report.append("- ✅ LINZ API connected and authenticated")
    report.append("- ✅ Council Valuation (CV) data accessible for Napier (TA 60) & Hastings (TA 62)")
    report.append("- ⚠️ Central Hawke's Bay & Wairoa may not be in public dataset")
    report.append("- 🔍 Tested 16 current listings, address matching needs refinement")
    report.append("- 🚀 Next: Improve matching, add CV gap analysis, deploy daily automation")
    report.append("")
    report.append("## 🏆 Top 5 Urgent Sale Opportunities")
    report.append("These properties have urgent sale methods (deadline sale, tender, auction) indicating motivated sellers.")
    report.append("")
    
    for i, lst in enumerate(sorted_list[:5]):
        report.append(f"### {i+1}. {lst['address']}")
        report.append(f"- **Price:** {lst['price']}")
        report.append(f"- **Sale method:** {lst['sale_method']}")
        report.append(f"- **Details:** {lst.get('bedrooms', '?')} bed, {lst.get('bathrooms', '?')} bath, {lst.get('land_area', '?')}")
        report.append(f"- **Renovation score:** {lst['renovation_score']}/10")
        report.append(f"- **Flags:** {lst.get('flags', 'None')}")
        report.append(f"- **URL:** {lst['url']}")
        report.append("")
    
    report.append("## 📊 LINZ CV Integration Preview")
    report.append("Two properties successfully matched with Council Valuation data:")
    report.append("")
    report.append("1. **102 Newcastle Street, Mahia**")
    report.append("   - CV: $470,000 | Condition: AG (Average-Good?) | Age: 1910s")
    report.append("   - Land area: 508m² | Gap: Cannot calculate (price negotiation)")
    report.append("")
    report.append("2. **20 Faraday Street, Hospital Hill, Napier**")
    report.append("   - CV: $860,000 | Condition: Unknown | Age: Unknown")
    report.append("   - Land area: Unknown | Gap: Cannot calculate (deadline sale)")
    report.append("")
    report.append("## 🚀 Next Steps")
    report.append("1. **Improve address matching** – Handle street abbreviations, unit numbers")
    report.append("2. **Expand TA coverage** – Verify Central Hawke's Bay & Wairoa codes")
    report.append("3. **Calculate CV gaps** – For listings with explicit prices")
    report.append("4. **Build Mission Control dashboard** – Live property finder with filters")
    report.append("5. **Set up daily automation** – Cron job at 8am, email digest")
    report.append("6. **Add renovation cost estimates** – Based on condition codes")
    report.append("")
    report.append("## ⏱️ Timeline")
    report.append("- **Today:** Proof of concept complete (scraper + LINZ API)")
    report.append("- **Tomorrow:** Improved matching, first CV‑gap report")
    report.append("- **This week:** Dashboard integration, daily automation")
    report.append("")
    report.append("---")
    report.append("*Data sources: realestate.co.nz, LINZ Data Service (District Valuation Roll)*")
    
    # Write report
    output_path = "property_opportunities_summary.md"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(report))
    
    print("✅ Summary report generated:")
    print(f"   {output_path}")
    print("\n📋 Copy of report:\n")
    print("\n".join(report[:50]))  # Print first 50 lines
    
    return output_path

if __name__ == "__main__":
    main()