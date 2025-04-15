import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://maeri.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/services',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/products',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/pricing',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/training',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/about',
      lastModified: new Date(),
    },
    {
      url: 'https://maeri.vercel.app/contact',
      lastModified: new Date(),
    },
  ]
}