import { Suspense } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { SkeletonHalaman } from '../common/Skeleton'

/**
 * Layout tanpa navbar, footer, dan bottom navigation, untuk halaman yang berdiri sendiri (mis. masuk/daftar).
 * Tetap memberi ErrorBoundary + Suspense route-level seperti `Layout`.
 */
export function LayoutPolos() {
  const lokasi = useLocation()
  return (
    <>
      <ErrorBoundary resetKey={lokasi.pathname}>
        <Suspense
          fallback={
            <div className="mx-auto max-w-sm px-4 py-16">
              <SkeletonHalaman baris={1} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      <ScrollRestoration />
    </>
  )
}
