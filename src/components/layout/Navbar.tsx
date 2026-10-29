import { useState } from 'react'
import { BookOpen, House, Landmark, Map as IkonPeta, Megaphone, Menu, Search, UserRound, X, type LucideIcon } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { MenuAkun } from '../../features/auth/components/MenuAkun'
import { PencarianCepat } from './PencarianCepat'
import { Laci } from '../common/Laci'
import { useAuth } from '../../hooks/useAuth'
import { useDigulir } from '../../hooks/useDigulir'
import { logger } from '../../utils/logger'
import { URL_LAPOR } from '../../utils/ringkasanLapor'
import { keluar } from '../../services/authService'

/** `pendek`: label di bottom navigation yang sempit. */
type ItemMenu = { ke: string; label: string; pendek?: string; ikon: LucideIcon }

const MENU: ItemMenu[] = [
  { ke: '/', label: 'Beranda', ikon: House },
  { ke: '/anggaran', label: 'Anggaran', ikon: Landmark },
  { ke: '/peta', label: 'Peta Proyek', pendek: 'Peta', ikon: IkonPeta },
  { ke: '/tentang-data', label: 'Tentang Data', pendek: 'Data', ikon: BookOpen },
]

/** Logo teks + ikon sendiri (DESIGN.md §7.2). */
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-md">
      <img src="/favicon.svg" alt="" className="size-7" />
      <span className="text-lg font-medium text-ink-strong">Jejak Anggaran</span>
    </Link>
  )
}

// Item aktif: teks ink-strong + garis bawah 2px brand. Hover: garis abu tumbuh dari kiri.
function kelasTautanDesktop({ isActive }: { isActive: boolean }) {
  return `relative inline-flex h-16 items-center px-3 text-sm font-medium transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:bg-brand after:transition-transform after:duration-[240ms] after:ease-(--ease-standard) motion-reduce:after:transition-none ${
    isActive ? 'text-ink-strong after:scale-x-100' : 'text-ink-muted after:scale-x-0 hover:text-ink-strong hover:after:scale-x-100 hover:after:bg-border-strong'
  }`
}

function kelasTautanLaci({ isActive }: { isActive: boolean }) {
  return `flex min-h-12 items-center gap-3 rounded-md px-3 text-lg font-medium efek-tekan ${
    isActive ? 'bg-brand-soft text-ink-strong' : 'text-ink-muted hover:bg-recessed hover:text-ink-strong'
  }`
}

function kelasTautanBawah({ isActive }: { isActive: boolean }) {
  return `flex h-full flex-col items-center justify-center gap-1 text-xs font-medium efek-tekan ${
    isActive ? 'text-link' : 'text-ink-muted hover:text-ink-strong'
  }`
}

// Item di laci muncul bergantian (fade + geser 8px) setiap kali laci dibuka.
const MASUK_BERTAHAP =
  'transition-[opacity,translate] duration-[320ms] ease-(--ease-out-soft) starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none'
const jeda = (urutan: number) => ({ transitionDelay: `${100 + urutan * 40}ms` })

/**
 * Header yang menempel: logo kiri, tautan (desktop), cari, masuk. Di Beranda sebelum digulir header transparan tanpa
 * garis bawah sehingga peta latar hero terlihat di baliknya; setelah digulir berubah ke `surface` dengan garis bawah.
 * Di ponsel/tablet: logo + cari + tombol menu, dan navigasi utama pindah ke bottom navigation.
 */
