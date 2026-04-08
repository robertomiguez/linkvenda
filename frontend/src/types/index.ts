export interface Product {
  title: string
  price: string
  image: string
  url: string
}

export interface SavePostData {
  url: string
  title: string
  price: string
  image: string
  content: string
  template: string
}

export interface ExtractResponse {
  title: string
  price: string
  image: string
  cached?: boolean
  error?: string
}


export interface HistoryItem {
  id: string
  content: string
  template: string
  created_at: string
  url: string
  title: string
  price: string
  image: string
}
