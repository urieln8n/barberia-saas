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
  duration: number
}

type ToastContextValue = {
  showToast: (opts: { type: ToastType; message: string; duration?: number }) => void
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
      duration = 4000,
    }: {
      type: ToastType
      message: string
      duration?: number
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

      setToasts((prev) => {
        const next = [...prev, { id, type, message, duration }]
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
    // Trigger enter animation
    const raf = requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const borderColor =
    toast.type === "success"
      ? "#D4AF66"
      : toast.type === "error"
        ? "#E5484D"
        : "#2563EB"

  const Icon =
    toast.type === "success" ? Check : toast.type === "error" ? X : Info

  const iconColor =
    toast.type === "success"
      ? "#D4AF66"
      : toast.type === "error"
        ? "#E5484D"
        : "#60A5FA"

  return (
    <div
      role="alert"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        transform: visible ? "translateX(0) scale(1)" : "translateX(24px) scale(0.96)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
      }}
      className="flex w-full items-start gap-3 rounded-2xl bg-[#0B1828] px-4 py-3.5 shadow-[0_18px_54px_rgba(5,10,20,0.40)] border border-white/10"
    >
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ color: iconColor }}
      >
        <Icon size={14} strokeWidth={2.5} />
      </span>
      <p className="flex-1 text-sm font-medium leading-5 text-white">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar"
        className="ml-1 mt-0.5 shrink-0 text-slate-400 hover:text-white transition-colors duration-150"
      >
        <X size={14} />
      </button>
    </div>
  )
}
