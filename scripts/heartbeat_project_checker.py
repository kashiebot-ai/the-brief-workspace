#!/usr/bin/env python3
"""
Heartbeat Checker for Long-Running Projects
Based on Felix's architecture

This script is called during heartbeat to:
1. Check daily notes for open Codex projects
2. Verify if sessions are still running
3. Restart if died, report if finished
4. Keep long-running work going without user intervention
"""

import json
import subprocess
from datetime import datetime
from pathlib import Path

WORKSPACE = Path("/Users/viannicaro-watts/clawd")
MEMORY_DIR = WORKSPACE / "memory"


def get_active_projects():
    """Scan recent daily notes for active Codex projects."""
    active = []
    
    # Look at last 3 days of daily notes
    for i in range(3):
        date = (datetime.now() - __import__('datetime').timedelta(days=i)).strftime("%Y-%m-%d")
        daily_file = MEMORY_DIR / f"{date}.md"
        
        if daily_file.exists():
            content = daily_file.read_text()
            # Look for active Codex project markers
            if "🔄 **Active Codex Project**" in content or "Codex session started" in content:
                # Extract project info (simplified - would parse more carefully)
                active.append({
                    "date": date,
                    "status": "active",
                    "source": str(daily_file)
                })
    
    return active


def check_session_status(project):
    """Check if the Codex session is still running."""
    # This would check for actual process/session
    # Placeholder for the pattern
    return "running"  # or "died", "finished"


def restart_project(project):
    """Restart a died project."""
    # Would respawn Codex session
    pass


def report_completion(project):
    """Report finished project to user."""
    # Would send notification
    pass


def main():
    """Check active projects during heartbeat."""
    active = get_active_projects()
    
    if not active:
        return  # Nothing to check
    
    for project in active:
        status = check_session_status(project)
        
        if status == "running":
            # Do nothing, still working
            pass
        elif status == "died":
            # Restart it silently
            restart_project(project)
        elif status == "finished":
            # Report to user
            report_completion(project)


if __name__ == "__main__":
    main()
