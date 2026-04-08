import type { MiddlewareHandler } from 'hono'
import type { Bindings } from '../types'

export const authMiddleware: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  if (c.req.path === '/api/health') return next()

  const expectedKey = c.env.API_KEY

  if (!expectedKey) {
    return c.json({
      error: 'Erro de Servidor: API_KEY não configurada. Crie um arquivo .dev.vars (local) ou adicione em Produção.'
    }, 500)
  }

  const authHeader = c.req.header('Authorization')

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return c.json({ error: 'Acesso Negado: Chave de segurança inválida ou ausente.' }, 401)
  }

  await next()
}
