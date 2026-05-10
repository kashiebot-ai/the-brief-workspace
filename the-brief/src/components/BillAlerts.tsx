'use client'

import { useState, useEffect } from 'react'
import { Bill } from '@/lib/bills-data'

interface BillAlertsProps {
  bill: Bill
}

interface AlertSettings {
  stageChange: boolean
  deadlineReminder: boolean
  email: string
}

export function BillAlerts({ bill }: BillAlertsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AlertSettings>({
    stageChange: true,
    deadlineReminder: true,
    email: ''
  })
  const [isSaved, setIsSaved] = useState(false)

  // Load saved settings
  useEffect(() => {
    const alertKey = `bill-alerts-${bill._id}`
    const saved = localStorage.getItem(alertKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
      } catch {
        // Ignore parse errors
      }
    }
  }, [bill._id])

  const handleSave = () => {
    const alertKey = `bill-alerts-${bill._id}`
    localStorage.setItem(alertKey, JSON.stringify({
      ...settings,
      billId: bill._id,
      billTitle: bill.shortTitle,
      savedAt: new Date().toISOString()
    }))
    
    // Also add to global alerts list
    const allAlerts = JSON.parse(localStorage.getItem('bill-alerts-list') || '[]')
    const existingIndex = allAlerts.findIndex((a: { billId: string }) => a.billId === bill._id)
    const alertData = {
      billId: bill._id,
      billTitle: bill.shortTitle,
      billSlug: bill.slug.current,
      email: settings.email,
      stageChange: settings.stageChange,
      deadlineReminder: settings.deadlineReminder,
      deadline: bill.submissionDeadline
    }
    
    if (existingIndex >= 0) {
      allAlerts[existingIndex] = alertData
    } else {
      allAlerts.push(alertData)
    }
    localStorage.setItem('bill-alerts-list', JSON.stringify(allAlerts))
    
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const getDeadlineDate = () => {
    const deadline = new Date(bill.submissionDeadline)
    const oneWeekBefore = new Date(deadline)
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7)
    return oneWeekBefore.toLocaleDateString('en-NZ', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  if (!isOpen) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-900">Get Alerts</h4>
            <p className="text-sm text-slate-600 mt-1">
              Be notified when this bill moves to the next stage or when the deadline approaches.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Set up alerts →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Bill Alerts</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-200 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Get notified about updates to {bill.shortTitle}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Stage Change Alert */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={settings.stageChange}
            onChange={(e) => setSettings(prev => ({ ...prev, stageChange: e.target.checked }))}
            className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <div>
            <div className="font-medium text-slate-900">Bill Stage Updates</div>
            <div className="text-sm text-slate-500">
              Notify me when this bill moves to the next stage (e.g., First Reading → Second Reading)
            </div>
          </div>
        </label>

        {/* Deadline Reminder */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={settings.deadlineReminder}
            onChange={(e) => setSettings(prev => ({ ...prev, deadlineReminder: e.target.checked }))}
            className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <div>
            <div className="font-medium text-slate-900">Submission Deadline Reminder</div>
            <div className="text-sm text-slate-500">
              Email me 1 week before submissions close ({getDeadlineDate()})
            </div>
          </div>
        </label>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            We'll only use this email for bill alerts. No spam.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
          <p>
            <strong>Note:</strong> Alerts are stored locally in your browser. 
            We don't have a server to send actual emails yet - this is a placeholder 
            for when email notifications are implemented.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!settings.email || (!settings.stageChange && !settings.deadlineReminder)}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            isSaved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed'
          }`}
        >
          {isSaved ? '✓ Saved!' : 'Save Alert Preferences'}
        </button>
      </div>
    </div>
  )
}
