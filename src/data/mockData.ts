import type {
  Category,
  Manufacturer,
  Product,
  RFQ,
  ServiceItem,
  VerificationItem,
} from '../types'

export const manufacturers: Manufacturer[] = [
  {
    id: 'm1',
    slug: 'abc-fasteners',
    name: 'ABC Fasteners Pvt Ltd',
    verified: true,
    premium: true,
    featured: true,
    city: 'Ahmedabad',
    state: 'Gujarat',
    industry: 'Industrial Fasteners',
    years: 12,
    established: 2012,
    employees: '50–100',
    employeeCount: 80,
    exportMarkets: ['UAE', 'Saudi Arabia', 'Germany', 'UK'],
    canExport: true,
    capabilities: [
      'CNC Machining',
      'Cold Forging',
      'Thread Rolling',
      'Surface Treatment',
      'Quality Inspection',
    ],
    certifications: ['ISO 9001', 'CE', 'RoHS'],
    products: ['SS 304 Bolts', 'Hex Head Screws', 'Industrial Screws', 'Washers'],
    about:
      'ABC Fasteners is a Gujarat-based manufacturer specializing in stainless steel industrial fasteners for automotive, machinery, and infrastructure buyers. With three manufacturing units and export-ready packaging, the company supports high-volume RFQs with consistent grade control and short lead times.',
    moq: '5,000 units',
    capacity: '100,000 / month',
    profileViews: 1284,
    productViews: 3842,
    rating: 4.8,
    units: 3,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    ],
    logoColor: '#1E3A8A',
    companySize: '51–100',
    status: 'Active',
  },
  {
    id: 'm2',
    slug: 'xyz-engineering',
    name: 'Patel Engineering Works',
    verified: true,
    premium: true,
    featured: true,
    city: 'Rajkot',
    state: 'Gujarat',
    industry: 'Precision Components',
    years: 18,
    established: 2006,
    employees: '100–250',
    employeeCount: 160,
    exportMarkets: ['UAE', 'UK', 'USA'],
    canExport: true,
    capabilities: ['CNC Turning', 'Precision Grinding', 'Assembly', 'Surface Coating'],
    certifications: ['ISO 9001', 'IATF 16949'],
    products: ['SS Screws', 'CNC Machined Shaft', 'Machined Parts'],
    about:
      'Patel Engineering Works delivers precision-machined components for OEMs and industrial buyers. Known for export documentation readiness and multi-shift capacity, the company supports complex RFQs across fasteners and turned parts.',
    moq: '10,000 units',
    capacity: '80,000 / month',
    profileViews: 980,
    productViews: 2210,
    rating: 4.7,
    units: 2,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    ],
    logoColor: '#0F766E',
    companySize: '101–250',
    status: 'Active',
  },
  {
    id: 'm3',
    slug: 'rajkot-precision',
    name: 'Rajkot Precision Industries',
    verified: true,
    premium: false,
    featured: false,
    city: 'Rajkot',
    state: 'Gujarat',
    industry: 'Metal Components',
    years: 9,
    established: 2015,
    employees: '20–50',
    employeeCount: 42,
    exportMarkets: ['UAE', 'Kenya'],
    canExport: true,
    capabilities: ['Cold Forging', 'Thread Rolling', 'Inspection & QA'],
    certifications: ['ISO 9001'],
    products: ['Industrial Bolts', 'Anchor Fasteners', 'Custom Screws'],
    about:
      'Rajkot Precision Industries focuses on mid-volume industrial fasteners with strong quality inspection. Ideal for buyers seeking agile Gujarat suppliers with export capability to Middle East and Africa.',
    moq: '3,000 units',
    capacity: '45,000 / month',
    profileViews: 640,
    productViews: 1180,
    rating: 4.5,
    units: 1,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1581092795360-fd1db4bdc0a5?w=800&q=80',
    ],
    logoColor: '#B45309',
    companySize: '21–50',
    status: 'Active',
  },
  {
    id: 'm4',
    slug: 'gujarat-polymer',
    name: 'Gujarat Polymer Solutions',
    verified: true,
    premium: false,
    featured: true,
    city: 'Vadodara',
    state: 'Gujarat',
    industry: 'Plastic Manufacturing',
    years: 14,
    established: 2010,
    employees: '50–100',
    employeeCount: 95,
    exportMarkets: ['UAE', 'Bangladesh'],
    canExport: true,
    capabilities: ['Injection Moulding', 'Tooling', 'Assembly'],
    certifications: ['ISO 9001', 'ISO 14001'],
    products: ['Plastic Injection Housing', 'Polymer Components'],
    about:
      'Gujarat Polymer Solutions manufactures engineered plastic components for automotive and industrial OEMs with in-house tooling support.',
    moq: '2,000 units',
    capacity: '200,000 / month',
    profileViews: 720,
    productViews: 1560,
    rating: 4.4,
    units: 2,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
    ],
    logoColor: '#7C3AED',
    companySize: '51–100',
    status: 'Active',
  },
  {
    id: 'm5',
    slug: 'shree-industrial',
    name: 'Shree Industrial Components',
    verified: true,
    premium: false,
    featured: false,
    city: 'Surat',
    state: 'Gujarat',
    industry: 'Automotive Components',
    years: 11,
    established: 2013,
    employees: '50–100',
    employeeCount: 75,
    exportMarkets: ['UAE'],
    canExport: true,
    capabilities: ['Stamping', 'Welding', 'Powder Coating'],
    certifications: ['ISO 9001'],
    products: ['Sheet Metal Brackets', 'Automotive Housings'],
    about:
      'Shree Industrial Components supplies fabricated metal parts for machinery and automotive buyers across West India.',
    moq: '500 units',
    capacity: '30,000 / month',
    profileViews: 520,
    productViews: 890,
    rating: 4.3,
    units: 2,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
    ],
    logoColor: '#1D4ED8',
    companySize: '51–100',
    status: 'Active',
  },
  {
    id: 'm6',
    slug: 'apex-machinery',
    name: 'Apex Machinery Systems',
    verified: true,
    premium: true,
    featured: true,
    city: 'Pune',
    state: 'Maharashtra',
    industry: 'Machinery',
    years: 16,
    established: 2008,
    employees: '100–250',
    employeeCount: 140,
    exportMarkets: ['UAE', 'Sri Lanka'],
    canExport: true,
    capabilities: ['Machine Design', 'Assembly', 'PLC Integration'],
    certifications: ['ISO 9001', 'CE'],
    products: ['Industrial Air Compressor', 'Machine Assemblies'],
    about:
      'Apex Machinery Systems builds industrial machinery and compressor systems for plants across India and select export markets.',
    moq: '1 unit',
    capacity: '40 units / month',
    profileViews: 1760,
    productViews: 2940,
    rating: 4.6,
    units: 2,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    ],
    logoColor: '#334155',
    companySize: '101–250',
    status: 'Active',
  },
  {
    id: 'm7',
    slug: 'prime-packaging',
    name: 'Prime Packaging Technologies',
    verified: true,
    premium: false,
    featured: true,
    city: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Packaging Machinery',
    years: 15,
    established: 2009,
    employees: '100–250',
    employeeCount: 130,
    exportMarkets: ['UAE', 'Bangladesh', 'Sri Lanka'],
    canExport: true,
    capabilities: ['Machine Design', 'Filling Systems', 'After-Sales'],
    certifications: ['ISO 9001', 'CE'],
    products: ['Packaging Machine', 'Filling Lines', 'Sealing Systems'],
    about:
      'Prime Packaging Technologies builds industrial packaging machinery for food, pharma, and FMCG manufacturers with installation support.',
    moq: '1 unit',
    capacity: '35 machines / month',
    profileViews: 1540,
    productViews: 2680,
    rating: 4.6,
    units: 2,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    ],
    logoColor: '#0F766E',
    companySize: '101–250',
    status: 'Active',
  },
  {
    id: 'm8',
    slug: 'delhi-electrical',
    name: 'North India Electrical Components',
    verified: false,
    premium: false,
    featured: false,
    city: 'Pune',
    state: 'Maharashtra',
    industry: 'Electrical Components',
    years: 8,
    established: 2016,
    employees: '20–50',
    employeeCount: 38,
    exportMarkets: [],
    canExport: false,
    capabilities: ['Assembly', 'Testing', 'Cable Harness'],
    certifications: ['ISO 9001'],
    products: ['Control Panels', 'Electrical Housings'],
    about:
      'North India Electrical Components supplies domestic electrical assemblies for industrial OEMs with competitive lead times.',
    moq: '200 units',
    capacity: '8,000 / month',
    profileViews: 310,
    productViews: 420,
    rating: 4.1,
    units: 1,
    factoryPhotos: [
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
    ],
    logoColor: '#475569',
    companySize: '21–50',
    status: 'Pending',
  },
]

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'ss-304-industrial-bolt',
    name: 'Stainless Steel 304 Industrial Bolt',
    manufacturerId: 'm1',
    manufacturerName: 'ABC Fasteners Pvt Ltd',
    material: 'Stainless Steel',
    grade: 'SS 304',
    size: 'M4–M12',
    moq: '5,000',
    application: 'Industrial Machinery',
    capacity: '100,000 / month',
    category: 'Industrial Fasteners',
    description:
      'High-strength SS 304 industrial bolts engineered for corrosion resistance and consistent thread accuracy. Suitable for outdoor and high-moisture industrial environments.',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Thread Type', value: 'Metric / UNC' },
      { label: 'Finish', value: 'Passivated' },
      { label: 'Tensile Strength', value: '520–700 MPa' },
      { label: 'Tolerance', value: 'ISO 965' },
      { label: 'Packaging', value: 'Export carton / bulk' },
    ],
    imageTone: '#1E3A8A',
    views: 1842,
    inquiries: 46,
    status: 'Active',
  },
  {
    id: 'p2',
    slug: 'hex-head-screw',
    name: 'Hex Head Screw',
    manufacturerId: 'm1',
    manufacturerName: 'ABC Fasteners Pvt Ltd',
    material: 'Stainless Steel',
    grade: 'SS 304',
    size: 'M3–M10',
    moq: '10,000',
    application: 'OEM Assembly',
    capacity: '120,000 / month',
    category: 'Industrial Fasteners',
    description: 'Precision hex head screws designed for high-volume OEM assembly lines.',
    specs: [
      { label: 'Material', value: 'SS 304' },
      { label: 'Head Type', value: 'Hex' },
      { label: 'Drive', value: 'External hex' },
    ],
    imageTone: '#0F766E',
    views: 960,
    inquiries: 28,
    status: 'Active',
  },
  {
    id: 'p3',
    slug: 'cnc-machined-shaft',
    name: 'CNC Machined Shaft',
    manufacturerId: 'm2',
    manufacturerName: 'Patel Engineering Works',
    material: 'Alloy Steel',
    grade: 'EN8 / SS',
    size: 'Custom',
    moq: '500',
    application: 'Automotive / Machinery',
    capacity: '12,000 / month',
    category: 'Precision Components',
    description: 'Precision CNC machined shafts with grinding finish for OEM assemblies.',
    specs: [
      { label: 'Tolerance', value: '±0.02 mm' },
      { label: 'Finish', value: 'Ground' },
    ],
    imageTone: '#334155',
    views: 720,
    inquiries: 19,
    status: 'Active',
  },
  {
    id: 'p4',
    slug: 'plastic-injection-housing',
    name: 'Plastic Injection Housing',
    manufacturerId: 'm4',
    manufacturerName: 'Gujarat Polymer Solutions',
    material: 'ABS / Nylon',
    grade: 'Engineering Grade',
    size: 'As per drawing',
    moq: '2,000',
    application: 'Electrical / Automotive',
    capacity: '200,000 / month',
    category: 'Plastic Manufacturing',
    description: 'Injection moulded housings with tooling support for industrial OEMs.',
    specs: [
      { label: 'Process', value: 'Injection Moulding' },
      { label: 'Material Options', value: 'ABS, Nylon, PP' },
    ],
    imageTone: '#7C3AED',
    views: 540,
    inquiries: 14,
    status: 'Active',
  },
  {
    id: 'p5',
    slug: 'industrial-air-compressor',
    name: 'Industrial Air Compressor',
    manufacturerId: 'm6',
    manufacturerName: 'Apex Machinery Systems',
    material: 'Steel Frame',
    grade: 'Industrial',
    size: '5–50 HP',
    moq: '1',
    application: 'Plant Utilities',
    capacity: '40 units / month',
    category: 'Machinery',
    description: 'Industrial air compressors for manufacturing plants with service support.',
    specs: [
      { label: 'Power Range', value: '5–50 HP' },
      { label: 'Control', value: 'PLC optional' },
    ],
    imageTone: '#1D4ED8',
    views: 1120,
    inquiries: 31,
    status: 'Active',
  },
  {
    id: 'p6',
    slug: 'packaging-machine',
    name: 'Packaging Machine',
    manufacturerId: 'm7',
    manufacturerName: 'Prime Packaging Technologies',
    material: 'SS Frame + Mild Steel',
    grade: 'Industrial Grade',
    size: 'Custom',
    moq: '1',
    application: 'Food, Pharma, FMCG',
    capacity: '35 machines / month',
    category: 'Packaging Machinery',
    description: 'Automatic packaging machines with filling and sealing integration.',
    specs: [
      { label: 'Throughput', value: 'Up to 60 packs/min' },
      { label: 'Control', value: 'PLC based' },
    ],
    imageTone: '#0F766E',
    views: 1480,
    inquiries: 37,
    status: 'Active',
  },
]

