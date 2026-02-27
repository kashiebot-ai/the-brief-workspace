# Tech Stack — The Briefing

> What we use and why.

---

## Under Consideration

### Option A: Next.js + Sanity CMS
**Pros:**
- Full control over design/functionality
- Great for custom features (MP tracker, bill database)
- Fast, SEO-friendly
- Scales well

**Cons:**
- More complex setup
- Need hosting (Vercel, etc.)
- Higher maintenance

### Option B: Substack
**Pros:**
- Built-in email + payments
- Zero setup
- Network effects (discovery)

**Cons:**
- Limited customization
- No custom features (trackers, databases)
- Locked into platform

### Option C: Ghost
**Pros:**
- Purpose-built for newsletters
- Self-hosted or managed
- Membership/payments built-in
- Clean, fast

**Cons:**
- Less flexible than Next.js
- Still need customization for trackers

---

## My Recommendation

**Start with Ghost (managed)** for speed to market:
- Get newsletter running in days, not weeks
- Built-in email + payments
- Can always migrate to Next.js later

**Build Next.js prototype in parallel** for:
- MP voting tracker
- Bill database
- Advanced search
- Eventually migrate main site

---

## Infrastructure

### Monitoring (OpenClaw)
- Parliament API + web scraping
- Council agenda monitoring (phase 2)
- 24/7 monitoring with alerts
- Auto-summarization pipeline

### Email
- Ghost managed = built-in
- Or ConvertKit/Mailchimp if Next.js

### Hosting
- Ghost Pro = $25/month (managed)
- Vercel = free tier (Next.js)

### Domain
- .co.nz preferred for NZ audience
- thebriefing.co.nz available?

---

## Decision Needed

**User to decide:**
- Speed vs customization priority?
- Comfort level with self-hosting?
- Budget for managed services?

---

*Last updated: 2026-02-27*
