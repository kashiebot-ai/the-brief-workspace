import bill from './bill'

export const schemaTypes = [
  bill,
  {
    name: 'explainer',
    title: 'Explainer',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            { title: 'Politics', value: 'politics' },
            { title: 'Technology', value: 'technology' },
            { title: 'Business', value: 'business' },
            { title: 'Science', value: 'science' },
            { title: 'Health', value: 'health' },
            { title: 'Culture', value: 'culture' },
          ],
        },
      },
      {
        name: 'summary',
        title: 'Summary',
        type: 'text',
        rows: 3,
        validation: (Rule: any) => Rule.required().max(200),
      },
      {
        name: 'content',
        title: 'Content',
        type: 'array',
        of: [{ type: 'block' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'keyPoints',
        title: 'Key Points',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'readingTime',
        title: 'Reading Time (minutes)',
        type: 'number',
        initialValue: 3,
      },
      {
        name: 'publishedAt',
        title: 'Published At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
      {
        name: 'featured',
        title: 'Featured',
        type: 'boolean',
        initialValue: false,
      },
    ],
  },
  {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 2,
      },
    ],
  },
  {
    name: 'subscriber',
    title: 'Newsletter Subscriber',
    type: 'document',
    fields: [
      {
        name: 'email',
        title: 'Email Address',
        type: 'string',
        validation: (Rule: any) => Rule.required().email(),
      },
      {
        name: 'status',
        title: 'Subscription Status',
        type: 'string',
        options: {
          list: [
            { title: 'Pending Confirmation', value: 'pending' },
            { title: 'Confirmed/Active', value: 'confirmed' },
            { title: 'Unsubscribed', value: 'unsubscribed' },
            { title: 'Bounced', value: 'bounced' },
          ],
          layout: 'radio',
        },
        initialValue: 'pending',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'subscribedAt',
        title: 'Subscribed At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'confirmedAt',
        title: 'Confirmed At',
        type: 'datetime',
      },
      {
        name: 'unsubscribedAt',
        title: 'Unsubscribed At',
        type: 'datetime',
      },
      {
        name: 'source',
        title: 'Signup Source',
        type: 'string',
        description: 'Where the subscriber signed up (e.g., footer, popup, about page)',
        options: {
          list: [
            { title: 'Footer', value: 'footer' },
            { title: 'Homepage', value: 'homepage' },
            { title: 'About Page', value: 'about' },
            { title: 'Quiz Page', value: 'quiz' },
            { title: 'MP Lookup', value: 'mp-lookup' },
            { title: 'Bills Page', value: 'bills' },
            { title: 'Other', value: 'other' },
          ],
        },
        initialValue: 'footer',
      },
      {
        name: 'confirmationToken',
        title: 'Confirmation Token',
        type: 'string',
        description: 'Token used for email confirmation (auto-generated)',
      },
      {
        name: 'confirmationTokenExpires',
        title: 'Confirmation Token Expires',
        type: 'datetime',
        description: 'When the confirmation token expires (7 days from creation)',
      },
      {
        name: 'unsubscribeToken',
        title: 'Unsubscribe Token',
        type: 'string',
        description: 'Token used for one-click unsubscribe (auto-generated)',
      },
      {
        name: 'gdprConsent',
        title: 'GDPR Consent Given',
        type: 'boolean',
        description: 'Whether the user consented to receive emails',
        initialValue: true,
      },
      {
        name: 'ipAddress',
        title: 'IP Address',
        type: 'string',
        description: 'IP address at signup (for compliance)',
      },
      {
        name: 'userAgent',
        title: 'User Agent',
        type: 'string',
        description: 'Browser user agent at signup (for compliance)',
      },
      {
        name: 'welcomeEmailSent',
        title: 'Welcome Email Sent',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'welcomeEmailSentAt',
        title: 'Welcome Email Sent At',
        type: 'datetime',
      },
    ],
    preview: {
      select: {
        title: 'email',
        subtitle: 'status',
      },
      prepare({ title, subtitle }: { title: string; subtitle: string }) {
        const statusEmoji: Record<string, string> = {
          pending: '⏳',
          confirmed: '✅',
          unsubscribed: '❌',
          bounced: '⚠️',
        }
        return {
          title,
          subtitle: `${statusEmoji[subtitle] || ''} ${subtitle}`,
        }
      },
    },
    orderings: [
      {
        title: 'Subscribed Date, Newest',
        name: 'subscribedAtDesc',
        by: [{ field: 'subscribedAt', direction: 'desc' }],
      },
      {
        title: 'Subscribed Date, Oldest',
        name: 'subscribedAtAsc',
        by: [{ field: 'subscribedAt', direction: 'asc' }],
      },
    ],
  },
]
