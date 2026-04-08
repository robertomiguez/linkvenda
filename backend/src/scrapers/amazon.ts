import { ScraperResponse } from './types'
import { fetchAsHuman } from './utils'

export async function scrapeAmazon(url: string): Promise<ScraperResponse> {
  const response = await fetchAsHuman(url)
  
  let title = ''
  let productTitle = ''
  let priceChunks: string[] = []
  let image = ''
  
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
    .on('#productTitle', {
      text(text) {
        productTitle += text.text
      }
    })
    .on('meta[property="og:image"]', {
      element(element) {
        if (!image) image = element.getAttribute('content') || ''
      }
    })
    .on('#landingImage, #imgBlkFront', {
      element(element) {
        if (!image) {
           image = element.getAttribute('data-old-hires') || element.getAttribute('src') || ''
        }
      }
    })
    .on('.a-price .a-offscreen', {
      text(text) {
        priceChunks.push(text.text)
      }
    })
    .on('meta[property="product:price:amount"]', {
      element(element) {
        const val = element.getAttribute('content')
        if (val) priceChunks.push(`R$ ${val}`)
      }
    })

  const transformed = rewriter.transform(response)
  await transformed.text()
  
  if (productTitle.trim()) {
    title = productTitle.trim()
  } else {
    // Clean up title (remove 'Amazon.com.br : ' etc)
    title = title.replace(/Amazon\.com\.br\s*:?\s*/i, '').trim()
  }
  
  return {
    title,
    price: priceChunks.length > 0 ? priceChunks[0].trim() : 'R$ --,--',
    image
  }
}
