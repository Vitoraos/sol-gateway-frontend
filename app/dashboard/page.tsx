'use client'

import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/header'
import { BalanceCard } from '@/components/balance-card'
import { UsageHistory } from '@/components/usage-history'
import { Button } from '@/components/ui/button'
import { ArrowRight, Store, Wallet } from 'lucide-react'

const TopUpForm = dynamic(() => import('@/components/top-up-form').then(m => m.TopUpForm), {
  ssr: false,
  loading: () => <div className="card h-48 animate-pulse bg-surface-elevated" />,
})

const ApiKeyManager = dynamic(() => import('@/components/api-key-manager').then(m => m.ApiKeyManager), {
  ssr: false,
  loading: () => <div className="card h-48 animate-pulse bg-surface-elevated" />,
})

export default function Dashboard() {
  const { connected } = useWallet()
  const { token, loading, error, signIn } = useAuth()

  if (!connected) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
              <Store size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-3 tracking-tight">
              API Micropayments
            </h1>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Pay per API call with USDC on Solana. Connect your wallet to deposit funds,
              create API keys, and start building.
            </p>
            <p className="text-text-secondary/60 text-sm">
              Use the wallet button in the header to connect.
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center mx-auto mb-6">
              <Wallet size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
              Wallet Connected
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Sign a message to authenticate and access your dashboard.
            </p>
            <Button onClick={signIn} disabled={loading} size="lg" className="gap-2">
              {loading ? 'Signing...' : 'Sign In With Solana'}
              <ArrowRight size={16} />
            </Button>
            {error && (
              <p className="text-error text-sm mt-4 bg-error/10 border border-error/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="space-y-6">
          <BalanceCard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopUpForm />
            <ApiKeyManager />
          </div>
          <UsageHistory />
          <div className="card border-dashed border-border/50 bg-surface/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  V2 Marketplace
                </h3>
                <p className="text-text-secondary text-sm max-w-lg leading-relaxed">
                  Soon, anyone will be able to register API services and earn 93% of every call.
                  Consumers browse the marketplace and pay per request.
                </p>
              </div>
              <span className="text-xs font-mono text-text-secondary/40 bg-surface-elevated px-2 py-1 rounded shrink-0">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
