import { Link } from 'react-router-dom'
import { Package, Settings, Factory, Layers, Zap } from 'lucide-react'
import { categories } from '../data/mockData'

const iconMap = { Bolt: Settings, Package, Settings, Factory, Layers, Zap } as const

export function Categories() {
  return (
    <div className="container-page py-10">
      <h1 className="text-h1">Categories</h1>
      <p className="mt-2 mb-8 text-muted">Browse manufacturers by industrial category.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Factory
          return (
            <Link
              key={c.id}
              to={`/manufacturers?industry=${encodeURIComponent(c.name)}`}
              className="card-surface p-6 transition hover:border-primary/40"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
              <p className="mt-3 text-xs font-bold text-primary">{c.count} listings</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
