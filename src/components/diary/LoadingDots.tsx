'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  'Читаю между строк...',
  'Ищу паттерны в словах...',
  'Слышу то, что не сказано...',
  'Превращаю в эссе...',
  'Формирую рекомендации...',
]

export default function LoadingDots() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--rust)]"
            style={{
              animation: 'ldot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p
        className="text-body-sm text-[var(--text-muted)] italic transition-opacity duration-300"
        key={msgIndex}
      >
        {MESSAGES[msgIndex]}
      </p>
    </div>
  )
}
