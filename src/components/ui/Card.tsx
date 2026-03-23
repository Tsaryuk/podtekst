import { ReactNode } from 'react'

type CardVariant = 'default' | 'rust' | 'gold' | 'green' | 'dark'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[var(--bg-surface)] border border-[var(--border)]',
  rust: 'bg-[var(--rust-light)] border border-[var(--rust-border)]',
  gold: 'bg-[var(--gold-light)] border border-[var(--gold-border)]',
  green: 'bg-[var(--green-light)] border border-[var(--green-border)]',
  dark: 'bg-[var(--bg-ink-dark)] text-[var(--text-on-dark)]',
}

export default function Card({ variant = 'default', children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--r-md)] p-[26px_28px]',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
