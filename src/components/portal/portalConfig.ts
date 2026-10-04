import {
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  MessageSquare,
  BadgeCheck,
  Megaphone,
  BarChart3,
  Briefcase,
  Radio,
  Settings,
  Sparkles,
  Store,
  FolderTree,
  PackagePlus,
  Send,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export type PortalKind = 'manufacturer' | 'admin'

export interface PortalNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  badgeKey?: 'newRfqs' | 'pendingVerification'
}

export interface PortalNavGroup {
  id: string
  label: string
  items: PortalNavItem[]
}

export interface PortalQuickAction {
  label: string
  icon: LucideIcon
  to?: string
  action?: 'ai'
}

export interface PortalConfig {
  kind: PortalKind
  name: string
  homePath: string
  orgName: string
  orgCaption: string
  user: { name: string; title: string; initials: string }
  searchPlaceholder: string
  groups: PortalNavGroup[]
  quickActions: PortalQuickAction[]
  aiWelcome: string
  aiPrompts: string[]
  voiceExamples: string[]
}

export const portalConfigs: Record<PortalKind, PortalConfig> = {
  manufacturer: {
    kind: 'manufacturer',
    name: 'Manufacturer Portal',
    homePath: '/manufacturer',
    orgName: 'ABC Fasteners Pvt Ltd',
    orgCaption: 'Ahmedabad, Gujarat · Verified',
    user: { name: 'Rakesh Shah', title: 'Director · ABC Fasteners', initials: 'RS' },
    searchPlaceholder: 'Search RFQs, products, inquiries, buyers…',
    groups: [
      {
        id: 'workspace',
        label: 'Workspace',
        items: [
          { to: '/manufacturer', label: 'Dashboard', icon: LayoutDashboard, end: true },
          { to: '/manufacturer/rfqs', label: 'RFQs', icon: FileText, badgeKey: 'newRfqs' },
          { to: '/manufacturer/inquiries', label: 'Inquiries', icon: MessageSquare },
          { to: '/manufacturer/products', label: 'Products', icon: Package },
          { to: '/manufacturer/profile', label: 'Company Profile', icon: Building2 },
        ],
      },
      {
        id: 'growth',
        label: 'Growth',
        items: [
          { to: '/manufacturer/ai-product', label: 'AI Product Tool', icon: Sparkles },
          { to: '/manufacturer/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/manufacturer/promotion', label: 'Promotion', icon: Megaphone },
          { to: '/manufacturer/verification', label: 'Verification', icon: BadgeCheck },
          { to: '/manufacturer/broadcasts', label: 'Broadcasts', icon: Radio },
          { to: '/manufacturer/services', label: 'Services', icon: Briefcase },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        items: [{ to: '/manufacturer/settings', label: 'Settings', icon: Settings }],
      },
    ],
    quickActions: [
      { label: 'Add Product', icon: PackagePlus, to: '/manufacturer/products' },
      { label: 'Generate Listing with AI', icon: Sparkles, to: '/manufacturer/ai-product' },
      { label: 'Respond to RFQ', icon: Send, to: '/manufacturer/rfqs' },
      { label: 'Boost Visibility', icon: Megaphone, to: '/manufacturer/promotion' },
    ],
    aiWelcome:
      'Namaste 👋 I am ForgeLink AI. I can summarise new RFQs, draft quotations, and show product and profile performance. Ask in Hindi or English.',
    aiPrompts: [
      'Aaj kitne naye RFQ aaye?',
      'Draft quotation for RFQ-2026-10482',
      'Show my product performance',
      'How many profile views this month?',
      'Verification status kya hai?',
      'Generate a product listing with AI',
      'How can I get more buyer enquiries?',
      'Open inquiries',
    ],
    voiceExamples: [
      'Aaj kitne naye RFQ aaye?',
      'RFQ 10482 ka quotation banao',
      'Product performance dikhao',
      'Open analytics',
    ],
  },
  admin: {
    kind: 'admin',
    name: 'Admin Console',
    homePath: '/admin',
    orgName: 'ForgeLink Platform',
    orgCaption: 'Operations · India',
    user: { name: 'Neha Verma', title: 'Platform Admin', initials: 'NV' },
    searchPlaceholder: 'Search manufacturers, RFQs, products, vendors…',
    groups: [
      {
        id: 'operations',
        label: 'Operations',
        items: [
          { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
          { to: '/admin/manufacturers', label: 'Manufacturers', icon: Building2 },
          { to: '/admin/verification', label: 'Verification', icon: BadgeCheck, badgeKey: 'pendingVerification' },
          { to: '/admin/rfqs', label: 'RFQs', icon: FileText, badgeKey: 'newRfqs' },
          { to: '/admin/products', label: 'Products', icon: Package },
        ],
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        items: [
          { to: '/admin/categories', label: 'Categories', icon: FolderTree },
          { to: '/admin/vendors', label: 'Vendors', icon: Store },
          { to: '/admin/services', label: 'Services', icon: Briefcase },
          { to: '/admin/advertisements', label: 'Advertisements', icon: Megaphone },
          { to: '/admin/broadcasts', label: 'Broadcasts', icon: Radio },
        ],
      },
      {
        id: 'system',
        label: 'System',
        items: [
          { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/admin/settings', label: 'Settings', icon: Settings },
        ],
      },
    ],
    quickActions: [
      { label: 'Review Verifications', icon: ShieldCheck, to: '/admin/verification' },
      { label: 'Monitor RFQs', icon: FileText, to: '/admin/rfqs' },
      { label: 'New Broadcast', icon: Radio, to: '/admin/broadcasts' },
      { label: 'New Advertisement', icon: Megaphone, to: '/admin/advertisements' },
    ],
    aiWelcome:
      'Namaste 👋 I am ForgeLink AI for platform operations. Ask about pending verifications, today’s RFQs, manufacturer growth, or revenue — in Hindi or English.',
    aiPrompts: [
      'Kitne verification pending hain?',
      'Approve Patel Engineering Works',
      'Show today’s RFQ activity',
      'Platform revenue this month',
      'Which categories are growing?',
      'List unverified manufacturers',
      'Draft a broadcast for verified suppliers',
      'Open analytics',
    ],
    voiceExamples: [
      'Pending verification dikhao',
      'Patel Engineering approve karo',
      'Aaj ke RFQ kitne hain?',
      'Open manufacturers',
    ],
  },
}
