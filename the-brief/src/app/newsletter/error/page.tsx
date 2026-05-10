import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Error | The Brief',
  description: 'An error occurred with your newsletter subscription.',
  robots: {
    index: false,
    follow: false,
  },
}

interface ErrorPageProps {
  searchParams: { message?: string }
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const message = searchParams.message || 'Something went wrong. Please try again.'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops!
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {/* Help section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
          <h3 className="font-medium text-gray-900 mb-2">Need help?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make sure you're using the latest link from your email</li>
            <li>• Confirmation links expire after 7 days</li>
            <li>• Try signing up again if your link has expired</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
          <a
            href="mailto:hello@thebrief.nz?subject=Newsletter Help"
            className="block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
