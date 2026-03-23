export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-[480px] mx-auto px-6 py-8">
      {children}
    </div>
  )
}
