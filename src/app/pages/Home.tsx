import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Plus, ShieldCheck, Zap, Terminal, Search, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link } from 'react-router'

import { projects, services, proofPoints, site } from '../../data/site'
import { Lines, Reveal } from '../components/motion'
import { WorkCard } from '../components/WorkCard'
import { TechArsenal } from '../components/TechArsenal'
import { cx } from '../lib/cx'

export function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const domainCategories = ['All', 'Salesforce CRM', 'Fintech & Banking', 'Performance & Load', 'E-Commerce & SaaS', 'Healthcare & HR']

  // Purely dynamic filtering calculated in real time
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedFilter === 'All' ||
        (selectedFilter === 'Salesforce CRM' && project.slug.includes('salesforce')) ||
        (selectedFilter === 'Fintech & Banking' && project.slug.includes('fintech')) ||
        (selectedFilter === 'Performance & Load' && project.slug.includes('performance')) ||
        (selectedFilter === 'E-Commerce & SaaS' &&
          (project.slug.includes('saas') || project.slug.includes('wines'))) ||
        (selectedFilter === 'Healthcare & HR' &&
          (project.slug.includes('huma') || project.slug.includes('hr-tech')))

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.deliverables.some((d) => d.toLowerCase().includes(q)) ||
        project.client.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [selectedFilter, searchQuery])

  return (
    <>
      {/* Pure Fluid Hero Section with Cinematic Back Cover Blend */}
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden pt-[clamp(6rem,14vh,9rem)] pb-[clamp(3rem,6vh,5.5rem)]">
        {/* Ambient Sunset Back Cover Layer (Restored to exact right-side framing, with smooth alpha mask to eliminate vertical line) */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[85%] lg:w-[65%] overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, black 48%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, black 48%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in',
          }}
        >
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            src="/images/portrait.jpg"
            alt={site.name}
            className="size-full object-cover object-[center_28%] lg:object-[52%_28%]"
          />
          {/* Seamless Radial & Linear Blending Gradients into page background */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent sm:via-bg/40" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-bg via-bg/85 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/90 via-bg/40 to-transparent" />
        </div>

        <HeroField />

        {/* Foreground Content */}
        <div className="relative z-10 mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)]">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-[clamp(0.5rem,1.5vw,1rem)]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/90 px-[clamp(0.75rem,2vw,1.25rem)] py-[clamp(0.25rem,0.8vh,0.5rem)] text-[clamp(0.7rem,1vw+0.2rem,0.85rem)] font-medium text-fg shadow-sm backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Senior SDET · Test Automation, AI-Assisted QA & CI/CD
            </span>
            <span className="hidden font-mono text-[clamp(0.7rem,0.9vw,0.8rem)] text-faint sm:inline">
              Faridabad, India · 6+ Years Experience
            </span>
          </motion.div>

          {/* Pure Fluid Headline */}
          <h1 className="font-display mt-[clamp(1.2rem,2.5vh,2rem)] text-[clamp(2.8rem,9vw,9.5rem)] leading-[0.88] tracking-tight text-fg">
            {site.name.split(' ').map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.04em] -mb-[0.04em]">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Intro Description & Dynamic Meta Grid */}
          <div className="relative mt-[clamp(1.5rem,4vh,3rem)] pt-[clamp(1.2rem,3vh,2rem)]">
            {/* Elegant Faded Divider Line (dissolves before touching portrait) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-line via-line/80 to-transparent max-w-xl" />

            <div className="grid gap-[clamp(1.5rem,3vw,3rem)] sm:grid-cols-[1.3fr_1.1fr] lg:grid-cols-[1.4fr_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="max-w-2xl text-pretty text-[clamp(0.95rem,1.2vw+0.25rem,1.25rem)] leading-relaxed text-muted">
                  {site.intro}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between gap-[clamp(1rem,2vh,1.75rem)]"
              >
                <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 text-[clamp(0.85rem,1vw+0.1rem,0.98rem)] whitespace-nowrap">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw inline-flex items-center gap-1 font-medium text-fg hover:text-[#c26138]"
                    >
                      {s.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
                </div>

                {/* Core Quality Pillars */}
                <div className="flex flex-wrap gap-[clamp(0.4rem,1vw,0.6rem)] text-[clamp(0.7rem,0.9vw+0.1rem,0.82rem)] text-muted">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-[clamp(0.6rem,1.2vw,0.85rem)] py-[clamp(0.2rem,0.5vh,0.35rem)]">
                    <ShieldCheck className="size-3.5 text-[#c26138]" /> 90%+ Regression Automated
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-[clamp(0.6rem,1.2vw,0.85rem)] py-[clamp(0.2rem,0.5vh,0.35rem)]">
                    <Zap className="size-3.5 text-[#c26138]" /> 60–70% Faster CI Runs
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-[clamp(0.6rem,1.2vw,0.85rem)] py-[clamp(0.2rem,0.5vh,0.35rem)]">
                    <Terminal className="size-3.5 text-[#c26138]" /> 1,000+ Scenarios
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="overflow-hidden border-y border-line py-[clamp(0.8rem,2vh,1.25rem)]" aria-hidden>
        <ul className="font-display flex w-max animate-marquee items-center gap-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap text-[clamp(1.2rem,2.5vw,2rem)] text-fg/70">
          {[...site.marquee, ...site.marquee, ...site.marquee, ...site.marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-[clamp(1.5rem,3vw,2.5rem)]">
              {item}
              <span className="size-2 rounded-full bg-[#c26138]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Filterable Work Section */}
      <section id="work" className="mx-auto w-[min(94vw,1440px)] scroll-mt-24 px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4rem,9vh,8rem)]">
        <div className="border-b border-line pb-6">
          {/* Top Row: Section Title on left, Search on right */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">Production Case Studies</span>
              <Lines as="h2" className="font-display mt-1 text-[clamp(2rem,5vw,4.5rem)]" lines={['Selected work']} />
              <p className="mt-2 text-[clamp(0.85rem,1.1vw,0.95rem)] text-muted">
                Displaying {filteredProjects.length} of {projects.length} verified production frameworks
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-[260px] md:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search tools, stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-line bg-surface-2/60 pl-9 pr-8 text-[13px] text-fg placeholder:text-faint focus:border-fg focus:bg-surface focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Filter Pills Row (All sit on ONE clean, non-wrapping row) */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {domainCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={cx(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all sm:text-[13px] whitespace-nowrap',
                  selectedFilter === cat
                    ? 'border border-fg bg-fg text-bg shadow-sm'
                    : 'border border-line bg-surface-2/60 text-muted hover:border-line-strong hover:text-fg',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fluid Grid */}
        <motion.div layout className="mt-[clamp(2rem,5vh,4rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(2.5rem,5vh,5rem)] md:grid-cols-2">
          <AnimatePresence>
            {filteredProjects.map((p, i) => (
              <WorkCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-line bg-surface-2/40 p-8 text-center">
            <p className="font-display text-[20px]">No matching frameworks found</p>
            <p className="mt-1 text-[13px] text-muted">Try clearing the search query or selecting "All".</p>
            <button
              onClick={() => {
                setSelectedFilter('All')
                setSearchQuery('')
              }}
              className="mt-4 rounded-full border border-fg bg-fg px-4 py-1.5 text-[12px] font-medium text-bg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* The Dynamic QA Tech Arsenal */}
      <section className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4rem,9vh,8rem)]">
        <TechArsenal />
      </section>

      {/* Engineering Philosophy Section */}
      <section className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4rem,9vh,8rem)]">
        <div className="rounded-[clamp(1.5rem,3cqi,2.2rem)] border border-line-strong/80 bg-surface/90 p-[clamp(1.75rem,5vw,3.5rem)] shadow-xl backdrop-blur-md">
          <div className="max-w-3xl">
            <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">Engineering Philosophy</span>
            <Lines
              as="h2"
              className="font-display mt-2 text-balance text-[clamp(1.85rem,4vw,3.5rem)] leading-tight"
              lines={['Test automation,', 'quality engineering,', 'and reliable releases']}
            />
            <Reveal delay={0.2} className="mt-6 flex flex-col gap-4 text-pretty text-[clamp(0.95rem,1.1vw+0.2rem,1.15rem)] leading-relaxed text-muted">
              <p>
                In high-velocity engineering, broken code costs millions and erodes customer trust. I design and own the automation systems that make sure that never happens: the frameworks, the CI pipelines, and the release verification strategy across travel CRM, SaaS, fintech, healthcare, and digital banking.
              </p>
              <p>
                I use AI tools like Claude, Gemini, and Copilot to accelerate script scaffolding, then review every assertion myself before anything reaches master. The outcome is 60–70% shorter test runs, 40% less locator maintenance with self-healing mechanisms, and CI suites that stay green.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <Link to="/about" className="rounded-control inline-flex items-center gap-2 bg-fg px-6 py-3.5 text-[14px] font-medium text-bg transition-transform hover:scale-[1.02]">
                Detailed Background & Timeline
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services / Core Capabilities */}
      <section className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4rem,9vh,8rem)]">
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">What I Deliver</span>
            <Lines as="h2" className="font-display mt-1 text-[clamp(2rem,4vw,3.25rem)]" lines={['Core capabilities']} />
            <Reveal delay={0.1} className="mt-4 max-w-md text-[clamp(0.85rem,1vw,0.95rem)] text-muted">
              Automation architecture, AI-assisted QA, CI/CD pipelines, and performance benchmarks: the key pillars that directly improve release confidence.
            </Reveal>
          </div>
          <Services />
        </div>
      </section>

      {/* Proof Points (By The Numbers) */}
      <section className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(4rem,9vh,8rem)]">
        <ProofPoints />
      </section>
    </>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i
        return (
          <li key={s.title} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="group flex w-full items-center gap-4 py-[clamp(1.2rem,2.5vh,1.75rem)] text-left"
            >
              <span className="w-8 shrink-0 font-mono text-[13px] text-faint sm:w-10 sm:text-[14px]">0{i + 1}</span>
              <span className={cx('font-display flex-1 text-[clamp(1.35rem,2.5vw,2.4rem)] transition-colors', isOpen ? 'text-fg' : 'text-fg/65 group-hover:text-fg')}>
                {s.title}
              </span>
              <span className={cx('grid size-9 shrink-0 place-items-center rounded-[12px] border border-line-strong transition-colors duration-300 sm:size-10', isOpen && 'border-fg bg-fg text-bg')}>
                <Plus className={cx('size-4 transition-transform duration-500', isOpen && 'rotate-45')} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-xl pb-7 pl-12 text-pretty text-[clamp(0.9rem,1vw+0.1rem,1.05rem)] leading-relaxed text-muted sm:pl-16">{s.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

function ProofPoints() {
  return (
    <div className="rounded-[clamp(1.5rem,3cqi,2.2rem)] border border-line-strong/80 bg-surface/90 p-[clamp(1.25rem,4vw,2.5rem)] shadow-xl backdrop-blur-md">
      <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-[1fr_2.4fr]">
        <div>
          <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">Proven Metrics</span>
          <Lines as="h2" className="font-display mt-1 text-[clamp(2rem,3.5vw,3rem)]" lines={['By the numbers']} />
          <Reveal delay={0.1} className="mt-3 max-w-md text-[clamp(0.85rem,1vw,0.95rem)] text-muted">
            Tangible benchmarks achieved through systematic test architecture and automation rigor.
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
          {proofPoints.slice(0, 8).map(([value, label], i) => (
            <Reveal key={label} delay={0.04 * i} className="rounded-control border border-line bg-surface/90 p-[clamp(0.85rem,1.5vw,1.25rem)]">
              <p className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-none text-fg">{value}</p>
              <p className="mt-2 text-[clamp(0.7rem,0.9vw,0.8rem)] text-muted leading-snug">{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-radial from-surface/60 via-transparent to-transparent" />
      <div className="grain absolute inset-0 opacity-12" />
    </div>
  )
}
