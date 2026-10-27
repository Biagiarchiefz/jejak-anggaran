import { ArrowRight } from 'lucide-react'
import { CtaPenutup } from '../components/CtaPenutup'
import { FlatProjectMap } from '../components/FlatProjectMap'
import { PitaStatistik } from '../components/PitaStatistik'
import { SeksiAnggaran } from '../components/SeksiAnggaran'
import { SeksiCaraKerja } from '../components/SeksiCaraKerja'
import { SeksiProyek } from '../components/SeksiProyek'
import { TautanTombol } from '../components/ui/Button'
import { useAnggaran } from '../hooks/useAnggaran'
import { useProyekList } from '../hooks/useProyekList'

/** Urutan: hero peta titik → pita statistik → anggaran → proyek perlu perhatian → cara kerja → CTA penutup. */
export default function BerandaPage() {
  // Diambil sekali di sini lalu dibagikan ke beberapa section.
  const anggaran = useAnggaran()
  const proyek = useProyekList()

  return (
    <>
      <title>Jejak Anggaran — Kota Bandung</title>
      <FlatProjectMap
        judul="Ikuti uang publik Kota Bandung, dari anggaran sampai ke lapangan"
        deskripsi="Lihat APBD dan proyek beranggaran di peta, lalu periksa kondisi nyatanya lewat laporan warga. Setiap angka disertai sumber resminya."
        aksi={
          <>
            <TautanTombol to="/peta">
              Jelajahi peta proyek
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
            </TautanTombol>
            <TautanTombol to="/anggaran" varian="kedua">
              Lihat anggaran kota
            </TautanTombol>
          </>
        }
        proyek={proyek}
      />
      <PitaStatistik anggaran={anggaran} proyek={proyek} />
      <SeksiAnggaran anggaran={anggaran} />
      <SeksiProyek proyek={proyek} />
      <SeksiCaraKerja />
      <CtaPenutup />
    </>
  )
}
