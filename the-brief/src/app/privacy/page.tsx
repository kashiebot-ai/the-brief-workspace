import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: March 2026
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Overview</h2>
        <p className="text-gray-600 mb-4">
          The Brief (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Information You Provide</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Email address (when subscribing to our newsletter)</li>
          <li>Postcode (when using MP lookup tool)</li>
          <li>Quiz responses (anonymised)</li>
        </ul>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Automatically Collected</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent</li>
          <li>Referring website</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Send newsletter updates (with your consent)</li>
          <li>Improve our website and content</li>
          <li>Analyse usage patterns</li>
          <li>Prevent fraud and abuse</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Newsletter Subscriptions</h2>
        <p className="text-gray-600 mb-4">
          When you subscribe to our newsletter, we collect your email address. You can unsubscribe at any time 
          by clicking the link in any email we send. We use industry-standard email service providers to 
          manage subscriptions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
        <p className="text-gray-600 mb-4">
          We implement appropriate technical and organisational measures to protect your personal information. 
          However, no internet transmission is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
        <p className="text-gray-600 mb-4">
          We use the following third-party services:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Vercel (hosting)</li>
          <li>Sanity (content management)</li>
          <li>Email service providers</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
        <p className="text-gray-600 mb-4">
          Under New Zealand&apos;s Privacy Act 2020, you have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Access your personal information</li>
          <li>Request corrections to your information</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Request deletion of your data</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          If you have questions about this Privacy Policy or how we handle your data, please contact us at{' '}
          <a href="mailto:privacy@thebrief.nz" className="text-indigo-600 hover:text-indigo-700">
            privacy@thebrief.nz
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
        <p className="text-gray-600 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
          the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
        </p>
      </div>
    </div>
  )
}
