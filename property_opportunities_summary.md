# 🏠 Property Flipping Opportunities - Hawke's Bay
*Report generated: 2026-02-19 14:44*

## 🔧 Current Status
- ✅ LINZ API connected and authenticated
- ✅ Council Valuation (CV) data accessible for Napier (TA 60) & Hastings (TA 62)
- ⚠️ Central Hawke's Bay & Wairoa may not be in public dataset
- 🔍 Tested 16 current listings, address matching needs refinement
- 🚀 Next: Improve matching, add CV gap analysis, deploy daily automation

## 🏆 Top 5 Urgent Sale Opportunities
These properties have urgent sale methods (deadline sale, tender, auction) indicating motivated sellers.

### 1. 1005 Oliphant Road, Raureka
- **Price:** Deadline Sale
- **Sale method:** 
- **Details:** 3 bed, 1 bath, 761m2
- **Renovation score:** 2/10
- **Flags:** Negotiation: deadline sale
- **URL:** https://www.realestate.co.nz/42986655/residential/sale/1005-oliphant-road-raureka

### 2. 65 Margaret Avenue, Havelock North
- **Price:** Negotiation
- **Sale method:** 
- **Details:**  bed,  bath, 1199m2
- **Renovation score:** 2/10
- **Flags:** Negotiation: negotiation
- **URL:** https://www.realestate.co.nz/42982058/residential/sale/65-margaret-avenue-havelock-north

### 3. 607 Market Street South, Hastings
- **Price:** Tender
- **Sale method:** 
- **Details:** 3 bed, 2 bath, 685m2
- **Renovation score:** 2/10
- **Flags:** Negotiation: tender
- **URL:** https://www.realestate.co.nz/42981597/residential/sale/607-market-street-south-hastings

### 4. 102 Newcastle Street, Mahia
- **Price:** Negotiation
- **Sale method:** 
- **Details:** 5 bed, 2 bath, 1213m2
- **Renovation score:** 2/10
- **Flags:** Negotiation: negotiation
- **URL:** https://www.realestate.co.nz/42981270/residential/sale/102-newcastle-street-mahia

### 5. 153A Middle Road, Havelock North
- **Price:** Auction
- **Sale method:** 
- **Details:** 4 bed, 2 bath, 767m2
- **Renovation score:** 2/10
- **Flags:** Negotiation: auction
- **URL:** https://www.realestate.co.nz/42981062/residential/sale/153a-middle-road-havelock-north

## 📊 LINZ CV Integration Preview
Two properties successfully matched with Council Valuation data:

1. **102 Newcastle Street, Mahia**
   - CV: $470,000 | Condition: AG (Average-Good?) | Age: 1910s
   - Land area: 508m² | Gap: Cannot calculate (price negotiation)

2. **20 Faraday Street, Hospital Hill, Napier**
   - CV: $860,000 | Condition: Unknown | Age: Unknown
   - Land area: Unknown | Gap: Cannot calculate (deadline sale)

## 🚀 Next Steps
1. **Improve address matching** – Handle street abbreviations, unit numbers
2. **Expand TA coverage** – Verify Central Hawke's Bay & Wairoa codes
3. **Calculate CV gaps** – For listings with explicit prices
4. **Build Mission Control dashboard** – Live property finder with filters
5. **Set up daily automation** – Cron job at 8am, email digest
6. **Add renovation cost estimates** – Based on condition codes

## ⏱️ Timeline
- **Today:** Proof of concept complete (scraper + LINZ API)
- **Tomorrow:** Improved matching, first CV‑gap report
- **This week:** Dashboard integration, daily automation

---
*Data sources: realestate.co.nz, LINZ Data Service (District Valuation Roll)*