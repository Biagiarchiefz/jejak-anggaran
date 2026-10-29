import { useState } from 'react'
import { ChevronRight, CircleCheck, CircleX, Flag, Inbox, LoaderCircle, Timer, type LucideIcon } from 'lucide-react'
import { Badge } from '../../../components/common/Badge'
import type { DataAdmin } from '../../../services/adminService'
import { formatDurasiJam, formatPersen } from '../../../utils/format'
import { LABEL_KATEGORI } from '../../../utils/label'
import { antreanPrioritas, hitungRingkasanAdmin } from '../../../utils/ringkasanAdmin'

const PRIORITAS_MAKS = 5

// Kartu dasbor: border tipis + sudut xl, tanpa bayangan berat (padat ala dashboard data).
const KARTU = 'rounded-xl border border-border bg-surface'

type KartuAngkaProps = { ikon: LucideIcon; label: string; nilai: number; sorot?: boolean; className?: string }

function KartuAngka({ ikon: Ikon, label, nilai, sorot, className }: KartuAngkaProps) {
  return (
    <div className={`rounded-xl border p-3.5 ${sorot ? 'border-danger/30 bg-danger-soft' : 'border-border bg-surface'} ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-xs leading-tight font-medium ${sorot ? 'text-danger' : 'text-ink-muted'}`}>{label}</p>
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-lg ${sorot ? 'bg-danger/10 text-danger' : 'bg-brand-soft text-action'}`}
          aria-hidden
        >
          <Ikon className="size-4" strokeWidth={1.5} />
        </span>
      </div>
      <p className={`mt-1 text-2xl leading-none font-semibold tracking-[-0.02em] tabular-nums ${sorot ? 'text-danger' : 'text-ink-strong'}`}>
        {nilai}
      </p>
    </div>
  )
}

type Segmen = { label: string; nilai: number; warna: string }

/** Batang bertumpuk sebaran status + legenda. */
function SebaranStatus({ segmen }: { segmen: Segmen[] }) {
  const total = segmen.reduce((a, s) => a + s.nilai, 0)
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-recessed" role="img" aria-label={segmen.map((s) => `${s.label} ${s.nilai}`).join(', ')}>
        {total > 0 && segmen.map((s) => s.nilai > 0 && <span key={s.label} className={s.warna} style={{ width: `${(s.nilai / total) * 100}%` }} />)}
      </div>
      <ul className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-ink-muted">
        {segmen.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${s.warna}`} aria-hidden />
            {s.label}
            <span className="ml-auto font-medium text-ink-strong tabular-nums">{s.nilai}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Ringkasan kinerja tindak lanjut + antrean prioritas verifikasi. */
export function DasborAdmin({ data, onBuka }: { data: DataAdmin; onBuka: (id: string) => void }) {
  // Dibekukan sekali per kunjungan agar "menunggu N hari" tidak berubah di tengah render.
  const [sekarang] = useState(() => new Date())
  const r = hitungRingkasanAdmin(data.laporan, data.proyekRedFlag)
  const semuaPrioritas = antreanPrioritas(data.laporan, data.proyekRedFlag, sekarang)
  const prioritas = semuaPrioritas.slice(0, PRIORITAS_MAKS)
  const total = data.laporan.length

  return (
    <section aria-labelledby="judul-ringkasan" className="space-y-3">
      <h2 id="judul-ringkasan" className="sr-only">
        Ringkasan tindak lanjut laporan
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KartuAngka ikon={Inbox} label="Menunggu verifikasi" nilai={r.menungguVerifikasi} />
        <KartuAngka ikon={LoaderCircle} label="Sedang diproses" nilai={r.sedangDiproses} />
        <KartuAngka ikon={CircleCheck} label="Selesai" nilai={r.selesai} />
        <KartuAngka ikon={CircleX} label="Ditolak" nilai={r.ditolak} />
        <KartuAngka
          ikon={Flag}
          label="Proyek red flag"
          nilai={r.redFlagAktif}
          sorot={r.redFlagAktif > 0}
          className="col-span-2 sm:col-span-2 lg:col-span-1"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Kiri: kinerja respons. */}
        <div className={`${KARTU} p-4`}>
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Timer className="size-4 shrink-0 text-action" strokeWidth={1.5} aria-hidden />
            Rata-rata waktu respons
          </div>
          <p className="mt-1.5 text-2xl leading-none font-semibold tracking-[-0.02em] text-ink-strong tabular-nums">
            {r.rataRataResponJam === null ? '—' : formatDurasiJam(r.rataRataResponJam)}
          </p>
          <p className="mt-1.5 text-xs text-ink-muted">
            {r.jumlahDitanggapi === 0
              ? 'Belum ada laporan yang ditanggapi.'
              : `Dari laporan masuk sampai pertama kali ditanggapi, dihitung dari ${r.jumlahDitanggapi} laporan.`}
          </p>

          <dl className="mt-4 grid grid-cols-3 divide-x divide-border-soft rounded-lg bg-canvas-soft py-2.5 text-center">
            <div>
              <dt className="text-[11px] text-ink-subtle">Total laporan</dt>
              <dd className="mt-0.5 text-base font-semibold text-ink-strong tabular-nums">{total}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-subtle">Sudah ditanggapi</dt>
              <dd className="mt-0.5 text-base font-semibold text-ink-strong tabular-nums">{r.jumlahDitanggapi}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-subtle">Tuntas</dt>
              <dd className="mt-0.5 text-base font-semibold text-ink-strong tabular-nums">{total ? formatPersen(r.selesai / total) : '—'}</dd>
            </div>
          </dl>

          <div className="mt-4">
            <SebaranStatus
              segmen={[
                { label: 'Menunggu', nilai: r.menungguVerifikasi, warna: 'bg-action' },
                { label: 'Diproses', nilai: r.sedangDiproses, warna: 'bg-brand-light' },
                { label: 'Selesai', nilai: r.selesai, warna: 'bg-success' },
                { label: 'Ditolak', nilai: r.ditolak, warna: 'bg-border-strong' },
              ]}
            />
          </div>
        </div>

        {/* Kanan: prioritas verifikasi. */}
        <div className={`${KARTU} flex flex-col p-4`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink-strong">Prioritas verifikasi</h3>
              <p className="mt-0.5 text-xs text-ink-muted">Berpotensi red flag didahulukan, lalu yang paling lama menunggu.</p>
            </div>
            {semuaPrioritas.length > 0 && (
              <Badge nada="info" ringkas>
                {semuaPrioritas.length} menunggu
              </Badge>
            )}
          </div>
          {prioritas.length === 0 ? (
            <p className="mt-3 rounded-lg bg-canvas-soft px-3 py-6 text-center text-sm text-ink-muted">Tidak ada laporan yang menunggu verifikasi.</p>
          ) : (
            <ul className="-mx-1.5 mt-2 space-y-0.5">
              {prioritas.map(({ laporan: l, alasan }) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => onBuka(l.id)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left efek-tekan hover:bg-canvas-soft"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium text-ink-strong">{LABEL_KATEGORI[l.kategori]}</span>
                        {alasan.potensiRedFlag && (
                          <Badge nada="bahaya" ringkas>
                            Bisa memicu red flag
                          </Badge>
                        )}
                        <Badge nada={alasan.menungguHari >= 7 ? 'peringatan' : 'netral'} ringkas>
                          {alasan.menungguHari === 0 ? 'Masuk hari ini' : `Menunggu ${alasan.menungguHari} hari`}
                        </Badge>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-muted">{l.proyek?.nama_paket ?? '—'}</span>
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-action motion-reduce:transition-none"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
