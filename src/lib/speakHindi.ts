/**
 * Chrome Mac TTS fix — ported from Global Engineering GET CRM.
 * Prefer Google/en-IN/Samantha; block novelty voices; hard-reset zombie queue.
 */

type SpeakVoicePick = {
  voice: SpeechSynthesisVoice | null
  lang: string
}

const LOG = (...a: unknown[]) => console.log('[FL-TTS]', ...a)
const WARN = (...a: unknown[]) => console.warn('[FL-TTS]', ...a)
const ERR = (...a: unknown[]) => console.error('[FL-TTS]', ...a)

const BLOCKED_VOICE =
  /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|hysterical|jester|junior|kathy|organ|pipe organ|princess|ralph|trinoids|whisper|zarvox|sara \(compact\)|compact|novelty|dummy/i

let cachedPick: SpeakVoicePick | null = null
let voicesReady: Promise<void> | null = null
let speakToken = 0
let resumeTimer: number | null = null

export const isChromeBrowser = (): boolean =>
  typeof navigator !== 'undefined' &&
  /chrome|crios|chromium/i.test(navigator.userAgent) &&
  !/edg|firefox|fxios/i.test(navigator.userAgent)

const getVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) return []
  return speechSynthesis.getVoices().filter((v) => !BLOCKED_VOICE.test(v.name))
}

const scoreVoice = (v: SpeechSynthesisVoice): number => {
  let s = 0
  const n = v.name
  const lang = v.lang
  if (/google/i.test(n) && /en(-|_)?in/i.test(lang)) s += 120
  if (/google/i.test(n) && /^en/i.test(lang)) s += 110
  if (/samantha|karen|moira|fiona|tessa|veena|raveena|neerja/i.test(n)) s += 100
  if (lang === 'en-IN') s += 95
  if (/alex|daniel|fred|tom|aaron/i.test(n) && /^en/i.test(lang)) s += 80
  if (/microsoft.*(aria|jenny|guy|zira|sara)/i.test(n)) s += 85
  if (lang === 'en-US' || lang === 'en-GB') s += 70
  if (/google/i.test(n) && /hindi|हिन्दी|हिंदी/i.test(n)) s += 130
  if (lang.startsWith('hi')) s += 60
  if (v.localService && /^en/i.test(lang)) s += 15
  if (v.default && /^en/i.test(lang)) s += 10
  return s
}

const resolveVoicePick = (): SpeakVoicePick => {
  const voices = getVoices()
  if (!voices.length) return { voice: null, lang: 'en-US' }

  const ranked = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const best = ranked[0]!

  if (isChromeBrowser()) {
    const en = ranked.find((v) => v.lang.startsWith('en')) ?? best
    const googleHi = ranked.find((v) => /google/i.test(v.name) && v.lang.startsWith('hi'))
    if (googleHi) return { voice: googleHi, lang: 'hi-IN' }
    return { voice: en, lang: en.lang.startsWith('en') ? en.lang : 'en-US' }
  }

  if (best.lang.startsWith('hi') || /hindi|lekha|heera/i.test(best.name)) {
    return { voice: best, lang: 'hi-IN' }
  }
  return { voice: best, lang: best.lang || 'en-US' }
}

const ensureVoices = (): Promise<void> => {
  if (voicesReady) return voicesReady
  voicesReady = new Promise((resolve) => {
    const done = () => {
      cachedPick = resolveVoicePick()
      resolve()
    }
    if (speechSynthesis.getVoices().length > 0) {
      done()
      return
    }
    const onChange = () => {
      speechSynthesis.removeEventListener('voiceschanged', onChange)
      done()
    }
    speechSynthesis.addEventListener('voiceschanged', onChange)
    try {
      speechSynthesis.getVoices()
    } catch {
      /* ignore */
    }
    window.setTimeout(done, 800)
  })
  return voicesReady
}

export const preloadHindiVoice = async (): Promise<SpeechSynthesisVoice | null> => {
  await ensureVoices()
  return cachedPick?.voice ?? null
}

/** Gesture warm-up — NEVER speak()+cancel() (poisons Chrome). */
export const unlockSpeechSynthesis = (): void => {
  if (!('speechSynthesis' in window)) return
  try {
    if (speechSynthesis.paused) speechSynthesis.resume()
    void ensureVoices()
    LOG('unlock ok', { chrome: isChromeBrowser(), paused: speechSynthesis.paused })
  } catch (e) {
    ERR('unlock failed', e)
  }
}

export const normalizeHindiSpeakText = (text: string): string =>
  text
    .replace(/₹/g, ' rupees ')
    .replace(/%/g, ' percent ')
    .replace(/[—–]/g, '. ')
    .replace(/[✅👋→·]/g, ' ')
    .replace(/\bForgeLink AI\b/gi, 'Forge Link A I')
    .replace(/\bForgeLink\b/gi, 'Forge Link')
    .replace(/\bRFQ\b/g, 'R F Q')
    .replace(/\bRFQs\b/g, 'R F Qs')
    .replace(/\bSS304\b/gi, 'S S 304')
    .replace(/\bMOQ\b/g, 'M O Q')
    .replace(/\bGST\b/g, 'G S T')
    .replace(/\bISO\b/g, 'I S O')
    .replace(/\s+/g, ' ')
    .trim()

