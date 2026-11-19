import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowUpRight, Mail } from 'lucide-react'

import { site } from '../../data/site'
import { cx } from '../lib/cx'

export function useLocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: site.timezone,
        }).format(new Date()),
      )
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > last && y > 160)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth scroll to contact section
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const el = document.getElementById('contact')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    navigate('/#contact')
    setTimeout(() => {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  // Smooth scroll to work section
  const handleWorkClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault()
      const el = document.getElementById('work')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:pt-5',
        hidden && '-translate-y-28 opacity-0',
      )}
    >
      {/* Precision Engineered Floating Island Capsule */}
      <div
        className={cx(
          'inline-flex h-11 sm:h-12 w-auto items-center gap-2 sm:gap-3 rounded-full border px-3 sm:px-4 shadow-lg transition-all duration-300',
          scrolled
            ? 'border-line-strong/90 bg-surface/95 shadow-xl backdrop-blur-2xl ring-1 ring-black/5'
            : 'border-line-strong/70 bg-surface/85 backdrop-blur-xl',
        )}
      >
        {/* Brand with Active Status Beacon */}
        <Link to="/" className="group flex shrink-0 items-center gap-2 pr-1 focus:outline-none">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-display text-[13.5px] font-semibold tracking-tight text-fg transition-colors group-hover:text-[#c26138] sm:text-[14.5px]">
            <span className="inline sm:hidden">YP</span>
            <span className="hidden sm:inline">{site.name}</span>
          </span>
        </Link>

        {/* Divider */}
        <span className="h-3.5 w-px bg-line-strong/60" aria-hidden />

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1">
          <a
            href="/#work"
            onClick={handleWorkClick}
            className={cx(
              'rounded-full px-3 py-1 text-[12.5px] font-medium transition-all sm:text-[13px]',
              location.pathname === '/' && location.hash === '#work'
                ? 'bg-fg text-bg shadow-xs'
                : 'text-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            Work
          </a>

          <Link
            to="/about"
            className={cx(
              'rounded-full px-3 py-1 text-[12.5px] font-medium transition-all sm:text-[13px]',
              location.pathname === '/about'
                ? 'bg-fg text-bg shadow-xs'
                : 'text-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            About
          </Link>
        </nav>

        {/* Divider */}
        <span className="h-3.5 w-px bg-line-strong/60" aria-hidden />

        {/* Integrated Contact Button */}
        <button
          type="button"
          onClick={handleContactClick}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fg px-3.5 py-1 text-[12px] font-medium text-bg shadow-xs transition-all duration-200 hover:bg-[#c26138] sm:py-1.5 sm:text-[12.5px]"
        >
          <Mail className="size-3 transition-transform group-hover:scale-110" />
          <span>Contact</span>
          <ArrowUpRight className="size-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </button>
      </div>
    </header>
  )
}
