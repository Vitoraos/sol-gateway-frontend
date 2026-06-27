'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from './ui/button'
import { LoadingSkeleton } from './loading-skeleton'
import { EmptyState } from './empty-state'
import { ArrowDownLeft, ArrowUpRight, Minus, RotateCcw, Sliders } from 'lucide-react'

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string; sign: string }> = {
  DEPOSIT: { label: 'Deposit', icon: ArrowDownLeft, color: 'text-success', sign: '+' },
  API_USAGE: { label: 'API Call', icon: Minus, color: 'text-error', sign: '-' },
  REFUND: { label: 'Refund', icon: RotateCcw, color: 'text-warning', sign: '+' },
  ADJUSTMENT: { label: 'Adjustment', icon: Sliders, color: 'text-secondary', sign: '' },
}

function formatMicroUsdc(micro: string) {
  return (Number(micro) / 1_000_000).toFixed(6)
}

export function UsageHistory() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['history', page],
    queryFn: () => api.getHistory(page),
  })

  return (
    <div className="card">
      <h2 className="text-lg font-heading font-semibold mb-4">Usage History</h2>

      {isLoading ? (
        <div className="space-y-2">
          <LoadingSkeleton className="h-14" />
          <LoadingSkeleton className="h-14" />
          <LoadingSkeleton className="h-14" />
        </div>
      ) : data?.entries.length === 0 ? (
        <EmptyState message="No transactions yet. Top up to get started." />
      ) : (
        <>
          <div className="space-y-1">
            {data?.entries.map((entry) => {
              const config = typeConfig[entry.type] || {
                label: entry.type,
                icon: Minus,
                color: 'text-text-secondary',
                sign: '',
              }
              const Icon = config.icon
              const isCredit = entry.type === 'DEPOSIT' || entry.type === 'REFUND'

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface-elevated/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-surface flex items-center justify-center ${config.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{config.label}</p>
                      <p className="text-xs text-text-secondary/60">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-medium ${isCredit ? 'text-success' : 'text-error'}`}>
                    {config.sign}{formatMicroUsdc(entry.amount)} USDC
                  </span>
                </div>
              )
            })}
          </div>

          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
