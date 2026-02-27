# 🏠 Property Flipping Opportunity Finder

## 🎯 Purpose
Identify undervalued properties in Napier/Hawke's Bay for renovation/resale by:
1. **Estimating prices** for "negotiation"/"deadline sale"/"tender" listings using price filter mapping
2. **Comparing** estimated prices with Council Valuation (CV) data
3. **Scoring opportunities** based on CV gap and seller motivation
4. **Monitoring daily** for new opportunities

## 🔧 How It Works

### 4-Step Process
1. **Price Filter Mapping**
   - Iterate through price brackets ($50k increments) on TradeMe/realestate.co.nz
   - Track which listings appear in which brackets
   - If listing appears in $500-550k but not $450-500k → estimate $500-550k

2. **CV Data Integration**
   - Query LINZ Data Service API for Council Valuation data
   - Match listings to CV records by address
   - Calculate value gap: `(CV − estimated_price_midpoint) ÷ CV`

3. **Opportunity Scoring**
   - **CV Gap Score** (0-5): Higher discount = higher score
   - **Sale Method Score** (0-3): "Deadline Sale"/"Tender"/"Auction" = motivated seller
   - **Negotiation Score** (0-2): "Negotiation" listing = flexible pricing
   - **Total Score**: 0-10 points

4. **Daily Monitoring**
   - Once baseline established, check only new listings daily
   - Flag high-scoring opportunities for review

## 📁 Current Implementation

### ✅ Built
- `property_price_mapper.py` - Core framework with:
  - `PropertyListing` class with CV integration
  - `PriceBracketMapper` class for price bracket tracking
  - Opportunity scoring algorithm
  - CSV export with rankings
- Integration with existing realestate.co.nz scraper
- LINZ API connectivity (needs address matching improvement)

### 🔄 In Progress
- TradeMe scraper with price filter iteration
- Browser automation for price filter interaction
- Improved address matching for LINZ data

### 📊 Sample Output
```
=== TOP 5 OPPORTUNITIES ===
1. 22A White Street, Taradale
   Estimated: $500,000-$600,000
   CV: $650,000
   CV Gap: 15.4%
   Score: 8/10
   URL: https://www.realestate.co.nz/42988771/...
```

## 🚀 Next Steps (Phase 2)

### 1. TradeMe Price Filter Scraper
**Options:**
- **GraphQL API**: Reverse-engineer TradeMe GraphQL queries (API accessible at `https://api.trademe.co.nz/graphql/`)
- **Browser Automation**: Use Playwright/Selenium to interact with price filter UI
- **Hybrid**: Use GraphQL for data, browser for price filter simulation

**Priority**: Browser automation (most reliable, works with any site changes)

### 2. Address Matching Improvement
- Implement fuzzy matching for addresses (LINZ vs listing formats)
- Handle suburb variations (e.g., "Napier South" vs "Napier")
- Consider using Google Maps Geocoding API as fallback

### 3. Daily Automation
- Cron job at 8:00 AM daily
- Email/SMS alerts for high-score opportunities
- Dashboard integration in Mission Control

### 4. Expansion
- Add TradeMe as secondary source (larger inventory)
- Expand to all Hawke's Bay (Hastings, Havelock North, etc.)
- Add renovation cost estimation based on property condition

## 💡 Key Insights

### TradeMe vs realestate.co.nz
| Feature | TradeMe | realestate.co.nz |
|---------|---------|------------------|
| **Inventory** | Larger | Smaller |
| **Price Filters** | URL parameters (`price_min`, `price_max`) | JavaScript UI (needs automation) |
| **API Access** | GraphQL available | No public API |
| **Scraping Difficulty** | Medium (JavaScript-heavy) | Easier (static HTML) |

**Recommendation**: Start with TradeMe (price filters in URL), add realestate.co.nz via browser automation.

### CV Gap Thresholds
- **Good**: 10-15% discount
- **Excellent**: 15-20% discount  
- **Exceptional**: 20%+ discount

### Target Profile
- **Location**: Napier initially (prove concept)
- **Property Type**: Houses (3-4 bedrooms preferred)
- **Price Range**: $300k-$800k (renovation margin exists)
- **Sale Method**: "Deadline Sale", "Tender", "Negotiation", "Auction"

## 📈 Expected Results

### Phase 1 (This Week)
- Framework operational
- 5-10 high-quality opportunities identified
- Manual verification of accuracy

### Phase 2 (Next Week)
- Daily automated scanning
- Email alerts for new opportunities
- 2-3 solid leads per week

### Phase 3 (Month 1)
- Full Hawke's Bay coverage
- TradeMe + realestate.co.nz
- Dashboard with real-time monitoring

## 🛠 Technical Setup

### Dependencies
```bash
# Core
pip install requests beautifulsoup4

# Browser automation (recommended)
pip install playwright
playwright install chromium

# Or Selenium
pip install selenium webdriver-manager
```

### Files
- `property_price_mapper.py` - Core framework
- `property_scraper_robust.py` - Existing realestate.co.nz scraper  
- `trademe_scraper_prototype.py` - TradeMe scraper foundation
- `linz_integration.py` - LINZ API integration

### Configuration
- LINZ API key: `4c5b18e5c1e04cb8b9819538260cdb18`
- Napier TA code: `60`
- Hastings TA code: `62`

## 🔍 Validation Approach
1. **Manual spot-check**: Compare system estimates with actual sold prices
2. **Address matching accuracy**: Test with known property addresses
3. **CV gap validation**: Check if high-gap properties are genuinely undervalued
4. **False positive rate**: Track how many flagged opportunities are actually good

---
*Last updated: 2026-02-20 | Framework built, ready for price filter implementation*