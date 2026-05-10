# Newsletter System Documentation

## Overview

The Brief newsletter system provides a complete double opt-in subscription flow with Sanity CMS integration, email confirmation, and GDPR compliance.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React Form    │────▶│  API Routes      │────▶│  Sanity CMS     │
│  (Signup/Status)│     │  (Subscribe/     │     │  (Subscribers)  │
└─────────────────┘     │   Confirm/Unsub) │     └─────────────────┘
                        └──────────────────┘              │
                                 │                        │
                                 ▼                        ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │  Resend Email    │     │  Admin Studio   │
                        │  (Confirmation/  │     │  (View/Manage)  │
                        │   Welcome)       │     └─────────────────┘
                        └──────────────────┘
```

## Components

### 1. Sanity CMS Schema

**Document Type: `subscriber`**

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Subscriber email address (unique) |
| `status` | string | `pending`, `confirmed`, `unsubscribed`, `bounced` |
| `subscribedAt` | datetime | When they first signed up |
| `confirmedAt` | datetime | When they confirmed their email |
| `unsubscribedAt` | datetime | When they unsubscribed |
| `source` | string | Where they signed up (footer, homepage, etc.) |
| `confirmationToken` | string | Token for email confirmation |
| `confirmationTokenExpires` | datetime | Token expiry (7 days) |
| `unsubscribeToken` | string | Token for one-click unsubscribe |
| `gdprConsent` | boolean | Whether user gave consent |
| `ipAddress` | string | IP at signup (compliance) |
| `userAgent` | string | Browser info (compliance) |
| `welcomeEmailSent` | boolean | Whether welcome email was sent |

### 2. API Routes

#### POST `/api/newsletter/subscribe`
Subscribe a new email address.

**Request:**
```json
{
  "email": "user@example.com",
  "source": "footer",
  "gdprConsent": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanks for signing up! Please check your inbox to confirm your subscription."
}
```

**Features:**
- Rate limited: 5 attempts per 15 minutes per IP
- Email validation with Zod schema
- Disposable email blocking
- Duplicate handling (returns appropriate message)
- GDPR metadata collection

#### GET `/api/newsletter/confirm?token=xxx`
Confirm subscription via email link.

**Features:**
- Token validation
- Token expiration handling (7 days)
- Auto-generates new token if expired
- Sends welcome email on success
- Redirects to success/error pages

#### GET `/api/newsletter/unsubscribe?token=xxx`
One-click unsubscribe.

**Features:**
- Token-based (no login required)
- Rate limited for security
- Redirects to confirmation page

### 3. React Components

#### `NewsletterSignup`

Reusable component with three variants:

```tsx
// Full card (default)
<NewsletterSignup variant="default" />

// Compact inline (for footer)
<NewsletterSignup variant="compact" source="footer" />

// Card with description (for content)
<NewsletterSignup variant="inline" source="homepage" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'compact' \| 'inline'` | `'default'` | Visual style |
| `className` | string | `''` | Additional CSS classes |
| `source` | string | `'footer'` | Tracking source |
| `onSuccess` | () => void | - | Callback on success |

**Features:**
- Client-side email validation
- Loading states with spinner
- Success/error feedback
- ARIA labels for accessibility
- GDPR consent notice

### 4. Email Templates

#### Confirmation Email
- Subject: "Confirm your subscription to The Brief"
- Branded HTML + plain text versions
- Clear CTA button
- Expiration notice (7 days)

#### Welcome Email
- Subject: "Welcome to The Brief"
- What to expect section
- Link to latest explainers
- Unsubscribe link in footer

### 5. Utility Modules

#### `lib/newsletter.ts`
Core subscription logic:
- `createSubscriber()` - Create new subscriber
- `confirmSubscriber()` - Confirm via token
- `unsubscribeUser()` - Unsubscribe via token
- `getSubscriberByEmail()` - Lookup by email
- `getSubscriberStats()` - Get counts

#### `lib/email.ts`
Email service:
- `sendConfirmationEmail()` - Send confirmation
- `sendWelcomeEmail()` - Send welcome
- `testEmailConfiguration()` - Verify setup

#### `lib/rate-limit.ts`
Security:
- `checkRateLimit()` - Check rate limits
- `getClientIp()` - Get IP from request
- `isBlockedEmail()` - Check disposable emails
- `isValidEmail()` - Email validation

## Pages

### `/newsletter/confirmed`
Success page shown after email confirmation.
- Success message
- What to expect section
- Links to content

### `/newsletter/unsubscribed`
Confirmation page after unsubscribe.
- Acknowledgment
- Feedback request
- Resubscribe link

### `/newsletter/error`
Error page for invalid/expired tokens.
- Error message
- Helpful suggestions
- Support contact

## Environment Variables

```env
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=re_xxx
FROM_EMAIL=newsletter@thebrief.nz
NEXT_PUBLIC_SITE_URL=https://thebrief.nz

