import { useNavigate } from 'react-router'
import { ErrorState } from '../components/common/ErrorState'
import { DasborAdmin } from '../features/admin/components/DasborAdmin'
import { KepalaAdmin } from '../features/admin/components/KepalaAdmin'
import { SkeletonDasborAdmin } from '../features/admin/components/SkeletonAdmin'
import { useDataAdmin } from '../features/admin/hooks/useDataAdmin'

export default function AdminDasborPage() {
  const { data, error, memuat, muatUlang } = useDataAdmin()
  const navigate = useNavigate()

  return (
    <div className="space-y-5">
      <title>Dashboard admin — Jejak Anggaran</title>
      <KepalaAdmin
        judul="Dashboard"
        deskripsi="Ringkasan tindak lanjut laporan warga. Admin di sini adalah simulasi instansi untuk demo, bukan akun resmi pemerintah."
      />
      {memuat && !data ? (
        <SkeletonDasborAdmin />
      ) : error ? (
        <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : (
        data && (
          <DasborAdmin
            data={data}
            onBuka={(id) => navigate(`/admin/laporan?buka=${encodeURIComponent(id)}`)}
            onLihatSemua={() => navigate('/admin/laporan')}
          />
        )
      )}
    </div>
  )
}
