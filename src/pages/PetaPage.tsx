import { useState } from 'react'
import { Link } from 'react-router'
import { BadgeDemo } from '../components/BadgeDemo'
import { BadgeRedFlag } from '../components/BadgeRedFlag'
import { BadgeStatusProyek } from '../components/BadgeStatus'
import { PetaProyek } from '../components/PetaProyek'
import { SumberData } from '../components/SumberData'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { useProyekList } from '../hooks/useProyekList'
import { daftarKecamatan, FILTER_AWAL, saringProyek, type FilterProyek } from '../lib/filterProyek'
import { formatRupiahRingkas } from '../lib/format'
import { LABEL_STATUS_PROYEK } from '../lib/label'
import { Constants } from '../types/database'
import type { ProyekDenganRedFlag } from '../services/proyekService'

function DaftarProyek({ proyek }: { proyek: ProyekDenganRedFlag[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {proyek.map((p) => (
        <li key={p.id} className="rounded-ui border border-slate-200 bg-white p-4">
          <Link to={`/proyek/${p.id}`} className="font-medium leading-snug text-slate-900 underline-offset-2 hover:underline">
            {p.nama_paket}
          </Link>
          <div className="mt-2 flex flex-wrap gap-1">
            <BadgeStatusProyek status={p.status_proyek} />
            {p.redFlag && <BadgeRedFlag alasan={p.redFlag.alasan} />}
            {p.is_demo && <BadgeDemo />}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Kec. {p.kecamatan} · Pagu <strong>{formatRupiahRingkas(p.pagu)}</strong>
          </p>
          <SumberData nama="SiRUP LKPP" url={p.sumber_rup_url} diaksesPada={p.diakses_pada} demo={p.is_demo} />
        </li>
      ))}
    </ul>
  )
}

export default function PetaPage() {
  const { data, error, memuat, muatUlang } = useProyekList()
  const [filter, setFilter] = useState<FilterProyek>(FILTER_AWAL)

  const semua = data ?? []
  const tersaring = saringProyek(semua, filter)
  const kecamatan = daftarKecamatan(semua)
  const jumlahRedFlag = tersaring.filter((p) => p.redFlag).length

  return (
    <div className="space-y-5">
      <title>Peta Proyek — Jejak Anggaran</title>
      <header>
        <h1 className="text-2xl font-medium sm:text-3xl">Peta proyek Kota Bandung</h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Pilih titik di peta untuk melihat pagu, status, dan laporan warga. Daftar lengkap tersedia di bawah peta.
        </p>
      </header>

      <form className="flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()} aria-label="Saring proyek">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium text-slate-700">Status</span>
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as FilterProyek['status'] }))}
            className="min-h-11 rounded-ui border border-slate-200 bg-white shadow-sm px-4"
          >
            <option value="semua">Semua status</option>
            {Constants.public.Enums.status_proyek.map((s) => (
              <option key={s} value={s}>
                {LABEL_STATUS_PROYEK[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium text-slate-700">Kecamatan</span>
          <select
            value={filter.kecamatan}
            onChange={(e) => setFilter((f) => ({ ...f, kecamatan: e.target.value }))}
            className="min-h-11 rounded-ui border border-slate-200 bg-white shadow-sm px-4"
          >
            <option value="semua">Semua kecamatan</option>
            {kecamatan.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        {(filter.status !== 'semua' || filter.kecamatan !== 'semua') && (
          <Button varian="tipis" className="self-end" onClick={() => setFilter(FILTER_AWAL)}>
            Hapus saringan
          </Button>
        )}
      </form>

      {memuat && !data ? (
        <div role="status">
          <span className="sr-only">Memuat peta proyek…</span>
          <Skeleton className="h-[55vh] min-h-80 w-full rounded-ui" />
        </div>
      ) : error ? (
        <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
      ) : semua.length === 0 ? (
        <EmptyState judul="Belum ada data proyek" pesan="Data proyek sedang dikurasi dari SiRUP dan LPSE Kota Bandung." />
      ) : (
        <>
          <p className="text-sm text-slate-600" role="status">
            Menampilkan <strong>{tersaring.length}</strong> dari {semua.length} proyek
            {jumlahRedFlag > 0 && <>, {jumlahRedFlag} perlu perhatian</>}.
          </p>
          <PetaProyek proyek={tersaring} />
          <section aria-labelledby="judul-daftar">
            <h2 id="judul-daftar" className="mb-3 text-lg font-medium">
              Daftar proyek
            </h2>
            {tersaring.length === 0 ? (
              <EmptyState
                judul="Tidak ada proyek yang cocok"
                pesan="Coba ubah atau hapus saringan status dan kecamatan."
                aksi={
                  <Button varian="kedua" onClick={() => setFilter(FILTER_AWAL)}>
                    Hapus saringan
                  </Button>
                }
              />
            ) : (
              <DaftarProyek proyek={tersaring} />
            )}
          </section>
        </>
      )}
    </div>
  )
}
