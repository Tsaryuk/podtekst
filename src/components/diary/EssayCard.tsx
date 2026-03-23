'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface EssayCardProps {
  essay: string
  streaming?: boolean
  onSaveEdit?: (text: string) => void
}

export default function EssayCard({ essay, streaming, onSaveEdit }: EssayCardProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(essay)

  const handleSave = () => { onSaveEdit?.(editText); setEditing(false) }

  return (
    <Card variant="gold" className="animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">✏️</span>
          <h3 className="font-serif text-[17px] font-semibold text-[#8A6910]">Эссе дня</h3>
        </div>
        {!editing && !streaming && (
          <Button variant="secondary" size="small" onClick={() => { setEditText(essay); setEditing(true) }}>
            Редактировать
          </Button>
        )}
      </div>

      {editing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="font-body w-full bg-white border border-[rgba(138,105,16,0.18)] rounded-[10px] p-4 text-[15px] leading-[1.9] text-[#2A2018] focus:outline-none focus:border-[#8A6910] resize-none min-h-[200px]"
          />
          <div className="flex gap-2 mt-3">
            <Button size="small" onClick={handleSave}>Сохранить</Button>
            <Button variant="ghost" size="small" onClick={() => setEditing(false)}>Отмена</Button>
          </div>
        </div>
      ) : (
        <div className="font-body text-[15px] leading-[1.9] text-[#2A2018] whitespace-pre-line">
          {essay}
          {streaming && <span className="inline-block w-[2px] h-[18px] bg-[#8A6910] ml-0.5 animate-blink" />}
        </div>
      )}
    </Card>
  )
}
