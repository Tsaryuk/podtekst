'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface RecordButtonProps {
  onTranscription: (text: string) => void
}

export default function RecordButton({ onTranscription }: RecordButtonProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'transcribing'>('idle')
  const [timer, setTimer] = useState(0)
  const [bars, setBars] = useState([0.3, 0.5, 0.4, 0.6, 0.3])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)

  const updateBars = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(data)
      const step = Math.floor(data.length / 5)
      const newBars = Array.from({ length: 5 }, (_, i) => {
        const val = data[i * step] / 255
        return Math.max(0.15, val)
      })
      setBars(newBars)
    }
    if (state === 'recording') {
      animFrameRef.current = requestAnimationFrame(updateBars)
    }
  }, [state])

  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
      animFrameRef.current = requestAnimationFrame(updateBars)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [state, updateBars])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Web Audio API для визуализации
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      // MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        audioCtx.close()

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setState('transcribing')

        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()

          if (data.text) {
            onTranscription(data.text)
          }
        } catch (err) {
          console.error('Transcription failed:', err)
        }

        setState('idle')
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000)
      setState('recording')
      setTimer(0)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Нет доступа к микрофону. Разрешите доступ в настройках браузера.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleToggle = () => {
    if (state === 'idle') {
      startRecording()
    } else if (state === 'recording') {
      stopRecording()
    }
  }

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={state === 'transcribing'}
          className={[
            'flex items-center gap-2 px-5 py-[10px] rounded-[var(--r-pill)] border-[1.5px] transition-all duration-200 cursor-pointer',
            state === 'recording'
              ? 'bg-[var(--rust)] border-[var(--rust)] text-white'
              : 'bg-transparent border-[var(--rust)] text-[var(--rust)]',
            state === 'recording' ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : '',
            state === 'transcribing' ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {state === 'idle' && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--rust)]" />
              <span className="text-[14px]" style={{ fontFamily: 'var(--font-body)' }}>
                Начать запись
              </span>
            </>
          )}
          {state === 'recording' && (
            <>
              <span className="w-2.5 h-2.5 rounded-sm bg-white" />
              <span className="text-[14px]" style={{ fontFamily: 'var(--font-body)' }}>
                Остановить
              </span>
            </>
          )}
          {state === 'transcribing' && (
            <span className="text-[14px]" style={{ fontFamily: 'var(--font-body)' }}>
              Перевожу в текст...
            </span>
          )}
        </button>

        {state === 'recording' && (
          <span className="text-body-sm text-[var(--text-muted)] tabular-nums">
            {formatTime(timer)}
          </span>
        )}
      </div>

      {/* Waveform */}
      {state === 'recording' && (
        <div className="flex items-end gap-[3px] h-8">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[4px] rounded-full bg-[var(--rust)] transition-all duration-150"
              style={{ height: `${h * 32}px` }}
            />
          ))}
        </div>
      )}

      {state === 'idle' && (
        <p className="text-body-sm text-[var(--text-muted)] italic">
          или введите текст ниже
        </p>
      )}
    </div>
  )
}
