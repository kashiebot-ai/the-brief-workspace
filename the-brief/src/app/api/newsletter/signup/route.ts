import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSubscriber } from '@/lib/newsletter'
import { sendConfirmationEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, isBlockedEmail, isValidEmail } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional().default('footer'),
  gdprConsent: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientIp, 'newsletterSignup')
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimitResult.error || 'Too many attempts. Please try again later.' 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimitResult.msBeforeNext / 1000).toString(),
          }
        }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = subscribeSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ')
      return NextResponse.json(
        { success: false, message: errors },
        { status: 400 }
      )
    }

    const { email, source } = validationResult.data

    // Additional email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check for blocked/disposable emails
    if (isBlockedEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please use a permanent email address' },
        { status: 400 }
      )
    }

    // Get request metadata for compliance
    const userAgent = request.headers.get('user-agent') || undefined
    
    // Create subscriber
    const result = await createSubscriber(email, source, {
      ipAddress: clientIp,
      userAgent,
    })

    // If subscriber was created or updated, send confirmation email
    if (result.success && result.subscriber && result.subscriber.status === 'pending') {
      try {
        await sendConfirmationEmail(result.subscriber)
      } catch (emailError) {
        // Log but don't fail the signup - user can request a new confirmation email
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    // Return success response
    return NextResponse.json(
      { 
        success: result.success, 
        message: result.message,
      },
      { status: result.success ? 200 : 400 }
    )

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
