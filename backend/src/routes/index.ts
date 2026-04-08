import type { Hono } from 'hono'
import type { Bindings } from '../types'
import extractRoute from './extract'

export function registerRoutes(app: Hono<{ Bindings: Bindings }>) {
  app.get('/api/health', (c) => c.text('OK'))
  app.route('/api/extract', extractRoute)
}
