/**
 * Foto ilustrasi untuk kartu proyek yang belum punya foto lapangan tim. Semua foto: Unsplash License
 * (bebas dipakai, atribusi tidak wajib); sumbernya dicatat di sini. Foto ini BUKAN foto proyek tersebut,
 * jadi UI wajib memberi label "Foto ilustrasi" setiap kali menampilkannya.
 */
export type FotoIlustrasi = {
  id: string
  alt: string
  fotografer: string
  halaman: string
}

const JALAN: FotoIlustrasi = {
  id: '1665631154001-5f921d61a1a8',
  alt: 'Pekerja berompi keselamatan memperbaiki jalan',
  fotografer: 'nanang adi',
  halaman: 'https://unsplash.com/photos/a-group-of-men-wearing-safety-vests-working-on-a-road-U6U5OCxZ5cM',
}
const SALURAN: FotoIlustrasi = {
  id: '1523252284915-bbd9e33fdf13',
  alt: 'Tiga pekerja membangun saluran di tepi jalan pada siang hari',
  fotografer: 'Artem Beliaikin',
  halaman: 'https://unsplash.com/photos/three-men-constructing-road-during-daytime-A0GRntzimIs',
}
const TAMAN: FotoIlustrasi = {
  id: '1744343934252-b881283a9308',
  alt: 'Pepohonan rindang di Alun-Alun Bandung',
  fotografer: 'Abdul Ridwan',
  halaman: 'https://unsplash.com/photos/the-city-sign-welcomes-visitors-to-bandung-kR3B5nwgEDM',
}
export const FOTO_ILUSTRASI_BAWAAN: FotoIlustrasi = {
  id: '1786876838490-76e288bf04e1',
  alt: 'Pemandangan padatnya Kota Bandung dari ketinggian',
  fotografer: 'Abdul Ridwan',
  halaman: 'https://unsplash.com/photos/hotel-building-overlooking-bandung-city-eTG3fSMkhgc',
}

// Urutan penting: aturan pertama yang cocok dipakai.
const ATURAN: { cocok: RegExp; foto: FotoIlustrasi }[] = [
  { cocok: /saluran|drainase|gorong/i, foto: SALURAN },
  { cocok: /taman|ruang terbuka|\brth\b/i, foto: TAMAN },
  { cocok: /jalan|trotoar|jembatan/i, foto: JALAN },
]

/** Foto ilustrasi yang sesuai jenis pekerjaan, ditebak dari nama paket. */
export function fotoIlustrasiProyek(namaPaket: string): FotoIlustrasi {
  return ATURAN.find((a) => a.cocok.test(namaPaket))?.foto ?? FOTO_ILUSTRASI_BAWAAN
}

export const urlFotoUnsplash = (id: string, lebar: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${lebar}`
