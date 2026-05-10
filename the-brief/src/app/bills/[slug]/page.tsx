import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { billBySlugQuery, Bill, formatDeadline, getCategoryConfig, getCommitteeConfig, getCurrentStage, getStageDates } from '@/lib/bills-data'
import { SubmissionHelper } from '@/components/submission-helper'
import { BillAlerts } from '@/components/BillAlerts'
import { ImpactCalculator } from '@/components/ImpactCalculator'
import { SubmissionSharing } from '@/components/SubmissionSharing'
import { BillTimeline } from '@/components/BillTimeline'
import { PortableText } from '@portabletext/react'

interface Props {
  params: { slug: string }
}

async function getBill(slug: string): Promise<Bill | null> {
  if (!client) {
    return null
  }
  
  try {
    const bill = await client.fetch(billBySlugQuery(slug))
    return bill || null
  } catch (error) {
    console.error('Error fetching bill:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bill = await getBill(params.slug)
  
  if (!bill) {
    return {
      title: 'Bill Not Found | The Brief',
    }
  }
  
  return {
    title: `${bill.shortTitle} | The Brief`,
    description: bill.description,
  }
}

export default async function BillPage({ params }: Props) {
  const bill = await getBill(params.slug)
  
  if (!bill) {
    notFound()
  }
  
  const deadline = formatDeadline(bill.submissionDeadline)
  const category = getCategoryConfig(bill.category)
  const committee = getCommitteeConfig(bill.committee)
  const isOpen = bill.status === 'open' || bill.status === 'closing_soon'
  const currentStage = getCurrentStage(bill)
  const stageDates = getStageDates(bill)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/bills" className="text-slate-400 hover:text-white text-sm">
              ← All Bills
            </Link>
          </nav>
          
          {/* Category Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${category.color}`}>
            {category.label}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {bill.shortTitle}
          </h1>
          
          <p className="text-lg text-slate-300 mb-6">
            {bill.description}
          </p>
          
          {/* Deadline Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            deadline.isUrgent && !isOpen
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : isOpen
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-slate-700 text-slate-300'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {deadline.text}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Bill Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Bill Timeline */}
            <section>
              <BillTimeline 
                currentStage={currentStage}
                stageDates={stageDates}
                submissionDeadline={bill.submissionDeadline}
                status={bill.status}
              />
            </section>
            
            {/* Key Points */}
            {bill.keyPoints && bill.keyPoints.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Key Points
                </h2>
                <ul className="space-y-3">
                  {bill.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Full Summary */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                What This Bill Does
              </h2>
              <div className="prose prose-slate max-w-none">
                {bill.summary ? (
                  <PortableText value={bill.summary} />
                ) : (
                  <p className="text-slate-600 italic">No summary available yet.</p>
                )}
              </div>
            </section>
            
            {/* Impact Statement */}
            {bill.impactStatement && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Who This Affects
                </h2>
                <div className="prose prose-slate max-w-none">
                  <PortableText value={bill.impactStatement} />
                </div>
              </section>
            )}
            
            {/* Official Links */}
            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Official Resources
              </h2>
              <div className="space-y-3">
                <a 
                  href={bill.parliamentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100">
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Parliament Bill Page</p>
                    <p className="text-sm text-slate-500">View the official bill on parliament.nz</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                {bill.legislationUrl && (
                  <a 
                    href={bill.legislationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Legislation.govt.nz</p>
                      <p className="text-sm text-slate-500">Read the full bill text</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                
                {bill.regulatoryImpact && (
                  <a 
                    href={bill.regulatoryImpact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Regulatory Impact Statement</p>
                      <p className="text-sm text-slate-500">Official cost-benefit analysis</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </section>
          </div>
          
          {/* Right Column - Sidebar Components */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Bill Info Card */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Bill Information
                </h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Committee</dt>
                    <dd className="font-medium text-slate-900">{committee.name}</dd>
                  </div>
                  {bill.billNumber && (
                    <div>
                      <dt className="text-slate-500">Bill Number</dt>
                      <dd className="font-medium text-slate-900">{bill.billNumber}</dd>
                    </div>
                  )}
                  {bill.introducedDate && (
                    <div>
                      <dt className="text-slate-500">Introduced</dt>
                      <dd className="font-medium text-slate-900">
                        {new Date(bill.introducedDate).toLocaleDateString('en-NZ')}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-slate-500">Last Updated</dt>
                    <dd className="font-medium text-slate-900">
                      {new Date(bill.lastUpdated).toLocaleDateString('en-NZ')}
                    </dd>
                  </div>
                </dl>
              </div>
              
              {/* Impact Calculator */}
              <ImpactCalculator bill={bill} />
              
              {/* Submission Helper - Only show if bill is open */}
              {isOpen && (
                <SubmissionHelper bill={bill} />
              )}
              
              {/* Bill Alerts */}
              {isOpen && <BillAlerts bill={bill} />}
              
              {/* Submission Sharing */}
              <SubmissionSharing bill={bill} />
              
              {!isOpen && (
                <div className="bg-slate-100 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Submissions Closed
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    The submission period for this bill has ended.
                  </p>
                  <Link 
                    href="/bills"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View other bills
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
