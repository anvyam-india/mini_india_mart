import { getManufacturerById, manufacturers, products } from '../../data/mockData'
import type { RFQ, VerificationItem } from '../../types'
import { portalConfigs, type PortalKind } from './portalConfig'

export interface AiCard {
  title: string
  meta: string
  value?: string
  to?: string
}

export type AiOperation =
  | { type: 'navigate'; path: string; label: string }
  | { type: 'approve'; id: string; company: string }

export interface AiResult {
  answer: string
  cards?: AiCard[]
  operation?: AiOperation
}

export interface AiSnapshot {
  rfqs: RFQ[]
  verificationItems: VerificationItem[]
}

const has = (text: string, ...words: string[]) => words.some((w) => text.includes(w))

function navIntent(kind: PortalKind, text: string): AiResult | null {
  if (!has(text, 'open', 'kholo', 'go to', 'dikhao page', 'le chalo')) return null
  const items = portalConfigs[kind].groups.flatMap((g) => g.items)
  const target = items.find((item) => text.includes(item.label.toLowerCase()))
  if (!target) return null
  return {
    answer: `Opening ${target.label} for you.`,
    operation: { type: 'navigate', path: target.to, label: target.label },
  }
}

function manufacturerAnswer(text: string, snap: AiSnapshot): AiResult {
  const me = getManufacturerById('m1')!
  const myRfqs = snap.rfqs.filter((r) => r.manufacturerIds.includes('m1'))
  const fresh = myRfqs.filter((r) => r.status === 'NEW')
  const myProducts = products.filter((p) => p.manufacturerId === 'm1')

  if (has(text, 'quotation', 'quote', 'banao', 'draft')) {
    const rfq = snap.rfqs.find((r) => r.id === 'RFQ-2026-10482') ?? myRfqs[0]
    return {
      answer: rfq
        ? `Draft ready for ${rfq.id}: ${rfq.quantity} × ${rfq.product} (${rfq.grade}). Suggested price ₹4.20/pc → ₹2,10,000 + GST, delivery in 21 days ex-Ahmedabad, mill test certificates included. Review and send from the RFQ workspace.`
        : 'No open RFQ found to quote against right now.',
      cards: rfq
        ? [
            { title: 'Unit price', meta: 'SS304 M12 hex bolt', value: '₹4.20', to: '/manufacturer/rfqs' },
            { title: 'Order value', meta: '50,000 pcs + GST', value: '₹2.10L', to: '/manufacturer/rfqs' },
            { title: 'Lead time', meta: 'Ex-works Ahmedabad', value: '21 days', to: '/manufacturer/rfqs' },
          ]
        : undefined,
    }
  }

  if (has(text, 'rfq', 'requirement', 'naye', 'new lead', 'enquir', 'inquir')) {
    if (has(text, 'inquir', 'enquir') && !has(text, 'rfq')) {
      return {
        answer: 'You have 6 open buyer inquiries — 2 need a reply today (Sundaram Auto, Bharat Valves).',
        cards: [
          { title: 'Sundaram Auto', meta: 'Hex head screws M10 · 20,000 pcs', value: 'Today', to: '/manufacturer/inquiries' },
          { title: 'Bharat Valves', meta: 'SS316 studs · 8,000 pcs', value: 'Today', to: '/manufacturer/inquiries' },
        ],
      }
    }
    return {
      answer:
        fresh.length > 0
          ? `Aapke paas ${fresh.length} naya RFQ hai. Top priority: ${fresh[0].id} — ${fresh[0].quantity} ${fresh[0].product}, delivery ${fresh[0].delivery}, required within ${fresh[0].requiredWithin}. Match score 94%.`
          : `No new RFQs right now. You have ${myRfqs.length} RFQs in your pipeline overall.`,
      cards: myRfqs.slice(0, 3).map((r) => ({
        title: r.id,
        meta: `${r.quantity} · ${r.product}`,
        value: r.status,
        to: '/manufacturer/rfqs',
      })),
    }
  }

  if (has(text, 'product', 'listing', 'catalog')) {
    if (has(text, 'generate', 'ai', 'create', 'add')) {
      return {
        answer: 'Opening the AI Product Tool — upload a photo or a few specs and I will write a complete listing.',
        operation: { type: 'navigate', path: '/manufacturer/ai-product', label: 'AI Product Tool' },
      }
    }
    const top = [...myProducts].sort((a, b) => b.views - a.views)
    return {
      answer: `${myProducts.length} active products. ${top[0]?.name} is your best performer with ${top[0]?.views.toLocaleString('en-IN')} views and ${top[0]?.inquiries} inquiries.`,
      cards: top.slice(0, 3).map((p) => ({
        title: p.name,
        meta: `${p.inquiries} inquiries`,
        value: p.views.toLocaleString('en-IN'),
        to: '/manufacturer/products',
      })),
    }
  }

  if (has(text, 'view', 'analytics', 'performance', 'traffic')) {
    return {
      answer: `This month: ${me.profileViews.toLocaleString('en-IN')} profile views (+18%), ${me.productViews.toLocaleString('en-IN')} product views and an RFQ conversion rate of 6.4%. Most buyers come from Gujarat and Maharashtra.`,
      cards: [
        { title: 'Profile views', meta: '+18% vs last month', value: me.profileViews.toLocaleString('en-IN') },
        { title: 'Product views', meta: '+11% vs last month', value: me.productViews.toLocaleString('en-IN') },
        { title: 'RFQ conversion', meta: 'Industry avg 4.1%', value: '6.4%' },
      ],
    }
  }

  if (has(text, 'verif', 'certificate', 'kyc')) {
    return {
      answer: 'ABC Fasteners is fully verified ✅ — GST, factory audit and ISO 9001:2015 are approved. Your badge is live on all listings.',
      cards: [{ title: 'Verification', meta: 'GST · Factory audit · ISO 9001', value: 'Verified', to: '/manufacturer/verification' }],
    }
  }

  if (has(text, 'more', 'grow', 'boost', 'promot', 'badhao')) {
    return {
      answer:
        'Three quick wins: (1) add 4 more SS304 product variants, (2) respond to RFQs within 6 hours to unlock the "Fast Responder" badge, (3) run a Featured Listing for Fasteners in Gujarat — estimated +35% enquiries.',
      cards: [{ title: 'Featured Listing', meta: 'Fasteners · Gujarat', value: '+35%', to: '/manufacturer/promotion' }],
    }
  }

  return {
    answer:
      'I can help with RFQs, quotations, product performance, analytics, verification and promotion. Try “Aaj kitne naye RFQ aaye?” or “Draft quotation for RFQ-2026-10482”.',
  }
}

