#!/usr/bin/env python3
"""
Social media automation for affiliate marketing.
Supports Twitter/X and LinkedIn posting.
"""
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional
import requests

class SocialMediaPublisher:
    def __init__(self, config_file: str = '../../config/social_media.json'):
        """
        Initialize social media publisher.
        
        Args:
            config_file: Path to configuration file
        """
        self.config = self._load_config(config_file)
        self.mock_mode = self.config.get('mock_mode', True)
        
    def _load_config(self, config_file: str) -> Dict:
        """Load social media configuration."""
        default_config = {
            'twitter': {
                'consumer_key': 'your_consumer_key',
                'consumer_secret': 'your_consumer_secret',
                'access_token': 'your_access_token',
                'access_token_secret': 'your_access_token_secret',
                'enabled': False
            },
            'linkedin': {
                'client_id': 'your_client_id',
                'client_secret': 'your_client_secret',
                'access_token': 'your_access_token',
                'enabled': False
            },
            'mock_mode': True,
            'auto_post': False
        }
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                user_config = json.load(f)
                # Deep merge
                for key, value in user_config.items():
                    if key in default_config and isinstance(value, dict) and isinstance(default_config[key], dict):
                        default_config[key].update(value)
                    else:
                        default_config[key] = value
                return default_config
        else:
            print(f"Config file not found: {config_file}")
            print("Using default config with mock_mode=True")
            return default_config
    
    def post_to_twitter(self, text: str, url: str = None, 
                       image_path: str = None) -> Dict:
        """
        Post to Twitter/X.
        
        Args:
            text: Tweet text (280 characters max)
            url: URL to include
            image_path: Path to image to attach
            
        Returns:
            Dictionary with result
        """
        if not self.config['twitter']['enabled'] or self.mock_mode:
            print(f"[MOCK] Twitter post: {text}")
            if url:
                print(f"[MOCK] URL: {url}")
            if image_path:
                print(f"[MOCK] Image: {image_path}")
            return {
                'platform': 'twitter',
                'success': True,
                'mock': True,
                'text': text[:50] + '...' if len(text) > 50 else text
            }
        
        # Actual Twitter API implementation would go here
        # This would use tweepy or requests to post to Twitter API v2
        print("Twitter posting not implemented (requires API keys)")
        return {'platform': 'twitter', 'success': False, 'error': 'Not implemented'}
    
    def post_to_linkedin(self, text: str, url: str = None,
                        title: str = None, description: str = None) -> Dict:
        """
        Post to LinkedIn.
        
        Args:
            text: Post text
            url: URL to share
            title: Link title
            description: Link description
            
        Returns:
            Dictionary with result
        """
        if not self.config['linkedin']['enabled'] or self.mock_mode:
            print(f"[MOCK] LinkedIn post: {text}")
            if url:
                print(f"[MOCK] URL: {url}")
            if title:
                print(f"[MOCK] Title: {title}")
            return {
                'platform': 'linkedin',
                'success': True,
                'mock': True,
                'text': text[:50] + '...' if len(text) > 50 else text
            }
        
        # Actual LinkedIn API implementation would go here
        print("LinkedIn posting not implemented (requires API keys)")
        return {'platform': 'linkedin', 'success': False, 'error': 'Not implemented'}
    
    def generate_social_post(self, article_title: str, article_url: str, 
                           platform: str = 'twitter') -> str:
        """
        Generate platform-appropriate social media post.
        
        Args:
            article_title: Article title
            article_url: Article URL
            platform: 'twitter' or 'linkedin'
            
        Returns:
            Post text
        """
        # Extract main topic from title
        words = article_title.split()
        topic = words[0] if words else "Tool"
        
        # Platform-specific formatting
        if platform == 'twitter':
            # Twitter: shorter, punchier, with hashtags
            base_text = f"Just published: {article_title}\n\n{article_url}\n\n"
            
            # Add relevant hashtags
            hashtags = {
                'Notion': '#Notion #Productivity #Tools',
                'ClickUp': '#ClickUp #ProjectManagement #Productivity',
                'Jasper': '#Jasper #AI #Writing #Copywriting',
                'AI': '#AI #ArtificialIntelligence #Tech',
                'Productivity': '#Productivity #Tools #Efficiency'
            }
            
            # Find matching hashtags
            added_hashtags = []
            for key, tags in hashtags.items():
                if key.lower() in article_title.lower():
                    added_hashtags.append(tags)
            
            if added_hashtags:
                base_text += ' '.join(added_hashtags[:2])
            else:
                base_text += '#Tools #Review #AffiliateMarketing'
            
            # Ensure within 280 characters
            if len(base_text) > 280:
                base_text = base_text[:275] + "..."
                
        elif platform == 'linkedin':
            # LinkedIn: more professional, question-based
            base_text = f"New article: {article_title}\n\n"
            base_text += f"This comprehensive review covers features, pricing, and whether it's worth the investment.\n\n"
            base_text += f"Read the full analysis here: {article_url}\n\n"
            base_text += "#AffiliateMarketing #ToolReview #BusinessTools"
            
            # LinkedIn has longer limits, but keep reasonable
            if len(base_text) > 3000:
                base_text = base_text[:2995] + "..."
        
        else:
            base_text = f"Check out my new article: {article_title} {article_url}"
        
        return base_text
    
    def share_article(self, article_title: str, article_url: str,
                     platforms: List[str] = None) -> Dict:
        """
        Share an article on multiple social platforms.
        
        Args:
            article_title: Article title
            article_url: Article URL
            platforms: List of platforms ('twitter', 'linkedin')
            
        Returns:
            Dictionary with results for each platform
        """
        if platforms is None:
            platforms = ['twitter', 'linkedin']
        
        results = {}
        
        for platform in platforms:
            if platform == 'twitter':
                post_text = self.generate_social_post(article_title, article_url, 'twitter')
                result = self.post_to_twitter(post_text, article_url)
                results['twitter'] = result
                
            elif platform == 'linkedin':
                post_text = self.generate_social_post(article_title, article_url, 'linkedin')
                result = self.post_to_linkedin(post_text, article_url, 
                                             title=article_title,
                                             description=f"Review of {article_title}")
                results['linkedin'] = result
                
            else:
                results[platform] = {'success': False, 'error': f'Unknown platform: {platform}'}
        
        return results
    
    def schedule_posts(self, article_data: List[Dict], 
                      time_delay_hours: int = 24):
        """
        Schedule multiple posts over time.
        
        Args:
            article_data: List of dicts with 'title' and 'url'
            time_delay_hours: Hours between posts
        """
        print(f"Scheduling {len(article_data)} posts with {time_delay_hours}h intervals")
        
        for i, article in enumerate(article_data):
            delay = i * time_delay_hours
            print(f"Post {i+1}: '{article['title']}' - Delay: {delay}h")
            
            # In a real implementation, this would use a scheduler
            # For now, just generate the posts
            for platform in ['twitter', 'linkedin']:
                post_text = self.generate_social_post(
                    article['title'], article['url'], platform
                )
                print(f"  {platform}: {post_text[:60]}...")
        
        print("\nTo implement actual scheduling, use:")
        print("- APScheduler for Python scheduling")
        print("- Celery for distributed task queues")
        print("- Platform-native scheduling (Twitter Threads, LinkedIn Scheduled Posts)")

