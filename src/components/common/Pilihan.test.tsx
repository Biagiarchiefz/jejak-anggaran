import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pilihan } from './Pilihan'

const OPSI = [
  { nilai: 'semua', label: 'Semua kecamatan' },
  { nilai: 'coblong', label: 'Coblong' },
  { nilai: 'kiaracondong', label: 'Kiaracondong' },
]

function Uji() {
  const [nilai, setNilai] = useState('semua')
  return <Pilihan label="Kecamatan" nilai={nilai} opsi={OPSI} onUbah={setNilai} />
}

describe('<Pilihan>', () => {
  it('membuka daftar saat diklik dan memilih opsi', () => {
    render(<Uji />)
    const tombol = screen.getByRole('combobox', { name: 'Kecamatan' })
    expect(tombol).toHaveTextContent('Semua kecamatan')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(tombol)
    expect(tombol).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'Coblong' }))

    expect(tombol).toHaveTextContent('Coblong')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('bisa dipakai dengan keyboard', () => {
    render(<Uji />)
    const tombol = screen.getByRole('combobox', { name: 'Kecamatan' })

    fireEvent.keyDown(tombol, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: 'Semua kecamatan' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tombol, { key: 'End' })
    expect(tombol).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Kiaracondong' }).id)
    fireEvent.keyDown(tombol, { key: 'Enter' })

    expect(tombol).toHaveTextContent('Kiaracondong')
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
  })

  it('Esc menutup tanpa mengubah pilihan', () => {
    render(<Uji />)
    const tombol = screen.getByRole('combobox', { name: 'Kecamatan' })
    fireEvent.keyDown(tombol, { key: 'ArrowDown' })
    fireEvent.keyDown(tombol, { key: 'ArrowDown' })
    fireEvent.keyDown(tombol, { key: 'Escape' })
    expect(tombol).toHaveTextContent('Semua kecamatan')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('mengetik huruf melompat ke opsi yang cocok', () => {
    render(<Uji />)
    const tombol = screen.getByRole('combobox', { name: 'Kecamatan' })
    fireEvent.keyDown(tombol, { key: 'k' })
    expect(tombol).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Kiaracondong' }).id)
  })
})
