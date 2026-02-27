import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Create client only if projectId is available
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null

const builder = client ? imageUrlBuilder(client) : null

export const urlFor = (source: Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]) => {
  if (!source || !builder) return ''
  return builder.image(source)
}
