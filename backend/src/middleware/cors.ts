import { cors } from 'hono/cors'
import type { MiddlewareHandler } from 'hono'
import type { Bindings } from '../types'

export const corsMiddleware: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const allowedOrigin = c.env.ALLOWED_ORIGIN

  if (!allowedOrigin) {
    return c.json({
      error: 'Erro de Servidor: ALLOWED_ORIGIN não configurada. Adicione no .dev.vars (local) ou em Produção.'
    }, 500)
  }

  const handler = cors({
    origin: (origin) => origin === allowedOrigin ? origin : null,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })

  return handler(c, next)
}
