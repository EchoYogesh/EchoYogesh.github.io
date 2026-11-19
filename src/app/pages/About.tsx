import { ArrowUpRight, ShieldCheck, MapPin, Clock } from 'lucide-react'

import { experience, proofPoints, site } from '../../data/site'
import { Lines, Reveal } from '../components/motion'

export function About() {
  return (
    <article className="mx-auto w-[min(94vw,1440px)] px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(6.5rem,13vh,9.5rem)] pb-[clamp(3rem,8vh,6rem)]">
      <div className="border-b border-line pb-[clamp(1.5rem,3vh,2.5rem)]">
        <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">About the Architect</span>
        <Lines
          as="h1"
          className="font-display mt-2 text-balance text-[clamp(2.2rem,6.5vw,5.5rem)] leading-[0.95]"
          lines={['Senior SDET,', 'test automation,', 'and release engineering']}
        />
      </div>

      <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[1fr_1.3fr]">
        {/* Left Column: Real Photo Card & Quick Contact */}
        <Reveal>
          <div className="sticky top-24 space-y-6">
            <div className="relative overflow-hidden rounded-[clamp(1.5rem,3cqi,2rem)] border border-line-strong/80 bg-surface shadow-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
                <img
                  src="/images/portrait.jpg"
                  alt={site.name}
                  className="size-full object-cover object-[48%_30%] transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                <div className="absolute inset-x-4 bottom-4 text-white pointer-events-none">
                  <p className="font-display text-[clamp(1.2rem,2.5vw,1.5rem)] font-medium">{site.name}</p>
                  <p className="mt-0.5 text-[clamp(0.75rem,1vw,0.85rem)] text-white/80">{site.role}</p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex flex-col gap-2 p-[clamp(1rem,2vw,1.35rem)] text-[clamp(0.8rem,1vw,0.85rem)] text-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-[#c26138]" />
                  <span>{site.location} (Open to Remote / Relocation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-[#c26138]" />
                  <span>Timezone: {site.timezone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 shrink-0 text-[#c26138]" />
                  <span>Notice Period: 2 Weeks (Negotiable)</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-[clamp(1.2rem,2cqi,1.5rem)] border border-line bg-surface/70 p-[clamp(1rem,2vw,1.25rem)] backdrop-blur-sm">
              <p className="text-[12px] font-medium text-muted uppercase">Connect & Verify</p>
              <ul className="mt-3 flex flex-col gap-2 text-[clamp(0.85rem,1vw,0.92rem)]">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw inline-flex items-center justify-between w-full py-1 text-muted hover:text-fg"
                    >
                      <span>{s.label}</span>
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Deep Technical Narrative & Experience */}
        <div>
          <Reveal className="text-pretty text-[clamp(1.1rem,1.5vw+0.2rem,1.35rem)] leading-relaxed text-fg/95">
            <p>
              I am Yogesh Prajapati, a Senior SDET with 6+ years designing and owning test automation across web, mobile, and distributed systems. I have worked across travel tech, SaaS, fintech, healthcare, and digital banking. My focus is on critical user paths: checkout flows that process financial transactions, CRM interfaces with dynamic DOM structures, microservices where transfers touch multiple downstream services, and mobile apps that require consistent stability across real devices.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-[clamp(1.5rem,3vh,2rem)] flex flex-col gap-[clamp(1rem,2vh,1.5rem)] text-[clamp(0.92rem,1vw+0.15rem,1.08rem)] leading-relaxed text-muted">
            <p>
              I architect automation frameworks as much as the individual tests. I work in Playwright, Selenium, Cypress, and Appium, leveraging Page Object Models, data-driven patterns, and BDD through Cucumber or SpecFlow. I integrate suites into CI so regression executes reliably on every commit instead of during last-minute release scrambles. On recent projects, I automated 90%+ of regression, reduced test execution time by 60–70%, and cut locator maintenance by 35–40% using self-healing locator strategies.
            </p>
            <p>
              I leverage modern AI tools to accelerate test case drafting and script scaffolding, reviewing every single generated script like a pull request before merge. Script development is 30%+ faster, and debugging turnaround is shorter, while keeping code quality strictly human-verified.
            </p>
            <p>
              On performance engineering, I build load simulation suites using Playwright and Artillery, paired with K6 and Locust. I also delivered custom latency dashboards that record every XHR and fetch request per run, with automated benchmark reports evaluating 1 to 100 concurrent users across parallel CI agents. Performance regressions are caught early with quantitative data.
            </p>
            <p>
              Beyond framework coding, I have owned QA operations end-to-end: test strategy, defect triage in JIRA and Azure DevOps, REST and GraphQL API contract validation in Postman, and distributed log triage in Datadog and Graylog. Over the past 3 years I logged and triaged 1,000+ issues, managed communications across concurrent accounts, and mentored 8+ QA engineers.
            </p>
          </Reveal>

          {/* Timeline / Experience */}
          <Reveal delay={0.15} className="mt-[clamp(2.5rem,5vh,3.5rem)]">
            <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">Career Track</span>
            <h2 className="font-display mt-1 text-[clamp(1.75rem,3.5vw,2.25rem)]">Work experience</h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {experience.map((e) => (
                <li key={e.title} className="grid gap-2 py-[clamp(1rem,2vh,1.5rem)] sm:grid-cols-[170px_1fr]">
                  <span className="font-mono text-[12.5px] text-faint">{e.period}</span>
                  <div>
                    <span className="block text-[clamp(0.95rem,1.1vw,1.05rem)] font-medium text-fg">{e.title}</span>
                    <span className="mt-1.5 block text-[clamp(0.85rem,1vw,0.92rem)] leading-relaxed text-muted">{e.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Proof Points */}
          <Reveal delay={0.2} className="mt-[clamp(2.5rem,5vh,3.5rem)] grid grid-cols-2 gap-[clamp(0.85rem,2vw,1.5rem)] sm:grid-cols-3">
            {proofPoints.slice(0, 3).map(([value, label]) => (
              <div key={label} className="rounded-control border border-line bg-surface/80 p-[clamp(1rem,2vw,1.35rem)]">
                <p className="font-display text-[clamp(2.4rem,4.5vw,3.8rem)] leading-none text-fg">{value}</p>
                <p className="mt-2 text-[clamp(0.75rem,0.9vw,0.85rem)] text-muted leading-snug">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </article>
  )
}
