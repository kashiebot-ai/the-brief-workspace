#!/usr/bin/env python3
"""
WordPress REST API integration for publishing affiliate articles.
"""
import json
import os
import sys
from typing import Dict, Optional
import requests
from requests.auth import HTTPBasicAuth

class WordPressPublisher:
    def __init__(self, base_url: str = None, username: str = None, 
                 password: str = None, mock_mode: bool = True):
        """
        Initialize WordPress publisher.
        
        Args:
            base_url: WordPress site URL (e.g., https://yoursite.com)
            username: WordPress username
            password: Application password
            mock_mode: If True, simulate publishing without actual API calls
        """
        self.mock_mode = mock_mode
        
        if not mock_mode:
            if not all([base_url, username, password]):
                raise ValueError("base_url, username, and password required when mock_mode=False")
            
            self.base_url = base_url.rstrip('/')
            self.auth = HTTPBasicAuth(username, password)
            self.api_url = f"{self.base_url}/wp-json/wp/v2"
        else:
            print("WordPress integration running in mock mode (no actual API calls)")
    
    def create_post(self, title: str, content: str, status: str = 'draft', 
                   categories: list = None, tags: list = None,
                   meta_description: str = None, slug: str = None) -> Dict:
        """
        Create a new WordPress post.
        
        Args:
            title: Post title
            content: HTML or markdown content
            status: 'draft', 'publish', 'future', 'pending'
            categories: List of category IDs
            tags: List of tag names
            meta_description: SEO description
            slug: URL slug
            
        Returns:
            Dictionary with post data or mock response
        """
        if self.mock_mode:
            print(f"[MOCK] Creating WordPress post: '{title}'")
            print(f"[MOCK] Status: {status}, Categories: {categories}")
            print(f"[MOCK] Content preview: {content[:100]}...")
            
            return {
                'id': 999,
                'title': title,
                'slug': slug or title.lower().replace(' ', '-'),
                'status': status,
                'link': f"https://example.com/{slug or title.lower().replace(' ', '-')}",
                'mock': True
            }
        
        # Prepare the post data
        post_data = {
            'title': title,
            'content': content,
            'status': status,
        }
        
        if slug:
            post_data['slug'] = slug
        
        if categories:
            post_data['categories'] = categories
        
        if tags:
            # First, get or create tags
            tag_ids = []
            for tag_name in tags:
                tag_id = self._get_or_create_tag(tag_name)
                if tag_id:
                    tag_ids.append(tag_id)
            if tag_ids:
                post_data['tags'] = tag_ids
        
        # Add SEO meta if plugin is active (Yoast or Rank Math)
        if meta_description:
            post_data['meta'] = {
                'yoast_wpseo_metadesc': meta_description,
                'rank_math_description': meta_description
            }
        
        # Make the API request
        response = requests.post(
            f"{self.api_url}/posts",
            json=post_data,
            auth=self.auth,
            timeout=30
        )
        
        if response.status_code == 201:
            print(f"Successfully created post: {title} (ID: {response.json()['id']})")
            return response.json()
        else:
            print(f"Error creating post: {response.status_code}")
            print(f"Response: {response.text}")
            return {'error': response.status_code, 'message': response.text}
    
    def _get_or_create_tag(self, tag_name: str) -> Optional[int]:
        """Get existing tag ID or create new tag."""
        if self.mock_mode:
            return 1
        
        # Search for existing tag
        search_response = requests.get(
            f"{self.api_url}/tags",
            params={'search': tag_name},
            auth=self.auth,
            timeout=10
        )
        
        if search_response.status_code == 200:
            tags = search_response.json()
            if tags:
                return tags[0]['id']
        
        # Create new tag
        create_response = requests.post(
            f"{self.api_url}/tags",
            json={'name': tag_name},
            auth=self.auth,
            timeout=10
        )
        
        if create_response.status_code == 201:
            return create_response.json()['id']
        
        return None
    
    def upload_media(self, file_path: str, title: str = None, 
                    alt_text: str = None) -> Optional[int]:
        """Upload media file to WordPress."""
        if self.mock_mode:
            print(f"[MOCK] Uploading media: {file_path}")
            return 999
        
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return None
        
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {}
            
            if title:
                data['title'] = title
            if alt_text:
                data['alt_text'] = alt_text
            
            response = requests.post(
                f"{self.api_url}/media",
                files=files,
                data=data,
                auth=self.auth,
                timeout=30
            )
        
        if response.status_code == 201:
            print(f"Uploaded media: {file_path} (ID: {response.json()['id']})")
            return response.json()['id']
        else:
            print(f"Error uploading media: {response.status_code}")
            return None
    
    def update_post(self, post_id: int, **kwargs):
        """Update an existing post."""
        if self.mock_mode:
            print(f"[MOCK] Updating post {post_id} with: {kwargs}")
            return {'mock': True, 'id': post_id}
        
        response = requests.post(
            f"{self.api_url}/posts/{post_id}",
            json=kwargs,
            auth=self.auth,
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"Updated post {post_id}")
            return response.json()
        else:
            print(f"Error updating post: {response.status_code}")
            return {'error': response.status_code}
    
    def publish_from_markdown(self, markdown_file: str, 
                             category_map: Dict[str, int] = None,
                             auto_publish: bool = False) -> Dict:
        """
        Publish a markdown file to WordPress.
        
        Args:
            markdown_file: Path to markdown file
            category_map: Dictionary mapping categories to WordPress category IDs
            auto_publish: If True, publish immediately instead of draft
            
        Returns:
            Post data
        """
        if not os.path.exists(markdown_file):
            print(f"File not found: {markdown_file}")
            return {'error': 'File not found'}
        
        # Read markdown file
        with open(markdown_file, 'r') as f:
            content = f.read()
        
        # Extract metadata from markdown (simple parsing)
        lines = content.split('\n')
        title = None
        meta_description = None
        slug = None
        categories = []
        
        for i, line in enumerate(lines):
            if line.startswith('# '):
                title = line[2:].strip()
            elif 'Affiliate Disclosure:' in line:
                # Skip disclosure line
                pass
            elif line.startswith('*Category:'):
                # Extract category
                category_str = line.split(':')[1].replace('*', '').strip()
                categories.append(category_str)
            elif i == 0 and title is None:
                # First line is title
                title = line.strip('# ')
        
        if not title:
            title = os.path.basename(markdown_file).replace('.md', '').replace('-', ' ')
        
        # Generate slug from filename if not found
        if not slug:
            slug = os.path.basename(markdown_file).replace('.md', '')
        
        # Map categories to WordPress category IDs
        category_ids = []
        if category_map and categories:
            for cat in categories:
                if cat in category_map:
                    category_ids.append(category_map[cat])
        
        # Determine status
        status = 'publish' if auto_publish else 'draft'
        
        # Create the post
        return self.create_post(
            title=title,
            content=content,
            status=status,
            categories=category_ids if category_ids else None,
            tags=['affiliate-marketing', 'tool-review', 'productivity'],
            meta_description=meta_description or f"Review of {title}",
            slug=slug
        )

