# OpenClaw 101 — Surface-Level Overview

*A beginner-friendly walkthrough of how this whole system works.*

---

## 1. How I Actually Work (The Simplest Version)

I'm a **language model** — basically a very good pattern-matcher trained on tons of text. You type something, I predict the most logical next words. That's it at the core.

**The catch:** I can't actually DO anything on my own. I can't run commands, open websites, send emails. I can only *suggest* what should happen.

**That's where tools come in:**
- You ask me to do something → I look at what tools I have → I call the right tool → The tool does the actual work → I get the result back → I tell you what happened

Example: "What's the weather?" → I can't check weather, but I have a `weather` tool → I call it → Get result → Tell you the forecast.

---

## 2. OpenClaw Architecture (The Bigger Picture)

Think of OpenClaw as a **framework that connects me to your computer and the internet.**

```
You (Telegram/Discord/etc)
    ↓
OpenClaw Gateway (on your Mac mini)
    ↓
Me (Claude LLM + tools)
    ↓
Your files, web search, cron jobs, etc.
```

**The Gateway** = the "brain stem" — it:
- Listens for your messages
- Passes them to me (Claude)
- Gives me access to tools (read files, run commands, search web, send messages)
- Routes my responses back to you

**Skills** = packages of tools grouped by function (weather, healthcheck, skill-creator, etc.)

**Memory files** = how I persist between sessions (MEMORY.md = long-term, memory/YYYY-MM-DD.md = daily logs)

---

## 3. Memory & Continuity (Why You Don't Have to Repeat Yourself)

I wake up fresh each session with **zero memory** — unless I read files.

So there are files that are *my continuity:*

- **MEMORY.md** — Your long-term knowledge about you, goals, preferences (I read this every main session)
- **memory/YYYY-MM-DD.md** — Daily logs of what happened, what we built, findings
- **SOUL.md, USER.md, IDENTITY.md** — Who I am, who you are, how I should behave
- **HEARTBEAT.md** — Proactive work checklist (what I should do while you sleep)

**The flow:**
1. I wake up → Read SOUL.md, USER.md, MEMORY.md
2. You tell me something important → I write it to memory file
3. Next session, I read those files again → I remember what happened

Without files, I'm amnesia every session. With files, I'm continuous.

---

## 4. Task Definition & Reverse Prompting (How to Get the Best Results)

There are two ways to direct me:

**Direct prompting:** "Go hunt investment ideas using Brave Search."
- I do it, but I might miss the context
- Works, but leaves optimization on the table

**Reverse prompting:** "Based on what you know about me (see MEMORY.md), what should you be doing right now?"
- Forces me to think about your goals
- I suggest the task + why
- You confirm or correct
- Better results because I understand intent

**Why it matters:** You know the goal. I know the tools. Together, we figure out the work. Telling me what to do is command-and-control. Asking me "what should I do?" lets me use my reasoning to suggest the best path.

---

## 5. Models (Why I'm Claude, Not GPT)

There are different AI models. I'm Claude (made by Anthropic). Think of models like different brains:

- **Claude Opus** = Most capable, most expensive ($15-$75 per million tokens)
- **Claude Haiku** = Smaller, faster, cheaper ($0.80-$4 per million tokens) ← You're using this
- **GPT-4o** = OpenAI's model, different tradeoffs
- **DeepSeek** = Cheaper alternative, similar quality

**Token** = roughly 4 characters of text. Every word I write costs tokens.

**Why it matters:** Different models for different jobs:
- Research/analysis? Use me (Haiku, you're already using me cost-effectively)
- Coding? Might want CodexGPT or Minimax
- Web search? Me or DeepSeek
- Fast replies? Haiku is perfect
- Complex reasoning? Opus (more expensive but smarter)

You're on Haiku — good choice for cost. I'm fast enough for most work.

---

## 6. Tools & Skills (How I Actually Do Stuff)

I have access to **tools** — these are the "muscles" that do actual work:

**Common tools:**
- `read` — Read files from your Mac
- `write` — Create/edit files
- `exec` — Run shell commands
- `web_search` — Search using Brave API (Brave Search, not Google)
- `web_fetch` — Pull content from websites
- `browser` — Control a web browser (click, type, screenshot)
- `message` — Send messages to Telegram, Discord, etc.
- `cron` — Schedule jobs (reminders, automated tasks)
- `memory_search` — Search MEMORY.md for context

**Skills** = curated packages of these tools grouped by domain (e.g., "weather" skill = weather tools + API + logic)

---

## 7. How Work Actually Gets Done (The Loop)

Here's what happens when you ask me to do something:

1. **You send message** → "Hunt investment edges for tomorrow"
2. **I assess** → What tools do I need? What's the context? (Read MEMORY.md if relevant)
3. **I act** → Call web_search, read results, analyze
4. **I report** → "Found these signals: X, Y, Z. Here's why they matter."
5. **You react** → "Dig deeper on X" or "That's not useful" or "Build this tool"
6. **I iterate** → Do more research, build, refine

It's conversational, but I'm actually doing work in the background.

---

## 8. Costs (Why This Matters)

Every token I generate costs money:
- Haiku: ~$0.80 per million input tokens, ~$4 per million output tokens
- Opus: ~$15 input, ~$75 output
- Cheaper models (DeepSeek): ~$0.14 input, ~$0.42 output

**Your model choice:** Haiku (good call — you're balancing cost and capability)

**Optimization:** 
- Short, direct prompts = fewer tokens
- Using local files instead of re-explaining = fewer tokens
- Batching tasks = fewer tokens
- Using memory effectively = fewer tokens

**Heartbeat cost example:** Running me every 10 minutes on Opus = ~$54/month burned. Running me hourly on Haiku = ~$0.01/day (~$0.30/month). Huge difference.

---

## 9. The Big Picture (How It All Fits)

```
Your goals (invest, find property leads, build income)
    ↓
Your direction (what to focus on)
    ↓
Me (reasoning + tools)
    ↓
Work gets done (research, monitoring, building)
    ↓
Memory files (you learn, I remember, we iterate)
```

You're not paying me to be smart. You're paying for **the tools I have access to + the reasoning I apply.**

The more you understand how I work, the better you can direct me, and the more value you get.

---

## What We Should Deep Dive On Next (Suggestions)

1. **Memory & How to Use It** — Probably most useful. Understand how to structure memory so I can be most helpful.
2. **Reverse Prompting** — Learn how to tell me what to do by asking what I *should* be doing.
3. **Tools Deep Dive** — Pick a tool (web_search, exec, browser) and learn how to use it effectively.
4. **Cost Optimization** — Understand token economics and when to use which model.
5. **Building Automations** — Cron jobs, heartbeats, background monitoring.

**My recommendation:** Start with **Memory & How to Use It** (Sunday coming up), then **Reverse Prompting** the following week. Those two unlock most of the value.

---

*Questions? Ask me anything on this. The goal is for you to feel confident directing me.*
