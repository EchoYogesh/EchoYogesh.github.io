import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { bySlug, projects } from '../../data/site'
import { Lines, Parallax, Reveal } from '../components/motion'

const ease = [0.22, 1, 0.36, 1] as const

export function Work() {
  const { slug } = useParams()
  const project = slug ? bySlug(slug) : undefined
  if (!project) return <Navigate to="/" replace />
  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(6.5rem,13vh,9.5rem)] pb-[clamp(3rem,8vh,6rem)]">
      <Link to="/#work" className="inline-flex h-9 items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-fg">
        <ArrowLeft className="size-4" />
        All work
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <Lines as="h1" className="font-display text-[clamp(32px,7.5vw,110px)] leading-[0.95]" lines={[project.title]} />
        <Reveal delay={0.2} className="max-w-md text-pretty text-[16px] sm:text-[17px] leading-relaxed text-muted lg:pb-4">
          {project.summary}
        </Reveal>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease }}
        className="mt-10 overflow-hidden rounded-[28px] border border-line-strong/60 shadow-xl max-h-[420px] sm:max-h-[480px]"
        style={{ background: project.tint }}
      >
        <Parallax src={project.cover} alt={project.title} className="aspect-[16/10] sm:aspect-[16/9] max-h-[420px] sm:max-h-[480px]" strength={5} />
      </motion.div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-24">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 text-[14px] lg:grid-cols-1">
            {[
              ['Domain / Sector', project.client],
              ['Year', project.year],
              ['Role', project.role.join(', ')],
              ['Delivered', project.deliverables.join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="border-t border-line pt-3">
                <dt className="text-muted">{label}</dt>
                <dd className="mt-1 text-fg">{value}</dd>
              </div>
            ))}
            {project.link && (
              <div className="border-t border-line pt-3">
                <a href={project.link} className="link-draw inline-flex items-center gap-1 font-medium">
                  Visit the site
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            )}
          </dl>
        </Reveal>
        <div className="max-w-2xl">
          {project.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={`text-pretty leading-relaxed text-fg/90 ${i === 0 ? 'font-display text-[28px] leading-[1.2] sm:text-[36px]' : 'mt-6 text-[17px] text-muted'}`}>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Engineering Impact & Deliverables Highlights (Replacing duplicate images) */}
      <div className="mt-16 rounded-[28px] border border-line-strong/80 bg-surface/80 p-7 sm:p-10 shadow-lg backdrop-blur-md">
        <div className="max-w-2xl">
          <span className="font-mono text-[12px] font-medium tracking-wider text-[#c26138] uppercase">
            Architecture Deliverables & Outcomes
          </span>
          <h3 className="font-display mt-2 text-[24px] sm:text-[30px] leading-tight text-fg">
            Technical milestones achieved
          </h3>
          <p className="mt-2 text-[14.5px] text-muted leading-relaxed">
            Concrete engineering deliverables and verified testing implementations shipped for this platform.
          </p>
        </div>

        <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
          {project.deliverables.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-[18px] border border-line bg-surface-2/40 p-4 transition-colors hover:border-fg/40 hover:bg-surface-2/80"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#c26138]/10 text-[11px] font-semibold text-[#c26138]">
                ✓
              </span>
              <p className="text-[13.5px] sm:text-[14px] font-medium text-fg/90 leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <Link to={`/work/${next.slug}`} className="group mt-32 block border-t border-line pt-10">
        <p className="text-[14px] text-muted">Next project</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(44px,8vw,120px)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">{next.title}</h2>
          <span className="image-frame hidden aspect-[4/3] w-[260px] shrink-0 rounded-[20px] sm:block" style={{ background: next.tint }}>
            <img src={next.cover} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </span>
        </div>
      </Link>
    </article>
  )
}
