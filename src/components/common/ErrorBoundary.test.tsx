import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { AppError } from '../../utils/errors'

let gagal = true

function Rapuh() {
  if (gagal) throw new AppError('JARINGAN')
  return <p>Konten halaman</p>
}

describe('<ErrorBoundary>', () => {
  beforeEach(() => {
    gagal = true
    // React mencetak error yang tertangkap ke console; senyapkan di test.
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('menampilkan pesan aman dan tombol "Coba lagi" yang memulihkan halaman', () => {
    render(
      <ErrorBoundary>
        <Rapuh />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Tidak dapat terhubung ke server')

    gagal = false
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(screen.getByText('Konten halaman')).toBeInTheDocument()
  })

  it('tidak menampilkan pesan error mentah', () => {
    function Mentah(): never {
      throw new Error('relation "public.laporan" does not exist')
    }
    render(
      <ErrorBoundary>
        <Mentah />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).not.toHaveTextContent('relation')
  })
})
