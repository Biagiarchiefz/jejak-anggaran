import { TautanTombol } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

export default function TidakDitemukanPage() {
  return (
    <>
      <title>Halaman tidak ditemukan — Jejak Anggaran</title>
      <EmptyState
        judul="Halaman tidak ditemukan"
        pesan="Tautan yang Anda buka mungkin salah atau sudah tidak berlaku."
        aksi={<TautanTombol to="/">Kembali ke beranda</TautanTombol>}
      />
    </>
  )
}
