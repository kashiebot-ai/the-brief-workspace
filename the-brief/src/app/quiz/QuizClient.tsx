'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, calculateResults, QuizResult } from '@/lib/quiz-data'

const SCALE_LABELS = ['Strongly\nDisagree', 'Disagree', 'Neutral', 'Agree', 'Strongly\nAgree']

// Celebration particles component
function CelebrationParticles() {
  const particles = Array.from({ length: 12 })
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'][i % 5],
            left: '50%',
            top: '50%',
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos((i / 12) * Math.PI * 2) * 150,
            y: Math.sin((i / 12) * Math.PI * 2) * 150,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.05,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}

export default function QuizClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [direction, setDirection] = useState(0)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  const handleAnswer = (value: number) => {
    setDirection(1)
    
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }))

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        const finalResults = calculateResults({
          ...answers,
          [question.id]: value
        })
        setResult(finalResults)
      }
    }, 300)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const restartQuiz = () => {
    setDirection(-1)
    setTimeout(() => {
      setCurrentQuestion(0)
      setAnswers({})
      setResult(null)
    }, 300)
  }

  // Results view
  if (result) {
    return (
      <section className="py-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your VoteFinder Results
            </h1>
            <p className="text-lg text-gray-600">
              Based on your answers, here&apos;s which party aligns most with your values
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 text-center overflow-hidden"
          >
            <CelebrationParticles />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-indigo-100 mb-2 text-sm uppercase tracking-wide"
            >
              Your Top Match
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {result.primaryMatch}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
              className="text-6xl font-bold mb-4"
            >
              {result.percentages[result.primaryMatch]}%
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-indigo-100 max-w-lg mx-auto"
            >
              {result.description}
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {result.secondaryMatch && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gray-100 rounded-xl p-6 mb-8 text-center"
              >
                <p className="text-gray-600 mb-2">Also matches with</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {result.secondaryMatch} ({result.percentages[result.secondaryMatch]}%)
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How you match with all parties</h3>
            <div className="space-y-3">
              {Object.entries(result.percentages)
                .sort(([,a], [,b]) => b - a)
                .map(([party, percentage], index) => (
                  <motion.div 
                    key={party} 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <span className="w-32 text-sm font-medium text-gray-700">{party}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${
                            party === result.primaryMatch 
                              ? 'bg-indigo-600' 
                              : party === result.secondaryMatch 
                                ? 'bg-indigo-400' 
                                : 'bg-gray-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 1.2 + index * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-sm text-gray-600 text-right">{percentage}%</span>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={restartQuiz}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              Take Quiz Again
            </motion.button>
            <motion.button
              onClick={() => {
                const text = `I matched with ${result.primaryMatch} (${result.percentages[result.primaryMatch]}%) on VoteFinder! Who will you vote for in 2026?`
                navigator.clipboard.writeText(text)
                alert('Results copied to clipboard!')
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Copy Results
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600 mb-4">Share your results</p>
            <div className="flex justify-center gap-3">
              <motion.a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I matched with ${result.primaryMatch} on VoteFinder! Who will you vote for in 2026?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Share on Twitter
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            className="mt-12 text-center"
          >
            <Link 
              href="/explainer" 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Learn more about the parties →
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  // Quiz view - Horizontal Likert Scale
  return (
    <section className="py-8 md:py-16 min-h-screen flex flex-col justify-center pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Progress */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-2">
            <motion.span 
              key={`q-${currentQuestion}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-gray-500 uppercase tracking-wide"
            >
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </motion.span>
            <motion.span 
              key={`p-${currentQuestion}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-gray-400"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Question */}
            <div className="text-center mb-10 md:mb-14">
              <motion.h2 
                className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {question.question}
              </motion.h2>
              {question.description && (
                <motion.p 
                  className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {question.description}
                </motion.p>
              )}
            </div>

            {/* Horizontal Likert Scale */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Scale with aligned dots and labels */}
              <div className="relative">
                {/* Dots row */}
                <div className="flex justify-between items-center mb-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.value
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center focus:outline-none"
                        style={{ width: '20%' }}
                      >
                        {/* Radio circle */}
                        <motion.div 
                          className={`
                            w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'border-indigo-600 bg-indigo-600' 
                              : 'border-gray-300 bg-white hover:border-indigo-400'
                            }
                          `}
                          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          {isSelected && (
                            <motion.div 
                              className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Labels row - aligned with dots */}
                <div className="flex justify-between">
                  {SCALE_LABELS.map((label, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(question.options[index].value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        text-center text-xs md:text-sm font-medium transition-colors whitespace-pre-line leading-tight
                        ${answers[question.id] === question.options[index].value
                          ? 'text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                      style={{ width: '20%' }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Connection line (desktop only) */}
              <div className="hidden md:block mt-6 px-[10%]">
                <div className="relative h-1 bg-gray-200 rounded-full">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: answers[question.id] 
                        ? `${((answers[question.id] - 1) / 4) * 100}%` 
                        : '0%' 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between mt-8 md:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </motion.button>
          
          <Link 
            href="/" 
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Exit
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
