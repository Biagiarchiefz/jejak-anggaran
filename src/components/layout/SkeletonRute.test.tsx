import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkeletonRute } from './SkeletonRute'
import { SkeletonDashboardAnggaran } from '../../features/anggaran/components/SkeletonAnggaran'
import { SkeletonHasilPeta } from '../../features/proyek/components/SkeletonPeta'

describe('SkeletonRute (fallback Suspense per halaman)', () => {
  it('/anggaran: panel 4 metrik, 6 baris urusan, dan grafik tren, bukan kotak polos', () => {
    const { container } = render(<SkeletonRute pathname="/anggaran" />)
    expect(screen.getByText('Memuat data anggaran…')).toBeInTheDocument()
    expect(container.querySelectorAll('.grid-cols-2.gap-px > div')).toHaveLength(4)
    expect(container.querySelectorAll('.size-8.shrink-0')).toHaveLength(6)
    expect(container.querySelector('.h-60')).toBeInTheDocument()
  })

  it('/peta: kolom cari, chip status, peta setinggi aslinya, dan item daftar terpisah', () => {
    const { container } = render(<SkeletonRute pathname="/peta" />)
    expect(screen.getByText('Memuat peta proyek…')).toBeInTheDocument()
    expect(container.querySelectorAll('.h-11.rounded-full')).toHaveLength(4)
    expect(container.querySelector('.min-h-80')).toBeInTheDocument()
    expect(container.querySelectorAll('li .size-16')).toHaveLength(4)
  })

  it('/tentang-data: daftar isi 7 bagian dan tabel sumber 4 baris', () => {
    const { container } = render(<SkeletonRute pathname="/tentang-data" />)
    expect(screen.getByText('Memuat halaman…')).toBeInTheDocument()
    expect(container.querySelectorAll('ul.border-l > li')).toHaveLength(7)
    expect(container.querySelectorAll('.border-b.border-border-soft.px-4')).toHaveLength(4)
  })

  it('/rapor: kerangka rapor wilayah', () => {
    const { container } = render(<SkeletonRute pathname="/rapor" />)
    expect(screen.getByText('Memuat rapor wilayah…')).toBeInTheDocument()
    expect(container.querySelectorAll('.lg\\:grid-cols-4 > div')).toHaveLength(4)
  })

  it('rute tak dikenal (404) memakai bentuk EmptyState: ikon, judul, kalimat, tombol', () => {
    const { container } = render(<SkeletonRute pathname="/halaman-tidak-ada" />)
    expect(screen.getByText('Memuat halaman…')).toBeInTheDocument()
    expect(container.querySelector('.size-10')).toBeInTheDocument()
    expect(container.querySelector('.h-12.rounded-full')).toBeInTheDocument()
  })

  it('kerangka data di dalam halaman tidak menduplikasi kepala halaman', () => {
    const anggaran = render(<SkeletonDashboardAnggaran />)
    expect(anggaran.container.querySelector('.md\\:text-\\[48px\\]')).not.toBeInTheDocument()
    anggaran.unmount()
    const peta = render(<SkeletonHasilPeta />)
    expect(peta.container.querySelector('.md\\:text-\\[48px\\]')).not.toBeInTheDocument()
  })

  it('/proyek/:id: grid data 4 sel, 3 foto linimasa, 2 kartu laporan, dan kartu ringkasan', () => {
    const { container } = render(<SkeletonRute pathname="/proyek/abc-123" />)
    expect(screen.getByText('Memuat detail proyek…')).toBeInTheDocument()
    expect(container.querySelectorAll('.sm\\:grid-cols-4 > div')).toHaveLength(4)
    expect(container.querySelectorAll('.w-56.shrink-0')).toHaveLength(3)
    expect(container.querySelectorAll('.rounded-full.border.pr-1\\.5')).toHaveLength(2)
    expect(container.querySelector('.aspect-\\[16\\/7\\]')).toBeInTheDocument()
  })

  it('/proyek/:id/lapor: 4 pilihan kategori, textarea, dan area unggah foto', () => {
    const { container } = render(<SkeletonRute pathname="/proyek/abc-123/lapor" />)
    expect(screen.getByText('Memuat formulir laporan…')).toBeInTheDocument()
    expect(container.querySelectorAll('.p-3\\.5')).toHaveLength(4)
    expect(container.querySelector('.h-\\[142px\\]')).toBeInTheDocument()
    expect(container.querySelector('.border-dashed.py-8')).toBeInTheDocument()
  })
})
