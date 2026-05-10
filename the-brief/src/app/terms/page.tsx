import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using The Brief website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: March 2026
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-4">
          By accessing and using The Brief website (&ldquo;the Site&rdquo;), you accept and agree to be bound by 
          these Terms of Use. If you do not agree to these terms, please do not use the Site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. About The Brief</h2>
        <p className="text-gray-600 mb-4">
          The Brief is an independent, non-partisan platform providing explainers and information about 
          New Zealand politics. We aim to present factual, balanced information to help citizens make 
          informed decisions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Use of Content</h2>
        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.1 Permitted Use</h3>
        <p className="text-gray-600 mb-4">
          You may:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Read and share our content for personal, non-commercial use</li>
          <li>Link to our articles and pages</li>
          <li>Quote brief excerpts with attribution</li>
        </ul>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">3.2 Prohibited Use</h3>
        <p className="text-gray-600 mb-4">
          You may not:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Republish our content in full without permission</li>
          <li>Use our content for commercial purposes without authorisation</li>
          <li>Modify or create derivative works from our content</li>
          <li>Scrape or automatically collect data from the Site</li>
          <li>Use the Site in any way that could damage or impair our services</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-600 mb-4">
          All content on the Site, including text, graphics, logos, and software, is the property of 
          The Brief or our content suppliers and is protected by New Zealand and international copyright laws.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. User Conduct</h2>
        <p className="text-gray-600 mb-4">
          When using the Site, you agree not to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
          <li>Violate any applicable laws or regulations</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with the proper functioning of the Site</li>
          <li>Attempt to gain unauthorised access to our systems</li>
          <li>Use the Site to distribute spam or malware</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Disclaimer of Warranties</h2>
        <p className="text-gray-600 mb-4">
          The Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, either express 
          or implied. We strive for accuracy but do not guarantee that all information is complete, 
          current, or error-free.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
        <p className="text-gray-600 mb-4">
          To the fullest extent permitted by law, The Brief shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages arising from your use of the Site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Third-Party Links</h2>
        <p className="text-gray-600 mb-4">
          The Site may contain links to third-party websites. We are not responsible for the content 
          or practices of these websites. Following external links is at your own risk.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to Terms</h2>
        <p className="text-gray-600 mb-4">
          We may modify these Terms of Use at any time. Changes will be effective immediately upon 
          posting to the Site. Your continued use of the Site constitutes acceptance of the modified terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
        <p className="text-gray-600 mb-4">
          These Terms of Use are governed by the laws of New Zealand. Any disputes arising from these 
          terms shall be subject to the exclusive jurisdiction of the New Zealand courts.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Contact</h2>
        <p className="text-gray-600 mb-4">
          For questions about these Terms of Use, please contact us at{' '}
          <a href="mailto:contact@thebrief.nz" className="text-indigo-600 hover:text-indigo-700">
            contact@thebrief.nz
          </a>.
        </p>
      </div>
    </div>
  )
}
