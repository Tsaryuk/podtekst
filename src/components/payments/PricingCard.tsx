import Button from '@/components/ui/Button'

interface PricingCardProps {
  name: string
  price: string
  features: string[]
  highlighted?: string[]
  variant: 'free' | 'start' | 'pro'
  current?: boolean
  popular?: boolean
  onSelect?: () => void
}

export default function PricingCard({
  name,
  price,
  features,
  highlighted = [],
  variant,
  current,
  popular,
  onSelect,
}: PricingCardProps) {
  const isDark = variant === 'pro'

  return (
    <div
      className={[
        'relative rounded-[var(--r-md)] p-7 flex flex-col',
        isDark
          ? 'bg-[var(--bg-ink-dark)] text-[var(--text-on-dark)]'
          : variant === 'start'
            ? 'bg-[var(--bg-surface)] border-2 border-[var(--rust)]'
            : 'bg-[var(--bg-surface)] border border-[var(--border)]',
      ].join(' ')}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--rust)] text-white text-[11px] px-3 py-1 rounded-[var(--r-pill)]">
          Популярный
        </span>
      )}

      <h3 className="text-subhead mb-1">{name}</h3>
      <p className="text-display mb-5">{price}</p>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li
            key={f}
            className={[
              'text-body-sm flex items-start gap-2',
              highlighted.includes(f) ? 'font-semibold' : '',
            ].join(' ')}
          >
            <span className={isDark ? 'text-[var(--text-on-dark)] opacity-50' : 'text-[var(--text-muted)]'}>
              {current ? '—' : '✓'}
            </span>
            {f}
          </li>
        ))}
      </ul>

      {current ? (
        <Button disabled size="full" className="opacity-40">
          Текущий план
        </Button>
      ) : variant === 'start' ? (
        <Button size="full" onClick={onSelect}>
          Начать 14 дней бесплатно
        </Button>
      ) : variant === 'pro' ? (
        <button
          onClick={onSelect}
          className="w-full py-[11px] bg-white text-[var(--bg-ink-dark)] rounded-[var(--r-pill)] text-[15px] cursor-pointer hover:bg-[var(--bg-page)] transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Выбрать Про
        </button>
      ) : null}
    </div>
  )
}
