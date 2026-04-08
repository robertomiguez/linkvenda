import { ScraperResponse } from './types'
import { fetchAsHuman } from './utils'

export async function scrapeMercadoLivre(url: string): Promise<ScraperResponse> {
  // `fetch` defaults to `{ redirect: 'follow' }` so it will follow `meli.la` shortlinks
  // automatically and retrieve the final page HTML.
  const response = await fetchAsHuman(url, { redirect: 'follow' })
  
  let title = ''
  let priceChunks: string[] = []
  let image = ''
  let metaPrice = ''
  
  let polyTitleChunks: string[] = []
  let polyTitleDone = false
  let polyImage = ''
  
  const rewriter = new HTMLRewriter()
    .on('meta[property="og:title"]', {
      element(element) {
        if (!title) title = element.getAttribute('content') || ''
      }
    })
    .on('title', {
      text(text) {
        if (!title) title += text.text
      }
    })
    .on('meta[property="og:image"]', {
      element(element) {
        if (!image) image = element.getAttribute('content') || ''
      }
    })
    // MercadoLivre specific price selectors
    .on('meta[itemprop="price"]', {
      element(element) {
        const val = element.getAttribute('content')
        if (val) metaPrice = `R$ ${val}`
      }
    })
    .on('meta[property="product:price:amount"]', {
      element(element) {
        const val = element.getAttribute('content')
        if (val && !metaPrice) metaPrice = `R$ ${val}`
      }
    })
    .on('.andes-money-amount__fraction', {
      text(text) {
        priceChunks.push(text.text)
      }
    })
    .on('.andes-money-amount__cents', {
      text(text) {
        priceChunks.push(text.text)
      }
    })
    .on('.poly-component__title, .ui-search-item__title', {
      element(el) {
        if (!polyTitleDone) {
          el.onEndTag(() => { polyTitleDone = true })
        }
      },
      text(text) {
        if (!polyTitleDone) polyTitleChunks.push(text.text)
      }
    })
    .on('img.poly-component__picture', {
      element(el) {
        if (!polyImage) {
          polyImage = el.getAttribute('data-src') || el.getAttribute('src') || ''
        }
      }
    })

  const transformed = rewriter.transform(response)
  await transformed.text()
  
  // Clean up title 
  title = title.replace(/\s*-\s*Mercado Livre.*$/i, '').trim()
  title = title.replace(/\s*\|\s*Mercado Livre.*$/i, '').trim()
  
  // Storefront fallback
  if (title.toLowerCase().includes('perfil social') && polyTitleChunks.length > 0) {
    title = polyTitleChunks.join('').trim()
    if (polyImage) image = polyImage
  }

  let finalPrice = 'R$ --,--'
  if (metaPrice) {
    finalPrice = metaPrice
  } else if (priceChunks.length > 0) {
    // If we got fraction and cents, join them
    if (priceChunks.length > 1 && priceChunks[1].trim().length > 0) {
       finalPrice = `R$ ${priceChunks[0].trim()},${priceChunks[1].trim()}`
    } else {
       finalPrice = `R$ ${priceChunks[0].trim()}`
    }
  }
  
  return {
    title,
    price: finalPrice,
    image
  }
}
