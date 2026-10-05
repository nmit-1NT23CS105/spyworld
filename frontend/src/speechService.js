// AI Real Hero Voice & Web Speech API Service

let currentUtterance = null
let currentAudioPlayer = null

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function isRecognitionSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

// Clean story text of brackets and technical cues so dialogue delivery is pure cinema
export function cleanTextForSpeech(text) {
  if (!text) return ''
  return text
    .replace(/\[CAMERA:[^\]]*\]/gi, '')
    .replace(/🎬[^\n]*/g, '')
    .replace(/\[CUT TO[^\]]*\]/gi, '')
    .replace(/\[([A-Z0-9\s_'-]+)\]:/g, '$1 says:')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[>•—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 🎙️ PLAY REAL AI HERO VOICE
// Calls Gemini 2.5 Flash TTS with specialized vocal directing for Rocky Bhai, Baahubali, Pushpa, Bheem, and Deva.
export async function playHeroVoice({ text, movie = 'KGF', hero = 'Rocky Bhai', onStart = null, onEnd = null }) {
  stopSpeaking()

  const clean = cleanTextForSpeech(text)
  if (!clean) {
    onEnd?.()
    return
  }

  // 1. Attempt High-Fidelity Real AI Hero Voice via Backend Gemini TTS Endpoint
  try {
    const res = await fetch('http://localhost:8080/api/game/hero-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean,
        movie: movie,
        hero: hero
      })
    })

    if (res.ok && res.status === 200) {
      const blob = await res.blob()
      if (blob.size > 200) {
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        currentAudioPlayer = audio

        audio.onplay = () => {
          onStart?.({ type: 'gemini_real_voice', hero })
        }

        audio.onended = () => {
          currentAudioPlayer = null
          URL.revokeObjectURL(audioUrl)
          onEnd?.()
        }

        audio.onerror = () => {
          currentAudioPlayer = null
          URL.revokeObjectURL(audioUrl)
          speakWithHeroTuning(clean, movie, onStart, onEnd)
        }

        await audio.play()
        return
      }
    }
  } catch (err) {
    console.warn('Real AI Hero Voice stream fallback to tuned vocal engine:', err)
  }

  // 2. Seamless Fallback with Movie Hero Pitch & Cadence Tuning
  speakWithHeroTuning(clean, movie, onStart, onEnd)
}

// Fallback voice tuning using Web Speech API with hero-specific formant settings
export function speakWithHeroTuning(clean, movie = 'KGF', onStart = null, onEnd = null) {
  if (!isSpeechSupported()) {
    onEnd?.()
    return
  }

  const m = (movie || '').toUpperCase()
  let pitch = 0.82
  let rate = 0.98

  if (m.includes('KGF')) {
    pitch = 0.74  // Extremely deep, raspy Rocky Bhai baritone
    rate = 0.92
  } else if (m.includes('BAAHUBALI')) {
    pitch = 0.84  // Resonant royal Baahubali authority
    rate = 0.96
  } else if (m.includes('PUSHPA')) {
    pitch = 0.88  // Rugged, punchy Pushpa Raj attitude
    rate = 1.04
  } else if (m.includes('RRR')) {
    pitch = 0.78  // Primal Bheem warrior roar
    rate = 1.02
  } else if (m.includes('SALAAR')) {
    pitch = 0.68  // Deva cold, menacing low bass
    rate = 0.88
  }

  try {
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.rate = rate
    utterance.pitch = pitch

    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.includes('David') || 
        v.name.includes('Mark') || 
        v.name.includes('George') || 
        v.name.includes('Google UK English Male') || 
        v.name.includes('Natural')
      )
    ) || voices.find(v => v.lang.startsWith('en'))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      currentUtterance = utterance
      onStart?.({ type: 'tuned_voice' })
    }

    utterance.onend = () => {
      currentUtterance = null
      onEnd?.()
    }

    utterance.onerror = () => {
      currentUtterance = null
      onEnd?.()
    }

    window.speechSynthesis.speak(utterance)
  } catch (e) {
    console.warn('Speech synthesis error:', e)
    onEnd?.()
  }
}

export function speakText(text, onStart = null, onEnd = null) {
  speakWithHeroTuning(cleanTextForSpeech(text), 'KGF', onStart, onEnd)
}

export function stopSpeaking() {
  if (currentAudioPlayer) {
    try {
      currentAudioPlayer.pause()
      currentAudioPlayer.currentTime = 0
    } catch (e) {}
    currentAudioPlayer = null
  }

  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel()
      currentUtterance = null
    } catch (e) {
      console.warn('Speech cancel error:', e)
    }
  }
}

export function isCurrentlySpeaking() {
  if (currentAudioPlayer && !currentAudioPlayer.paused) return true
  return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.speaking : false
}

export function createSpeechRecognizer({ onResult, onError, onStart, onEnd }) {
  if (!isRecognitionSupported()) return null

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRec()

  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = 'en-US'

  recognition.onstart = () => onStart?.()
  recognition.onend = () => onEnd?.()
  recognition.onerror = (e) => onError?.(e)
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || ''
    if (transcript.trim()) {
      onResult?.(transcript.trim())
    }
  }

  return recognition
}
