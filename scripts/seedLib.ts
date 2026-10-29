// Logika murni pipeline data: validasi CSV kurasi manual → SQL seed.
// Dipakai oleh scripts/build-seed.ts dan diuji di seedLib.test.ts.
import Papa from 'papaparse'
import { z } from 'zod'
import { Constants } from '../src/types/database.ts'
import { jalurStatus } from '../src/utils/statusLaporan.ts'
import { BATAS_KOTA_BANDUNG, KECAMATAN_KOTA_BANDUNG, dalamKotaBandung } from '../src/utils/wilayah.ts'

const { kategori_laporan, status_laporan, status_proyek } = Constants.public.Enums

// ---------- Skema baris CSV ----------

const kosongJadiNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v)

const teks = z.string().trim().min(1, 'wajib diisi')
const teksOpsional = z.preprocess(kosongJadiNull, z.string().trim().nullable())
const bilanganBulat = z
  .string()
  .trim()
  .regex(/^\d+$/, 'harus angka bulat tanpa titik, koma, atau "Rp"')
  .transform(Number)
const bilanganBulatOpsional = z.preprocess(kosongJadiNull, bilanganBulat.nullable())
const tahun = bilanganBulat.pipe(z.number().min(2000, 'tahun tidak masuk akal').max(2100, 'tahun tidak masuk akal'))
const tanggal = z.iso.date({ error: 'format tanggal harus YYYY-MM-DD' })
const tanggalOpsional = z.preprocess(kosongJadiNull, tanggal.nullable())
const urlHttps = z.url({ protocol: /^https?$/, error: 'harus URL lengkap (https://...)' })
const urlOpsional = z.preprocess(kosongJadiNull, urlHttps.nullable())
const koordinat = z
  .string()
  .trim()
  .regex(/^-?\d+(\.\d+)?$/, 'harus angka desimal dengan titik, mis. -6.9147')
  .transform(Number)
const fotoProyek = z.preprocess(
  (v) => (v === undefined || kosongJadiNull(v) === null ? null : v),
  z
    .string()
    .trim()
    .startsWith('/foto-proyek/', 'harus berada di public/foto-proyek/ (mis. /foto-proyek/jalan-a.webp)')
    .regex(/\.(webp|jpe?g|png)$/i, 'harus berkas gambar .webp, .jpg, atau .png')
    .nullable(),
)
const boolean = z.enum(['true', 'false'], { error: 'isi true atau false' }).transform((v) => v === 'true')

export const skemaAnggaran = z.object({
  tahun,
  urusan: teks,
  anggaran: bilanganBulat,
  realisasi: bilanganBulatOpsional,
  sumber_nama: teks,
  sumber_url: urlHttps,
  diakses_pada: tanggal,
})

export const skemaProyek = z
  .object({
    id: teks.regex(/^[a-z0-9-]+$/, 'hanya huruf kecil, angka, dan tanda hubung'),
    kode_rup: teksOpsional,
    nama_paket: teks,
    satker: teks,
    kecamatan: z.enum(KECAMATAN_KOTA_BANDUNG, { error: 'bukan nama kecamatan di Kota Bandung (cek ejaan)' }),
    kelurahan: teksOpsional,
    pagu: bilanganBulat,
    nilai_kontrak: bilanganBulatOpsional,
    pelaksana: teksOpsional,
    tahun_anggaran: tahun,
    status_proyek: z.enum(status_proyek, { error: `isi salah satu: ${status_proyek.join(', ')}` }),
    lat: koordinat,
    lng: koordinat,
    sumber_rup_url: urlOpsional,
    sumber_lpse_url: urlOpsional,
    diakses_pada: tanggalOpsional,
    is_demo: boolean,
    foto_path: fotoProyek,
  })
  .superRefine((p, ctx) => {
    if (!dalamKotaBandung(p.lat, p.lng)) {
      const b = BATAS_KOTA_BANDUNG
      ctx.addIssue({
        code: 'custom',
        path: ['lat'],
        message: `koordinat (${p.lat}, ${p.lng}) di luar Kota Bandung (lat ${b.latMin}..${b.latMaks}, lng ${b.lngMin}..${b.lngMaks}). Lat/lng tertukar?`,
      })
    }
    if (!p.is_demo && !p.sumber_rup_url) {
      ctx.addIssue({ code: 'custom', path: ['sumber_rup_url'], message: 'wajib untuk data nyata (is_demo=false)' })
    }
    if (!p.is_demo && !p.diakses_pada) {
      ctx.addIssue({ code: 'custom', path: ['diakses_pada'], message: 'wajib untuk data nyata (is_demo=false)' })
    }
    if (p.nilai_kontrak !== null && !p.is_demo && !p.sumber_lpse_url) {
      ctx.addIssue({ code: 'custom', path: ['sumber_lpse_url'], message: 'wajib jika nilai_kontrak diisi' })
    }
  })

