'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface-elevated border border-border rounded-xl p-6 w-full max-w-md animate-fade-in shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors ml-auto"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
