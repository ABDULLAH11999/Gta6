import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/site-data'
import { getPosts } from '@/lib/db'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/about', '/blog', '/privacy-policy', '/terms-conditions', '/contact', '/disclaimer']

  return [
    ...staticPages.map((page) => ({
      url: canonicalUrl(page || '/'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    })),
    ...getPosts().map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'daily' as const,
      priority: 0.82,
    })),
  ]
}
