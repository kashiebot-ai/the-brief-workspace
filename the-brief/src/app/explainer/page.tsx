'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ExplainerCard from '@/components/ExplainerCard'

interface Explainer {
  _id: string
  title: string
  summary: string
  category: string
  slug: { current: string } | string
  readingTime: number
}

const sampleExplainers = [
  {
    _id: '1',
    title: 'What is Artificial Intelligence?',
    summary:
      'A beginner-friendly guide to understanding AI, machine learning, and how these technologies are reshaping our world.',
    category: 'technology',
    slug: { current: 'what-is-artificial-intelligence' },
    readingTime: 5,
  },
  {
    _id: '2',
    title: 'Understanding Inflation',
    summary:
      'Why prices are rising and what it means for your wallet. A simple breakdown of economic forces at play.',
    category: 'business',
    slug: { current: 'understanding-inflation' },
    readingTime: 4,
  },
  {
    _id: '3',
    title: 'The Electoral College Explained',
    summary:
      'How the US presidential election really works. Why the popular vote doesn\'t always decide the winner.',
    category: 'politics',
    slug: { current: 'electoral-college-explained' },
    readingTime: 6,
  },
  {
    _id: '4',
    title: 'Climate Change: The Basics',
    summary:
      'The science behind global warming, its impacts, and what we can do about it.',
    category: 'science',
    slug: { current: 'climate-change-basics' },
    readingTime: 7,
  },
  {
    _id: '5',
    title: 'What is Cryptocurrency?',
    summary:
      'Bitcoin, blockchain, and the future of money. Making sense of digital currencies.',
    category: 'technology',
    slug: { current: 'what-is-cryptocurrency' },
    readingTime: 5,
  },
  {
    _id: '6',
    title: 'The Filibuster: A Senate Tradition',
    summary:
      'Why one senator can hold up legislation. The history and controversy of this procedural tool.',
    category: 'politics',
    slug: { current: 'the-filibuster-explained' },
    readingTime: 4,
  },
]

const categories = ['All', 'Politics', 'Technology', 'Business', 'Science', 'Health', 'Culture']

function ExplainersContent() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [explainers] = useState<Explainer[]>(sampleExplainers)

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      // Capitalize first letter to match our categories
      const formattedCategory = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1).toLowerCase()
      if (categories.includes(formattedCategory)) {
        setActiveCategory(formattedCategory)
      }
    }
  }, [searchParams])

  const filteredExplainers = activeCategory === 'All' 
    ? explainers 
    : explainers.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav 
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Explainers</li>
          </ol>
        </motion.nav>

        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Explainers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse our complete collection of explainers covering politics,
            technology, business, science, health, and culture.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                cat === activeCategory
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          {filteredExplainers.map((explainer: Explainer) => (
            <ExplainerCard
              key={explainer._id}
              title={explainer.title}
              summary={explainer.summary}
              category={explainer.category}
              slug={typeof explainer.slug === 'string' ? explainer.slug : explainer.slug.current}
              readingTime={explainer.readingTime}
            />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredExplainers.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-gray-500 text-lg">No explainers found in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Show all explainers
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default function ExplainersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <ExplainersContent />
    </Suspense>
  )
}
