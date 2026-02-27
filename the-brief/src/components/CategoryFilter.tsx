'use client'

import { useState } from 'react'

const categories = [
  'All',
  'Politics',
  'Technology',
  'Business',
  'Science',
  'Health',
  'Culture',
]

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('All')

  const handleClick = (category: string) => {
    setActiveCategory(category)
    // Filtering logic would go here - for now it's visual only
    console.log('Filter by:', category.toLowerCase())
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
