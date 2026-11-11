# Jejak Anggaran

**Ikuti uang publik Kota Bandung, dari anggaran sampai ke lapangan.**

Jejak Anggaran membantu warga menjawab tiga pertanyaan sederhana: *berapa anggarannya, dipakai untuk proyek apa, dan bagaimana kondisinya sekarang?*
Angka APBD dan paket proyek dari sumber resmi disajikan dalam bahasa awam, setiap proyek ditandai di peta, lalu warga melaporkan dan mengonfirmasi kondisi nyatanya di lapangan.

Dibuat untuk lomba **WIA MIA 2026** dengan tema *Designing Digital Futures – Powering Public Transparency*.
Jejak Anggaran adalah **pelengkap [LAPOR!](https://www.lapor.go.id/)**, bukan penggantinya: setiap laporan bisa diteruskan ke kanal resmi pemerintah dengan satu tombol.

---

## Akses untuk juri

Buka halaman **Masuk** (`/masuk`). Tersedia tombol satu klik **Warga demo** dan **Admin** (akses masuk singkat untuk demo), atau ketik kredensial berikut:

| Akun | Email | Kata sandi | Yang bisa dicoba |
| --- | --- | --- | --- |
| **Warga demo** | `warga.demo@jejakanggaran.id` | `Warga-HPVi7398-wkfV!` | Melapor kondisi proyek dengan foto, dan mengonfirmasi laporan warga lain |
| **Admin** | `admin.juri@jejakanggaran.id` | `Juri-CHwY9777-YgKk!` | Panel admin: dashboard tindak lanjut, verifikasi, dan mengubah status **semua** laporan |

Tanpa masuk pun, semua data anggaran, peta, dan detail proyek bisa dibuka.

### Panduan mencoba dalam 5 menit

1. **Sebagai pengunjung (tanpa masuk)**
   - **Beranda**: peta Kota Bandung dengan pin proyek, angka ringkas APBD, dan proyek yang perlu perhatian.
   - **Anggaran**: total APBD resmi, pembagian per bidang, tren antartahun, realisasi, dan artinya per warga ("setara Rp … per warga per hari").
   - **Peta proyek**: cari dan saring proyek per kecamatan atau status, lalu klik pin untuk melihat ringkasannya.
   - **Rapor**: proyek, pagu, dan laporan warga per kecamatan atau per dinas, lengkap dengan tombol **Unduh CSV** dan **Cetak / PDF** untuk analisis lanjutan.
   - **Detail proyek**: pagu, kode RUP dengan tautan ke halaman paketnya di SiRUP, lokasi di peta, linimasa foto, dan laporan warga.
2. **Sebagai warga demo**
   - Di halaman detail proyek, tekan **Laporkan kondisi**, pilih jenis masalah, ceritakan kondisinya, lalu unggah foto.
   - Pada laporan warga lain, tekan **Saya juga melihat** untuk mengonfirmasi.
3. **Sebagai admin juri**
   - Setelah masuk, Anda langsung dibawa ke **panel admin**: jumlah laporan per status, rata-rata waktu respons, dan antrean prioritas.
   - Buka **Laporan warga**, pilih satu laporan, lalu ubah statusnya: *Diverifikasi → Ditindaklanjuti → Selesai*, atau *Ditolak* dengan catatan.
   - Kembali ke halaman proyeknya: riwayat perubahan status langsung tampil untuk publik.

> **Angka anggaran adalah data resmi** APBD Kota Bandung 2023–2026 dari DJPK Kemenkeu. Peta memuat **8 proyek nyata** TA 2025 dari SiRUP (pagu dan tautan ke halaman paketnya di `sirup.inaproc.id`) dan **4 proyek demo (fiktif)** untuk memperagakan laporan warga, konfirmasi, tanda "perlu perhatian", dan panel admin; nama proyek demo selalu diberi tanda "(fiktif)". Selama data demo tampil, catatan di bagian bawah halaman memberitahukannya. Laporan negatif simulasi hanya ditempelkan pada proyek fiktif, tidak pernah pada proyek nyata.

---

## Masalah yang ingin diselesaikan

Data anggaran daerah sebenarnya terbuka (DJPK Kemenkeu, SiRUP LKPP), tetapi tersebar di banyak situs, berbentuk tabel teknis, dan tidak terhubung dengan kondisi nyata di lapangan. Akibatnya warga sulit tahu proyek apa yang dibiayai di sekitar rumahnya, dan kanal pengaduan resmi kerap menerima laporan tanpa konteks anggaran.

Jejak Anggaran menyambungkan ketiganya dalam satu alur:

```
Anggaran (APBD, DJPK)  →  Proyek di peta (SiRUP)  →  Kondisi nyata (laporan + konfirmasi warga)
```

## Fitur utama

| Fitur | Penjelasan singkat |
| --- | --- |
| **Dashboard anggaran** | Total APBD resmi 2023–2026, pembagian per bidang (klasifikasi fungsi DJPK), tren antartahun, realisasi, dan konteks per warga. |
| **Peta proyek** | Semua proyek di peta Kota Bandung, dengan pencarian dan saringan status/kecamatan, tersinkron dengan daftar di sampingnya. |
| **Detail proyek** | Pagu, kode RUP dengan tautan ke SiRUP, nilai kontrak dan pelaksana (bila tersedia), linimasa foto dari warga, dan semua laporan warga. |
| **Lapor kondisi** | Form sederhana dengan foto. Foto dikompres di perangkat dan data lokasi GPS di dalamnya dihapus sebelum dikirim. Anti-spam: maksimal 5 laporan per akun dalam 24 jam, dan satu laporan per proyek dalam 24 jam (dijaga di database). |
| **Konfirmasi warga** | Warga lain bisa menekan "Saya juga melihat", sehingga laporan yang banyak dikonfirmasi lebih menonjol. |
| **Tanda "perlu perhatian"** | Proyek yang tercatat selesai tetapi menerima beberapa laporan kerusakan terverifikasi ditandai otomatis. Ini **bukan tuduhan**, hanya sinyal untuk diperhatikan. |
| **Status dan riwayat terbuka** | Setiap perubahan status laporan tercatat (kapan dan catatannya) dan bisa dilihat publik. |
| **Teruskan ke LAPOR!** | Ringkasan laporan siap disalin untuk dikirim ke kanal resmi pemerintah. |
| **Panel admin** | Dashboard tindak lanjut, antrean prioritas verifikasi, dan pengubahan status laporan. |
| **Rapor wilayah** | Per kecamatan atau per dinas: jumlah proyek, total pagu, laporan warga per status, rata-rata waktu respons, dan proyek yang perlu perhatian. Bisa disaring ke data nyata saja. |
| **Unduh data terbuka** | CSV rapor, daftar proyek (dengan penanda data demo dan tautan SiRUP), dan APBD per bidang beserta persen serapannya, siap diolah di spreadsheet. Rapor juga bisa dicetak atau disimpan sebagai PDF. |
| **Halaman Tentang Data** | Dari mana setiap angka berasal, cara kurasi, aturan tanda "perlu perhatian", dan keterbatasan data. |

## Prinsip yang kami pegang

- **Setiap angka punya sumber.** Angka anggaran dan pagu selalu disertai nama sumber, tanggal akses, dan tautannya, jadi siapa pun bisa mengecek ulang.
- **Jujur soal batas data.** Data demo diberi tanda "(fiktif)" dan tidak pernah dicampur dengan tuduhan pada proyek nyata. Koordinat perkiraan dan status yang diambil dari jadwal SiRUP disebut terang-terangan di halaman Tentang Data.
- **Tanda "perlu perhatian" bukan tuduhan.** Tanda ini hanya muncul dari laporan warga yang sudah diverifikasi, dengan aturan yang dijelaskan terbuka.
- **Privasi pelapor.** Nama dan email pelapor tidak pernah tampil di halaman publik, dan data lokasi GPS di dalam foto dihapus sebelum diunggah.
- **Untuk semua warga.** Bahasa awam, dirancang mulai dari layar ponsel, dan menghormati pengaturan "kurangi gerak".

## Tampilan dan pengalaman

- Desain bersih dengan aksen biru langit, mobile-first, dengan navigasi bawah di ponsel.
- Hero Beranda berupa peta Kota Bandung dengan pin proyek dan kartu ringkasan.
- **Loading skeleton yang meniru bentuk asli** setiap halaman (bukan kotak polos), sehingga tata letak tidak meloncat saat data datang.
- Setiap data punya tiga keadaan yang jelas: sedang dimuat, kosong (dengan saran tindakan), dan gagal (dengan tombol "Coba lagi").

---

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Bahasa | TypeScript (strict) |
| Frontend | React 19 + Vite, React Router 7 |
| Styling | Tailwind CSS 4, font Inter, ikon lucide-react |
| Grafik dan peta | Recharts, Leaflet + react-leaflet (peta OpenStreetMap) |
| Backend | Supabase: Postgres dengan Row Level Security, Auth email + kata sandi, Storage foto |
| Validasi | zod (form dan data CSV) |
| Kualitas | Vitest + React Testing Library (233 test), ESLint, TypeScript strict |
| Deploy | Vercel |

Keamanan data dijaga di database, bukan hanya di tampilan: aturan siapa boleh membuat laporan, mengonfirmasi, dan mengubah status ditegakkan oleh Row Level Security di Postgres.

## Menjalankan secara lokal

Butuh **Node.js 22.18 atau lebih baru**. Untuk database lokal, butuh juga **Docker** dan [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
git clone https://github.com/Biagiarchiefz/jejak-anggaran.git
cd jejak-anggaran
npm install
cp .env.example .env.local     # isi alamat dan anon key Supabase

supabase start                 # jalankan Supabase lokal
supabase db reset              # siapkan tabel dan data awal

npm run dev                    # buka http://localhost:5173
```

Perintah lain:

```bash
npm run build                                       # build produksi
npm run typecheck && npm run lint && npm run test   # pemeriksaan kualitas
npm run data:seed                                   # validasi data CSV lalu buat data awal database
```

## Sumber data

Semua data adalah data publik dari sumber resmi, disimpan sebagai CSV di folder `data/raw/`, lalu divalidasi otomatis sebelum masuk database (`npm run data:seed`). Validasinya memeriksa tipe angka, koordinat harus berada di dalam Kota Bandung, kecamatan harus salah satu dari 30 kecamatan, dan setiap data nyata wajib punya tautan sumber serta tanggal akses. Tidak ada scraping otomatis.

| Data | Sumber | Cara diambil | Status |
| --- | --- | --- | --- |
| **APBD Kota Bandung**: anggaran dan realisasi belanja per fungsi, 2023–2026 | [DJPK Kementerian Keuangan](https://djpk.kemenkeu.go.id/?p=5412) | Berkas Excel resmi *Anggaran/Realisasi Belanja per Fungsi* diunduh, baris Kota Bandung (kode pemda 10.17) dijumlahkan per bidang, lalu dicocokkan dengan total belanja daerah di berkas ringkasan resmi | ✅ Dipakai. Realisasi tersedia sampai 2024 |
| **Paket proyek**: kode RUP, nama paket, satuan kerja, pagu, lokasi | [SiRUP LKPP](https://sirup.inaproc.id/sirup/) | Diekspor tim dari menu *Cari Paket* SiRUP (berkas asli di `data/data-proyek-sirupinaproc/`), lalu dicocokkan dengan halaman detail tiap paket | ✅ 8 paket Pekerjaan Konstruksi TA 2025 |
| **Lokasi proyek** | [OpenStreetMap](https://www.openstreetmap.org/copyright) (Nominatim), © kontributor OpenStreetMap, ODbL | Titik tengah kelurahan dari "Detail Lokasi" paket di SiRUP | ⚠️ Perkiraan, belum survei lapangan |
| **Jumlah penduduk** (konteks per warga) | BPS Kota Bandung | Disalin dari publikasi BPS | ✅ Dipakai |
| **Kondisi lapangan** | Laporan dan konfirmasi warga | Dikirim lewat website, diverifikasi admin | ✅ Dipakai |
| Nilai kontrak dan pelaksana | LPSE Kota Bandung (`spse.inaproc.id/bandungkota`) | — | ⏳ Belum. Paket yang dipakai memakai metode Pengadaan Langsung |
| Koordinat dan foto lapangan | Survei tim | — | ⏳ Belum. Kartu proyek memakai foto ilustrasi berlabel |

Status proyek nyata diperkirakan dari *jadwal pelaksanaan kontrak* di SiRUP, bukan dari pengecekan lapangan. Laporan warga yang membantu memastikan kondisi sebenarnya.

## Status pengembangan

**Sudah berjalan:** semua halaman dan fitur prioritas di atas, termasuk masuk/daftar, panel admin, tanda "perlu perhatian" otomatis, riwayat status, teruskan ke LAPOR!, rapor wilayah dengan unduh CSV, dan loading skeleton di setiap halaman.

**Rencana berikutnya:**

- Menambah proyek nyata sampai 10–20 paket dan melengkapi nilai kontrak serta pelaksana dari LPSE.
- Survei lapangan tim untuk koordinat yang tepat dan foto kondisi awal setiap proyek.
- Mode bahasa yang lebih awam lagi untuk istilah anggaran.

## Dokumentasi lain

- [PRD.md](PRD.md): ruang lingkup dan daftar fitur
- [Architecture.md](Architecture.md): arsitektur, struktur folder, model data, aturan akses
- [DESIGN.md](DESIGN.md): panduan gaya visual
