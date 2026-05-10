import ExplainerCard from '@/components/ExplainerCard'
import CategoryFilter from '@/components/CategoryFilter'
import { client } from '@/lib/sanity'
import { allBillsQuery, Bill, getCategoryConfig, formatDeadline } from '@/lib/bills-data'
import Link from 'next/link'

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

async function getUrgentSubmissions(): Promise<Bill[]> {
  if (!client) return []
  
  try {
    const bills = await client.fetch(allBillsQuery)
    if (!bills) return []
    
    const now = new Date()
    return bills
      .filter((bill: Bill) => {
        if (!bill.submissionDeadline) return false
        if (bill.status !== 'open' && bill.status !== 'closing_soon') return false
        const daysLeft = Math.ceil((new Date(bill.submissionDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysLeft <= 14 && daysLeft >= 0
      })
      .sort((a: Bill, b: Bill) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime())
      .slice(0, 3)
  } catch {
    return []
  }
}

export default async function Home() {
  const explainers = await getExplainers()
  const urgentSubmissions = await getUrgentSubmissions()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              New Zealand politics,{' '}
              <span className="text-indigo-200">without the spin</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-8 animate-fade-in-delay">
              We explain what&apos;s happening in Parliament — the bills, debates, and decisions 
              that actually affect you. No jargon. No bias. Just the facts you need to vote 
              with confidence and hold power to account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#explainers"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Explainers
              </a>
              <a
                href="/mp-lookup"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-indigo-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                Find Your MP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Submissions Section */}
      {urgentSubmissions.length > 0 && (
        <section className="py-12 bg-red-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Submissions Closing Soon
                </h2>
              </div>
              <Link 
                href="/submissions"
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {urgentSubmissions.map(bill => (
                <SubmissionCard key={bill._id} bill={bill} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start here
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From how laws get made to why your vote matters. Clear explainers on the 
              issues shaping New Zealand — each one takes 5 minutes or less.
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
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Stay informed. Five minutes a day.
            </h2>
            <p className="text-indigo-200 mb-6">
              One explainer every weekday morning. The political news that matters, 
              stripped of spin and delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
            <p className="text-indigo-300 text-sm mt-4">
              Free. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function SubmissionCard({ bill }: { bill: Bill }) {
  const category = getCategoryConfig(bill.category)
  const deadline = formatDeadline(bill.submissionDeadline)
  const now = new Date()
  const daysLeft = Math.ceil((new Date(bill.submissionDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Link
      href={`/bills/${typeof bill.slug === 'string' ? bill.slug : bill.slug.current}`}
      className="block bg-white border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
          {category.label}
        </span>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {daysLeft <= 0 ? 'Closes today' : `${daysLeft} days left`}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {bill.shortTitle}
      </h3>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {bill.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{deadline.text}</span>
        <span className="text-red-600 font-medium flex items-center gap-1">
          Make Submission
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
