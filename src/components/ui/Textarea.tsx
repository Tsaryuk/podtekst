'use client'

import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export default function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#7A6E66]">
          {label}
        </label>
      )}
      <textarea
        className={`font-body bg-[#F7F4EE] border-[1.5px] border-[#E6E0D6] rounded-[10px] px-[18px] py-4 text-[15px] leading-[1.75] text-[#1C1814] focus:border-[#B85C38] focus:outline-none resize-none placeholder:text-[#B0A59C] placeholder:italic min-h-[180px] ${className}`}
        {...props}
      />
    </div>
  )
}
