import type { MiddlewareHandler } from 'hono'
import { MAX_BODY_SIZE } from '../config/constants'

export const bodyLimit: MiddlewareHandler = async (c, next) => {
  const contentLength = c.req.header('content-length')
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return c.json({ error: 'Payload muito grande. Limite: 1MB.' }, 413)
  }
  await next()
}
