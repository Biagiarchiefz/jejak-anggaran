import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { PitaStatistik } from './PitaStatistik'
import { SeksiAnggaran } from './SeksiAnggaran'
import { SeksiProyek } from './SeksiProyek'
import { SkeletonBeranda } from './SkeletonBeranda'
import { AppError } from '../../../utils/errors'
import type { StateMuat } from '../../../hooks/useMuat'

function memuat<T>(): StateMuat<T> {
  return { data: undefined, error: null, memuat: true, muatUlang: vi.fn() }
}

function gagal<T>(): StateMuat<T> {
  return { data: undefined, error: new AppError('JARINGAN'), memuat: false, muatUlang: vi.fn() }
}

describe('skeleton Beranda saat data dimuat', () => {
  it('SeksiProyek menampilkan 6 kartu skeleton berstatus "memuat"', () => {
    const { container } = render(<SeksiProyek proyek={memuat()} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('status')).toHaveTextContent('Memuat daftar proyek…')
    // Rasio foto sama dengan <KartuProyek> agar grid tidak bergeser.
    expect(container.querySelectorAll('li .aspect-5\\/2')).toHaveLength(6)
  })

  it('SeksiAnggaran menampilkan kerangka dua kartu dengan kolom yang sama', () => {
    const { container } = render(<SeksiAnggaran anggaran={memuat()} />, { wrapper: MemoryRouter })
    expect(screen.getByRole('status')).toHaveTextContent('Memuat ringkasan anggaran…')
    expect(container.querySelector('.lg\\:col-span-7')).toBeInTheDocument()
    expect(container.querySelector('.lg\\:col-span-5')).toBeInTheDocument()
  })

  it('PitaStatistik menampilkan 4 placeholder angka', () => {
    const { container } = render(<PitaStatistik anggaran={memuat()} proyek={memuat()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Memuat angka statistik…')
    expect(container.querySelectorAll('.border-t.border-white\\/15')).toHaveLength(4)
  })

  it('skeleton diganti pesan galat, bukan tetap berdenyut, saat pemuatan gagal', () => {
    const { container } = render(<SeksiProyek proyek={gagal()} />, { wrapper: MemoryRouter })
    expect(screen.queryByText('Memuat daftar proyek…')).not.toBeInTheDocument()
    expect(container.querySelector('.motion-safe\\:animate-pulse')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /coba lagi/i })).toBeInTheDocument()
  })

  it('SkeletonBeranda (fallback Suspense) berisi hero, 4 angka ringkasan, dan 3 kartu proyek terpisah', () => {
    const { container } = render(<SkeletonBeranda />)
    expect(screen.getByText('Memuat beranda…')).toBeInTheDocument()
    expect(container.querySelector('.min-h-dvh')).toBeInTheDocument()
    expect(container.querySelectorAll('.border-t.border-white\\/15')).toHaveLength(4)
    expect(container.querySelectorAll('li .aspect-5\\/2')).toHaveLength(3)
  })
})
