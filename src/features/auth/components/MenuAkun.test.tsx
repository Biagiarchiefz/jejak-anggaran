import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { MenuAkun } from './MenuAkun'
import type { Pengguna } from '../../../services/authService'

const WARGA: Pengguna = { id: 'u1', email: 'ayu.rizky@contoh.id', nama: 'Ayu Rizky', peran: 'warga' }

function pasang(pengguna: Pengguna = WARGA, onKeluar = vi.fn(async () => {})) {
  render(<MenuAkun pengguna={pengguna} onKeluar={onKeluar} />, { wrapper: MemoryRouter })
  return { onKeluar, tombol: screen.getByRole('button', { name: 'Akun: Ayu Rizky' }) }
}

describe('<MenuAkun>', () => {
  it('menampilkan inisial dan membuka menu saat diklik', () => {
    const { tombol } = pasang()
    expect(tombol).toHaveTextContent('AR')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.click(tombol)
    expect(tombol).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu')).toHaveTextContent('ayu.rizky@contoh.id')
    expect(screen.getByRole('menuitem', { name: 'Keluar' })).toHaveFocus()
    expect(screen.queryByRole('menuitem', { name: 'Panel admin' })).not.toBeInTheDocument()
  })

  it('Esc menutup menu dan mengembalikan fokus ke avatar', () => {
    const { tombol } = pasang()
    fireEvent.click(tombol)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(tombol).toHaveFocus()
  })

  it('admin melihat tautan panel admin; panah berpindah antar item', () => {
    pasang({ ...WARGA, peran: 'admin' })
    fireEvent.click(screen.getByRole('button', { name: 'Akun: Ayu Rizky' }))
    const admin = screen.getByRole('menuitem', { name: 'Panel admin' })
    expect(admin).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Keluar' })).toHaveFocus()
  })

  it('admin demo juga melihat panel admin beserta label perannya', () => {
    pasang({ ...WARGA, peran: 'admin_demo' })
    fireEvent.click(screen.getByRole('button', { name: 'Akun: Ayu Rizky' }))
    expect(screen.getByRole('menuitem', { name: 'Panel admin' })).toBeInTheDocument()
    expect(screen.getByRole('menu')).toHaveTextContent('Admin demo (khusus laporan demo)')
  })

  it('Keluar memanggil onKeluar lalu menutup menu', async () => {
    const { tombol, onKeluar } = pasang()
    fireEvent.click(tombol)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Keluar' }))
    expect(onKeluar).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })
})
