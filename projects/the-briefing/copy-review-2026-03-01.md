# Copy Improvements - March 1, 2026

## Overview
Comprehensive copy review and improvement across all major pages of The Brief. Focus: sharper value propositions, journalistic tone, better readability.

## Key Changes

### 1. Homepage (`src/app/page.tsx`)

**Hero Section**
- **Before:** "New Zealand politics, made clear"
- **After:** "New Zealand politics, without the spin"
- **Why:** More direct, promises specific value (no spin vs. vague "clarity")

**Value Prop**
- **Before:** Fluffy language about "cutting through noise" and "power plays"
- **After:** Concrete promise - "We explain what's happening in Parliament — the bills, debates, and decisions that actually affect you. No jargon. No bias. Just the facts."
- **Why:** Specific, actionable, tells users exactly what they get

**Featured Section**
- **Before:** "What's happening in NZ politics?" with meta-commentary about headlines
- **After:** "Start here" with focus on education value and time commitment (5 min reads)
- **Why:** More welcoming for newcomers, emphasizes accessibility

**Newsletter CTA**
- **Before:** Generic "Get The Brief in your inbox"
- **After:** "Stay informed. Five minutes a day."
- **Why:** Lead with benefit, quantify time investment

### 2. About Page (`src/app/about/page.tsx`)

**Story Section - Complete Rewrite**
- **Before:** Started with personal frustration narrative, meandering
- **After:** Opens with authoritative statement: "Following NZ politics shouldn't require a degree in political science"
- **Key additions:**
  - Concrete examples of jargon ("MMP," "Select Committee processes")
  - Specific criticism of current media ("opinion masquerades as analysis")
  - Clear mission statement without flowery language
- **Why:** Journalistic tone, establishes authority, specific problems/solutions

**Principles Cards**
- **Clarity card:** Added concrete examples ("fiscal consolidation" = cuts, "revenue measures" = taxes)
- **Independence card:** Strengthened language ("Our only loyalty is to facts and our readers")
- **Time card:** More direct ("then get out of your way")
- **Why:** Concrete > abstract, show don't tell

**Team Section**
- **Before:** Generic "small team of journalists" language
- **After:** Direct, matter-of-fact ("We're reader-funded"), clear CTA to contact
- **Why:** Build trust through transparency, not corporate-speak

### 3. Quiz Page (`src/app/quiz/page.tsx`)

**Intro Copy**
- **Before:** "Who Should You Vote For?" (generic)
- **After:** "Which party matches your values?" with specifics about methodology
- **Added:** "based on their actual policies, not campaign promises"
- **Why:** Sets expectations, builds credibility, more engaging

### 4. Explainer Template (`src/app/explainer/[slug]/page.tsx`)

**Key Points Section**
- **Before:** "Key Takeaways"
- **After:** "The essentials"
- **Why:** More conversational, less corporate-speak

### 5. Footer (`src/components/Footer.tsx`)

**Newsletter Section**
- **Before:** "Stay informed"
- **After:** "Don't miss an issue"
- **Why:** Creates FOMO, implies regular publishing rhythm

**Brand Description**
- **Before:** "Independent, non-partisan explainers for engaged citizens"
- **After:** "We explain what's happening without telling you what to think"
- **Why:** Active voice, clearer value proposition

### 6. Metadata & SEO (`src/app/layout.tsx`)

**Title Tag**
- **Before:** "New Zealand Politics, Made Clear"
- **After:** "New Zealand Politics Without the Spin"
- **Why:** More distinctive, clearer differentiation

**Meta Description**
- **Before:** Generic "cut through the noise"
- **After:** Specific "Clear explainers on bills, budgets, and elections — no jargon, no bias, just facts. Understand what Parliament is actually doing."
- **Why:** Keywords (bills, budgets, elections, Parliament), specific promises

## Tone Shifts

### Before: Friendly/Casual
- "Great question!"
- "We're here to help you..."
- "Cut through the noise"
- Long explanatory passages

### After: Journalistic/Authoritative
- Direct statements
- Concrete examples
- Active voice
- Shorter, punchier sentences
- "We explain" vs. "We're here to explain"

## Copy Principles Applied

1. **Show, don't tell** - Use concrete examples instead of adjectives
2. **Lead with benefit** - What does the user get, specifically?
3. **Active voice** - "We explain" not "explanations are provided"
4. **Remove hedging** - Cut "really," "very," "actually" where unnecessary
5. **Respect time** - Get to the point faster
6. **Build trust through specifics** - "5 minutes" not "quick read"

## Metrics to Watch

1. **Homepage bounce rate** - Should improve with clearer value prop
2. **Newsletter signups** - Better CTA copy should increase conversions
3. **About page engagement** - More compelling story should increase time on page
4. **Quiz completion rate** - Better intro should set expectations
5. **SEO rankings** - More specific meta descriptions should improve CTR

## Next Steps

1. A/B test newsletter CTA variations
2. Add social proof to homepage (subscriber count if available)
3. Consider adding specific explainer examples to About page
4. Review and tighten individual explainer intros
5. Add "Recently Updated" section to show freshness
6. Create style guide based on these changes

## Git Commit

```
commit 5df73b4
Copy improvements: sharper value props, journalistic tone, better readability
```

**Files changed:** 6  
**Lines changed:** +68/-51

---

*Review completed 4:16 AM, March 1, 2026*
