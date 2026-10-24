import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { BadgeDemo } from '../components/BadgeDemo'
import { BadgeRedFlag } from '../components/BadgeRedFlag'
import { SumberData } from '../components/SumberData'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { useSumberData } from '../hooks/useSumberData'
import { LABEL_KATEGORI, LABEL_STATUS_LAPORAN, LABEL_STATUS_PROYEK } from '../lib/label'
import { RED_FLAG } from '../lib/redFlag'
import { ALUR_STATUS } from '../lib/statusLaporan'

function Bagian({ id, judul, children }: { id: string; judul: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`judul-${id}`} className="scroll-mt-6 space-y-3">
      <h2 id={`judul-${id}`} className="text-xl font-medium">
        {judul}
      </h2>
      <div className="space-y-3 text-slate-600">{children}</div>
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
  if (error) return <ErrorState pesan={error.pesan} onCobaLagi={muatUlang} />
  if (!data || data.length === 0) {
    return <EmptyState judul="Belum ada sumber tercatat" pesan="Sumber akan muncul setelah data resmi dimasukkan." />
  }
  return (
    <ul className="space-y-1">
      {data.map((s) => (
        <li key={s.id}>
          <SumberData nama={s.nama} url={s.url} diaksesPada={s.diakses_pada} className="text-sm" />
        </li>
      ))}
    </ul>
  )
}

export default function TentangDataPage() {
  const { hash } = useLocation()

  // Router tidak menggulir ke #anchor secara otomatis.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <title>Tentang Data — Jejak Anggaran</title>
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">Tentang data</h1>
        <p className="text-slate-600">
          Dari mana angka-angka di Jejak Anggaran berasal, bagaimana kami mengolahnya, dan apa saja keterbatasannya.
        </p>
      </header>

      <Bagian id="sumber" judul="Sumber data">
        <ul className="grid gap-3 sm:grid-cols-2">
          {DATASET.map((d) => (
            <li key={d.nama}>
              <Card className="h-full">
                <p className="font-medium">{d.nama}</p>
                <p className="text-sm text-slate-600">{d.asal}</p>
                <p className="mt-1 text-sm">{d.isi}</p>
              </Card>
            </li>
          ))}
        </ul>
        <h3 className="pt-2 font-medium">Sumber yang tercatat beserta tanggal aksesnya</h3>
        <DaftarSumberTercatat />
      </Bagian>

      <Bagian id="kurasi" judul="Cara kurasi">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Tim menyalin data dari situs resmi secara manual, tanpa scraping otomatis.</li>
          <li>Setiap baris dicatat bersama tautan sumber dan tanggal aksesnya.</li>
          <li>
            Data diperiksa otomatis sebelum masuk database: tipe angka, koordinat harus berada di dalam Kota Bandung, dan data
            nyata wajib punya tautan sumber.
          </li>
          <li>Data tidak diperbarui secara langsung (real-time). Perubahan di situs sumber baru terlihat setelah kurasi ulang.</li>
        </ol>
      </Bagian>

      <Bagian id="red-flag" judul="Aturan tanda “perlu perhatian”">
        <div className="flex items-center gap-2">
          <BadgeRedFlag />
          <span className="text-sm text-slate-600">muncul di peta dan halaman detail proyek.</span>
        </div>
        <p>Sebuah proyek diberi tanda ini jika semua syarat berikut terpenuhi:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Status proyek tercatat <strong>{LABEL_STATUS_PROYEK[RED_FLAG.statusProyek].toLowerCase()}</strong>.
          </li>
          <li>
            Ada minimal <strong>{RED_FLAG.ambangLaporan} laporan</strong> kategori “{LABEL_KATEGORI[RED_FLAG.kategoriLaporan]}”.
          </li>
          <li>
            Laporan tersebut berstatus{' '}
            {RED_FLAG.statusLaporanTerhitung.map((s) => LABEL_STATUS_LAPORAN[s].toLowerCase()).join(', ')} (sudah diperiksa
            admin, bukan sekadar masuk).
          </li>
          <li>
            Laporan dibuat dalam <strong>{RED_FLAG.jendelaHari} hari terakhir</strong>.
          </li>
        </ul>
        <p className="rounded-ui bg-amber-50 p-3 text-sm text-amber-950">
          Tanda ini hanya berarti <strong>perlu perhatian</strong>. Ini bukan tuduhan korupsi atau penyimpangan, dan bukan hasil
          audit resmi.
        </p>
      </Bagian>

      <Bagian id="status-laporan" judul="Alur status laporan">
        <p>
          Setiap laporan berjalan melalui:{' '}
          <strong>{ALUR_STATUS.map((s) => LABEL_STATUS_LAPORAN[s]).join(' → ')}</strong>, atau{' '}
          <strong>{LABEL_STATUS_LAPORAN.ditolak}</strong> jika tidak sesuai. Setiap perubahan dicatat (kapan, oleh siapa, dan
          catatannya) dan bisa dilihat publik di halaman proyek.
        </p>
        <p>
          Peran admin di Jejak Anggaran adalah <strong>simulasi instansi</strong>. Untuk tindak lanjut resmi, gunakan tombol
          “Teruskan ke LAPOR!” pada setiap laporan.
        </p>
      </Bagian>

      <Bagian id="data-demo" judul="Label “Data demo”">
        <div>
          <BadgeDemo />
        </div>
        <p>
          Sebagian proyek dan laporan dibuat khusus untuk demonstrasi alur aplikasi. Semuanya diberi label “Data demo” dan
          bukan data resmi atau laporan warga sungguhan.
        </p>
        <p>
          Laporan negatif simulasi <strong>hanya</strong> ditempelkan pada proyek fiktif yang juga berlabel demo. Kami tidak
          pernah membuat laporan palsu pada proyek nyata.
        </p>
      </Bagian>

      <Bagian id="keterbatasan" judul="Keterbatasan data">
        <ul className="list-disc space-y-1 pl-5">
          <li>Hanya mencakup Kota Bandung dan sebagian kecil paket proyek yang sudah dikurasi.</li>
          <li>Angka bisa berbeda dengan versi terbaru di situs sumber. Selalu cek tanggal akses pada setiap angka.</li>
          <li>Koordinat proyek adalah perkiraan tim berdasarkan nama lokasi paket.</li>
          <li>Laporan warga belum tentu akurat sebelum diverifikasi. Status laporan menunjukkan sejauh mana sudah diperiksa.</li>
        </ul>
      </Bagian>

      <Bagian id="privasi" judul="Privasi">
        <ul className="list-disc space-y-1 pl-5">
          <li>Nama dan email pelapor tidak pernah ditampilkan di halaman publik.</li>
          <li>Foto dikompres di perangkat Anda sebelum dikirim, dan data lokasi GPS di dalam foto dihapus.</li>
          <li>Kami tidak menampilkan NIK atau data penerima bantuan sosial.</li>
        </ul>
      </Bagian>
    </article>
  )
}
