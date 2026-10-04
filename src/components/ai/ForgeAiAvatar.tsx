import { cn } from '../../lib/cn'

const sizes = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
}

interface Props {
  size?: keyof typeof sizes
  pulse?: boolean
  listening?: boolean
  className?: string
}

export function ForgeAiAvatar({ size = 'md', pulse, listening, className }: Props) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full',
        sizes[size],
        pulse && 'fl-ai-pulse',
        className,
      )}
    >
      {listening && (
        <>
          <span className="fl-ai-ring" />
          <span className="fl-ai-ring" style={{ animationDelay: '0.9s' }} />
        </>
      )}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2563eb] via-primary to-primary-dark" />
      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#0b1220] to-[#1a2332]" />
      <div className="absolute inset-[16%] rounded-full border border-white/15" />
      <svg viewBox="0 0 48 48" className="fl-ai-gear absolute inset-[14%] text-blue-400/35" aria-hidden>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <rect
            key={deg}
            x="23"
            y="1"
            width="2"
            height="5"
            rx="1"
            fill="currentColor"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
      </svg>
      <svg viewBox="0 0 48 48" className="relative z-[1] h-[52%] w-[52%] text-white" aria-hidden>
        <circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="24" cy="24" r="3.2" fill="#60a5fa" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="22"
            y="6"
            width="4"
            height="7"
            rx="1"
            fill="currentColor"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
      </svg>
    </div>
  )
}
