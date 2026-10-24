import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { logger } from '../lib/logger'
import { URL_LAPOR } from '../lib/ringkasanLapor'
import { keluar } from '../services/authService'

const MENU = [
  { ke: '/', label: 'Beranda' },
  { ke: '/peta', label: 'Peta Proyek' },
  { ke: '/tentang-data', label: 'Tentang Data' },
]

function IkonMegafon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className ?? 'size-4'} aria-hidden>
      <path d="M13.92 3.85a.75.75 0 0 1 1.08.67v10.96a.75.75 0 0 1-1.08.67L9.5 13.97V17a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3.25H5a3 3 0 0 1-3-3v-1.5a3 3 0 0 1 3-3h4.5l4.42-2.4ZM16.5 8a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 16.5 8Z" />
    </svg>
  )
}

function IkonMenu({ terbuka }: { terbuka: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-6" aria-hidden>
      {terbuka ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

function kelasMenu({ isActive }: { isActive: boolean }) {
  return `relative block rounded-ui px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-merek-800 lg:after:absolute lg:after:inset-x-3 lg:after:-bottom-[13px] lg:after:h-[3px] lg:after:rounded-full lg:after:bg-aksen' : 'text-slate-600 hover:text-slate-900'
  } ${isActive ? 'max-lg:bg-merek-50' : 'max-lg:hover:bg-slate-50'}`
}

export function Navbar() {
  const { pengguna } = useAuth()
  const { pathname } = useLocation()
  const [terbuka, setTerbuka] = useState(false)
  const [pathMenu, setPathMenu] = useState(pathname)

  // Tutup menu ponsel saat pindah halaman.
  if (pathMenu !== pathname) {
    setPathMenu(pathname)
    setTerbuka(false)
  }

  async function tanganiKeluar() {
    try {
      await keluar()
    } catch (e) {
      logger.error('Navbar: keluar', e)
    }
  }

  const menu = [...MENU, ...(pengguna?.peran === 'admin' ? [{ ke: '/admin', label: 'Admin' }] : [])]

  const tombolAkun = pengguna ? (
    <button type="button" onClick={tanganiKeluar} className="rounded-ui px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
      Keluar
    </button>
  ) : (
    <NavLink to="/masuk" className="rounded-ui px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
      Masuk
    </NavLink>
  )

  return (
    <header className="relative z-[1100]">
      {/* Pita atas: penegasan status situs + kanal pengaduan resmi. */}
      <div className="bg-merek-900 text-xs text-merek-100">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2">
          <p>Situs warga independen, bukan situs resmi Pemerintah Kota Bandung.</p>
          <a
            href={URL_LAPOR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-white hover:underline"
          >
            <span className="size-1.5 rounded-full bg-aksen" aria-hidden />
            Pengaduan resmi: lapor.go.id
            <span className="sr-only">(membuka tab baru)</span>
          </a>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-10 shrink-0" />
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-medium tracking-wide text-slate-900 sm:text-base">JEJAK ANGGARAN</span>
              <span className="block truncate text-xs text-slate-500">Transparansi Uang Publik · Kota Bandung</span>
            </span>
          </Link>

          <nav aria-label="Menu utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menu.map((m) => (
                <li key={m.ke}>
                  <NavLink to={m.ke} end={m.ke === '/'} className={kelasMenu}>
                    {m.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden lg:block">{tombolAkun}</div>
            <Link
              to="/peta"
              className="hidden items-center gap-2 rounded-ui bg-merek-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-merek-900 hover:shadow-md sm:inline-flex"
            >
              <IkonMegafon />
              Lapor Kondisi Proyek
            </Link>
            <button
              type="button"
              className="rounded-ui p-2 text-merek-900 hover:bg-slate-100 lg:hidden"
              aria-expanded={terbuka}
              aria-controls="menu-ponsel"
              aria-label={terbuka ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setTerbuka((t) => !t)}
            >
              <IkonMenu terbuka={terbuka} />
            </button>
          </div>
        </div>

        {terbuka && (
          <nav id="menu-ponsel" aria-label="Menu utama" className="border-t border-slate-200 px-4 pt-2 pb-4 lg:hidden">
            <ul className="space-y-1">
              {menu.map((m) => (
                <li key={m.ke}>
                  <NavLink to={m.ke} end={m.ke === '/'} className={kelasMenu}>
                    {m.label}
                  </NavLink>
                </li>
              ))}
              <li>{tombolAkun}</li>
            </ul>
            <Link
              to="/peta"
              className="mt-3 flex items-center justify-center gap-2 rounded-ui bg-merek-800 px-4 py-3 text-sm font-medium text-white sm:hidden"
            >
              <IkonMegafon />
              Lapor Kondisi Proyek
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
