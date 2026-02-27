# Life Directory - Three-Layer Memory System

Based on the PARA method (Thiago Forte) + Felix's memory architecture.

Uses **QMD** (Query Markup Documents) by Toby Lütke (Shopify) for fast semantic search across all memory files.

## Structure

### /daily/
Daily session notes — what happened, what was discussed, active projects tracked day-by-day.

### /knowledge/
Knowledge graph — facts about entities, projects, resources, people.
- `entities/` — People, companies, tools, platforms
- `projects/` — Active and completed projects
- `resources/` — APIs, documentation, guides

### /tacit/
Tacit knowledge — how Vianni operates, preferences, patterns, lessons.
- `vianni.md` — Preferences, patterns, communication style
- `security.md` — Security rules, authenticated channels

### /projects/
Project-specific working notes and documentation.

## QMD Search (Local, Fast)

QMD provides BM25 + vector embeddings + LLM reranking for instant memory retrieval.

### Collections
- `memory` — All memory files (`/memory/**/*.md`)
- `life` — Three-layer system files (`/memory/life/**/*.md`)

### Commands
```bash
# Fast keyword search
qmd search "affiliate marketing" -n 5

# Semantic search
qmd vsearch "project status"

# Hybrid + reranking (best quality)
qmd query "what was decided yesterday"

# Search specific collection
qmd search "API" -c life

# JSON output for agents
qmd query "blockers" --json -n 10
```

## Nightly Consolidation Schedule

**2:00 AM** — Memory Consolidation (Haiku model)
- Reviews yesterday's sessions using QMD semantic search
- Extracts decisions, preferences, blockers
- Updates knowledge/tacit files
- Logs activity

**2:30 AM** — QMD Re-index
- Updates search index with new daily notes
- Regenerates embeddings

## Usage

1. **Daily notes** — Auto-created each day, track what happens
2. **Knowledge** — Updated when new facts/entities emerge  
3. **Tacit** — Updated when patterns/preferences are observed
4. **Search** — Use QMD for instant retrieval across all memory

## Files

| File | Purpose |
|------|---------|
| `tacit/vianni.md` | How Vianni operates, preferences, patterns |
| `tacit/security.md` | Security rules, authenticated vs info channels |
| `knowledge/projects/affiliate-marketing.md` | Primary project status |
| `knowledge/entities/tools.md` | Key infrastructure and APIs |

---
*Last updated: 2026-02-25*