# Optional
FROM_NAME=The Brief
```

## Setup Instructions

### 1. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (thebrief.nz)
3. Create an API key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

### 2. Deploy Sanity Schema

```bash
cd sanity
npm install
npm run deploy
```

### 3. Test Email Configuration

Create a test script or visit:
```
GET /api/newsletter/test-email
```

### 4. Verify Flow

1. Sign up via footer form
2. Check confirmation email arrives
3. Click confirmation link
4. Verify redirect to success page
5. Check welcome email arrives
6. Click unsubscribe link
7. Verify redirect to unsubscribe page

## Security Features

### Rate Limiting
- Signup: 5 attempts per 15 minutes per IP
- Confirm/Unsubscribe: 10 attempts per 5 minutes per IP
- Returns 429 with Retry-After header

### Token Security
- Cryptographically secure random tokens (32 bytes hex)
- Confirmation tokens expire after 7 days
- Separate tokens for confirm/unsubscribe
- Tokens regenerated on expiry

### Input Validation
- Zod schema validation
- Email format validation
- Disposable email blocking
- Maximum email length (254 chars)

### Compliance
- GDPR consent tracking
- IP address logging
- User agent logging
- One-click unsubscribe (required by law)
- Unsubscribe timestamp recording

## Monitoring

### Sanity Studio
View and manage subscribers at:
```
https://thebrief.sanity.studio/desk/subscriber
```

### Stats Endpoint
```typescript
import { getSubscriberStats } from '@/lib/newsletter'

const stats = await getSubscriberStats()
// { total, confirmed, pending, unsubscribed }
```

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is set
2. Verify domain is verified in Resend
3. Check Vercel function logs
4. Test with: `await testEmailConfiguration()`

### Confirm Links Not Working
1. Check `NEXT_PUBLIC_SITE_URL` is correct
2. Verify token isn't expired (7 days)
3. Check Sanity document exists
4. Review Vercel function logs

### Rate Limit Errors
- Normal for spam attempts
- Adjust limits in `lib/rate-limit.ts` if needed
- Monitor IP patterns in logs

## Future Enhancements

### Planned
- [ ] Resend confirmation email button
- [ ] Bulk import/export subscribers
- [ ] Subscriber segmentation by interests
- [ ] Email engagement tracking
- [ ] Automated re-engagement campaigns

### Considerations
- Webhook for email bounces
- Suppression list integration
- A/B testing for subject lines
- Preference center for frequency

## API Reference

### Client-Side
```typescript
// Subscribe
const res = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, source: 'homepage' })
})

// Check stats (admin)
const stats = await fetch('/api/newsletter/stats')
```

### Server-Side
```typescript
import { createSubscriber, confirmSubscriber } from '@/lib/newsletter'
import { sendWelcomeEmail } from '@/lib/email'

// Create subscriber
const { success, subscriber } = await createSubscriber(email, 'footer')

// Confirm subscriber
const result = await confirmSubscriber(token)
```

## Testing

### Manual Test Checklist
- [ ] Sign up with valid email
- [ ] Try duplicate signup
- [ ] Try invalid email format
- [ ] Try disposable email
- [ ] Click confirmation link
- [ ] Click expired link
- [ ] Click unsubscribe link
- [ ] Verify all emails received
- [ ] Check mobile responsiveness
- [ ] Test with screen reader

### Test Script
```bash
# Run signup test
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"test"}'

# Check rate limit (run 6 times quickly)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/newsletter/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com"}'
done
```

## GDPR Compliance

### Data Collected
- Email address
- IP address
- User agent
- Timestamp of signup/confirm/unsubscribe
- Consent boolean

### Data Retention
- Active subscribers: Retained indefinitely
- Unsubscribed: Retained for 1 year (legal requirement)
- Pending (never confirmed): Retained for 30 days

### User Rights
- **Access**: View subscriber data in Sanity Studio
- **Rectification**: Edit email in Sanity Studio
- **Erasure**: Delete document in Sanity Studio
- **Portability**: Export from Sanity

### Legal Basis
- Consent (Article 6(1)(a) GDPR)
- Legitimate interest for security (IP logging)

## Support

For issues or questions:
- Email: hello@thebrief.nz
- Check Vercel logs for errors
- Review Sanity Studio for data issues
