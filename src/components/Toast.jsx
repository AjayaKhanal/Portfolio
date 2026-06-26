import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'
import '../styles/toast.css'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  sending: Loader2,
}

/*
 * Toast — a small, fixed-position notification.
 * Auto-dismisses after `duration` ms, except for the pending 'sending' state,
 * which stays until it's replaced by a success/error (or closed manually).
 */
const Toast = ({ type = 'success', message, duration = 4000, onClose }) => {
  useEffect(() => {
    if (type === 'sending') return
    const id = setTimeout(onClose, duration)
    return () => clearTimeout(id)
    // Re-arm only when the toast content changes, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message, duration])

  const Icon = ICONS[type] || CheckCircle2

  return (
    <div className="toast-viewport">
      <div
        className={`toast toast--${type}`}
        role={type === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        <Icon
          className={`toast-icon${type === 'sending' ? ' toast-icon--spin' : ''}`}
          size={20}
          aria-hidden="true"
        />
        <p className="toast-message">{message}</p>
        <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default Toast