function adminAnswer(text: string, snap: AiSnapshot): AiResult {
  const pending = snap.verificationItems.filter((v) => v.status === 'Pending')

  if (has(text, 'approve', 'manzoor')) {
    const target =
      snap.verificationItems.find((v) => text.includes(v.company.toLowerCase().split(' ')[0])) ?? pending[0]
    if (!target || target.status === 'Approved') {
      return { answer: 'There is no pending verification matching that company.' }
    }
    return {
      answer: `Approved ${target.company}. GST, factory photos and certificates were checked — the Verified badge is now live.`,
      operation: { type: 'approve', id: target.id, company: target.company },
    }
  }

  if (has(text, 'verif', 'pending', 'kyc')) {
    return {
      answer: `${pending.length} verification${pending.length === 1 ? '' : 's'} pending review. Oldest: ${pending[0]?.company ?? '—'}.`,
      cards: snap.verificationItems.map((v) => ({
        title: v.company,
        meta: `${v.location} · ${v.documents.length} documents`,
        value: v.status,
        to: '/admin/verification',
      })),
    }
  }

  if (has(text, 'rfq', 'requirement')) {
    const fresh = snap.rfqs.filter((r) => r.status === 'NEW')
    return {
      answer: `${snap.rfqs.length} RFQs on the platform, ${fresh.length} new today. Highest value: ${snap.rfqs[0]?.id} — ${snap.rfqs[0]?.quantity} ${snap.rfqs[0]?.product}, sent to ${snap.rfqs[0]?.manufacturerNames.length} manufacturers.`,
      cards: snap.rfqs.slice(0, 3).map((r) => ({
        title: r.id,
        meta: `${r.buyer} · ${r.product}`,
        value: r.status,
        to: '/admin/rfqs',
      })),
    }
  }

  if (has(text, 'revenue', 'income', 'kamai', 'earning')) {
    return {
      answer: 'Platform revenue this month is ₹18.4L (+22% MoM): subscriptions ₹11.2L, featured listings ₹4.6L, services ₹2.6L.',
      cards: [
        { title: 'Subscriptions', meta: '312 paid plans', value: '₹11.2L' },
        { title: 'Featured listings', meta: '86 active', value: '₹4.6L' },
        { title: 'Services', meta: 'Export, freight, finance', value: '₹2.6L' },
      ],
    }
  }

  if (has(text, 'categor', 'industry', 'growing', 'trend')) {
    return {
      answer: 'Fastest growing: Fasteners (+31% RFQs), CNC Components (+24%) and Packaging Machinery (+19%). Electrical Components is under-supplied in North India.',
      cards: [
        { title: 'Fasteners', meta: 'RFQ growth', value: '+31%', to: '/admin/categories' },
        { title: 'CNC Components', meta: 'RFQ growth', value: '+24%', to: '/admin/categories' },
        { title: 'Packaging Machinery', meta: 'RFQ growth', value: '+19%', to: '/admin/categories' },
      ],
    }
  }

  if (has(text, 'unverified', 'manufacturer', 'supplier')) {
    const unverified = manufacturers.filter((m) => !m.verified)
    return {
      answer: `${manufacturers.length} manufacturers listed in this demo, ${unverified.length} unverified. On the full platform: 2,400+ verified manufacturers.`,
      cards: unverified.map((m) => ({
        title: m.name,
        meta: `${m.city}, ${m.state}`,
        value: m.status,
        to: '/admin/manufacturers',
      })),
    }
  }

  if (has(text, 'broadcast', 'announce', 'message')) {
    return {
      answer:
        'Draft: “Verified suppliers — 140+ new RFQs for SS304 fasteners and CNC parts arrived this week. Respond within 24 hours to stay in the Top Responder list.” Opening Broadcasts so you can send it.',
      operation: { type: 'navigate', path: '/admin/broadcasts', label: 'Broadcasts' },
    }
  }

  return {
    answer:
      'I can help with verifications, RFQ monitoring, manufacturers, categories, revenue and broadcasts. Try “Kitne verification pending hain?”',
  }
}

export function answerPortalQuery(kind: PortalKind, raw: string, snap: AiSnapshot): AiResult {
  const text = raw.toLowerCase()
  return navIntent(kind, text) ?? (kind === 'manufacturer' ? manufacturerAnswer(text, snap) : adminAnswer(text, snap))
}