# Create sample configuration file
def create_sample_config():
    """Create sample social media configuration file."""
    sample_config = {
        "twitter": {
            "consumer_key": "your_consumer_key_here",
            "consumer_secret": "your_consumer_secret_here",
            "access_token": "your_access_token_here",
            "access_token_secret": "your_access_token_secret_here",
            "enabled": False,
            "note": "Get keys from developer.twitter.com"
        },
        "linkedin": {
            "client_id": "your_linkedin_client_id",
            "client_secret": "your_linkedin_client_secret",
            "access_token": "your_linkedin_access_token",
            "enabled": False,
            "note": "Get keys from linkedin.com/developers"
        },
        "mock_mode": True,
        "auto_post": False,
        "note": "Set mock_mode to false and enable platforms when ready to post live."
    }
    
    config_dir = '../../config'
    os.makedirs(config_dir, exist_ok=True)
    
    config_file = os.path.join(config_dir, 'social_media.json')
    with open(config_file, 'w') as f:
        json.dump(sample_config, f, indent=2)
    
    print(f"Sample config created: {config_file}")
    return config_file

if __name__ == '__main__':
    # Create sample config if it doesn't exist
    config_path = '../../config/social_media.json'
    if not os.path.exists(config_path):
        create_sample_config()
    
    # Test the publisher
    publisher = SocialMediaPublisher(config_path)
    
    # Test sharing an article
    test_article = {
        'title': 'Notion Review 2026: Is It Still the Best Productivity Tool?',
        'url': 'https://example.com/notion-review-2026'
    }
    
    print("Testing social media sharing:")
    print("-" * 50)
    
    results = publisher.share_article(
        article_title=test_article['title'],
        article_url=test_article['url'],
        platforms=['twitter', 'linkedin']
    )
    
    print("\nResults:")
    for platform, result in results.items():
        print(f"{platform}: {'SUCCESS' if result.get('success') else 'FAILED'} - {result.get('text', '')}")
    
    # Test scheduling
    print("\n" + "=" * 50)
    print("Testing post scheduling:")
    
    articles = [
        {'title': 'Notion Review 2026', 'url': 'https://example.com/notion'},
        {'title': 'ClickUp vs Notion Comparison', 'url': 'https://example.com/clickup-vs-notion'},
        {'title': 'Jasper AI Writing Tool Review', 'url': 'https://example.com/jasper'}
    ]
    
    publisher.schedule_posts(articles, time_delay_hours=6)