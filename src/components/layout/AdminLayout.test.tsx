import { fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLayout } from './AdminLayout'
import type { NilaiAuth } from '../../context/authContext'
import type { Pengguna } from '../../services/authService'

const auth = vi.hoisted(() => ({ nilai: { pengguna: null, memuat: false } as NilaiAuth }))

vi.mock('../../hooks/useAuth', () => ({ useAuth: () => auth.nilai }))
vi.mock('../../features/admin/hooks/useLaporanAdmin', () => ({
  useLaporanAdmin: () => ({
    data: { laporan: [{ status: 'diterima' }, { status: 'diterima' }, { status: 'selesai' }], proyekRedFlag: [] },
    error: null,
    memuat: false,
    muatUlang: () => {},
  }),
}))

const ADMIN_DEMO: Pengguna = { id: 'u1', email: 'admin.demo@contoh.id', nama: null, peran: 'admin_demo' }

function pasang() {
  const router = createMemoryRouter(
    [{ path: '/admin', element: <AdminLayout />, children: [{ index: true, element: <p>Isi dashboard</p> }] }],
    { initialEntries: ['/admin'] },
  )
  render(<RouterProvider router={router} />)
}

describe('<AdminLayout>', () => {
  beforeEach(() => {
    auth.nilai = { pengguna: null, memuat: false }
    localStorage.clear()
  })

  it('tamu diminta masuk, tanpa sidebar', () => {
    pasang()
    expect(screen.getByText('Halaman ini khusus admin')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/masuk?kembali=/admin')
    expect(screen.queryByRole('navigation', { name: 'Menu admin' })).not.toBeInTheDocument()
  })

  it('akun warga tidak bisa masuk panel', () => {
    auth.nilai = { pengguna: { ...ADMIN_DEMO, peran: 'warga' }, memuat: false }
    pasang()
    expect(screen.getByText('Akun Anda tidak memiliki peran admin.')).toBeInTheDocument()
    expect(screen.queryByText('Isi dashboard')).not.toBeInTheDocument()
  })

  it('admin demo melihat sidebar, jumlah laporan menunggu, banner, dan isi halaman', () => {
    auth.nilai = { pengguna: ADMIN_DEMO, memuat: false }
    pasang()
    const nav = screen.getByRole('navigation', { name: 'Menu admin' })
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: /Laporan warga/ })).toHaveTextContent('2')
    expect(screen.getByText('admin demo')).toBeInTheDocument()
    expect(screen.getByText('Admin demo (khusus laporan demo)')).toBeInTheDocument()
    expect(screen.getByText('Isi dashboard')).toBeInTheDocument()
  })

  it('sidebar bisa diciutkan ke mode ikon dan pilihannya diingat', () => {
    auth.nilai = { pengguna: ADMIN_DEMO, memuat: false }
    pasang()
    fireEvent.click(screen.getByRole('button', { name: 'Ciutkan sidebar' }))

    const tombol = screen.getByRole('button', { name: 'Lebarkan sidebar' })
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
    expect(localStorage.getItem('jejak-anggaran:sidebar-admin-ciut')).toBe('1')
    // Label menu tetap ada untuk pembaca layar; tooltip menampilkan nama menu.
    const nav = screen.getByRole('navigation', { name: 'Menu admin' })
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(within(nav).getByText('Laporan warga (2 menunggu)')).toBeInTheDocument()
    // Kartu profil disembunyikan, diganti tombol ikon Keluar.
    expect(screen.queryByText('Admin demo (khusus laporan demo)')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keluar' })).toBeInTheDocument()

    fireEvent.click(tombol)
    expect(screen.getByRole('button', { name: 'Ciutkan sidebar' })).toHaveAttribute('aria-expanded', 'true')
    expect(localStorage.getItem('jejak-anggaran:sidebar-admin-ciut')).toBe('0')
  })
})
