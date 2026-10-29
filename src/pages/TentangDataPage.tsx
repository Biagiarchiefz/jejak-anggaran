import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { BadgeRedFlag } from '../components/common/BadgeRedFlag'
import { SumberData } from '../components/common/SumberData'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { KepalaHalaman } from '../components/common/KepalaHalaman'
import { Skeleton } from '../components/common/Skeleton'
import { useBagianAktif } from '../hooks/useBagianAktif'
import { useSumberData } from '../hooks/useSumberData'
import { LABEL_KATEGORI, LABEL_STATUS_LAPORAN, LABEL_STATUS_PROYEK } from '../utils/label'
import { RED_FLAG } from '../utils/redFlag'
import { ALUR_STATUS } from '../utils/statusLaporan'

const BAGIAN = [
  { id: 'sumber', judul: 'Sumber data' },
  { id: 'kurasi', judul: 'Cara kurasi' },
  { id: 'red-flag', judul: 'Aturan “perlu perhatian”' },
  { id: 'status-laporan', judul: 'Alur status laporan' },
  { id: 'data-demo', judul: 'Data demo' },
  { id: 'keterbatasan', judul: 'Keterbatasan data' },
  { id: 'privasi', judul: 'Privasi' },
] as const

type IdBagian = (typeof BAGIAN)[number]['id']

function Bagian({ id, children }: { id: IdBagian; children: ReactNode }) {
  const judul = BAGIAN.find((b) => b.id === id)!.judul
  return (
    <section data-muncul="" id={id} aria-labelledby={`judul-${id}`} className="scroll-mt-24 space-y-4">
      <h2 id={`judul-${id}`} className="text-2xl leading-[1.25] font-semibold tracking-[-0.005em]">
        {judul}
      </h2>
      <div className="space-y-4 leading-[1.55] text-ink-muted">{children}</div>
    </section>
  )
}

const DATASET = [
  {
    nama: 'APBD Kota Bandung',
    asal: 'DJPK Kementerian Keuangan dan Open Data Kota Bandung',
    isi: 'Total anggaran, pembagian per urusan, dan realisasi per tahun.',
  },
  {
    nama: 'Paket proyek',
    asal: 'SiRUP LKPP (Rencana Umum Pengadaan)',
    isi: 'Nama paket, satuan kerja, pagu, dan tahun anggaran.',
  },
  {
    nama: 'Nilai kontrak dan pelaksana',
    asal: 'LPSE Kota Bandung / Opentender',
    isi: 'Pemenang tender dan nilai kontrak.',
  },
  {
    nama: 'Lokasi dan foto awal',
    asal: 'Dikumpulkan tim (Google Maps dan kunjungan lapangan)',
    isi: 'Koordinat proyek di peta dan foto kondisi saat dikunjungi.',
  },
]

