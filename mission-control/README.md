# Mission Control

A modern, AI-powered project dashboard for managing "The Brief" and other ventures.

## Overview

Mission Control is a Next.js 16 dashboard that provides:

- **Real-time project status** for "The Brief" political transparency platform
- **GitHub integration** showing active branches and merge status
- **OpenClaw gateway connection** for AI-powered automation
- **Affiliate marketing tracking** with content pipeline
- **System health monitoring** across all connected services

## Current Status

**The Brief Project:**
- ✅ 9 feature branches completed (March 3rd Night Shift)
- ✅ 95 bills tracked from Parliament.nz
- ✅ 69 electorates with full MP data
- ✅ Quiz, SEO, Design, Bill tools all ready
- ⏳ Awaiting merge to main

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS 4**
- **NextAuth.js** (authentication)
- **Lucide React** (icons)

## Development

```bash
cd mission-control
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# OpenClaw Gateway (optional - for local integration)
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_GATEWAY_TOKEN=your-token
```

## Features

### Dashboard
- Live project metrics (branches, deploys, election countdown)
- Completed work timeline
- Ready-to-merge branch queue
- Next steps priority list
- System health monitoring

### Affiliate Marketing
- Program tracking (Notion, Copy.ai, Vercel, Sanity)
- Content pipeline with status
- Automation workflow status
- Performance metrics

### OpenClaw Integration
- Gateway connection status
- Session monitoring
- Tool invocation proxy
- Real-time health checks

## Project Structure

```
/app
  /page.tsx           # Main dashboard
  /affiliate/page.tsx # Affiliate marketing
  /auth/signin        # Authentication
  /api/openclaw       # OpenClaw proxy API
/components
  Sidebar.tsx         # Navigation
  Header.tsx          # Top bar with search
  Widget.tsx          # Reusable card component
  OpenClawStatus.tsx  # Gateway status widget
/lib
  openclaw.ts         # Gateway utilities
```

## Connected Projects

- **The Brief** - [Production Site](https://the-brief-odmv4zxa7-kashiebot-7409s-projects.vercel.app)
- **GitHub Repo** - [kashiebot-7409s-projects/the-brief](https://github.com/kashiebot-7409s-projects/the-brief)

## License

Internal use only.
