# The Brief (NZ Political Transparency Platform)

*Active project — 2026 NZ Election (Nov 7, 252 days).*

## Overview

**Status:** 🔄 Build in progress
**Type:** Civic news / Political transparency
**Election:** November 7, 2026 (8 months to build)
**Tech:** Next.js + Sanity CMS (custom build)

## Product

### Core Features (MVP)
1. **Policy Explainers** — Plain English breakdowns of government announcements
2. **VoteFinder Quiz** — Values matcher → party/policy recommendations
3. **Newsletter** — Optional weekly updates

### Phase 2 (Later)
4. **Politician Tracker** — MP profiles, voting records, attendance
5. **Timeline Visualizations** — How we got here
6. **Party Comparator** — Side-by-side policy comparison
7. **Jargon Buster** — Political terms explained

## Decisions Made

| Date | Decision | Notes |
|------|----------|-------|
| 2026-02-27 | Pivot from affiliate | Civic news chosen for election timing |
| 2026-02-27 | National focus | Parliament > local councils (bigger audience) |
| 2026-02-28 | Tech stack | Next.js + Sanity CMS (not WordPress) |
| 2026-02-28 | Scope | Explainers + quiz first, MP tracking later |
| 2026-02-28 | Build approach | Temp URL now, migrate domain later |

## Technical

### Stack
- **Framework:** Next.js 14 (App Router)
- **CMS:** Sanity
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free tier)
- **Email:** ConvertKit or Buttondown (free tier)

### URLs
- **Temp:** the-brief-demo.vercel.app
- **Production:** TBD (domain negotiation in progress)

## Content Strategy

### Explainers
- Plain English translation of government announcements
- "What this means for you" angle
- Source citations, transparent methodology

### Quiz (VoteFinder)
- 15-20 values questions
- Weighted matching to parties/policies
- Shareable results

### Publishing Cadence
- **Week 1-4:** 3-5 explainers (establish voice)
- **Month 1-2:** 1-2 explainers/week
- **Month 3+:** Consistent weekly publishing

## Monetization Paths

### Free Tier
- All explainers
- Basic quiz
- Weekly newsletter

### Premium ($10-15/mo)
- Real-time alerts
- Impact calculator
- Deep dives

### B2B
- Lobbyists: Early warning on bills ($500-2000/mo)
- PR firms: Client mention tracking
- Journalists: Research assistant

## Competitive Landscape

### Weak Competition
- **CityWatchNZ:** Activist/conspiracy-leaning, 96 X followers
- **Mainstream media:** Don't do "plain English" well

### Differentiation
- AI-powered 24/7 monitoring
- Plain English translation
- Non-partisan (transparent methodology)
- Election countdown focus

## Risks

1. **Neutrality trap** — Every framing is political
2. **Speed problem** — News cycle moves fast
3. **Expertise gap** — Not a political journalist
4. **Sustainability** — 8+ months of content production
5. **Political toxicity** — Elections are polarizing

## Team

- **Vianni:** Strategy, review, tone/voice, domain
- **Kashie (me):** Research, drafting, building, monitoring

## Timeline

| Phase | Dates | Deliverables |
|-------|-------|--------------|
| Build | Week 1-2 | Site scaffold, homepage, explainer template |
| Content | Month 1 | 10-20 explainers, quiz MVP |
| Growth | Month 2-3 | Email list building, consistency |
| Peak | Oct-Nov 2026 | Election coverage, voter guides |

## File Locations

- **Project docs:** `projects/the-briefing/`
- **Production chat:** `memory/chats/telegram-group-the-brief/`
- **Strategy chat:** `memory/chats/telegram-8451221514/` (Planning HQ)

---
*Next review: Weekly, Sundays*