# Configuration helper
def load_wordpress_config(config_file: str = '../../config/wordpress.json') -> Dict:
    """Load WordPress configuration from JSON file."""
    default_config = {
        'base_url': 'https://your-wordpress-site.com',
        'username': 'admin',
        'password': 'your_application_password',
        'mock_mode': True,
        'category_map': {
            'Productivity': 1,
            'AI Writing': 2,
            'Graphic Design': 3,
            'Email Marketing': 4,
            'CRM/Marketing': 5,
            'Project Management': 6,
            'AI Copywriting': 7,
            'AI Video': 8,
            'Writing Assistant': 9,
            'Screen Recording': 10,
            'Scheduling': 11,
            'E-commerce': 12,
            'Web Hosting': 13,
            'Freelance Marketplace': 14,
            'Cryptocurrency': 15,
            'Marketing Education': 16
        }
    }
    
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            user_config = json.load(f)
            # Merge with defaults
            for key, value in user_config.items():
                default_config[key] = value
            return default_config
    else:
        print(f"Config file not found: {config_file}")
        print("Using default config with mock_mode=True")
        return default_config

if __name__ == '__main__':
    # Example usage
    config = load_wordpress_config()
    
    publisher = WordPressPublisher(
        base_url=config.get('base_url'),
        username=config.get('username'),
        password=config.get('password'),
        mock_mode=config.get('mock_mode', True)
    )
    
    # Test with a sample markdown file
    sample_file = '../../content/articles/notion-review-2026-02-21.md'
    if os.path.exists(sample_file):
        result = publisher.publish_from_markdown(
            sample_file,
            category_map=config.get('category_map'),
            auto_publish=False  # Create as draft for review
        )
        print(f"\nPublish result: {result}")
    else:
        print(f"Sample file not found: {sample_file}")
        print("Generating a test article first...")
        
        # Create a test article
        from article_generator import ArticleGenerator
        generator = ArticleGenerator()
        article = generator.generate_product_review('Notion')
        
        test_file = '../../content/test-article.md'
        with open(test_file, 'w') as f:
            f.write(article)
        
        result = publisher.publish_from_markdown(test_file)
        print(f"\nTest publish result: {result}")