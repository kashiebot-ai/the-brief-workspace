import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const BASE_URL = 'https://thebrief.nz'

interface Explainer {
  slug: { current: string }
  _updatedAt: string
}

async function getExplainers(): Promise<Explainer[]> {
  try {
    if (!client) return []
    const explainers = await client.fetch(`
      *[_type == "explainer"] {
        slug,
        _updatedAt
      }
    `)
    return explainers || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const explainers = await getExplainers()

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mp-lookup`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/newsletter/confirmed`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/newsletter/unsubscribed`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/newsletter/error`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic explainer pages
  const explainerPages = explainers.map((explainer) => ({
    url: `${BASE_URL}/explainer/${explainer.slug.current}`,
    lastModified: new Date(explainer._updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...explainerPages]
}