export const categories: Category[] = [
  { id: 'c1', name: 'Industrial Fasteners', count: 1240, description: 'Bolts, nuts, screws, washers', icon: 'Bolt' },
  { id: 'c2', name: 'Automotive Components', count: 860, description: 'OEM and aftermarket parts', icon: 'Settings' },
  { id: 'c3', name: 'Plastic Manufacturing', count: 540, description: 'Injection moulded components', icon: 'Layers' },
  { id: 'c4', name: 'Packaging Machinery', count: 386, description: 'Filling, sealing, packing lines', icon: 'Package' },
  { id: 'c5', name: 'Electrical Components', count: 610, description: 'Panels, housings, assemblies', icon: 'Zap' },
  { id: 'c6', name: 'Machinery', count: 470, description: 'Industrial machines and systems', icon: 'Factory' },
]

export const services: ServiceItem[] = [
  { id: 's1', name: 'Export Documentation Support', category: 'Export Documentation', description: 'Prepare commercial invoices, packing lists and certificate packs for overseas shipments.', provider: 'TradeAssist India' },
  { id: 's2', name: 'Freight Forwarding', category: 'Freight Forwarding', description: 'Door-to-port freight coordination for MSME exporters across UAE and Europe.', provider: 'GulfRoute Logistics' },
  { id: 's3', name: 'Customs Clearance', category: 'Customs', description: 'HS classification and customs paperwork for industrial consignments.', provider: 'ClearPort Advisors' },
  { id: 's4', name: 'Domestic Logistics', category: 'Logistics', description: 'Factory pickup and multi-state industrial delivery planning.', provider: 'InduMove Transport' },
  { id: 's5', name: 'Working Capital Advisory', category: 'Finance', description: 'Invoice financing guidance for manufacturers receiving RFQs.', provider: 'MSME Capital Desk' },
  { id: 's6', name: 'Industrial Photography', category: 'Industrial Photography', description: 'Factory and product photography for manufacturer profiles.', provider: 'ForgeVisual Studio' },
  { id: 's7', name: 'Industrial Video', category: 'Industrial Video', description: 'Capability videos for premium manufacturer listings.', provider: 'PlantFilm Media' },
  { id: 's8', name: 'Product Marketing Packs', category: 'Product Marketing', description: 'Catalog copy and listing assets for B2B product pages.', provider: 'CatalogCraft' },
]

