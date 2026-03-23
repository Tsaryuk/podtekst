'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-12">
        <h1 style={{ font: '400 28px/1.2 var(--font-serif)' }}>
          ПОДТЕКСТ
        </h1>
        <p className="mt-3 text-[16px] italic text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
          Твой голос. Твой психоаналитик.
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Электронная почта"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <p className="text-body-sm text-[var(--rust)]">{error}</p>
          )}
          <Button type="submit" size="full" disabled={loading}>
            {loading ? 'Отправляю...' : 'Получить ссылку для входа'}
          </Button>
          <p className="text-body-sm text-[var(--text-faint)] italic text-center">
            Письмо придёт за 30 секунд
          </p>
        </form>
      ) : (
        <div className="text-center result-enter">
          <div className="text-5xl mb-4">✉️</div>
          <h2 style={{ font: '400 20px/1.3 var(--font-serif)' }}>
            Проверьте почту
          </h2>
          <p className="mt-3 text-[var(--text-muted)] text-body-sm">
            Ссылка действует 10 минут
          </p>
        </div>
      )}
    </div>
  )
}
