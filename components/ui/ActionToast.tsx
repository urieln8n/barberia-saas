"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react"
import { Check, X, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: string
  type: ToastType
  message: string
  detail?: string
  duration: number
}

type ToastContextValue = {
  showToast: (opts: { type: ToastType; message: string; detail?: string; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function ActionToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    ({
      type,
      message,
      detail,
      duration = 5000,
    }: {
      type: ToastType
      message: string
      detail?: string
      duration?: number
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

      setToasts((prev) => {
        const next = [...prev, { id, type, message, detail, duration }]
        // Keep only last 3
        return next.slice(-3)
      })

      const timer = setTimeout(() => {
        removeToast(id)
      }, duration)

      timersRef.current.set(id, timer)
    },
    [removeToast]
  )

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useActionToast() {
  return useContext(ToastContext)
}

// ── Internal components ─────────────────────────────────────────────────────

type ToastContainerProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 sm:right-6 sm:bottom-6"
      style={{ maxWidth: "min(calc(100vw - 2rem), 380px)" }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

type ToastItemProps = {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const isSuccess = toast.type === "success"
  const isError   = toast.type === "error"

  const borderColor = isSuccess ? "#10B981" : isError ? "#E5484D" : "#3B82F6"
  const iconBg      = isSuccess ? "rgba(16,185,129,0.15)" : isError ? "rgba(229,72,77,0.15)" : "rgba(59,130,246,0.15)"
  const iconColor   = isSuccess ? "#34D399" : isError ? "#F87171" : "#60A5FA"
  const shadowColor = isSuccess
    ? "0_0_0_1px_rgba(16,185,129,0.12),0_20px_60px_rgba(5,10,20,0.50),0_0_30px_rgba(16,185,129,0.08)"
    : isError
    ? "0_0_0_1px_rgba(229,72,77,0.12),0_20px_60px_rgba(5,10,20,0.50)"
    : "0_0_0_1px_rgba(59,130,246,0.12),0_20px_60px_rgba(5,10,20,0.50)"

  const Icon = isSuccess ? Check : isError ? X : Info

  return (
    <div
      role="alert"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: shadowColor,
        transform: visible ? "translateX(0) scale(1)" : "translateX(28px) scale(0.94)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease",
      }}
      className="flex w-full items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#0C0E14]/95 px-4 py-3.5 backdrop-blur-md"
    >
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={13} strokeWidth={2.5} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-5 text-white">{toast.message}</p>
        {toast.detail && (
          <p className="mt-0.5 truncate text-xs text-white/45">{toast.detail}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar"
        className="ml-1 mt-0.5 shrink-0 rounded-lg p-1 text-white/30 transition hover:bg-white/[0.06] hover:text-white/70"
      >
        <X size={13} />
      </button>
    </div>
  )
}
