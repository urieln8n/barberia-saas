"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Check, X, Loader2 } from "lucide-react"

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  children: ReactNode
  variant?: "primary" | "gold" | "dark" | "outline" | "danger"
}

export function LoadingButton({
  isLoading,
  isSuccess,
  isError,
  loadingText = "Guardando...",
  successText = "Guardado",
  errorText = "Error",
  children,
  className = "",
  disabled,
  variant = "primary",
  ...props
}: LoadingButtonProps) {
  const variantClass =
    variant === "gold"
      ? "btn-gold"
      : variant === "dark"
        ? "btn-dark"
        : variant === "outline"
          ? "btn-outline"
          : variant === "danger"
            ? "btn-danger"
            : "btn-primary"

  const isDisabled = isLoading || disabled

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${variantClass} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText}
        </>
      ) : isSuccess ? (
        <>
          <Check size={16} />
          {successText}
        </>
      ) : isError ? (
        <>
          <X size={16} />
          {errorText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
