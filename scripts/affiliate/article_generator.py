#!/usr/bin/env python3
"""
Generate full articles from affiliate program data using templates.
"""
import csv
import json
import random
from datetime import datetime
from typing import Dict, List
import sys
import os

sys.path.append(os.path.dirname(__file__))
from content_generator import generate_blog_outline

class ArticleGenerator:
    def __init__(self, programs_csv_path=None):
        # Use absolute path if not provided
        if programs_csv_path is None:
            SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
            WORKSPACE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../..'))
            programs_csv_path = os.path.join(WORKSPACE_ROOT, 'affiliate_programs.csv')
        
        self.programs_csv_path = programs_csv_path
        self.programs = self._load_programs()
        self.today = datetime.now().strftime("%B %d, %Y")
        
    def _load_programs(self) -> List[Dict]:
        """Load programs from CSV."""
        programs = []
        with open(self.programs_csv_path, 'r', newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                programs.append(row)
        return programs
    
    def get_program(self, name: str) -> Dict:
        """Get program by name."""
        for program in self.programs:
            if program['Program'].lower() == name.lower():
                return program
        return None
    
    def generate_product_review(self, program_name: str) -> str:
        """Generate a full product review article."""
        program = self.get_program(program_name)
        if not program:
            return f"# Error: Program '{program_name}' not found."
        
        # Get competitors in same category
        category = program['Category']
        competitors = [p for p in self.programs 
                      if p['Category'] == category and p['Program'] != program_name]
        
        # Generate outline
        outline = generate_blog_outline(
            product_name=program_name,
            product_category=category,
            competitor_products=[c['Program'] for c in competitors[:2]] if competitors else None
        )
        
        # Build the full article from template
        article = self._apply_template(program, outline, competitors)
        return article
    
    def _apply_template(self, program: Dict, outline: Dict, competitors: List[Dict]) -> str:
        """Apply template to generate full article."""
        program_name = program['Program']
        category = program['Category']
        commission = program['Commission']
        link = program['Link']
        notes = program['Notes']
        
        # Extract commission percentage if available
        import re
        commission_match = re.search(r'(\d+)%', commission) if commission else None
        commission_pct = commission_match.group(1) if commission_match else "variable"
        
        # Generate pros and cons (simplistic for now)
        pros = [
            f"High commission rate ({commission})",
            f"Recurring commissions: {program.get('Recurring', 'Unknown')}",
            f"NZ accessible: {program.get('NZ Access', 'Unknown')}",
            "Popular tool with strong demand",
            "Good cookie duration for tracking referrals"
        ]
        
        cons = [
            "Competitive niche with many alternatives",
            "Requires quality content to convert",
            "May require demonstration to show value"
        ]
        
        # Who it's for
        audience_map = {
            'AI Writing': "Content creators, marketers, bloggers, and businesses needing copywriting assistance",
            'Productivity': "Teams, solopreneurs, students, and anyone needing organization tools",
            'Graphic Design': "Designers, marketers, small businesses, and social media managers",
            'AI Headshots': "Professionals, remote workers, freelancers needing professional headshots",
            'Email Marketing': "Businesses, bloggers, coaches, and online course creators",
            'CRM/Marketing': "Sales teams, marketing agencies, and B2B companies",
            'Project Management': "Teams, project managers, agencies, and remote workers",
            'AI Copywriting': "Marketers, advertisers, e-commerce stores, and content teams",
            'AI Video': "Video creators, marketers, educators, and social media managers",
            'Writing Assistant': "Students, professionals, non-native speakers, and writers",
            'Screen Recording': "Educators, tech support, remote teams, and tutorial creators",
            'Scheduling': "Consultants, coaches, service businesses, and professionals",
            'E-commerce': "Online store owners, drop shippers, and product sellers",
            'Web Hosting': "Website owners, bloggers, and small businesses",
            'Freelance Marketplace': "Freelancers, agencies, and businesses seeking talent",
            'Cryptocurrency': "Traders, investors, and crypto enthusiasts",
            'Marketing Education': "Marketers, business owners, and career changers"
        }
        
        target_audience = audience_map.get(category, 
                                          "Businesses and individuals looking to improve their workflow")
        
        # Build the article
        lines = []
        lines.append(f"# {outline['title']}")
        lines.append("")
        lines.append(f"*Published: {self.today}*  ")
        lines.append(f"*Category: {category}*  ")
        lines.append(f"*Affiliate Disclosure: This article contains affiliate links. We may earn a commission at no extra cost to you if you make a purchase through our links.*")
        lines.append("")
        
        # Introduction
        lines.append("## Introduction")
        lines.append("")
        lines.append(f"{program_name} is a {category.lower()} tool that has gained significant popularity in recent years. ")
        lines.append(f"In this comprehensive review, we'll examine its features, pricing, and whether it's worth your investment.")
        lines.append("")
        
        # Key Features
        lines.append("## Key Features")
        lines.append("")
        lines.append(f"{program_name} offers several standout features that make it a compelling choice:")
        lines.append("")
        lines.append("1. **Core Feature 1** - Detailed explanation of this feature and how it benefits users.")
        lines.append("2. **Core Feature 2** - How this feature saves time or improves results.")
        lines.append("3. **AI/Automation Capabilities** - If applicable, how AI enhances the tool.")
        lines.append("4. **Integration Options** - How it connects with other tools in your stack.")
        lines.append("5. **User Experience** - Overall ease of use and learning curve.")
        lines.append("")
        
        # Pricing
        lines.append("## Pricing & Plans")
        lines.append("")
        lines.append(f"{program_name} offers several pricing tiers to accommodate different needs:")
        lines.append("")
        lines.append("- **Basic Plan** - $X/month - Includes core features")
        lines.append("- **Pro Plan** - $Y/month - Advanced features and higher limits")
        lines.append("- **Business Plan** - $Z/month - Team features and priority support")
        lines.append("")
        lines.append(f"*Note: Pricing may vary. Check the official {program_name} website for current rates.*")
        lines.append("")
        
        # Commission Details (unique to affiliate reviews)
        lines.append("## Affiliate Opportunity")
        lines.append("")
        lines.append(f"**Commission Rate:** {commission}")
        lines.append("")
        lines.append(f"**Cookie Duration:** {program.get('Cookie Duration', 'Varies')}")
        lines.append("")
        lines.append(f"**Recurring Commissions:** {program.get('Recurring', 'Unknown')}")
        lines.append("")
        lines.append(f"**Why Promote {program_name}:** {notes}")
        lines.append("")
        
        # Pros and Cons
        lines.append("## Pros & Cons")
        lines.append("")
        lines.append("### Pros")
        lines.append("")
        for pro in pros[:3]:
            lines.append(f"- {pro}")
        lines.append("")
        lines.append("### Cons")
        lines.append("")
        for con in cons:
            lines.append(f"- {con}")
        lines.append("")
        
        # Who It's For
        lines.append("## Who Is It For?")
        lines.append("")
        lines.append(f"{program_name} is ideal for:")
        lines.append("")
        lines.append(f"- {target_audience}")
        lines.append("- Those looking to streamline their workflow")
        lines.append("- Businesses wanting to improve team collaboration")
        lines.append("- Individuals seeking to enhance their productivity")
        lines.append("")
        
        # Comparison with competitors (if any)
        if competitors:
            lines.append("## Comparison with Alternatives")
            lines.append("")
            lines.append(f"### {program_name} vs {competitors[0]['Program']}")
            lines.append("")
            lines.append("- **Feature Comparison:** How they stack up on key features")
            lines.append(f"- **Pricing:** {program_name} vs competitor pricing")
            lines.append(f"- **Best For:** When to choose {program_name} vs the alternative")
            lines.append("")
        
        # How to Get Started
        lines.append("## How to Get Started")
        lines.append("")
        lines.append(f"1. **Visit the official website:** [{program_name}]({link})")
        lines.append(f"2. **Sign up for a free trial** (if available)")
        lines.append("3. **Explore the features** and test with your workflow")
        lines.append("4. **Upgrade to a paid plan** if it meets your needs")
        lines.append("")
        
        # Call to Action
        lines.append("## Final Verdict")
        lines.append("")
        lines.append(f"{program_name} is a solid choice for {target_audience.lower()}. ")
        lines.append(f"With its {commission} commission rate and {program.get('Recurring', 'recurring')} payments, ")
        lines.append("it represents a good opportunity for affiliate marketers looking to promote valuable tools.")
        lines.append("")
        lines.append(f"[**Get {program_name} Now**]({link})")
        lines.append("")
        
        # Affiliate disclosure footer
        lines.append("---")
        lines.append("")
        lines.append("**Affiliate Disclosure:** This review contains affiliate links to {program_name}. ")
        lines.append("If you click through and make a purchase, we may earn a commission at no additional cost to you. ")
        lines.append("We only recommend products we believe provide genuine value to our readers.")
        lines.append("")
        lines.append(f"*Last updated: {self.today}*")
        
        return "\n".join(lines)
    
    def generate_comparison_article(self, program1_name: str, program2_name: str) -> str:
        """Generate a comparison article between two programs."""
        program1 = self.get_program(program1_name)
        program2 = self.get_program(program2_name)
        
        if not program1 or not program2:
            return "# Error: One or both programs not found."
        
        title = f"{program1_name} vs {program2_name}: Which is Better in {datetime.now().strftime('%Y')}?"
        
        article = f"# {title}\n\n"
        article += f"*Published: {self.today}*\n\n"
        
        article += "## Introduction\n\n"
        article += f"Choosing between {program1_name} and {program2_name} can be challenging. "
        article += "Both are excellent tools in the {category} space, but they cater to slightly different needs. "
        article += "In this comparison, we'll break down the key differences to help you decide.\n\n"
        
        # Feature comparison table
        article += "## Feature Comparison\n\n"
        article += "| Feature | {program1_name} | {program2_name} |\n"
        article += "|---------|-----------------|-----------------|\n"
        article += "| Core Function | Description | Description |\n"
        article += "| AI Features | Yes/No | Yes/No |\n"
        article += "| Integration | List | List |\n"
        article += "| Learning Curve | Easy/Moderate/Hard | Easy/Moderate/Hard |\n\n"
        
        # Pricing comparison
        article += "## Pricing Comparison\n\n"
        article += f"**{program1_name}:** {program1.get('Commission', 'Unknown commission')}\n\n"
        article += f"**{program2_name}:** {program2.get('Commission', 'Unknown commission')}\n\n"
        
        # Affiliate opportunity comparison
        article += "## Affiliate Opportunity\n\n"
        article += f"**{program1_name} Commission:** {program1['Commission']}\n\n"
        article += f"**{program2_name} Commission:** {program2['Commission']}\n\n"
        
        article += "## Which Should You Choose?\n\n"
        article += f"**Choose {program1_name} if:**\n"
        article += "- You need [specific feature]\n"
        article += "- Your budget is [range]\n"
        article += "- You value [specific aspect]\n\n"
        
        article += f"**Choose {program2_name} if:**\n"
        article += "- You prefer [different feature]\n"
        article += "- You need [different capability]\n"
        article += "- Your use case is [specific scenario]\n\n"
        
        article += "## Conclusion\n\n"
        article += "Both tools have their strengths. For affiliate marketers, "
        article += f"{program1_name if random.choice([True, False]) else program2_name} "
        article += "might offer slightly better commissions, but the best choice depends on your audience's needs.\n\n"
        
        return article
    
    def save_article(self, article: str, filename: str):
        """Save article to file."""
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'w') as f:
            f.write(article)
        print(f"Article saved to {filename}")

if __name__ == '__main__':
    generator = ArticleGenerator()
    
    # Generate sample articles
    sample_programs = ['Notion', 'ClickUp', 'Jasper']
    
    for program in sample_programs:
        article = generator.generate_product_review(program)
        filename = f"../../content/articles/{program.lower().replace(' ', '-')}-review-{datetime.now().strftime('%Y-%m-%d')}.md"
        generator.save_article(article, filename)
    
    # Generate a comparison article
    comparison = generator.generate_comparison_article('Notion', 'ClickUp')
    filename = f"../../content/articles/notion-vs-clickup-comparison-{datetime.now().strftime('%Y-%m-%d')}.md"
    generator.save_article(comparison, filename)
    
    print(f"\nGenerated {len(sample_programs)} product reviews and 1 comparison article.")