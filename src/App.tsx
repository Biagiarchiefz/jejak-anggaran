import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from './components/AuthProvider'
import { Layout } from './components/Layout'

// Halaman dimuat terpisah agar Leaflet dan Recharts tidak memperlambat muatan awal.
const BerandaPage = lazy(() => import('./pages/BerandaPage'))
const AnggaranPage = lazy(() => import('./pages/AnggaranPage'))
const PetaPage = lazy(() => import('./pages/PetaPage'))
const ProyekDetailPage = lazy(() => import('./pages/ProyekDetailPage'))
const LaporPage = lazy(() => import('./pages/LaporPage'))
const TentangDataPage = lazy(() => import('./pages/TentangDataPage'))
const MasukPage = lazy(() => import('./pages/MasukPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const TidakDitemukanPage = lazy(() => import('./pages/TidakDitemukanPage'))

// Setiap halaman dibungkus <ErrorBoundary> route-level di dalam <Layout>.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <BerandaPage /> },
      { path: 'anggaran', element: <AnggaranPage /> },
      { path: 'peta', element: <PetaPage /> },
      { path: 'proyek/:id', element: <ProyekDetailPage /> },
      { path: 'proyek/:id/lapor', element: <LaporPage /> },
      { path: 'tentang-data', element: <TentangDataPage /> },
      { path: 'masuk', element: <MasukPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <TidakDitemukanPage /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
