# Content Workflow — The Briefing

> ⚠️ **MANDATORY:** All content drafts must be saved to files. No exceptions.

---

## File Locations

| Content Type | Location | Example |
|--------------|----------|---------|
| Explainers | `content/explainer-[topic].md` | `explainer-how-parliament-works.md` |
| News digests | `content/digest-[date].md` | `digest-2026-03-01.md` |
| Quiz questions | `content/quiz-[topic].md` | `quiz-mmp-voting.md` |
| Drafts (WIP) | `content/drafts/[filename].md` | `drafts/budget-2026-explainer.md` |

---

## Required Frontmatter

Every content file must include:

```markdown
# Title

> **Status:** Draft | In Review | Approved | Published  
> **Type:** Explainer | Digest | Quiz | Analysis  
> **Target Audience:** [who this is for]  
> **Tone:** [educational, neutral, etc.]

---
```

---

## Pipeline Updates (Mandatory)

Always update `../CONTENT_PIPELINE.md` when:
- Starting new content
- Completing a draft
- Moving to review
- Publishing

Use these statuses:
- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Complete

---

## Review Workflow

1. **Draft complete** → Save to `content/`, update pipeline to "pending review"
2. **User reviews** → Discussion happens in The Brief (Production) chat
3. **Revisions needed** → Update file, mark "revised, pending review"
4. **Approved** → Mark "approved, ready to publish"
5. **Published** → Move to archive, update pipeline

---

## Never Do This

❌ Post draft only in chat, no file saved  
❌ Save file but forget pipeline update  
❌ Skip status/metadata in file  

---

*Created: 2026-02-27*
