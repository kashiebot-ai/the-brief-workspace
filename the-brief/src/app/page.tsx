import ExplainerCard from '@/components/ExplainerCard'
import CategoryFilter from '@/components/CategoryFilter'
import { client } from '@/lib/sanity'

interface Explainer {
  _id: string
  title: string
  summary: string
  category: string
  slug: { current: string } | string
  readingTime: number
}

// Sample data for initial scaffold
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

async function getExplainers() {
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

export default async function Home() {
  const explainers = await getExplainers()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Complex topics,{' '}
              <span className="text-indigo-200">simply explained</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Daily explainers on politics, technology, business, and more. Get
              the context you need to understand what&apos;s happening in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#explainers"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
              >
                Browse Explainers
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-indigo-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Today&apos;s Explainers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Clear, concise breakdowns of the topics that matter most.
            </p>
          </div>

          {/* CategoryFilter is a client component with its own state */}
          <CategoryFilter />

          <div
            id="explainers"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
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

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get The Brief in your inbox
            </h2>
            <p className="text-gray-600 mb-6">
              One explainer, every weekday. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
