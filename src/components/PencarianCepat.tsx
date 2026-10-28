import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { BadgeStatusProyek } from './BadgeStatus'
import { Button } from './ui/Button'
import { ErrorState } from './ui/ErrorState'
import { KolomCari } from './ui/KolomCari'
import { Skeleton } from './ui/Skeleton'
import { useProyekList } from '../hooks/useProyekList'
import { cariProyek, urlPeta } from '../lib/filterProyek'

const JUMLAH_HASIL = 8

const PINTASAN = [
  { ke: '/anggaran', label: 'Anggaran Kota Bandung' },
  { ke: '/peta', label: 'Peta proyek' },
  { ke: '/tentang-data', label: 'Tentang data' },
]

/** Isi panel pencarian di header: cari proyek berdasarkan nama, wilayah, satker, atau pelaksana. */
export function PencarianCepat({ onTutup }: { onTutup: () => void }) {
  const [kata, setKata] = useState('')
  const { data, error, memuat, muatUlang } = useProyekList()
  const semuaHasil = cariProyek(data ?? [], kata)
  const hasil = semuaHasil.slice(0, JUMLAH_HASIL)
  const navigate = useNavigate()

  /** Tekan "Cari" atau Enter: buka Peta proyek dengan kata kunci ini, jadi semua hasil (bukan hanya 8) tampil di peta. */
  function cari(e: FormEvent) {
    e.preventDefault()
    const q = kata.trim()
    if (!q) return
    navigate(urlPeta({ cari: q }))
    onTutup()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      {/* Input lebih dulu di DOM agar <dialog> langsung memfokuskannya saat dibuka.
          Panel ditutup dengan Esc atau klik di luar panel; tombol di samping input menjalankan pencarian. */}
      <form role="search" onSubmit={cari} className="flex items-center gap-2">
        <KolomCari
          id="cari-proyek"
          label="Cari proyek"
          nilai={kata}
          onUbah={setKata}
          placeholder="Cari proyek, kecamatan, atau pelaksana…"
          className="min-h-12 flex-1"
        />
        <Button type="submit" ukuran="sm" disabled={kata.trim() === ''} className="min-h-12 shrink-0 px-5">
          Cari
        </Button>
      </form>

      <div className="mt-6" aria-live="polite">
        {kata.trim() === '' ? (
          <div>
            <p className="text-sm text-ink-muted">Atau langsung buka:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {PINTASAN.map((p) => (
                <li key={p.ke}>
                  <Link
                    to={p.ke}
                    onClick={onTutup}
                    className="inline-flex min-h-9 items-center rounded-full border border-border bg-surface px-3.5 text-sm font-medium text-ink efek-tekan hover:border-border-strong hover:bg-canvas-soft"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : memuat && !data ? (
          <div role="status" className="space-y-2">
            <span className="sr-only">Memuat daftar proyek…</span>
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : error ? (
          <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
        ) : hasil.length === 0 ? (
          <p className="text-ink-muted">
            Tidak ada proyek yang cocok dengan “{kata.trim()}”. Coba nama jalan, kecamatan, atau jenis pekerjaan.
          </p>
        ) : (
          <>
            <p className="text-sm text-ink-muted">
              {semuaHasil.length} proyek ditemukan{semuaHasil.length > JUMLAH_HASIL && `, menampilkan ${JUMLAH_HASIL} teratas`}
            </p>
            <ul className="mt-2 divide-y divide-border-soft">
              {hasil.map((p) => (
                <li key={p.id}>
                  <Link to={`/proyek/${p.id}`} onClick={onTutup} className="-mx-3 block rounded-md px-3 py-3 hover:bg-brand-soft/60">
                    <span className="block font-medium text-ink-strong">{p.nama_paket}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                      Kec. {p.kecamatan} · {p.tahun_anggaran}
                      <BadgeStatusProyek status={p.status_proyek} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
