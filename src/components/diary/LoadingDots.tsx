'use client'

import { useState, useEffect } from 'react'

const MSGS = ['Читаю между строк...', 'Ищу паттерны в словах...', 'Слышу то, что не сказано...', 'Превращаю в эссе...', 'Формирую рекомендации...']

export default function LoadingDots() {
  const [idx, setIdx] = useState(0)
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % MSGS.length), 2200); return () => clearInterval(t) }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#B85C38]" style={{ animation: 'ldot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <p className="font-body text-sm text-[#7A6E66] italic" key={idx}>{MSGS[idx]}</p>
    </div>
  )
}