export const initialRFQs: RFQ[] = [
  {
    id: 'RFQ-2026-10471',
    product: 'Hex Nuts SS 316',
    quantity: '25,000 units',
    material: 'Stainless Steel',
    grade: 'SS316',
    delivery: 'Pune',
    requiredWithin: '45 days',
    notes: 'Need material certificates.',
    manufacturerIds: ['m1', 'm2'],
    manufacturerNames: ['ABC Fasteners Pvt Ltd', 'Patel Engineering Works'],
    buyer: 'Nova Mobility Parts',
    location: 'Pune',
    status: 'RESPONDED',
    createdAt: '2026-03-28',
    matchScore: 88,
  },
  {
    id: 'RFQ-2026-10475',
    product: 'Packaging Machine',
    quantity: '2 units',
    material: 'Industrial Grade',
    grade: 'Custom',
    delivery: 'Hyderabad',
    requiredWithin: '60 days',
    notes: 'Installation support required.',
    manufacturerIds: ['m7'],
    manufacturerNames: ['Prime Packaging Technologies'],
    buyer: 'FreshPack Foods',
    location: 'Hyderabad',
    status: 'VIEWED',
    createdAt: '2026-03-30',
    matchScore: 91,
  },
]

export const verificationQueue: VerificationItem[] = [
  {
    id: 'v1',
    company: 'Patel Engineering Works',
    location: 'Rajkot, Gujarat',
    submittedAt: '2026-04-01',
    status: 'Pending',
    documents: ['GST Certificate', 'Factory Photos', 'ISO Certificate'],
  },
  {
    id: 'v2',
    company: 'North India Electrical Components',
    location: 'Pune, Maharashtra',
    submittedAt: '2026-04-02',
    status: 'Pending',
    documents: ['Company Details', 'Contact Verification'],
  },
  {
    id: 'v3',
    company: 'Shree Industrial Components',
    location: 'Surat, Gujarat',
    submittedAt: '2026-03-29',
    status: 'Info Requested',
    documents: ['GST Certificate', 'Manufacturing Proof'],
  },
]

