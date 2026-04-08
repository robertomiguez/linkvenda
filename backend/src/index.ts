import { Hono } from 'hono'
import type { Bindings } from './types'
import { corsMiddleware, authMiddleware, rateLimiter, bodyLimit } from './middleware'
import { registerRoutes } from './routes'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware stack (order matters)
app.use('/api/*', corsMiddleware)
app.use('/api/*', rateLimiter)
app.use('/api/*', bodyLimit)
app.use('/api/*', authMiddleware)

// Routes
registerRoutes(app)

export default app
