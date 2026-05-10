import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscription Confirmed | The Brief',
  description: 'Your subscription to The Brief has been confirmed. You\'ll now receive our daily political explainers.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You&apos;re all set! 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          Your subscription to <strong>The Brief</strong> is confirmed. 
          You&apos;ll now receive our daily political explainers every weekday morning.
        </p>

        {/* What to expect */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• One explainer every weekday morning</li>
            <li>• Clear, concise analysis of NZ politics</li>
            <li>• No spin, no jargon — just the facts</li>
            <li>• 5-minute read to start your day</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/explainer"
            className="block w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Read Latest Explainers
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-500 mt-8">
          Check your inbox for a welcome email with more details.
        </p>
      </div>
    </div>
  )
}
