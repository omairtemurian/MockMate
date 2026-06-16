import { useCallback, useRef } from 'react'
import { BACKEND_URL } from '../utils/config'
import { getStoredToken } from '../context/AuthContext'

function browserSpeak(text, onEnd) {
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 1.0
  utter.pitch = 1.0
  utter.onend = () => { if (onEnd) onEnd() }
  utter.onerror = () => { if (onEnd) onEnd() }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}

export function useTTS({ language = 'en-US' } = {}) {
  const audioRef = useRef(null)
  const genRef   = useRef(0)

  const cancel = useCallback(() => {
    genRef.current += 1
    window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
  }, [])

  const speak = useCallback((text, onEnd) => {
    genRef.current += 1
    const myGen = genRef.current

    window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }

    if (!text || !text.trim()) {
      if (onEnd) onEnd()
      return
    }

    const token = getStoredToken()

    fetch(`${BACKEND_URL}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`TTS ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (genRef.current !== myGen) return
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio

        audio.onended = () => {
          if (genRef.current !== myGen) return
          URL.revokeObjectURL(url)
          audioRef.current = null
          if (onEnd) onEnd()
        }

        audio.onerror = () => {
          URL.revokeObjectURL(url)
          audioRef.current = null
          if (genRef.current !== myGen) return
          if (onEnd) onEnd()
        }

        audio.play().catch(() => {
          if (genRef.current !== myGen) return
          if (onEnd) onEnd()
        })
      })
      .catch(() => {
        if (genRef.current !== myGen) return
        // ElevenLabs unavailable — fall back to browser speech synthesis
        browserSpeak(text, onEnd)
      })
  }, [])

  const isSupported = true

  return { speak, cancel, isSupported }
}
