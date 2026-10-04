import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from './context/AppContext'
import { PublicLayout } from './components/layout/PublicLayout'
import { ManufacturerLayout } from './components/layout/ManufacturerLayout'
import { AdminLayout } from './components/layout/AdminLayout'

import { Home } from './pages/Home'
import { Manufacturers } from './pages/Manufacturers'
import { ManufacturerProfile } from './pages/ManufacturerProfile'
import { ProductPage } from './pages/ProductPage'
import { Products } from './pages/Products'
import { SearchResults } from './pages/SearchResults'
import { Compare } from './pages/Compare'
import { AISearch } from './pages/AISearch'
import { Categories } from './pages/Categories'
import { Services } from './pages/Services'
import { Resources } from './pages/Resources'

import { MyRFQs } from './pages/MyRFQs'
import { Saved } from './pages/Saved'

import { ManufacturerOverview } from './pages/manufacturer/Dashboard'
import { ManufacturerRFQs } from './pages/manufacturer/RFQs'
import { ManufacturerProducts } from './pages/manufacturer/Products'
import { ManufacturerProfileEdit } from './pages/manufacturer/Profile'
import { ManufacturerVerification } from './pages/manufacturer/Verification'
import { ManufacturerPromotion } from './pages/manufacturer/Promotion'
import { ManufacturerAnalytics } from './pages/manufacturer/Analytics'
import { ManufacturerInquiries } from './pages/manufacturer/Inquiries'
import { ManufacturerServicesPage } from './pages/manufacturer/Services'
import { ManufacturerBroadcasts } from './pages/manufacturer/Broadcasts'
import { ManufacturerSettings } from './pages/manufacturer/Settings'
import { ManufacturerAIProduct } from './pages/manufacturer/AIProduct'

import { AdminOverview } from './pages/admin/Dashboard'
import { AdminManufacturers } from './pages/admin/Manufacturers'
import { AdminRFQs } from './pages/admin/RFQs'
import { AdminVerification } from './pages/admin/Verification'
import { AdminAdvertisements } from './pages/admin/Advertisements'
import { AdminProducts } from './pages/admin/Products'
import { AdminCategories } from './pages/admin/Categories'
import { AdminVendors } from './pages/admin/Vendors'
import { AdminServices } from './pages/admin/Services'
import { AdminBroadcasts } from './pages/admin/Broadcasts'
import { AdminAnalytics } from './pages/admin/Analytics'
import { AdminSettings } from './pages/admin/Settings'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="manufacturers" element={<Manufacturers />} />
            <Route path="manufacturers/:slug" element={<ManufacturerProfile />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="compare" element={<Compare />} />
            <Route path="ai-search" element={<AISearch />} />
            <Route path="categories" element={<Categories />} />
            <Route path="services" element={<Services />} />
            <Route path="resources" element={<Resources />} />
            <Route path="my-rfqs" element={<MyRFQs />} />
            <Route path="saved" element={<Saved />} />
            <Route path="ai-product-generator" element={<Navigate to="/manufacturer/ai-product" replace />} />
          </Route>

          <Route path="buyer/saved-products" element={<Navigate to="/saved?tab=products" replace />} />
          <Route path="buyer/saved-manufacturers" element={<Navigate to="/saved" replace />} />
          <Route path="buyer/*" element={<Navigate to="/my-rfqs" replace />} />

          <Route path="manufacturer" element={<ManufacturerLayout />}>
            <Route index element={<ManufacturerOverview />} />
            <Route path="profile" element={<ManufacturerProfileEdit />} />
            <Route path="products" element={<ManufacturerProducts />} />
            <Route path="rfqs" element={<ManufacturerRFQs />} />
            <Route path="inquiries" element={<ManufacturerInquiries />} />
            <Route path="verification" element={<ManufacturerVerification />} />
            <Route path="promotion" element={<ManufacturerPromotion />} />
            <Route path="analytics" element={<ManufacturerAnalytics />} />
            <Route path="ai-product" element={<ManufacturerAIProduct />} />
            <Route path="services" element={<ManufacturerServicesPage />} />
            <Route path="broadcasts" element={<ManufacturerBroadcasts />} />
            <Route path="settings" element={<ManufacturerSettings />} />
            <Route path="dashboard" element={<Navigate to="/manufacturer" replace />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="manufacturers" element={<AdminManufacturers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="rfqs" element={<AdminRFQs />} />
            <Route path="verification" element={<AdminVerification />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="advertisements" element={<AdminAdvertisements />} />
            <Route path="broadcasts" element={<AdminBroadcasts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ className: 'font-[Inter]' }}
        />
      </BrowserRouter>
    </AppProvider>
  )
}
