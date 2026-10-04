import { Link } from 'react-router-dom'

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary text-white">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-extrabold">
              FL
            </div>
            <span className="text-lg font-extrabold">ForgeLink</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Discover verified Indian manufacturers, compare capabilities, and send RFQs.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-6 text-sm">
          <div className="flex flex-col gap-2 text-slate-300">
            <span className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Discover</span>
            <Link to="/manufacturers" className="hover:text-white">Manufacturers</Link>
            <Link to="/products" className="hover:text-white">Products</Link>
            <Link to="/ai-search" className="hover:text-white">AI Search</Link>
            <Link to="/services" className="hover:text-white">Services</Link>
          </div>
          <div className="flex flex-col gap-2 text-slate-300">
            <span className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Account</span>
            <Link to="/my-rfqs" className="hover:text-white">My RFQs</Link>
            <Link to="/saved" className="hover:text-white">Saved</Link>
            <Link to="/compare" className="hover:text-white">Compare</Link>
          </div>
          <div className="flex flex-col gap-2 text-slate-300">
            <span className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Portals</span>
            <Link to="/manufacturer" className="hover:text-white">Manufacturer</Link>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs text-slate-500">
          © 2026 ForgeLink Demo · Client presentation prototype
        </div>
      </div>
    </footer>
  )
}