export function Navbar() {
  const { pengguna } = useAuth()
  const { pathname } = useLocation()
  const digulir = useDigulir()
  // Di Beranda sebelum digulir: header transparan, menyatu dengan hero yang ditarik ke belakangnya (lihat FlatProjectMap).
  const menyatuDenganHero = pathname === '/' && !digulir
  const [panel, setPanel] = useState<'menu' | 'cari' | null>(null)
  const [pathPanel, setPathPanel] = useState(pathname)

  // Tutup panel saat pindah halaman.
  if (pathPanel !== pathname) {
    setPathPanel(pathname)
    setPanel(null)
  }

  const tutup = () => setPanel(null)

  async function tanganiKeluar() {
    try {
      await keluar()
      tutup()
    } catch (e) {
      logger.error('Navbar: keluar', e)
    }
  }

  // Panel admin punya layout dan sidebar sendiri (/admin); pintunya lewat menu akun, bukan navbar publik.
  const menu = MENU

  const tombolIkon =
    'inline-flex size-11 items-center justify-center rounded-full text-ink efek-tekan hover:bg-recessed'

  return (
    <>
      <header
        className={`sticky top-0 z-[1100] h-16 border-b transition-[background-color,border-color] duration-[240ms] ease-(--ease-standard) ${
          menyatuDenganHero ? 'border-transparent bg-transparent' : 'border-border bg-surface'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Menu utama" className="ml-6 hidden lg:block">
            <ul className="flex">
              {menu.map((m) => (
                <li key={m.ke}>
                  <NavLink to={m.ke} end={m.ke === '/'} className={kelasTautanDesktop}>
                    {m.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              className={tombolIkon}
              aria-haspopup="dialog"
              aria-expanded={panel === 'cari'}
              onClick={() => setPanel('cari')}
            >
              <Search className="size-5" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">Cari proyek</span>
            </button>

            {/* Sudah masuk: avatar berinisial + menu akun (semua ukuran layar). Belum: tombol Masuk (desktop). */}
            {pengguna ? (
              <MenuAkun pengguna={pengguna} onKeluar={tanganiKeluar} className="lg:ml-1" />
            ) : (
              <Link
                to="/masuk"
                // Transparan bergaris tepi selama header menyatu dengan hero (tidak bersaing dengan tombol utama hero);
                // biru setelah digulir dan di halaman lain, saat header sudah putih.
                className={`ml-2 hidden min-h-11 items-center rounded-full border px-5 text-sm font-medium efek-tekan lg:inline-flex ${
                  menyatuDenganHero
                    ? 'border-border-strong bg-transparent text-ink hover:bg-surface/70'
                    : 'border-transparent bg-action text-white hover:bg-action-hover'
                }`}
              >
                Masuk
              </Link>
            )}

            <button
              type="button"
              className={`-mr-2.5 lg:hidden ${tombolIkon}`}
              aria-haspopup="dialog"
              aria-expanded={panel === 'menu'}
              onClick={() => setPanel('menu')}
            >
              <Menu className="size-6" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">Buka menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom navigation (ponsel & tablet): ikon + label 12px, tinggi 64px. */}
      <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-[1100] h-16 border-t border-border bg-surface lg:hidden">
        <ul className="mx-auto grid h-full max-w-xl grid-cols-5">
          {[...MENU, { ke: '/masuk', label: 'Akun', ikon: UserRound }].map((m) => (
            <li key={m.ke}>
              <NavLink to={m.ke} end={m.ke === '/'} className={kelasTautanBawah}>
                <m.ikon className="size-5" strokeWidth={1.5} aria-hidden />
                {m.pendek ?? m.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Laci
        terbuka={panel === 'menu'}
        onTutup={tutup}
        label="Menu utama"
        arah="kiri"
        className="fixed inset-y-0 left-0 h-dvh w-[min(22rem,88vw)]"
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pt-3 pb-6">
          <div className="flex items-center justify-between gap-3">
            <Logo onClick={tutup} />
            <button type="button" onClick={tutup} className={`-mr-2.5 ${tombolIkon}`} aria-label="Tutup menu">
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <nav aria-label="Menu utama" className="mt-6">
            <ul className="space-y-1">
              {menu.map((m, i) => (
                <li key={m.ke} className={MASUK_BERTAHAP} style={jeda(i)}>
                  <NavLink to={m.ke} end={m.ke === '/'} className={kelasTautanLaci} onClick={tutup}>
                    <m.ikon className="size-5" strokeWidth={1.5} aria-hidden />
                    {m.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`mt-6 space-y-3 border-t border-border pt-6 ${MASUK_BERTAHAP}`} style={jeda(menu.length)}>
            <Link
              to="/peta"
              onClick={tutup}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-6 text-sm font-medium text-white efek-tekan hover:bg-action-hover"
            >
              <Megaphone className="size-4" strokeWidth={1.5} aria-hidden />
              Laporkan kondisi proyek
            </Link>
            {pengguna ? (
              <button
                type="button"
                onClick={tanganiKeluar}
                className="flex min-h-11 w-full items-center justify-center rounded-full border border-border-strong px-6 text-sm font-medium text-ink efek-tekan hover:bg-canvas-soft"
              >
                Keluar
              </button>
            ) : (
              <Link
                to="/masuk"
                onClick={tutup}
                className="flex min-h-11 items-center justify-center rounded-full border border-border-strong px-6 text-sm font-medium text-ink efek-tekan hover:bg-canvas-soft"
              >
                Masuk
              </Link>
            )}
          </div>

          <p className="mt-auto pt-8 text-xs text-ink-subtle">
            Situs warga independen. Tindak lanjut resmi tetap melalui{' '}
            <a href={URL_LAPOR} target="_blank" rel="noopener noreferrer" className="font-medium text-link hover:underline">
              lapor.go.id ↗<span className="sr-only"> (membuka tab baru)</span>
            </a>
            .
          </p>
        </div>
      </Laci>

      <Laci
        terbuka={panel === 'cari'}
        onTutup={tutup}
        label="Cari proyek"
        arah="atas"
        className="fixed inset-x-0 top-0 max-h-[85dvh] w-full overflow-y-auto border-b border-border"
      >
        <PencarianCepat onTutup={tutup} />
      </Laci>
    </>
  )
}
