// Web Audio API Synthesizer - 100% zero-asset, high-impact cinema sound effects

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playSfx(type) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    switch (type) {
      case 'sword_clash':
      case 'blade_whoosh': {
        // Metallic sharp impact and ringing ping
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(1400, now)
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.25)
        gain.gain.setValueAtTime(0.35, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.3)

        // Harmonic metallic ring
        const ringOsc = ctx.createOscillator()
        const ringGain = ctx.createGain()
        ringOsc.type = 'sine'
        ringOsc.frequency.setValueAtTime(2800, now)
        ringOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.4)
        ringGain.gain.setValueAtTime(0.2, now)
        ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
        ringOsc.connect(ringGain)
        ringGain.connect(ctx.destination)
        ringOsc.start(now)
        ringOsc.stop(now + 0.45)
        break
      }

      case 'punch':
      case 'damage': {
        // Heavy bass body impact
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(160, now)
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.22)
        gain.gain.setValueAtTime(0.4, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.25)
        break
      }

      case 'bass_drop': {
        // Cinematic sub-bass rumble drop
        const sub = ctx.createOscillator()
        const subGain = ctx.createGain()
        sub.type = 'sine'
        sub.frequency.setValueAtTime(110, now)
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.6)
        subGain.gain.setValueAtTime(0.5, now)
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
        sub.connect(subGain)
        subGain.connect(ctx.destination)
        sub.start(now)
        sub.stop(now + 0.7)
        break
      }

      case 'mass_whistle': {
        // High-pitched dual stadium whistle with vibrato
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.setValueAtTime(2350, now)
        osc1.frequency.linearRampToValueAtTime(2700, now + 0.18)
        osc1.frequency.linearRampToValueAtTime(2450, now + 0.4)

        osc2.frequency.setValueAtTime(2850, now)
        osc2.frequency.linearRampToValueAtTime(3100, now + 0.18)
        osc2.frequency.linearRampToValueAtTime(2900, now + 0.4)

        gain.gain.setValueAtTime(0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)
        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 0.45)
        osc2.stop(now + 0.45)
        break
      }

      case 'gunshot': {
        // Explosive burst
        const bufferSize = ctx.sampleRate * 0.3
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1000, now)
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.3)
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.6, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        noise.start(now)
        break
      }

      case 'matchstick': {
        // Friction snap
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(800, now)
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.08)
        break
      }

      case 'relic_equip': {
        // Bright metallic chime
        const notes = [880, 1320, 1760]
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.04)
          gain.gain.setValueAtTime(0.15, now + idx * 0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.22)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + idx * 0.04)
          osc.stop(now + idx * 0.04 + 0.22)
        })
        break
      }

      case 'qte_tick': {
        // Urgent woodblock tick
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(950, now)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.06)
        break
      }

      case 'crowd_cheer':
      case 'cheer':
      case 'victory': {
        // Heroic triumphant triad
        const chords = [523.25, 659.25, 783.99, 1046.50] // C major chord
        chords.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now + i * 0.06)
          gain.gain.setValueAtTime(0.25, now + i * 0.06)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.8)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + i * 0.06)
          osc.stop(now + i * 0.06 + 0.8)
        })
        break
      }

      case 'spy_reveal': {
        // Shimmering mystery chord for card flip
        const notes = [440, 554.37, 659.25, 830.61] // A major 7th mystery shimmer
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.05)
          gain.gain.setValueAtTime(0.2, now + idx * 0.05)
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + idx * 0.05)
          osc.stop(now + idx * 0.05 + 0.4)
        })
        break
      }

      case 'spy_vote': {
        // Dramatic heavy gavel / stamp impact
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(180, now)
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18)
        gain.gain.setValueAtTime(0.4, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.22)
        break
      }

      case 'spy_eliminate': {
        // Dramatic low gong hit with dissonance
        const freqs = [110, 155.56, 220]
        freqs.forEach(f => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(f, now)
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.8)
          gain.gain.setValueAtTime(0.25, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.85)
        })
        break
      }

      case 'heartbeat': {
        // Double-thump acoustic heartbeat ("lub-dub")
        const osc1 = ctx.createOscillator()
        const gain1 = ctx.createGain()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(75, now)
        osc1.frequency.exponentialRampToValueAtTime(32, now + 0.12)
        gain1.gain.setValueAtTime(0.5, now)
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc1.start(now)
        osc1.stop(now + 0.14)

        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(65, now + 0.13)
        osc2.frequency.exponentialRampToValueAtTime(28, now + 0.25)
        gain2.gain.setValueAtTime(0.38, now + 0.13)
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.27)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start(now + 0.13)
        osc2.stop(now + 0.27)
        break
      }

      case 'timer_tick': {
        // Subtle soft mechanical watch tick
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(1100, now)
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.035)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.035)
        break
      }

      case 'emoji_pop': {
        // Cheerful bubble pop sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
        gain.gain.setValueAtTime(0.16, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.09)
        break
      }

      case 'click':
      default: {
        // Crisp tactile click
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, now)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.04)
        break
      }
    }
  } catch (err) {
    console.warn('Audio FX synthesis hitch (harmless):', err)
  }
}
