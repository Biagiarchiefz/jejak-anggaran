import { ArrowRight } from 'lucide-react'
import { CtaPenutup } from '../features/beranda/components/CtaPenutup'
import { FlatProjectMap } from '../features/beranda/components/FlatProjectMap'
import { PitaStatistik } from '../features/beranda/components/PitaStatistik'
import { SeksiAnggaran } from '../features/beranda/components/SeksiAnggaran'
import { SeksiCaraKerja } from '../features/beranda/components/SeksiCaraKerja'
import { SeksiProyek } from '../features/beranda/components/SeksiProyek'
import { TautanTombol } from '../components/common/Button'
import { useAnggaran } from '../features/anggaran/hooks/useAnggaran'
import { useProyekList } from '../features/proyek/hooks/useProyekList'

/** Urutan: hero peta Bandung → pita statistik → anggaran → proyek perlu perhatian → cara kerja → CTA penutup. */
export default function BerandaPage() {
  // Diambil sekali di sini lalu dibagikan ke beberapa section.
  const anggaran = useAnggaran()
  const proyek = useProyekList()

  return (
    <>
      <title>Jejak Anggaran — Kota Bandung</title>
      <FlatProjectMap
        judul="Ikuti uang publik Kota Bandung, dari anggaran sampai ke lapangan"
        deskripsi="Temukan proyek beranggaran di sekitar Anda, lihat pagunya, lalu periksa kondisi nyatanya lewat laporan warga. Setiap angka disertai sumber resminya."
        aksi={
          <TautanTombol to="/peta">
            Jelajahi peta proyek
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
          </TautanTombol>
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
