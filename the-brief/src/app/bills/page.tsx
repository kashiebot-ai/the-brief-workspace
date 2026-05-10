import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { allBillsQuery, Bill, sortBillsByUrgency, BILL_CATEGORIES } from '@/lib/bills-data'
import { getLastScrapedAt, getScrapedBillCount } from '@/lib/bills-data-server'
import { BillCard } from '@/components/bill-card'
import { CategoryFilter } from '@/components/category-filter'
export const metadata: Metadata = {
  title: 'Bills Open for Submission | The Brief',
  description: 'Track New Zealand Parliament bills open for public submission. Plain-English summaries and submission guides.',
}
async function getBills(): Promise<Bill[]> {
  if (!client) {
    // Return empty array if Sanity is not configured
    return []
  }
  
  try {
    const bills = await client.fetch(allBillsQuery)
    return sortBillsByUrgency(bills || [])
  } catch (error) {
    console.error('Error fetching bills:', error)
    return []
  }
}
export default async function BillsPage() {
  const bills = await getBills()
  
  const openBills = bills.filter(b => b.status === 'open' || b.status === 'closing_soon')
  const closedBills = bills.filter(b => b.status === 'closed' || b.status === 'passed' || b.status === 'defeated')
  
  const hasBills = bills.length > 0
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bills Open for Submission
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Have your say on legislation before Parliament. We translate complex bills into plain English to help you make informed submissions.
            </p>
            <p className="text-slate-400">
              <Link href="#how-it-works" className="underline hover:text-white">
                Learn how the submission process works
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!hasBills ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-slate-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              No Bills Currently Tracked
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-6">
              We're working on curating bills currently open for submission at Parliament. 
              Check back soon or subscribe to our newsletter for updates.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-500">
              <span>
                Tracking {getScrapedBillCount()} bills from Parliament.nz
              </span>
              {getLastScrapedAt() && (
                <span>
                  Last updated: {new Date(getLastScrapedAt()!).toLocaleDateString('en-NZ', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <span className="text-green-800 font-medium">
                  {openBills.length} bill{openBills.length !== 1 ? 's' : ''} open for submissions
                </span>
              </div>
              {openBills.some(b => b.status === 'closing_soon') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                  <span className="text-amber-800 font-medium">
                    {openBills.filter(b => b.status === 'closing_soon').length} closing soon
                  </span>
                </div>
              )}
            </div>
            {/* Category Filter */}
            <CategoryFilter categories={BILL_CATEGORIES} />
            {/* Open Bills Section */}
            {openBills.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Open for Submissions
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {openBills.map((bill) => (
                    <BillCard key={bill._id} bill={bill} />
                  ))}
                </div>
              </section>
            )}
            {/* Closed Bills Section */}
            {closedBills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Closed Bills
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                  {closedBills.slice(0, 6).map((bill) => (
                    <BillCard key={bill._id} bill={bill} />
                  ))}
                </div>
                {closedBills.length > 6 && (
                  <p className="text-center text-slate-500 mt-6">
                    +{closedBills.length - 6} more closed bills
                  </p>
                )}
              </section>
            )}
          </>
        )}
        {/* How It Works Section */}
        <section id="how-it-works" className="mt-20 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            How Submissions Work
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Find a Bill
              </h3>
              <p className="text-slate-600">
                Browse bills open for submission. Read our plain-English summaries to understand what each bill does.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Prepare Your Submission
              </h3>
              <p className="text-slate-600">
                Use our guided submission helper to craft your feedback. Share your perspective on why the bill matters to you.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Submit to Parliament
              </h3>
              <p className="text-slate-600">
                We'll redirect you to the official Parliament submission form. Your feedback goes directly to the select committee.
              </p>
            </div>
          </div>
          <div className="mt-12 bg-slate-50 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Why Make a Submission?
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submissions are read by MPs and can influence how a bill is amended
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your perspective as a citizen is valuable, especially if you're affected by the bill
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submissions become part of the public record and official Parliamentary record
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You don't need to be an expert—personal stories and practical concerns are valid input
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
