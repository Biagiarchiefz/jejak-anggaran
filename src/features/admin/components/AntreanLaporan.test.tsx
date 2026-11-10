import { fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { AntreanLaporan } from './AntreanLaporan'
import type { LaporanAdmin } from '../../../services/adminService'

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({ pengguna: { id: 'admin', email: 'admin@contoh.id', nama: null, peran: 'admin' }, memuat: false }),
}))
vi.mock('../../../services/adminService', () => ({ ubahStatusLaporan: vi.fn() }))

beforeAll(() => {
  // jsdom belum selalu punya showModal/close untuk <dialog>.
  const proto = HTMLDialogElement.prototype
  proto.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
  // jsdom tidak punya matchMedia; anggap layar lebar (tabel tampil, lembar saringan ponsel tertutup).
  window.matchMedia ??= ((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})

const PROYEK = { id: 'p1', nama_paket: 'Drainase Lingkungan Pamoyanan', kecamatan: 'Cicendo', status_proyek: 'selesai' as const, is_demo: false }

function laporan(id: string, sebagian: Partial<LaporanAdmin> = {}): LaporanAdmin {
  return {
    id,
    proyek_id: PROYEK.id,
    kategori: 'kerusakan',
    deskripsi: 'Saluran tersumbat sampah.',
    foto_path: null,
    fotoUrl: null,
    status: 'diterima',
    catatan_status: null,
    is_demo: false,
    created_at: '2026-11-01T10:00:00+07:00',
    updated_at: '2026-11-01T10:00:00+07:00',
    jumlah_konfirmasi: 0,
    proyek: PROYEK,
    riwayat: [],
    ...sebagian,
  } as LaporanAdmin
}

const DATA = [
  laporan('lap-1', { created_at: '2026-10-01T10:00:00+07:00' }),
  laporan('lap-2', { kategori: 'belum_dikerjakan', deskripsi: 'Lampu jalan belum dipasang.', created_at: '2026-10-20T10:00:00+07:00' }),
  laporan('lap-3', { status: 'selesai', deskripsi: 'Sudah diperbaiki warga.' }),
]

function pasang(url = '/admin/laporan') {
  const router = createMemoryRouter(
    [{ path: '/admin/laporan', element: <AntreanLaporan laporan={DATA} proyekRedFlag={[]} onBerubah={() => {}} /> }],
    { initialEntries: [url] },
  )
  render(<RouterProvider router={router} />)
  return router
}

const tabel = () => screen.getByRole('table')
const barisData = () => within(tabel()).getAllByRole('row').slice(1)

describe('<AntreanLaporan>', () => {
  it('bawaan menampilkan laporan "Diterima", yang paling lama menunggu di atas', () => {
    pasang()
    expect(barisData()).toHaveLength(2)
    expect(barisData()[0]).toHaveTextContent('Kerusakan')
    expect(screen.getByRole('button', { name: /^Diterima/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('pencarian menyaring daftar, memperbarui angka tab, dan tersimpan di URL', () => {
    const router = pasang()
    fireEvent.change(screen.getByLabelText('Cari laporan'), { target: { value: 'lampu' } })
    expect(barisData()).toHaveLength(1)
    expect(barisData()[0]).toHaveTextContent('Belum dikerjakan')
    expect(within(screen.getByRole('button', { name: /^Semua/ })).getByText('1')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?q=lampu')
  })

  it('pencarian tanpa hasil menawarkan tombol hapus saringan', () => {
    pasang('/admin/laporan?q=tidakada')
    expect(screen.getByText('Tidak ada laporan yang cocok')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: /Hapus saringan/ })[0])
    expect(barisData()).toHaveLength(2)
  })

  it('tab status membaca dan menulis URL', () => {
    const router = pasang('/admin/laporan?status=selesai')
    expect(barisData()).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /^Semua/ }))
    expect(barisData()).toHaveLength(3)
    expect(router.state.location.search).toBe('?status=semua')
  })

  it('panel detail bisa berpindah ke laporan berikutnya di antrean', () => {
    pasang()
    fireEvent.click(within(barisData()[0]).getByRole('button', { name: 'Kerusakan' }))
    const panel = screen.getByRole('dialog', { name: 'Detail laporan', hidden: true })
    expect(within(panel).getByText('1 dari 2')).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Laporan sebelumnya', hidden: true })).toBeDisabled()
    fireEvent.click(within(panel).getByRole('button', { name: 'Laporan berikutnya', hidden: true }))
    expect(within(panel).getByText('2 dari 2')).toBeInTheDocument()
    expect(within(panel).getByText('Lampu jalan belum dipasang.')).toBeInTheDocument()
  })
})
