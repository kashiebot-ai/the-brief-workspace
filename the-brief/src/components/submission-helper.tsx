'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Bill, SubmissionStance, BillCategory } from '@/lib/bills-data'

interface SubmissionHelperProps {
  bill: Bill
}

// Template library by stance and topic
const SUBMISSION_TEMPLATES: Record<string, Record<SubmissionStance, {
  title: string
  introduction: string
  points: string[]
  closing: string
}>> = {
  environment: {
    support: {
      title: 'Support Environment Bill',
      introduction: 'I am writing to express my strong support for this environmental legislation. As someone who cares deeply about our natural heritage and future generations, I believe this bill represents a crucial step forward.',
      points: [
        'This bill will help protect our unique biodiversity and ecosystems',
        'The proposed measures align with international climate commitments',
        'Strong environmental protections support long-term economic stability',
        'Future generations deserve a healthy, thriving environment'
      ],
      closing: 'I urge the committee to support this bill and ensure it passes with robust provisions intact. Thank you for considering my submission.'
    },
    oppose: {
      title: 'Oppose Environment Bill',
      introduction: 'I am writing to express my opposition to this bill in its current form. While I support environmental protection, I have significant concerns about the approach taken in this legislation.',
      points: [
        'The economic impact on local businesses and jobs has not been adequately addressed',
        'Implementation timelines are unrealistic and will cause unnecessary disruption',
        'The bill lacks sufficient consultation with affected communities',
        'Alternative approaches would achieve better environmental outcomes'
      ],
      closing: 'I respectfully request that the committee either significantly amend this bill or reject it in favour of better-designed legislation.'
    },
    neutral: {
      title: 'Request Amendment - Environment',
      introduction: 'I am writing to provide feedback on this environmental bill. I have mixed views on the legislation and wish to highlight specific areas that require amendment.',
      points: [
        'Support the environmental goals but concerned about implementation details',
        'Request clearer definitions and more flexible compliance pathways',
        'Suggest extended consultation with affected industries',
        'Recommend stronger monitoring and review mechanisms'
      ],
      closing: 'I hope the committee will carefully consider these points as you deliberate on this important legislation.'
    },
    mixed: {
      title: 'Mixed Position - Environment Bill',
      introduction: 'I am writing to provide my perspective on this environmental legislation. While I support some aspects, I have significant concerns about others.',
      points: [
        'Strongly support the environmental objectives outlined in Parts 1-3',
        'Have serious concerns about the implementation approach in Parts 4-5',
        'Request amendments to provide clearer guidance for businesses',
        'Suggest a phased implementation to allow for adjustment'
      ],
      closing: 'Thank you for the opportunity to contribute to this important democratic process.'
    }
  },
  housing: {
    support: {
      title: 'Support Housing Changes',
      introduction: 'I am writing to express my support for this housing legislation. The housing crisis affects us all, and I believe this bill takes important steps toward addressing it.',
      points: [
        'Increased housing supply is critical for affordability',
        'The bill addresses barriers that have slowed development',
        'Streamlined processes will help deliver homes faster',
        'The changes balance growth with community concerns'
      ],
      closing: 'I urge the committee to pass this bill to help address our housing crisis. Thank you for considering my submission.'
    },
    oppose: {
      title: 'Oppose Housing Changes',
      introduction: 'I am writing to strongly oppose this housing bill. While I recognise the need for more housing, this legislation undermines important community protections.',
      points: [
        'The bill removes important checks and balances in planning decisions',
        'Local community input is being sidelined',
        'Infrastructure capacity has not been adequately addressed',
        'Quality and design standards may be compromised'
      ],
      closing: 'I respectfully urge the committee to reject this bill or make substantial amendments to protect community interests.'
    },
    neutral: {
      title: 'Request Amendment - Housing',
      introduction: 'I am writing to provide feedback on this housing legislation. I support the goal of increasing housing supply but have concerns about certain provisions.',
      points: [
        'Support increasing density but request better infrastructure planning',
        'Suggest stronger requirements for affordable housing contributions',
        'Request improved consultation processes with local communities',
        'Recommend clearer standards for design quality'
      ],
      closing: 'I hope the committee will consider these amendments to improve this important legislation.'
    },
    mixed: {
      title: 'Mixed Position - Housing Bill',
      introduction: 'I am writing with mixed views on this housing legislation. While I support the overall intent, I have specific concerns about how it will be implemented.',
      points: [
        'Support the goal of increasing housing density',
        'Concerned about impact on existing neighbourhood character',
        'Request stronger infrastructure requirements',
        'Suggest amendments to protect tenant rights during development'
      ],
      closing: 'Thank you for considering my feedback on this important housing legislation.'
    }
  },
  general: {
    support: {
      title: 'Support This Bill',
      introduction: 'I am writing to express my support for this legislation. After careful consideration, I believe this bill will have positive impacts for our community.',
      points: [
        'This bill addresses an important issue facing New Zealand',
        'The proposed measures are well-researched and proportionate',
        'The legislation will benefit the wider community',
        'This represents good governance and responsible policy-making'
      ],
      closing: 'I urge the committee to support this bill. Thank you for considering my submission.'
    },
    oppose: {
      title: 'Oppose This Bill',
      introduction: 'I am writing to express my opposition to this bill. I have serious concerns about its potential impacts and believe it requires significant revision.',
      points: [
        'The bill has not been adequately researched or consulted',
        'Potential negative impacts outweigh the proposed benefits',
        'Alternative approaches would be more effective',
        'The legislation may have unintended consequences'
      ],
      closing: 'I respectfully urge the committee to reject this bill or return it for significant amendment.'
    },
    neutral: {
      title: 'Request Amendment',
      introduction: 'I am writing to provide feedback on this bill. I have a neutral position overall but wish to highlight specific concerns that require amendment.',
      points: [
        'The bill has merit but needs refinement in key areas',
        'Request further consultation with affected parties',
        'Suggest clearer definitions and guidelines',
        'Recommend additional safeguards or oversight'
      ],
      closing: 'I hope the committee will carefully consider these points as you review this legislation.'
    },
    mixed: {
      title: 'Mixed Position',
      introduction: 'I am writing with mixed views on this legislation. While I support some aspects, I have significant concerns about others that I wish to bring to the committee\'s attention.',
      points: [
        'Support the general intent but concerned about specific provisions',
        'Some sections are well-designed while others need revision',
        'Request amendments to address identified concerns',
        'Suggest a more gradual implementation approach'
      ],
      closing: 'Thank you for the opportunity to contribute to this democratic process. I trust the committee will give due consideration to all perspectives.'
    }
  }
}

