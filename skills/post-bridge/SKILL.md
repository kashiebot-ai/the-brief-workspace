---
name: post-bridge
description: Post to TikTok, Instagram, YouTube, X, LinkedIn, and more using Post Bridge API. Use when scheduling, posting, or managing social media content across multiple platforms.
homepage: https://post-bridge.com
metadata:
  openclaw:
    emoji: 📱
    primaryEnv: POSTBRIDGE_API_KEY
    requires:
      env:
        - POSTBRIDGE_API_KEY
---

# Post Bridge Skill

Post to multiple social media platforms using Post Bridge API.

## Setup

1. Sign up at https://post-bridge.com/create-account
2. Connect your social accounts (TikTok, Instagram, YouTube, X, LinkedIn, etc.)
3. Generate an API key
4. Set environment variable:
   ```bash
   export POSTBRIDGE_API_KEY="your-api-key"
   ```

## Usage

### Post to all platforms

```bash
./scripts/post.sh "Your post text" /path/to/image.jpg
```

### Schedule a post

```bash
./scripts/schedule.sh "Your post text" "2026-03-01T09:00:00" /path/to/image.jpg
```

## Supported Platforms

- TikTok
- Instagram (posts, reels, stories)
- YouTube (videos, shorts)
- X (Twitter)
- LinkedIn
- Facebook
- Threads
- Bluesky
- Pinterest
