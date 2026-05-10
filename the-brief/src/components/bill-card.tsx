'use client'

import Link from 'next/link'
import { Bill, formatDeadline, getCategoryConfig } from '@/lib/bills-data'

interface BillCardProps {
  bill: Bill
}

export function BillCard({ bill }: BillCardProps) {
  const deadline = formatDeadline(bill.submissionDeadline)
  const category = getCategoryConfig(bill.category)
  const isClosed = bill.status === 'closed' || bill.status === 'passed' || bill.status === 'defeated'

  return (
    <Link 
      href={`/bills/${bill.slug.current}`}
      className={`block bg-white border rounded-xl overflow-hidden transition-all hover:shadow-lg ${
        deadline.isUrgent && !isClosed
          ? 'border-amber-300 hover:border-amber-400'
          : isClosed
          ? 'border-slate-200 opacity-75'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="p-6">
        {/* Category & Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
            {category.label}
          </span>
          {deadline.isUrgent && !isClosed && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Closing Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
          {bill.shortTitle}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {bill.description}
        </p>

        {/* Deadline */}
        <div className={`flex items-center gap-2 text-sm ${
          deadline.isUrgent && !isClosed ? 'text-amber-700 font-medium' : 'text-slate-500'
        }`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {deadline.text}
        </div>
      </div>

      {/* Footer */}
      <div className={`px-6 py-3 text-sm font-medium flex items-center justify-between ${
        isClosed 
          ? 'bg-slate-50 text-slate-500' 
          : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
      }`}>
        <span>{isClosed ? 'View Details' : 'Make Submission'}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
