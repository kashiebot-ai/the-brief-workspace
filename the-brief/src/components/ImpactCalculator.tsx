'use client'

import { useState } from 'react'
import { Bill, getCommitteeConfig } from '@/lib/bills-data'

interface ImpactCalculatorProps {
  bill: Bill
}

// Mock electorate data - in production this would come from an API
const MOCK_ELECTORATE_DATA: Record<string, {
  mp: { name: string; party: string; email: string }
  committeeMembers: number
  similarBills: { year: number; submissions: number; hadImpact: boolean }[]
}> = {
  'Auckland Central': {
    mp: { name: 'Chlöe Swarbrick', party: 'Green', email: 'auckland.central@parliament.govt.nz' },
    committeeMembers: 2,
    similarBills: [
      { year: 2023, submissions: 450, hadImpact: true },
      { year: 2022, submissions: 320, hadImpact: true }
    ]
  },
  'Wellington Central': {
    mp: { name: 'Tamatha Paul', party: 'Green', email: 'wellington.central@parliament.govt.nz' },
    committeeMembers: 1,
    similarBills: [
      { year: 2023, submissions: 520, hadImpact: true },
      { year: 2021, submissions: 280, hadImpact: false }
    ]
  },
  'Christchurch Central': {
    mp: { name: 'Duncan Webb', party: 'Labour', email: 'christchurch.central@parliament.govt.nz' },
    committeeMembers: 1,
    similarBills: [
      { year: 2023, submissions: 380, hadImpact: true },
      { year: 2022, submissions: 410, hadImpact: true }
    ]
  },
  'default': {
    mp: { name: 'Your Local MP', party: 'Unknown', email: 'mp@parliament.govt.nz' },
    committeeMembers: 0,
    similarBills: [
      { year: 2023, submissions: 300, hadImpact: true },
      { year: 2022, submissions: 250, hadImpact: false }
    ]
  }
}

const ELECTORATES = [
  'Auckland Central',
  'Bay of Plenty',
  'Botany',
  'Christchurch Central',
  'Christchurch East',
  'Dunedin',
  'East Coast',
  'East Coast Bays',
  'Epsom',
  'Hamilton East',
  'Hamilton West',
  'Hutt South',
  'Ilam',
  'Invercargill',
  'Kaikōura',
  'Kelston',
  'Mana',
  'Māngere',
  'Manukau East',
  'Manurewa',
  'Maungakiekie',
  'Mount Albert',
  'Mount Roskill',
  'Napier',
  'Nelson',
  'New Lynn',
  'New Plymouth',
  'North Shore',
  'Northcote',
  'Northland',
  'Ōhāriu',
  'Ōtaki',
  'Pakuranga',
  'Palmerston North',
  'Panmure-Ōtāhuhu',
  'Papakura',
  'Port Waikato',
  'Rangitata',
  'Rangitīkei',
  'Remutaka',
  'Rongotai',
  'Rotorua',
  'Selwyn',
  'Southland',
  'Taieri',
  'Takanini',
  'Tāmaki',
  'Taranaki-King Country',
  'Taupō',
  'Tauranga',
  'Te Atatū',
  'Thames-Coromandel',
  'Tukituki',
  'Upper Harbour',
  'Waikato',
  'Waimakariri',
  'Wairarapa',
  'Waitaki',
  'Wellington Central',
  'West Coast-Tasman',
  'Whanganui',
  'Whangaparāoa',
  'Whangārei',
  'Wigram'
]

export function ImpactCalculator({ bill }: ImpactCalculatorProps) {
  const [electorate, setElectorate] = useState('')
  const [isCalculated, setIsCalculated] = useState(false)

  const committee = getCommitteeConfig(bill.committee)
  const electorateData = MOCK_ELECTORATE_DATA[electorate] || MOCK_ELECTORATE_DATA['default']
  
  const successfulSubmissions = electorateData.similarBills.filter(b => b.hadImpact).length
  const impactPercentage = Math.round((successfulSubmissions / electorateData.similarBills.length) * 100)

  const handleCalculate = () => {
    if (electorate) {
      setIsCalculated(true)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Your Impact Potential
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Electorate Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Your Electorate
          </label>
          <select
            value={electorate}
            onChange={(e) => {
              setElectorate(e.target.value)
              setIsCalculated(false)
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose your electorate...</option>
            {ELECTORATES.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {!isCalculated ? (
          <button
            onClick={handleCalculate}
            disabled={!electorate}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Calculate My Impact
          </button>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {/* MP Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{electorateData.mp.name}</p>
                  <p className="text-sm text-slate-500">{electorateData.mp.party} Party</p>
                  <p className="text-xs text-slate-400">MP for {electorate}</p>
                </div>
              </div>
            </div>

            {/* Committee Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {electorateData.committeeMembers}
                </p>
                <p className="text-xs text-blue-700">
                  Committee members from your region
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {impactPercentage}%
                </p>
                <p className="text-xs text-green-700">
                  Similar bills had impact
                </p>
              </div>
            </div>

            {/* Similar Bills Info */}
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Similar Bills in Your Region
              </h4>
              <div className="space-y-2">
                {electorateData.similarBills.map((similarBill, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{similarBill.year}</span>
                    <span className="text-slate-500">{similarBill.submissions} submissions</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      similarBill.hadImpact 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {similarBill.hadImpact ? 'Impact' : 'No impact'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Committee Link */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                This bill is being reviewed by the{' '}
                <strong>{committee.name}</strong>
              </p>
              <a
                href={committee.parliamentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1"
              >
                View committee members
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <button
              onClick={() => setIsCalculated(false)}
              className="w-full py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Change electorate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
