import { SumberData } from './SumberData'
import { unikBerdasarkanId } from '../lib/anggaran'
import type { AnggaranDaerah } from '../services/anggaranService'

/** Sumber untuk sekumpulan baris anggaran: label demo jika ada baris demo, selain itu daftar sumber unik. */
export function SumberAnggaran({ baris, className }: { baris: AnggaranDaerah[]; className?: string }) {
  if (baris.some((b) => b.is_demo)) return <SumberData nama="" demo className={className ?? 'mt-2'} />
  return (
    <div className={`space-y-0.5 ${className ?? 'mt-2'}`}>
      {unikBerdasarkanId(baris.map((b) => b.sumber)).map((s) => (
        <SumberData key={s.id} nama={s.nama} url={s.url} diaksesPada={s.diakses_pada} />
      ))}
    </div>
  )
}
