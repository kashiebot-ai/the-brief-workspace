// VoteFinder Quiz Data - NZ Political Values Quiz
// 20 questions covering key political issues for 2026 NZ Election

export interface Question {
  id: string
  question: string
  description?: string
  options: {
    label: string
    value: number
    parties: string[] // Parties that align with this position
  }[]
}

export interface QuizResult {
  primaryMatch: string
  secondaryMatch?: string
  percentages: Record<string, number>
  description: string
}

// NZ Political Parties
export const PARTIES = [
  'Labour',
  'National', 
  'Greens',
  'ACT',
  'NZ First',
  'Te Pati Maori'
] as const

// 20 Values-Based Questions
export const QUESTIONS: Question[] = [
  {
    id: 'housing-affordability',
    question: 'Housing affordability should be the government\'s top priority, even if it means increasing taxes on property investors.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Labour', 'Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'climate-action',
    question: 'New Zealand should take stronger climate action, even if it costs jobs in traditional industries like farming.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'tax-cuts',
    question: 'Taxes should be cut across the board, even if it means reducing government spending on social services.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT', 'National'] },
      { label: 'Agree', value: 4, parties: ['National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Labour'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Labour', 'Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'co-governance',
    question: 'Māori should have guaranteed co-governance rights over resources and decisions affecting their communities.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Te Pati Maori', 'Greens'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Te Pati Maori'] },
      { label: 'Neutral', value: 3, parties: ['NZ First', 'Greens'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'immigration',
    question: 'Immigration levels should be reduced to ease pressure on housing and infrastructure.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['NZ First', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['NZ First'] },
      { label: 'Neutral', value: 3, parties: ['National'] },
      { label: 'Disagree', value: 2, parties: ['Labour'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'Labour', 'Greens'] }
    ]
  },
  {
    id: 'healthcare-privatization',
    question: 'Private healthcare options should be expanded to reduce pressure on the public system.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT', 'National'] },
      { label: 'Agree', value: 4, parties: ['National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Labour'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Labour', 'Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'benefits-increase',
    question: 'Welfare benefits should be significantly increased to ensure everyone can afford basic necessities.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'law-order',
    question: 'Tougher sentencing and more police are needed to address rising crime, even if it costs more.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT', 'National', 'NZ First'] },
      { label: 'Agree', value: 4, parties: ['National', 'NZ First'] },
      { label: 'Neutral', value: 3, parties: ['Labour'] },
      { label: 'Disagree', value: 2, parties: ['Greens'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'free-education',
    question: 'University and tertiary education should be free for all New Zealanders.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'foreign-investment',
    question: 'Foreign companies should be restricted from buying NZ land and strategic assets.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['NZ First', 'Te Pati Maori', 'Greens'] },
      { label: 'Agree', value: 4, parties: ['NZ First', 'Labour'] },
      { label: 'Neutral', value: 3, parties: ['Greens'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'treaty-principles',
    question: 'The Treaty of Waitangi principles should be embedded in all government decision-making.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Te Pati Maori', 'Greens', 'Labour'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'pharmac-budget',
    question: 'Pharmac\'s budget should be increased, even if it means raising taxes or cutting other spending.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Labour', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['ACT'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT'] }
    ]
  },
  {
    id: 'regional-development',
    question: 'Government should invest more in regional development, not just focus on Auckland and Wellington.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['NZ First', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['National', 'NZ First'] },
      { label: 'Neutral', value: 3, parties: ['Labour'] },
      { label: 'Disagree', value: 2, parties: ['ACT'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT'] }
    ]
  },
  {
    id: 'carbon-tax',
    question: 'A carbon tax is the best way to reduce emissions, even if it increases fuel and energy prices.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens'] },
      { label: 'Agree', value: 4, parties: ['Greens', 'Labour'] },
      { label: 'Neutral', value: 3, parties: ['National'] },
      { label: 'Disagree', value: 2, parties: ['NZ First'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'worker-rights',
    question: 'Worker protections and union rights should be strengthened, even if it makes business more expensive.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Labour', 'Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'defence-spending',
    question: 'Defence spending should be increased to meet global security challenges.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['National', 'ACT'] },
      { label: 'Agree', value: 4, parties: ['National'] },
      { label: 'Neutral', value: 3, parties: ['Labour', 'NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Greens'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'three-waters',
    question: 'Water infrastructure should be managed by central government entities, not local councils.',
    description: 'The previous government created centralised water entities; the current government is restoring council control.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Labour', 'Greens'] },
      { label: 'Agree', value: 4, parties: ['Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['National', 'ACT'] }
    ]
  },
  {
    id: 'smoking-ban',
    question: 'The phased smoking ban (prohibiting tobacco sales to those born after 2008) should be implemented.',
    description: 'The previous Labour government passed this law; the current National-led government has repealed it.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Labour', 'Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['National', 'ACT'] }
    ]
  },
  {
    id: 'overseas-buyers',
    question: 'Overseas buyers should be banned from purchasing existing NZ homes.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['NZ First', 'Te Pati Maori', 'Labour'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['National'] },
      { label: 'Disagree', value: 2, parties: ['ACT'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT'] }
    ]
  },
  {
    id: 'government-size',
    question: 'The government should be smaller and do less, leaving more to individuals and businesses.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT'] },
      { label: 'Agree', value: 4, parties: ['ACT', 'National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Labour', 'National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Labour', 'Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'charter-schools',
    question: 'Charter schools (privately operated but publicly funded) should be expanded as an alternative to state schools.',
    description: 'Charter schools were introduced in 2014, cancelled by Labour in 2018, and reintroduced by the current government in 2024.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT', 'National'] },
      { label: 'Agree', value: 4, parties: ['National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Labour'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Labour', 'Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'gang-legislation',
    question: 'Police should have greater powers to target gang members, including banning gang patches in public.',
    description: 'The current government has introduced legislation banning gang patches and allowing warrantless searches of gang members.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT', 'National'] },
      { label: 'Agree', value: 4, parties: ['National', 'NZ First'] },
      { label: 'Neutral', value: 3, parties: ['Labour'] },
      { label: 'Disagree', value: 2, parties: ['Greens'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Greens', 'Te Pati Maori'] }
    ]
  },
  {
    id: 'public-transport',
    question: 'Public transport should be heavily subsidised or free to encourage use and reduce emissions.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'oil-gas-exploration',
    question: 'New oil and gas exploration permits should be banned to meet climate targets.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['Greens', 'Te Pati Maori'] },
      { label: 'Agree', value: 4, parties: ['Labour', 'Greens'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['ACT', 'National'] }
    ]
  },
  {
    id: 'superannuation-age',
    question: 'The age for receiving NZ Superannuation (pension) should be increased from 65.',
    options: [
      { label: 'Strongly Agree', value: 5, parties: ['ACT'] },
      { label: 'Agree', value: 4, parties: ['ACT', 'National'] },
      { label: 'Neutral', value: 3, parties: ['NZ First'] },
      { label: 'Disagree', value: 2, parties: ['Labour', 'National'] },
      { label: 'Strongly Disagree', value: 1, parties: ['Labour', 'Greens', 'Te Pati Maori'] }
    ]
  }
]

// Calculate quiz results based on answers
export function calculateResults(answers: Record<string, number>): QuizResult {
  const partyScores: Record<string, number> = {}
  
  // Initialize scores
  PARTIES.forEach(party => partyScores[party] = 0)
  
  // Tally scores
  Object.entries(answers).forEach(([questionId, answerValue]) => {
    const question = QUESTIONS.find(q => q.id === questionId)
    if (!question) return
    
    const selectedOption = question.options.find(o => o.value === answerValue)
    if (!selectedOption) return
    
    selectedOption.parties.forEach(party => {
      partyScores[party] = (partyScores[party] || 0) + answerValue
    })
  })
  
  // Calculate percentages
  const maxPossible = Object.keys(answers).length * 5 // 5 is max value per question
  const percentages: Record<string, number> = {}
  
  Object.entries(partyScores).forEach(([party, score]) => {
    percentages[party] = Math.round((score / maxPossible) * 100)
  })
  
  // Find top match
  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1])
  const primaryMatch = sorted[0][0]
  const secondaryMatch = sorted[1][0]
  
  // Generate description
  const descriptions: Record<string, string> = {
    'Labour': 'You align with Labour\'s focus on social welfare, workers\' rights, and moderate progressivism.',
    'National': 'You align with National\'s centre-right approach to economic management and law and order.',
    'Greens': 'You align with the Greens\' focus on environmental action, social justice, and progressive policies.',
    'ACT': 'You align with ACT\'s libertarian approach to lower taxes, smaller government, and personal freedom.',
    'NZ First': 'You align with NZ First\'s populist, nationalist approach focusing on NZ sovereignty and regional issues.',
    'Te Pati Maori': 'You align with Te Pati Maori\'s focus on indigenous rights, co-governance, and social equity.'
  }
  
  return {
    primaryMatch,
    secondaryMatch,
    percentages,
    description: descriptions[primaryMatch] || 'Your views align with multiple parties.'
  }
}
