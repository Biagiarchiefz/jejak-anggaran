// Menjaga agar aturan di TypeScript dan SQL tidak menyimpang.
// Membaca definisi TERAKHIR di folder migrasi (migrasi lama tidak pernah diedit).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RED_FLAG } from '../src/lib/redFlag.ts'
import { statusBerikutnya } from '../src/lib/statusLaporan.ts'
import { Constants } from '../src/types/database.ts'

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

describe('red flag: src/lib/redFlag.ts ↔ v_red_flag_proyek', () => {
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

describe('transisi status: src/lib/statusLaporan.ts ↔ transisi_status_valid', () => {
  const sql = definisiTerakhir(/create (or replace )?function public\.transisi_status_valid[\s\S]*?\$\$;/)

  it.each(Constants.public.Enums.status_laporan)('transisi dari %s sama', (status) => {
    const baris = sql.match(new RegExp(`when '${status}' then baru (?:in \\(([^)]*)\\)|= '([^']*)')`))
    const diSql = baris ? (baris[1] ?? `'${baris[2]}'`).split(',').map((s) => s.trim().replaceAll("'", '')) : []
    expect([...diSql].sort()).toEqual([...statusBerikutnya(status)].sort())
  })
})
