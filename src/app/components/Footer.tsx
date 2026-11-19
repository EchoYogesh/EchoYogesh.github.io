import { Copy, Check, Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { site } from '../../data/site'
import { Lines, Reveal } from './motion'
import { useLocalTime } from './Nav'

export function Footer() {
  const time = useLocalTime()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(site.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'Could not submit. Try again.')
      setState('done')
    } catch (error) {
      setState('error')
      setError(error instanceof Error ? error.message : 'Could not submit. Try again.')
    }
  }

  const field =
    'h-13 sm:h-14 w-full rounded-control border border-line-strong bg-surface/70 px-4 sm:px-5 text-[14.5px] sm:text-[15px] placeholder:text-faint transition-colors focus:border-fg focus:bg-surface focus:outline-none'

  return (
    <footer id="contact" className="mt-[clamp(4rem,10vh,9rem)] border-t border-line scroll-mt-24">
      <div className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(4rem,9vh,8rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Left Column: Direct Call to Action */}
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#c26138]" />
              <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">
                Initiate Contact
              </span>
            </div>

            <Lines
              as="h2"
              className="font-display mt-2 text-[clamp(40px,7.5vw,96px)] leading-[0.95]"
              lines={['Let’s build', 'something reliable']}
            />

            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[18px]">
              Available for Senior SDET roles, framework architecture contracts, and enterprise QA consulting.
            </p>

            {/* Direct Email with 1-Click Copy Badge */}
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                onClick={handleCopyEmail}
                className="group inline-flex h-13 sm:h-14 items-center gap-3 rounded-full border border-line-strong bg-fg px-6 sm:px-7 text-[15px] sm:text-[16px] font-medium text-bg shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="size-4 shrink-0" />
                <span className="truncate">{site.email}</span>
                <span className="grid size-6 place-items-center rounded-full bg-white/20 text-white">
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3" />}
                </span>
              </button>

              {copied && (
                <span className="font-mono text-[12px] font-medium text-emerald-600 animate-fade-in">
                  ✓ Email copied to clipboard!
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5 font-medium text-fg">
                <span className="size-2 rounded-full bg-emerald-500" /> Open to Remote / Hybrid / On-site
              </span>
              <span className="text-faint">·</span>
              <span>Notice Period: 2 Weeks (Negotiable)</span>
            </div>
          </div>

          {/* Right Column: Interactive Direct Message Form */}
          <Reveal delay={0.15}>
            {state === 'done' ? (
              <div className="flex h-full min-h-[320px] flex-col justify-center rounded-[28px] border border-line-strong bg-surface/90 p-8 shadow-xl backdrop-blur-md">
                <div className="size-12 rounded-full bg-emerald-500/10 grid place-items-center text-emerald-600">
                  <Check className="size-6" />
                </div>
                <h3 className="font-display mt-4 text-[32px]">Message Transmitted</h3>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">
                  Thank you for reaching out. I review all inquiries directly and will respond to your email promptly.
                </p>
                <button
                  onClick={() => setState('idle')}
                  className="mt-6 w-fit text-[13.5px] font-medium text-fg underline underline-offset-4 hover:text-[#c26138]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="flex flex-col gap-3.5 rounded-[28px] border border-line-strong/80 bg-surface/90 p-6 sm:p-8 shadow-xl backdrop-blur-md"
              >
                <div>
                  <h3 className="font-display text-[22px] sm:text-[24px]">Send a Direct Message</h3>
                  <p className="mt-1 text-[13px] text-muted">
                    Inquire about full-time roles, contracts, or framework reviews.
                  </p>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Your name"
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Work email address"
                    className={field}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <textarea
                  required
                  placeholder="Share details about your tech stack, test automation goals, or open role..."
                  className={`${field} h-auto min-h-[130px] resize-none py-4`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="h-13 sm:h-14 rounded-control flex items-center justify-center gap-2 border border-fg bg-fg text-[15px] font-medium text-bg shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{state === 'sending' ? 'Transmitting message...' : 'Send Message'}</span>
                </button>

                {state === 'error' && <p className="text-[13px] text-[#c26138]">{error}</p>}
              </form>
            )}
          </Reveal>
        </div>

        {/* Global Footer Meta & Socials */}
        <div className="mt-20 grid gap-6 border-t border-line pt-8 text-[13.5px] text-muted sm:mt-28 sm:grid-cols-3">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw font-medium text-muted transition-colors hover:text-fg"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-faint sm:text-center">
            {site.location} · {time}
          </p>
          <p className="text-faint sm:text-right">
            © {new Date().getFullYear()} {site.name} · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