export const skemaLaporanDemo = z.object({
  proyek_id: teks,
  kategori: z.enum(kategori_laporan, { error: `isi salah satu: ${kategori_laporan.join(', ')}` }),
  deskripsi: z.string().trim().min(20, 'minimal 20 karakter').max(1000, 'maksimal 1000 karakter'),
  status: z.enum(status_laporan, { error: `isi salah satu: ${status_laporan.join(', ')}` }),
  hari_lalu: bilanganBulat.pipe(z.number().max(365, 'maksimal 365 hari')),
  foto_path: z.preprocess(
    kosongJadiNull,
    z.string().trim().startsWith('/foto-proyek/', 'harus berada di public/foto-proyek/').nullable(),
  ),
  catatan_status: z.preprocess(kosongJadiNull, z.string().trim().max(500, 'maksimal 500 karakter').nullable()),
})

export type BarisAnggaran = z.infer<typeof skemaAnggaran>
export type BarisProyek = z.infer<typeof skemaProyek>
export type BarisLaporanDemo = z.infer<typeof skemaLaporanDemo>

// ---------- Parsing + validasi ----------

export type FileCsv = { nama: string; isi: string }

function parseCsv<S extends z.ZodType>(file: FileCsv, skema: S, kesalahan: string[]): z.infer<S>[] {
  const hasil = Papa.parse<Record<string, string>>(file.isi.replace(/^\uFEFF/, '') /* buang BOM dari Excel */, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  })
  for (const e of hasil.errors) kesalahan.push(`${file.nama} baris ${(e.row ?? 0) + 2}: ${e.message}`)

  const baris: z.infer<S>[] = []
  hasil.data.forEach((mentah, i) => {
    const cek = skema.safeParse(mentah)
    if (cek.success) {
      baris.push(cek.data)
    } else {
      // +2: baris 1 adalah header, dan nomor baris dimulai dari 1.
      for (const issue of cek.error.issues) {
        kesalahan.push(`${file.nama} baris ${i + 2}, kolom ${issue.path.join('.') || '?'}: ${issue.message}`)
      }
    }
  })
  return baris
}

function cekDuplikat<T>(daftar: T[], kunci: (t: T) => string | null, label: string, nama: string, kesalahan: string[]) {
  const terlihat = new Set<string>()
  for (const item of daftar) {
    const k = kunci(item)
    if (k === null) continue
    if (terlihat.has(k)) kesalahan.push(`${nama}: ${label} duplikat "${k}"`)
    terlihat.add(k)
  }
}

export type DataSeed = {
  anggaran: BarisAnggaran[]
  proyek: BarisProyek[]
  laporanDemo: BarisLaporanDemo[]
}

export class SeedError extends Error {
  readonly kesalahan: string[]
  constructor(kesalahan: string[]) {
    super(`${kesalahan.length} kesalahan pada data CSV`)
    this.kesalahan = kesalahan
  }
}

