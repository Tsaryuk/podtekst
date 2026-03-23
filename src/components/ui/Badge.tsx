import { ReactNode } from 'react'

type BadgeVariant = 'rust' | 'green' | 'gold' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  rust: 'bg-[rgba(184,92,56,0.10)] text-[var(--rust)]',
  green: 'bg-[rgba(59,88,68,0.10)] text-[var(--green)]',
  gold: 'bg-[rgba(138,105,16,0.10)] text-[var(--gold)]',
  gray: 'bg-[var(--bg-muted)] text-[var(--text-muted)]',
}

export default function Badge({ variant = 'rust', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block rounded-[var(--r-pill)] px-3 py-[3px] text-xs',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
