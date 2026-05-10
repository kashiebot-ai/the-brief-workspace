'use client'

import { useState, useCallback } from 'react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline'
  className?: string
  source?: string
  onSuccess?: () => void
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSignup({
  variant = 'default',
  className = '',
  source = 'footer',
  onSuccess,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [gdprConsent] = useState(true)

  const validateEmail = useCallback((email: string): boolean => {
    return emailRegex.test(email)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    if (!gdprConsent) {
      setStatus('error')
      setMessage('Please consent to receiving emails')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source,
          gdprConsent,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        onSuccess?.()
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  // Compact variant - for footer
  if (variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
              Email address
            </label>
            <input
              id={`newsletter-email-${variant}`}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              required
              disabled={status === 'loading'}
              aria-describedby={status === 'error' ? `newsletter-error-${variant}` : undefined}
              aria-invalid={status === 'error'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            aria-label={status === 'loading' ? 'Subscribing...' : 'Subscribe to newsletter'}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        
        {/* Status Messages */}
        {status === 'success' && (
          <p className="text-sm text-green-600 mt-2" role="status">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p id={`newsletter-error-${variant}`} className="text-sm text-red-600 mt-2" role="alert">
            {message}
          </p>
        )}
        
        {/* GDPR Note */}
        <p className="text-xs text-gray-500 mt-2">
          No spam. Unsubscribe anytime. By subscribing, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    )
  }

  // Inline variant - for content sections
  if (variant === 'inline') {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Get The Brief</h3>
          <p className="text-gray-600 text-sm mt-1">
            One explainer, every weekday. Understand NZ politics without the spin.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
              Email address
            </label>
            <input
              id={`newsletter-email-${variant}`}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
              disabled={status === 'loading'}
              aria-describedby={status === 'error' ? `newsletter-error-${variant}` : undefined}
              aria-invalid={status === 'error'}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        
        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800" role="status">
              {message}
            </p>
          </div>
        )}
        {status === 'error' && (
          <div id={`newsletter-error-${variant}`} className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800" role="alert">
              {message}
            </p>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  // Default variant - full card
  return (
    <div className={`max-w-md mx-auto text-center ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Get The Brief</h3>
      <p className="text-gray-600 mb-6">
        One explainer, every weekday. Understand NZ politics without the spin.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required
            disabled={status === 'loading'}
            aria-describedby={status === 'error' ? `newsletter-error-${variant}` : undefined}
            aria-invalid={status === 'error'}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800" role="status">
            {message}
          </p>
        </div>
      )}
      {status === 'error' && (
        <div id={`newsletter-error-${variant}`} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800" role="alert">
            {message}
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-4">
        No spam. Unsubscribe anytime. By subscribing, you agree to our{' '}
        <a href="#" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