const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const stopResumeNudge = () => {
  if (resumeTimer != null) {
    window.clearInterval(resumeTimer)
    resumeTimer = null
  }
}

const startResumeNudge = () => {
  stopResumeNudge()
  if (!isChromeBrowser()) return
  resumeTimer = window.setInterval(() => {
    try {
      if (speechSynthesis.speaking) {
        speechSynthesis.pause()
        speechSynthesis.resume()
      }
    } catch {
      /* ignore */
    }
  }, 5000)
}

const hardResetSynthesis = async () => {
  stopResumeNudge()
  try {
    speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
  await pause(isChromeBrowser() ? 250 : 80)
  try {
    speechSynthesis.resume()
  } catch {
    /* ignore */
  }
}

export const stopSpeaking = () => {
  speakToken += 1
  void hardResetSynthesis()
}

/**
 * Speak inside a user-click stack — NO await before speechSynthesis.speak().
 * Chrome blocks TTS if speak() happens after async gaps.
 */
export const speakHindiSync = (text: string, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) {
    ERR('speechSynthesis missing')
    onEnd?.()
    return
  }

  const token = ++speakToken
  const normalized = normalizeHindiSpeakText(text)
  if (!normalized) {
    onEnd?.()
    return
  }

  unlockSpeechSynthesis()
  stopResumeNudge()
  try {
    speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
  try {
    if (speechSynthesis.paused) speechSynthesis.resume()
  } catch {
    /* ignore */
  }

  // Use voices available right now (preload on portal mount fills cache)
  try {
    speechSynthesis.getVoices()
  } catch {
    /* ignore */
  }
  let pick = cachedPick ?? resolveVoicePick()
  if (pick.voice && BLOCKED_VOICE.test(pick.voice.name)) {
    cachedPick = resolveVoicePick()
    pick = cachedPick
  }

  const u = new SpeechSynthesisUtterance(normalized)
  u.lang = pick.lang
  u.rate = 0.95
  u.pitch = 1
  u.volume = 1
  if (pick.voice && !BLOCKED_VOICE.test(pick.voice.name)) u.voice = pick.voice

  let started = false
  let settled = false
  const finish = () => {
    if (settled || token !== speakToken) return
    settled = true
    stopResumeNudge()
    onEnd?.()
  }

  u.onstart = () => {
    started = true
    LOG('sync onstart ✓', u.voice?.name ?? pick.voice?.name)
  }
  u.onend = () => finish()
  u.onerror = (ev) => {
    const err = (ev as SpeechSynthesisErrorEvent).error
    LOG('sync onerror', err)
    if (err === 'canceled' || err === 'interrupted') {
      if (token === speakToken) finish()
      return
    }
    // One sync retry with default voice
    if (token !== speakToken) return
    const retry = new SpeechSynthesisUtterance(normalized)
    retry.lang = 'en-US'
    retry.rate = 0.95
    retry.onend = () => finish()
    retry.onerror = () => finish()
    try {
      speechSynthesis.speak(retry)
    } catch {
      finish()
    }
  }

  startResumeNudge()
  LOG('speakHindiSync', { text: normalized.slice(0, 80), voice: pick.voice?.name, lang: pick.lang })
  try {
    speechSynthesis.speak(u)
  } catch (e) {
    ERR('sync speak threw', e)
    finish()
    return
  }

  if (isChromeBrowser()) {
    window.setTimeout(() => {
      try {
        if (token === speakToken && speechSynthesis.speaking) {
          speechSynthesis.pause()
          speechSynthesis.resume()
        }
      } catch {
        /* ignore */
      }
    }, 50)
  }

  // Only treat as silent if nothing is actually playing (never kill live audio early)
  window.setTimeout(() => {
    if (settled || token !== speakToken) return
    if (!started && !speechSynthesis.speaking) {
      WARN('sync speak silent — finishing so mic can start')
      finish()
    }
  }, 2800)

  // Absolute cap — but wait if browser still reports speaking
  window.setTimeout(() => {
    if (settled || token !== speakToken) return
    if (speechSynthesis.speaking) {
      const waitMore = window.setInterval(() => {
        if (token !== speakToken) {
          window.clearInterval(waitMore)
          return
        }
        if (!speechSynthesis.speaking) {
          window.clearInterval(waitMore)
          finish()
        }
      }, 300)
      window.setTimeout(() => {
        window.clearInterval(waitMore)
        finish()
      }, 8000)
      return
    }
    finish()
  }, Math.min(22000, 2200 + normalized.length * 75))
}

export const speakHindi = async (text: string, onEnd?: () => void) => {
  // Prefer sync path when voices are already cached (normal after portal load)
  if (cachedPick || (typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices().length > 0)) {
    speakHindiSync(text, onEnd)
    return
  }

  if (!('speechSynthesis' in window)) {
    ERR('speechSynthesis missing')
    onEnd?.()
    return
  }

  const token = ++speakToken
  const normalized = normalizeHindiSpeakText(text)
  if (!normalized) {
    onEnd?.()
    return
  }

  await ensureVoices()
  if (token !== speakToken) {
    // Token was superseded — still try sync with latest
    speakHindiSync(text, onEnd)
    return
  }

  speakHindiSync(text, onEnd)
}

export const hasHindiVoice = (): boolean => {
  const p = cachedPick
  return Boolean(p?.voice && p.lang.startsWith('hi'))
}
