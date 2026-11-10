import type { ReactNode } from 'react'

type DeretKartuProyekProps = {
  children: ReactNode
  /** Atribut animasi muncul (`data-muncul-anak`) hanya untuk daftar asli, bukan skeleton. */
  animasi?: boolean
}

/**
 * Wadah daftar <KartuProyek> (dan skeletonnya, agar tata letak tidak bergeser saat data datang).
 * Ponsel: satu baris yang digeser ke samping dengan snap per kartu; kartu 82% lebar agar kartu berikutnya
 * mengintip sebagai petunjuk geser. Wadah ditarik ke tepi layar (-mx-4 + px-4) dan hanya wadah ini yang
 * bergulir, bukan halaman. Mulai `sm`: grid 2 kolom, `lg`: 3 kolom.
 */
export function DeretKartuProyek({ children, animasi }: DeretKartuProyekProps) {
  return (
    <ul
      data-muncul-anak={animasi ? '' : undefined}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3 lg:gap-5 [&::-webkit-scrollbar]:hidden [&>li]:w-[82%] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-auto"
    >
      {children}
    </ul>
  )
}