export const locations = ['Gujarat', 'Maharashtra', 'All India']
export const industries = categories.map((c) => c.name)
export const companySizes = ['1–20', '21–50', '51–100', '101–250', '250+'] as const

export function getManufacturerBySlug(slug: string) {
  return manufacturers.find((m) => m.slug === slug)
}

export function getManufacturerById(id: string) {
  return manufacturers.find((m) => m.id === id)
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function searchManufacturers(query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return manufacturers

  return manufacturers
    .map((m) => {
      let score = 0
      if (m.name.toLowerCase().includes(q)) score += 40
      if (m.state.toLowerCase().includes(q) || m.city.toLowerCase().includes(q)) score += 25
      if (m.industry.toLowerCase().includes(q)) score += 20
      if (m.products.some((p) => p.toLowerCase().includes(q))) score += 30
      if ((q.includes('ss 304') || q.includes('ss304') || q.includes('304')) &&
        m.products.some((p) => p.toLowerCase().includes('ss') || p.toLowerCase().includes('304') || p.toLowerCase().includes('bolt') || p.toLowerCase().includes('screw')))
        score += 35
      if (q.includes('bolt') && m.products.some((p) => p.toLowerCase().includes('bolt'))) score += 30
      if (q.includes('screw') && m.products.some((p) => p.toLowerCase().includes('screw'))) score += 30
      if (q.includes('gujarat') && m.state === 'Gujarat') score += 35
      if (q.includes('packaging') && m.industry.toLowerCase().includes('packaging')) score += 40
      if (q.includes('export') && m.canExport) score += 15
      if (m.verified) score += 5
      if (m.premium) score += 3
      return { ...m, matchScore: Math.min(score, 99) }
    })
    .filter((m) => (m.matchScore ?? 0) > 0)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
}

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return products
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.grade.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.manufacturerName.toLowerCase().includes(q) ||
      ((q.includes('bolt') || q.includes('304') || q.includes('ss')) &&
        (p.name.toLowerCase().includes('bolt') || p.grade.toLowerCase().includes('304'))),
  )
}
