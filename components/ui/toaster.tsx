'use client'

import { useToast } from './use-toast'
import { Toast } from './toast'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
