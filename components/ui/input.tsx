import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          'w-full bg-surface border border-border rounded-lg px-4 py-2.5',
          'text-text-primary placeholder:text-text-secondary/50',
          'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20',
          'transition-all duration-150',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1.5">{error}</p>}
    </div>
  )
}
