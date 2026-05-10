import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/newsletter/confirmed', '/newsletter/unsubscribed', '/newsletter/error'],
    },
    sitemap: 'https://thebrief.nz/sitemap.xml',
    host: 'https://thebrief.nz',
  }
}
