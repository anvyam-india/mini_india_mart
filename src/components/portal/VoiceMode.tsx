import { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  hasHindiVoice,
  preloadHindiVoice,
  speakHindi,
  stopSpeaking,
  unlockSpeechSynthesis,
} from '../../lib/speakHindi'
import {
  beginVoiceFromGesture,
  buildVoiceGreeting,
  endVoiceSession,
  getVoiceSession,
  onVoiceGreetingDone,
  subscribeVoiceSession,
} from '../../lib/voiceSession'
import { ForgeAiAvatar } from '../ai/ForgeAiAvatar'
import { answerPortalQuery, type AiResult } from './portalAi'
import { SIDEBAR_WIDTH, usePortalUI } from './PortalUIContext'

type VoiceState = 'greeting' | 'listening' | 'thinking' | 'speaking' | 'idle'

interface Turn {
  user: string
  ai: string
}

type SpeechRec = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort?: () => void
  onstart: (() => void) | null
  onresult: ((e: Event) => void) | null
  onerror: ((e: Event & { error?: string }) => void) | null
  onend: (() => void) | null
}

const THINK_MS = 350
/** Wait after TTS so speaker echo dies before mic opens */
const LISTEN_DELAY_MS = 1100

function normalizeForEcho(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True if heard text is mostly the AI's own last line (speaker → mic echo) */
function isEchoOf(heard: string, spoken: string) {
  const a = normalizeForEcho(heard)
  const b = normalizeForEcho(spoken)
  if (!a || !b) return false
  // Short fragments only count as echo when they appear inside AI's last line
  if (a.length < 5) return b.includes(a)
  if (b.includes(a) || a.includes(b)) return true
  const aw = new Set(a.split(' ').filter((w) => w.length > 2))
  const bw = b.split(' ').filter((w) => w.length > 2)
  if (aw.size === 0) return false
  let hit = 0
  bw.forEach((w) => {
    if (aw.has(w)) hit += 1
  })
  return hit / aw.size >= 0.55
}

export function VoiceMode({
  onClose,
  onResult,
}: {
  onClose: () => void
  onResult: (user: string, result: AiResult) => void
}) {
  const { config, collapsed } = usePortalUI()
  const { rfqs, verificationItems } = useApp()
  const firstName = config.user.name.split(' ')[0] || 'ji'
  const defaultGreeting = buildVoiceGreeting(config.kind, firstName)

  const existing = getVoiceSession()
  const seededGreeting =
    existing.phase === 'greeting' || existing.phase === 'ready'
      ? existing.greeting || defaultGreeting
      : defaultGreeting

  const [state, setState] = useState<VoiceState>(
    existing.phase === 'ready' ? 'idle' : 'speaking',
  )
  const [statusText, setStatusText] = useState(
    existing.phase === 'ready' ? 'Sun rahi hoon — aap boliye' : 'Namaste keh rahi hoon...',
  )
  const [noHindiVoice, setNoHindiVoice] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([{ user: '', ai: seededGreeting }])
  const [liveUserText, setLiveUserText] = useState('')
  const [micError, setMicError] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [noSpeechApi, setNoSpeechApi] = useState(false)

  const recognitionRef = useRef<SpeechRec | null>(null)
  const isSpeakingRef = useRef(existing.phase !== 'ready')
  const shouldListenRef = useRef(true)
  const listenLoopRef = useRef(0)
  const restartTimerRef = useRef<number | null>(null)
  const muteMicUntilRef = useRef(0)
  const lastSpokenRef = useRef(seededGreeting)
  const onResultRef = useRef(onResult)
  const startListeningRef = useRef<() => void>(() => {})
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const sessionStartRef = useRef(Date.now())
  const snapRef = useRef({ rfqs, verificationItems })
  const bootstrappedRef = useRef(false)

  onResultRef.current = onResult
  snapRef.current = { rfqs, verificationItems }

  const ttsStillPlaying = () =>
    typeof speechSynthesis !== 'undefined' && (speechSynthesis.speaking || speechSynthesis.pending)

  const canListen = () =>
    shouldListenRef.current &&
    !isSpeakingRef.current &&
    !ttsStillPlaying() &&
    Date.now() >= muteMicUntilRef.current

  const cancelScheduledListen = useCallback(() => {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
  }, [])

  const scheduleListen = useCallback(() => {
    cancelScheduledListen()
    if (!shouldListenRef.current || isSpeakingRef.current) return
    const wait = Math.max(LISTEN_DELAY_MS, muteMicUntilRef.current - Date.now())
    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null
      if (canListen()) startListeningRef.current()
      else if (shouldListenRef.current && !isSpeakingRef.current) scheduleListen()
    }, wait)
  }, [cancelScheduledListen])

  const stopListening = useCallback(() => {
    cancelScheduledListen()
    listenLoopRef.current += 1
    try {
      recognitionRef.current?.abort?.()
      recognitionRef.current?.stop()
    } catch {
      /* ignore */
    }
    recognitionRef.current = null
    setLiveUserText('')
  }, [cancelScheduledListen])

  const enterSpeaking = useCallback(
    (status: string) => {
      // Half-duplex: mic MUST be dead while TTS plays
      cancelScheduledListen()
      stopListening()
      isSpeakingRef.current = true
      muteMicUntilRef.current = Date.now() + 60_000
      setState('speaking')
      setStatusText(status)
      setLiveUserText('')
    },
    [cancelScheduledListen, stopListening],
  )

  const finishSpeaking = useCallback(
    (thenListen = true) => {
      // If browser still playing audio, wait — never open mic over TTS
      if (ttsStillPlaying()) {
        const poll = window.setInterval(() => {
          if (!ttsStillPlaying()) {
            window.clearInterval(poll)
            finishSpeaking(thenListen)
          }
        }, 200)
        window.setTimeout(() => window.clearInterval(poll), 10000)
        return
      }

      isSpeakingRef.current = false
      muteMicUntilRef.current = Date.now() + LISTEN_DELAY_MS
      setState('idle')
      setLiveUserText('')
      setStatusText(thenListen ? 'Sun rahi hoon — aap boliye' : 'Ready')
      setMicError(false)
      if (thenListen && shouldListenRef.current) scheduleListen()
    },
    [scheduleListen],
  )

  useEffect(() => {
    void preloadHindiVoice().then(() => setNoHindiVoice(!hasHindiVoice()))
    const w = window as Window & {
      SpeechRecognition?: unknown
      webkitSpeechRecognition?: unknown
    }
    if (!(w.SpeechRecognition || w.webkitSpeechRecognition)) setNoSpeechApi(true)
  }, [])

  useEffect(() => {
    sessionStartRef.current = Date.now()
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartRef.current) / 1000))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, liveUserText])

  // Attach to gesture-started session; if none, start gesture-safe fallback via tap UI
  useEffect(() => {
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true

    const current = getVoiceSession()

    if (current.phase === 'greeting' || current.phase === 'ready') {
      const g = current.greeting || defaultGreeting
      lastSpokenRef.current = g
      setTurns([{ user: '', ai: g }])
      if (current.phase === 'ready') {
        finishSpeaking(true)
      } else {
        enterSpeaking('Namaste keh rahi hoon...')
        onVoiceGreetingDone(() => finishSpeaking(true))
        // Safety only after TTS truly ends — never open mic over speech
        window.setTimeout(() => {
          if (isSpeakingRef.current && shouldListenRef.current && !ttsStillPlaying()) {
            finishSpeaking(true)
          }
        }, 16000)
      }
      return
    }

    // Opened without gesture session — speak now and ask user to tap if blocked
    unlockSpeechSynthesis()
    lastSpokenRef.current = defaultGreeting
    enterSpeaking('Namaste keh rahi hoon...')
    setTurns([{ user: '', ai: defaultGreeting }])
    beginVoiceFromGesture(defaultGreeting)
    onVoiceGreetingDone(() => finishSpeaking(true))
    window.setTimeout(() => {
      if (isSpeakingRef.current && shouldListenRef.current && !ttsStillPlaying()) {
        finishSpeaking(true)
      }
    }, 16000)
  }, [defaultGreeting, enterSpeaking, finishSpeaking])

  useEffect(() => {
    return subscribeVoiceSession((s) => {
      if (s.phase === 'ready' && isSpeakingRef.current) {
        finishSpeaking(true)
      }
    })
  }, [finishSpeaking])

  const speakAndRespond = useCallback(
    (userMsg: string, reply: string, result: AiResult) => {
      unlockSpeechSynthesis()
      lastSpokenRef.current = reply
      enterSpeaking('Bol rahi hoon...')
      setTurns((prev) => [...prev, { user: userMsg, ai: reply }])
      onResultRef.current(userMsg, result)
      void speakHindi(reply, () => {
        if (!shouldListenRef.current) {
          isSpeakingRef.current = false
          return
        }
        finishSpeaking(true)
      })
    },
    [enterSpeaking, finishSpeaking],
  )

  const processTranscript = useCallback(
    (transcript: string) => {
      const clean = transcript.trim()
      if (!clean || isSpeakingRef.current || ttsStillPlaying()) return
      // Drop speaker→mic echo of what AI just said
      if (isEchoOf(clean, lastSpokenRef.current)) {
        scheduleListen()
        return
      }
      setLiveUserText('')
      setState('thinking')
      setStatusText('Samajh rahi hoon...')
      window.setTimeout(() => {
        const result = answerPortalQuery(config.kind, clean, snapRef.current)
        speakAndRespond(clean, result.answer, result)
      }, THINK_MS)
    },
    [speakAndRespond, config.kind, scheduleListen],
  )

  const startListening = useCallback(() => {
    const w = window as Window & {
      SpeechRecognition?: new () => SpeechRec
      webkitSpeechRecognition?: new () => SpeechRec
    }
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!SR || !canListen()) {
      if (shouldListenRef.current && !isSpeakingRef.current) scheduleListen()
      return
    }

    stopListening()
    const loopId = listenLoopRef.current
    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      if (loopId !== listenLoopRef.current || !canListen()) {
        try {
          recognition.abort?.()
          recognition.stop()
        } catch {
          /* ignore */
        }
        return
      }
      setMicError(false)
      setState('listening')
      setStatusText('Sun rahi hoon...')
    }

    recognition.onresult = (e: Event) => {
      if (loopId !== listenLoopRef.current || !canListen()) return
      const ev = e as Event & {
        resultIndex: number
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>
      }
      let interim = ''
      let final = ''
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const tx = ev.results[i]?.[0]?.transcript ?? ''
        if (ev.results[i]?.isFinal) final += tx
        else interim += tx
      }
      // Ignore interim echo fragments while muted window still cooling down
      if (interim && !isEchoOf(interim, lastSpokenRef.current)) setLiveUserText(interim)
      if (final.trim()) {
        if (isEchoOf(final, lastSpokenRef.current)) {
          stopListening()
          scheduleListen()
          return
        }
        stopListening()
        processTranscript(final.trim())
      }
    }

    recognition.onerror = (e) => {
      if (e.error === 'aborted') return
      if (e.error === 'no-speech' && canListen()) {
        scheduleListen()
        return
      }
      if (e.error === 'network' || e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setMicError(true)
        setState('idle')
        setStatusText(
          e.error === 'not-allowed' || e.error === 'service-not-allowed'
            ? 'Mic permission chahiye — neeche “Boliye” dabayein'
            : 'Chrome speech issue — neeche “Boliye” dabayein',
        )
        return
      }
      setMicError(true)
      setState('idle')
      setStatusText('Mic issue — neeche “Boliye” dabayein')
    }

    recognition.onend = () => {
      recognitionRef.current = null
      if (canListen() && loopId === listenLoopRef.current) {
        scheduleListen()
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      window.setTimeout(() => {
        if (!canListen()) return
        try {
          recognition.start()
        } catch {
          setMicError(true)
          setState('idle')
          setStatusText('Mic start nahi hua — “Boliye” phir dabayein')
        }
      }, 280)
    }
  }, [stopListening, processTranscript, scheduleListen])

  startListeningRef.current = startListening

  const handleClose = () => {
    shouldListenRef.current = false
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
    stopListening()
    endVoiceSession()
    onClose()
  }

  // Cleanup on real close only — do not cancel gesture TTS on StrictMode remount
  useEffect(() => {
    shouldListenRef.current = true
    return () => {
      shouldListenRef.current = false
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current)
      listenLoopRef.current += 1
      try {
        recognitionRef.current?.abort?.()
        recognitionRef.current?.stop()
      } catch {
        /* ignore */
      }
      recognitionRef.current = null
    }
  }, [])

  const runExample = (ex: string) => {
    unlockSpeechSynthesis()
    stopListening()
    stopSpeaking()
    isSpeakingRef.current = false
    setLiveUserText('')
    setState('thinking')
    setStatusText('Jawab de rahi hoon...')
    const result = answerPortalQuery(config.kind, ex, snapRef.current)
    window.setTimeout(() => speakAndRespond(ex, result.answer, result), THINK_MS)
  }

  const replaySound = () => {
    unlockSpeechSynthesis()
    const lastAi = [...turns].reverse().find((t) => t.ai)?.ai
    if (!lastAi) return
    lastSpokenRef.current = lastAi
    enterSpeaking('Dobara bol rahi hoon...')
    void speakHindi(lastAi, () => finishSpeaking(true))
  }

  const tapEnableVoice = () => {
    // Fresh user gesture — restart greeting + mic unlock properly
    unlockSpeechSynthesis()
    const greeting = defaultGreeting
    lastSpokenRef.current = greeting
    setTurns([{ user: '', ai: greeting }])
    enterSpeaking('Namaste keh rahi hoon...')
    setMicError(false)
    beginVoiceFromGesture(greeting)
    onVoiceGreetingDone(() => finishSpeaking(true))
  }

  const isListening = state === 'listening'
  const isActive = isListening || state === 'speaking' || state === 'thinking'
  const leftOffset = collapsed ? 0 : SIDEBAR_WIDTH
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  return (
    <div
      className="fl-voice-overlay"
      style={{ ['--fl-sidebar-w' as string]: `${leftOffset}px` }}
      role="dialog"
      aria-label="ForgeLink AI Voice"
    >
      <header className="fl-voice-header">
        <div className="flex min-w-0 items-center gap-2.5 font-semibold text-white">
          <ForgeAiAvatar size="sm" />
          <div className="min-w-0">
            <span className="block truncate">ForgeLink AI Assistant</span>
            <span className="block truncate text-[10px] font-medium text-white/45">
              {config.name} · Speak in Hinglish / English
            </span>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-white/70 hover:bg-white/10"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="fl-voice-body">
        <button
          type="button"
          className={`fl-voice-orb-wrap ${state}`}
          onClick={tapEnableVoice}
          aria-label="Enable voice"
          title="Tap if sound / mic is not working"
        >
          <ForgeAiAvatar size="xl" pulse={isActive} listening={isListening} />
          {isListening ? (
            <div className="fl-voice-listen-pulse">
              <Mic className="h-3.5 w-3.5" />
            </div>
          ) : null}
        </button>

        <div className="fl-voice-status-pill">
          <span className={`fl-voice-status-dot ${isActive ? 'active' : ''}`} />
          <span>{statusText}</span>
          <span className="ml-2 tabular-nums opacity-80">{clock}</span>
        </div>

        {noSpeechApi ? (
          <p className="text-center text-xs text-amber-200/90">
            Speech Recognition nahi hai — Chrome use karein, ya example chips try karein
          </p>
        ) : null}
        {noHindiVoice && !noSpeechApi ? (
          <p className="text-center text-xs text-amber-200/90">
            Hindi pack nahi — Hinglish Indian English voice pe bolegi
          </p>
        ) : null}
        {micError ? (
          <p className="text-center text-xs text-amber-200/90">
            Mic band hai — neeche <strong>Boliye</strong> dabayein aur Allow karein
          </p>
        ) : null}

        <div className="fl-voice-chat" ref={chatScrollRef}>
          {turns.map((t, i) => (
            <div key={i} className="space-y-2">
              {t.user ? (
                <div className="fl-voice-bubble user">
                  <span className="text-[10px] font-semibold uppercase opacity-70">You</span>
                  <p>{t.user}</p>
                </div>
              ) : null}
              {t.ai ? (
                <div className="fl-voice-bubble ai">
                  <span className="text-[10px] font-semibold uppercase opacity-70">ForgeLink AI</span>
                  <p>{t.ai}</p>
                </div>
              ) : null}
            </div>
          ))}
          {liveUserText ? (
            <div className="fl-voice-bubble user opacity-80">
              <span className="text-[10px] font-semibold uppercase opacity-70">Listening...</span>
              <p>{liveUserText}</p>
            </div>
          ) : null}
        </div>

        <div className={`fl-voice-visualizer ${isActive ? 'active' : ''}`}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="fl-voice-vis-bar" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      <footer className="fl-voice-footer">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-white/50">
          Try saying
        </p>
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {config.voiceExamples.map((ex) => (
            <button
              key={ex}
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs text-white/85 hover:bg-white/10"
              onClick={() => runExample(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
        {state === 'speaking' ? (
          <button
            type="button"
            className="mb-3 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            onClick={replaySound}
          >
            Awaaz nahi aa rahi? Tap to play sound
          </button>
        ) : null}
        {state === 'idle' || micError || state === 'listening' ? (
          <button
            type="button"
            className="fl-voice-mic-btn"
            onClick={() => {
              // Never open mic while AI is speaking
              if (isSpeakingRef.current || ttsStillPlaying()) return
              unlockSpeechSynthesis()
              if (navigator.mediaDevices?.getUserMedia) {
                void navigator.mediaDevices
                  .getUserMedia({ audio: true })
                  .then((stream) => stream.getTracks().forEach((t) => t.stop()))
                  .catch(() => setMicError(true))
              }
              muteMicUntilRef.current = 0
              stopListening()
              isSpeakingRef.current = false
              setMicError(false)
              startListening()
            }}
          >
            <Mic className="h-4 w-4" />
            {micError ? 'Mic on karein' : isListening ? 'Phir se suno' : 'Boliye'}
          </button>
        ) : null}
      </footer>
    </div>
  )
}
