import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mic, Minimize2, Send, X } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'
import { beginVoiceFromGesture, buildVoiceGreeting } from '../../lib/voiceSession'
import { ForgeAiAvatar } from '../ai/ForgeAiAvatar'
import { Button } from '../ui/Button'
import { answerPortalQuery, type AiCard, type AiResult } from './portalAi'
import { SIDEBAR_WIDTH, usePortalUI } from './PortalUIContext'
import { VoiceMode } from './VoiceMode'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  cards?: AiCard[]
}

export function PortalAIPanel() {
  const {
    config,
    collapsed,
    aiOpen,
    minimizeAi,
    closeAi,
    voiceLaunch,
    clearVoiceLaunch,
    pendingPrompt,
    clearPendingPrompt,
  } = usePortalUI()
  const { rfqs, verificationItems, approveVerification } = useApp()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', content: config.aiWelcome }])
  const [draft, setDraft] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [voice, setVoice] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'assistant', content: config.aiWelcome }])
  }, [config.aiWelcome])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiOpen])

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current)
  }, [])

  const applyOperation = useCallback(
    (result: AiResult) => {
      const op = result.operation
      if (!op) return
      if (op.type === 'approve') {
        approveVerification(op.id)
        return
      }
      toast.success(`Opening ${op.label}`)
      window.setTimeout(() => {
        setVoice(false)
        minimizeAi()
        navigate(op.path)
      }, 600)
    },
    [approveVerification, minimizeAi, navigate],
  )

  const respond = useCallback(
    (raw: string) => {
      const content = raw.trim()
      if (!content || streaming) return
      const result = answerPortalQuery(config.kind, content, { rfqs, verificationItems })
      const id = `a-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', content },
        { id, role: 'assistant', content: '' },
      ])
      setDraft('')
      setStreaming(true)
      let i = 0
      timer.current = window.setInterval(() => {
        i += Math.max(1, Math.floor(result.answer.length / 50))
        const done = i >= result.answer.length
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, content: result.answer.slice(0, i), cards: done ? result.cards : undefined } : m,
          ),
        )
        if (done) {
          if (timer.current) window.clearInterval(timer.current)
          setStreaming(false)
          applyOperation(result)
        }
      }, 18)
    },
    [streaming, config.kind, rfqs, verificationItems, applyOperation],
  )

  useEffect(() => {
    if (aiOpen && voiceLaunch) {
      // Gesture already called beginVoiceFromGesture in the click handler
      setVoice(true)
      clearVoiceLaunch()
    }
  }, [aiOpen, voiceLaunch, clearVoiceLaunch])

  const startVoice = () => {
    const firstName = config.user.name.split(' ')[0] || 'ji'
    beginVoiceFromGesture(buildVoiceGreeting(config.kind, firstName))
    setVoice(true)
  }

  useEffect(() => {
    if (aiOpen && pendingPrompt) {
      respond(pendingPrompt)
      clearPendingPrompt()
    }
  }, [aiOpen, pendingPrompt, respond, clearPendingPrompt])

  useEffect(() => {
    if (!aiOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !voice) minimizeAi()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aiOpen, voice, minimizeAi])

  const handleVoiceResult = useCallback(
    (user: string, result: AiResult) => {
      if (user) {
        setMessages((prev) => [
          ...prev,
          { id: `u-${Date.now()}`, role: 'user', content: user },
          { id: `a-${Date.now()}`, role: 'assistant', content: result.answer, cards: result.cards },
        ])
      }
      // Delay ops so TTS finishes starting before panel navigates away
      window.setTimeout(() => applyOperation(result), 200)
    },
    [applyOperation],
  )

  if (!aiOpen) return null

  return (
    <>
      {voice && <VoiceMode onClose={() => setVoice(false)} onResult={handleVoiceResult} />}

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed inset-y-0 right-0 z-[65] flex flex-col border-l border-border bg-surface-muted shadow-[0_0_40px_rgba(15,23,42,0.12)] max-lg:!left-0"
        style={{ left: collapsed ? 0 : SIDEBAR_WIDTH }}
        role="dialog"
        aria-label="ForgeLink AI"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <ForgeAiAvatar size="sm" />
            <div>
              <p className="font-semibold text-secondary">ForgeLink AI</p>
              <p className="text-xs text-muted">
                {streaming ? 'Typing…' : `Chat · Voice · Live ${config.kind === 'admin' ? 'platform' : 'workspace'} data`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="!px-2" onClick={minimizeAi} aria-label="Minimize">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="!px-2" onClick={closeAi} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center px-4 py-5">
          <button type="button" onClick={startVoice} className="group relative" aria-label="Start voice">
            <ForgeAiAvatar size="xl" pulse className="transition group-hover:scale-105" />
            <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md">
              <Mic className="h-4 w-4" />
            </span>
          </button>
          <p className="mt-3 text-center text-sm text-muted">Tap the avatar for voice — or pick a suggestion below</p>
        </div>

        <div className="mx-auto w-full max-w-4xl flex-1 space-y-3 overflow-y-auto px-4 pb-3 scrollbar-thin sm:px-8">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]',
                  msg.role === 'user' ? 'bg-primary text-white' : 'border border-border bg-surface text-secondary shadow-soft',
                )}
              >
                {msg.content}
                {streaming && msg.role === 'assistant' && idx === messages.length - 1 && (
                  <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-primary align-middle" />
                )}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {msg.cards.map((c) => (
                      <button
                        key={c.title}
                        type="button"
                        disabled={!c.to}
                        onClick={() => {
                          if (!c.to) return
                          minimizeAi()
                          navigate(c.to)
                        }}
                        className="rounded-xl border border-border bg-surface-muted p-3 text-left transition enabled:hover:border-primary"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="truncate text-xs font-semibold text-secondary">{c.title}</span>
                          {c.to && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted" />}
                        </div>
                        {c.value && <div className="mt-1 text-base font-bold text-primary">{c.value}</div>}
                        <div className="mt-0.5 truncate text-[11px] text-muted">{c.meta}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="shrink-0 border-t border-border bg-surface px-4 py-3 sm:px-8 sm:py-4">
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted">Suggested questions</p>
          <div className="mb-3 flex max-h-28 flex-wrap justify-center gap-2 overflow-y-auto">
            {config.aiPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => respond(q)}
                className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-secondary/80 hover:border-primary hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            className="mx-auto flex max-w-4xl gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              respond(draft)
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Hindi / English — RFQs, products, verification, analytics…"
              className="h-12 flex-1 rounded-2xl border border-border bg-surface-muted px-4 text-sm outline-none focus:border-primary"
            />
            <Button type="button" variant="outline" className="!h-12 !rounded-2xl !px-3" onClick={startVoice} aria-label="Voice">
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" className="!h-12 !rounded-2xl" disabled={!draft.trim() || streaming} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  )
}
