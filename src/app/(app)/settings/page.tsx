'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import { getProfile, updateProfile, getEntries } from '@/lib/store/diary'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [notifyEnabled, setNotifyEnabled] = useState(true)
  const [notifyTime, setNotifyTime] = useState('21:00')
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    const p = getProfile()
    setName(p.name)
    setNotifyTime(p.notification_time)
    setPlan(p.plan)
  }, [])

  const handleNameSave = () => {
    updateProfile({ name })
  }

  const handleTimeChange = (t: string) => {
    setNotifyTime(t)
    updateProfile({ notification_time: t })
  }

  const handleExportJSON = () => {
    const entries = getEntries()
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'podtekst-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1 className="text-display mb-8">Настройки</h1>

      {/* Аккаунт */}
      <section className="mb-8">
        <p className="text-label text-[var(--text-muted)] mb-4">Аккаунт</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button size="small" onClick={handleNameSave}>Сохранить</Button>
        </div>
        <p className="text-body-sm text-[var(--text-faint)] mt-3">
          Email: demo@podtekst.app (только чтение)
        </p>
      </section>

      {/* Уведомления */}
      <section className="mb-8">
        <p className="text-label text-[var(--text-muted)] mb-4">Уведомления</p>
        <Toggle
          checked={notifyEnabled}
          onChange={setNotifyEnabled}
          label="Ежедневное напоминание"
        />
        {notifyEnabled && (
          <div className="mt-4">
            <Input
              type="time"
              value={notifyTime}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Подписка */}
      <section className="mb-8">
        <p className="text-label text-[var(--text-muted)] mb-4">Подписка</p>
        <p className="text-body text-[var(--text-secondary)] mb-3">
          Текущий тариф: <span className="font-semibold capitalize">{plan}</span>
        </p>
        <div className="flex gap-3">
          <Link href="/pricing">
            <Button variant="secondary" size="small">Изменить тариф</Button>
          </Link>
          {plan !== 'free' && (
            <button className="text-[var(--rust)] text-body-sm hover:underline underline-offset-2 cursor-pointer">
              Отменить подписку
            </button>
          )}
        </div>
      </section>

      {/* Данные */}
      <section>
        <p className="text-label text-[var(--text-muted)] mb-4">Данные</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleExportJSON}
            className="text-left text-body-sm text-[var(--text-secondary)] hover:text-[var(--rust)] cursor-pointer"
          >
            Экспортировать все записи (JSON)
          </button>
          <button className="text-left text-body-sm text-[var(--text-muted)] cursor-not-allowed opacity-50">
            Экспортировать эссе (PDF) — скоро
          </button>
          <button className="text-left text-body-sm text-[var(--rust)] hover:underline underline-offset-2 cursor-pointer mt-4">
            Удалить аккаунт
          </button>
        </div>
      </section>
    </div>
  )
}
