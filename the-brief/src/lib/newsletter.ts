import { client } from './sanity'
import crypto from 'crypto'

// Token generation helpers
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateTokenExpiry(): string {
  // Token expires in 7 days
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  return expiry.toISOString()
}

// Subscriber types
export interface Subscriber {
  _id?: string
  email: string
  status: 'pending' | 'confirmed' | 'unsubscribed' | 'bounced'
  subscribedAt: string
  confirmedAt?: string
  unsubscribedAt?: string
  source: string
  confirmationToken?: string
  confirmationTokenExpires?: string
  unsubscribeToken?: string
  gdprConsent: boolean
  ipAddress?: string
  userAgent?: string
  welcomeEmailSent: boolean
  welcomeEmailSentAt?: string
}

// Check if subscriber exists
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  if (!client) {
    throw new Error('Sanity client not configured')
  }

  const normalizedEmail = email.toLowerCase().trim()
  
  const query = `*[_type == "subscriber" && email == $email][0]`
  const subscriber = await client.fetch(query, { email: normalizedEmail })
  
  return subscriber || null
}

// Get subscriber by confirmation token
export async function getSubscriberByConfirmationToken(token: string): Promise<Subscriber | null> {
  if (!client) {
    throw new Error('Sanity client not configured')
  }

  const query = `*[_type == "subscriber" && confirmationToken == $token][0]`
  const subscriber = await client.fetch(query, { token } as Record<string, string>)
  
  return subscriber || null
}

// Get subscriber by unsubscribe token
export async function getSubscriberByUnsubscribeToken(token: string): Promise<Subscriber | null> {
  if (!client) {
    throw new Error('Sanity client not configured')
  }

  const query = `*[_type == "subscriber" && unsubscribeToken == $token][0]`
  const subscriber = await client.fetch(query, { token } as Record<string, string>)
  
  return subscriber || null
}

// Create new subscriber
export async function createSubscriber(
  email: string, 
  source: string = 'footer',
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
  if (!client) {
    return { success: false, message: 'Newsletter system is temporarily unavailable.' }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Check for existing subscriber
  const existing = await getSubscriberByEmail(normalizedEmail)
  
  if (existing) {
    if (existing.status === 'confirmed') {
      return { success: false, message: "You're already subscribed to The Brief!" }
    }
    
    if (existing.status === 'pending') {
      // Resend confirmation email for pending subscriber
      return { 
        success: true, 
        message: "You're already signed up! Please check your inbox for the confirmation email.",
        subscriber: existing 
      }
    }

    if (existing.status === 'unsubscribed') {
      // Re-subscribe unsubscribed user - update their record
      const confirmationToken = generateToken()
      const confirmationTokenExpires = generateTokenExpiry()
      
      const updatedSubscriber = await client
        .patch(existing._id!)
        .set({
          status: 'pending',
          subscribedAt: new Date().toISOString(),
          source,
          confirmationToken,
          confirmationTokenExpires,
          gdprConsent: true,
          ...metadata,
        })
        .commit()

      return { 
        success: true, 
        message: "Welcome back! Please check your inbox to confirm your subscription.",
        subscriber: updatedSubscriber as unknown as Subscriber
      }
    }
  }

  // Create new subscriber
  const confirmationToken = generateToken()
  const unsubscribeToken = generateToken()
  const confirmationTokenExpires = generateTokenExpiry()

  const subscriber = await client.create({
    _type: 'subscriber',
    email: normalizedEmail,
    status: 'pending',
    subscribedAt: new Date().toISOString(),
    source,
    confirmationToken,
    confirmationTokenExpires,
    unsubscribeToken,
    gdprConsent: true,
    welcomeEmailSent: false,
    ...metadata,
  })

  return { 
    success: true, 
    message: "Thanks for signing up! Please check your inbox to confirm your subscription.",
    subscriber: subscriber as unknown as Subscriber
  }
}

// Confirm subscriber
export async function confirmSubscriber(token: string): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
  if (!client) {
    return { success: false, message: 'Newsletter system is temporarily unavailable.' }
  }

  const subscriber = await getSubscriberByConfirmationToken(token)
  
  if (!subscriber) {
    return { success: false, message: 'Invalid or expired confirmation link.' }
  }

  if (subscriber.status === 'confirmed') {
    return { success: true, message: 'Your subscription is already confirmed!', subscriber }
  }

  if (subscriber.status === 'unsubscribed') {
    return { success: false, message: 'This email has been unsubscribed. Please sign up again.' }
  }

  // Check if token is expired
  if (subscriber.confirmationTokenExpires && new Date(subscriber.confirmationTokenExpires) < new Date()) {
    // Generate new token and update
    const newToken = generateToken()
    const newExpiry = generateTokenExpiry()
    
    await client
      .patch(subscriber._id!)
      .set({
        confirmationToken: newToken,
        confirmationTokenExpires: newExpiry,
      })
      .commit()

    return { 
      success: false, 
      message: 'This confirmation link has expired. A new confirmation email has been sent.' 
    }
  }

  // Confirm the subscriber
  const confirmedAt = new Date().toISOString()
  const updatedSubscriber = await client
    .patch(subscriber._id!)
    .set({
      status: 'confirmed',
      confirmedAt,
    })
    .commit()

  return { 
    success: true, 
    message: 'Your subscription has been confirmed!',
    subscriber: updatedSubscriber as unknown as Subscriber
  }
}

// Unsubscribe
export async function unsubscribeUser(token: string): Promise<{ success: boolean; message: string }> {
  if (!client) {
    return { success: false, message: 'Newsletter system is temporarily unavailable.' }
  }

  const subscriber = await getSubscriberByUnsubscribeToken(token)
  
  if (!subscriber) {
    return { success: false, message: 'Invalid unsubscribe link.' }
  }

  if (subscriber.status === 'unsubscribed') {
    return { success: true, message: "You're already unsubscribed." }
  }

  await client
    .patch(subscriber._id!)
    .set({
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString(),
    })
    .commit()

  return { success: true, message: "You've been unsubscribed. Sorry to see you go!" }
}

// Mark welcome email as sent
export async function markWelcomeEmailSent(subscriberId: string): Promise<void> {
  if (!client) return

  await client
    .patch(subscriberId)
    .set({
      welcomeEmailSent: true,
      welcomeEmailSentAt: new Date().toISOString(),
    })
    .commit()
}

// Get subscriber stats
export async function getSubscriberStats(): Promise<{
  total: number
  confirmed: number
  pending: number
  unsubscribed: number
}> {
  if (!client) {
    return { total: 0, confirmed: 0, pending: 0, unsubscribed: 0 }
  }

  const query = `{
    "total": count(*[_type == "subscriber"]),
    "confirmed": count(*[_type == "subscriber" && status == "confirmed"]),
    "pending": count(*[_type == "subscriber" && status == "pending"]),
    "unsubscribed": count(*[_type == "subscriber" && status == "unsubscribed"])
  }`

  return await client.fetch(query)
}
