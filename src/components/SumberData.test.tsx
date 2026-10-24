import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { BadgeDemo } from './BadgeDemo'
import { SumberData } from './SumberData'

describe('<SumberData>', () => {
  it('menampilkan nama sumber, tautan, dan tanggal akses', () => {
    render(<SumberData nama="SiRUP LKPP" url="https://sirup.lkpp.go.id/x" diaksesPada="2026-10-01" />, {
      wrapper: MemoryRouter,
    })
    const tautan = screen.getByRole('link', { name: /SiRUP LKPP/ })
    expect(tautan).toHaveAttribute('href', 'https://sirup.lkpp.go.id/x')
    expect(tautan).toHaveAttribute('target', '_blank')
    expect(tautan).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(screen.getByText(/diakses 1 Oktober 2026/)).toBeInTheDocument()
  })

  it('menandai angka dari data demo sebagai fiktif', () => {
    render(<SumberData nama="SiRUP LKPP" url="https://sirup.lkpp.go.id/x" demo />, { wrapper: MemoryRouter })
    expect(screen.getByText(/data demo \(fiktif\)/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /SiRUP/ })).not.toBeInTheDocument()
  })
})

describe('<BadgeDemo>', () => {
  it('selalu bertuliskan "Data demo"', () => {
    render(<BadgeDemo />)
    expect(screen.getByText('Data demo')).toBeInTheDocument()
  })
})
