# Feature Specs: The Brief Enhancement Bundle

## Overview
Four features selected for development:
1. Major Report Summaries (Idea #10)
2. Online Submission Tracker (Idea #9 - modified)
3. Personalised Bill Alerts (Idea #6)
4. Bill Timeline Visualiser (Idea #2)

---

## 1. MAJOR REPORT SUMMARIES

### User Story
As a citizen, when a major government report drops (Royal Commission, select committee, inquiry), I want a 5-minute plain-English summary so I can understand what matters without reading 500 pages.

### MVP Scope
- **Trigger:** Major reports only (Royal Commissions, significant select committee reports, Auditor-General reports)
- **Content:** 
  - 3-5 key findings
  - Top 3 recommendations
  - "Why this matters" context (2 sentences)
  - Link to full report
- **Format:** Same as existing explainers (card on homepage + dedicated page)
- **Timing:** Published within 48 hours of report release

### Technical Implementation
```
New Sanity Schema: reportSummary
- title (string)
- reportType (enum: royalCommission, selectCommittee, auditorGeneral, other)
- publishedDate (date)
- keyFindings (array of portableText)
- topRecommendations (array of portableText)
- whyItMatters (portableText)
- fullReportUrl (url)
- coverImage (image)
- category (reference to category)
- readingTime (number)
```

### Workflow
1. Monitor NZ Govt press releases + Parliament announcements
2. AI generates first draft from report PDF (Claude/GPT-4)
3. Human review for accuracy (30 mins)
4. Publish to Sanity
5. Feature in newsletter + homepage

### Content Pipeline (Manual for MVP)
- Source: Check https://www.parliament.nz/en/pb/sc/reports/ weekly
- + https://www.royalcommission.govt.nz/ for RC reports
- + https://oag.parliament.nz/ for Auditor-General

### Success Metrics
- Time from report release to summary: <48 hours
- Average read time on summary pages
- Newsletter click-through rate for report summaries

---

## 2. ONLINE SUBMISSION TRACKER

### User Story
As a citizen, I want to see upcoming submission deadlines for bills and be able to quickly submit online, so my voice is heard before it's too late.

### MVP Scope
- **Deadline Calendar:** List view of bills accepting submissions with deadlines
- **Filter by:** Category (housing, environment, etc.), days remaining (<7 days, <30 days, all)
- **Quick Submit:** One-click to submission form from bill page
- **"I'm Submitting" Button:** Social proof counter ("47 people from your electorate submitting")
- **Reminder:** Optional email reminder 48 hours before deadline

### Technical Implementation
```
Extend existing bill schema:
- submissionDeadline (date)
- submissionUrl (url) - Parliament.nz form URL
- submissionCount (number) - self-reported via "I'm submitting" button

New Component: SubmissionTracker
- Calendar view / List view toggle
- Filter by category, urgency
- Sort by deadline (nearest first)

New API Endpoint: /api/submission-intent
- POST: Record "I'm submitting" click (anonymous, electorate only)
- GET: Get count by electorate for a bill
```

### Sanity Updates
```
Add to bill schema:
- submissionDeadline: date
- submissionUrl: url
- submissionGuidance: portableText (tips for writing)
```

### UI Placement
- New page: `/submissions` - dedicated tracker
- Homepage section: "Submissions Closing Soon" (top 3)
- Bill cards: Show "Submissions close in X days" badge

### Success Metrics
- Click-through rate from tracker to submission forms
- Number of "I'm submitting" intents recorded
- Submission deadline page views

---

## 3. PERSONALISED BILL ALERTS

### User Story
As a citizen, I want to receive alerts when bills I'm interested in reach key stages, so I can take action at the right time.

### MVP Scope
- **Categories:** Housing, Environment, Economy, Health, Education, Justice, Transport, Other
- **Alert Triggers:**
  1. New bill in your category
  2. Bill entering select committee (submissions open)
  3. Submission deadline approaching (48 hours)
  4. Bill progressing to next reading
- **Frequency Caps:** 
  - Max 1 email per day
  - Max 3 emails per week
  - Digest option (weekly summary)
- **Channels:** Email only (MVP), SMS later

### Technical Implementation
```
New Schema: userAlertPreferences (stored in Sanity or localStorage for MVP)
- email (string)
- categories (array of strings)
- alertTypes (array: newBill, submissionsOpen, deadlineApproaching, progressing)
- frequency (enum: immediate, dailyDigest, weeklyDigest)
- electorate (string) - for local relevance weighting

New GitHub Actions Workflow: check-alerts.yml
- Runs daily at 7 AM NZT (after bill scrape)
- Checks for trigger conditions
- Queues emails via SendGrid/Mailgun
- Respects frequency caps

Email Template Components:
- Alert type header
- Bill title + short description
- Action button (View Bill / Make Submission)
- Unsubscribe link
```

### Database Options
**Option A: Simple (Recommended for MVP)**
- Store preferences in localStorage for logged-out users
- Store in Sanity for newsletter subscribers (already have email)
- No auth required

**Option B: Full**
- User accounts with auth
- Preference management dashboard
- More complex, higher friction

### Recommended: Option A
- Reuse existing newsletter signup
- Add alert preferences as checkboxes on signup
- Simple preference update via email footer links

### Success Metrics
- Alert signup rate (from bill pages)
- Email open rates
- Click-through rates
- Unsubscribe rate (keep <2%)

---

## 4. BILL TIMELINE VISUALISER

### User Story
As a citizen, I want to see where a bill is in the legislative process and what opportunities I have to influence it.

### MVP Scope
- **5 Stage Visual:**
  1. First Reading (introduced)
  2. Select Committee (public submissions)
  3. Second Reading
  4. Committee of the Whole House
  5. Third Reading / Royal Assent (passed)
- **Current Stage:** Highlighted with "You are here"
- **Action Prompt:** Contextual CTA based on stage:
  - SC stage: "Submissions open until [date]"
  - Other stages: "Track this bill for updates"
- **History:** Date each stage was reached (from scraped data)

### Technical Implementation
```
Component: BillTimeline
Props:
- currentStage (enum)
- stageDates (object: { firstReading, selectCommittee, secondReading, etc. })
- submissionDeadline (date, optional)
- billStatus (active, passed, defeated)

Visual Design:
- Horizontal stepper on desktop
- Vertical stepper on mobile
- Green = completed
- Blue = current
- Grey = upcoming
- Red = defeated (if applicable)
```

### Data Source
- Use existing scraped bill data
- Add stage dates to scraper output
- Current stage determined by `bill.stage` field

### UI Placement
- Bill detail page: Top of page, below title
- Bill cards: Mini version (progress bar style)

### Sanity Updates
```
Extend bill schema:
- stageDates: object with dates for each stage
- currentStage: string (calculated from stage field)
```

### Success Metrics
- Time spent on bill pages (increase = good)
- Click-through rate on stage-specific CTAs

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Quick Wins - 1-2 weeks)
1. **Bill Timeline Visualiser** - Purely presentational, uses existing data
2. **Submission Tracker** - New page, extends existing bill data

### Phase 2 (Content Pipeline - 2-3 weeks)
3. **Major Report Summaries** - Requires content workflow + AI pipeline

### Phase 3 (Engagement - 3-4 weeks)
4. **Personalised Bill Alerts** - Requires email infrastructure + preference management

---

## TECHNICAL NOTES

### Email Provider
- Current: Unknown (need to check)
- Recommended: Mailgun (10k emails/month free) or SendGrid
- Alternative: Use existing newsletter provider

### AI for Report Summaries
- Claude 3.5 Sonnet (best for long documents)
- GPT-4 Turbo (alternative)
- Local option: Ollama with Llama 3.1 (slower but private)

### Scraping Updates Needed
- Add stage dates to bill scraper
- Add submission deadline detection
- Add submission URL extraction from Parliament.nz

---

## ESTIMATED EFFORT

| Feature | Dev Days | Design Days | Content/Setup Days |
|---------|----------|-------------|-------------------|
| Bill Timeline | 2 | 1 | 0 |
| Submission Tracker | 3 | 1 | 1 (scraper updates) |
| Report Summaries | 2 | 1 | 3 (AI pipeline + review) |
| Bill Alerts | 4 | 1 | 2 (email setup) |
| **Total** | **11** | **4** | **6** |

---

## OPEN QUESTIONS

1. Do you have an email provider already? (Newsletter signup implies yes)
2. What's your monthly email volume? (affects provider choice)
3. Do you want user accounts, or anonymous preferences tied to email only?
4. For report summaries: Do you have content reviewers available, or fully AI?
5. Budget for AI API costs? (Claude ~$3-5 per long report)
