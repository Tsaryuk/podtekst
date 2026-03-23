'use client'

import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export default function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-label text-[var(--text-muted)]">{label}</label>}
      <textarea
        className={[
          'bg-[var(--bg-page)] border-[1.5px] border-[#E6E0D6] rounded-[10px]',
          'px-[18px] py-4 text-[15px] leading-[1.75] font-[var(--font-body)]',
          'focus:border-[var(--rust)] focus:outline-none resize-none',
          'placeholder:text-[var(--text-faint)] placeholder:italic',
          'min-h-[180px]',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  )
}
