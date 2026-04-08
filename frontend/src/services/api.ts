const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api'
const API_KEY = import.meta.env.VITE_API_KEY

if (!API_KEY) {
  console.error("ALERTA CRÍTICO: Chave da API ausente! Configure a VITE_API_KEY no arquivo .env.")
}

import type { ExtractResponse } from '../types'

const getHeaders = (): Record<string, string> => {
  if (!API_KEY) {
    throw new Error('CONFIGURAÇÃO PENDENTE: Configure a VITE_API_KEY dentro de um arquivo .env na pasta frontend.')
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  }
}

export const api = {
  async extract(url: string): Promise<ExtractResponse> {
    const res = await fetch(`${BASE_URL}/extract`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url }),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || await res.text())
    }
    return res.json()
  }
}
