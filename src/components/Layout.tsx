import { Suspense, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ErrorBoundary } from './ErrorBoundary'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { SkeletonHalaman } from './ui/Skeleton'
import { useAnimasiMuncul } from '../hooks/useAnimasiMuncul'

export function Layout() {
  const lokasi = useLocation()
  // Beranda tersusun dari section selebar layar (hero, pita gelap, CTA) yang mengatur jaraknya sendiri.
  const beranda = lokasi.pathname === '/'
  const refMain = useRef<HTMLElement>(null)
  useAnimasiMuncul(refMain)

  return (
    // @container: section selebar layar di Beranda memakai unit cqw.
    // pb-16: ruang untuk bottom navigation di ponsel & tablet.
    <div className="@container flex min-h-dvh flex-col pb-16 lg:pb-0">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1200] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Lewati ke konten
      </a>

      <Navbar />

      {/* Kontainer standar 1280px untuk semua halaman (juga dipakai Navbar & Footer). */}
      <main
        ref={refMain}
        id="konten"
        className={`mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 ${beranda ? '' : 'pt-8 pb-16 md:pt-12 md:pb-24'}`}
      >
        {/* key = path: setiap pindah halaman, konten baru memudar masuk. */}
        <div key={lokasi.pathname} className="animate-halaman-masuk motion-reduce:animate-none">
          <ErrorBoundary resetKey={lokasi.pathname}>
            <Suspense fallback={<SkeletonHalaman />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <ScrollRestoration />
      <Footer />
    </div>
  )
}
