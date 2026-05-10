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
    question: 'We should make housing more affordable, even if property investors pay higher taxes.',
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
    question: 'We should take stronger action on climate change, even if it affects farming and other industries.',
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
    question: 'We should pay less tax, even if it means cutting back on public services like hospitals and schools.',
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
    question: 'Māori communities should have a direct say in decisions that affect their people and resources.',
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
    question: 'We should reduce immigration to ease pressure on housing and roads.',
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
    question: 'People should have more private healthcare options if they want them.',
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
    question: 'People on benefits should get more money so they can afford basic necessities.',
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
    question: 'We need harsher punishments and more police to tackle crime, even if it costs more.',
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
    question: 'University and trade training should be free for everyone.',
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
    question: 'Foreign companies should be restricted from buying New Zealand land and important assets.',
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
    question: 'The Treaty of Waitangi should guide all government decisions.',
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
    question: 'Everyone should afford the medicine they need, even if we pay more tax.',
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
    question: 'The government should invest more in rural towns and regions, not just big cities.',
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
    question: 'We should put a price on carbon emissions, even if it makes petrol and power more expensive.',
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
    question: 'Workers should have stronger protections and union rights, even if it costs businesses more.',
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
    question: 'We should spend more on defence to stay safe in an uncertain world.',
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
    question: 'Clean water and pipes should be managed by central government, not local councils.',
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
    question: 'We should make it harder for young people to start smoking.',
    description: 'The previous Labour government passed a law banning tobacco sales to those born after 2008; the current National-led government has repealed it.',
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
    question: 'Overseas buyers should be banned from buying existing homes here.',
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
    question: 'The government should be smaller and let people and businesses make more decisions.',
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
    question: 'Privately run but publicly funded schools should be an option alongside state schools.',
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
    question: 'Police should have more powers to target gangs, including banning gang patches in public.',
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
    question: 'Public transport should be cheap or free to get more people using it.',
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
    question: 'We should stop letting companies drill for new oil and gas.',
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
    question: 'People should have to wait longer than 65 to get the pension.',
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
    'Labour': 'Your values align with Labour\'s focus on workers\' rights, social investment, and a balanced approach to the economy. You believe government has a role in ensuring fair wages, protecting the vulnerable, and investing in public services like health and education.',
    'National': 'Your values align with National\'s centre-right approach to economic management. You prioritise business growth, individual responsibility, and fiscal discipline. You believe lower taxes and less regulation create opportunities for all New Zealanders.',
    'Greens': 'Your values align strongly with the Greens\' focus on climate action, social justice, and systemic change. You believe in bold environmental policies, reducing inequality, and ensuring Māori rights and tikanga are respected.',
    'ACT': 'Your values align with ACT\'s libertarian philosophy. You believe in personal freedom, smaller government, lower taxes, and free markets. You think individuals should have more choice in education, healthcare, and how they live their lives.',
    'NZ First': 'Your values align with NZ First\'s populist, nationalist approach. You prioritise New Zealand sovereignty, want immigration carefully managed, and believe government should focus on Kiwi citizens first, especially in regional areas.',
    'Te Pati Maori': 'Your values align with Te Pati Māori\'s focus on indigenous rights, tino rangatiratanga, and social equity. You believe in Māori self-determination, challenging colonial systems, and addressing structural inequality.'
  }
  
  return {
    primaryMatch,
    secondaryMatch,
    percentages,
    description: descriptions[primaryMatch] || 'Your views align with multiple parties.'
  }
}
