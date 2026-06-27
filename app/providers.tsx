'use client'

import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/use-toast'
import '@solana/wallet-adapter-react-ui/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], [])

  const endpoint = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_HELIUS_API_KEY
    if (!key) {
      console.warn('[Providers] NEXT_PUBLIC_HELIUS_API_KEY not set, using public fallback')
      return 'https://api.mainnet-beta.solana.com'
    }
    return `https://mainnet.helius-rpc.com/?api-key=${key}`
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  )
}
