'use client'

import { useCallback, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export function useAuth() {
  const { publicKey, signMessage, connected, disconnect } = useWallet()
  const store = useAuthStore()

  useEffect(() => {
    const stored = localStorage.getItem('gateway_token')
    if (stored && !store.token) {
      store.setToken(stored)
      api.getMe()
        .then((user) => store.setUser(user))
        .catch(() => {
          localStorage.removeItem('gateway_token')
          store.clear()
        })
    }
  }, [])

  const signIn = useCallback(async () => {
    if (!publicKey || !signMessage) {
      store.setError('Wallet not connected or does not support message signing')
      return
    }

    store.setLoading(true)
    store.setError(null)

    try {
      const walletAddress = publicKey.toBase58()
      const { nonce } = await api.getNonce(walletAddress)

      const message = [
        `sol-gateway.app wants you to sign in with your Solana account:`,
        walletAddress,
        ``,
        `Sign in to Sol Gateway`,
        ``,
        `Nonce: ${nonce}`,
        `Issued At: ${new Date().toISOString()}`,
      ].join('\n')

      const messageBytes = new TextEncoder().encode(message)
      const signatureBytes = await signMessage(messageBytes)
      const signature = bs58.encode(signatureBytes)

      const result = await api.verifySignature({ walletAddress, message, signature })

      localStorage.setItem('gateway_token', result.token)
      store.setToken(result.token)
      store.setUser(result.user)
    } catch (err: any) {
      console.error('[useAuth] Sign in failed:', err)
      store.setError(err.message || 'Authentication failed')
    } finally {
      store.setLoading(false)
    }
  }, [publicKey, signMessage])

  const signOut = useCallback(() => {
    localStorage.removeItem('gateway_token')
    store.clear()
    disconnect()
  }, [disconnect])

  return {
    token: store.token,
    user: store.user,
    loading: store.loading,
    error: store.error,
    signIn,
    signOut,
    connected,
  }
}
