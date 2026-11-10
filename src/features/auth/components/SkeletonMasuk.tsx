import { Skeleton, SkeletonBaris } from '../../../components/common/Skeleton'
import { env } from '../../../config/env'

// Hanya bergantung pada primitif skeleton: dipakai juga sebagai fallback <Suspense> di LayoutPolos (bundle utama).

/** Satu field form masuk: label → kolom setinggi 44px dengan ikon kiri (dan tombol mata untuk kata sandi). */
function SkeletonField({ lebarLabel, denganMata }: { lebarLabel: string; denganMata?: boolean }) {
  return (
    <div>
      <div className="text-sm">
        <SkeletonBaris className={lebarLabel} />
      </div>
      <div className="mt-1.5 flex min-h-11 items-center gap-2.5 rounded-md border border-border bg-surface pr-4 pl-3.5">
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-3.5 w-36" />
        {denganMata && <Skeleton className="ml-auto size-4 shrink-0" />}
      </div>
    </div>
  )
}

/**
 * Isi kolom form selama status masuk diperiksa: judul + deskripsi → pengalih Masuk/Daftar →
 * email & kata sandi → tombol → (bila akun demo diatur) dua tombol akses juri.
 */
export function SkeletonFormMasuk() {
  const adaAkunDemo = !!(env.akunDemo.warga || env.akunDemo.admin)
  return (
    <div role="status">
      <span className="sr-only">Memeriksa status masuk…</span>
      <div aria-hidden>
        <div className="text-2xl leading-tight">
          <SkeletonBaris className="w-44" />
        </div>
        <div className="mt-1.5 text-sm leading-relaxed">
          <SkeletonBaris className="w-full" />
        </div>

        {/* Pengalih mode berbentuk segmen. */}
        <div className="mt-6 grid grid-cols-2 rounded-full bg-recessed p-1">
          <div className="flex min-h-9 items-center justify-center rounded-full bg-surface shadow-edge">
            <Skeleton className="h-3.5 w-12" />
          </div>
          <div className="flex min-h-9 items-center justify-center">
            <Skeleton className="h-3.5 w-12 opacity-60" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <SkeletonField lebarLabel="w-12" />
          <SkeletonField lebarLabel="w-20" denganMata />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {adaAkunDemo && (
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <Skeleton className="h-3 w-44" />
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Skeleton className="h-11 rounded-full" />
              <Skeleton className="h-11 rounded-full" />
            </div>
            <div className="mt-2 flex justify-center text-xs">
              <SkeletonBaris className="w-56" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Logo (ikon 28px + nama). */
function SkeletonLogo({ terang }: { terang?: boolean }) {
  return (
    <div className="flex min-h-11 items-center gap-2.5">
      <Skeleton terang={terang} className="size-7 rounded-full" />
      <div className="text-lg">
        <SkeletonBaris terang={terang} className="w-32" />
      </div>
    </div>
  )
}

/**
 * Seluruh /masuk selama kodenya diunduh: panel foto gelap di kiri (desktop) dengan logo + pesan,
 * kolom kanan berisi logo/tautan Beranda, foto ringkas (ponsel), form, dan tautan "jelajahi tanpa masuk".
 */
export function SkeletonMasuk() {
  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div aria-hidden className="relative hidden bg-band-deep lg:block">
        <div className="flex h-full flex-col justify-between p-10 xl:p-14">
          <SkeletonLogo terang />
          <div className="max-w-md">
            <div className="text-[28px] leading-[1.2]">
              <SkeletonBaris terang className="w-full" />
              <SkeletonBaris terang className="w-3/4" />
            </div>
            <div className="mt-3 text-sm leading-relaxed">
              <SkeletonBaris terang className="w-full" />
              <SkeletonBaris terang className="w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div aria-hidden className="flex items-center justify-between gap-3">
          <span className="lg:hidden">
            <SkeletonLogo />
          </span>
          <div className="ml-auto flex min-h-11 items-center gap-1.5 text-sm">
            <Skeleton className="size-4" />
            <SkeletonBaris className="w-16" />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          <div aria-hidden className="relative mb-8 flex h-36 items-end rounded-xl bg-band-deep p-4 lg:hidden">
            <div className="w-full text-sm leading-snug">
              <SkeletonBaris terang className="w-4/5" />
            </div>
          </div>
          <SkeletonFormMasuk />
          <div aria-hidden className="mt-8 flex justify-center text-sm">
            <SkeletonBaris className="w-64" />
          </div>
        </div>
      </div>
    </div>
  )
}
