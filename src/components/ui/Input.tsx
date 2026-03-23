'use client'

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#7A6E66]">
          {label}
        </label>
      )}
      <input
        className={`font-body bg-[#F7F4EE] border-[1.5px] border-[#E6E0D6] rounded-[10px] px-[18px] py-4 text-[15px] leading-[1.75] text-[#1C1814] focus:border-[#B85C38] focus:outline-none placeholder:text-[#B0A59C] placeholder:italic ${className}`}
        {...props}
      />
    </div>
  )
}
