export const schemaTypes = [
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
]
