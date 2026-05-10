'use client'

import { useState } from 'react'
import { CategoryConfig, BillCategory } from '@/lib/bills-data'

interface CategoryFilterProps {
  categories: CategoryConfig[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<BillCategory | 'all'>('all')

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Bills
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
