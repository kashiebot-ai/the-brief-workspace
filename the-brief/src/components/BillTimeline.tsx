'use client'

import { motion } from 'framer-motion'

interface Stage {
  key: string
  label: string
  description: string
}

const STAGES: Stage[] = [
  {
    key: 'first_reading',
    label: 'First Reading',
    description: 'Bill introduced to Parliament'
  },
  {
    key: 'select_committee',
    label: 'Select Committee',
    description: 'Public can make submissions'
  },
  {
    key: 'second_reading',
    label: 'Second Reading',
    description: 'MPs debate the bill'
  },
  {
    key: 'committee_whole',
    label: 'Committee of Whole',
    description: 'Detailed review by all MPs'
  },
  {
    key: 'third_reading',
    label: 'Third Reading / Royal Assent',
    description: 'Final vote and becomes law'
  }
]

interface BillTimelineProps {
  currentStage: string
  stageDates?: Record<string, string>
  submissionDeadline?: string
  status: string
}

export function BillTimeline({ currentStage, stageDates = {}, submissionDeadline, status }: BillTimelineProps) {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage)
  const isDefeated = status === 'defeated'
  const isPassed = status === 'passed'
  
  // Determine which stage is "active" (the current one)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  const getStageStatus = (index: number) => {
    if (isDefeated && index >= activeIndex) return 'defeated'
    if (isPassed && index < activeIndex) return 'completed'
    if (isPassed && index === activeIndex) return 'completed'
    if (index < activeIndex) return 'completed'
    if (index === activeIndex) return 'current'
    return 'upcoming'
  }

  const getStageStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white'
      case 'current':
        return 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
      case 'defeated':
        return 'bg-red-500 border-red-500 text-white'
      default:
        return 'bg-white border-slate-300 text-slate-400'
    }
  }

  const getLineStyles = (index: number) => {
    const stageStatus = getStageStatus(index)
    if (stageStatus === 'completed') return 'bg-green-500'
    if (stageStatus === 'defeated') return 'bg-red-200'
    return 'bg-slate-200'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-NZ', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="w-full">
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 flex">
            {STAGES.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-full ${getLineStyles(index)}`}
                style={{ marginRight: index < STAGES.length - 2 ? '4px' : '0' }}
              />
            ))}
          </div>

          {/* Stage Nodes */}
          <div className="relative flex justify-between">
            {STAGES.map((stage, index) => {
              const stageStatus = getStageStatus(index)
              const isActive = stageStatus === 'current'
              
              return (
                <motion.div
                  key={stage.key}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Node */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 ${getStageStyles(stageStatus)}`}
                  >
                    {stageStatus === 'completed' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : stageStatus === 'defeated' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center max-w-[140px]">
                    <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {stage.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {stage.description}
                    </p>
                    {stageDates[stage.key] && (
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(stageDates[stage.key])}
                      </p>
                    )}
                    {isActive && stage.key === 'select_committee' && submissionDeadline && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Submissions close {formatDate(submissionDeadline)}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-1">
            {STAGES.map((_, index) => (
              <div
                key={index}
                className={`w-full ${getLineStyles(index)}`}
                style={{ height: `${100 / STAGES.length}%` }}
              />
            ))}
          </div>

          {/* Stage Nodes */}
          <div className="space-y-6">
            {STAGES.map((stage, index) => {
              const stageStatus = getStageStatus(index)
              const isActive = stageStatus === 'current'
              
              return (
                <motion.div
                  key={stage.key}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Node */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 flex-shrink-0 ${getStageStyles(stageStatus)}`}
                  >
                    {stageStatus === 'completed' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : stageStatus === 'defeated' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {stage.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {stage.description}
                    </p>
                    {stageDates[stage.key] && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(stageDates[stage.key])}
                      </p>
                    )}
                    {isActive && stage.key === 'select_committee' && submissionDeadline && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Submissions close {formatDate(submissionDeadline)}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      {getActionPrompt(activeIndex, submissionDeadline, status)}
    </div>
  )
}

function getActionPrompt(currentIndex: number, submissionDeadline?: string, status?: string) {
  const isOpen = status === 'open' || status === 'closing_soon'
  
  if (currentIndex === 1 && isOpen && submissionDeadline) {
    const daysLeft = Math.ceil((new Date(submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">
              Submissions are open!
            </p>
            <p className="text-sm text-green-700 mt-1">
              {daysLeft > 0 
                ? `You have ${daysLeft} day${daysLeft === 1 ? '' : 's'} to make your voice heard.`
                : 'Submissions close today!'
              }
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (status === 'passed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-slate-800">
              This bill has passed
            </p>
            <p className="text-sm text-slate-600 mt-1">
              It has received Royal Assent and is now law.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (status === 'defeated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-800">
              This bill was defeated
            </p>
            <p className="text-sm text-red-700 mt-1">
              It did not pass Parliament and will not become law.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}
