/**
 * Voice must start inside the user-click call stack (Chrome).
 * Greeting TTS + mic permission are primed here; VoiceMode only attaches UI.
 */

import {
  speakHindiSync,
  stopSpeaking,
  unlockSpeechSynthesis,
  preloadHindiVoice,
} from './speakHindi'

export type VoiceSessionPhase = 'idle' | 'greeting' | 'ready' | 'closed'

type Session = {
  phase: VoiceSessionPhase
  greeting: string
  epoch: number
}

type Listener = (session: Session) => void

let session: Session = { phase: 'idle', greeting: '', epoch: 0 }
const listeners = new Set<Listener>()
let greetingDoneCallbacks: Array<() => void> = []

const emit = () => {
  listeners.forEach((l) => l(session))
}

export function subscribeVoiceSession(listener: Listener) {
  listeners.add(listener)
  listener(session)
  return () => {
    listeners.delete(listener)
  }
}

export function getVoiceSession() {
  return session
}

/** Warm voices as soon as portal mounts — so click speak is sync. */
export function preloadVoiceSession() {
  unlockSpeechSynthesis()
  void preloadHindiVoice()
}

/** Call ONLY from a click/tap handler — unlocks TTS + mic, speaks greeting immediately. */
export function beginVoiceFromGesture(greeting: string) {
  const text = greeting.trim()
  session = { phase: 'greeting', greeting: text, epoch: session.epoch + 1 }
  const epoch = session.epoch
  greetingDoneCallbacks = []
  emit()

  unlockSpeechSynthesis()

  // Mic permission in the same gesture so SpeechRecognition can start after TTS
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
    void navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop())
      })
      .catch(() => {
        /* user can still tap Boliye */
      })
  }

  // SYNC speak — must stay on the click call stack for Chrome
  speakHindiSync(text, () => {
    if (session.epoch !== epoch) return
    session = { ...session, phase: 'ready' }
    emit()
    const cbs = greetingDoneCallbacks
    greetingDoneCallbacks = []
    cbs.forEach((cb) => cb())
  })
}

export function onVoiceGreetingDone(cb: () => void) {
  if (session.phase === 'ready') {
    cb()
    return
  }
  if (session.phase === 'greeting') {
    greetingDoneCallbacks.push(cb)
  }
}

export function endVoiceSession() {
  session = { phase: 'closed', greeting: session.greeting, epoch: session.epoch + 1 }
  greetingDoneCallbacks = []
  stopSpeaking()
  emit()
}

export function buildVoiceGreeting(kind: 'manufacturer' | 'admin', firstName: string) {
  const name = firstName || 'ji'
  return kind === 'admin'
    ? `Namaste ${name} ji! Main ForgeLink AI hoon. Verification, RFQ, manufacturers ya revenue poochiye.`
    : `Namaste ${name} ji! Main ForgeLink AI hoon. RFQ, quotation, products ya analytics poochiye.`
}
