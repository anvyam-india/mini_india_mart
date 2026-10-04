import { useState } from 'react'
import { Sparkles, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function ManufacturerAIProduct() {
  const [name, setName] = useState('SS Screw')
  const [material, setMaterial] = useState('SS 304')
  const [grade, setGrade] = useState('304')
  const [application, setApplication] = useState('Industrial Machinery')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    title: string
    description: string
    specs: string[]
    applications: string[]
    keywords: string[]
  }>(null)

  const generate = async () => {
    setLoading(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 1200))
    setResult({
      title: `${material} ${name} for ${application}`,
      description: `Premium ${material} ${name.toLowerCase()} engineered for ${application.toLowerCase()} applications. Manufactured with consistent thread accuracy, corrosion resistance and export-ready packaging. Suitable for high-volume OEM procurement with reliable dimensional control and grade certification support.`,
      specs: [
        `Material: ${material}`,
        `Grade: ${grade}`,
        'Thread accuracy: ISO metric compliant',
        'Finish: Passivated / clean industrial finish',
        'Packaging: Bulk / export carton options',
        'Quality: Batch inspection with material traceability',
      ],
      applications: [
        application,
        'Automotive assemblies',
        'General engineering equipment',
        'Plant maintenance and fabrication',
      ],
      keywords: [
        `${material} ${name}`,
        `SS ${grade} screw manufacturer`,
        'industrial screw supplier India',
        'export quality fasteners Gujarat',
        `${application.toLowerCase()} screws`,
      ],
    })
    setLoading(false)
    toast.success('AI product description generated')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">AI Tools</p>
        <h1 className="text-h1 mt-1">AI Product Generator</h1>
        <p className="text-small mt-1">
          Draft listing copy for new SKUs before publishing to your catalog.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader title="Product inputs" subtitle="Defaults match a common ABC Fasteners SKU." />
          <div className="space-y-4">
            {[
              ['Product Name', name, setName],
              ['Material', material, setMaterial],
              ['Grade', grade, setGrade],
              ['Application', application, setApplication],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block text-sm">
                <span className="mb-1.5 block font-semibold text-secondary">{label as string}</span>
                <input
                  value={value as string}
                  onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border px-3 outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={generate} disabled={loading}>
            <Sparkles className="h-4 w-4" />
            {loading ? 'Generating…' : 'Generate with AI'}
          </Button>
        </Card>

        <Card className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[380px] flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
                  <Sparkles className="h-7 w-7 animate-pulse text-primary" />
                </div>
                <p className="font-bold text-secondary">AI is drafting your product content…</p>
                <p className="text-small mt-1">Title, description, specs and keywords</p>
              </motion.div>
            )}

            {!loading && !result && (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center py-12 text-center">
                <Sparkles className="mb-3 h-8 w-8 text-primary/40" />
                <p className="font-semibold text-secondary">No content yet</p>
                <p className="text-small mt-1">Fill the form and click Generate with AI.</p>
              </div>
            )}

            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-caption">Generated title</p>
                    <h2 className="text-h3 mt-1">{result.title}</h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(result.description)
                      toast.success('Description copied')
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                </div>

                <div>
                  <p className="text-caption mb-2">Description</p>
                  <p className="text-sm leading-relaxed text-secondary">{result.description}</p>
                </div>

                <div>
                  <p className="text-caption mb-2">Specifications</p>
                  <ul className="space-y-1.5 text-sm">
                    {result.specs.map((s) => (
                      <li key={s} className="rounded-xl bg-surface-muted px-3 py-2">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-caption mb-2">Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {result.applications.map((a) => (
                      <span
                        key={a}
                        className="rounded-xl border border-border px-2.5 py-1 text-xs font-semibold"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-caption mb-2">Search keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-xl bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
