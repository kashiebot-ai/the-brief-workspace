#!/usr/bin/env python3
"""
Property Price Mapper - Estimates price ranges for 'negotiation' listings
by mapping them across price brackets.

Core algorithm:
1. Iterate through price brackets (e.g., $50k increments)
2. For each bracket, fetch listings that appear in that price range
3. Track which listings appear in which brackets
4. Infer: if listing appears in $500-550k but not $450-500k → estimate $500-550k
5. Compare estimated price with Council Valuation (CV) to find value gaps
"""

import csv
import json
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional, Set
from datetime import datetime
import math

@dataclass
class PropertyListing:
    """Represents a property listing."""
    id: str  # Unique identifier (URL or listing ID)
    address: str
    suburb: str
    price_display: str  # What's shown on site (e.g., "Deadline Sale", "$550,000")
    estimated_min: Optional[int] = None  # Estimated price lower bound
    estimated_max: Optional[int] = None  # Estimated price upper bound
    estimated_midpoint: Optional[float] = None  # (min + max) / 2
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    land_area: Optional[int] = None  # m²
    property_type: str = "Unknown"
    sale_method: str = "Unknown"  # e.g., "Deadline Sale", "Tender", "Negotiation"
    url: str = ""
    cv_value: Optional[int] = None  # Council Valuation
    cv_condition: str = ""
    cv_building_age: str = ""
    cv_land_area: Optional[int] = None  # From LINZ
    
    # Derived fields
    has_explicit_price: bool = field(init=False)
    cv_gap_percent: Optional[float] = None  # (CV - estimated_midpoint) / CV
    
    def __post_init__(self):
        """Calculate derived fields after initialization."""
        self.has_explicit_price = '$' in self.price_display and any(c.isdigit() for c in self.price_display)
        
    def calculate_cv_gap(self):
        """Calculate CV gap percentage if we have both CV and estimated price."""
        if self.cv_value and self.estimated_midpoint:
            if self.cv_value > 0:
                self.cv_gap_percent = (self.cv_value - self.estimated_midpoint) / self.cv_value
            else:
                self.cv_gap_percent = None
        return self.cv_gap_percent
    
    def to_dict(self):
        """Convert to dictionary for CSV export."""
        return {
            'id': self.id,
            'address': self.address,
            'suburb': self.suburb,
            'price_display': self.price_display,
            'has_explicit_price': self.has_explicit_price,
            'estimated_min': self.estimated_min,
            'estimated_max': self.estimated_max,
            'estimated_midpoint': self.estimated_midpoint,
            'estimated_range': f"${self.estimated_min:,}-${self.estimated_max:,}" if self.estimated_min and self.estimated_max else "Unknown",
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'land_area': self.land_area,
            'property_type': self.property_type,
            'sale_method': self.sale_method,
            'cv_value': self.cv_value,
            'cv_gap_percent': f"{self.cv_gap_percent:.1%}" if self.cv_gap_percent else "",
            'cv_condition': self.cv_condition,
            'cv_building_age': self.cv_building_age,
            'cv_land_area': self.cv_land_area,
            'url': self.url,
            'opportunity_score': self.calculate_opportunity_score()
        }
    
    def calculate_opportunity_score(self) -> int:
        """Calculate opportunity score from 0-10."""
        score = 0
        
        # CV gap score (0-5 points)
        if self.cv_gap_percent:
            if self.cv_gap_percent > 0.20:  # >20% discount
                score += 5
            elif self.cv_gap_percent > 0.15:  # >15% discount
                score += 4
            elif self.cv_gap_percent > 0.10:  # >10% discount
                score += 3
            elif self.cv_gap_percent > 0.05:  # >5% discount
                score += 2
            elif self.cv_gap_percent > 0:  # Any discount
                score += 1
        
        # Urgent sale method score (0-3 points)
        urgent_methods = ["deadline sale", "tender", "auction", "deadline", "tender"]
        if self.sale_method.lower() in urgent_methods:
            score += 3
        
        # Negotiation method (motivated seller) (0-2 points)
        if "negotiation" in self.sale_method.lower():
            score += 2
            
        return min(score, 10)  # Cap at 10

