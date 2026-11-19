import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

import type { Project } from '../../data/site'
import { cx } from '../lib/cx'

export function WorkCard({ project, index = 0 }: { project: Project; index?: number }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Fluid mouse coordinates for physical tilt & light reflection
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Dynamic specular lighting coordinates
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['10%', '90%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['10%', '90%'])

  // Subtle damped spring physics for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 220, damping: 24 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.5, 3.5]), { stiffness: 220, damping: 24 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width - 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(relX)
    mouseY.set(relY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group w-full col-span-1 @container"
      style={{ perspective: 1200 }}
    >
      <Link to={`/work/${project.slug}`} className="block w-full focus:outline-none">
        {/* Compact, Well-Proportioned Frame (Fixed: Never oversized or screen-eating) */}
        <motion.div
          ref={frameRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: 'preserve-3d',
            background: project.tint,
          }}
          className="relative w-full overflow-hidden rounded-[20px] border border-line-strong/60 shadow-sm transition-all duration-500 group-hover:border-fg/40 group-hover:shadow-xl h-[220px] sm:h-[270px] lg:h-[300px]"
        >
          <img
            src={project.cover}
            alt={project.title}
            className="size-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Dynamic Real-Time Specular Glare */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 60%)`,
              opacity: isHovered ? 1 : 0,
            }}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          />

          {/* Subtle Contrast Ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-black/5" />

          {/* Compact Floating Pill on Hover */}
          <div
            className={cx(
              'absolute right-3.5 top-3.5 hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11.5px] font-medium text-white backdrop-blur-md transition-all duration-300 sm:inline-flex',
              isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            )}
          >
            <span>View Project</span>
            <ArrowUpRight className="size-3" />
          </div>
        </motion.div>

        {/* Crisp Editorial Content below image */}
        <div className="mt-4 space-y-2">
          {/* Category & Year */}
          <div className="flex items-center justify-between text-[12px] sm:text-[12.5px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#c26138]">
              <span className="size-1.5 rounded-full bg-[#c26138]" />
              {project.category}
            </span>
            <span className="font-mono text-faint">{project.year}</span>
          </div>

          {/* Title & Arrow */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[22px] tracking-tight text-fg transition-colors group-hover:text-[#c26138] sm:text-[26px] lg:text-[28px]">
              {project.title}
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg" />
          </div>

          {/* Technical Summary */}
          <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
            {project.summary}
          </p>

          {/* Deliverables Tech Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {project.deliverables.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-[6px] border border-line bg-surface-2/70 px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
