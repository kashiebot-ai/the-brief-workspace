'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear'
        }}
      />
    </div>
  )
}

export function MPSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header skeleton */}
      <div className="h-24 bg-gray-200 relative">
        <div className="absolute -bottom-12 left-8">
          <div className="w-24 h-24 bg-gray-300 rounded-2xl animate-pulse" />
        </div>
      </div>

      <div className="pt-16 pb-8 px-8">
        {/* Name skeleton */}
        <div className="w-64 h-10 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="flex gap-3 mb-6">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-32 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Contact info skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div className="w-40 h-4 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div className="w-40 h-4 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Voting history skeleton */}
        <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="w-full h-6 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="w-full h-4 bg-gray-200 rounded mb-1 animate-pulse" />
      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}
