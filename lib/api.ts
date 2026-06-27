const BASE = process.env.NEXT_PUBLIC_API_URL

if (typeof window !== 'undefined' && !BASE) {
  console.error('[API] NEXT_PUBLIC_API_URL is not set')
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gateway_token')
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const url = `${BASE}${path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    let errBody: any
    try {
      errBody = await res.json()
    } catch {
      errBody = { error: res.statusText }
    }
    throw new ApiError(errBody.error ?? `Request failed (${res.status})`, res.status)
  }

  return res.json()
}

export interface User {
  id: string
  walletAddress: string
  balance: string
}

export interface ApiKeyItem {
  id: string
  label: string
  createdAt: string
}

export interface LedgerEntry {
  id: string
  userId: string
  amount: string
  type: string
  referenceId: string
  createdAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export const api = {
  getNonce: (walletAddress: string) =>
    request<{ nonce: string }>(`/v1/auth/nonce?walletAddress=${encodeURIComponent(walletAddress)}`),

  verifySignature: (body: { walletAddress: string; message: string; signature: string }) =>
    request<{ token: string; user: User }>('/v1/auth/verify', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () => request<User>('/v1/auth/me'),

  getBalance: () => request<{ balance: string }>('/v1/ledger/balance'),

  getHistory: (page = 1) =>
    request<{ entries: LedgerEntry[]; pagination: Pagination }>(`/v1/ledger/history?page=${page}&limit=20`),

  listKeys: () => request<{ keys: ApiKeyItem[] }>('/v1/keys'),

  createKey: (label: string) =>
    request<{ id: string; key: string; label: string; createdAt: string }>('/v1/keys', {
      method: 'POST',
      body: JSON.stringify({ label }),
    }),

  revokeKey: (id: string) =>
    request<{ success: boolean }>(`/v1/keys/${id}`, { method: 'DELETE' }),
}
