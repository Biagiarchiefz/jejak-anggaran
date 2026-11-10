import { Suspense, useState, type ReactNode } from 'react'
import {
  House,
  ArrowLeft,
  Inbox,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'
import { Badge } from '../common/Badge'
import { Button, TautanTombol } from '../common/Button'
import { EmptyState } from '../common/EmptyState'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { Laci } from '../common/Laci'
import { MenuAkun } from '../../features/auth/components/MenuAkun'
import { SkeletonIsiAdmin, SkeletonPanelAdmin } from '../../features/admin/components/SkeletonAdmin'
import { useLaporanAdmin } from '../../features/admin/hooks/useLaporanAdmin'
import { useAdaDataDemo } from '../../hooks/useAdaDataDemo'
import { useAuth } from '../../hooks/useAuth'
import { logger } from '../../utils/logger'
import { bisaMembukaPanelAdmin, LABEL_PERAN } from '../../utils/peran'
import { keluar, type Pengguna } from '../../services/authService'

type ItemMenu = { ke: string; label: string; ikon: LucideIcon; akhir?: boolean }

const MENU_ADMIN: ItemMenu[] = [
  { ke: '/admin', label: 'Dashboard', ikon: LayoutDashboard, akhir: true },
  { ke: '/admin/laporan', label: 'Laporan warga', ikon: Inbox },
]

// Pilihan ciut/lebar sidebar hanya kenyamanan per peramban; gagal baca/tulis = kembali ke bawaan (lebar).
const KUNCI_CIUT = 'jejak-anggaran:sidebar-admin-ciut'

function bacaCiut(): boolean {
  try {
    return localStorage.getItem(KUNCI_CIUT) === '1'
  } catch {
    return false
  }
}

function simpanCiut(ciut: boolean) {
  try {
    localStorage.setItem(KUNCI_CIUT, ciut ? '1' : '0')
  } catch {
    // Penyimpanan diblokir (mode privat): pilihan tidak diingat, tidak masalah.
  }
}

function kelasTautan(ciut: boolean) {
  return ({ isActive }: { isActive: boolean }) =>
    `relative flex min-h-10 items-center gap-3 rounded-lg text-sm font-medium efek-tekan ${ciut ? 'justify-center px-0' : 'px-3'} ${
      isActive ? 'bg-brand-soft text-action' : 'text-ink-muted hover:bg-recessed hover:text-ink-strong'
    }`
}

/**
 * Tooltip sederhana di kanan elemen, hanya saat sidebar ciut. Muncul saat hover atau fokus keyboard.
 * Nama aksesibel tetap dari label `sr-only` elemennya, jadi tooltip disembunyikan dari pembaca layar.
 */
function DenganTooltip({ teks, aktif, children }: { teks: string; aktif: boolean; children: ReactNode }) {
  if (!aktif) return <>{children}</>
  return (
    <div className="group/tip relative">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-full z-50 ml-2.5 -translate-y-1/2 rounded-md bg-ink-strong px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-pop transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 motion-reduce:transition-none"
      >
        {teks}
      </span>
    </div>
  )
}

type IsiSidebarProps = {
  pengguna: Pengguna
  /** Jumlah laporan yang menunggu verifikasi, tampil sebagai angka di menu Laporan. */
  menunggu: number
  /** Desktop: mode ikon saja. */
  ciut?: boolean
  /** Desktop: tombol ciutkan/lebarkan sidebar. */
  onAlihCiut?: () => void
  onNavigasi?: () => void
  /** Hanya di laci ponsel: tombol tutup di samping logo. */
  onTutup?: () => void
}

/** Isi sidebar admin; dipakai sebagai kolom di desktop (bisa diciutkan) dan sebagai laci di ponsel. */
function IsiSidebar({ pengguna, menunggu, ciut = false, onAlihCiut, onNavigasi, onTutup }: IsiSidebarProps) {
  const navigate = useNavigate()
  const adaDemo = useAdaDataDemo()
  const [keluarMemuat, setKeluarMemuat] = useState(false)

  async function tanganiKeluar() {
    setKeluarMemuat(true)
    try {
      await keluar()
      navigate('/')
    } catch (e) {
      logger.error('Gagal keluar dari panel admin', e)
      setKeluarMemuat(false)
    }
  }

  const tombolIkon = 'grid size-10 shrink-0 place-items-center rounded-lg text-ink-muted efek-tekan hover:bg-recessed hover:text-ink-strong'

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className={`flex h-14 shrink-0 items-center gap-2 border-b border-border ${ciut ? 'justify-center px-2' : 'justify-between pr-2 pl-4'}`}>
        {!ciut && (
          <Link to="/admin" onClick={onNavigasi} className="inline-flex min-h-10 min-w-0 items-center gap-2.5 rounded-md">
            <img src="/favicon.svg" alt="" className="size-7 shrink-0" />
            <span className="truncate font-medium text-ink-strong">Jejak Anggaran</span>
          </Link>
        )}
        {onAlihCiut && (
          <DenganTooltip teks="Lebarkan sidebar" aktif={ciut}>
            <button type="button" onClick={onAlihCiut} aria-expanded={!ciut} aria-label={ciut ? 'Lebarkan sidebar' : 'Ciutkan sidebar'} className={tombolIkon}>
              {ciut ? <PanelLeftOpen className="size-5" strokeWidth={1.5} aria-hidden /> : <PanelLeftClose className="size-5" strokeWidth={1.5} aria-hidden />}
            </button>
          </DenganTooltip>
        )}
        {onTutup && (
          <button type="button" onClick={onTutup} aria-label="Tutup menu admin" className={tombolIkon}>
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        )}
      </div>

      <p className={`px-5 pt-5 text-[11px] font-semibold tracking-[0.06em] text-ink-subtle uppercase ${ciut ? 'sr-only' : ''}`}>Panel admin</p>
      <nav aria-label="Menu admin" className={ciut ? 'px-3 pt-4' : 'px-3 pt-2'}>
        <ul className="space-y-1">
          {MENU_ADMIN.map((m) => {
            const angka = m.ke === '/admin/laporan' && menunggu > 0 ? menunggu : null
            return (
              <li key={m.ke}>
                <DenganTooltip teks={angka ? `${m.label} (${angka} menunggu)` : m.label} aktif={ciut}>
                  <NavLink to={m.ke} end={m.akhir} className={kelasTautan(ciut)} onClick={onNavigasi}>
                    <m.ikon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span className={ciut ? 'sr-only' : 'truncate'}>{m.label}</span>
                    {angka !== null && (
                      <span
                        className={`rounded-full bg-action text-white tabular-nums ${
                          ciut ? 'absolute top-0.5 right-0.5 min-w-4 px-1 text-center text-[10px] leading-4 font-semibold' : 'ml-auto px-2 text-xs leading-5 font-semibold'
                        }`}
                      >
                        {angka}
                        <span className="sr-only"> menunggu verifikasi</span>
                      </span>
                    )}
                  </NavLink>
                </DenganTooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={`mt-auto border-t border-border ${ciut ? 'space-y-1 px-3 py-3' : 'space-y-3 p-4'}`}>
        <DenganTooltip teks="Kembali ke situs publik" aktif={ciut}>
          <NavLink to="/" className={kelasTautan(ciut)({ isActive: false })} onClick={onNavigasi}>
            <ArrowLeft className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className={ciut ? 'sr-only' : 'truncate'}>Kembali ke situs publik</span>
          </NavLink>
        </DenganTooltip>
        {ciut ? (
          <DenganTooltip teks="Keluar" aktif>
            <button type="button" onClick={tanganiKeluar} disabled={keluarMemuat} aria-label="Keluar" className={`${tombolIkon} w-full disabled:opacity-60`}>
              <LogOut className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </DenganTooltip>
        ) : (
          <>
            <div className="rounded-lg bg-canvas-soft p-3">
              <p className="truncate text-sm font-medium text-ink-strong">{pengguna.email}</p>
              <Badge nada="info" ringkas className="mt-1">
                {LABEL_PERAN[pengguna.peran]}
              </Badge>
              <Button varian="kedua" ukuran="sm" memuat={keluarMemuat} onClick={tanganiKeluar} className="mt-3 w-full">
                {!keluarMemuat && <LogOut className="size-4" strokeWidth={1.5} aria-hidden />}
                Keluar
              </Button>
            </div>
            {adaDemo && <p className="text-xs leading-relaxed text-ink-subtle">Sebagian data di panel ini adalah data demo (fiktif).</p>}
          </>
        )}
      </div>
    </div>
  )
}

/** Tampil jika /admin dibuka tanpa masuk atau dengan akun warga. */
function TanpaAkses({ sudahMasuk }: { sudahMasuk: boolean }) {
  return (
    <main id="konten" className="grid min-h-dvh place-items-center bg-canvas px-4">
      <title>Panel admin — Jejak Anggaran</title>
      <div className="w-full max-w-md">
        <EmptyState
          ikon={ShieldCheck}
          judul="Halaman ini khusus admin"
          pesan={sudahMasuk ? 'Akun Anda tidak memiliki peran admin.' : 'Silakan masuk dengan akun admin atau akun admin demo.'}
          aksi={
            <div className="flex flex-wrap justify-center gap-2">
              {!sudahMasuk && <TautanTombol to="/masuk?kembali=/admin">Masuk</TautanTombol>}
              <TautanTombol to="/" varian="kedua">
                Ke beranda
              </TautanTombol>
            </div>
          }
        />
      </div>
    </main>
  )
}

/** Item bottom navigation admin: ikon + label 12px, sama seperti situs publik (Navbar). */
function kelasTautanBawah({ isActive }: { isActive: boolean }) {
  return `relative flex h-full flex-col items-center justify-center gap-1 text-xs font-medium efek-tekan ${
    isActive ? 'text-link' : 'text-ink-muted hover:text-ink-strong'
  }`
}

function PanelAdmin({ pengguna }: { pengguna: Pengguna }) {
  const lokasi = useLocation()
  const navigate = useNavigate()
  const muat = useLaporanAdmin()
  const [laciTerbuka, setLaciTerbuka] = useState(false)
  const [ciut, setCiut] = useState(bacaCiut)
  const menunggu = muat.data?.laporan.filter((l) => l.status === 'diterima').length ?? 0
  const tutupLaci = () => setLaciTerbuka(false)
  function alihCiut() {
    setCiut(!ciut)
    simpanCiut(!ciut)
  }
  async function keluarDariPanel() {
    try {
      await keluar()
      navigate('/')
    } catch (e) {
      logger.error('Gagal keluar dari panel admin', e)
    }
  }

  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1200] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Lewati ke konten
      </a>

      {/* Desktop: sidebar di kiri, bisa diciutkan ke mode ikon. Kolom konten (flex-1) ikut bergeser mengikuti lebarnya.
          overflow-hidden hanya saat lebar, agar teks tidak meluber selama transisi; saat ciut tooltip perlu keluar dari kolom. */}
      <aside
        className={`hidden shrink-0 border-r border-border bg-surface transition-[width] duration-300 ease-(--ease-standard) motion-reduce:transition-none lg:block ${
          ciut ? 'w-16' : 'w-64 overflow-hidden'
        }`}
      >
        <div className="sticky top-0 h-dvh">
          <IsiSidebar pengguna={pengguna} menunggu={menunggu} ciut={ciut} onAlihCiut={alihCiut} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Ponsel & tablet: header putih 64px seperti situs publik — logo + label Admin di kiri, avatar akun dan menu di kanan. */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface lg:hidden">
          <div className="flex h-full items-center gap-2 px-4 sm:px-6">
            <Link to="/admin" className="inline-flex min-h-11 min-w-0 items-center gap-2.5 rounded-md">
              <img src="/favicon.svg" alt="" className="size-7 shrink-0" />
              <span className="truncate text-lg font-medium text-ink-strong">Jejak Anggaran</span>
            </Link>
            <Badge nada="info" ringkas>
              Admin
            </Badge>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <MenuAkun pengguna={pengguna} onKeluar={keluarDariPanel} />
              <button
                type="button"
                onClick={() => setLaciTerbuka(true)}
                aria-haspopup="dialog"
                aria-expanded={laciTerbuka}
                aria-label="Buka menu admin"
                className="-mr-2.5 grid size-11 place-items-center rounded-full text-ink efek-tekan hover:bg-recessed"
              >
                <Menu className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        </header>

        {/* pb-24 di ponsel & tablet: ruang untuk bottom navigation. */}
        <main id="konten" className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-7">
          {pengguna.peran === 'admin_demo' && (
            <p className="flex items-start gap-2.5 rounded-xl bg-brand-soft px-3.5 py-2.5 text-sm text-ink">
              <Info className="mt-0.5 size-4 shrink-0 text-link" strokeWidth={1.5} aria-hidden />
              <span>
                Anda masuk sebagai <strong className="font-medium">admin demo</strong>. Semua laporan bisa dilihat, tetapi hanya
                laporan demo yang bisa diubah statusnya.
              </span>
            </p>
          )}
          {/* key = path: setiap pindah halaman, konten baru memudar masuk. */}
          <div key={lokasi.pathname} className="animate-halaman-masuk motion-reduce:animate-none">
            <ErrorBoundary resetKey={lokasi.pathname}>
              <Suspense fallback={<SkeletonIsiAdmin pathname={lokasi.pathname} />}>
                <Outlet context={muat} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Ponsel & tablet: bottom navigation 64px seperti situs publik, dengan jumlah laporan menunggu di ikon Laporan. */}
      <nav aria-label="Navigasi admin" className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-border bg-surface lg:hidden">
        <ul className="mx-auto grid h-full max-w-xl grid-cols-4">
          <li>
            <NavLink to="/admin" end className={kelasTautanBawah}>
              <LayoutDashboard className="size-5" strokeWidth={1.5} aria-hidden />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/laporan" className={kelasTautanBawah}>
              <span className="relative">
                <Inbox className="size-5" strokeWidth={1.5} aria-hidden />
                {menunggu > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 rounded-full bg-action px-1 text-center text-[10px] leading-4 font-semibold text-white tabular-nums ring-2 ring-surface">
                    {menunggu}
                    <span className="sr-only"> menunggu verifikasi</span>
                  </span>
                )}
              </span>
              Laporan
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className={kelasTautanBawah}>
              <House className="size-5" strokeWidth={1.5} aria-hidden />
              Situs publik
            </NavLink>
          </li>
          <li>
            <button type="button" onClick={() => setLaciTerbuka(true)} aria-haspopup="dialog" className={`w-full ${kelasTautanBawah({ isActive: false })}`}>
              <Menu className="size-5" strokeWidth={1.5} aria-hidden />
              Menu
            </button>
          </li>
        </ul>
      </nav>

      <Laci
        terbuka={laciTerbuka}
        onTutup={tutupLaci}
        label="Menu admin"
        arah="kiri"
        className="fixed inset-y-0 left-0 h-dvh w-[min(18rem,85vw)] lg:hidden"
      >
        <IsiSidebar pengguna={pengguna} menunggu={menunggu} onNavigasi={tutupLaci} onTutup={tutupLaci} />
      </Laci>

      <ScrollRestoration />
    </div>
  )
}

/**
 * Layout panel admin: terpisah dari layout publik (tanpa navbar, footer, dan bottom navigation situs).
 * Sidebar di desktop, laci di ponsel. Data laporan dimuat sekali di sini untuk semua halaman admin.
 */
export function AdminLayout() {
  const { pengguna, memuat } = useAuth()
  const { pathname } = useLocation()
  if (memuat) {
    return (
      <div role="status">
        <span className="sr-only">Memuat panel admin…</span>
        <SkeletonPanelAdmin pathname={pathname} />
      </div>
    )
  }
  if (!pengguna || !bisaMembukaPanelAdmin(pengguna.peran)) return <TanpaAkses sudahMasuk={!!pengguna} />
  return <PanelAdmin pengguna={pengguna} />
}
