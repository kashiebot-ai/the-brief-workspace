# Property Lead Scouting - Data Sources

## Current Status
**Web search limited** — generic searches for "Napier property sold" return mostly US results (Napa, California). Need targeted data sources.

## Identified Data Sources

### 1. Napier City Council Open Data
- **URL:** `https://data.napier.govt.nz/`
- **Dataset:** `LINZ_NAPIERPARCEL` (property parcels)
- **Fields:** FID, Parcel_ID, appellation (description), affected_surveys, land_district, titles, survey_area, calc_area, geometry
- **Access:** Direct CSV download via WFS
- **Limitation:** No owner names or contact info

### 2. LINZ Data Service (Land Information New Zealand)
- **URL:** `https://data.linz.govt.nz/`
- **Datasets:** Property titles, ownership records, valuations
- **API:** Available with registration + API key
- **Potential:** Owner names, title transfers, recent sales
- **Action:** Register for API key (weekend task)

### 3. NZ Companies Office
- **URL:** `https://companies-register.govt.nz/`
- **Use:** Identify property‑holding entities (trusts, companies)
- **Access:** Free search, may have API

### 4. Social Media / Forums
- **Targets:** Facebook groups (Napier property investors, Hawke's Bay landlords)
- **Reddit:** r/PersonalFinanceNZ, r/newzealand
- **Method:** Monitor for frustrated owners seeking management help

## Automation Plan (Next Week)

### Phase 1: Data Collection
1. **Download Napier parcel dataset** (~? records) — already have sample
2. **Filter for residential parcels** (by area/zoning?)
3. **Extract title references** from `titles` field (e.g., HBM2/729)

### Phase 2: Owner Lookup
1. **LINZ API integration** — query title details for owner info
2. **Companies Office lookup** — if owner is a registered entity
3. **Enrich with valuation data** (LINZ or QV?)

### Phase 3: Lead Scoring
1. **Identify long‑term holders** (titles held >5 years)
2. **Flag multi‑property owners** (same title holder across parcels)
3. **Detect recent transfers** (new title registrations = fresh investors)

### Phase 4: Outreach
1. **Compile contact list** (where available)
2. **Craft value‑prop message** (professional management, local expertise)
3. **Sequenced outreach** (email > phone > social)

## Immediate Next Steps (Mon/Wed/Fri scouting)
1. **Register for LINZ Data Service API** (requires NZ government login)
2. **Build simple parcel‑downloader** (full Napier dataset)
3. **Test title lookup** with a few sample titles from CSV

## Constraints
- **Privacy:** NZ privacy laws restrict personal data use
- **Ethical:** Outreach must be professional, non‑spammy
- **Cost:** LINZ API may have usage fees (check)
- **Rate limits:** Respect council/LINZ terms

## Success Metrics
- **Leads/month:** 5 high‑quality (goal)
- **Conversion rate:** 2–3% (industry average)
- **Pipeline value:** $XXX/month per managed property