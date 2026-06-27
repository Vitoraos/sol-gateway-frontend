import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        'active:scale-[0.98]',
        {
          'bg-primary text-white hover:brightness-110 hover:-translate-y-0.5': variant === 'primary',
          'bg-surface-elevated text-text-primary border border-border hover:border-text-secondary': variant === 'secondary',
          'bg-error/10 text-error border border-error/20 hover:bg-error/20': variant === 'danger',
          'text-text-secondary hover:text-text-primary': variant === 'ghost',
          'h-8 px-3 text-sm gap-1.5': size === 'sm',
          'h-10 px-4 text-sm gap-2': size === 'md',
          'h-12 px-6 text-base gap-2': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={size === 'lg' ? 18 : 14} className="animate-spin" />}
      {children}
    </button>
  )
}
