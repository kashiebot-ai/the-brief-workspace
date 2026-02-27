# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Web Search (Brave Search API)

### Rate Limits & Usage Pattern
- **Plan:** Free tier (2,000 queries/month)
- **Rate limit:** 1 query/minute (confirmed from first-day setup memory)
- **Strategy:** Search sequentially with 60+ second delays between queries
- **Pattern:** Space searches out (especially overnight during proactive work)
- **Why:** Concurrent or rapid searches trigger 429 errors (rate limit exceeded)
- **Optimization:** For investment edge hunting, run 5-10 searches per idea analysis over time, pacing at 1/minute

### Best Practices
1. Single queries with 60+ second delays between searches
2. Batch related searches overnight when time pressure low
3. Monitor quota usage: 644/2000 used (as of Feb 20, 2026)
4. If hitting limits, extend to hourly/daily pacing

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
