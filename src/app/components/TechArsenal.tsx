import { useState } from 'react'
import { motion } from 'motion/react'
import { Cpu, Terminal, Activity, Database, CheckCircle2 } from 'lucide-react'

interface TechTool {
  name: string
  category: 'Frameworks' | 'CI/CD & Cloud' | 'Performance' | 'APIs & Monitoring'
  role: string
  metric: string
  primary?: boolean
}

const tools: TechTool[] = [
  { name: 'Playwright', category: 'Frameworks', role: 'Primary E2E Engine · Chromium, Firefox, WebKit', metric: '1,000+ Scenarios in CI', primary: true },
  { name: 'Selenium & Appium', category: 'Frameworks', role: 'Cross-browser & iOS/Android device testing', metric: '6+ Years Framework Coding', primary: true },
  { name: 'Cypress', category: 'Frameworks', role: 'Component & Integration UI verification', metric: 'High-speed local feedback' },
  { name: 'Cucumber (BDD)', category: 'Frameworks', role: 'Gherkin business scenarios & living documentation', metric: 'Self-healing locators layer', primary: true },
  { name: 'Azure DevOps', category: 'CI/CD & Cloud', role: 'Parallel pipelines across 5 concurrent agents', metric: 'Weekly release gate sign-offs', primary: true },
  { name: 'BitBucket Pipelines', category: 'CI/CD & Cloud', role: 'Scheduled 15-day regression CI automation', metric: 'Zero manual bottlenecks' },
  { name: 'GitHub Actions', category: 'CI/CD & Cloud', role: 'Overnight BrowserStack cloud test suites', metric: 'Automated morning reports' },
  { name: 'Jenkins', category: 'CI/CD & Cloud', role: 'Hybrid CI test execution & artifact publishing', metric: 'Automated release gating' },
  { name: 'Artillery', category: 'Performance', role: 'UI/API load simulation & concurrency stress', metric: '100 vUsers stress testing', primary: true },
  { name: 'K6', category: 'Performance', role: 'High-concurrency performance benchmarking', metric: 'P95 latency tracking < 150ms', primary: true },
  { name: 'Locust', category: 'Performance', role: 'Python-based distributed API load testing', metric: '1,840 req/sec peak throughput' },
  { name: 'Postman & GraphQL', category: 'APIs & Monitoring', role: 'Direct service contract assertions without UI', metric: 'Microservice integration QA', primary: true },
  { name: 'Datadog & Graylog', category: 'APIs & Monitoring', role: 'Distributed log analysis & defect root cause', metric: 'Zero silent data drops' },
  { name: 'MongoDB & SQL', category: 'APIs & Monitoring', role: 'Direct database ledger & state verification', metric: 'Strict double-entry checks', primary: true },
]

export function TechArsenal() {
  const [activeTab, setActiveTab] = useState<string>('All')

  const categories = ['All', 'Frameworks', 'CI/CD & Cloud', 'Performance', 'APIs & Monitoring']

  const filtered = activeTab === 'All' ? tools : tools.filter((t) => t.category === activeTab)

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#c26138]" />
            <span className="font-mono text-[12px] font-medium tracking-wider text-muted uppercase">
              Engineered Capabilities
            </span>
          </div>
          <h2 className="font-display mt-1 text-[38px] sm:text-[56px] lg:text-[64px]">
            The QA Tech Arsenal
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all sm:text-[13px] ${
                activeTab === cat
                  ? 'border border-fg bg-fg text-bg shadow-sm'
                  : 'border border-line bg-surface-2/60 text-muted hover:border-line-strong hover:text-fg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {filtered.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
            className={`group relative overflow-hidden rounded-[20px] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
              tool.primary
                ? 'border-line-strong/80 bg-surface/90 hover:border-fg/40'
                : 'border-line bg-surface-2/40 hover:border-line-strong hover:bg-surface'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-[12px] border border-line bg-surface-2 text-[#c26138] transition-colors group-hover:border-fg/30 group-hover:bg-fg group-hover:text-bg">
                  {tool.category === 'Frameworks' && <Cpu className="size-4" />}
                  {tool.category === 'CI/CD & Cloud' && <Terminal className="size-4" />}
                  {tool.category === 'Performance' && <Activity className="size-4" />}
                  {tool.category === 'APIs & Monitoring' && <Database className="size-4" />}
                </span>
                <div>
                  <h4 className="font-display text-[18px] sm:text-[20px] text-fg">{tool.name}</h4>
                  <span className="font-mono text-[11px] text-faint">{tool.category}</span>
                </div>
              </div>

              {tool.primary && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#c26138]/20 bg-[#c26138]/10 px-2.5 py-0.5 text-[10.5px] font-medium text-[#c26138]">
                  <CheckCircle2 className="size-3" /> Core
                </span>
              )}
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-muted sm:text-[13.5px]">
              {tool.role}
            </p>

            <div className="mt-4 flex items-center gap-1.5 border-t border-line/60 pt-3 font-mono text-[11.5px] text-fg">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>{tool.metric}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
