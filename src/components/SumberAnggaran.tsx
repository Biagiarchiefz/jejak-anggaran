import { SumberData } from './SumberData'
import { unikBerdasarkanId } from '../lib/anggaran'
import type { AnggaranDaerah } from '../services/anggaranService'

type SumberAnggaranProps = {
  baris: AnggaranDaerah[]
  variant?: 'light' | 'dark'
  dalamKartu?: boolean
  className?: string
}

/** Sumber untuk sekumpulan baris anggaran: label demo jika ada baris demo, selain itu daftar sumber unik. */
export function SumberAnggaran({ baris, variant, dalamKartu, className }: SumberAnggaranProps) {
  if (baris.some((b) => b.is_demo)) {
    return <SumberData nama="" demo variant={variant} dalamKartu={dalamKartu} className={className ?? 'mt-2'} />
  }
  return (
    <div className={`space-y-0.5 ${className ?? 'mt-2'}`}>
      {unikBerdasarkanId(baris.map((b) => b.sumber)).map((s, i) => (
        <SumberData
          key={s.id}
          nama={s.nama}
          url={s.url}
          diaksesPada={s.diakses_pada}
          variant={variant}
          dalamKartu={dalamKartu && i === 0}
        />
      ))}
    </div>
  )
}
