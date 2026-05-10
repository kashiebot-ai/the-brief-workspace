import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Methodology',
  description: 'How we research, write, and fact-check our explainers. Learn about our sources, editorial process, and non-partisan commitment.',
  openGraph: {
    title: 'Our Methodology',
    description: 'How we research and fact-check every explainer.',
  },
}

// FAQ data for the methodology page
const methodologyFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does The Brief research its explainers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We start with primary sources. For legislation, that means reading the actual bills. For policy, we review official government documents, Treasury reports, and Parliamentary Library research. We consult academic research, official statistics, and subject matter experts when needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sources does The Brief use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use primary sources including parliamentary bills and legislation, Hansard (parliamentary debates), government press releases, and Official Information Act responses. We also reference Stats NZ, Treasury, Reserve Bank of New Zealand data, and Parliamentary Library research.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is The Brief politically biased?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Brief is independent and non-partisan. We do not support any political party, and we do not take positions on who should win elections. We apply the same scrutiny to all parties and call out mistakes regardless of political color.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does The Brief ensure accuracy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every explainer goes through a five-step process: topic selection, research from primary sources, writing in plain English, independent fact-checking, and editorial review. Every claim is verified against reliable sources, and we cite our sources so readers can check our work.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is The Brief\'s corrections policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Minor errors like typos are corrected without note. Substantive errors that affect meaning are corrected with an editor\'s note explaining what was wrong. Errors can be reported to corrections@thebrief.nz, and we aim to respond within 24 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I suggest a topic for an explainer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We welcome reader suggestions. If you are confused about a political topic, chances are others are too. Use the contact form on our website or email us with your suggestion. We monitor parliamentary proceedings and public debate to identify issues that matter to New Zealanders.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who funds The Brief?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Brief is reader-funded and independent. We do not accept funding from political parties. This independence allows us to follow the facts wherever they lead without external influence on our coverage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to create an explainer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each explainer is designed to be read in 5 minutes or less, but the research and writing process takes several days. We prioritize clarity over speed, ensuring every explainer answers three questions: What is this? Why does it matter? What happens next?',
      },
    },
  ],
}

export default function MethodologyPage() {
  return (
    <>
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(methodologyFAQ),
        }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Methodology</h1>
              <p className="text-xl text-indigo-100">
                How we research, write, and fact-check every explainer. Transparency is core to what we do.
              </p>
            </div>
          </div>
        </section>

        {/* Research Process */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How We Work</h2>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Topic Selection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We choose topics based on what is actually affecting New Zealanders. We monitor parliamentary 
                    proceedings, policy announcements, and public debate to identify issues that matter. 
                    We also take suggestions from our readers — if you are confused about something, 
                    chances are others are too.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Research</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We start with primary sources. For legislation, that means reading the actual bills. 
                    For policy, we review official government documents, Treasury reports, and Parliamentary 
                    Library research. We consult academic research, official statistics, and subject matter 
                    experts when needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Writing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We write in plain English, avoiding jargon where possible (and explaining it when we cannot). 
                    Every explainer answers three questions: What is this? Why does it matter? And what happens next? 
                    We aim for clarity over cleverness.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fact-Checking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every claim is verified against reliable sources. We cite our sources so you can check 
                    our work. If we make an error, we correct it promptly and transparently. 
                    See our corrections policy below.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">5</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Editorial Review</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Before publication, every explainer is reviewed by an editor who checks for accuracy, 
                    clarity, balance, and tone. We ask: Is this fair? Is it clear? Is it useful? 
                    Only then do we hit publish.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Sources</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Primary Sources
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Parliamentary bills and legislation</li>
                  <li>• Hansard (parliamentary debates)</li>
                  <li>• Government press releases</li>
                  <li>• Official Information Act responses</li>
                  <li>• Select committee reports</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Official Data
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Stats NZ</li>
                  <li>• Treasury</li>
                  <li>• Reserve Bank of New Zealand</li>
                  <li>• Parliamentary Library</li>
                  <li>• Electoral Commission</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academic Research
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Peer-reviewed journals</li>
                  <li>• University research centres</li>
                  <li>• Think tank reports (clearly labeled)</li>
                  <li>• Independent research institutes</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Expert Input
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Subject matter experts</li>
                  <li>• Former politicians (both sides)</li>
                  <li>• Policy analysts</li>
                  <li>• Community representatives</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Non-Partisan */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Non-Partisan Commitment</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                The Brief is independent and non-partisan. We do not support any political party, 
                and we do not take positions on who should win elections.
              </p>
              <p className="mb-4">
                What we do is explain. We believe you deserve clear, accurate information about 
                what parties are proposing, what policies actually mean, and what the experts say.
                Then you can make up your own mind.
              </p>
              <p className="mb-4">
                We apply the same scrutiny to all parties. When Labour is in government, we examine 
                their record. When National proposes policy, we analyse their plans. We call out mistakes, 
                broken promises, and flawed logic wherever we find them.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How we maintain independence:</h3>
              <ul className="space-y-2">
                <li>We do not accept funding from political parties</li>
                <li>We do not endorse candidates or parties</li>
                <li>We disclose any potential conflicts of interest</li>
                <li>We correct errors promptly and transparently</li>
                <li>We welcome feedback from across the political spectrum</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Corrections */}
        <section className="bg-indigo-50 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Corrections Policy</h2>
            <p className="text-gray-600 mb-6">
              We strive for accuracy, but mistakes happen. When they do, we correct them promptly 
              and transparently. Here is how:
            </p>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Minor errors</h4>
                <p className="text-gray-600 text-sm">
                  Typos, broken links, or minor factual errors are corrected without note, 
                  though we keep a log of all changes.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Substantive errors</h4>
                <p className="text-gray-600 text-sm">
                  Errors that affect the meaning of a story are corrected with an editor&apos;s note 
                  at the bottom of the article, explaining what was wrong and what it should have said.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">Reporting errors</h4>
                <p className="text-gray-600 text-sm">
                  If you spot an error, please email corrections@thebrief.nz with details. 
                  We aim to respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
