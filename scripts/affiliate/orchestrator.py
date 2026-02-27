#!/usr/bin/env python3
"""
Main orchestrator for affiliate marketing automation.
Coordinates all modules into a complete workflow.
"""
import json
import os
import sys
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

# Import all modules
try:
    from article_generator import ArticleGenerator
    from wordpress_integration import WordPressPublisher, load_wordpress_config
    from social_media import SocialMediaPublisher
    from program_manager import read_programs
    from report_generator import generate_top_commissions_report, generate_nz_friendly_report
    from content_generator import generate_blog_outline
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure all module files exist in the same directory.")
    sys.exit(1)

class AffiliateOrchestrator:
    def __init__(self, config_dir: str = None):
        """
        Initialize the orchestrator.
        
        Args:
            config_dir: Directory containing configuration files (defaults to workspace root)
        """
        # Use absolute path if not provided
        if config_dir is None:
            SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
            WORKSPACE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../..'))
            config_dir = os.path.join(WORKSPACE_ROOT, 'config')
        else:
            WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(config_dir)))
        
        self.config_dir = config_dir
        self.workspace_root = WORKSPACE_ROOT
        self.today = datetime.now().strftime("%Y-%m-%d")
        self.programs = read_programs()
        
        # Initialize modules
        self.article_gen = ArticleGenerator()
        self.wordpress = self._init_wordpress()
        self.social = SocialMediaPublisher(os.path.join(config_dir, 'social_media.json'))
        
        # State tracking
        self.generated_articles = []
        self.published_posts = []
        self.shared_posts = []
        
    def _init_wordpress(self) -> WordPressPublisher:
        """Initialize WordPress publisher."""
        config = load_wordpress_config(f'{self.config_dir}/wordpress.json')
        return WordPressPublisher(
            base_url=config.get('base_url'),
            username=config.get('username'),
            password=config.get('password'),
            mock_mode=config.get('mock_mode', True)
        )
    
    def run_daily_workflow(self, generate_content: bool = True,
                          publish_to_wp: bool = False,
                          share_on_social: bool = False):
        """
        Run the complete daily workflow.
        
        Args:
            generate_content: Whether to generate new articles
            publish_to_wp: Whether to publish to WordPress
            share_on_social: Whether to share on social media
        """
        print("=" * 60)
        print(f"AFFILIATE MARKETING DAILY WORKFLOW - {self.today}")
        print("=" * 60)
        
        # Step 1: Analysis
        self._analyze_programs()
        
        # Step 2: Content generation
        if generate_content:
            self._generate_daily_content()
        
        # Step 3: WordPress publishing
        if publish_to_wp:
            self._publish_to_wordpress()
        
        # Step 4: Social media sharing
        if share_on_social:
            self._share_on_social_media()
        
        # Step 5: Reporting
        self._generate_daily_report()
        
        print("\n" + "=" * 60)
        print("WORKFLOW COMPLETE")
        print("=" * 60)
        
    def _analyze_programs(self):
        """Analyze affiliate programs for opportunities."""
        print("\n1. PROGRAM ANALYSIS")
        print("-" * 40)
        
        # Count programs
        total = len(self.programs)
        with_commission = sum(1 for p in self.programs if p['Commission'] and p['Commission'] != '?')
        nz_friendly = sum(1 for p in self.programs if p['NZ Access'] == 'Yes')
        
        print(f"Total programs: {total}")
        print(f"Programs with commission data: {with_commission}")
        print(f"NZ-friendly programs: {nz_friendly}")
        
        # Find top programs by commission
        high_commission = []
        for p in self.programs:
            if p['Commission'] and p['Commission'] != '?':
                import re
                match = re.search(r'(\d+)%', p['Commission'])
                if match:
                    high_commission.append((p['Program'], int(match.group(1))))
        
        if high_commission:
            high_commission.sort(key=lambda x: x[1], reverse=True)
            print("\nTop 5 programs by commission:")
            for prog, comm in high_commission[:5]:
                print(f"  {prog}: {comm}%")
        
        # Find programs needing content
        content_dir = os.path.join(self.workspace_root, 'content', 'articles')
        existing_articles = []
        if os.path.exists(content_dir):
            existing_articles = [f for f in os.listdir(content_dir) if f.endswith('.md')]
        
        # Check which programs don't have articles
        programs_without_content = []
        for p in self.programs[:10]:  # Check first 10
            program_name = p['Program']
            has_article = any(program_name.lower() in article.lower() 
                            for article in existing_articles)
            if not has_article and p['NZ Access'] == 'Yes':
                programs_without_content.append(program_name)
        
        if programs_without_content:
            print(f"\nPrograms needing content: {', '.join(programs_without_content[:5])}")
            self.recommended_programs = programs_without_content[:3]
        else:
            self.recommended_programs = ['Notion', 'ClickUp', 'Jasper']  # Default
    
    def _generate_daily_content(self, num_articles: int = 2):
        """Generate daily content."""
        print(f"\n2. CONTENT GENERATION ({num_articles} articles)")
        print("-" * 40)
        
        # Use recommended programs or fallback
        programs_to_cover = self.recommended_programs if hasattr(self, 'recommended_programs') else ['Notion', 'ClickUp']
        
        # Create content directory with absolute path
        content_articles_dir = os.path.join(self.workspace_root, 'content', 'articles')
        os.makedirs(content_articles_dir, exist_ok=True)
        
        for i, program in enumerate(programs_to_cover[:num_articles]):
            print(f"\nGenerating article for: {program}")
            
            try:
                # Generate article
                article = self.article_gen.generate_product_review(program)
                
                # Save article
                filename = os.path.join(content_articles_dir, f"{program.lower().replace(' ', '-')}-review-{self.today}.md")
                
                with open(filename, 'w') as f:
                    f.write(article)
                
                self.generated_articles.append({
                    'program': program,
                    'file': filename,
                    'title': article.split('\n')[0].replace('# ', '')
                })
                
                print(f"  Saved: {filename}")
                
            except Exception as e:
                print(f"  Error generating article for {program}: {e}")
        
        # Generate one comparison article if we have at least 2 programs
        if len(programs_to_cover) >= 2:
            print(f"\nGenerating comparison article: {programs_to_cover[0]} vs {programs_to_cover[1]}")
            try:
                comparison = self.article_gen.generate_comparison_article(
                    programs_to_cover[0], programs_to_cover[1]
                )
                
                filename = os.path.join(content_articles_dir, f"{programs_to_cover[0].lower()}-vs-{programs_to_cover[1].lower()}-comparison-{self.today}.md")
                
                with open(filename, 'w') as f:
                    f.write(comparison)
                
                self.generated_articles.append({
                    'program': f"{programs_to_cover[0]} vs {programs_to_cover[1]}",
                    'file': filename,
                    'title': comparison.split('\n')[0].replace('# ', '')
                })
                
                print(f"  Saved: {filename}")
                
            except Exception as e:
                print(f"  Error generating comparison: {e}")
    
    def _publish_to_wordpress(self):
        """Publish generated articles to WordPress."""
        print(f"\n3. WORDPRESS PUBLISHING")
        print("-" * 40)
        
        if not self.generated_articles:
            print("No articles to publish. Generate content first.")
            return
        
        for article_info in self.generated_articles:
            print(f"\nPublishing: {article_info['program']}")
            
            try:
                result = self.wordpress.publish_from_markdown(
                    article_info['file'],
                    auto_publish=False  # Always create as draft for review
                )
                
                if result.get('mock'):
                    print(f"  [MOCK] Created draft: {article_info['title']}")
                elif result.get('id'):
                    print(f"  Published as draft (ID: {result['id']})")
                else:
                    print(f"  Error: {result.get('error', 'Unknown error')}")
                
                article_info['wp_result'] = result
                self.published_posts.append(article_info)
                
            except Exception as e:
                print(f"  Error publishing to WordPress: {e}")
    
    def _share_on_social_media(self):
        """Share published articles on social media."""
        print(f"\n4. SOCIAL MEDIA SHARING")
        print("-" * 40)
        
        # For now, we'll simulate sharing
        # In a real implementation, this would use actual URLs from WordPress
        
        for article_info in self.generated_articles:
            print(f"\nSharing: {article_info['title']}")
            
            # Simulate URL (in real use, this would come from WordPress response)
            simulated_url = f"https://example.com/{article_info['program'].lower().replace(' ', '-')}-review"
            
            try:
                results = self.social.share_article(
                    article_title=article_info['title'],
                    article_url=simulated_url,
                    platforms=['twitter', 'linkedin']
                )
                
                for platform, result in results.items():
                    if result.get('success'):
                        print(f"  {platform}: Shared successfully")
                    else:
                        print(f"  {platform}: Failed - {result.get('error', 'Unknown error')}")
                
                article_info['social_results'] = results
                self.shared_posts.append(article_info)
                
            except Exception as e:
                print(f"  Error sharing on social media: {e}")
    
    def _generate_daily_report(self):
        """Generate daily performance report."""
        print(f"\n5. DAILY REPORT")
        print("-" * 40)
        
        report = {
            'date': self.today,
            'programs_analyzed': len(self.programs),
            'articles_generated': len(self.generated_articles),
            'articles_published': len(self.published_posts),
            'articles_shared': len(self.shared_posts),
            'generated_articles': [
                {
                    'program': a['program'],
                    'file': a['file'],
                    'title': a.get('title', '')
                }
                for a in self.generated_articles
            ]
        }
        
        # Create reports directory with absolute path
        reports_dir = os.path.join(self.workspace_root, 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        # Save report
        report_file = os.path.join(reports_dir, f'daily_report_{self.today}.json')
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"Report saved: {report_file}")
        
        # Print summary
        print(f"\nSummary:")
        print(f"  Articles generated: {len(self.generated_articles)}")
        print(f"  Articles published to WordPress: {len(self.published_posts)}")
        print(f"  Articles shared on social media: {len(self.shared_posts)}")
        
        if self.generated_articles:
            print(f"\nGenerated articles:")
            for article in self.generated_articles:
                print(f"  - {article['program']}: {article.get('title', 'No title')}")
    
    def generate_weekly_report(self):
        """Generate weekly summary report."""
        print("\n" + "=" * 60)
        print("WEEKLY REPORT")
        print("=" * 60)
        
        # Find all daily reports from the past week
        reports_dir = os.path.join(self.workspace_root, 'reports')
        weekly_reports = []
        
        if os.path.exists(reports_dir):
            for filename in os.listdir(reports_dir):
                if filename.startswith('daily_report_') and filename.endswith('.json'):
                    date_str = filename.replace('daily_report_', '').replace('.json', '')
                    try:
                        report_date = datetime.strptime(date_str, '%Y-%m-%d')
                        if report_date >= datetime.now() - timedelta(days=7):
                            with open(os.path.join(reports_dir, filename), 'r') as f:
                                report = json.load(f)
                                weekly_reports.append(report)
                    except ValueError:
                        continue
        
        if weekly_reports:
            total_articles = sum(r.get('articles_generated', 0) for r in weekly_reports)
            total_published = sum(r.get('articles_published', 0) for r in weekly_reports)
            
            print(f"Weekly Summary (Last {len(weekly_reports)} days):")
            print(f"  Total articles generated: {total_articles}")
            print(f"  Total articles published: {total_published}")
            print(f"  Average articles per day: {total_articles / max(len(weekly_reports), 1):.1f}")
            
            # Save weekly report
            weekly_file = f'{reports_dir}/weekly_report_{self.today}.json'
            weekly_summary = {
                'week_end_date': self.today,
                'days_in_report': len(weekly_reports),
                'total_articles_generated': total_articles,
                'total_articles_published': total_published,
                'daily_average': total_articles / max(len(weekly_reports), 1),
                'daily_reports': [r['date'] for r in weekly_reports]
            }
            
            with open(weekly_file, 'w') as f:
                json.dump(weekly_summary, f, indent=2)
            
            print(f"\nWeekly report saved: {weekly_file}")
        else:
            print("No daily reports found for the past week.")
    
    def run_content_audit(self):
        """Audit existing content and identify gaps."""
        print("\n" + "=" * 60)
        print("CONTENT AUDIT")
        print("=" * 60)
        
        content_dir = os.path.join(self.workspace_root, 'content', 'articles')
        if not os.path.exists(content_dir):
            print("No content directory found.")
            return
        
        articles = [f for f in os.listdir(content_dir) if f.endswith('.md')]
        
        print(f"Found {len(articles)} articles in content directory.")
        
        # Map programs to articles
        program_coverage = {}
        for program in self.programs:
            program_name = program['Program']
            matching_articles = [a for a in articles if program_name.lower() in a.lower()]
            program_coverage[program_name] = {
                'has_article': len(matching_articles) > 0,
                'article_count': len(matching_articles),
                'articles': matching_articles[:3]  # Limit to first 3
            }
        
        # Report coverage
        covered = sum(1 for p in program_coverage.values() if p['has_article'])
        total = len(program_coverage)
        
        print(f"\nProgram coverage: {covered}/{total} ({covered/total*100:.1f}%)")
        
        # List programs without articles
        uncovered = [p for p, data in program_coverage.items() 
                    if not data['has_article'] and self._is_program_eligible(p)]
        
        if uncovered:
            print(f"\nPrograms needing articles (priority):")
            for program in uncovered[:10]:
                program_data = next((p for p in self.programs if p['Program'] == program), None)
                if program_data:
                    print(f"  {program} - {program_data['Category']} ({program_data['Commission']})")
        
        # Save audit results
        reports_dir = os.path.join(self.workspace_root, 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        audit_file = os.path.join(reports_dir, f'content_audit_{self.today}.json')
        with open(audit_file, 'w') as f:
            json.dump({
                'date': self.today,
                'total_articles': len(articles),
                'program_coverage': f"{covered}/{total}",
                'coverage_percentage': covered/total*100,
                'uncovered_programs': uncovered[:20],
                'program_coverage_details': program_coverage
            }, f, indent=2)
        
        print(f"\nAudit saved: {audit_file}")
    
    def _is_program_eligible(self, program_name: str) -> bool:
        """Check if a program is eligible for content creation."""
        program = next((p for p in self.programs if p['Program'] == program_name), None)
        if not program:
            return False
        
        # Check NZ access
        if program.get('NZ Access') != 'Yes':
            return False
        
        # Check if it has commission data
        if not program.get('Commission') or program['Commission'] == '?':
            return False
        
        return True

def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Affiliate Marketing Orchestrator')
    parser.add_argument('--daily', action='store_true', help='Run daily workflow')
    parser.add_argument('--weekly', action='store_true', help='Generate weekly report')
    parser.add_argument('--audit', action='store_true', help='Run content audit')
    parser.add_argument('--generate', action='store_true', help='Generate content only')
    parser.add_argument('--publish', action='store_true', help='Publish to WordPress')
    parser.add_argument('--share', action='store_true', help='Share on social media')
    parser.add_argument('--all', action='store_true', help='Run complete workflow')
    
    args = parser.parse_args()
    
    # Create orchestrator
    orchestrator = AffiliateOrchestrator()
    
    if args.all:
        # Run complete workflow
        orchestrator.run_daily_workflow(
            generate_content=True,
            publish_to_wp=True,
            share_on_social=True
        )
    elif args.daily:
        # Run daily workflow (content generation only by default)
        orchestrator.run_daily_workflow(
            generate_content=True,
            publish_to_wp=False,
            share_on_social=False
        )
    elif args.weekly:
        orchestrator.generate_weekly_report()
    elif args.audit:
        orchestrator.run_content_audit()
    elif args.generate:
        orchestrator._generate_daily_content()
    elif args.publish:
        orchestrator._publish_to_wordpress()
    elif args.share:
        orchestrator._share_on_social_media()
    else:
        # Default: show help and run analysis only
        print("Affiliate Marketing Orchestrator")
        print("=" * 40)
        print("\nAvailable commands:")
        print("  --daily     Run daily workflow (generate content)")
        print("  --weekly    Generate weekly report")
        print("  --audit     Run content audit")
        print("  --generate  Generate content only")
        print("  --publish   Publish to WordPress")
        print("  --share     Share on social media")
        print("  --all       Run complete workflow")
        print("\nExample: python orchestrator.py --daily")
        
        # Run analysis only
        orchestrator._analyze_programs()

if __name__ == '__main__':
    main()