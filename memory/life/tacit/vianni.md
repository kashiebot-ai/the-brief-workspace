# Tacit Knowledge — How Vianni Operates

*This file contains patterns, preferences, and operational knowledge about Vianni. Updated as patterns are observed.*

## Core Preferences

### Communication Style
- **Direct, concise** — No filler words, no corporate speak
- **Action-oriented** — Wants outcomes, not discussions
- **Cost-conscious** — Wants data/analysis before spending
- **Self-directed** — Own schedule, flexible availability

### Learning Approach
- **Cost-conscious** — Learning the ropes, watching expenses
- **Data-driven** — Wants analysis before acting
- **Experimental** — Willing to try new approaches

## Operational Patterns

### Schedule
- **Work hours:** 6am–10:30pm (mostly)
- **Sleep:** 10:30pm–6am
- **Availability:** High, flexible, owns schedule
- **Overnight window:** 10:30pm–6am (my work time)

### Decision Making
- Wants data/analysis before acting
- Prefers to review options then decide
- Cost-benefit analysis on tools/services
- Risk-aware but willing to experiment

### Project Management
- **Single focus preferred** — The Brief (civic news) exclusive
- **Clear blockers identified** — Needs explicit user action items
- **Progress over perfection** — Iterate and improve
- **Systematic approach** — Likes structured plans
- **Multi-chat workflow** — Strategy in Planning HQ, execution in production chat

## Security Posture

### Trusted Channels
- **Telegram (this chat)** — Primary authenticated channel
- **Mac Mini local** — OpenClaw host machine
- **Tailscale only** — Remote access method

### Risk Tolerance
- **Balanced** — Not paranoid, not careless
- **FileVault disabled** — For auto-login/remote access
- **Manual updates** — User-applied, not automatic
- **Separate accounts for agents** — Willing to give API keys but controlled access

## Engagement Patterns

### When Vianni Responds
- Usually within hours during work hours
- Sometimes gaps during sleep/off hours
- Asks follow-up questions when interested
- Provides direction when needed

### What Gets Priority
- Revenue-generating activities
- System improvements that reduce friction
- Learning/education requests
- Security only when critical

## Preferences by Category

### Content
- NZ context for measurements/practical answers
- Direct answers, no fluff
- Bullet points over walls of text
- Specific examples over generalities

### System Updates
- **Silent unless critical** — Don't interrupt for routine stuff
- **Consolidated reports** — Batch updates, not drip feed
- **Action items clearly flagged** — What needs user action

### Technical
- **OpenClaw on Mac Mini** — 24/7 headless unit
- **Tailscale access** — Not SSH
- **Cost optimization matters** — Haiku for heartbeat, etc.

## Lessons from Past Interactions

### What Works Well
- Clear single-focus directives ("only affiliate marketing")
- Explicit permission to be proactive overnight
- Structured deliverables (reports, plans, checklists)
- Asking "what should you be doing?" (reverse prompting)

### What to Avoid
- Multiple competing priorities
- Daily interruptions for non-critical system checks
- Assuming approval for external/public actions
- Over-explaining simple concepts

## Active Directives

1. **Exclusive focus on The Brief** — Build NZ political transparency platform for 2026 election
2. **Work overnight** — 10:30pm–6am window for website builds, content drafting
3. **Remove bottlenecks** — When I ask for something, figure out how to make it autonomous next time
4. **Two-chat workflow** — Planning HQ for strategy, the-brief for production
5. **Weekly reviews** — Sundays, The Brief progress and direction

## Project: The Brief (Civic News Platform)

**Active since Feb 27, 2026** — Pivot from affiliate marketing to NZ political transparency.

### Product
- **Policy explainers** — Plain English breakdowns of government announcements
- **VoteFinder quiz** — Values matcher → party/policy recommendations
- **Newsletter** — Optional weekly updates
- **Politician tracker** — MP profiles, voting records (Phase 2)

### Tech Stack
- **Next.js + Sanity CMS** — Custom build (not WordPress)
- **Vercel hosting** — Free tier, temp URL for now
- **Domain** — Negotiating for preferred domain

### Content Workflow (Mandatory)
1. **Drafts live in:** `projects/the-briefing/content/`
2. **Filename format:** `explainer-[topic-slug].md`
3. **Update pipeline:** Always update `CONTENT_PIPELINE.md` with status
4. **Track versions:** Include Status, Last Updated, Review Notes in file

### Chat Setup (Simplified 2026-02-28)
| Chat | Purpose |
|------|---------|
| **Planning HQ** | Everything The Brief — decisions, builds, content, edits |
| **DM (this chat)** | System settings, other projects, personal |

