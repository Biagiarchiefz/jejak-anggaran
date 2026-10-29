// Menjaga agar aturan di TypeScript dan SQL tidak menyimpang.
// Membaca definisi TERAKHIR di folder migrasi (migrasi lama tidak pernah diedit).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RED_FLAG } from '../src/utils/redFlag.ts'
import { statusBerikutnya } from '../src/utils/statusLaporan.ts'
import { Constants } from '../src/types/database.ts'
import { ALASAN_TOLAK_MIN, CATATAN_MAKS, DESKRIPSI_MAKS, DESKRIPSI_MIN } from '../src/utils/batasLaporan.ts'

const FOLDER = join(import.meta.dirname, '..', 'supabase', 'migrations')

function definisiTerakhir(pola: RegExp): string {
  const files = readdirSync(FOLDER).filter((f) => f.endsWith('.sql')).sort()
  let hasil: string | null = null
  for (const f of files) {
    const cocok = readFileSync(join(FOLDER, f), 'utf8').match(pola)
    if (cocok) hasil = cocok[0]
  }
  if (!hasil) throw new Error(`Definisi ${pola} tidak ditemukan di migrasi`)
  return hasil
}

describe('red flag: src/utils/redFlag.ts ↔ v_red_flag_proyek', () => {
  const sql = definisiTerakhir(/create (or replace )?view public\.v_red_flag_proyek[\s\S]*?;/)

  it('ambang dan jendela waktu sama', () => {
    expect(sql).toContain(`interval '${RED_FLAG.jendelaHari} days'`)
    expect(sql).toMatch(new RegExp(`having count\\(l\\.id\\) >= ${RED_FLAG.ambangLaporan}`))
  })

  it('status proyek, kategori, dan status laporan sama', () => {
    expect(sql).toContain(`p.status_proyek = '${RED_FLAG.statusProyek}'`)
    expect(sql).toContain(`l.kategori = '${RED_FLAG.kategoriLaporan}'`)
    const daftar = RED_FLAG.statusLaporanTerhitung.map((s) => `'${s}'`).join(', ')
    expect(sql).toContain(`l.status in (${daftar})`)
  })
})

describe('transisi status: src/utils/statusLaporan.ts ↔ transisi_status_valid', () => {
  const sql = definisiTerakhir(/create (or replace )?function public\.transisi_status_valid[\s\S]*?\$\$;/)

  it.each(Constants.public.Enums.status_laporan)('transisi dari %s sama', (status) => {
    const baris = sql.match(new RegExp(`when '${status}' then baru (?:in \\(([^)]*)\\)|= '([^']*)')`))
    const diSql = baris ? (baris[1] ?? `'${baris[2]}'`).split(',').map((s) => s.trim().replaceAll("'", '')) : []
    expect([...diSql].sort()).toEqual([...statusBerikutnya(status)].sort())
  })
})

describe('batas isian: src/utils/batasLaporan.ts ↔ constraint tabel laporan', () => {
  it('panjang deskripsi sama', () => {
    const sql = definisiTerakhir(/deskripsi text not null check \(char_length\(deskripsi\) between \d+ and \d+\)/)
    expect(sql).toContain(`between ${DESKRIPSI_MIN} and ${DESKRIPSI_MAKS}`)
  })

  it('panjang catatan status sama', () => {
    const sql = definisiTerakhir(/catatan_status text check \(char_length\(catatan_status\) <= \d+\)/)
    expect(sql).toContain(`<= ${CATATAN_MAKS}`)
  })

  it('panjang minimal alasan penolakan sama', () => {
    const sql = definisiTerakhir(/constraint laporan_alasan_tolak_wajib[\s\S]*?>= \d+\)/)
    expect(sql).toContain(`>= ${ALASAN_TOLAK_MIN})`)
  })
})
