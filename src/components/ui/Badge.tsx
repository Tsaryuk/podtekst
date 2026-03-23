import { ReactNode } from 'react'

type BadgeVariant = 'rust' | 'green' | 'gold' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  rust: 'bg-[rgba(184,92,56,0.10)] text-[#B85C38]',
  green: 'bg-[rgba(59,88,68,0.10)] text-[#3B5844]',
  gold: 'bg-[rgba(138,105,16,0.10)] text-[#8A6910]',
  gray: 'bg-[#EFEBE1] text-[#7A6E66]',
}

export default function Badge({ variant = 'rust', children, className = '' }: BadgeProps) {
  return (
    <span className={`font-body inline-block rounded-full px-3 py-[3px] text-xs ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
