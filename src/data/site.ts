// Everything about you lives here. The pages read from this file.

export const site = {
  name: 'Yogesh Prajapati',
  role: 'Senior SDET: Test Automation, AI-Assisted QA & CI/CD',
  location: 'Faridabad, India',
  timezone: 'Asia/Kolkata',
  email: 'prajapatiyogesh240@gmail.com',
  web3formsKey: '56dd5d46-b893-4cab-a250-a31f042c59e0',
  available: true,
  intro: 'I design and maintain test automation across web, mobile, and distributed systems. With 6+ years across travel CRM, enterprise SaaS, fintech, healthcare, and e-commerce, I write resilient frameworks, integrate them into CI pipelines, and review every test before it reaches production.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yprajapati007/' },
    { label: 'GitHub', href: 'https://github.com/EchoYogesh' },
    { label: 'Instagram', href: 'https://instagram.com/yprajapati_007' },
    { label: 'Email', href: 'mailto:prajapatiyogesh240@gmail.com' },
  ],
  marquee: ['Test Automation', 'Playwright', 'Selenium · Cypress · Appium', 'AI-Assisted QA', 'CI/CD Pipelines', 'Performance & Load Testing', 'API & E2E Testing'],
}

export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  cover: string
  tint: string
  summary: string
  role: string[]
  deliverables: string[]
  link?: string
  body: string[]
  size: 'large' | 'small'
}

