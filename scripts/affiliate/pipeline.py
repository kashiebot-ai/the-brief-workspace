#!/usr/bin/env python3
"""
Affiliate Marketing Automation Pipeline
This script orchestrates the entire affiliate marketing workflow.
"""
import json
import time
from datetime import datetime
import subprocess
import sys
import os

sys.path.append(os.path.dirname(__file__))
from content_generator import generate_blog_outline
from program_manager import read_programs

class AffiliatePipeline:
    def __init__(self):
        self.programs = read_programs()
        self.today = datetime.now().strftime("%Y-%m-%d")
        
    def step_1_research(self):
        """Step 1: Keyword and competitor research."""
        print("=== Step 1: Research ===")
        # This would call Brave Search API (rate-limited)
        # For now, return mock data
        keywords = [
            "Notion vs ClickUp 2026",
            "Jasper AI review",
            "Best AI writing tools",
            "Pictory video creation",
            "ConvertKit for beginners"
        ]
        print(f"Generated {len(keywords)} keyword ideas")
        return keywords
    
    def step_2_content_planning(self, keywords):
        """Step 2: Create content outlines."""
        print("=== Step 2: Content Planning ===")
        outlines = []
        for kw in keywords[:3]:  # Limit to 3 for demo
            # Extract product name from keyword (simplistic)
            product = kw.split()[0] if 'vs' not in kw else kw.split()[0]
            outline = generate_blog_outline(
                product_name=product,
                product_category="AI Productivity",
                competitor_products=["Competitor"] if 'vs' in kw else None
            )
            outlines.append(outline)
            print(f"Created outline: {outline['title']}")
        
        # Save outlines
        with open(f'../../content/outlines_{self.today}.json', 'w') as f:
            json.dump(outlines, f, indent=2)
        return outlines
    
    def step_3_content_creation(self, outlines):
        """Step 3: Generate full content (calls OpenClaw)."""
        print("=== Step 3: Content Creation ===")
        print("This step would call OpenClaw API to write articles")
        print("For demo, creating placeholder files")
        
        for i, outline in enumerate(outlines):
            filename = f"../../content/drafts/{outline['slug']}.md"
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            
            # Create a simple markdown draft
            with open(filename, 'w') as f:
                f.write(f"# {outline['title']}\n\n")
                f.write(f"*Generated {self.today}*\n\n")
                for section in outline['sections']:
                    f.write(f"## {section['heading']}\n\n")
                    f.write(f"{section['content']}\n\n")
                    if 'subsections' in section:
                        for sub in section['subsections']:
                            f.write(f"### {sub}\n\n")
            print(f"Created draft: {filename}")
    
    def step_4_publishing(self):
        """Step 4: Publish to WordPress (mock)."""
        print("=== Step 4: Publishing ===")
        print("This would post to WordPress via REST API")
        print("For demo, simulating publish")
    
    def step_5_social_sharing(self):
        """Step 5: Share on social media."""
        print("=== Step 5: Social Sharing ===")
        print("This would post to Twitter, LinkedIn, etc.")
    
    def step_6_tracking(self):
        """Step 6: Track performance."""
        print("=== Step 6: Tracking ===")
        print("Would check analytics, conversions, revenue")
    
    def run_full_pipeline(self):
        """Run the complete pipeline."""
        print(f"Starting Affiliate Pipeline - {self.today}")
        print(f"Tracking {len(self.programs)} affiliate programs")
        
        keywords = self.step_1_research()
        time.sleep(2)
        
        outlines = self.step_2_content_planning(keywords)
        time.sleep(2)
        
        self.step_3_content_creation(outlines)
        time.sleep(2)
        
        self.step_4_publishing()
        self.step_5_social_sharing()
        self.step_6_tracking()
        
        print("\n=== Pipeline Complete ===")
        print("Next: Review drafts, then publish manually.")
    
    def run_daily_check(self):
        """Daily check for new programs, performance, etc."""
        print("=== Daily Affiliate Check ===")
        print(f"1. Checking {len(self.programs)} programs for updates")
        print("2. Reviewing yesterday's traffic/conversions")
        print("3. Checking for new trending keywords")
        print("4. Generating content ideas")
        
        # Check for new high-commission programs
        high_comm = [p for p in self.programs if p['Commission'] and '%' in p['Commission']]
        numeric_commissions = []
        for p in high_comm:
            import re
            match = re.search(r'(\d+)%', p['Commission'])
            if match:
                numeric_commissions.append((p['Program'], int(match.group(1))))
        
        numeric_commissions.sort(key=lambda x: x[1], reverse=True)
        print("\nTop 5 programs by commission:")
        for prog, comm in numeric_commissions[:5]:
            print(f"  {prog}: {comm}%")
        
        return numeric_commissions[:5]

if __name__ == '__main__':
    pipeline = AffiliatePipeline()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'daily':
            pipeline.run_daily_check()
        elif sys.argv[1] == 'full':
            pipeline.run_full_pipeline()
        else:
            print("Usage: python pipeline.py [daily|full]")
    else:
        # Default: daily check
        pipeline.run_daily_check()