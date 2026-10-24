import { Suspense } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ErrorBoundary } from './ErrorBoundary'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { SkeletonHalaman } from './ui/Skeleton'

export function Layout() {
  const lokasi = useLocation()

  return (
    // @container: hero di Beranda mengukur lebar halaman tanpa scrollbar lewat unit cqw.
    <div className="@container flex min-h-dvh flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1200] focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Lewati ke konten
      </a>

      <Navbar />

      {/* Kontainer standar untuk semua halaman (juga dipakai Navbar & Footer). */}
      <main id="konten" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-20 sm:px-6 lg:px-8 lg:pt-8">

        <ErrorBoundary resetKey={lokasi.pathname}>
          <Suspense fallback={<SkeletonHalaman />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ScrollRestoration />
      <Footer />
    </div>
  )
}
