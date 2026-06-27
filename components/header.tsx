'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAuth } from '@/hooks/use-auth'
import { Button } from './ui/button'
import { Zap, LogOut } from 'lucide-react'

export function Header() {
  const { token, signOut } = useAuth()

  return (
    <header className="border-b border-divider bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight text-text-primary">
            Sol Gateway
          </span>
        </div>

        <div className="flex items-center gap-3">
          {token && (
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          )}
          <WalletMultiButton className="!bg-primary !text-white !rounded-lg !h-10 !px-4 !text-sm !font-medium !font-sans" />
        </div>
      </div>
    </header>
  )
}
