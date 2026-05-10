import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { unsubscribeUser } from '@/lib/newsletter'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// Validation schema
const unsubscribeSchema = z.object({
  token: z.string().min(10, 'Invalid unsubscribe token'),
})

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientIp, 'newsletterConfirm')
    if (!rateLimitResult.allowed) {
      // Redirect to error page with rate limit message
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/error?message=${encodeURIComponent('Too many attempts. Please try again later.')}`,
        { status: 302 }
      )
    }

    // Get token from query params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Validate token
    const validationResult = unsubscribeSchema.safeParse({ token })
    if (!validationResult.success || !token) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/error?message=${encodeURIComponent('Invalid unsubscribe link.')}`,
        { status: 302 }
      )
    }

    // Unsubscribe user
    const result = await unsubscribeUser(token)

    if (result.success) {
      // Redirect to unsubscribe confirmation page
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/unsubscribed`,
        { status: 302 }
      )
    } else {
      // Redirect to error page
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/error?message=${encodeURIComponent(result.message)}`,
        { status: 302 }
      )
    }

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      `${baseUrl}/newsletter/error?message=${encodeURIComponent('Something went wrong. Please try again.')}`,
      { status: 302 }
    )
  }
}
