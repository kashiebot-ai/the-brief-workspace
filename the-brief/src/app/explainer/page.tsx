import Link from 'next/link'
import ExplainerCard from '@/components/ExplainerCard'
import { client } from '@/lib/sanity'

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

async function getAllExplainers() {
  try {
    if (!client) return sampleExplainers
    const explainers = await client.fetch(`
      *[_type == "explainer"] | order(publishedAt desc) {
        _id,
        title,
        summary,
        category,
        slug,
        readingTime
      }
    `)
    return explainers.length > 0 ? explainers : sampleExplainers
  } catch {
    return sampleExplainers
  }
}

export default async function ExplainersPage() {
  const explainers = await getAllExplainers()

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Explainers</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Explainers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse our complete collection of explainers covering politics,
            technology, business, science, health, and culture.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Politics', 'Technology', 'Business', 'Science', 'Health', 'Culture'].map(
            (cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {explainers.map((explainer: Explainer) => (
            <ExplainerCard
              key={explainer._id}
              title={explainer.title}
              summary={explainer.summary}
              category={explainer.category}
              slug={typeof explainer.slug === 'string' ? explainer.slug : explainer.slug.current}
              readingTime={explainer.readingTime}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
