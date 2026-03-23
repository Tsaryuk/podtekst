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
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="text-center mb-14">
        <h1 className="font-serif text-[28px] tracking-[-0.01em]">ПОДТЕКСТ</h1>
        <p className="font-body italic text-[15px] text-[#7A6E66] mt-2">
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
          {error && <p className="font-body text-sm text-[#B85C38]">{error}</p>}
          <Button type="submit" size="full" disabled={loading}>
            {loading ? 'Отправляю...' : 'Получить ссылку для входа'}
          </Button>
          <p className="font-body text-sm text-[#B0A59C] italic text-center">
            Письмо придёт за 30 секунд
          </p>
        </form>
      ) : (
        <div className="text-center animate-fade-up">
          <div className="text-5xl mb-5">✉️</div>
          <h2 className="font-serif text-xl">Проверьте почту</h2>
          <p className="font-body text-sm text-[#7A6E66] mt-3">Ссылка действует 10 минут</p>
        </div>
      )}
    </div>
  )
}
