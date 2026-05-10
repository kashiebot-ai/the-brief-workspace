import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Unsubscribed | The Brief',
  description: 'You have been unsubscribed from The Brief newsletter.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You&apos;ve been unsubscribed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          You have been successfully removed from The Brief newsletter.
          You won&apos;t receive any more emails from us.
        </p>

        {/* Feedback section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="font-medium text-gray-900 mb-2">We&apos;re sorry to see you go</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you have a moment, we&apos;d love to know why you&apos;re leaving:
          </p>
          <a
            href="mailto:hello@thebrief.nz?subject=Newsletter Feedback"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Send us feedback →
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/explainer"
            className="block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Browse Explainers
          </Link>
        </div>

        {/* Resubscribe note */}
        <p className="text-sm text-gray-500 mt-8">
          Changed your mind?{' '}
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            Resubscribe anytime
          </Link>
        </p>
      </div>
    </div>
  )
}
