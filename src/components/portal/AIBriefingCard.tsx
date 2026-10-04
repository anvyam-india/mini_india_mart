import { Mic, Sparkles } from 'lucide-react'
import { beginVoiceFromGesture, buildVoiceGreeting } from '../../lib/voiceSession'
import { ForgeAiAvatar } from '../ai/ForgeAiAvatar'
import { usePortalUI } from './PortalUIContext'

interface Props {
  insights: string[]
  prompts: string[]
}

export function AIBriefingCard({ insights, prompts }: Props) {
  const { openAi, config } = usePortalUI()
  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary p-5 text-white md:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-secondary to-secondary" />
      <div className="hero-grid-dark absolute inset-0" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <button
          onClick={() => {
            const firstName = config.user.name.split(' ')[0] || 'ji'
            beginVoiceFromGesture(buildVoiceGreeting(config.kind, firstName))
            openAi({ voice: true })
          }}
          className="group relative self-start"
          aria-label="Talk to ForgeLink AI"
        >
          <ForgeAiAvatar size="lg" pulse className="transition group-hover:scale-105" />
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-secondary bg-primary">
            <Mic className="h-3.5 w-3.5" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-200">
            <Sparkles className="h-3.5 w-3.5" /> ForgeLink AI briefing
          </p>
          <ul className="mt-2 space-y-1.5">
            {insights.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-slate-200">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-300" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => openAi({ prompt: p })}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/10"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
