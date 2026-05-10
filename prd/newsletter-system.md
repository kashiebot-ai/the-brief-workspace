# PRD: Newsletter Signup System for The Brief

## Overview
Build a complete newsletter signup system for The Brief website with email capture, subscriber management, and automated confirmation flows.

## Requirements

### 1. Email Capture Component
- Reusable React component for email signup forms
- Input validation (email format, required field)
- Loading states during submission
- Success/error feedback UI
- Responsive design matching The Brief brand
- Accessible (ARIA labels, keyboard navigation)

### 2. Sanity CMS Schema
Create schema for subscriber management:
```typescript
{
  name: 'subscriber',
  type: 'document',
  fields: [
    { name: 'email', type: 'string', validation: required + email format },
    { name: 'status', type: 'string', options: ['pending', 'confirmed', 'unsubscribed'] },
    { name: 'subscribedAt', type: 'datetime' },
    { name: 'confirmedAt', type: 'datetime' },
    { name: 'source', type: 'string' }, // where they signed up
    { name: 'confirmationToken', type: 'string' },
    { name: 'unsubscribeToken', type: 'string' }
  ]
}
```

### 3. API Endpoints
Build Next.js API routes:

**POST /api/newsletter/subscribe**
- Accept: `{ email: string, source?: string }`
- Validate email format
- Check for existing subscriber
- Generate confirmation token
- Create pending subscriber record in Sanity
- Trigger confirmation email
- Return: `{ success: boolean, message: string }`

**GET /api/newsletter/confirm?token=xxx**
- Validate token
- Update subscriber status to 'confirmed'
- Set confirmedAt timestamp
- Trigger welcome email
- Redirect to success page

**GET /api/newsletter/unsubscribe?token=xxx**
- Validate token
- Update status to 'unsubscribed'
- Redirect to unsubscribe confirmation page

### 4. Email Flow (Resend or Nodemailer)
**Confirmation Email:**
- Subject: "Confirm your subscription to The Brief"
- Plain text + HTML versions
- Confirmation link with token
- Professional branded template
- Clear call-to-action button

**Welcome Email:**
- Subject: "Welcome to The Brief"
- Thank you message
- What to expect (frequency, content)
- Link to latest newsletter
- Unsubscribe link in footer

### 5. Footer Signup Form
- Integrate email capture component into site footer
- Inline form (email input + submit button)
- Minimal design, doesn't distract from content
- Works on all page templates
- Source tracking: 'footer'

### 6. Additional Components
- Success page (`/newsletter/confirmed`)
- Unsubscribe confirmation page (`/newsletter/unsubscribed`)
- Privacy note about email usage
- GDPR-friendly consent language

## Technical Stack
- **Frontend:** React components in Next.js
- **Database:** Sanity CMS
- **Email:** Resend (preferred) or Nodemailer with SendGrid/SES
- **Validation:** Zod schemas
- **Styling:** Tailwind CSS matching existing site

## Third-Party Service Evaluation
Check if Buttondown or ConvertKit APIs are available and cost-effective:
- If yes: Integrate via API, store minimal data in Sanity (sync status)
- If no: Build simple system as described above

## Security Considerations
- Rate limiting on signup endpoint (prevent spam)
- Token expiration (confirmation tokens valid 7 days)
- Secure token generation (crypto.randomBytes)
- Input sanitization
- HTTPS only for API endpoints

## Success Criteria
- User can signup from footer on any page
- Confirmation email arrives within 30 seconds
- Confirmation flow works smoothly
- Unsubscribe is one-click (no login required)
- Admin can view subscribers in Sanity Studio
- System handles duplicate signups gracefully
- Mobile-responsive on all devices

## Deliverables
1. Email capture React component
2. Sanity schema + migrations
3. API routes with full error handling
4. Email templates (confirmation + welcome)
5. Footer integration
6. Success/unsubscribe pages
7. Documentation in `/docs/newsletter-system.md`

## Project Location
Work in existing The Brief Next.js project (location TBD — check workspace for current site)

## Timeline
Target: Complete within 24 hours of start

---

**Notes:**
- Keep it simple first version — can enhance later
- Focus on reliability over features
- Make unsubscribe frictionless (legal requirement)
- Test email deliverability thoroughly
