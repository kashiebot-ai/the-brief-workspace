import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The Brief is independent, reader-funded political journalism for New Zealand. We explain what Parliament is doing without spin or jargon — so you can vote with confidence and hold power to account.',
  openGraph: {
    title: 'About The Brief',
    description: 'Independent, reader-funded political journalism for New Zealand. No spin. No jargon. Just facts.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About The Brief</h1>
            <p className="text-xl text-indigo-100">
              Democracy works better when people understand what's happening. 
              We exist to make New Zealand politics clear — no spin, no agenda, just facts.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why we exist</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="text-xl mb-6 leading-relaxed">
              Following New Zealand politics shouldn't require a degree in political science.
            </p>
            <p className="mb-6 leading-relaxed">
              Yet most political coverage assumes you already know what MMP stands for, understand Select 
              Committee processes, and can decode ministerial statements. Headlines scream about "coalition 
              tensions" without explaining what's at stake. Opinion masquerades as analysis.
            </p>
            <p className="mb-6 leading-relaxed">
              The Brief cuts through that noise. We explain how government actually works — from how bills 
              become law to why your vote matters in MMP. We break down policy debates without telling you 
              what to think. We help you find your MP, understand their voting record, and decide which 
              party aligns with your values.
            </p>
            <p className="mb-6 leading-relaxed">
              We're independent and non-partisan. No political party funds us. No advertiser influences 
              our coverage. We call out bad policy and praise good decisions regardless of who's in power.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Believe</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Good democracy depends on informed citizens. Here's what drives everything we do.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Plain English, Always</h3>
              <p className="text-gray-600">
                Political language is designed to confuse. "Fiscal consolidation" means cuts. 
                "Revenue measures" means taxes. We translate the jargon so you know exactly 
                what's being decided.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Independent & Accountable</h3>
              <p className="text-gray-600">
                No party affiliation. No corporate backers. We praise smart policy and criticize 
                bad decisions regardless of political color. Our only loyalty is to facts and our readers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Time Matters</h3>
              <p className="text-gray-600">
                Every explainer takes 5 minutes or less. No padding, no repetition, no 
                unnecessary backstory. We tell you what's happening and why it matters, 
                then get out of your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Cover</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">P</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Politics & Parliament</h3>
                <p className="text-gray-600 text-sm mt-1">How government works, who's in charge, and what they're deciding.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">E</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Economy & Business</h3>
                <p className="text-gray-600 text-sm mt-1">Budgets, inflation, housing, and what it means for your wallet.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Climate & Environment</h3>
                <p className="text-gray-600 text-sm mt-1">Environmental policy, climate action, and our changing world.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">S</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Social Issues</h3>
                <p className="text-gray-600 text-sm mt-1">Health, education, inequality, and the debates shaping our society.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Who Is This For?</h2>
            <p className="text-xl text-indigo-200 mb-8">
              The Brief is for anyone who wants to understand New Zealand politics without getting a politics degree.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-indigo-800 rounded-xl p-6">
                <h3 className="font-semibold mb-2">First-time Voters</h3>
                <p className="text-indigo-200 text-sm">Confused about MMP? Not sure who to vote for? Start here.</p>
              </div>
              <div className="bg-indigo-800 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Busy Professionals</h3>
                <p className="text-indigo-200 text-sm">Stay informed without spending hours reading news.</p>
              </div>
              <div className="bg-indigo-800 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Curious Citizens</h3>
                <p className="text-indigo-200 text-sm">Want to know what your MP actually does? We've got you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The team</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              The Brief is built by journalists, researchers, and developers who believe New Zealand 
              deserves clearer political coverage.
            </p>
            <p className="mb-6">
              We're reader-funded — not by advertisers, not by political parties. That independence 
              lets us follow the facts wherever they lead. If you find us valuable, consider 
              supporting our work.
            </p>
            <p className="mb-6">
              Got feedback? Spot an error? Want to suggest a topic? <a href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">Get in touch</a> — 
              we're always listening.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start reading</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our explainers, look up your MP's voting record, or take the quiz to find 
            which party aligns with your values.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/explainer"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Explainers
            </a>
            <a
              href="/mp-lookup"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Find Your MP
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}