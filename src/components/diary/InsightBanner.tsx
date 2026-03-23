interface InsightBannerProps {
  text: string
}

export default function InsightBanner({ text }: InsightBannerProps) {
  return (
    <div className="bg-[var(--bg-ink-dark)] rounded-[var(--r-md)] p-[24px_30px] result-enter">
      <p className="text-label opacity-45 text-[var(--text-on-dark)] mb-3">
        Ключевой инсайт
      </p>
      <p
        className="text-[var(--text-on-dark)]"
        style={{ font: 'italic 400 20px/1.55 var(--font-serif)' }}
      >
        {text}
      </p>
    </div>
  )
}
