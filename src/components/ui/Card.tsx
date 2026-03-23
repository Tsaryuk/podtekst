import { ReactNode } from 'react'

type CardVariant = 'default' | 'rust' | 'gold' | 'green' | 'dark'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
  className?: string
}

const styles: Record<CardVariant, string> = {
  default: 'bg-white border border-[rgba(0,0,0,0.07)]',
  rust: 'bg-[#FBF0EB] border border-[rgba(184,92,56,0.18)]',
  gold: 'bg-[#FBF5E0] border border-[rgba(138,105,16,0.18)]',
  green: 'bg-[#EAF0EB] border border-[rgba(59,88,68,0.18)]',
  dark: 'bg-[#1C1814] text-[#F7F4EE]',
}

export default function Card({ variant = 'default', children, className = '' }: CardProps) {
  return (
    <div className={`rounded-[14px] p-6 sm:p-7 ${styles[variant]} ${className}`}>
      {children}
    </div>
  )
}
