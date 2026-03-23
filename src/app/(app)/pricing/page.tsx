'use client'

import { useState } from 'react'
import PricingCard from '@/components/payments/PricingCard'

const FAQ = [
  { q: 'Что будет после триала?', a: 'Если вы не привяжете карту, план автоматически переключится на Free. Ваши записи останутся, но доступ к архиву старше 7 дней будет ограничен.' },
  { q: 'Как отменить?', a: 'В настройках → Подписка → Отменить подписку. Подписка будет действовать до конца оплаченного периода.' },
  { q: 'Данные в безопасности?', a: 'Все данные хранятся в зашифрованном виде. Мы не продаём и не передаём ваши записи третьим лицам. Вы можете в любой момент экспортировать или удалить свои данные.' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-display mb-2">Выберите план</h1>
        <p className="text-body italic text-[var(--rust)]">
          14 дней Старта бесплатно, без карты
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PricingCard
          name="Free"
          price="0₽"
          variant="free"
          current
          features={[
            '5 записей в месяц',
            '3 паттерна в анализе',
            'Архив за 7 дней',
            'Только текстовый ввод',
          ]}
        />
        <PricingCard
          name="Старт"
          price="399₽/мес"
          variant="start"
          popular
          features={[
            '30 записей в месяц',
            'Полный анализ (12 паттернов)',
            'Голосовой ввод (10 мин)',
            'Полный архив',
            'Еженедельный отчёт',
          ]}
        />
        <PricingCard
          name="Про"
          price="999₽/мес"
          variant="pro"
          features={[
            'Безлимитные записи',
            'Полный анализ (12 паттернов)',
            'Голосовой ввод (60 мин)',
            'Психологический портрет',
            'Месячный отчёт',
            'PDF-экспорт эссе',
            'Приоритетная поддержка',
          ]}
          highlighted={['Психологический портрет', 'Месячный отчёт', 'PDF-экспорт эссе']}
        />
      </div>

      {/* FAQ */}
      <div className="mt-10">
        {FAQ.map((item, i) => (
          <div key={i} className="border-b border-[#E6E0D6]">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
            >
              <span className="text-body text-[var(--text-secondary)]">{item.q}</span>
              <span className="text-[var(--text-faint)] text-lg ml-4">
                {openFaq === i ? '−' : '+'}
              </span>
            </button>
            {openFaq === i && (
              <p className="text-body-sm text-[var(--text-muted)] pb-4 result-enter">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
