import { CACHE_TTL } from '../config/constants'

interface CacheEntry {
  data: Record<string, string>
  expiresAt: number
}

const scrapeCache = new Map<string, CacheEntry>()

export function getCached(url: string): Record<string, string> | null {
  const cacheKey = url.split('?')[0]
  const cached = scrapeCache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data
  }
  return null
}

export function setCache(url: string, data: Record<string, string>): void {
  const cacheKey = url.split('?')[0]
  scrapeCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL })
}

export function cleanupCache(): void {
  const now = Date.now()
  for (const [key, entry] of scrapeCache) {
    if (now > entry.expiresAt) scrapeCache.delete(key)
  }
}
