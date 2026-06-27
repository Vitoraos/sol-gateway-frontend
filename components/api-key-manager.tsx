'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog } from './ui/dialog'
import { useToast } from './ui/use-toast'
import { LoadingSkeleton } from './loading-skeleton'
import { EmptyState } from './empty-state'
import { Key, Copy, Trash2, Plus, Check, Loader2 } from 'lucide-react'

export function ApiKeyManager() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [newKeyLabel, setNewKeyLabel] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: api.listKeys,
  })

  const createMutation = useMutation({
    mutationFn: api.createKey,
    onSuccess: (result) => {
      setCreatedKey(result.key)
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: (err: any) => {
      addToast({ title: 'Failed to create key', description: err.message, variant: 'error' })
    },
  })

  const revokeMutation = useMutation({
    mutationFn: api.revokeKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      addToast({ title: 'Key revoked', description: 'The API key is no longer active', variant: 'success' })
    },
    onError: (err: any) => {
      addToast({ title: 'Failed to revoke key', description: err.message, variant: 'error' })
    },
  })

  const handleCreate = () => {
    if (!newKeyLabel.trim()) {
      addToast({ title: 'Label required', description: 'Enter a label for this key', variant: 'warning' })
      return
    }
    createMutation.mutate(newKeyLabel.trim())
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRevoke = (id: string) => {
    if (!confirm('Revoke this key? Any apps using it will stop working immediately.')) return
    revokeMutation.mutate(id)
  }

  const closeCreateDialog = () => {
    setShowCreateDialog(false)
    setNewKeyLabel('')
    setCreatedKey(null)
    setCopied(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold">API Keys</h2>
        <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus size={14} />
          Create Key
        </Button>
      </div>

      <Dialog
        open={showCreateDialog}
        onClose={closeCreateDialog}
        title={createdKey ? 'Save Your API Key' : 'Create API Key'}
      >
        {createdKey ? (
          <div className="space-y-4">
            <div className="bg-surface border border-warning/30 rounded-lg p-4">
              <p className="text-warning text-sm font-medium mb-2">
                This key will only be shown once. Copy it now.
              </p>
              <div className="flex gap-2">
                <code className="flex-1 bg-background rounded px-3 py-2 text-sm font-mono text-text-primary break-all">
                  {createdKey}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(createdKey)}
                  className="shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
            <Button onClick={closeCreateDialog} className="w-full">
              I&apos;ve Copied It
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-text-secondary text-xs mb-1.5 block">Label</label>
              <Input
                placeholder="e.g., Production API"
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={closeCreateDialog} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="flex-1 gap-2">
                {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {isLoading ? (
        <div className="space-y-2">
          <LoadingSkeleton className="h-14" />
          <LoadingSkeleton className="h-14" />
        </div>
      ) : data?.keys.length === 0 ? (
        <EmptyState message="No active API keys. Create one to start making billed calls." />
      ) : (
        <div className="space-y-2">
          {data?.keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 group hover:border-text-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Key size={16} className="text-text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{key.label}</p>
                  <p className="text-xs text-text-secondary/60 font-mono">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRevoke(key.id)}
                disabled={revokeMutation.isPending}
                className="text-error/70 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
