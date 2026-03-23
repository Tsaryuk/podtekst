'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface PaywallModalProps { open: boolean; onClose: () => void; feature?: string }

export default function PaywallModal({ open, onClose, feature }: PaywallModalProps) {
  const router = useRouter()
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-serif text-[22px] mb-4">Это — в платном плане</h2>
      <p className="font-body text-[15px] text-[#4A3F37] mb-6">
        {feature || 'Эта функция доступна на платных тарифах.'} Попробуйте 14 дней бесплатно — без карты.
      </p>
      <Button size="full" onClick={() => { onClose(); router.push('/pricing') }}>
        Попробовать бесплатно 14 дней
      </Button>
      <div className="text-center mt-3">
        <button onClick={() => { onClose(); router.push('/pricing') }} className="font-body text-sm text-[#B85C38] hover:underline underline-offset-2 cursor-pointer">
          Посмотреть все тарифы
        </button>
      </div>
    </Modal>
  )
}
