interface InsightBannerProps {
  text: string
}

export default function InsightBanner({ text }: InsightBannerProps) {
  return (
    <div className="bg-[#1C1814] rounded-[14px] px-7 py-6 animate-fade-up">
      <p className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#F7F4EE] opacity-45 mb-3">
        Ключевой инсайт
      </p>
      <p className="font-serif italic text-[18px] sm:text-xl leading-[1.55] text-[#F7F4EE]">
        {text}
      </p>
    </div>
  )
}
