import { describe, expect, it } from 'vitest'
import { AppError, dariErrorSupabase, pesanError } from './errors'

describe('dariErrorSupabase', () => {
  it.each([
    [{ code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }, 'TIDAK_DITEMUKAN'],
    [{ code: '42501', message: 'new row violates row-level security policy' }, 'TIDAK_BERWENANG'],
    [{ code: '23505', message: 'duplicate key value violates unique constraint' }, 'VALIDASI'],
    [{ message: 'TypeError: Failed to fetch' }, 'JARINGAN'],
    [{ status: 401, message: 'Invalid JWT' }, 'TIDAK_BERWENANG'],
    [{ statusCode: '404', message: 'Object not found' }, 'TIDAK_DITEMUKAN'],
    [{ code: 'XX000', message: 'internal error' }, 'TIDAK_DIKETAHUI'],
  ])('memetakan %o ke %s', (error, kode) => {
    expect(dariErrorSupabase(error, 'uji').code).toBe(kode)
  })

  it('tidak pernah meneruskan pesan teknis ke pengguna', () => {
    const e = dariErrorSupabase({ code: '23505', message: 'duplicate key value violates unique constraint "x"' }, 'uji')
    expect(e.pesan).not.toMatch(/duplicate|constraint/)
  })

  it('memakai pesan khusus bila diberikan', () => {
    const e = dariErrorSupabase({ code: '23505' }, 'uji', { VALIDASI: 'Anda sudah mengonfirmasi laporan ini.' })
    expect(e.pesan).toBe('Anda sudah mengonfirmasi laporan ini.')
  })

  it('meneruskan AppError apa adanya', () => {
    const asli = new AppError('UPLOAD_GAGAL')
    expect(dariErrorSupabase(asli, 'uji')).toBe(asli)
  })
})

describe('pesanError', () => {
  it('memberi pesan umum untuk error yang tidak dikenal', () => {
    expect(pesanError(new Error('stack trace teknis'))).toBe('Terjadi kesalahan. Silakan coba lagi beberapa saat lagi.')
  })
})
