import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, X, Sparkles } from 'lucide-react'
import { ForgeAiAvatar } from './ForgeAiAvatar'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { manufacturers } from '../../data/mockData'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

type Msg = { role: 'user' | 'assistant'; text: string; cards?: typeof manufacturers }

const prompts = [
  'Find Manufacturers',
  'Compare Suppliers',
  'Create RFQ',
  'Find Export Services',
]

export function AIAssistant() {
  const { assistantOpen, setAssistantOpen, openRFQ, compareIds, toggleCompare } = useApp()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: 'Your industrial discovery assistant. How can I help you find the right manufacturer?',
    },
  ])

  const reply = async (text: string) => {
    setMessages((prev) => [...prev, { role: 'user', text }])
    setTyping(true)
    await new Promise((r) => setTimeout(r, 800))
    const lower = text.toLowerCase()

    if (lower.includes('packaging') || lower.includes('gujarat') || lower.includes('manufacturer')) {
      const show = lower.includes('packaging')
        ? manufacturers.filter((m) => m.industry.toLowerCase().includes('packaging')).slice(0, 3)
        : manufacturers.filter((m) => m.state === 'Gujarat').slice(0, 3)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I found 14 relevant manufacturers. Here are top matches:',
          cards: show.length ? show : manufacturers.slice(0, 3),
        },
      ])
    } else if (lower.includes('compare')) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I’ve added top Gujarat fastener suppliers to compare. Open Compare to continue.',
        },
      ])
      ;['m1', 'm2', 'm3'].forEach((id) => {
        if (!compareIds.includes(id)) toggleCompare(id)
      })
    } else if (lower.includes('rfq')) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Opening the RFQ flow with a sample SS 304 requirement.' },
      ])
      openRFQ()
    } else if (lower.includes('export')) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Explore Export Documentation, Freight and Customs under Services — or filter manufacturers by export capability.',
        },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I can help you find manufacturers, compare suppliers, create an RFQ, or find export services.',
        },
      ])
    }
    setTyping(false)
  }

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || typing) return
    setInput('')
    void reply(value)
  }

  return (
    <>
      {!assistantOpen && (
        <button
          onClick={() => setAssistantOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-border bg-surface p-1.5 pr-3 shadow-[0_10px_28px_rgba(15,23,42,0.14)] transition hover:border-primary"
          aria-label="Ask ForgeLink AI"
          title="Ask ForgeLink AI"
        >
          <ForgeAiAvatar size="xs" pulse />
          <span className="hidden text-xs font-semibold text-secondary sm:inline">Ask AI</span>
        </button>
      )}

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-[88px] right-6 z-40 flex h-[520px] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <ForgeAiAvatar size="xs" />
                <div>
                  <div className="text-sm font-bold">ForgeLink AI</div>
                  <div className="text-[11px] text-slate-300">Your industrial discovery assistant.</div>
                </div>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="rounded p-1 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'inline-block rounded-xl bg-primary px-3 py-2 text-sm text-white'
                        : 'inline-block rounded-xl bg-surface-muted px-3 py-2 text-sm text-secondary'
                    }
                  >
                    {m.text}
                  </div>
                  {m.cards && (
                    <div className="mt-2 space-y-2">
                      {m.cards.map((c) => (
                        <Link
                          key={c.id}
                          to={`/manufacturers/${c.slug}`}
                          className="block rounded-xl border border-border bg-surface p-3 text-left hover:border-primary/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">{c.name}</span>
                            {c.verified && <Badge tone="success">Verified</Badge>}
                          </div>
                          <div className="mt-1 text-xs text-muted">
                            {c.city}, {c.state} · {c.industry}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="inline-flex items-center gap-1 rounded-xl bg-surface-muted px-3 py-2 text-xs text-muted">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                  Thinking…
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      submit(
                        p === 'Find Manufacturers'
                          ? 'Find packaging machine manufacturers in Gujarat.'
                          : p === 'Compare Suppliers'
                            ? 'Compare suppliers'
                            : p === 'Create RFQ'
                              ? 'Create RFQ'
                              : 'Find export services',
                      )
                    }
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-secondary hover:border-primary hover:text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(input)
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ForgeLink AI…"
                  className="h-10 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-primary"
                />
                <Button type="submit" size="sm" className="h-10 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
