type SkeletonProps = {
  className?: string
  /** Untuk di atas pita gelap (`bg-band`). */
  terang?: boolean
}

/** Balok placeholder berdenyut. Denyut mati saat "kurangi gerak". */
export function Skeleton({ className, terang }: SkeletonProps) {
  // Sudut bawaan hanya bila pemanggil tidak menentukannya, agar `rounded-full` dsb. tidak bentrok dengan `rounded-md`.
  const sudut = className?.includes('rounded') ? '' : 'rounded-md'
  return (
    <div
      aria-hidden
      className={`${sudut} motion-safe:animate-pulse ${terang ? 'bg-white/15' : 'bg-recessed'} ${className ?? 'h-4 w-full'}`}
    />
  )
}

/**
 * Satu baris teks palsu yang tingginya persis satu `line-height` milik induknya (`1lh`), sehingga
 * blok skeleton setinggi teks aslinya dan tidak menggeser tata letak saat data datang.
 * Induk harus memakai ukuran huruf dan `leading` yang sama dengan teks aslinya.
 */
export function SkeletonBaris({ className, terang }: SkeletonProps) {
  return (
    <div aria-hidden className="flex h-[1lh] items-center">
      <Skeleton terang={terang} className={`h-[0.75em] ${className ?? 'w-full'}`} />
    </div>
  )
}

type SkeletonKepalaHalamanProps = {
  lebarJudul?: string
  /** Samakan dengan prop <KepalaHalaman>: tampilkan eyebrow / deskripsi atau tidak. */
  eyebrow?: boolean
  deskripsi?: boolean
}

/** Placeholder <KepalaHalaman>: eyebrow, H1, dan deskripsi (2 baris di layar lebar, 3 di ponsel). */
export function SkeletonKepalaHalaman({ lebarJudul = 'w-4/5 md:w-1/2', eyebrow = true, deskripsi = true }: SkeletonKepalaHalamanProps) {
  return (
    <div aria-hidden>
      {eyebrow && (
        <div className="mb-3 text-xs">
          <SkeletonBaris className="w-32" />
        </div>
      )}
      <div className="text-[32px] leading-[1.1] md:text-[48px]">
        <SkeletonBaris className={`max-w-full ${lebarJudul}`} />
      </div>
      {deskripsi && (
        <div className="mt-4 max-w-[720px] text-lg leading-[1.55]">
          <SkeletonBaris className="w-full" />
          <SkeletonBaris className="w-full sm:w-2/3" />
          <div className="sm:hidden">
            <SkeletonBaris className="w-1/2" />
          </div>
        </div>
      )}
    </div>
  )
}

/** Daftar <SumberData> (ikon dokumen kecil + satu baris teks). */
export function SkeletonDaftarSumber({ jumlah = 3 }: { jumlah?: number }) {
  return (
    <ul className="space-y-1.5" aria-hidden>
      {Array.from({ length: jumlah }, (_, i) => (
        <li key={i} className="flex items-center gap-1.5 text-xs">
          <Skeleton className="size-3 shrink-0 rounded-sm" />
          <SkeletonBaris className={['w-72', 'w-64', 'w-80'][i % 3] + ' max-w-full'} />
        </li>
      ))}
    </ul>
  )
}

/** Placeholder <EmptyState>: ikon 40px → judul → satu kalimat → tombol aksi, rata tengah dalam kartu. */
export function SkeletonEmptyState({ denganAksi = true }: { denganAksi?: boolean }) {
  return (
    <div aria-hidden className="flex flex-col items-center rounded-lg border border-border bg-surface px-4 py-10">
      <Skeleton className="size-10" />
      <div className="mt-3">
        <SkeletonBaris className="w-52" />
      </div>
      <div className="mt-1 flex w-full flex-col items-center text-sm">
        <SkeletonBaris className="w-96 max-w-full" />
      </div>
      {denganAksi && <Skeleton className="mt-5 h-12 w-48 rounded-full" />}
    </div>
  )
}

/** Placeholder satu blok halaman, dengan teks untuk pembaca layar. */
export function SkeletonHalaman({ baris = 4 }: { baris?: number }) {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Memuat data…</span>
      <Skeleton className="h-8 w-2/3" />
      {Array.from({ length: baris }, (_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  )
}
