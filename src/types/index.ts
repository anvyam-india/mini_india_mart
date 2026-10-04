export type DemoPortal = 'buyer' | 'manufacturer' | 'admin'

export type RFQStatus = 'NEW' | 'VIEWED' | 'RESPONDED' | 'CLOSED'

export interface Manufacturer {
  id: string
  slug: string
  name: string
  verified: boolean
  premium: boolean
  featured: boolean
  city: string
  state: string
  industry: string
  years: number
  established: number
  employees: string
  employeeCount: number
  exportMarkets: string[]
  canExport: boolean
  capabilities: string[]
  certifications: string[]
  products: string[]
  about: string
  moq: string
  capacity: string
  matchScore?: number
  profileViews: number
  productViews: number
  rating: number
  units: number
  factoryPhotos: string[]
  logoColor: string
  companySize: '1–20' | '21–50' | '51–100' | '101–250' | '250+'
  status: 'Active' | 'Pending' | 'Suspended'
}

export interface Product {
  id: string
  slug: string
  name: string
  manufacturerId: string
  manufacturerName: string
  material: string
  grade: string
  size: string
  moq: string
  application: string
  capacity: string
  category: string
  description: string
  specs: { label: string; value: string }[]
  imageTone: string
  views: number
  inquiries: number
  status: 'Active' | 'Draft' | 'Archived'
}

export interface Category {
  id: string
  name: string
  count: number
  description: string
  icon: string
}

export interface ServiceItem {
  id: string
  name: string
  category: string
  description: string
  provider: string
}

export interface RFQ {
  id: string
  product: string
  quantity: string
  material: string
  grade: string
  delivery: string
  requiredWithin: string
  notes: string
  manufacturerIds: string[]
  manufacturerNames: string[]
  buyer: string
  location: string
  status: RFQStatus
  createdAt: string
  matchScore?: number
}

export interface MatchBreakdown {
  product: boolean
  location: boolean
  export: boolean
  capacity: boolean
  moq: boolean
}

export interface AIMatchResult {
  manufacturer: Manufacturer
  score: number
  breakdown: MatchBreakdown
}

export interface VerificationItem {
  id: string
  company: string
  location: string
  submittedAt: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Info Requested'
  documents: string[]
}
