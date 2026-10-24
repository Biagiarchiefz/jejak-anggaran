import { describe, expect, it } from 'vitest'
import { SeedError, bangunSql, sqlTeks, validasiData } from './seedLib.ts'

const HEADER_ANGGARAN = 'tahun,urusan,anggaran,realisasi,sumber_nama,sumber_url,diakses_pada'
const HEADER_PROYEK =
  'id,kode_rup,nama_paket,satker,kecamatan,kelurahan,pagu,nilai_kontrak,pelaksana,tahun_anggaran,status_proyek,lat,lng,sumber_rup_url,sumber_lpse_url,diakses_pada,is_demo,foto_path'
const HEADER_LAPORAN = 'proyek_id,kategori,deskripsi,status,hari_lalu,foto_path,catatan_status'

const PROYEK_NYATA =
  'jalan-nyata,123,Rehabilitasi Jalan,Dinas X,Coblong,Dago,1000000,900000,CV X,2025,selesai,-6.89,107.61,https://sirup.lkpp.go.id/a,https://lpse.bandung.go.id/b,2026-10-01,false,'
const PROYEK_DEMO = 'jalan-demo,,Proyek Demo,Satker Demo,Andir,,500000,,,2025,selesai,-6.91,107.58,,,,true,'

function files({ anggaran = [] as string[], proyek = [PROYEK_NYATA, PROYEK_DEMO], laporan = [] as string[] } = {}) {
  return {
    anggaran: { nama: 'anggaran_daerah.csv', isi: [HEADER_ANGGARAN, ...anggaran].join('\n') },
    proyek: { nama: 'proyek.csv', isi: [HEADER_PROYEK, ...proyek].join('\n') },
    laporanDemo: { nama: 'laporan_demo.csv', isi: [HEADER_LAPORAN, ...laporan].join('\n') },
  }
}

function kesalahan(fn: () => unknown): string[] {
  try {
    fn()
  } catch (e) {
    if (e instanceof SeedError) return e.kesalahan
    throw e
  }
  return []
}

describe('validasiData', () => {
  it('menerima data yang valid', () => {
    const data = validasiData(
      files({
        anggaran: ['2025,Pendidikan,1500000000,,DJPK Kemenkeu,https://djpk.kemenkeu.go.id/x,2026-10-01'],
        laporan: ['jalan-demo,kerusakan,"(Contoh demo) Jalan berlubang di banyak titik",diverifikasi,10,,'],
      }),
    )
    expect(data.proyek).toHaveLength(2)
    expect(data.anggaran[0]).toMatchObject({ tahun: 2025, anggaran: 1_500_000_000, realisasi: null })
    expect(data.laporanDemo[0].hari_lalu).toBe(10)
  })

  it('MENOLAK laporan demo pada proyek nyata', () => {
    const e = kesalahan(() =>
      validasiData(files({ laporan: ['jalan-nyata,kerusakan,"Jalan berlubang di banyak titik ya",diverifikasi,10,,'] })),
    )
    expect(e.join('\n')).toMatch(/DITOLAK.*proyek is_demo=true/)
  })

  it('menolak laporan demo untuk proyek yang tidak ada', () => {
    const e = kesalahan(() => validasiData(files({ laporan: ['tidak-ada,kerusakan,"Jalan berlubang di banyak titik ya",diterima,1,,'] })))
    expect(e.join('\n')).toMatch(/tidak ada di proyek\.csv/)
  })

  it('menolak koordinat di luar Kota Bandung', () => {
    const luar = PROYEK_NYATA.replace('-6.89,107.61', '-6.2,106.8')
    const e = kesalahan(() => validasiData(files({ proyek: [luar] })))
    expect(e.join('\n')).toMatch(/di luar Kota Bandung/)
  })

  it('mewajibkan URL sumber dan tanggal akses untuk proyek nyata', () => {
    const tanpaSumber = 'jalan-x,,Jalan X,Dinas X,Coblong,,1000,,,2025,selesai,-6.89,107.61,,,,false,'
    const e = kesalahan(() => validasiData(files({ proyek: [tanpaSumber] }))).join('\n')
    expect(e).toMatch(/sumber_rup_url: wajib untuk data nyata/)
    expect(e).toMatch(/diakses_pada: wajib untuk data nyata/)
  })

  it('menolak kecamatan yang salah eja dan angka berformat rupiah', () => {
    const salah = PROYEK_NYATA.replace('Coblong', 'Coblog').replace(',1000000,', ',Rp 1.000.000,')
    const e = kesalahan(() => validasiData(files({ proyek: [salah] }))).join('\n')
    expect(e).toMatch(/kolom kecamatan/)
    expect(e).toMatch(/kolom pagu: harus angka bulat/)
  })

  it('menolak id proyek duplikat', () => {
    const e = kesalahan(() => validasiData(files({ proyek: [PROYEK_NYATA, PROYEK_NYATA.replace(',123,', ',456,')] })))
    expect(e.join('\n')).toMatch(/id duplikat "jalan-nyata"/)
  })
})

describe('foto_path proyek', () => {
  it('menolak foto di luar public/foto-proyek/ atau bukan berkas gambar', () => {
    const luar = PROYEK_DEMO.replace(/,true,$/, ',true,/gambar/a.webp')
    const bukanGambar = PROYEK_NYATA.replace(/,false,$/, ',false,/foto-proyek/catatan.pdf')
    const e = kesalahan(() => validasiData(files({ proyek: [luar, bukanGambar] }))).join('\n')
    expect(e).toContain('foto_path: harus berada di public/foto-proyek/')
    expect(e).toMatch(/foto_path: harus berkas gambar/)
  })

  it('menerima foto yang valid dan memasukkannya ke SQL', () => {
    const berfoto = PROYEK_NYATA.replace(/,false,$/, ',false,/foto-proyek/jalan-nyata.webp')
    const data = validasiData(files({ proyek: [berfoto] }))
    expect(data.proyek[0].foto_path).toBe('/foto-proyek/jalan-nyata.webp')
    expect(bangunSql(data)).toContain("'/foto-proyek/jalan-nyata.webp'")
  })
})

describe('bangunSql', () => {
  it('meng-escape tanda kutip tunggal', () => {
    expect(sqlTeks("Jl. Pak'e")).toBe("'Jl. Pak''e'")
    expect(sqlTeks(null)).toBe('null')
  })

  it('hanya menghapus laporan demo, tidak pernah laporan warga', () => {
    const sql = bangunSql(validasiData(files()))
    expect(sql).toContain('delete from public.laporan where is_demo;')
    expect(sql).not.toMatch(/truncate/i)
    expect(sql.match(/delete from/g)).toHaveLength(1)
  })

  it('menyusun riwayat status lengkap untuk laporan demo', () => {
    const sql = bangunSql(
      validasiData(files({ laporan: ['jalan-demo,kerusakan,"(Contoh demo) Jalan berlubang di banyak titik",ditindaklanjuti,30,,'] })),
    )
    expect(sql).toContain("'diverifikasi'::public.status_laporan, 'ditindaklanjuti'::public.status_laporan")
    expect(sql).toContain("now() - interval '30 days'")
  })
})
