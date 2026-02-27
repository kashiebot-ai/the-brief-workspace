# Key Tools & Platforms

*Critical infrastructure and services used in this setup.*

## OpenClaw

**Purpose:** Core agent framework
**Host:** Mac Mini (headless, 24/7)
**Version:** 2026.2.21-2
**Access:** Tailscale (127.0.0.1:18789)
**Primary Model:** DeepSeek Reasoner
**Cost Model:** Haiku for heartbeat (~$0.01/day)

### Configuration
- Gateway: Local only, loopback bind
- Security: Safe defaults applied
- Updates: Manual (user-applied)
- Cron jobs: Daily audit (8 AM), weekly update check (Sunday 9 AM)

## Mac Mini

**Role:** 24/7 OpenClaw host
**Location:** Napier, NZ
**Access:** Tailscale + Screen Sharing
**Security:** 
- FileVault disabled (auto-login for remote access)
- Application Firewall enabled
- Manual updates

## Affiliate Marketing Stack

### Content Generation
- Python scripts (8 modules)
- Template-driven articles
- 2-3 articles/day capacity

### Website
- Static HTML prototype ready
- WordPress (awaiting setup)
- Mission Control dashboard (Next.js)

### Programs
- 19 vetted affiliate programs
- 17 NZ-friendly
- Up to 100% commissions

### Publishing
- Mock mode currently (safe testing)
- Production mode pending credentials

## APIs & Keys (Configured)

| Service | Status | Use | Notes |
|---------|--------|-----|-------|
| Brave Search | ✅ Active | Web search | 2000/mo limit; ~644 used as of Feb 20 |
| Moonshot (Kimi) | ✅ Available | Alternative model testing | API key provided; base URL: https://api.moonshot.ai/v1; Model: kimi-k2.5 |
| Stripe | ✅ Available | Future product payments | — |
| Vercel | ✅ Available | Deployment | — |
| WordPress | ⏳ Pending | Content publishing | Awaiting domain/hosting setup |
| Social Media | ⏳ Pending | Auto-posting | — |

## Memory System

**Current:** Basic (MEMORY.md + daily files)
**Upgrading to:** Three-layer system (Felix-style)
- Daily notes
- Knowledge graph
- Tacit knowledge

## Communication

**Primary:** Telegram (this chat)
**Authenticated:** Yes — primary control channel
**Backup:** None currently

---
*Last updated: 2026-02-25*
