import { cn } from '@/lib/utils'

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-surface-elevated rounded-lg', className)} />
  )
}
