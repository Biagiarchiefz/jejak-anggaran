// Validasi data/raw/*.csv lalu tulis supabase/seed.sql.
// Jalankan: npm run data:seed
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SeedError, bangunSql, validasiData, type FileCsv } from './seedLib.ts'

const AKAR = join(import.meta.dirname, '..')

function baca(relatif: string): FileCsv {
  try {
    return { nama: relatif, isi: readFileSync(join(AKAR, relatif), 'utf8') }
  } catch {
    console.error(`✗ File ${relatif} tidak ditemukan.`)
    process.exit(1)
  }
}

try {
  const data = validasiData({
    anggaran: baca('data/raw/anggaran_daerah.csv'),
    proyek: baca('data/raw/proyek.csv'),
    laporanDemo: baca('data/raw/laporan_demo.csv'),
  })
  // foto_path menunjuk berkas di public/; pastikan berkasnya benar-benar ada.
  const fotoHilang = data.proyek.filter((p) => p.foto_path && !existsSync(join(AKAR, 'public', p.foto_path)))
  if (fotoHilang.length > 0) {
    throw new SeedError(fotoHilang.map((p) => `data/raw/proyek.csv: foto "${p.foto_path}" untuk proyek "${p.id}" tidak ada di public/`))
  }
  writeFileSync(join(AKAR, 'supabase/seed.sql'), bangunSql(data))

  const nyata = data.proyek.filter((p) => !p.is_demo).length
  console.log('✓ Data valid. supabase/seed.sql diperbarui.')
  console.log(`  anggaran_daerah : ${data.anggaran.length} baris`)
  console.log(`  proyek          : ${data.proyek.length} (${nyata} nyata, ${data.proyek.length - nyata} demo)`)
  console.log(`  laporan demo    : ${data.laporanDemo.length}`)
  if (data.anggaran.length === 0) console.warn('  ! anggaran_daerah.csv masih kosong: dashboard anggaran akan tampil kosong.')
  if (nyata === 0) console.warn('  ! Belum ada proyek nyata. PRD menargetkan 10–20 proyek nyata.')
} catch (e) {
  if (e instanceof SeedError) {
    console.error(`✗ ${e.message}. seed.sql TIDAK diperbarui.\n`)
    for (const k of e.kesalahan) console.error(`  - ${k}`)
    process.exit(1)
  }
  throw e
}
