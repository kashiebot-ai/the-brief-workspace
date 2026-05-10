'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getElectorateByPostcode, Electorate } from '@/lib/electorate-data'
import { MPSkeleton } from '@/components/Skeleton'

// Voting history data (sample)
const VOTING_HISTORY = [
  { bill: 'Fair Pay Agreements Repeal', vote: 'For', date: '2023-12', summary: 'Voted to repeal Fair Pay Agreements legislation' },
  { bill: 'Three Strikes Legislation', vote: 'For', date: '2024-01', summary: 'Voted to reinstate three strikes sentencing' },
  { bill: 'Smokefree Environments Repeal', vote: 'For', date: '2024-02', summary: 'Voted to repeal smokefree generation legislation' },
  { bill: 'Oil and Gas Exploration', vote: 'For', date: '2024-03', summary: 'Voted to end offshore oil and gas exploration ban' },
]

// Party colors with proper contrast
const PARTY_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  'National': { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  'Labour': { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50' },
  'Green': { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
  'ACT': { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
  'NZ First': { bg: 'bg-black', text: 'text-gray-800', light: 'bg-gray-100' },
  'Te Pati Maori': { bg: 'bg-red-700', text: 'text-red-700', light: 'bg-red-50' },
}

function MPResult({ electorate }: { electorate: Electorate }) {
  const { mp } = electorate
  const partyStyle = PARTY_COLORS[mp.party] || { bg: 'bg-gray-600', text: 'text-gray-600', light: 'bg-gray-50' }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header with party color */}
      <motion.div 
        className={`${partyStyle.bg} h-24 relative`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      >
        <motion.div 
          className="absolute -bottom-12 left-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
            {mp.name.charAt(0)}
          </div>
        </motion.div>
      </motion.div>

      <div className="pt-16 pb-8 px-8">
        {/* MP Info */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{mp.name}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <motion.span 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${partyStyle.light} ${partyStyle.text}`}
              whileHover={{ scale: 1.05 }}
            >
              {mp.party}
            </motion.span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">MP for {electorate.name}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Since {mp.since}</span>
          </div>
        </motion.div>

        {/* Electorate Info */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${mp.email}`} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  {mp.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{mp.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">{mp.office}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Electorate Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Region</span>
                <span className="font-medium text-gray-900">{electorate.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Majority</span>
                <span className="font-medium text-gray-900">{electorate.majority.toLocaleString()} votes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Electorate Type</span>
                <span className="font-medium text-gray-900">General</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Voting History */}
        <motion.div 
          className="border-t border-gray-200 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Voting Record</h3>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legislation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vote</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {VOTING_HISTORY.map((vote, idx) => (
                  <motion.tr 
                    key={idx} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{vote.bill}</div>
                      <div className="text-sm text-gray-500">{vote.summary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vote.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vote.vote === 'For' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vote.vote}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Note: Voting record shows representative sample. For complete voting history, visit{' '}
            <a href="https://www.parliament.nz" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
              parliament.nz
            </a>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="mt-8 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.a
            href={`mailto:${mp.email}`}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Your MP
          </motion.a>
          <motion.a
            href={`https://www.parliament.nz/en/mps-and-electorates/members-of-parliament/${mp.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Parliament
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function MPLookupPage() {
  const [postcode, setPostcode] = useState('')
  const [electorate, setElectorate] = useState<Electorate | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setElectorate(null)
    setLoading(true)

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = getElectorateByPostcode(postcode.trim())
    
    if (result) {
      setElectorate(result)
    } else {
      setError(`Sorry, we couldn't find an electorate for postcode "${postcode}". Please check and try again.`)
    }
    
    setLoading(false)
  }

  const examplePostcodes = ['1010', '4110', '6011', '9010', '8011']

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16 md:py-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Find Your MP
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-indigo-100 mb-8"
            >
              Enter your postcode to discover who represents you in Parliament, their voting record, and how to contact them.
            </motion.p>

            {/* Search Form */}
            <motion.form 
              onSubmit={handleSearch} 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Enter postcode (e.g. 1010)"
                    className="w-full px-5 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-400 focus:outline-none text-lg transition-shadow"
                    maxLength={4}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading || !postcode.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
                >
                  {loading ? (
                    <motion.svg 
                      className="animate-spin h-5 w-5" 
                      viewBox="0 0 24 24"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </motion.svg>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Example Postcodes */}
            <motion.div 
              className="mt-6 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-indigo-200 text-sm">Try:</span>
              {examplePostcodes.map((pc, index) => (
                <motion.button
                  key={pc}
                  onClick={() => setPostcode(pc)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="text-sm text-white hover:text-indigo-200 underline underline-offset-2 transition-colors"
                >
                  {pc}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-red-800 font-semibold">Postcode not found</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {loading && <MPSkeleton />}

            {electorate && !loading && <MPResult electorate={electorate} />}

            {!electorate && !error && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div 
                  className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter your postcode above</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We&apos;ll show you who represents your electorate in Parliament, their contact details, and recent voting history.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Voting Records',
                description: 'See how your MP has voted on key legislation that affects you and your community.'
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Contact Details',
                description: 'Get in touch with your MP via email, phone, or visit their local office.'
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.984A3 3 0 0015 5.5H9a3 3 0 00-3 3v8.5" />
                  </svg>
                ),
                title: 'Electorate Info',
                description: 'Learn about your electorate&apos;s boundaries, voting history, and election results.'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  y: -4, 
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
