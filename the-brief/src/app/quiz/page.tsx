'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QUESTIONS, calculateResults, QuizResult } from '@/lib/quiz-data'

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  const handleAnswer = (value: number) => {
    setIsAnimating(true)
    
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }))

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setIsAnimating(false)
      } else {
        // Calculate results
        const finalResults = calculateResults({
          ...answers,
          [question.id]: value
        })
        setResult(finalResults)
        setIsAnimating(false)
      }
    }, 300)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  // Results view
  if (result) {
    return (
      <section className="py-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your VoteFinder Results
            </h1>
            <p className="text-lg text-gray-600">
              Based on your answers, here&apos;s which party aligns most with your values
            </p>
          </div>

          {/* Primary Match */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 text-center">
            <p className="text-indigo-100 mb-2 text-sm uppercase tracking-wide">Your Top Match</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{result.primaryMatch}</h2>
            <div className="text-6xl font-bold mb-4">{result.percentages[result.primaryMatch]}%</div>
            <p className="text-indigo-100 max-w-lg mx-auto">{result.description}</p>
          </div>

          {/* Secondary Match */}
          {result.secondaryMatch && (
            <div className="bg-gray-100 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-600 mb-2">Also matches with</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {result.secondaryMatch} ({result.percentages[result.secondaryMatch]}%)
              </h3>
            </div>
          )}

          {/* All Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How you match with all parties</h3>
            <div className="space-y-3">
              {Object.entries(result.percentages)
                .sort(([,a], [,b]) => b - a)
                .map(([party, percentage]) => (
                  <div key={party} className="flex items-center">
                    <span className="w-32 text-sm font-medium text-gray-700">{party}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            party === result.primaryMatch 
                              ? 'bg-indigo-600' 
                              : party === result.secondaryMatch 
                                ? 'bg-indigo-400' 
                                : 'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-sm text-gray-600 text-right">{percentage}%</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Take Quiz Again
            </button>
            <button
              onClick={() => {
                const text = `I matched with ${result.primaryMatch} (${result.percentages[result.primaryMatch]}%) on VoteFinder! Who will you vote for in 2026?`
                navigator.clipboard.writeText(text)
                alert('Results copied to clipboard!')
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Copy Results
            </button>
          </div>

          {/* Share */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Share your results</p>
            <div className="flex justify-center gap-3">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I matched with ${result.primaryMatch} on VoteFinder! Who will you vote for in 2026?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Share on Twitter
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link 
              href="/explainer" 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Learn more about the parties →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Quiz view
  return (
    <section className="py-12 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">VoteFinder Quiz</h1>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} of {QUESTIONS.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {question.question}
            </h2>
            {question.description && (
              <p className="text-gray-600 mb-6">{question.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 ${
                  answers[question.id] === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <span className="font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          
          <Link 
            href="/" 
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Exit Quiz
          </Link>
        </div>
      </div>
    </section>
  )
}
