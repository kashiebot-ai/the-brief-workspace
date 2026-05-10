import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { allBillsQuery, Bill, getCategoryConfig, formatDeadline } from '@/lib/bills-data'

export const metadata: Metadata = {
  title: 'Submissions Tracker | The Brief',
  description: 'Track bills open for public submissions. Make your voice heard on legislation that affects you.',
}

async function getBills(): Promise<Bill[]> {
  if (!client) {
    return []
  }
  
  try {
    const bills = await client.fetch(allBillsQuery)
    return bills || []
  } catch (error) {
    console.error('Error fetching bills:', error)
    return []
  }
}

export default async function SubmissionsPage() {
  const bills = await getBills()
  
  // Filter bills with submission deadlines
  const billsWithDeadlines = bills.filter(bill => bill.submissionDeadline)
  
  // Sort by urgency (nearest deadline first)
  const sortedBills = billsWithDeadlines.sort((a, b) => {
    return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime()
  })
  
  // Categorize
  const now = new Date()
  const urgent = sortedBills.filter(b => {
    const daysLeft = Math.ceil((new Date(b.submissionDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 7 && daysLeft >= 0 && (b.status === 'open' || b.status === 'closing_soon')
  })
  
  const open = sortedBills.filter(b => {
    const daysLeft = Math.ceil((new Date(b.submissionDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft > 7 && (b.status === 'open' || b.status === 'closing_soon')
  })
  
  const closed = sortedBills.filter(b => {
    const deadline = new Date(b.submissionDeadline)
    return deadline < now || b.status === 'closed' || b.status === 'passed' || b.status === 'defeated'
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="mb-6">
            <Link href="/" className="text-slate-400 hover:text-white text-sm">
              ← Home
            </Link>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Submissions Tracker
          </h1>
          
          <p className="text-lg text-slate-300 max-w-3xl">
            Make your voice heard on legislation that affects you. Track submission deadlines and submit your views to Parliament.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-red-400">{urgent.length}</p>
              <p className="text-sm text-slate-400">Closing This Week</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">{open.length}</p>
              <p className="text-sm text-slate-400">Open for Submissions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-400">{closed.length}</p>
              <p className="text-sm text-slate-400">Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Urgent Section */}
        {urgent.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Closing Soon
              </h2>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                {urgent.length} bill{urgent.length === 1 ? '' : 's'}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgent.map(bill => (
                <SubmissionCard key={bill._id} bill={bill} urgency="high" />
              ))}
            </div>
          </section>
        )}

        {/* Open Section */}
        {open.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Open for Submissions
              </h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                {open.length} bill{open.length === 1 ? '' : 's'}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {open.map(bill => (
                <SubmissionCard key={bill._id} bill={bill} urgency="normal" />
              ))}
            </div>
          </section>
        )}

        {/* Closed Section */}
        {closed.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-400">
                Closed
              </h2>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-sm font-medium">
                {closed.length} bill{closed.length === 1 ? '' : 's'}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {closed.slice(0, 6).map(bill => (
                <SubmissionCard key={bill._id} bill={bill} urgency="closed" />
              ))}
            </div>
            
            {closed.length > 6 && (
              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                  +{closed.length - 6} more closed bills
                </p>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {urgent.length === 0 && open.length === 0 && closed.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No submission deadlines tracked
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              We're not currently tracking any bills with submission deadlines. Check back soon or browse all bills.
            </p>
            <Link 
              href="/bills"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse All Bills
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function SubmissionCard({ bill, urgency }: { bill: Bill; urgency: 'high' | 'normal' | 'closed' }) {
  const category = getCategoryConfig(bill.category)
  const deadline = formatDeadline(bill.submissionDeadline)
  const now = new Date()
  const daysLeft = Math.ceil((new Date(bill.submissionDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const urgencyStyles = {
    high: 'border-red-200 bg-red-50/50 hover:border-red-300',
    normal: 'border-slate-200 hover:border-blue-300',
    closed: 'border-slate-200 bg-slate-50'
  }
  
  const badgeStyles = {
    high: 'bg-red-100 text-red-800',
    normal: 'bg-green-100 text-green-800',
    closed: 'bg-slate-100 text-slate-600'
  }

  return (
    <Link 
      href={`/bills/${typeof bill.slug === 'string' ? bill.slug : bill.slug.current}`}
      className={`block border rounded-xl p-6 transition-all ${urgencyStyles[urgency]}`}
    >
      {/* Category & Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
          {category.label}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStyles[urgency]}`}>
          {urgency === 'high' ? `${daysLeft} days left` : urgency === 'normal' ? 'Open' : 'Closed'}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {bill.shortTitle}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {bill.description}
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {deadline.text}
        </span>
        <span className="text-blue-600 font-medium flex items-center gap-1">
          View Bill
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
