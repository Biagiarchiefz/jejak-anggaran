import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Layout } from '../components/layout/Layout'
import { LayoutPolos } from '../components/layout/LayoutPolos'

// Halaman dimuat terpisah agar Leaflet dan Recharts tidak memperlambat muatan awal.
const BerandaPage = lazy(() => import('../pages/BerandaPage'))
const AnggaranPage = lazy(() => import('../pages/AnggaranPage'))
const PetaPage = lazy(() => import('../pages/PetaPage'))
const ProyekDetailPage = lazy(() => import('../pages/ProyekDetailPage'))
const LaporPage = lazy(() => import('../pages/LaporPage'))
const TentangDataPage = lazy(() => import('../pages/TentangDataPage'))
const MasukPage = lazy(() => import('../pages/MasukPage'))
const AdminDasborPage = lazy(() => import('../pages/AdminDasborPage'))
const AdminLaporanPage = lazy(() => import('../pages/AdminLaporanPage'))
const TidakDitemukanPage = lazy(() => import('../pages/TidakDitemukanPage'))

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
      { path: '*', element: <TidakDitemukanPage /> },
    ],
  },
  {
    // Halaman yang berdiri sendiri: tanpa navbar, footer, dan bottom navigation.
    element: <LayoutPolos />,
    children: [{ path: 'masuk', element: <MasukPage /> }],
  },
  {
    // Panel admin punya layout sendiri (sidebar), terpisah dari navbar & footer situs publik.
    path: 'admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDasborPage /> },
      { path: 'laporan', element: <AdminLaporanPage /> },
    ],
  },
])

export function AppRoutes() {
  return <RouterProvider router={router} />
}
