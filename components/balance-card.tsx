'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { Wallet } from 'lucide-react'
import { LoadingSkeleton } from './loading-skeleton'

export function BalanceCard() {
  const { token } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: api.getBalance,
    enabled: !!token,
    refetchInterval: 10000,
  })

  const balanceUsdc = data ? (Number(data.balance) / 1_000_000).toFixed(6) : '0.000000'

  return (
    <div className="card-elevated">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wallet size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-text-secondary text-sm">Available Balance</p>
          <p className="text-text-primary text-xs font-mono opacity-60">USDC on Solana</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-12 w-48" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-heading font-bold text-text-primary tracking-tight">
            {balanceUsdc}
          </span>
          <span className="text-text-secondary font-medium">USDC</span>
        </div>
      )}

      <p className="text-text-secondary/60 text-xs font-mono mt-2">
        {data?.balance ?? '0'} micro-USDC
      </p>
    </div>
  )
}
