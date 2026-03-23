'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'small' | 'full'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'font-body rounded-full transition-colors duration-200 cursor-pointer inline-flex items-center justify-center'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#1C1814] text-white hover:bg-[#B85C38] disabled:opacity-40 disabled:hover:bg-[#1C1814]',
    secondary: 'bg-transparent border-[1.5px] border-[#B85C38] text-[#B85C38] hover:bg-[#FBF0EB] disabled:opacity-40',
    ghost: 'bg-transparent text-[#B85C38] hover:underline underline-offset-2 disabled:opacity-40',
  }

  const sizes: Record<ButtonSize, string> = {
    default: 'px-7 py-[11px] text-[15px]',
    small: 'px-5 py-2 text-sm',
    full: 'w-full px-7 py-[11px] text-[15px]',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
