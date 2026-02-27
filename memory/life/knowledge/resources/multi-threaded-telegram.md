# Multi-Threaded Telegram Groups Setup

*Felix pattern for parallel workstreams without context pollution*

## Overview

Felix uses multiple Telegram groups to work on different projects simultaneously. Each group spawns a separate OpenClaw session, so contexts don't pollute each other.

**Felix's groups:**
- EasyClaw (product development)
- Twitter/X stuff
- iOS app
- Polylog (document editor)

## Benefits

1. **Parallel work** — Can be doing 5 things at once
2. **Clean contexts** — Each session only sees relevant history
3. **No interruptions** — Drop a bug report in one group without disturbing another
4. **Organized** — Different workstreams stay separate

## Setup Instructions

### 1. Create Groups

In Telegram, create groups for each workstream:

```
Group: "Kashie - Affiliate Marketing"
Group: "Kashie - Content Generation"
Group: "Kashie - System/Dev"
Group: "Kashie - General"
```

### 2. Add Bot to Groups

1. Open each group
2. Add member → Search for your bot (@kashie_bot)
3. Add to group

### 3. Configure Bot Permissions

**Critical step:** Allow bot to see all messages (not just mentions)

1. Go to @BotFather
2. `/mybots` → Select your bot
3. Bot Settings → Group Privacy
4. Turn **OFF** ("Privacy mode is disabled")

Now the bot can see all messages in groups, not just when tagged.

### 4. How It Works

- **DM (this chat):** General conversation, main control
- **Groups:** Specific workstreams
- Each message in a group spawns a new isolated OpenClaw session
- Sessions run in parallel
- No context shared between groups

### 5. Usage Patterns

**Affiliate Marketing Group:**
- Content strategy discussions
- Program research
- Performance reviews
- "Generate 3 articles about ClickUp"

**Content Generation Group:**
- Article drafts
- Review/editing workflow
- SEO optimization
- "Review and improve this article"

**System/Dev Group:**
- Bug fixes
- Feature development
- Infrastructure changes
- "Fix the WordPress publishing bug"

**General Group:**
- Random ideas
- Quick questions
- Testing

## Security Note

All groups are **authenticated channels** — I treat messages from any group as authenticated commands from Vianni. This is safe because:
- Groups are private/invite-only
- Bot only joins groups you create
- You control membership

## Example Workflow

**Morning:**
1. Drop a bug in "System/Dev": "The WordPress connector is failing"
2. Start content review in "Content Generation": "Review yesterday's articles"
3. Check affiliate status in "Affiliate Marketing": "What's our program coverage?"

All three run in parallel. No waiting. No context mixing.

## Migration

Currently we use this DM for everything. To migrate:

1. Create the groups above
2. Add @kashie_bot to each
3. Configure BotFather permissions
4. Start using groups for specific topics
5. Keep DM for general/main control

I'll recognize which group a message comes from and maintain separate context for each.

---