/** Tabel sumber (DESIGN.md §7.9); di ponsel berubah menjadi daftar kartu, bukan scroll horizontal. */
function TabelDataset() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas-soft text-xs tracking-[0.04em] text-ink-muted uppercase">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Asal</th>
              <th className="px-4 py-3">Isi</th>
            </tr>
          </thead>
          <tbody>
            {DATASET.map((d) => (
              <tr key={d.nama} className="border-b border-border-soft align-top last:border-0 hover:bg-brand-soft/60">
                <td className="px-4 py-3 font-medium text-ink-strong">{d.nama}</td>
                <td className="px-4 py-3 text-ink">{d.asal}</td>
                <td className="px-4 py-3 text-ink-muted">{d.isi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 sm:hidden">
        {DATASET.map((d) => (
          <li key={d.nama} className="rounded-lg border border-border bg-surface p-4 text-sm">
            <p className="font-medium text-ink-strong">{d.nama}</p>
            <p className="mt-1 text-ink">{d.asal}</p>
            <p className="mt-1 text-ink-muted">{d.isi}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function DaftarSumberTercatat() {
  const { data, error, memuat, muatUlang } = useSumberData()
  if (memuat && !data) {
    return (
      <div role="status" className="space-y-2">
        <span className="sr-only">Memuat daftar sumber…</span>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    )
  }
  if (error) return <ErrorState halaman pesan={error.pesan} onCobaLagi={muatUlang} />
  if (!data || data.length === 0) {
    return <EmptyState judul="Belum ada sumber tercatat" pesan="Sumber akan muncul setelah data resmi dimasukkan." />
  }
  return (
    <ul className="space-y-1.5">
      {data.map((s) => (
        <li key={s.id}>
          <SumberData nama={s.nama} url={s.url} diaksesPada={s.diakses_pada} />
        </li>
      ))}
    </ul>
  )
}

const ID_BAGIAN = BAGIAN.map((b) => b.id)

/**
 * Daftar isi yang menempel di kiri (desktop) dengan scroll-spy: bagian yang sedang dibaca ditebalkan dan
 * garis penanda biru di sisi kiri bergeser halus ke item tersebut.
 */
function DaftarIsi() {
  const aktif = useBagianAktif(ID_BAGIAN)
  const refPenanda = useRef<HTMLSpanElement>(null)
  const refTautan = useRef(new Map<string, HTMLAnchorElement>())

  // Geser garis penanda ke tautan aktif (langsung lewat DOM: tidak perlu render ulang).
  useLayoutEffect(() => {
    const penanda = refPenanda.current
    const tautan = aktif ? refTautan.current.get(aktif) : undefined
    if (!penanda || !tautan) return
    penanda.style.transform = `translateY(${tautan.offsetTop}px)`
    penanda.style.height = `${tautan.offsetHeight}px`
    penanda.style.opacity = '1'
  }, [aktif])

  return (
    <nav aria-label="Daftar isi" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="text-xs font-semibold tracking-[0.06em] text-ink-subtle uppercase">Di halaman ini</p>
        <div className="relative mt-3">
          <span
            ref={refPenanda}
            className="absolute top-0 -left-px w-0.5 rounded-full bg-brand opacity-0 transition-[transform,height] duration-300 ease-(--ease-standard) motion-reduce:transition-none"
            aria-hidden
          />
          <ul className="space-y-1 border-l border-border">
            {BAGIAN.map((b) => (
              <li key={b.id}>
                <a
                  ref={(el) => {
                    if (el) refTautan.current.set(b.id, el)
                    else refTautan.current.delete(b.id)
                  }}
                  href={`#${b.id}`}
                  aria-current={aktif === b.id ? 'location' : undefined}
                  className={`block py-1.5 pl-4 text-sm transition-colors duration-150 ${
                    aktif === b.id ? 'font-medium text-ink-strong' : 'text-ink-muted hover:text-ink-strong'
                  }`}
                >
                  {b.judul}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default function TentangDataPage() {
  const { hash } = useLocation()

  // Router tidak menggulir ke #anchor secara otomatis.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])

  return (
    <div className="space-y-12">
      <title>Tentang Data — Jejak Anggaran</title>
      <KepalaHalaman
        eyebrow="Dokumentasi"
        judul="Tentang data"
        deskripsi="Dari mana angka-angka di Jejak Anggaran berasal, bagaimana kami mengolahnya, dan apa saja keterbatasannya."
      />

      <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,720px)] lg:gap-16">
        <DaftarIsi />

        <article className="min-w-0 space-y-12">
          <Bagian id="sumber">
            <TabelDataset />
            <h3 className="pt-2 text-base font-semibold">Sumber yang tercatat beserta tanggal aksesnya</h3>
            <DaftarSumberTercatat />
          </Bagian>

          <Bagian id="kurasi">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Tim menyalin data dari situs resmi secara manual, tanpa scraping otomatis.</li>
              <li>Setiap baris dicatat bersama tautan sumber dan tanggal aksesnya.</li>
              <li>
                Data diperiksa otomatis sebelum masuk database: tipe angka, koordinat harus berada di dalam Kota Bandung, dan data
                nyata wajib punya tautan sumber.
              </li>
              <li>
                Data tidak diperbarui secara langsung (real-time). Perubahan di situs sumber baru terlihat setelah kurasi ulang.
              </li>
            </ol>
          </Bagian>

          <Bagian id="red-flag">
            <div className="flex flex-wrap items-center gap-2">
              <BadgeRedFlag />
              <span className="text-sm">muncul di peta dan halaman detail proyek.</span>
            </div>
            {/* Kotak aturan dengan border kiri 4px brand. */}
            <div className="rounded-r-lg border-l-4 border-brand bg-canvas-soft p-5">
              <p className="text-ink">Sebuah proyek diberi tanda ini jika semua syarat berikut terpenuhi:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  Status proyek tercatat{' '}
                  <strong className="text-ink">{LABEL_STATUS_PROYEK[RED_FLAG.statusProyek].toLowerCase()}</strong>.
                </li>
                <li>
                  Ada minimal <strong className="text-ink">{RED_FLAG.ambangLaporan} laporan</strong> kategori “
                  {LABEL_KATEGORI[RED_FLAG.kategoriLaporan]}”.
                </li>
                <li>
                  Laporan tersebut berstatus{' '}
                  {RED_FLAG.statusLaporanTerhitung.map((s) => LABEL_STATUS_LAPORAN[s].toLowerCase()).join(', ')} (sudah diperiksa
                  admin, bukan sekadar masuk).
                </li>
                <li>
                  Laporan dibuat dalam <strong className="text-ink">{RED_FLAG.jendelaHari} hari terakhir</strong>.
                </li>
              </ul>
            </div>
            <p className="rounded-lg border border-warning/20 bg-warning-soft p-4 text-sm text-ink">
              Tanda ini hanya berarti <strong>perlu perhatian</strong>. Ini bukan tuduhan korupsi atau penyimpangan, dan bukan
              hasil audit resmi.
            </p>
          </Bagian>

          <Bagian id="status-laporan">
            <p>
              Setiap laporan berjalan melalui:{' '}
              <strong className="text-ink">{ALUR_STATUS.map((s) => LABEL_STATUS_LAPORAN[s]).join(' → ')}</strong>, atau{' '}
              <strong className="text-ink">{LABEL_STATUS_LAPORAN.ditolak}</strong> jika tidak sesuai. Setiap perubahan dicatat
              (kapan, oleh siapa, dan catatannya) dan bisa dilihat publik di halaman proyek.
            </p>
            <p>
              Peran admin di Jejak Anggaran adalah <strong className="text-ink">simulasi instansi</strong>. Untuk tindak lanjut
              resmi, gunakan tombol “Teruskan ke LAPOR!” pada setiap laporan.
            </p>
          </Bagian>

          <Bagian id="data-demo">
            <p>
              Sebagian angka anggaran, proyek, dan laporan dibuat khusus untuk demonstrasi alur aplikasi. Data tersebut fiktif,
              bukan data resmi atau laporan warga sungguhan. Selama data demo tampil, catatan di bagian bawah footer memberi
              tahu hal ini. Proyek demo juga ditandai “Proyek Demo” dan “(fiktif)” pada namanya.
            </p>
            <p>
              Laporan negatif simulasi <strong className="text-ink">hanya</strong> ditempelkan pada proyek fiktif yang juga
              berstatus demo. Kami tidak pernah membuat laporan palsu pada proyek nyata.
            </p>
          </Bagian>

          <Bagian id="keterbatasan">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Hanya mencakup Kota Bandung dan sebagian kecil paket proyek yang sudah dikurasi.</li>
              <li>Angka bisa berbeda dengan versi terbaru di situs sumber. Selalu cek tanggal akses pada setiap angka.</li>
              <li>Koordinat proyek adalah perkiraan tim berdasarkan nama lokasi paket.</li>
              <li>
                Laporan warga belum tentu akurat sebelum diverifikasi. Status laporan menunjukkan sejauh mana sudah diperiksa.
              </li>
            </ul>
          </Bagian>

          <Bagian id="privasi">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Nama dan email pelapor tidak pernah ditampilkan di halaman publik.</li>
              <li>Foto dikompres di perangkat Anda sebelum dikirim, dan data lokasi GPS di dalam foto dihapus.</li>
              <li>Kami tidak menampilkan NIK atau data penerima bantuan sosial.</li>
            </ul>
          </Bagian>
        </article>
      </div>
    </div>
  )
}