export function validasiData(files: { anggaran: FileCsv; proyek: FileCsv; laporanDemo: FileCsv }): DataSeed {
  const kesalahan: string[] = []
  const anggaran = parseCsv(files.anggaran, skemaAnggaran, kesalahan)
  const proyek = parseCsv(files.proyek, skemaProyek, kesalahan)
  const laporanDemo = parseCsv(files.laporanDemo, skemaLaporanDemo, kesalahan)

  cekDuplikat(anggaran, (a) => `${a.tahun}/${a.urusan}`, 'tahun/urusan', files.anggaran.nama, kesalahan)
  cekDuplikat(proyek, (p) => p.id, 'id', files.proyek.nama, kesalahan)
  cekDuplikat(proyek, (p) => p.kode_rup, 'kode_rup', files.proyek.nama, kesalahan)

  // Aturan inti: laporan negatif simulasi hanya boleh menempel ke proyek demo.
  const proyekPerId = new Map(proyek.map((p) => [p.id, p]))
  laporanDemo.forEach((l, i) => {
    const p = proyekPerId.get(l.proyek_id)
    const lokasi = `${files.laporanDemo.nama} baris ${i + 2}`
    if (!p) kesalahan.push(`${lokasi}: proyek_id "${l.proyek_id}" tidak ada di ${files.proyek.nama}`)
    else if (!p.is_demo) {
      kesalahan.push(`${lokasi}: DITOLAK, laporan demo hanya boleh untuk proyek is_demo=true ("${l.proyek_id}" adalah proyek nyata)`)
    }
  })

  if (kesalahan.length > 0) throw new SeedError(kesalahan)
  return { anggaran, proyek, laporanDemo }
}

// ---------- Pembuatan SQL ----------

export function sqlTeks(nilai: string | null): string {
  return nilai === null ? 'null' : `'${nilai.replaceAll("'", "''")}'`
}

function sqlAngka(nilai: number | null): string {
  if (nilai === null) return 'null'
  if (!Number.isFinite(nilai)) throw new Error(`Angka tidak valid: ${nilai}`)
  return String(nilai)
}

const CATATAN_BAWAAN: Record<(typeof status_laporan)[number], string> = {
  diterima: 'Laporan diterima sistem',
  diverifikasi: 'Laporan diverifikasi admin (simulasi).',
  ditindaklanjuti: 'Ditindaklanjuti oleh admin (simulasi).',
  selesai: 'Tindak lanjut selesai (simulasi).',
  ditolak: 'Laporan ditolak admin (simulasi).',
}

function sqlSumber(anggaran: BarisAnggaran[]): string {
  const unik = new Map(anggaran.map((a) => [`${a.sumber_url}|${a.diakses_pada}`, a]))
  if (unik.size === 0) return '-- (belum ada sumber data anggaran)'
  const baris = [...unik.values()].map((a) => `  (${sqlTeks(a.sumber_nama)}, ${sqlTeks(a.sumber_url)}, ${sqlTeks(a.diakses_pada)})`)
  return [
    'insert into public.sumber_data (nama, url, diakses_pada) values',
    baris.join(',\n'),
    'on conflict (url, diakses_pada) do update set nama = excluded.nama;',
  ].join('\n')
}

function sqlAnggaran(anggaran: BarisAnggaran[]): string {
  if (anggaran.length === 0) return '-- (belum ada data anggaran_daerah)'
  const baris = anggaran.map(
    (a) =>
      `  (${sqlAngka(a.tahun)}::smallint, ${sqlTeks(a.urusan)}, ${sqlAngka(a.anggaran)}::bigint, ${sqlAngka(a.realisasi)}::bigint, ${sqlTeks(a.sumber_url)}, ${sqlTeks(a.diakses_pada)}::date)`,
  )
  return [
    'insert into public.anggaran_daerah (tahun, urusan, anggaran, realisasi, sumber_id)',
    'select v.tahun, v.urusan, v.anggaran, v.realisasi, s.id',
    'from (values',
    baris.join(',\n'),
    ') as v (tahun, urusan, anggaran, realisasi, url, diakses_pada)',
    'join public.sumber_data s on s.url = v.url and s.diakses_pada = v.diakses_pada',
    'on conflict (tahun, urusan) do update set',
    '  anggaran = excluded.anggaran, realisasi = excluded.realisasi, sumber_id = excluded.sumber_id;',
  ].join('\n')
}

