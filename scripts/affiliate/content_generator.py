#!/usr/bin/env python3
"""
Content generation utilities for affiliate marketing.
Generates blog outlines, product comparisons, and review templates.
"""

import json
import datetime
from typing import List, Dict

def generate_blog_outline(product_name: str, product_category: str, competitor_products: List[str] = None) -> Dict:
    """
    Generate a blog post outline for reviewing/promoting a product.
    """
    if competitor_products is None:
        competitor_products = []
    
    today = datetime.date.today().strftime("%B %Y")
    
    title = f"{product_name} Review {today}: Is It Worth It?"
    if competitor_products:
        title = f"{product_name} vs {', '.join(competitor_products)}: Which is Better in {today}?"
    
    outline = {
        "title": title,
        "meta_description": f"Honest review of {product_name}. Features, pricing, pros & cons, and who it's best for.",
        "slug": f"{product_name.lower().replace(' ', '-')}-review-{datetime.date.today().year}",
        "sections": [
            {
                "heading": "Introduction",
                "content": f"What is {product_name}? Brief overview of the product and why it matters in {product_category}.",
                "word_count_target": 150
            },
            {
                "heading": f"{product_name} Key Features",
                "content": "Breakdown of core features, with emphasis on unique selling points.",
                "subsections": [
                    "Feature 1",
                    "Feature 2",
                    "Feature 3",
                    "AI/automation capabilities"
                ],
                "word_count_target": 300
            },
            {
                "heading": "Pricing & Plans",
                "content": "Detailed pricing table (if applicable), value for money analysis.",
                "word_count_target": 250
            },
            {
                "heading": "Pros & Cons",
                "content": "Balanced list of advantages and limitations.",
                "word_count_target": 200
            },
            {
                "heading": "Who Is It For?",
                "content": "Target audience: solopreneurs, small businesses, enterprises, etc.",
                "word_count_target": 150
            }
        ]
    }
    
    if competitor_products:
        outline["sections"].insert(2, {
            "heading": f"{product_name} vs {competitor_products[0]}",
            "content": f"Direct comparison: features, pricing, usability.",
            "word_count_target": 300
        })
    
    # Add affiliate disclosure section
    outline["sections"].append({
        "heading": "Affiliate Disclosure",
        "content": "Transparent disclosure about affiliate links and commissions.",
        "word_count_target": 100
    })
    
    outline["sections"].append({
        "heading": "Final Verdict",
        "content": "Summary and recommendation.",
        "word_count_target": 200
    })
    
    return outline

def generate_product_comparison_table(products: List[Dict]) -> str:
    """
    Generate a markdown comparison table for a list of products.
    Each product dict should have keys: name, price, features (list), rating, affiliate_link.
    """
    headers = ["Product", "Price", "Key Features", "Best For", "Rating", "Link"]
    rows = []
    for p in products:
        features = "\\n".join(p.get("features", []))[:100]
        rows.append([
            p.get("name", ""),
            p.get("price", ""),
            features,
            p.get("best_for", ""),
            p.get("rating", ""),
            f"[Get {p['name']}]({p.get('affiliate_link', '#')})"
        ])
    
    # Markdown table
    table = "| " + " | ".join(headers) + " |\n"
    table += "| " + " | ".join(["---"] * len(headers)) + " |\n"
    for row in rows:
        table += "| " + " | ".join(row) + " |\n"
    
    return table

def save_outline_to_json(outline: Dict, filename: str):
    """Save outline as JSON file."""
    with open(filename, 'w') as f:
        json.dump(outline, f, indent=2)
    print(f"Outline saved to {filename}")

if __name__ == "__main__":
    # Example usage
    outline = generate_blog_outline(
        product_name="Notion",
        product_category="Productivity & Note‑Taking",
        competitor_products=["ClickUp", "Coda"]
    )
    print(json.dumps(outline, indent=2))
    
    # Save example
    save_outline_to_json(outline, "notion-review-outline.json")