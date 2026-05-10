'use client'

import { useState } from 'react'
import { Bill } from '@/lib/bills-data'

interface SubmissionSharingProps {
  bill: Bill
}

// Mock data for anonymised submission themes
const MOCK_THEMES = [
  { stance: 'support', theme: 'Economic benefits', count: 234 },
  { stance: 'support', theme: 'Environmental protection', count: 189 },
  { stance: 'oppose', theme: 'Cost concerns', count: 156 },
  { stance: 'oppose', theme: 'Implementation challenges', count: 98 },
  { stance: 'neutral', theme: 'Need more information', count: 76 },
  { stance: 'support', theme: 'Community wellbeing', count: 145 },
  { stance: 'oppose', theme: 'Unintended consequences', count: 67 },
]

export function SubmissionSharing({ bill }: SubmissionSharingProps) {
  const [showThemes, setShowThemes] = useState(false)
  const [copied, setCopied] = useState(false)

  const supportCount = MOCK_THEMES.filter(t => t.stance === 'support').reduce((acc, t) => acc + t.count, 0)
  const opposeCount = MOCK_THEMES.filter(t => t.stance === 'oppose').reduce((acc, t) => acc + t.count, 0)
  const neutralCount = MOCK_THEMES.filter(t => t.stance === 'neutral').reduce((acc, t) => acc + t.count, 0)
  const totalCount = supportCount + opposeCount + neutralCount

  const handleShare = (platform: string) => {
    const text = `I just made a submission on "${bill.shortTitle}" via The Brief. Have your say on NZ legislation! 🇳🇿`
    const url = typeof window !== 'undefined' ? window.location.href : ''
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Submission on ${bill.shortTitle}`)}&body=${encodeURIComponent(text + '\n\n' + url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share & See What Others Are Saying
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-600">{supportCount}</p>
            <p className="text-xs text-green-700">Support</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-red-600">{opposeCount}</p>
            <p className="text-xs text-red-700">Oppose</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-600">{neutralCount}</p>
            <p className="text-xs text-amber-700">Neutral</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Based on {totalCount} submissions via The Brief
        </p>

        {/* Toggle Themes */}
        <button
          onClick={() => setShowThemes(!showThemes)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {showThemes ? 'Hide' : 'Show'} submission themes
        </button>

        {/* Themes List */}
        {showThemes && (
          <div className="space-y-2 animate-fadeIn">
            <h4 className="text-sm font-medium text-slate-700">Common themes in submissions:</h4>
            <div className="space-y-2">
              {MOCK_THEMES.sort((a, b) => b.count - a.count).map((theme, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      theme.stance === 'support' ? 'bg-green-500' :
                      theme.stance === 'oppose' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`} />
                    <span className="text-slate-700">{theme.theme}</span>
                  </div>
                  <span className="text-slate-500 text-xs">{theme.count} mentions</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Share this bill</h4>
          
          {/* Social Share Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Share on X (Twitter)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="flex items-center justify-center py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Share via Email"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full mt-2 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy link
              </>
            )}
          </button>
        </div>

        {/* Badge */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">I submitted on this bill!</p>
              <p className="text-sm text-blue-100">Share your civic participation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
