'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(28,24,20,0.4)] backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-[20px] p-8 max-w-[420px] w-full mx-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#7A6E66] hover:text-[#1C1814] text-xl cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}
