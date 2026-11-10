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
    <div className={`rounded-xl border border-border bg-surface p-3.5 ${className ?? ''}`}>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonKartuAngka key={i} />
          ))}
          <SkeletonKartuAngka className="col-span-2 sm:col-span-2 lg:col-span-1" />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className={`${KARTU} p-4`}>
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

          <div className={`${KARTU} flex flex-col p-4`}>
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

/**
 * /admin/laporan selama data dimuat: chip saringan status (dengan angka) → tabel 6 kolom (md ke atas)
 * atau daftar kartu (ponsel).
 */
export function SkeletonAntreanLaporan() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Memuat daftar laporan…</span>
      <div aria-hidden className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {['w-14', 'w-16', 'w-20', 'w-28', 'w-14', 'w-14'].map((lebar, i) => (
            <div key={i} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5">
              <Skeleton className={`h-3.5 ${lebar}`} />
              <Skeleton className="h-4.5 w-5" />
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
          <div className="grid grid-cols-[1fr_1.6fr_7rem_6rem_5rem_2.5rem] items-center gap-4 border-b border-border bg-canvas-soft px-4 py-2.5 text-[11px]">
            {['w-14', 'w-12', 'w-12', 'w-14', 'w-16'].map((lebar, i) => (
              <span key={i} className={i === 4 ? 'flex justify-end' : undefined}>
                <SkeletonBaris className={lebar} />
              </span>
            ))}
            <span />
          </div>
          <div className="divide-y divide-border-soft">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid grid-cols-[1fr_1.6fr_7rem_6rem_5rem_2.5rem] items-center gap-4 px-4 py-3 text-sm">
                <SkeletonBaris className={['w-28', 'w-32', 'w-24'][i % 3]} />
                <SkeletonBaris className={['w-4/5', 'w-full', 'w-3/5'][i % 3]} />
                <Skeleton className="h-5 w-20 rounded-full" />
                <SkeletonBaris className="w-20" />
                <span className="flex justify-end">
                  <SkeletonBaris className="w-5" />
                </span>
                <Skeleton className="size-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface px-3.5 py-3">
              <div className="flex items-center gap-1.5">
                <span className="mr-1">
                  <SkeletonBaris className="w-28" />
                </span>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="mt-1 text-sm">
                <SkeletonBaris className="w-4/5" />
              </div>
              <div className="mt-1 text-xs">
                <SkeletonBaris className="w-40" />
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
        <div aria-hidden className="flex h-14 items-center gap-2 border-b border-border bg-surface px-2 sm:px-4 lg:hidden">
          <div className="grid size-11 place-items-center">
            <Skeleton className="size-5" />
          </div>
          <SkeletonBaris className="w-24" />
        </div>
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <SkeletonIsiAdmin pathname={pathname} />
        </div>
      </div>
    </div>
  )
}
