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

  const handleSave = () => {
    onSaveEdit?.(editText)
    setEditing(false)
  }

  return (
    <Card variant="gold" className="result-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">✏️</span>
          <h3 className="text-subhead text-[var(--gold)]">Эссе дня</h3>
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
            className="w-full bg-white border border-[var(--gold-border)] rounded-[10px] p-4 text-essay text-[#2A2018] focus:outline-none focus:border-[var(--gold)] resize-none min-h-[200px]"
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <div className="flex gap-2 mt-3">
            <Button size="small" onClick={handleSave}>Сохранить</Button>
            <Button variant="ghost" size="small" onClick={() => setEditing(false)}>Отмена</Button>
          </div>
        </div>
      ) : (
        <div className="text-essay text-[#2A2018] whitespace-pre-line">
          {essay}
          {streaming && <span className="inline-block w-[2px] h-[18px] bg-[var(--gold)] ml-0.5 animate-[blink_1s_ease-in-out_infinite]" />}
        </div>
      )}
    </Card>
  )
}