**Rule:** One chat for The Brief. Files live in workspace, editable from anywhere.

### Never Again
- ❌ Keep drafts only in chat
- ❌ Post drafts without saving to file
- ❌ Forget to update pipeline
- ❌ Cross-contaminate chat contexts

---

*This section added: 2026-02-27*

## Recent Observations

### Feb 24-27, 2026 — Affiliate Program Acquisition Pattern
- **User ready to act**: Confirmed ready to sign up for affiliate programs (as of Feb 25)
- **Research-heavy preference**: Wants comprehensive analysis before signing up (vetted programs, no audience requirements, priority ranking)
- **Speed matters**: Once analysis provided, user signs up same day (Taskade example: research complete Feb 24 → link acquired Feb 24)
- **Systematic approach**: Prefers prioritized list with direct links and status clear

### API/Integration Testing
- **Willing to experiment**: Provided Moonshot API key to test alternative models (Kimi K2.5)
- **Expects rapid feedback**: Wants to know if integration works or if there's a blocker (not silence)
- **Detail-oriented**: Notices when provider configs don't work, asks to investigate further
- **Pragmatic**: If OpenClaw provider schema doesn't support it, wants to explore alternatives (env variables, etc.)
- **Issue resolution mindset**: Sees blockers as problems to solve, not roadblocks; wants investigation offered proactively

### Feb 28, 2026 — The Pivot & Chat Structure
- **Pivot clarity**: Immediately stopped affiliate work in one chat, moved to The Brief in another
- **Context pollution awareness**: Recognized the problem of stale MEMORY.md across chats
- **Two-chat solution**: Embraced Planning HQ (strategy) + the-brief (production) split
- **Build-first mentality**: "Start simple and go up from there" — prefers iterative development
- **Domain patience**: Willing to negotiate for preferred domain rather than settle, but won't block build
- **Tech decision**: Chose custom Next.js over WordPress despite familiarity with latter
- **Scope discipline**: Scoped to explainers + quiz first, MP tracking later (avoided feature creep)

## Unresolved/Open Questions

- [x] ~~Long-term: Other income streams after affiliate success~~ — Now The Brief
- [ ] Model preferences: DeepSeek Reasoner primary (Moonshot config issue pending)
- [ ] Heartbeat frequency: Currently every 4 hours, user-adjustable
- [ ] OpenClaw provider configuration: Moonshot custom provider — investigate alternatives
- [ ] The Brief name: Final confirmation pending
- [ ] Domain acquisition: Negotiation in progress
- [ ] The Brief tone: To be determined with user

## Time & Timeline Tracking (CRITICAL)

**Current Time Reference:** Saturday, February 28, 2026 — 9:39 AM NZST (Pacific/Auckland)

### Session Boundaries (My Memory Gaps)
- **I don't persist between sessions** — Each conversation is fresh
- **"Last night" = Feb 27, 2026 evening** — Recent, still warm
- **"Yesterday" = Feb 27, 2026** — Still very relevant
- **"This morning" = Feb 28, 2026 before ~9 AM** — Current session

### Recent Timeline (Commit to Memory)
| When | What Happened | Where |
|------|---------------|-------|
| Feb 27 evening | Pivot discussed: Affiliate → The Brief | the-brief chat |
| Feb 27 night | Two-chat workflow established | the-brief chat |
| Feb 27 overnight | Memory consolidation ran (2 AM) | Automated |
| Feb 28 6 AM | Heartbeat check | Planning HQ |
| Feb 28 7 AM | Daily note creation reminder | System |
| Feb 28 8 AM | Security audit completed | System |
| Feb 28 9 AM | **Now** — User called out my time confusion | Planning HQ |

### The Rule
**Before assuming something is "new":**
1. Check today's daily note (memory/chats/[chat]/YYYY-MM-DD.md)
2. Check yesterday's note for recent context
3. If user says "we discussed this" or "last night" — believe them immediately
4. Don't treat <24 hour old conversations as "old news" to be relearned

### What I Got Wrong Today
- Treated Feb 27 evening discussion (the pivot, chat split) as if it was ancient history
- Rebuilt memory structure that was already discussed and in progress
- Failed to recognize "last night" meant ~12 hours ago, not days/weeks ago

**Fix:** Check timestamps. Trust user's timeline references. When in doubt, ask "when was this?" instead of assuming.

---
*Last updated: 2026-02-28 9:39 AM (context pivot day, time correction)*
*Update frequency: As patterns observed, or during nightly consolidation (daily)*
