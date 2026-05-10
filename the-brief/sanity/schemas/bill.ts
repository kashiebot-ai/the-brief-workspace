import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bill',
  title: 'Bill',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Full Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The official title of the bill',
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A shorter, more readable version of the title for display',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'shortTitle',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: 'A brief one-sentence description of the bill',
    }),
    defineField({
      name: 'summary',
      title: 'Plain-English Summary',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
      description: 'A comprehensive plain-English explanation of what the bill does',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      of: [{ type: 'string' }],
      description: '3-5 bullet points summarising the main aspects of the bill',
    }),
    defineField({
      name: 'billNumber',
      title: 'Bill Number',
      type: 'string',
      description: 'e.g., "Bill 123-1" or "Resource Management Amendment Bill"',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Environment', value: 'environment' },
          { title: 'Health', value: 'health' },
          { title: 'Transport', value: 'transport' },
          { title: 'Housing', value: 'housing' },
          { title: 'Education', value: 'education' },
          { title: 'Justice', value: 'justice' },
          { title: 'Economy', value: 'economy' },
          { title: 'Technology', value: 'technology' },
          { title: 'Social Services', value: 'social' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'committee',
      title: 'Select Committee',
      type: 'string',
      options: {
        list: [
          { title: 'Environment Committee', value: 'environment' },
          { title: 'Health Committee', value: 'health' },
          { title: 'Transport and Infrastructure Committee', value: 'transport' },
          { title: 'Social Services and Community Committee', value: 'social_services' },
          { title: 'Justice Committee', value: 'justice' },
          { title: 'Education and Workforce Committee', value: 'education' },
          { title: 'Economic Development, Science and Innovation Committee', value: 'economic_development' },
          { title: 'Primary Production Committee', value: 'primary_production' },
          { title: 'Governance and Administration Committee', value: 'governance' },
          { title: 'Māori Affairs Committee', value: 'māori_affairs' },
          { title: 'Other Committee', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Bill Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open for Submissions', value: 'open' },
          { title: 'Closing Soon', value: 'closing_soon' },
          { title: 'Submissions Closed', value: 'closed' },
          { title: 'Bill Passed', value: 'passed' },
          { title: 'Bill Defeated', value: 'defeated' },
        ],
        layout: 'radio',
      },
      initialValue: 'open',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submissionDeadline',
      title: 'Submission Deadline',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'The date and time when submissions close',
    }),
    defineField({
      name: 'introducedDate',
      title: 'Date Introduced',
      type: 'date',
      description: 'When the bill was first introduced to Parliament',
    }),
    defineField({
      name: 'firstReadingDate',
      title: 'First Reading Date',
      type: 'date',
      description: 'When the bill had its first reading',
    }),
    defineField({
      name: 'parliamentUrl',
      title: 'Parliament Bill Page URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'Link to the bill page on parliament.nz',
    }),
    defineField({
      name: 'legislationUrl',
      title: 'Legislation.govt.nz URL',
      type: 'url',
      description: 'Link to the bill on legislation.govt.nz (if available)',
    }),
    defineField({
      name: 'submissionUrl',
      title: 'Submission Form URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'Direct link to the Parliament submission form for this bill',
    }),
    defineField({
      name: 'impactStatement',
      title: 'Impact Statement',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Summary of who the bill affects and how',
    }),
    defineField({
      name: 'regulatoryImpact',
      title: 'Regulatory Impact Statement',
      type: 'url',
      description: 'Link to the regulatory impact statement (if available)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Bill',
      type: 'boolean',
      initialValue: false,
      description: 'Feature this bill on the homepage',
    }),
    defineField({
      name: 'submissionCount',
      title: 'Submission Count',
      type: 'number',
      description: 'Number of submissions received (if known)',
    }),
  ],
  preview: {
    select: {
      title: 'shortTitle',
      subtitle: 'category',
      deadline: 'submissionDeadline',
      status: 'status',
    },
    prepare({ title, subtitle, deadline, status }) {
      const statusEmoji: Record<string, string> = {
        open: '🟢',
        closing_soon: '🟡',
        closed: '🔴',
        passed: '✅',
        defeated: '❌',
      }
      const deadlineStr = deadline 
        ? new Date(deadline).toLocaleDateString('en-NZ')
        : 'No deadline'
      return {
        title: `${statusEmoji[status || 'open']} ${title}`,
        subtitle: `${subtitle} • Closes: ${deadlineStr}`,
      }
    },
  },
  orderings: [
    {
      title: 'Submission Deadline, Earliest First',
      name: 'deadlineAsc',
      by: [{ field: 'submissionDeadline', direction: 'asc' }],
    },
    {
      title: 'Last Updated, Newest First',
      name: 'updatedDesc',
      by: [{ field: 'lastUpdated', direction: 'desc' }],
    },
  ],
})
