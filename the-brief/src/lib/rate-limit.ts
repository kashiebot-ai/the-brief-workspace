import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

// Rate limiters for different endpoints
const rateLimiters = {
  // Newsletter signup: 5 attempts per 15 minutes per IP
  newsletterSignup: new RateLimiterMemory({
    keyPrefix: 'newsletter_signup',
    points: 5,
    duration: 15 * 60, // 15 minutes
  }),
  
  // Confirmation/unsubscribe: 10 attempts per 5 minutes per IP
  newsletterConfirm: new RateLimiterMemory({
    keyPrefix: 'newsletter_confirm',
    points: 10,
    duration: 5 * 60, // 5 minutes
  }),
  
  // General API: 100 requests per minute per IP
  general: new RateLimiterMemory({
    keyPrefix: 'general_api',
    points: 100,
    duration: 60, // 1 minute
  }),
}

// Rate limit result
export interface RateLimitResult {
  allowed: boolean
  remainingPoints: number
  msBeforeNext: number
  error?: string
}

// Check rate limit
export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimiters = 'general'
): Promise<RateLimitResult> {
  const limiter = rateLimiters[type]
  
  try {
    const res = await limiter.consume(identifier)
    
    return {
      allowed: true,
      remainingPoints: res.remainingPoints,
      msBeforeNext: res.msBeforeNext,
    }
  } catch (rejRes) {
    if (rejRes instanceof RateLimiterRes) {
      return {
        allowed: false,
        remainingPoints: 0,
        msBeforeNext: rejRes.msBeforeNext,
        error: 'Rate limit exceeded. Please try again later.',
      }
    }
    
    // Unknown error, allow the request but log it
    console.error('Rate limiter error:', rejRes)
    return {
      allowed: true,
      remainingPoints: 0,
      msBeforeNext: 0,
    }
  }
}

// Get client IP from request
export function getClientIp(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback - in production, this would come from the connection
  // For now, return a placeholder that should be replaced by the hosting platform
  return 'unknown'
}

// Blocked email patterns (disposable emails, etc.)
const blockedDomains = [
  'tempmail.com',
  'throwaway.com',
  'mailinator.com',
  'guerrillamail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  '10minutemail.com',
  'burnermail.io',
  'temp-mail.org',
]

// Check if email is from a blocked domain
export function isBlockedEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return true
  
  return blockedDomains.some(blocked => domain.includes(blocked))
}

// Email validation regex (more comprehensive)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  return emailRegex.test(email)
}