const KOLOM_PROYEK = [
  'id',
  'kode_rup',
  'nama_paket',
  'satker',
  'kecamatan',
  'kelurahan',
  'pagu',
  'nilai_kontrak',
  'pelaksana',
  'tahun_anggaran',
  'status_proyek',
  'lat',
  'lng',
  'sumber_rup_url',
  'sumber_lpse_url',
  'diakses_pada',
  'is_demo',
  'foto_path',
] as const

function sqlProyek(proyek: BarisProyek[]): string {
  if (proyek.length === 0) return '-- (belum ada data proyek)'
  const baris = proyek.map((p) => {
    const nilai = [
      sqlTeks(p.id),
      sqlTeks(p.kode_rup),
      sqlTeks(p.nama_paket),
      sqlTeks(p.satker),
      sqlTeks(p.kecamatan),
      sqlTeks(p.kelurahan),
      sqlAngka(p.pagu),
      sqlAngka(p.nilai_kontrak),
      sqlTeks(p.pelaksana),
      sqlAngka(p.tahun_anggaran),
      sqlTeks(p.status_proyek),
      sqlAngka(p.lat),
      sqlAngka(p.lng),
      sqlTeks(p.sumber_rup_url),
      sqlTeks(p.sumber_lpse_url),
      p.diakses_pada === null ? 'null' : `${sqlTeks(p.diakses_pada)}::date`,
      String(p.is_demo),
      sqlTeks(p.foto_path),
    ]
    return `  (${nilai.join(', ')})`
  })
  const update = KOLOM_PROYEK.filter((k) => k !== 'id')
    .map((k) => `  ${k} = excluded.${k}`)
    .join(',\n')
  return [
    `insert into public.proyek (${KOLOM_PROYEK.join(', ')}) values`,
    baris.join(',\n'),
    'on conflict (id) do update set',
    `${update};`,
  ].join('\n')
}

function sqlLaporanDemo(l: BarisLaporanDemo): string {
  const jalur = jalurStatus(l.status)
  const riwayat = jalur.map((status, i) => {
    const lama = `${i === 0 ? 'null' : sqlTeks(jalur[i - 1])}::public.status_laporan`
    const terakhir = i === jalur.length - 1
    const catatan = terakhir && l.catatan_status ? l.catatan_status : CATATAN_BAWAAN[status]
    // Setiap langkah status berjarak sehari, tidak pernah melewati waktu sekarang.
    return `    (${lama}, ${sqlTeks(status)}::public.status_laporan, ${sqlTeks(catatan)}, interval '${i} days')`
  })
  return [
    'with baru as (',
    '  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)',
    `  values (${sqlTeks(l.proyek_id)}, ${sqlTeks(l.kategori)}, ${sqlTeks(l.deskripsi)}, ${sqlTeks(l.foto_path)}, ${sqlTeks(l.status)}, ${sqlTeks(l.catatan_status)}, true, now() - interval '${l.hari_lalu} days')`,
    '  returning id, created_at',
    ')',
    'insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)',
    'select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)',
    'from baru cross join (values',
    riwayat.join(',\n'),
    '  ) as r (status_lama, status_baru, catatan, jeda);',
  ].join('\n')
}

export function bangunSql(data: DataSeed): string {
  return [
    '-- HASIL GENERATE oleh `npm run data:seed` dari data/raw/*.csv. JANGAN DIEDIT MANUAL.',
    '-- Aman dijalankan berulang: data resmi di-upsert, hanya laporan demo (is_demo) yang dihapus lalu dibuat ulang.',
    '-- Laporan warga sungguhan tidak pernah disentuh.',
    '',
    'begin;',
    '',
    '-- sumber_data',
    sqlSumber(data.anggaran),
    '',
    '-- anggaran_daerah',
    sqlAnggaran(data.anggaran),
    '',
    '-- proyek',
    sqlProyek(data.proyek),
    '',
    '-- laporan demo (hanya pada proyek is_demo = true)',
    'delete from public.laporan where is_demo;',
    ...data.laporanDemo.map(sqlLaporanDemo),
    '',
    'commit;',
    '',
  ].join('\n')
}