export const projects: Project[] = [
  {
    slug: 'saas-ecommerce',
    title: 'Enterprise SaaS & Commerce',
    client: 'B2B SaaS & E-Commerce',
    category: 'Test Automation · Checkout & Integrations',
    year: '2023 to present',
    cover: '/images/saas-ecommerce.jpg',
    tint: '#ece6dd',
    summary: 'Lead QA on a SaaS e-commerce platform covering checkout, catalog, cart pricing, account management, and integrations with Zapier, Google Calendar, QuickBooks, and Mailchimp. Managed twice-a-week production release sign-offs with direct database verification.',
    role: ['Lead QA', 'Regression Automation', 'Integration Testing', 'Release Sign-Off'],
    deliverables: ['Checkout, catalog, cart & pricing coverage', 'Zapier, Google Calendar, QuickBooks, Mailchimp E2E checks', 'Direct MongoDB data verification', 'Twice-a-week release triage'],
    body: [
      'Led QA on an enterprise SaaS and e-commerce platform for more than three years. Testing focused heavily on core money and data transactions, including multi-tier catalog pricing, cart recalculations, payment checkout, and subscription billing.',
      'The platform relies on deep integrations with Zapier, Google Calendar, QuickBooks, and Mailchimp. I automated end-to-end flows and verified payload consistency directly against MongoDB to prevent silent sync failures in downstream ledgers.',
      'Releases ship twice every week. Each release is signed off through rigorous defect reproduction, team triage, and verification alongside developers before deployment.',
    ],
    size: 'large',
  },
  {
    slug: 'salesforce-crm',
    title: 'Enterprise Travel CRM (Salesforce)',
    client: 'Travel CRM Cloud',
    category: 'Test Automation · 1,000+ Scenarios',
    year: '2023 to present',
    cover: '/images/travel-crm.jpg',
    tint: '#dfdde6',
    summary: 'Built a Playwright, JavaScript, and Cucumber BDD framework for a heavily customized Salesforce Travel CRM covering complex itineraries and quote engines. Automated over 1,000 scenarios in BitBucket CI with a self-healing locator layer that reduced maintenance by 40%.',
    role: ['Automation Architecture', 'Cucumber BDD', 'Self-Healing Locators', 'CI Regression'],
    deliverables: ['Playwright + JavaScript + Cucumber framework', '1,000+ automated scenarios', 'Self-healing locator layer with AI-assisted matching', 'BitBucket CI regression pipeline'],
    body: [
      'This platform is a heavily customized Salesforce Travel CRM where dynamic DOM updates and nested Lightning iframe components previously caused frequent locator breakage. I architected a modular Playwright and Cucumber BDD framework covering itinerary builders, quote generation, and CRM record updates, scaling to over 1,000 scenarios.',
      'The test suite runs automatically as part of BitBucket deployment pipelines on a 15-day release cadence. This rapid delivery cycle made building an automated self-healing locator layer an essential investment.',
      'I engineered an intelligent self-healing locator mechanism that inspects the live DOM on locator misses, calculates nearest element matches, and logs changes. Extended with AI-assisted component recognition, this cut routine locator maintenance by approximately 40%.',
    ],
    size: 'large',
  },
  {
    slug: 'performance-load',
    title: 'Performance & Load Engineering',
    client: 'Industrial Tech & IoT',
    category: 'Benchmarking & Load Simulation',
    year: '2026',
    cover: '/images/performance.jpg',
    tint: '#e0d9d0',
    summary: 'Automated 180+ UI regression scenarios for weekly releases, accompanied by a performance and load-testing suite using Playwright, Artillery, K6, and Locust across 5 parallel Azure DevOps agents with real-time XHR analytics.',
    role: ['UI Automation', 'Performance Benchmarking', 'Load Testing', 'Custom Dashboarding'],
    deliverables: ['180+ Playwright/Cucumber UI cases', 'Artillery + K6 UI performance suite', 'Locust API performance benchmarks', 'Custom XHR/fetch latency dashboard', '1-to-100 concurrent-user benchmark reports', '5 parallel Azure DevOps agents'],
    body: [
      'Engineered both functional and performance coverage for industrial web applications. Beyond verifying that features work, the goal was detecting latency regressions before releases reach end users. I automated 180+ UI cases in Playwright and Cucumber for weekly release validation.',
      'For performance validation, I developed a load simulation framework using Playwright and Artillery, paired with K6 for browser-level metrics and Locust for API stress testing. The setup tracks latency, response times, and request volume for every network call.',
      'Results are surfaced through automated benchmark reports across 5 parallel Azure DevOps agents, scaling from 1 to 100 concurrent users so performance regressions are addressed with concrete data rather than guesswork.',
    ],
    size: 'large',
  },
  {
    slug: 'fintech-banking',
    title: 'Fintech & Digital Banking Platform',
    client: 'Digital Neobank & Payments',
    category: 'QA · Payment & Lending Lifecycles',
    year: '2022',
    cover: '/images/fintech-banking.jpg',
    tint: '#dde6e2',
    summary: 'Owned end-to-end QA across microservices where a single fund transfer traversed 4 to 5 backend services. Validated complete payment and lending lifecycles across UI, REST/GraphQL APIs, database ledgers, and distributed logs.',
    role: ['QA Ownership', 'Payment Lifecycle', 'Lending Lifecycle', 'Log & Microservice Triage'],
    deliverables: ['Payment flows: UPI, cards, net banking, wallets', 'Loan lifecycle: KYC through foreclosure', 'GraphQL + Postman API contract suites', 'Datadog, Graylog, CleverTap log triage', 'MongoDB balance & ledger verification'],
    body: [
      'A distributed neobanking infrastructure with microservices serving mobile and web clients. Because fund transfers touch multiple decoupled services, isolated UI testing was insufficient. I tested transactions end-to-end across service contracts, database states, and reconciliation logs.',
      'On the payments side, coverage spanned UPI, debit cards, net banking, and wallets, handling edge cases such as network timeouts, partial debits, retry idempotency, refund hooks, and ledger reconciliation.',
      'On the digital lending side, I validated the entire borrower journey from KYC identity verification, credit bureau scoring, and underwriting to loan disbursement, monthly auto-debit schedules, and account closure. Verified backend state via Postman GraphQL scripts and debugged issues in Datadog and Graylog.',
    ],
    size: 'large',
  },
  {
    slug: 'retail-ecommerce',
    title: 'Specialty Retail E-Commerce',
    client: 'Specialized Online Retail',
    category: 'Test Automation · Python / Pytest-BDD',
    year: '2022',
    cover: '/images/retail-ecommerce.jpg',
    tint: '#e8e0d4',
    summary: 'Constructed Python and Pytest-BDD automation suites for an online retail platform, securing regression coverage across dynamic product catalogs, inventory management, and multi-step checkout.',
    role: ['Automation Architecture', 'Pytest-BDD', 'Regression'],
    deliverables: ['Python automation framework', 'Pytest-BDD scenarios', 'Automated regression coverage'],
    body: [
      'Built a maintainable Python and Pytest-BDD regression suite for a high-traffic e-commerce retailer. The framework focuses on mission-critical paths including catalog filtering, discount application, and payment gateway interactions.',
    ],
    size: 'small',
  },
  {
    slug: 'digital-health',
    title: 'Digital Health & Telemedicine Platform',
    client: 'HealthTech & Remote Care',
    category: 'Test Automation · Selenium / Appium',
    year: '2021',
    cover: '/images/health-tech.jpg',
    tint: '#e2e6dc',
    summary: 'Delivered cross-platform test automation for a HIPAA and GDPR compliant healthcare system using Selenium, Appium, and Java Cucumber, running scheduled nightly regression on BrowserStack.',
    role: ['Cross-Browser Automation', 'Mobile QA', 'Scheduled CI'],
    deliverables: ['Selenium web regression', 'Appium mobile tests', 'Cucumber Java scenarios', 'GitHub Actions overnight BrowserStack suite'],
    body: [
      'Ensured quality and regulatory compliance for a connected health platform. Configured automated mobile and web test suites executed through GitHub Actions on BrowserStack cloud devices each night, giving the development team clean daily status reports.',
    ],
    size: 'small',
  },
  {
    slug: 'workforce-tech',
    title: 'Workforce & HR Management Tech',
    client: 'Workforce SaaS',
    category: 'Test Automation · SpecFlow & DB Validation',
    year: '2021',
    cover: '/images/workforce-saas.jpg',
    tint: '#e0d8dc',
    summary: 'Developed a Selenium C# and SpecFlow framework applying the Page Object Model, with cross-browser execution on LambdaTest and automated SQL checks verifying database integrity.',
    role: ['Framework Engineering', 'SpecFlow BDD', 'Cross-Browser', 'Database Validation'],
    deliverables: ['Selenium C# framework', 'SpecFlow scenarios', 'Page Object Model', 'LambdaTest execution', 'SQL integrity checks'],
    body: [
      'Engineered automation for human resources and employee lifecycle software. Built tests using C# and SpecFlow with direct SQL assertions to verify that employee records, attendance rosters, and timesheet calculations in the database strictly matched front-end state.',
    ],
    size: 'small',
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const services = [
  {
    title: 'Test automation frameworks',
    body: 'Custom Playwright, Selenium, Cypress, and Appium frameworks architected for longevity. Built with Page Object Models, data-driven tests, and BDD with Cucumber or SpecFlow so your test suite stays dependable as products evolve.',
  },
  {
    title: 'AI-assisted QA',
    body: 'Accelerating test case drafting and scenario generation with AI models, followed by rigorous technical review for every script. The outcome is 30%+ faster script delivery without unreviewed code reaching suites.',
  },
  {
    title: 'CI/CD & release automation',
    body: 'Automating regression in Azure DevOps, BitBucket Pipelines, GitHub Actions, and Jenkins. Configured with parallel workers and smart gating to give engineering teams fast, reliable release feedback.',
  },
  {
    title: 'Performance & load testing',
    body: 'Benchmarking UI and API latency using K6, Artillery, Locust, and Playwright. Delivering quantitative reports on concurrency, throughput, and error rates to prevent performance bottlenecks before launch.',
  },
]

export const testimonials = []

export const proofPoints = [
  ['6+', 'years in test automation'],
  ['90%+', 'of regression automated on key projects'],
  ['60–70%', 'faster execution time through parallelization'],
  ['35–40%', 'lower locator maintenance via self-healing layers'],
  ['1,000+', 'automated scenarios on enterprise CRM'],
  ['1,000+', 'defects logged and verified in 3 years'],
  ['8+', 'QA engineers mentored and onboarded'],
  ['4–5', 'enterprise client accounts managed simultaneously'],
  ['30%+', 'faster script creation with AI-assisted drafting'],
  ['2 weeks', 'notice period (negotiable)'],
]

export const experience = [
  {
    period: 'Apr 2021 to present',
    title: 'Senior SDET (promoted from Sr. QA Engineer, May 2025) · Bug Hunters',
    detail: 'Lead automation architect across 5+ client engagements spanning travel tech, fintech, healthcare, and industrial software. Designed self-healing locator strategies, led CI/CD setups on Azure and BitBucket, conducted defect triage, and mentored junior QA engineers.',
  },
  {
    period: 'Dec 2019 to Mar 2021',
    title: 'QA Engineer (promoted from QA Associate) · Global App Services',
    detail: 'Built hybrid test frameworks from scratch in Selenium, Appium, Cypress, and Playwright. Automated 85% of repetitive regression cases and integrated test suites into Jenkins pipelines.',
  },
  {
    period: 'Jun 2019 to Dec 2019',
    title: 'Assistant Acquisition Manager · Kotak Mahindra Bank Ltd.',
    detail: 'Advised retail and business clients on financial products, account onboarding, and investment requirements.',
  },
]
