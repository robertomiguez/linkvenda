import type { MiddlewareHandler } from 'hono'
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW } from '../config/constants'
import { cleanupCache } from '../services/cache'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

let lastCleanup = Date.now()

// Limpeza de entradas expiradas (chamada via lazy evaluation no handler)
function cleanup() {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
  cleanupCache()
}
export const rateLimiter: MiddlewareHandler = async (c, next) => {
  if (c.req.path === '/api/health') return next()

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const now = Date.now()

  // Lazy evaluation da limpeza de cache para evitar setInterval global (proibido em Workers)
  if (now - lastCleanup > 2 * 60_000) {
    lastCleanup = now
    cleanup()
  }

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
  } else {
    entry.count++
    if (entry.count > RATE_LIMIT_MAX) {
      return c.json({ error: 'Limite de requisições atingido. Tente novamente em 1 minuto.' }, 429)
    }
  }

  await next()
}
