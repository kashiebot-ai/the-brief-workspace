import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { confirmSubscriber, markWelcomeEmailSent } from '@/lib/newsletter'
import { sendWelcomeEmail } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// Validation schema
const confirmSchema = z.object({
  token: z.string().min(10, 'Invalid confirmation token'),
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
    const validationResult = confirmSchema.safeParse({ token })
    if (!validationResult.success || !token) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/error?message=${encodeURIComponent('Invalid confirmation link.')}`,
        { status: 302 }
      )
    }

    // Confirm subscriber
    const result = await confirmSubscriber(token)

    if (result.success && result.subscriber) {
      // Send welcome email
      try {
        const emailResult = await sendWelcomeEmail(result.subscriber)
        if (emailResult.success) {
          await markWelcomeEmailSent(result.subscriber._id!)
        }
      } catch (emailError) {
        // Log but don't fail the confirmation
        console.error('Failed to send welcome email:', emailError)
      }

      // Redirect to success page
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return NextResponse.redirect(
        `${baseUrl}/newsletter/confirmed`,
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
    console.error('Newsletter confirmation error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      `${baseUrl}/newsletter/error?message=${encodeURIComponent('Something went wrong. Please try again.')}`,
      { status: 302 }
    )
  }
}
