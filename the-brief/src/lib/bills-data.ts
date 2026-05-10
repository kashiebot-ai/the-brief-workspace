/**
 * Bills Data Library
import type { PortableTextBlock } from @portabletext/types

 * 
 * This library provides types and functions for managing bills
 * open for public submission at New Zealand Parliament.
 * 
 * Note: Due to lack of Parliament API, data is manually curated
 * via Sanity CMS and cached for performance.
 */

// Bill status types
export type BillStatus = 'open' | 'closing_soon' | 'closed' | 'passed' | 'defeated'

// Bill category types
export type BillCategory = 
  | 'environment'
  | 'health'
  | 'transport'
  | 'housing'
  | 'education'
  | 'justice'
  | 'economy'
  | 'technology'
  | 'social'
  | 'other'

// Stance options for submissions
export type SubmissionStance = 'support' | 'oppose' | 'neutral' | 'mixed'

// Select committee types
export type SelectCommittee =
  | 'environment'
  | 'health'
  | 'transport'
  | 'social_services'
  | 'justice'
  | 'education'
  | 'economic_development'
  | 'primary_production'
  | 'governance'
  | 'māori_affairs'
  | 'other'

// Main Bill interface
export interface Bill {
  _id: string
  _type: 'bill'
  title: string
  shortTitle: string
  slug: {
    current: string
  }
  description: string
  summary?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  keyPoints: string[]
  
  // Metadata
  billNumber?: string
  category: BillCategory
  committee: SelectCommittee
  status: BillStatus
  
  // Dates
  submissionDeadline: string // ISO date
  introducedDate?: string
  firstReadingDate?: string
  selectCommitteeDate?: string
  secondReadingDate?: string
  committeeWholeDate?: string
  thirdReadingDate?: string
  royalAssentDate?: string
  
  // Stage tracking
  currentStage?: 'first_reading' | 'select_committee' | 'second_reading' | 'committee_whole' | 'third_reading' | 'royal_assent'
  
  // URLs
  parliamentUrl: string
  legislationUrl?: string
  submissionUrl: string
  
  // Content
  fullText?: string // Optional full bill text
  impactStatement?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  regulatoryImpact?: string
  
  // Management
  publishedAt: string
  lastUpdated: string
  featured: boolean
  
  // Submission stats (if available)
  submissionCount?: number
}

// Submission template interface
export interface SubmissionTemplate {
  _id: string
  _type: 'submissionTemplate'
  title: string
  category: BillCategory
  stance: SubmissionStance
  
  // Template content
  introduction: string
  bodyParagraphs: string[]
  conclusion: string
  
  // Prompts for customization
  prompts: {
    question: string
    hint: string
    required: boolean
  }[]
}

// User's draft submission
export interface DraftSubmission {
  billId: string
  stance: SubmissionStance
  customPoints: string[]
  personalStory?: string
  fullName: string
  email: string
  organisation?: string
  
  // Generated content
  generatedText?: string
  
  // Status
  createdAt: string
  lastEdited: string
  completed: boolean
}

// Category configuration
export interface CategoryConfig {
  id: BillCategory
  label: string
  description: string
  color: string
  icon: string
}

// Committee configuration
export interface CommitteeConfig {
  id: SelectCommittee
  name: string
  description: string
  parliamentUrl: string
}

// ============================================================================
// CATEGORY CONFIGURATIONS
// ============================================================================

export const BILL_CATEGORIES: CategoryConfig[] = [
  {
    id: 'environment',
    label: 'Environment',
    description: 'Climate change, conservation, resource management',
    color: 'bg-green-100 text-green-800',
    icon: 'Leaf'
  },
  {
    id: 'health',
    label: 'Health',
    description: 'Healthcare, public health, medical regulation',
    color: 'bg-red-100 text-red-800',
    icon: 'Heart'
  },
  {
    id: 'transport',
    label: 'Transport',
    description: 'Roads, public transport, aviation, maritime',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Car'
  },
  {
    id: 'housing',
    label: 'Housing',
    description: 'Housing policy, building standards, tenancy',
    color: 'bg-amber-100 text-amber-800',
    icon: 'Home'
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Schools, tertiary education, training',
    color: 'bg-purple-100 text-purple-800',
    icon: 'GraduationCap'
  },
  {
    id: 'justice',
    label: 'Justice',
    description: 'Courts, police, corrections, legal system',
    color: 'bg-slate-100 text-slate-800',
    icon: 'Scale'
  },
  {
    id: 'economy',
    label: 'Economy',
    description: 'Taxation, business, employment, trade',
    color: 'bg-emerald-100 text-emerald-800',
    icon: 'TrendingUp'
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Digital services, privacy, cybersecurity',
    color: 'bg-cyan-100 text-cyan-800',
    icon: 'Cpu'
  },
  {
    id: 'social',
    label: 'Social Services',
    description: 'Welfare, community services, families',
    color: 'bg-pink-100 text-pink-800',
    icon: 'Users'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other legislative matters',
    color: 'bg-gray-100 text-gray-800',
    icon: 'FileText'
  }
]

