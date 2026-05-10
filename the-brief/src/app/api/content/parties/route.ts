import { NextResponse } from 'next/server'
import { PARTIES, QUESTIONS } from '@/lib/quiz-data'

export async function GET() {
  // Build party profiles based on quiz questions
  const partyProfiles = PARTIES.map(party => {
    // Find all positions this party takes across questions
    const positions = QUESTIONS.map(q => {
      const partyPositions = q.options.filter(o => o.parties.includes(party))
      if (partyPositions.length > 0) {
        return {
          issue: q.id,
          question: q.question,
          stance: partyPositions[0].label,
          value: partyPositions[0].value
        }
      }
      return null
    }).filter(Boolean)

    // Calculate average stance (1-5 scale)
    const avgStance = positions.reduce((sum, p) => sum + (p?.value || 0), 0) / positions.length

    // Determine political spectrum (simplified)
    let spectrum = 'centre'
    if (avgStance >= 4) spectrum = 'progressive'
    if (avgStance <= 2) spectrum = 'conservative'

    return {
      name: party,
      spectrum,
      positionCount: positions.length,
      keyPositions: positions.slice(0, 8) // Top 8 positions
    }
  })

  return NextResponse.json(
    {
      site: 'The Brief',
      description: 'NZ Political Party Positions',
      totalParties: PARTIES.length,
      parties: partyProfiles,
      issuesCovered: QUESTIONS.map(q => ({
        id: q.id,
        question: q.question,
        description: q.description
      }))
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    }
  )
}
