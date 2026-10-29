import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DasborAdmin } from './DasborAdmin'
import type { DataAdmin, LaporanAdmin } from '../../../services/adminService'

const PROYEK: NonNullable<LaporanAdmin['proyek']> = {
  id: 'jalan',
  nama_paket: 'Rehabilitasi Jalan Lingkungan',
  kecamatan: 'Coblong',
  status_proyek: 'selesai',
  is_demo: true,
}

function laporan(id: string, sebagian: Partial<LaporanAdmin> = {}): LaporanAdmin {
  return {
    id,
    proyek_id: PROYEK.id,
    kategori: 'kerusakan',
    deskripsi: 'Aspal mengelupas di depan sekolah dasar.',
    foto_path: null,
    fotoUrl: null,
    status: 'diterima',
    catatan_status: null,
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jumlah_konfirmasi: 0,
    proyek: PROYEK,
    riwayat: [],
    ...sebagian,
  }
}

/** Angka besar di kartu statistik yang berlabel `label`. */
function angkaKartu(label: string) {
  return screen.getByText(label).closest('div.rounded-xl')?.querySelector('p.text-2xl')?.textContent
}

describe('<DasborAdmin>', () => {
  it('menampilkan ringkasan dan membuka laporan prioritas', () => {
    const data: DataAdmin = {
      laporan: [laporan('baru'), laporan('v1', { status: 'diverifikasi' }), laporan('v2', { status: 'diverifikasi' })],
      proyekRedFlag: [],
    }
    const onBuka = vi.fn()
    render(<DasborAdmin data={data} onBuka={onBuka} />)

    expect(angkaKartu('Menunggu verifikasi')).toBe('1')
    expect(angkaKartu('Sedang diproses')).toBe('2')
    expect(screen.getByText('Belum ada laporan yang ditanggapi.')).toBeInTheDocument()

    const daftar = screen.getByRole('heading', { name: 'Prioritas verifikasi' }).closest('div.flex-col') as HTMLElement
    expect(within(daftar).getByText('Bisa memicu red flag')).toBeInTheDocument()
    expect(within(daftar).getByText('1 menunggu')).toBeInTheDocument()
    fireEvent.click(within(daftar).getByRole('button'))
    expect(onBuka).toHaveBeenCalledWith('baru')
  })

  it('pesan kosong jika tidak ada yang menunggu verifikasi', () => {
    render(<DasborAdmin data={{ laporan: [laporan('s', { status: 'selesai' })], proyekRedFlag: ['jalan'] }} onBuka={vi.fn()} />)
    expect(screen.getByText('Tidak ada laporan yang menunggu verifikasi.')).toBeInTheDocument()
    expect(angkaKartu('Proyek red flag')).toBe('1')
  })
})