// ============================================================================
// COMMITTEE CONFIGURATIONS
// ============================================================================

export const SELECT_COMMITTEES: CommitteeConfig[] = [
  {
    id: 'environment',
    name: 'Environment Committee',
    description: 'Conservation, climate change, environment',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/environment'
  },
  {
    id: 'health',
    name: 'Health Committee',
    description: 'Health services and policy',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/health'
  },
  {
    id: 'transport',
    name: 'Transport and Infrastructure Committee',
    description: 'Transport, infrastructure, local government',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/transport'
  },
  {
    id: 'social_services',
    name: 'Social Services and Community Committee',
    description: 'Social development, housing, community',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/social'
  },
  {
    id: 'justice',
    name: 'Justice Committee',
    description: 'Justice, courts, electoral matters',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/justice'
  },
  {
    id: 'education',
    name: 'Education and Workforce Committee',
    description: 'Education, training, employment',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/education'
  },
  {
    id: 'economic_development',
    name: 'Economic Development, Science and Innovation Committee',
    description: 'Economic development, science, innovation',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/economic'
  },
  {
    id: 'primary_production',
    name: 'Primary Production Committee',
    description: 'Agriculture, fisheries, forestry',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/primary'
  },
  {
    id: 'governance',
    name: 'Governance and Administration Committee',
    description: 'Parliamentary services, state services',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/governance'
  },
  {
    id: 'māori_affairs',
    name: 'Māori Affairs Committee',
    description: 'Māori development, Treaty issues',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc/maori'
  },
  {
    id: 'other',
    name: 'Other Committee',
    description: 'Other select committees',
    parliamentUrl: 'https://www.parliament.nz/en/pb/sc'
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the status of a bill based on its submission deadline
 */
export function getBillStatus(deadline: string): BillStatus {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntil < 0) return 'closed'
  if (daysUntil <= 7) return 'closing_soon'
  return 'open'
}

/**
 * Format the deadline display
 */
export function formatDeadline(deadline: string): {
  text: string
  isUrgent: boolean
  daysRemaining: number
} {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysRemaining < 0) {
    return { text: 'Submissions closed', isUrgent: false, daysRemaining: 0 }
  }
  
  if (daysRemaining === 0) {
    return { text: 'Closes today!', isUrgent: true, daysRemaining: 0 }
  }
  
  if (daysRemaining === 1) {
    return { text: '1 day remaining', isUrgent: true, daysRemaining: 1 }
  }
  
  if (daysRemaining <= 7) {
    return { text: `${daysRemaining} days remaining`, isUrgent: true, daysRemaining }
  }
  
  return { text: `${daysRemaining} days remaining`, isUrgent: false, daysRemaining }
}

/**
 * Get category configuration
 */
export function getCategoryConfig(categoryId: BillCategory): CategoryConfig {
  return BILL_CATEGORIES.find(c => c.id === categoryId) || BILL_CATEGORIES[BILL_CATEGORIES.length - 1]
}

/**
 * Get committee configuration
 */
export function getCommitteeConfig(committeeId: SelectCommittee): CommitteeConfig {
  return SELECT_COMMITTEES.find(c => c.id === committeeId) || SELECT_COMMITTEES[SELECT_COMMITTEES.length - 1]
}

/**
 * Filter bills by category
 */
export function filterBillsByCategory(bills: Bill[], category: BillCategory | 'all'): Bill[] {
  if (category === 'all') return bills
  return bills.filter(bill => bill.category === category)
}

/**
 * Sort bills by urgency (closing soon first)
 */
export function sortBillsByUrgency(bills: Bill[]): Bill[] {
  return [...bills].sort((a, b) => {
    const aStatus = getBillStatus(a.submissionDeadline)
    const bStatus = getBillStatus(b.submissionDeadline)
    
    // Status priority: closing_soon > open > closed
    const priority = { closing_soon: 0, open: 1, closed: 2, passed: 3, defeated: 4 }
    
    if (priority[aStatus] !== priority[bStatus]) {
      return priority[aStatus] - priority[bStatus]
    }
    
    // Within same status, sort by deadline
    return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime()
  })
}

