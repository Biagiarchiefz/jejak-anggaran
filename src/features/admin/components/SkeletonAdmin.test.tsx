import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonAntreanLaporan, SkeletonDasborAdmin, SkeletonPanelAdmin } from './SkeletonAdmin'
import { SkeletonFormMasuk, SkeletonMasuk } from '../../auth/components/SkeletonMasuk'

describe('skeleton panel admin', () => {
  it('dashboard: 5 kartu angka, kartu waktu respons, dan 5 baris prioritas', () => {
    const { container } = render(<SkeletonDasborAdmin />)
    expect(screen.getByRole('status')).toHaveTextContent('Memuat ringkasan laporan…')
    expect(container.querySelectorAll('.lg\\:grid-cols-5 > div')).toHaveLength(5)
    expect(container.querySelectorAll('.px-3.py-2\\.5')).toHaveLength(5)
  })

  it('antrean laporan: bilah cari + 3 saringan, 6 tab status, 6 baris tabel, 4 baris ponsel', () => {
    const { container } = render(<SkeletonAntreanLaporan />)
    expect(screen.getByRole('status')).toHaveTextContent('Memuat daftar laporan…')
    expect(container.querySelectorAll('.min-h-11.rounded-md.border')).toHaveLength(4)
    expect(container.querySelectorAll('[data-tab]')).toHaveLength(6)
    expect(container.querySelectorAll('.md\\:block .divide-y > div')).toHaveLength(6)
    expect(container.querySelectorAll('.md\\:hidden > div')).toHaveLength(4)
  })

  it('panel penuh memilih isi sesuai path', () => {
    const dasbor = render(<SkeletonPanelAdmin pathname="/admin" />)
    expect(screen.getByText('Memuat ringkasan laporan…')).toBeInTheDocument()
    dasbor.unmount()
    render(<SkeletonPanelAdmin pathname="/admin/laporan" />)
    expect(screen.getByText('Memuat daftar laporan…')).toBeInTheDocument()
  })
})

describe('skeleton halaman masuk', () => {
  it('form: pengalih Masuk/Daftar, dua field 44px, dan tombol kirim', () => {
    const { container } = render(<SkeletonFormMasuk />)
    expect(screen.getByRole('status')).toHaveTextContent('Memeriksa status masuk…')
    expect(container.querySelector('.grid-cols-2.rounded-full.bg-recessed')).toBeInTheDocument()
    expect(container.querySelectorAll('.min-h-11.rounded-md.border')).toHaveLength(2)
  })

  it('halaman penuh: panel foto gelap (desktop) dan foto ringkas (ponsel)', () => {
    const { container } = render(<SkeletonMasuk />)
    expect(container.querySelectorAll('.bg-band-deep')).toHaveLength(2)
    expect(screen.getByText('Memeriksa status masuk…')).toBeInTheDocument()
  })
})
