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

export default function PricingCard({ name, price, features, highlighted = [], variant, current, popular, onSelect }: PricingCardProps) {
  const isDark = variant === 'pro'

  return (
    <div className={`relative rounded-[14px] p-6 sm:p-7 flex flex-col ${
      isDark ? 'bg-[#1C1814] text-[#F7F4EE]'
      : variant === 'start' ? 'bg-white border-2 border-[#B85C38]'
      : 'bg-white border border-[rgba(0,0,0,0.07)]'
    }`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B85C38] text-white text-[11px] px-3 py-1 rounded-full">
          Популярный
        </span>
      )}
      <h3 className="font-serif text-lg mb-1">{name}</h3>
      <p className="font-serif text-[28px] mb-5">{price}</p>
      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className={`font-body text-sm flex items-start gap-2 ${highlighted.includes(f) ? 'font-medium' : ''}`}>
            <span className={isDark ? 'opacity-50' : 'text-[#7A6E66]'}>{current ? '—' : '✓'}</span>
            {f}
          </li>
        ))}
      </ul>
      {current ? (
        <Button disabled size="full">Текущий план</Button>
      ) : variant === 'start' ? (
        <Button size="full" onClick={onSelect}>Начать 14 дней бесплатно</Button>
      ) : variant === 'pro' ? (
        <button onClick={onSelect} className="font-body w-full py-[11px] bg-white text-[#1C1814] rounded-full text-[15px] cursor-pointer hover:bg-[#F7F4EE] transition-colors">
          Выбрать Про
        </button>
      ) : null}
    </div>
  )
}
