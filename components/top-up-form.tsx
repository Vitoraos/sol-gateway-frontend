'use client'

import { useState, useMemo } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { ArrowUpRight, Loader2 } from 'lucide-react'

function getUsdcMint() {
  const mint = process.env.NEXT_PUBLIC_USDC_MINT
  return mint ? new PublicKey(mint) : null
}

function getTreasury() {
  const treasury = process.env.NEXT_PUBLIC_TREASURY_PUBKEY
  return treasury ? new PublicKey(treasury) : null
}

export function TopUpForm() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { addToast } = useToast()
  const [amount, setAmount] = useState('5')
  const [status, setStatus] = useState<'idle' | 'building' | 'signing' | 'confirming' | 'confirmed' | 'error'>('idle')

  const USDC_MINT = useMemo(() => getUsdcMint(), [])
  const TREASURY = useMemo(() => getTreasury(), [])

  const handleTopUp = async () => {
    if (!publicKey) {
      addToast({ title: 'Wallet not connected', description: 'Connect your wallet first', variant: 'warning' })
      return
    }

    if (!USDC_MINT || !TREASURY) {
      addToast({ title: 'Configuration error', description: 'USDC mint or treasury not configured', variant: 'error' })
      return
    }

    const usdcAmount = parseFloat(amount)
    if (isNaN(usdcAmount) || usdcAmount < 1) {
      addToast({ title: 'Invalid amount', description: 'Minimum top-up is 1 USDC', variant: 'warning' })
      return
    }

    setStatus('building')
    try {
      const amountLamports = BigInt(Math.round(usdcAmount * 1_000_000))
      const fromAta = await getAssociatedTokenAddress(USDC_MINT, publicKey)
      const toAta = await getAssociatedTokenAddress(USDC_MINT, TREASURY)

      const tx = new Transaction().add(
        createTransferInstruction(fromAta, toAta, publicKey, amountLamports)
      )

      const { blockhash } = await connection.getLatestBlockhash('confirmed')
      tx.recentBlockhash = blockhash
      tx.feePayer = publicKey

      setStatus('signing')
      const signature = await sendTransaction(tx, connection)

      setStatus('confirming')
      await connection.confirmTransaction(signature, 'confirmed')

      setStatus('confirmed')
      addToast({
        title: 'Deposit confirmed',
        description: `${usdcAmount} USDC sent. Balance updates in ~10s.`,
        variant: 'success',
      })

      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: any) {
      console.error('Top-up error:', err)
      setStatus('error')
      addToast({
        title: 'Transaction failed',
        description: err.message || 'Unknown error',
        variant: 'error',
      })
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const statusText: Record<string, string> = {
    idle: 'Top Up',
    building: 'Building transaction...',
    signing: 'Waiting for signature...',
    confirming: 'Confirming...',
    confirmed: 'Confirmed!',
    error: 'Failed',
  }

  const isBusy = status === 'building' || status === 'signing' || status === 'confirming'

  return (
    <div className="card">
      <h2 className="text-lg font-heading font-semibold mb-4">Top Up Balance</h2>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-text-secondary text-xs mb-1.5 block">Amount (USDC)</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5"
          />
        </div>
        <Button onClick={handleTopUp} disabled={isBusy} className="gap-2">
          {isBusy ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
          {statusText[status]}
        </Button>
      </div>
      <p className="text-text-secondary/60 text-xs mt-3">
        Minimum 1 USDC. Sent directly to treasury. Balance updates within ~10 seconds.
      </p>
    </div>
  )
}
