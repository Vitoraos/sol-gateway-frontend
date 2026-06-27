import { Inbox } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
      <Inbox size={32} className="mb-3 opacity-50" />
      <p className="text-sm text-center max-w-xs">{message}</p>
    </div>
  )
}