/**
 * Generate submission text from template and user inputs
 */
export function generateSubmissionText(
  template: SubmissionTemplate,
  draft: DraftSubmission
): string {
  const parts: string[] = []
  
  // Introduction
  parts.push(template.introduction)
  parts.push('')
  
  // Personal story (if provided)
  if (draft.personalStory) {
    parts.push('Personal Perspective:')
    parts.push(draft.personalStory)
    parts.push('')
  }
  
  // Custom points
  if (draft.customPoints.length > 0) {
    parts.push('Key Points:')
    draft.customPoints.forEach((point, index) => {
      parts.push(`${index + 1}. ${point}`)
    })
    parts.push('')
  }
  
  // Template body paragraphs
  template.bodyParagraphs.forEach(paragraph => {
    parts.push(paragraph)
    parts.push('')
  })
  
  // Conclusion
  parts.push(template.conclusion)
  
  return parts.join('\n')
}

// ============================================================================
// SANITY QUERIES
// ============================================================================

// Helper to determine current stage from bill data
export function getCurrentStage(bill: Bill): string {
  if (bill.royalAssentDate) return 'third_reading'
  if (bill.thirdReadingDate) return 'third_reading'
  if (bill.committeeWholeDate) return 'committee_whole'
  if (bill.secondReadingDate) return 'second_reading'
  if (bill.selectCommitteeDate || bill.submissionDeadline) return 'select_committee'
  if (bill.firstReadingDate || bill.introducedDate) return 'first_reading'
  return 'first_reading'
}

// Helper to get stage dates
export function getStageDates(bill: Bill): Record<string, string> {
  const dates: Record<string, string> = {}
  if (bill.firstReadingDate || bill.introducedDate) dates.first_reading = bill.firstReadingDate || bill.introducedDate || ''
  if (bill.selectCommitteeDate) dates.select_committee = bill.selectCommitteeDate
  if (bill.secondReadingDate) dates.second_reading = bill.secondReadingDate
  if (bill.committeeWholeDate) dates.committee_whole = bill.committeeWholeDate
  if (bill.thirdReadingDate) dates.third_reading = bill.thirdReadingDate
  if (bill.royalAssentDate) dates.royal_assent = bill.royalAssentDate
  return dates
}

// Query for all published bills
export const allBillsQuery = `*[_type == "bill"] | order(lastUpdated desc) {
  _id,
  _type,
  title,
  shortTitle,
  slug,
  description,
  summary,
  keyPoints,
  billNumber,
  category,
  committee,
  status,
  submissionDeadline,
  introducedDate,
  firstReadingDate,
  selectCommitteeDate,
  secondReadingDate,
  committeeWholeDate,
  thirdReadingDate,
  royalAssentDate,
  parliamentUrl,
  legislationUrl,
  submissionUrl,
  impactStatement,
  regulatoryImpact,
  publishedAt,
  lastUpdated,
  featured,
  submissionCount
}`

// Query for a single bill by slug
export const billBySlugQuery = (slug: string) => `*[_type == "bill" && slug.current == "${slug}"][0] {
  _id,
  _type,
  title,
  shortTitle,
  slug,
  description,
  summary,
  keyPoints,
  billNumber,
  category,
  committee,
  status,
  submissionDeadline,
  introducedDate,
  firstReadingDate,
  selectCommitteeDate,
  secondReadingDate,
  committeeWholeDate,
  thirdReadingDate,
  royalAssentDate,
  parliamentUrl,
  legislationUrl,
  submissionUrl,
  impactStatement,
  regulatoryImpact,
  publishedAt,
  lastUpdated,
  featured,
  submissionCount
}`

// Query for featured bills
export const featuredBillsQuery = `*[_type == "bill" && featured == true && status == "published"] | order(submissionDeadline asc) {
  _id,
  _type,
  title,
  shortTitle,
  slug,
  description,
  summary,
  keyPoints,
  billNumber,
  category,
  committee,
  status,
  submissionDeadline,
  introducedDate,
  firstReadingDate,
  parliamentUrl,
  legislationUrl,
  submissionUrl,
  impactStatement,
  regulatoryImpact,
  publishedAt,
  lastUpdated,
  featured,
  submissionCount
}`

// ============================================================================
// SCRAPED DATA UTILITIES
