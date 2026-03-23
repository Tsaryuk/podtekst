import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ПОДТЕКСТ — Психоаналитический дневник',
  description: 'Твой голос. Твой психоаналитик. Речевой дневник с AI-анализом паттернов мышления.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1C1814',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
