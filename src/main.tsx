import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './styles/index.css'
import App from './App.tsx'

// Animasi muncul saat digulir hanya aktif jika didukung dan pengguna tidak memilih "kurangi gerak".
// Dipasang sebelum render pertama agar konten tidak sempat tampil lalu menghilang.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('animasi-muncul')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
