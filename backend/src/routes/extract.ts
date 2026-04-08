import { Hono } from 'hono'
import type { Bindings } from '../types'
import { ALLOWED_SCRAPE_DOMAINS } from '../config/constants'
import { getCached, setCache } from '../services/cache'
import { scrapeAmazon } from '../scrapers/amazon'
import { scrapeMercadoLivre } from '../scrapers/mercadolivre'

const route = new Hono<{ Bindings: Bindings }>()

route.post('/', async (c) => {
  const { url } = await c.req.json()

  if (!url || typeof url !== 'string') {
    return c.json({ error: 'URL é obrigatória.' }, 400)
  }

  // Validação rigorosa de URL (previne SSRF)
  let urlObj: URL
  try {
    urlObj = new URL(url)
  } catch {
    return c.json({ error: 'URL inválida.' }, 400)
  }

  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    return c.json({ error: 'Protocolo não permitido. Use http ou https.' }, 400)
  }

  const hostname = urlObj.hostname.toLowerCase()
  if (!ALLOWED_SCRAPE_DOMAINS.includes(hostname)) {
    return c.json({
      error: 'Domínio não suportado. Aceitos: Mercado Livre e Amazon.',
      isMagicScreen: true,
    }, 400)
  }

  try {
    // Cache check
    const cached = getCached(url)
    if (cached) {
      return c.json({ ...cached, cached: true })
    }

    const isMercadoLivre = hostname.includes('mercadolivre') ||
      hostname.includes('mercadolibre') ||
      hostname === 'meli.la'

    const data = isMercadoLivre
      ? await scrapeMercadoLivre(url)
      : await scrapeAmazon(url)

    if (!data.title && !data.image) {
      return c.json({
        error: 'Nenhuma informação pôde ser extraída desse link (possível bloqueio anti-robô).'
      }, 400)
    }

    const result = { title: data.title, price: data.price, image: data.image }
    setCache(url, result)

    return c.json(result)
  } catch (error) {
    console.error('Scrape error:', error)
    return c.json({ error: 'Erro interno ao processar o link. Tente novamente.' }, 500)
  }
})

export default route
