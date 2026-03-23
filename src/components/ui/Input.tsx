'use client'

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-label text-[var(--text-muted)]">{label}</label>}
      <input
        className={[
          'bg-[var(--bg-page)] border-[1.5px] border-[#E6E0D6] rounded-[10px]',
          'px-[18px] py-4 text-[15px] leading-[1.75] font-[var(--font-body)]',
          'focus:border-[var(--rust)] focus:outline-none',
          'placeholder:text-[var(--text-faint)] placeholder:italic',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}
