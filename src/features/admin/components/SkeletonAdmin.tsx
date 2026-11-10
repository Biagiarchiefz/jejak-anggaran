import { Skeleton, SkeletonBaris } from '../../../components/common/Skeleton'

// Hanya bergantung pada primitif skeleton: dipakai juga sebagai fallback di AdminLayout (sebelum halaman di-lazy-load).

const KARTU = 'rounded-xl border border-border bg-surface'

/** Placeholder <KepalaAdmin>: judul text-2xl + deskripsi text-sm 2 baris. */
export function SkeletonKepalaAdmin({ lebarJudul = 'w-40' }: { lebarJudul?: string }) {
  return (
    <div aria-hidden>
      <div className="text-2xl leading-tight">
        <SkeletonBaris className={lebarJudul} />
      </div>
      <div className="mt-1 max-w-[720px] text-sm leading-relaxed">
        <SkeletonBaris className="w-full" />
        <SkeletonBaris className="w-1/2" />
      </div>
    </div>
  )
}

/** Satu <KartuAngka>: label + ikon kotak di kanan atas → angka besar. */
function SkeletonKartuAngka({ className }: { className?: string }) {
  return (
    <div className={`bg-surface p-3.5 sm:rounded-xl sm:border sm:border-border ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs leading-tight">
          <SkeletonBaris className="w-20" />
        </div>
        <Skeleton className="size-7 shrink-0 rounded-lg" />
      </div>
      <div className="mt-1 text-2xl leading-none">
        <SkeletonBaris className="w-10" />
      </div>
    </div>
  )
}

/**
 * /admin selama data dimuat: 5 kartu angka → kartu waktu respons (angka, 3 statistik, batang sebaran + legenda)
 * dan kartu prioritas verifikasi (5 baris laporan dengan badge dan chevron).
 */
export function SkeletonDasborAdmin() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Memuat ringkasan laporan…</span>
      <div aria-hidden className="space-y-3">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-5">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonKartuAngka key={i} />
          ))}
          <SkeletonKartuAngka className="col-span-2 sm:col-span-2 lg:col-span-1" />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className={`${KARTU} order-2 min-w-0 p-4 lg:order-none`}>
            <div className="flex items-center gap-2 text-xs">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <SkeletonBaris className="w-36" />
            </div>
            <div className="mt-1.5 text-2xl leading-none">
              <SkeletonBaris className="w-24" />
            </div>
            <div className="mt-1.5 text-xs">
              <SkeletonBaris className="w-11/12" />
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-border-soft rounded-lg bg-canvas-soft py-2.5">
              {['w-16', 'w-20', 'w-10'].map((lebar) => (
                <div key={lebar} className="flex flex-col items-center">
                  <div className="text-[11px]">
                    <SkeletonBaris className={lebar} />
                  </div>
                  <div className="mt-0.5 text-base">
                    <SkeletonBaris className="w-8" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {['w-16', 'w-14', 'w-12', 'w-12'].map((lebar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="size-2 shrink-0 rounded-full" />
                    <SkeletonBaris className={lebar} />
                    <span className="ml-auto">
                      <SkeletonBaris className="w-4" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${KARTU} order-1 flex min-w-0 flex-col p-4 lg:order-none`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <SkeletonBaris className="w-36" />
                </div>
                <div className="mt-0.5 text-xs">
                  <SkeletonBaris className="w-4/5" />
                </div>
              </div>
              <Skeleton className="h-4.5 w-20 shrink-0 rounded-full" />
            </div>
            <div className="-mx-1.5 mt-2 space-y-0.5">
              {['w-24', 'w-32', 'w-28', 'w-24', 'w-32'].map((lebar, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <SkeletonBaris className={lebar} />
                      <Skeleton className="h-4.5 w-24 rounded-full" />
                    </div>
                    <div className="mt-0.5 text-xs">
                      <SkeletonBaris className="w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="size-4 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Satu kolom saringan (<Pilihan>): kotak 44px berisi teks dan panah. */
function SkeletonPilihan({ className }: { className?: string }) {
  return (
    <div className={`flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3.5 ${className ?? ''}`}>
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="size-4" />
    </div>
  )
}

/**
 * /admin/laporan selama data dimuat, dalam satu kartu seperti <AntreanLaporan>: bilah cari + 3 saringan →
 * 6 tab status bergaris bawah → baris ringkasan → tabel 6 kolom dengan foto kecil (md ke atas) atau daftar (ponsel).
 */
export function SkeletonAntreanLaporan() {
  return (
    <div role="status">
      <span className="sr-only">Memuat daftar laporan…</span>
      <div aria-hidden className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-wrap gap-2 p-3">
          <div className="flex min-h-11 flex-1 basis-60 items-center gap-3 rounded-md border border-border bg-surface pl-3.5">
            <Skeleton className="size-5 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-3/5" />
          </div>
          {/* Ponsel: satu ikon pembuka lembar saringan. */}
          <div data-tombol-saringan="" className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface sm:hidden">
            <Skeleton className="size-5" />
          </div>
          <div className="hidden gap-2 sm:flex">
            <SkeletonPilihan className="w-48" />
            <SkeletonPilihan className="w-40" />
            <SkeletonPilihan className="w-60" />
          </div>
        </div>

        <div className="flex overflow-hidden border-y border-border px-1 sm:flex-wrap">
          {['w-12', 'w-16', 'w-20', 'w-28', 'w-12', 'w-14'].map((lebar, i) => (
            <div key={i} data-tab="" className="inline-flex min-h-11 items-center gap-1.5 px-3">
              <Skeleton className={`h-3.5 ${lebar}`} />
              <Skeleton className="h-4.5 w-5" />
            </div>
          ))}
        </div>

        <div className="flex min-h-10 items-center bg-canvas-soft px-4 py-2 text-xs">
          <SkeletonBaris className="w-28" />
        </div>

        <div className="hidden border-t border-border md:block">
          <div className="grid grid-cols-[minmax(0,1fr)_28%_9rem_8rem_5rem_2.5rem] items-center border-b border-border text-[11px]">
            {['w-16', 'w-12', 'w-12', 'w-12', 'w-16'].map((lebar, i) => (
              <span key={i} className={`py-2 ${i === 0 ? 'px-4' : 'px-3'} ${i === 4 ? 'flex justify-end' : ''}`}>
                <SkeletonBaris className={lebar} />
              </span>
            ))}
            <span />
          </div>
          <div className="divide-y divide-border-soft">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,1fr)_28%_9rem_8rem_5rem_2.5rem] items-center text-sm">
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <Skeleton className="size-10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <SkeletonBaris className={['w-24', 'w-32', 'w-28'][i % 3]} />
                    <div className="text-xs">
                      <SkeletonBaris className={['w-4/5', 'w-3/5', 'w-11/12'][i % 3]} />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <SkeletonBaris className={['w-4/5', 'w-full', 'w-3/5'][i % 3]} />
                  <div className="text-xs">
                    <SkeletonBaris className="w-20" />
                  </div>
                </div>
                <div className="px-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="px-3 text-xs">
                  <SkeletonBaris className="w-16" />
                </div>
                <div className="flex justify-end px-3">
                  <SkeletonBaris className="w-8" />
                </div>
                <div className="px-2">
                  <Skeleton className="size-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border-soft border-t border-border md:hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex gap-3 px-3.5 py-3">
              <Skeleton className="size-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <SkeletonBaris className="w-24" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="mt-0.5 text-sm">
                  <SkeletonBaris className="w-4/5" />
                </div>
                <div className="mt-0.5 text-xs">
                  <SkeletonBaris className="w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Isi <main> panel admin untuk path tertentu: kepala + kerangka datanya. */
export function SkeletonIsiAdmin({ pathname }: { pathname: string }) {
  const laporan = pathname.startsWith('/admin/laporan')
  return (
    <div className={laporan ? 'space-y-4' : 'space-y-5'}>
      <SkeletonKepalaAdmin lebarJudul={laporan ? 'w-44' : 'w-36'} />
      {laporan ? <SkeletonAntreanLaporan /> : <SkeletonDasborAdmin />}
    </div>
  )
}

/** Sidebar admin desktop (w-64): logo + tombol ciut → label "Panel admin" → 2 menu → kotak akun + tombol Keluar. */
function SkeletonSidebar() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border pr-2 pl-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-full" />
          <SkeletonBaris className="w-28" />
        </div>
        <Skeleton className="size-10 rounded-lg" />
      </div>
      <div className="px-5 pt-5 text-[11px]">
        <SkeletonBaris className="w-20" />
      </div>
      <div className="space-y-1 px-3 pt-2">
        {['w-20', 'w-28'].map((lebar, i) => (
          <div key={lebar} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 ${i === 0 ? 'bg-brand-soft' : ''}`}>
            <Skeleton className="size-5 shrink-0" />
            <div className="text-sm">
              <SkeletonBaris className={lebar} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-3 border-t border-border p-4">
        <div className="flex min-h-10 items-center gap-3 px-3">
          <Skeleton className="size-5 shrink-0" />
          <div className="text-sm">
            <SkeletonBaris className="w-36" />
          </div>
        </div>
        <div className="rounded-lg bg-canvas-soft p-3">
          <div className="text-sm">
            <SkeletonBaris className="w-4/5" />
          </div>
          <Skeleton className="mt-1 h-4.5 w-20 rounded-full" />
          <Skeleton className="mt-3 h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Seluruh panel admin selama status masuk diperiksa: sidebar (desktop) atau bilah atas dengan tombol menu (ponsel),
 * lalu isi halaman yang dituju.
 */
export function SkeletonPanelAdmin({ pathname }: { pathname: string }) {
  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <div aria-hidden className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="sticky top-0 h-dvh">
          <SkeletonSidebar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Ponsel & tablet: header 64px seperti situs publik (logo + label Admin, avatar, menu). */}
        <div aria-hidden className="flex h-16 items-center gap-2 border-b border-border bg-surface px-4 sm:px-6 lg:hidden">
          <Skeleton className="size-7 shrink-0 rounded-full" />
          <div className="text-lg">
            <SkeletonBaris className="w-32" />
          </div>
          <Skeleton className="h-4.5 w-12 rounded-full" />
          <div className="ml-auto flex items-center gap-1">
            <div className="grid size-11 place-items-center">
              <Skeleton className="size-9 rounded-full" />
            </div>
            <div className="-mr-2.5 grid size-11 place-items-center">
              <Skeleton className="size-6" />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-7">
          <SkeletonIsiAdmin pathname={pathname} />
        </div>
      </div>

      {/* Ponsel & tablet: bottom navigation 4 item. */}
      <div aria-hidden data-nav-bawah="" className="fixed inset-x-0 bottom-0 h-16 border-t border-border bg-surface lg:hidden">
        <div className="mx-auto grid h-full max-w-xl grid-cols-4">
          {['w-16', 'w-12', 'w-16', 'w-10'].map((lebar, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1">
              <Skeleton className="size-5" />
              <div className="text-xs">
                <SkeletonBaris className={lebar} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