class PriceBracketMapper:
    """Maps properties across price brackets to estimate price ranges."""
    
    def __init__(self, min_price: int = 0, max_price: int = 2_000_000, bracket_size: int = 50_000):
        self.min_price = min_price
        self.max_price = max_price
        self.bracket_size = bracket_size
        self.brackets = self._generate_brackets()
        
        # Data stores
        self.listings: Dict[str, PropertyListing] = {}  # id -> listing
        self.bracket_appearances: Dict[str, Set[Tuple[int, int]]] = {}  # id -> set of (min, max) brackets
        
    def _generate_brackets(self) -> List[Tuple[int, int]]:
        """Generate price brackets."""
        brackets = []
        current_min = self.min_price
        while current_min < self.max_price:
            current_max = min(current_min + self.bracket_size, self.max_price)
            brackets.append((current_min, current_max))
            current_min = current_max
        return brackets
    
    def add_listing_appearance(self, listing_id: str, bracket_min: int, bracket_max: int):
        """Record that a listing appeared in a specific price bracket."""
        if listing_id not in self.bracket_appearances:
            self.bracket_appearances[listing_id] = set()
        self.bracket_appearances[listing_id].add((bracket_min, bracket_max))
    
    def estimate_price_ranges(self):
        """Estimate price ranges for all listings based on bracket appearances."""
        for listing_id, brackets in self.bracket_appearances.items():
            if listing_id not in self.listings:
                continue
                
            listing = self.listings[listing_id]
            
            # Skip if already has explicit price
            if listing.has_explicit_price:
                continue
            
            # Find min and max of all brackets where listing appears
            all_mins = [b[0] for b in brackets]
            all_maxs = [b[1] for b in brackets]
            
            if all_mins and all_maxs:
                # Estimate: property appears in brackets from min_appearance to max_appearance
                estimated_min = min(all_mins)
                estimated_max = max(all_maxs)
                
                # Refine: if appears in multiple consecutive brackets, narrow range
                # For prototype, use widest range
                listing.estimated_min = estimated_min
                listing.estimated_max = estimated_max
                listing.estimated_midpoint = (estimated_min + estimated_max) / 2
    
    def load_listings_from_csv(self, csv_path: str):
        """Load existing listings from CSV (from realestate.co.nz scraper)."""
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Parse price string to detect explicit prices
                    price_display = row.get('price', '')
                    
                    # Create listing
                    listing = PropertyListing(
                        id=row.get('url', '')[:100],  # Use URL as ID
                        address=row.get('address', ''),
                        suburb=self._extract_suburb(row.get('address', '')),
                        price_display=price_display,
                        bedrooms=self._parse_int(row.get('bedrooms')),
                        bathrooms=self._parse_int(row.get('bathrooms')),
                        land_area=self._parse_int(row.get('land_area')),
                        property_type=row.get('property_type', 'House'),
                        sale_method=row.get('sale_method', ''),
                        url=row.get('url', '')
                    )
                    
                    self.listings[listing.id] = listing
                    
            print(f"Loaded {len(self.listings)} listings from {csv_path}")
            
        except Exception as e:
            print(f"Error loading CSV: {e}")
    
    def _extract_suburb(self, address: str) -> str:
        """Extract suburb from address string."""
        if not address:
            return "Unknown"
        # Napier addresses often end with suburb
        parts = address.split(',')
        if len(parts) > 1:
            return parts[-1].strip()
        return "Unknown"
    
    def _parse_int(self, value):
        """Parse integer from string, returning None if invalid."""
        if not value:
            return None
        try:
            # Remove non-digits
            digits = ''.join(c for c in str(value) if c.isdigit())
            return int(digits) if digits else None
        except:
            return None
    
    def integrate_linz_data(self, linz_csv_path: str):
        """Integrate LINZ CV data from CSV."""
        try:
            with open(linz_csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                linz_records = list(reader)
            
            matches = 0
            for record in linz_records:
                address = record.get('situation_name', '')
                cv_value = self._parse_int(record.get('capital_value'))
                
                # Try to match with our listings
                for listing in self.listings.values():
                    # Simple address matching (for prototype)
                    if address and listing.address and address.lower() in listing.address.lower():
                        listing.cv_value = cv_value
                        listing.cv_condition = record.get('building_condition_indicator', '')
                        listing.cv_building_age = record.get('building_age_indicator', '')
                        cv_land = record.get('land_area')
                        if cv_land:
                            try:
                                # LINZ land area is in hectares, convert to m²
                                hectares = float(cv_land)
                                listing.cv_land_area = int(hectares * 10000)
                            except:
                                pass
                        matches += 1
                        break
            
            print(f"Matched {matches} listings with LINZ CV data")
            
            # Calculate CV gaps for matched listings
            for listing in self.listings.values():
                listing.calculate_cv_gap()
                
        except Exception as e:
            print(f"Error integrating LINZ data: {e}")
    
    def export_opportunities_csv(self, output_path: str):
        """Export ranked opportunities to CSV."""
        # Score all listings
        scored_listings = []
        for listing in self.listings.values():
            listing.calculate_cv_gap()  # Ensure CV gap calculated
            scored_listings.append(listing)
        
        # Sort by opportunity score (descending), then CV gap (descending)
        scored_listings.sort(
            key=lambda x: (
                x.calculate_opportunity_score(),
                x.cv_gap_percent if x.cv_gap_percent else 0
            ),
            reverse=True
        )
        
        # Prepare CSV data
        if scored_listings:
            fieldnames = list(scored_listings[0].to_dict().keys())
            
            with open(output_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                for listing in scored_listings:
                    writer.writerow(listing.to_dict())
            
            print(f"Exported {len(scored_listings)} opportunities to {output_path}")
            
            # Print top 5
            print("\n=== TOP 5 OPPORTUNITIES ===")
            for i, listing in enumerate(scored_listings[:5]):
                print(f"{i+1}. {listing.address}")
                print(f"   Estimated: ${listing.estimated_min:,}-${listing.estimated_max:,}" if listing.estimated_min else f"   Price: {listing.price_display}")
                print(f"   CV: ${listing.cv_value:,}" if listing.cv_value else "   CV: Unknown")
                print(f"   CV Gap: {listing.cv_gap_percent:.1%}" if listing.cv_gap_percent else "   CV Gap: Unknown")
                print(f"   Score: {listing.calculate_opportunity_score()}/10")
                print(f"   URL: {listing.url[:60]}...")
                print()
        else:
            print("No listings to export")

def run_demo():
    """Run a demonstration of the price bracket mapping system."""
    print("Property Price Mapper - Demonstration")
    print("=" * 60)
    
    # Initialize mapper
    mapper = PriceBracketMapper(min_price=0, max_price=1_500_000, bracket_size=50_000)
    print(f"Generated {len(mapper.brackets)} price brackets from ${mapper.min_price:,} to ${mapper.max_price:,}")
    print(f"Bracket size: ${mapper.bracket_size:,}")
    
    # Load existing realestate.co.nz data
    csv_path = "property_listings_robust.csv"
    import os
    if os.path.exists(csv_path):
        mapper.load_listings_from_csv(csv_path)
    else:
        print(f"Warning: {csv_path} not found. Using sample data.")
        # Create sample listings for demo
        sample_listings = [
            PropertyListing(
                id="1",
                address="22A White Street, Taradale",
                suburb="Taradale",
                price_display="Deadline Sale",
                bedrooms=4,
                bathrooms=3,
                land_area=649,
                sale_method="Deadline Sale",
                url="https://www.realestate.co.nz/42988771/residential/sale/22a-white-street-taradale"
            ),
            PropertyListing(
                id="2",
                address="181 Georges Drive, Napier South",
                suburb="Napier South",
                price_display="Deadline Sale",
                bedrooms=3,
                bathrooms=2,
                land_area=312,
                sale_method="Deadline Sale",
                url="https://www.realestate.co.nz/42988754/residential/sale/181-georges-drive-napier-south"
            ),
            PropertyListing(
                id="3",
                address="35 Pukeko Place, Westshore, Napier",
                suburb="Westshore",
                price_display="$485,000",
                bedrooms=3,
                bathrooms=2,
                land_area=450,
                sale_method="Fixed Price",
                url="https://www.realestate.co.nz/sample"
            ),
        ]
        
        for listing in sample_listings:
            mapper.listings[listing.id] = listing
    
    # Simulate price bracket appearances (in real system, this comes from scraping)
    print("\nSimulating price bracket mapping...")
    print("(In production, this would come from scraping TradeMe with price filters)")
    
    # For demo, manually add bracket appearances
    # Listing 1 appears in $500-550k and $550-600k brackets
    mapper.add_listing_appearance("1", 500000, 550000)
    mapper.add_listing_appearance("1", 550000, 600000)
    
    # Listing 2 appears in $450-500k bracket only
    mapper.add_listing_appearance("2", 450000, 500000)
    
    # Listing 3 has explicit price, no bracket mapping needed
    
    # Estimate price ranges
    mapper.estimate_price_ranges()
    
    # Integrate LINZ data if available
    linz_path = "property_listings_cv_advanced_20260219_1523.csv"
    if os.path.exists(linz_path):
        mapper.integrate_linz_data(linz_path)
    else:
        print(f"\nNote: LINZ data file not found at {linz_path}")
        print("Adding sample CV data for demonstration...")
        
        # Add sample CV data
        sample_cv_data = {
            "1": 650000,  # CV $650k for listing 1
            "2": 520000,  # CV $520k for listing 2
            "3": 485000,  # CV matches asking price
        }
        
        for listing_id, cv_value in sample_cv_data.items():
            if listing_id in mapper.listings:
                mapper.listings[listing_id].cv_value = cv_value
                mapper.listings[listing_id].calculate_cv_gap()
    
    # Export opportunities
    output_path = f"property_opportunities_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    mapper.export_opportunities_csv(output_path)
    
    print("\n" + "=" * 60)
    print("DEMONSTRATION COMPLETE")
    print(f"\nNext steps for production:")
    print("1. Implement TradeMe scraper with price filter iteration")
    print("2. Replace simulated bracket appearances with real data")
    print("3. Improve address matching for LINZ integration")
    print("4. Add daily automation and alerting")
    
    return mapper

if __name__ == "__main__":
    run_demo()