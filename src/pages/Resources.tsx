import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'

const articles = [
  {
    category: 'Procurement',
    title: 'How to Choose the Right CNC Manufacturer',
    summary: 'A practical checklist for evaluating machining capability, capacity and quality systems.',
  },
  {
    category: 'Export',
    title: 'Export Documentation Checklist for MSMEs',
    summary: 'Key documents Indian manufacturers need before shipping industrial consignments overseas.',
  },
  {
    category: 'Manufacturing Guides',
    title: 'SS304 vs SS316: Which Material Should You Choose?',
    summary: 'Compare corrosion resistance, cost and application fit for industrial fasteners.',
  },
  {
    category: 'Industry Insights',
    title: 'What Buyers Look for in a Verified Manufacturer Profile',
    summary: 'How certifications, factory media and RFQ responsiveness influence supplier shortlists.',
  },
  {
    category: 'MSME',
    title: 'How MSMEs Can Win More Qualified RFQs Online',
    summary: 'Profile completion, capability clarity and export readiness tips for Indian suppliers.',
  },
  {
    category: 'Market Trends',
    title: 'Gujarat’s Growing Role in Industrial Fastener Supply',
    summary: 'Why buyers continue to source SS fasteners and precision components from Gujarat hubs.',
  },
]

const categories = [
  'Industry Insights',
  'Manufacturing Guides',
  'Export',
  'MSME',
  'Procurement',
  'Market Trends',
]

export function Resources() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-caption text-primary">Resources</p>
        <h1 className="text-h1 mt-1">Industrial Content & Guides</h1>
        <p className="mt-2 text-muted">
          Practical insights for buyers and manufacturers navigating Indian industrial sourcing.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((a) => (
          <article key={a.title} className="card-surface flex flex-col p-6">
            <div className="mb-3 flex items-center gap-2 text-caption text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              {a.category}
            </div>
            <h2 className="text-lg font-bold text-secondary">{a.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{a.summary}</p>
            <Link
              to="/manufacturers"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary"
            >
              Explore manufacturers <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
