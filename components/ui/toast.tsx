'use client'

import { X } from 'lucide-react'

const variants = {
  default: 'bg-surface-elevated border-border text-text-primary',
  success: 'bg-surface-elevated border-success/30 text-success',
  error: 'bg-surface-elevated border-error/30 text-error',
  warning: 'bg-surface-elevated border-warning/30 text-warning',
}

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  onClose: () => void
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={`${variants[variant]} border rounded-lg p-4 shadow-xl min-w-[320px] max-w-[420px] animate-slide-up`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          {title && <p className="font-medium text-sm">{title}</p>}
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary shrink-0 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
