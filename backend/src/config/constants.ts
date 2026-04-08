// Rate limiter
export const RATE_LIMIT_MAX = 20
export const RATE_LIMIT_WINDOW = 60_000 // 1 minuto (ms)

// Scrape cache
export const CACHE_TTL = 10 * 60_000 // 10 minutos

// Body size limit
export const MAX_BODY_SIZE = 1_048_576 // 1MB

// Domínios permitidos para scraping (previne SSRF)
export const ALLOWED_SCRAPE_DOMAINS = [
  'www.mercadolivre.com.br',
  'mercadolivre.com.br',
  'produto.mercadolivre.com.br',
  'www.mercadolibre.com',
  'meli.la',
  'www.amazon.com.br',
  'amazon.com.br',
  'www.amazon.com',
  'amazon.com',
  'a.co',
  'amzn.to',
]
