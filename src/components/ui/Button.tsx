'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'small' | 'full'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--bg-ink-dark)] text-white',
    'hover:bg-[var(--rust)]',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--bg-ink-dark)]',
  ].join(' '),
  secondary: [
    'bg-transparent border-[1.5px] border-[var(--rust)] text-[var(--rust)]',
    'hover:bg-[var(--rust-light)]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--rust)] underline-offset-2',
    'hover:underline',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  default: 'px-7 py-[11px] text-[15px]',
  small: 'px-[22px] py-[9px] text-[14px]',
  full: 'w-full px-7 py-[11px] text-[15px]',
}

export default function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'rounded-[var(--r-pill)] font-[var(--font-body)] transition-colors duration-200 cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
