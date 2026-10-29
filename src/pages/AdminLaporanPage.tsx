import { useSearchParams } from 'react-router'
import { ErrorState } from '../components/common/ErrorState'
import { SkeletonHalaman } from '../components/common/Skeleton'
import { AntreanLaporan } from '../features/admin/components/AntreanLaporan'
import { KepalaAdmin } from '../features/admin/components/KepalaAdmin'
import { useDataAdmin } from '../features/admin/hooks/useDataAdmin'

export default function AdminLaporanPage() {
  const { data, error, memuat, muatUlang } = useDataAdmin()
  const [params] = useSearchParams()

  return (
    <div className="space-y-4">
      <title>Laporan warga — Panel admin — Jejak Anggaran</title>
      <KepalaAdmin
        judul="Laporan warga"
        deskripsi="Verifikasi laporan dan perbarui status tindak lanjutnya. Setiap perubahan status dicatat dan tampil publik."
      />
      {memuat && !data ? (
        <SkeletonHalaman />
      ) : error ? (
        <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : (
        data && <AntreanLaporan laporan={data.laporan} onBerubah={muatUlang} idAwal={params.get('buka')} />
      )}
    </div>
  )
}
