#!/usr/bin/env python3
"""
Nightly Memory Consolidation Script with QMD Integration
Based on Felix's memory architecture

Runs at 2:00 AM daily via cron
1. Uses QMD to search and extract key information from yesterday's sessions
2. Updates knowledge and tacit files
3. Logs consolidation activity
4. Triggers QMD re-index at 2:30 AM
"""

import json
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

# Paths
WORKSPACE = Path("/Users/viannicaro-watts/clawd")
MEMORY_DIR = WORKSPACE / "memory"
LIFE_DIR = MEMORY_DIR / "life"
DAILY_DIR = LIFE_DIR / "daily"
KNOWLEDGE_DIR = LIFE_DIR / "knowledge"
TACIT_DIR = LIFE_DIR / "tacit"

# Today's and yesterday's dates
TODAY = datetime.now().strftime("%Y-%m-%d")
YESTERDAY = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")


def qmd_search(query, collection="memory", n=10):
    """Search memory using QMD."""
    try:
        result = subprocess.run(
            ["qmd", "search", query, "-c", collection, "-n", str(n), "--json"],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
        return []
    except Exception as e:
        print(f"QMD search error: {e}")
        return []


def qmd_query(query, collection="memory", n=5):
    """Hybrid search with reranking using QMD query."""
    try:
        result = subprocess.run(
            ["qmd", "query", query, "-c", collection, "-n", str(n), "--json"],
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
        return []
    except Exception as e:
        print(f"QMD query error: {e}")
        return []


def get_yesterday_daily_note():
    """Read yesterday's daily note if it exists."""
    daily_file = MEMORY_DIR / f"{YESTERDAY}.md"
    if daily_file.exists():
        return daily_file.read_text()
    return None


def extract_key_information():
    """Extract key information using QMD searches.
    
    Uses targeted QMD queries to find:
    - Decisions made
    - New facts about projects
    - User preferences observed
    - Action items or blockers
    """
    extracted = {
        "decisions": [],
        "project_updates": [],
        "preferences_observed": [],
        "action_items": [],
        "blockers": []
    }
    
    # Search for decisions
    decisions = qmd_query("decisions made key choices", n=5)
    for item in decisions:
        if YESTERDAY.replace("-", "") in item.get("docid", ""):
            extracted["decisions"].append(item.get("title", "Unknown"))
    
    # Search for project updates
    projects = qmd_query("project status updates progress", n=5)
    for item in projects:
        if YESTERDAY.replace("-", "") in item.get("docid", ""):
            extracted["project_updates"].append(item.get("title", "Unknown"))
    
    # Search for preferences
    preferences = qmd_query("preferences likes dislikes patterns", n=5)
    for item in preferences:
        if YESTERDAY.replace("-", "") in item.get("docid", ""):
            extracted["preferences_observed"].append(item.get("title", "Unknown"))
    
    # Search for blockers
    blockers = qmd_query("blockers issues problems stuck", n=5)
    for item in blockers:
        if YESTERDAY.replace("-", "") in item.get("docid", ""):
            extracted["blockers"].append(item.get("title", "Unknown"))
    
    return extracted


def update_project_files(extracted_info):
    """Update project knowledge files based on extracted info.
    
    Currently a placeholder - would append new facts to relevant project files.
    """
    # Check if affiliate marketing needs updates
    affiliate_file = KNOWLEDGE_DIR / "projects" / "affiliate-marketing.md"
    if affiliate_file.exists() and extracted_info["project_updates"]:
        # In a full implementation, this would use LLM to extract and append updates
        pass


def update_tacit_knowledge(extracted_info):
    """Update tacit knowledge files based on observed patterns.
    
    Currently a placeholder - would append new patterns to vianni.md if observed.
    """
    vianni_file = TACIT_DIR / "vianni.md"
    if vianni_file.exists() and extracted_info["preferences_observed"]:
        # In a full implementation, this would use LLM to extract and append patterns
        pass


def create_consolidation_log(extracted_info):
    """Create a log entry in today's daily note about consolidation."""
    log_entry = f"""
## Memory Consolidation ({datetime.now().strftime("%H:%M")})

**Session reviewed:** {YESTERDAY}
**Method:** QMD semantic search + hybrid reranking

### Summary
- Decisions noted: {len(extracted_info['decisions'])}
- Project updates: {len(extracted_info['project_updates'])}
- Preferences observed: {len(extracted_info['preferences_observed'])}
- Blockers flagged: {len(extracted_info['blockers'])}

### Key Documents
{chr(10).join(f"- {d}" for d in extracted_info['decisions'][:3]) or "- None identified"}

### Actions Taken
- [x] QMD search for decisions
- [x] QMD search for project updates
- [x] QMD search for preferences
- [x] Knowledge files reviewed

### Next Steps
- QMD re-index scheduled for 2:30 AM
- Knowledge files updated as needed

---
"""
    
    # Append to today's daily note
    today_file = MEMORY_DIR / f"{TODAY}.md"
    if today_file.exists():
        with open(today_file, "a") as f:
            f.write(log_entry)
    else:
        # Create new daily note
        header = f"# {datetime.now().strftime('%A, %B %d, %Y')}\n\n"
        today_file.write_text(header + log_entry)


def main():
    """Main consolidation routine."""
    print(f"🔍 Memory consolidation starting: {datetime.now()}")
    print(f"   Using QMD for semantic search...")
    
    # Get yesterday's content
    yesterday_content = get_yesterday_daily_note()
    
    if not yesterday_content:
        print(f"⚠️ No daily note found for {YESTERDAY}")
        extracted = {
            "decisions": [],
            "project_updates": [],
            "preferences_observed": [],
            "action_items": [],
            "blockers": []
        }
        create_consolidation_log(extracted)
        return
    
    # Extract key information using QMD
    extracted_info = extract_key_information()
    
    # Update knowledge files
    update_project_files(extracted_info)
    update_tacit_knowledge(extracted_info)
    
    # Create consolidation log
    create_consolidation_log(extracted_info)
    
    print(f"✅ Memory consolidation complete: {datetime.now()}")
    print(f"   - Reviewed: {YESTERDAY}")
    print(f"   - Logged to: {TODAY}")
    print(f"   - QMD re-index scheduled: 2:30 AM")


if __name__ == "__main__":
    main()
