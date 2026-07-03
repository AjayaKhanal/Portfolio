import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import '../styles/toast.css'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  sending: Loader2,
}

/**
 * Toast — a small, fixed-position notification.
 *
 *   <Toast variant="success" onClose={fn}>Saved!</Toast>
 *   <Toast variant="error" message="Something went wrong" onClose={fn} />
 *
 * Auto-dismisses after `duration` ms, except the pending 'sending' state which
 * stays until replaced or closed. Content comes from `children` (or `message`).
 * Forwards its ref to the toast element and spreads extra props onto it.
 */
const Toast = React.forwardRef(
  ({ variant = 'success', message, children, duration = 4000, onClose, className, ...rest }, ref) => {
    useEffect(() => {
      if (variant === 'sending') return
      const id = setTimeout(onClose, duration)
      return () => clearTimeout(id)
      // Re-arm only when the toast content changes, not on every parent re-render.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, message, children, duration])

    const Icon = ICONS[variant] || CheckCircle2
    const content = children ?? message

    return (
      <div className="toast-viewport">
        <div
          ref={ref}
          className={cn('toast', `toast--${variant}`, className)}
          role={variant === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          {...rest}
        >
          <Icon
            className={cn('toast-icon', variant === 'sending' && 'toast-icon--spin')}
            size={20}
            aria-hidden="true"
          />
          <p className="toast-message">{content}</p>
          <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export default Toast
