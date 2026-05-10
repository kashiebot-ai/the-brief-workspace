import { Resend } from 'resend'
import { Subscriber } from './newsletter'

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.FROM_EMAIL || 'newsletter@thebrief.nz'
const fromName = process.env.FROM_NAME || 'The Brief'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrief.nz'

const resend = resendApiKey ? new Resend(resendApiKey) : null

// Check if email service is configured
export function isEmailConfigured(): boolean {
  return !!resend && !!fromEmail
}

// Email sending result
export interface EmailResult {
  success: boolean
  message?: string
  error?: unknown
}

// Generate confirmation email HTML
function generateConfirmationEmailHtml(subscriber: Subscriber): string {
  const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${subscriber.confirmationToken}`
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your subscription to The Brief</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #1e3a5f; padding: 30px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1e3a5f; margin-top: 0; }
    .button { display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #4338ca; }
    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .footer a { color: #6b7280; }
    .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Brief</h1>
    </div>
    <div class="content">
      <h2>Confirm your subscription</h2>
      <p>Thanks for signing up for <strong>The Brief</strong> — independent political news for New Zealand, delivered to your inbox every weekday morning.</p>
      <p>Please confirm your email address to start receiving our explainers:</p>
      <center>
        <a href="${confirmUrl}" class="button">Confirm Subscription</a>
      </center>
      <div class="note">
        <strong>Note:</strong> This confirmation link will expire in 7 days. If you didn't sign up for this newsletter, you can safely ignore this email.
      </div>
      <p style="font-size: 14px; color: #6b7280;">
        Or copy and paste this link into your browser:<br>
        <a href="${confirmUrl}" style="color: #4f46e5;">${confirmUrl}</a>
      </p>
    </div>
    <div class="footer">
      <p>The Brief · New Zealand Politics Without the Spin</p>
      <p>You're receiving this because you signed up at <a href="${siteUrl}">thebrief.nz</a></p>
    </div>
  </div>
</body>
</html>`
}

// Generate confirmation email plain text
function generateConfirmationEmailText(subscriber: Subscriber): string {
  const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${subscriber.confirmationToken}`
  
  return `The Brief - Confirm your subscription

Thanks for signing up for The Brief — independent political news for New Zealand, delivered to your inbox every weekday morning.

Please confirm your email address to start receiving our explainers:

${confirmUrl}

Note: This confirmation link will expire in 7 days. If you didn't sign up for this newsletter, you can safely ignore this email.

---
The Brief · New Zealand Politics Without the Spin
You're receiving this because you signed up at ${siteUrl}
`
}

// Generate welcome email HTML
function generateWelcomeEmailHtml(subscriber: Subscriber): string {
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
  const latestUrl = `${siteUrl}/explainer`
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Brief</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #1e3a5f; padding: 30px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1e3a5f; margin-top: 0; }
    .highlight { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
    .highlight h3 { margin-top: 0; color: #1e40af; }
    .highlight ul { margin: 10px 0; padding-left: 20px; }
    .highlight li { margin: 8px 0; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .button:hover { background: #4338ca; }
    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .footer a { color: #4f46e5; }
    .social { margin: 15px 0; }
    .social a { display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Brief</h1>
    </div>
    <div class="content">
      <h2>Welcome to The Brief! 🎉</h2>
      <p>Your subscription is confirmed. You'll now receive our daily political explainers every weekday morning.</p>
      
      <div class="highlight">
        <h3>What to expect</h3>
        <ul>
          <li><strong>One explainer every weekday</strong> — clear, concise analysis of what's happening in NZ politics</li>
          <li><strong>No spin, no jargon</strong> — just facts and context you need to understand the news</li>
          <li><strong>5-minute read</strong> — designed to fit into your morning routine</li>
        </ul>
      </div>

      <div class="cta">
        <a href="${latestUrl}" class="button">Read Latest Explainers</a>
      </div>

      <p>Have questions or feedback? Reply to this email — we read every message.</p>

      <p>Thanks for reading,<br>
      <strong>The Brief Team</strong></p>
    </div>
    <div class="footer">
      <p>The Brief · New Zealand Politics Without the Spin</p>
      <div class="social">
        <a href="https://twitter.com">Twitter</a> · 
        <a href="https://facebook.com">Facebook</a> · 
        <a href="${siteUrl}">Website</a>
      </div>
      <p>
        <a href="${unsubscribeUrl}">Unsubscribe</a> · 
        You're receiving this because you subscribed at ${siteUrl}
      </p>
    </div>
  </div>
</body>
</html>`
}

// Generate welcome email plain text
function generateWelcomeEmailText(subscriber: Subscriber): string {
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
  const latestUrl = `${siteUrl}/explainer`
  
  return `The Brief - Welcome!

Welcome to The Brief! 🎉

Your subscription is confirmed. You'll now receive our daily political explainers every weekday morning.

What to expect:
• One explainer every weekday — clear, concise analysis of what's happening in NZ politics
• No spin, no jargon — just facts and context you need to understand the news
• 5-minute read — designed to fit into your morning routine

Read our latest explainers: ${latestUrl}

Have questions or feedback? Reply to this email — we read every message.

Thanks for reading,
The Brief Team

---
The Brief · New Zealand Politics Without the Spin

Unsubscribe: ${unsubscribeUrl}
You're receiving this because you subscribed at ${siteUrl}
`
}

// Send confirmation email
export async function sendConfirmationEmail(subscriber: Subscriber): Promise<EmailResult> {
  if (!resend) {
    console.error('Resend not configured. Confirmation email not sent to:', subscriber.email)
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: subscriber.email,
      subject: 'Confirm your subscription to The Brief',
      html: generateConfirmationEmailHtml(subscriber),
      text: generateConfirmationEmailText(subscriber),
    })

    if (result.error) {
      console.error('Failed to send confirmation email:', result.error)
      return { success: false, message: 'Failed to send confirmation email', error: result.error }
    }

    console.log('Confirmation email sent to:', subscriber.email)
    return { success: true, message: 'Confirmation email sent' }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return { success: false, message: 'Error sending confirmation email', error }
  }
}

// Send welcome email
export async function sendWelcomeEmail(subscriber: Subscriber): Promise<EmailResult> {
  if (!resend) {
    console.error('Resend not configured. Welcome email not sent to:', subscriber.email)
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: subscriber.email,
      subject: 'Welcome to The Brief',
      html: generateWelcomeEmailHtml(subscriber),
      text: generateWelcomeEmailText(subscriber),
    })

    if (result.error) {
      console.error('Failed to send welcome email:', result.error)
      return { success: false, message: 'Failed to send welcome email', error: result.error }
    }

    console.log('Welcome email sent to:', subscriber.email)
    return { success: true, message: 'Welcome email sent' }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, message: 'Error sending welcome email', error }
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<EmailResult> {
  if (!resend) {
    return { success: false, message: 'Resend API key not configured' }
  }

  try {
    // Just verify the API key is valid by listing domains
    const result = await resend.domains.list()
    
    if (result.error) {
      return { success: false, message: 'Invalid Resend API key', error: result.error }
    }

    // Count domains from the result
    const domainCount = Array.isArray(result.data) ? result.data.length : 0

    return { 
      success: true, 
      message: `Email service configured. ${domainCount} domain(s) found.` 
    }
  } catch (error) {
    return { success: false, message: 'Error testing email configuration', error }
  }
}
