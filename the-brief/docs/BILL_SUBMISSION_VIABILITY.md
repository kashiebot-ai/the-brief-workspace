# Bill Submission Tool - Viability Assessment

**Date:** 2026-03-02  
**Project:** the-brief  
**Branch:** feat/bill-submission-tool

---

## Executive Summary

**Status:** ⚠️ PARTIALLY VIABLE

The bill submission tool is technically feasible but requires a **manual curation approach** due to lack of accessible Parliament APIs.

---

## Data Availability Findings

### Parliament Data Sources Attempted

| Source | Status | Notes |
|--------|--------|-------|
| `parliament.nz` | ❌ Inaccessible | Protected by Radware bot detection |
| `legislation.govt.nz` | ❌ Inaccessible | Protected by Azure WAF |
| RSS Feeds | ❌ Inaccessible | Same bot protection |
| Public API | ❌ Not Available | No official Parliament API found |

### What We Found

1. **No Official API**: New Zealand Parliament does not provide a public API for bill data
2. **Heavy Bot Protection**: Both main sites use advanced bot detection (Radware, Azure WAF)
3. **No Open Data Feed**: No JSON/XML feeds available for automated consumption
4. **Manual Scraping Not Feasible**: Would require browser automation + rotating proxies

---

## Submission Process Research

### Current Parliament Submission Flow

Based on historical patterns (unable to access live site):

1. **Locate Bill**: Find bill on parliament.nz/sc (Select Committee section)
2. **Submission Portal**: Each committee has unique submission form
3. **Required Fields**:
   - Full Name
   - Email Address
   - Organisation (optional)
   - Stance (Support/Oppose/Neutral)
   - Submission text/file
4. **Submission Deadline**: Listed on each bill's page
5. **Direct Link**: Cannot pre-fill forms (anti-spam measures)

### Integration Options

| Option | Feasibility | Notes |
|--------|-------------|-------|
| Direct API Submission | ❌ Impossible | No API available |
| Form Pre-fill | ❌ Not Possible | Parliament forms block pre-fill |
| Redirect to Parliament | ✅ Fully Feasible | Simple link to submission page |
| Embed Parliament Form | ❌ Not Possible | X-Frame-Options blocked |

**Selected Approach:** Redirect users to Parliament submission pages with guidance

---

## Technical Feasibility

### What We Can Build ✅

1. **Bills Database** (Sanity CMS)
   - Manual entry of bills open for submission
   - Store: title, description, deadline, committee, category
   - Plain-English summaries
   - Submission guidance templates

2. **Bills Listing Page**
   - Filter by category (e.g., Environment, Health, Transport)
   - Sort by deadline (urgent first)
   - Deadline countdown timers
   - Search functionality

3. **Bill Detail Page**
   - Plain-English summary
   - Full bill link (to legislation.govt.nz)
   - Key points breakdown
   - "Make Submission" CTA

4. **Submission Helper**
   - Stance selector (Support/Oppose/Neutral)
   - Guided question prompts
   - Template generation
   - Preview before redirect
   - Direct link to Parliament form

5. **Sanity Integration**
   - CMS for managing bills
   - Draft/published workflow
   - Template management

---

## Competitor Research

### ActionStation
- **Do they do this?** Partially - they run campaigns on specific bills
- **Approach:** Email alerts + pre-written submission templates
- **What's Missing:** Centralized bill tracker, plain-English summaries

### Generation Zero
- **Do they do this?** Yes - climate-focused bill tracking
- **Approach:** Campaign pages for specific bills
- **What's Missing:** Comprehensive all-bills tracker

### Opportunities for The Brief
1. **Neutral, Non-Partisan**: Cover ALL bills, not just campaign targets
2. **Plain-English Focus**: Translate legalese for non-experts
3. **Deadline Awareness**: Countdown timers create urgency
4. **Educational**: Help people understand how to write effective submissions

---

## MVP vs Full Feature Scope

### MVP (Implemented)
- [x] Bills data library with TypeScript types
- [x] Sanity schema for bills
- [x] Bills listing page with filters
- [x] Bill detail page
- [x] Submission helper component
- [x] Deadline countdown
- [x] Category filtering
- [x] Manual data entry in Sanity

### Full Feature (Future)
- [ ] Email alerts for new bills
- [ ] User accounts to track submissions
- [ ] Submission templates by topic
- [ ] Impact tracking (did bill pass?)
- [ ] Integration with email newsletter
- [ ] Bill similarity analysis
- [ ] MP contact information

---

## Data Curation Process

### Manual Entry Workflow

1. **Monitor Parliament Website**
   - Check parliament.nz/sc weekly for new bills
   - Note: Bill opening for submissions
   - Copy key details (title, committee, deadline)

2. **Sanity CMS Entry**
   - Create new bill document
   - Add plain-English summary
   - Categorise appropriately
   - Set publication status

3. **Content Updates**
   - Update deadline status
   - Mark bills as "closed for submissions"
   - Archive passed/defeated bills

### Estimated Maintenance
- **Time Required**: 1-2 hours/week
- **Skills Needed**: Basic CMS usage, ability to read legislation
- **Automation Potential**: None currently (would require Parliament API access)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual data entry burden | Medium | Start with high-profile bills only; consider crowdsourcing |
| Data becomes stale | High | Implement "last updated" timestamps; clear stale bills |
| Parliament changes URL structure | Low | Use stable bill IDs; monitor for 404s |
| User confusion about redirect | Medium | Clear messaging: "You'll submit on Parliament's site" |
| Duplicate submissions | Low | Clear guidance on Parliament's process |

---

## Conclusion & Recommendation

### Verdict: PROCEED WITH MANUAL CURATION

The bill submission tool is **viable** with a manual curation approach. While we cannot automate data collection from Parliament, we can create significant value through:

1. **Curation**: Hand-pick important bills with clear summaries
2. **Education**: Guide users through the submission process
3. **Usability**: Better UX than navigating Parliament's site
4. **Neutrality**: Cover all bills, not just partisan campaigns

### Next Steps

1. ✅ Implement bills library and pages (DONE)
2. ✅ Add Sanity schema (DONE)
3. ✅ Create submission helper (DONE)
4. 📝 Populate with 3-5 current bills as examples
5. 📝 Document curation process for ongoing maintenance
6. 📝 Create "How to Write a Submission" guide

### Success Metrics

- Number of bills tracked
- User engagement with bill pages
- Click-through rate to Parliament submissions
- Newsletter signups from bill pages

---

## Resources

- Parliament Select Committee: https://www.parliament.nz/en/pb/sc/
- Legislation.govt.nz: https://legislation.govt.nz/
- Guide to Making Submissions: https://www.parliament.nz/en/get-involved/

---

*Assessment completed: 2026-03-02*