const STANCE_OPTIONS: { value: SubmissionStance; label: string; description: string; emoji: string }[] = [
  { value: 'support', label: 'Support', description: 'You agree with the bill and want it to pass', emoji: '✅' },
  { value: 'oppose', label: 'Oppose', description: 'You disagree with the bill and do not want it to pass', emoji: '❌' },
  { value: 'neutral', label: 'Neutral/Mixed', description: 'You have mixed views or want to suggest amendments', emoji: '⚖️' },
]

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Professional and measured' },
  { value: 'passionate', label: 'Passionate', description: 'Heartfelt and personal' },
  { value: 'technical', label: 'Technical', description: 'Detailed and analytical' }
]

// Character limits (NZ Parliament guidelines)
const MAX_CHARS = 5000
const RECOMMENDED_MIN = 200

export function SubmissionHelper({ bill }: SubmissionHelperProps) {
  const [step, setStep] = useState<'stance' | 'template' | 'points' | 'tone' | 'preview' | 'submitted'>('stance')
  const [stance, setStance] = useState<SubmissionStance | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof SUBMISSION_TEMPLATES['general']['support'] | null>(null)
  const [selectedPoints, setSelectedPoints] = useState<string[]>([])
  const [customPoints, setCustomPoints] = useState<string[]>([''])
  const [tone, setTone] = useState<'formal' | 'passionate' | 'technical'>('formal')
  const [personalStory, setPersonalStory] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')

  // Load draft from localStorage
  useEffect(() => {
    const draftKey = `bill-submission-draft-${bill._id}`
    const saved = localStorage.getItem(draftKey)
    if (saved) {
      try {
        const draft = JSON.parse(saved)
        if (draft.stance) setStance(draft.stance)
        if (draft.selectedPoints) setSelectedPoints(draft.selectedPoints)
        if (draft.customPoints) setCustomPoints(draft.customPoints)
        if (draft.tone) setTone(draft.tone)
        if (draft.personalStory) setPersonalStory(draft.personalStory)
        if (draft.generatedText) setGeneratedText(draft.generatedText)
        if (draft.step && draft.step !== 'submitted') setStep(draft.step)
      } catch {
        // Ignore parse errors
      }
    }
  }, [bill._id])

  // Save draft to localStorage
  useEffect(() => {
    const draftKey = `bill-submission-draft-${bill._id}`
    const draft = {
      billId: bill._id,
      stance,
      selectedPoints,
      customPoints,
      tone,
      personalStory,
      generatedText,
      step,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(draftKey, JSON.stringify(draft))
  }, [bill._id, stance, selectedPoints, customPoints, tone, personalStory, generatedText, step])

  const getTemplateCategory = (category: BillCategory): string => {
    if (category in SUBMISSION_TEMPLATES) return category
    return 'general'
  }

  const handleStanceSelect = (selectedStance: SubmissionStance) => {
    setStance(selectedStance)
    const category = getTemplateCategory(bill.category)
    const template = SUBMISSION_TEMPLATES[category][selectedStance]
    setSelectedTemplate(template)
    setSelectedPoints(template.points.slice(0, 2))
    setStep('template')
  }

  const handlePointToggle = (point: string) => {
    setSelectedPoints(prev => 
      prev.includes(point) 
        ? prev.filter(p => p !== point)
        : [...prev, point]
    )
  }

  const handleCustomPointChange = (index: number, value: string) => {
    setCustomPoints(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const addCustomPoint = () => {
    setCustomPoints(prev => [...prev, ''])
  }

  const removeCustomPoint = (index: number) => {
    setCustomPoints(prev => prev.filter((_, i) => i !== index))
  }

  const generateSubmission = useCallback(() => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const parts: string[] = []
      
      parts.push(`Submission on ${bill.shortTitle}`)
      parts.push('')
      
      const stanceLabel = STANCE_OPTIONS.find(o => o.value === stance)?.label
      parts.push(`Position: ${stanceLabel}`)
      parts.push('')
      
      let intro = selectedTemplate?.introduction || ''
      if (tone === 'passionate') {
        intro = intro.replace(/I am writing to/, 'I feel compelled to write')
        intro = intro.replace(/I wish to/, 'I strongly wish to')
      } else if (tone === 'technical') {
        intro = intro.replace(/I am writing to/, 'This submission addresses')
        intro = intro.replace(/I believe/, 'The evidence suggests')
      }
      parts.push(intro)
      parts.push('')
      
      if (personalStory.trim()) {
        parts.push('Personal Perspective:')
        parts.push(personalStory.trim())
        parts.push('')
      }
      
      if (selectedPoints.length > 0) {
        parts.push('Key Points:')
        selectedPoints.forEach((point, index) => {
          parts.push(`${index + 1}. ${point}`)
        })
        parts.push('')
      }
      
      const validCustomPoints = customPoints.filter(p => p.trim())
      if (validCustomPoints.length > 0) {
        if (selectedPoints.length === 0) parts.push('Key Points:')
        validCustomPoints.forEach((point, index) => {
          parts.push(`${selectedPoints.length + index + 1}. ${point.trim()}`)
        })
        parts.push('')
      }
      
      let closing = selectedTemplate?.closing || ''
      if (tone === 'passionate') {
        closing = closing.replace(/Thank you/, 'With sincere appreciation, thank you')
      } else if (tone === 'technical') {
        closing = closing.replace(/Thank you/, 'I appreciate your consideration of this submission')
      }
      parts.push(closing)
      
      const text = parts.join('\n')
      setGeneratedText(text)
      setIsGenerating(false)
      setStep('preview')
    }, 500)
  }, [bill.shortTitle, stance, selectedTemplate, personalStory, selectedPoints, customPoints, tone])

  const handleSubmit = () => {
    const ref = `TB-${Date.now().toString(36).toUpperCase()}`
    setReferenceNumber(ref)
    const draftKey = `bill-submission-draft-${bill._id}`
    localStorage.removeItem(draftKey)
    setStep('submitted')
  }

  const charCount = generatedText.length
  const isOverLimit = charCount > MAX_CHARS
  const isUnderMinimum = charCount < RECOMMENDED_MIN && charCount > 0

  const progressSteps = [
    { key: 'stance', label: 'Stance' },
    { key: 'template', label: 'Template' },
    { key: 'points', label: 'Points' },
    { key: 'tone', label: 'Tone' },
    { key: 'preview', label: 'Preview' }
  ]

  const currentStepIndex = progressSteps.findIndex(s => s.key === step)

  const renderProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs mb-2">
        {progressSteps.map((s, i) => (
          <div key={s.key} className={`flex items-center ${i <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-1 ${
              i < currentStepIndex ? 'bg-blue-600 text-white' :
              i === currentStepIndex ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
              'bg-slate-100 text-slate-400'
            }`}>
              {i < currentStepIndex ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
        />
      </div>
    </div>
  )

  if (step === 'submitted') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Submission Ready!</h3>
          <p className="text-green-100">Your submission is prepared and ready to send</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">Your Reference Number</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{referenceNumber}</p>
            <p className="text-xs text-slate-400 mt-1">Save this for your records</p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-4">What happens next</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium text-slate-900">Submit to Parliament</p>
                  <p className="text-sm text-slate-500">Copy your submission and complete the official form</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium text-slate-900">Committee Review</p>
                  <p className="text-sm text-slate-500">The select committee considers all submissions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium text-slate-900">Report Released</p>
                  <p className="text-sm text-slate-500">Committee publishes recommendations (usually 6-12 months)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={bill.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Go to Parliament Submission Form
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <button
              onClick={() => setStep('preview')}
              className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Edit Submission
            </button>

            <Link
              href={`/bills/${bill.slug.current}`}
              className="block w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Bill Page
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h3 className="font-semibold">Submission Helper</h3>
        <p className="text-blue-100 text-sm">
          We'll guide you through making your submission
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {step !== 'stance' && renderProgress()}

        {step === 'stance' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What makes a good submission?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and reference bill sections</li>
                <li>• Share personal experiences</li>
                <li>• Stay constructive and suggest alternatives</li>
                <li>• Keep it concise and focused</li>
              </ul>
            </div>
            <p className="text-sm text-slate-600">
              What's your position on this bill?
            </p>
            <div className="space-y-2">
              {STANCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStanceSelect(option.value)}
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="text-sm text-slate-500">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'template' && stance && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <span className="font-medium text-blue-600">
                {STANCE_OPTIONS.find(o => o.value === stance)?.label}
              </span>
              <button 
                onClick={() => setStep('stance')}
                className="text-slate-400 hover:text-slate-600 underline"
              >
                Change
              </button>
            </div>

            <p className="text-sm text-slate-600">
              We've selected a template based on your stance. You can customise it in the next steps.
            </p>

            {selectedTemplate && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">{selectedTemplate.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{selectedTemplate.introduction}</p>
                <p className="text-sm font-medium text-slate-700">Key points included:</p>
                <ul className="mt-2 space-y-1">
                  {selectedTemplate.points.slice(0, 3).map((point, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setStep('points')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Point Builder
            </button>
          </div>
        )}

        {step === 'points' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <span className="font-medium text-blue-600">
                {STANCE_OPTIONS.find(o => o.value === stance)?.label}
              </span>
              <span className="text-slate-300">→</span>
              <span className="text-slate-500">Points</span>
            </div>

            <p className="text-sm text-slate-600">
              Select the points you want to include:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedTemplate?.points.map((point, i) => (
                <label key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedPoints.includes(point)}
                    onChange={() => handlePointToggle(point)}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{point}</span>
                </label>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Add your own points:</p>
              {customPoints.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleCustomPointChange(index, e.target.value)}
                    placeholder="Enter your own point..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {customPoints.length > 1 && (
                    <button
                      onClick={() => removeCustomPoint(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCustomPoint}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add another point
              </button>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Personal Story (optional)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Share why this bill matters to you personally
              </p>
              <textarea
                value={personalStory}
                onChange={(e) => setPersonalStory(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="This bill affects me because..."
              />
            </div>

            <button
              onClick={() => setStep('tone')}
              disabled={selectedPoints.length === 0 && customPoints.filter(p => p.trim()).length === 0}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Tone Selection
            </button>
          </div>
        )}

        {step === 'tone' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <span className="font-medium text-blue-600">
                {STANCE_OPTIONS.find(o => o.value === stance)?.label}
              </span>
              <span className="text-slate-300">→</span>
              <span className="font-medium text-blue-600">Points</span>
              <span className="text-slate-300">→</span>
              <span className="text-slate-500">Tone</span>
            </div>

            <p className="text-sm text-slate-600">
              Select the tone for your submission:
            </p>

            <div className="space-y-2">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTone(option.value as typeof tone)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    tone === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={generateSubmission}
              disabled={isGenerating}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Preview Submission'}
            </button>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <span className="font-medium text-blue-600">
                {STANCE_OPTIONS.find(o => o.value === stance)?.label}
              </span>
              <span className="text-slate-300">→</span>
              <span className="font-medium text-blue-600">Points</span>
              <span className="text-slate-300">→</span>
              <span className="font-medium text-blue-600">Tone</span>
              <span className="text-slate-300">→</span>
              <span className="text-slate-500">Preview</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-900">
                  Your Submission
                </label>
                <span className={`text-xs ${
                  isOverLimit ? 'text-red-600 font-medium' :
                  isUnderMinimum ? 'text-amber-600' :
                  'text-slate-500'
                }`}>
                  {charCount} / {MAX_CHARS} characters
                  {isOverLimit && ' (over limit)'}
                  {isUnderMinimum && ' (add more)'}
                </span>
              </div>
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                rows={12}
                className={`w-full px-3 py-2 border rounded-lg text-sm font-mono ${
                  isOverLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                  'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              <p className="text-xs text-slate-500 mt-1">
                You can edit this text before submitting.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ready to Submit?
              </h4>
              <p className="text-sm text-amber-800 mb-4">
                You'll be redirected to the official Parliament submission form. 
                Copy your submission text and paste it there.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isOverLimit || charCount === 0}
                className="w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                I'm Ready - Generate Reference Number
              </button>
            </div>

            <button
              onClick={() => setStep('tone')}
              className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Tone Selection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
