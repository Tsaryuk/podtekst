'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { updateProfile } from '@/lib/store/diary'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [time, setTime] = useState('21:00')

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      updateProfile({ name: name.trim() })
      setStep(2)
    } else if (step === 2) {
      updateProfile({ notification_time: time })
      setStep(3)
    }
  }

  const handleFinish = () => {
    updateProfile({ onboarding_done: true })
    router.push('/record')
  }

  const handleSkip = () => {
    updateProfile({ onboarding_done: true })
    router.push('/')
  }

  return (
    <div className="max-w-[400px] mx-auto">
      {/* Прогресс-бар */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: s <= step ? 'var(--rust)' : 'var(--bg-muted)',
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="result-enter">
          <h1
            className="mb-8"
            style={{ font: 'italic 400 24px/1.3 var(--font-serif)' }}
          >
            Как вас зовут?
          </h1>
          <Input
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="mt-8">
            <Button onClick={handleNext} disabled={!name.trim()}>
              Далее &rarr;
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="result-enter">
          <h1
            className="mb-4"
            style={{ font: 'italic 400 24px/1.3 var(--font-serif)' }}
          >
            Когда напомнить записать дневник?
          </h1>
          <p className="text-body-sm text-[var(--text-muted)] italic mb-8">
            Лучше вечером — когда день уже прожит
          </p>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <div className="mt-8">
            <Button onClick={handleNext}>Далее &rarr;</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="result-enter">
          <h1
            className="mb-4"
            style={{ font: 'italic 400 24px/1.3 var(--font-serif)' }}
          >
            Первая запись — прямо сейчас
          </h1>
          <p className="text-body text-[var(--text-secondary)] mb-8">
            Расскажите о сегодняшнем дне. 2–3 минуты, голосом или текстом.
            Это ваша первая сессия — ничего лишнего.
          </p>
          <Button onClick={handleFinish}>
            Начать первую запись &rarr;
          </Button>
          <div className="mt-4">
            <button
              onClick={handleSkip}
              className="text-[var(--rust)] text-body-sm underline-offset-2 hover:underline cursor-pointer"
            >
              Можно пропустить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
