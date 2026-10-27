# DESIGN.md — Jejak Anggaran

Aturan desain visual untuk semua pekerjaan UI di proyek ini. **Baca file ini sebelum membuat atau mengubah halaman, komponen, atau gaya apa pun.** Jika aturan di sini bertentangan dengan permintaan di prompt, ikuti prompt lalu sebutkan aturan mana yang dilanggar.

File ini melengkapi `CLAUDE.md` (stack, konvensi kode) dan `PRD.md` (fitur).

---

## 1. Arah desain

**Referensi gaya:** bahasa visual cloudflare.com — kanvas terang dan bersih, tipografi sans-serif besar dengan bobot sedang, tombol berbentuk pil, kartu dengan garis tipis (*hairline*) dan bayangan sangat halus, angka statistik besar, serta pita gelap yang dipakai hemat untuk momen penting.

**Perbedaan utama:** warna oranye Cloudflare **diganti biru cerah yang tegas**, dan latar putih murni diganti **putih lembut** yang nyaman di mata. Biru adalah satu-satunya warna aksen merek.

**Yang TIDAK boleh disalin dari Cloudflare:** logo, nama, ilustrasi, foto, ikon khusus, maupun teks/copy mereka. Yang ditiru hanya prinsip tata letak, ritme, dan gaya komponen.

**Kesan yang dituju:** bersih, terstruktur, dan *dapat dipercaya* — seperti situs infrastruktur, bukan situs promosi. Data adalah tokoh utama; dekorasi seminimal mungkin.

---

## 2. Prinsip

1. **Putih lembut, bukan putih murni.** Latar halaman memakai putih keabuan kebiruan (`canvas`) yang tidak menyilaukan. Putih murni `#FFFFFF` tidak dipakai sebagai latar besar.
2. **Biru cerah seperlunya.** Biru hanya untuk aksi utama, tautan, fokus, penanda di peta, ikon aksen, dan grafik. Jangan memakai biru sebagai latar seluruh section terang.
3. **Kontras lewat kecerahan, bukan warna.** Section bergantian `canvas` → `canvas-soft` → pita biru tua, bukan ganti-ganti warna.
4. **Garis tipis membawa struktur.** Pakai border 1px untuk memisahkan; bayangan hanya tipis.
5. **Angka besar, label kecil.** Statistik anggaran ditampilkan besar dengan label pendek di bawahnya.
6. **Setiap angka punya sumber.** Komponen `<SumberData>` adalah bagian dari desain, bukan tambahan.
7. **Merah hanya untuk red flag dan galat.** Jangan memakai merah untuk dekorasi.

---

## 3. Warna

### 3.1 Token

Palet ini terang dan nyaman di mata: latar putih lembut, biru cerah yang tegas, dan teks abu gelap (bukan hitam pekat).

| Token | Hex | Kegunaan |
| --- | --- | --- |
| `canvas` | `#F6F8FB` | **Latar utama halaman** (putih lembut, tidak menyilaukan) |
| `surface` | `#FBFCFE` | Kartu, header, input, modal (sedikit lebih terang dari kanvas agar terangkat) |
| `canvas-soft` | `#EEF2F7` | Section selang-seling, header tabel |
| `canvas-blue` | `#EAF3FF` | Latar tipis bernuansa biru (hero, highlight ringan) |
| `recessed` | `#E9EEF4` | Kode, input nonaktif, skeleton |
| `band` | `#0F3B6E` | Pita biru tua (statistik, CTA penutup) |
| `band-deep` | `#0B2545` | Footer |
| `ink` | `#1F2937` | Teks utama (abu gelap, bukan hitam) |
| `ink-strong` | `#111827` | Judul besar |
| `ink-muted` | `#4B5563` | Teks sekunder |
| `ink-subtle` | `#5B6576` | Keterangan, caption, label sumber |
| `on-dark` | `#FFFFFF` | Teks di atas `band` |
| `on-dark-muted` | `#C7E2FF` | Teks sekunder di atas `band` |
| `brand` | `#2B8CFF` | **Warna merek, biru cerah**: aksen, ikon, pin peta, seri grafik utama, cincin fokus |
| `brand-light` | `#8CC8FF` | Aksen di atas pita gelap, seri grafik kedua |
| `brand-soft` | `#E6F1FF` | Latar badge/chip biru, hover baris tabel |
| `action` | `#1673E0` | **Isi tombol utama** (biru cerah yang tegas; kontras 4,6:1 dengan putih) |
| `action-hover` | `#0F66CC` | Hover tombol utama |
| `link` | `#0B5CCB` | Tautan teks dan teks di atas `brand-soft` |
| `border-soft` | `#EDF1F6` | Pemisah sangat halus |
| `border` | `#E2E8F0` | Border default kartu, input, tabel |
| `border-strong` | `#CBD5E1` | Border tombol sekunder, input saat hover |
| `danger` | `#C81E1E` | Red flag, galat |
| `danger-soft` | `#FDECEC` | Latar badge red flag, kotak galat |
| `warning` | `#A15C07` | Peringatan |
| `warning-soft` | `#FEF3D9` | Latar badge demo |
| `success` | `#047857` | Status selesai/berhasil |
| `success-soft` | `#E7F6EF` | Latar badge sukses |

### 3.2 Aturan pemakaian

- **Latar halaman selalu `canvas`.** Kartu dan header memakai `surface` agar sedikit terangkat. Jangan memakai `#FFFFFF` murni untuk area besar.
- **Teks putih tidak boleh di atas `brand` (`#2B8CFF`)** karena kontrasnya hanya 3,1:1. Tombol dan area berisi teks putih memakai `action`.
- `brand` juga tidak dipakai untuk teks kecil di atas `canvas`. Untuk teks biru, pakai `link`.
- Tautan memakai `link`, digarisbawahi saat hover. Tombol memakai `action`. Keduanya sengaja dibedakan.
- Di pita gelap, aksen memakai `brand-light`.
- Proporsi kasar per halaman: ±85% netral, ±10% biru, ±5% status (merah/kuning/hijau).

### 3.3 Palet grafik (Recharts)

Urutan seri: `#2B8CFF`, `#0F3B6E`, `#8CC8FF`, `#64748B`, `#CBD5E1`.

- Anggaran = `#0F3B6E` (biru tua), realisasi = `#2B8CFF` (biru cerah). Selalu konsisten di semua grafik.
- Grid grafik `#E2E8F0`, sumbu dan label `#5B6576` ukuran 12px.
- Latar area grafik ikut `surface`, bukan putih murni.
- Jangan memakai merah di grafik kecuali menandai proyek red flag.

### 3.4 Implementasi Tailwind v4

Taruh di `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --color-canvas: #F6F8FB;
  --color-surface: #FBFCFE;
  --color-canvas-soft: #EEF2F7;
  --color-canvas-blue: #EAF3FF;
  --color-recessed: #E9EEF4;
  --color-band: #0F3B6E;
  --color-band-deep: #0B2545;

  --color-ink: #1F2937;
  --color-ink-strong: #111827;
  --color-ink-muted: #4B5563;
  --color-ink-subtle: #5B6576;
  --color-on-dark: #FFFFFF;
  --color-on-dark-muted: #C7E2FF;

  --color-brand: #2B8CFF;
  --color-brand-light: #8CC8FF;
  --color-brand-soft: #E6F1FF;
  --color-action: #1673E0;
  --color-action-hover: #0F66CC;
  --color-link: #0B5CCB;

  --color-border-soft: #EDF1F6;
  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  --color-danger: #C81E1E;
  --color-danger-soft: #FDECEC;
  --color-warning: #A15C07;
  --color-warning-soft: #FEF3D9;
  --color-success: #047857;
  --color-success-soft: #E7F6EF;

  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-edge: 0 1px 2px rgb(15 59 110 / 0.06);
  --shadow-card: 0 1px 2px rgb(15 59 110 / 0.05), 0 8px 24px -8px rgb(15 59 110 / 0.10);
  --shadow-pop: 0 12px 32px -8px rgb(15 59 110 / 0.16);

  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-soft: cubic-bezier(0, 0, 0.2, 1);
}

body { @apply bg-canvas text-ink font-sans antialiased; }
```

**Selalu pakai token** (`bg-canvas`, `bg-surface`, `text-ink-muted`, `bg-action`, `border-border`, dst.). Jangan menulis hex langsung di komponen, dan jangan memakai palet bawaan Tailwind (`blue-500`, `gray-600`, `bg-white`) kecuali lewat token di atas.

---

## 4. Tipografi

- **Font:** Inter (open source), dipasang lewat `@fontsource-variable/inter` dan diimpor sekali di `main.tsx`. Tidak ada font kedua.
- **Bobot yang boleh:** 400 (isi), 500 (judul), 600 (judul kecil, label, angka statistik). **Jangan pakai 700 ke atas.**
- **Huruf:** *sentence case* untuk judul dan tombol ("Lihat detail proyek", bukan "Lihat Detail Proyek"). Huruf kapital semua hanya untuk *eyebrow*.
- **Perataan:** rata kiri secara default. Rata tengah hanya untuk hero dan CTA penutup.
- Angka memakai `tabular-nums` di tabel, statistik, dan grafik.

| Peran | Ukuran desktop / ponsel | Bobot | Line height | Tracking | Kelas Tailwind |
| --- | --- | --- | --- | --- | --- |
| Hero | 56 / 36 px | 500 | 1.05 | -0.02em | `text-[36px] md:text-[56px] font-medium leading-[1.05] tracking-[-0.02em]` |
| H1 halaman | 48 / 32 px | 500 | 1.1 | -0.018em | `text-[32px] md:text-[48px] font-medium` |
| H2 section | 40 / 28 px | 500 | 1.12 | -0.015em | `text-[28px] md:text-[40px] font-medium` |
| H3 | 24 / 20 px | 600 | 1.25 | -0.005em | `text-xl md:text-2xl font-semibold` |
| Statistik besar | 48 / 36 px | 600 | 1.0 | -0.02em | `text-[36px] md:text-5xl font-semibold tabular-nums` |
| Body besar | 18 px | 400 | 1.55 | 0 | `text-lg` |
| Body | 16 px | 400 | 1.55 | 0 | `text-base` |
| Body kecil | 14 px | 400 | 1.5 | 0 | `text-sm` |
| Label / tombol | 14–16 px | 500 | 1.4 | 0 | `text-sm font-medium` |
| Caption / sumber | 12 px | 500 | 1.4 | 0.01em | `text-xs font-medium text-ink-subtle` |
| Eyebrow | 12 px | 600 | 1.4 | 0.06em, KAPITAL | `text-xs font-semibold uppercase tracking-[0.06em] text-action` |

Lebar teks paragraf maksimal **720px** (`max-w-[720px]`).

---

## 5. Tata letak dan spasi

- **Satuan dasar 4px.** Skala yang dipakai: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Lebar konten:** maksimal 1280px (`max-w-[1280px] mx-auto`), padding samping 16px di ponsel, 24px di tablet, 32px di desktop.
- **Grid:** 12 kolom dengan jarak 24px di desktop; 1 kolom di ponsel.
- **Jarak section:** 96–128px untuk section utama di desktop, 64px di ponsel. Section sekunder 48–64px.
- **Header:** tinggi 64px, latar `surface`, border bawah 1px `border`, menempel di atas (*sticky*).
- **Breakpoint:** `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Desain dimulai dari ponsel 375px (mobile-first).

### Ritme section

Urutan kecerahan yang dianjurkan untuk halaman panjang:

```
canvas (hero / konten)  →  canvas-soft  →  canvas  →  PITA BIRU TUA (band, statistik/CTA)  →  canvas  →  footer band-deep
```

Pita gelap dipakai **paling banyak dua kali per halaman**. Jangan membuat seluruh halaman gelap.

---

## 6. Radius, border, bayangan

| Elemen | Radius |
| --- | --- |
| Semua tombol | pil penuh (`rounded-full`) |
| Kartu, panel, modal | 12px (`rounded-lg`) |
| Input, select, textarea, blok kode, gambar di kartu | 8px (`rounded-md`) |
| Badge, chip | pil penuh |
| Kode inline, tag kecil | 4px |

- Border default: `1px solid border`. Hover kartu yang bisa diklik: border berubah ke `border-strong` dan bayangan naik dari `shadow-edge` ke `shadow-card`.
- Bayangan selalu tipis. **Jangan pakai `shadow-lg`, `shadow-xl`, gradien, atau efek glassmorphism.**
- Pita gelap tidak memakai bayangan.

---

## 7. Komponen

### 7.1 Tombol

| Varian | Gaya |
| --- | --- |
| Utama | `bg-action text-white rounded-full px-6 py-3 font-medium hover:bg-action-hover` |
| Sekunder | `bg-surface text-ink border border-border-strong rounded-full px-6 py-3 font-medium hover:bg-canvas-soft` |
| Ghost | `text-ink rounded-full px-4 py-2.5 hover:bg-recessed` |
| Di pita gelap | Utama: `bg-surface text-band`; sekunder: `border border-white/40 text-white` |
| Bahaya | `bg-danger text-white rounded-full` — hanya untuk aksi destruktif admin |

- Tinggi minimum 44px (target sentuh).
- Maksimal **satu tombol utama per layar/section**. Pasangannya tombol sekunder.
- Ikon panah kecil `→` boleh di tombol yang mengarah ke halaman lain; ikon `↗` untuk tautan keluar (SiRUP, LPSE, LAPOR!).

### 7.2 Header / navigasi

- Kiri: logo teks "Jejak Anggaran" (500, 18px) dengan ikon sederhana buatan sendiri.
- Tengah/kanan (desktop): Beranda, Peta Proyek, Tentang Data; paling kanan tombol sekunder "Masuk" atau avatar.
- Item aktif: teks `ink-strong` dengan garis bawah 2px `brand`.
- Ponsel: header berisi logo + tombol menu; navigasi utama pindah ke **bottom navigation** (Beranda, Peta, Tentang Data, Akun) setinggi 64px dengan ikon + label 12px.

### 7.3 Hero (Beranda)

- Latar `canvas` atau `canvas-blue`, rata tengah atau rata kiri dengan visual di kanan.
- Susunan: eyebrow (mis. "APBD KOTA BANDUNG 2026") → judul hero → paragraf body besar `ink-muted` (maks. 2 kalimat) → tombol utama "Jelajahi peta proyek" + tombol sekunder "Pelajari datanya".
- Visual hero: pratinjau peta atau kartu proyek tiruan yang rapi, bukan ilustrasi stok.

### 7.4 Pita statistik (gaya "angka besar")

- Latar `band`, teks putih, padding vertikal 96px.
- 3–4 statistik dalam grid. Tiap statistik: angka besar (600, `tabular-nums`), label pendek `on-dark-muted` 14px, lalu `<SumberData variant="dark">`.
- Contoh isi: total APBD, jumlah proyek dipantau, jumlah laporan terverifikasi, jumlah red flag aktif.
- Angka besar diringkas: `Rp 7,1 T`, `Rp 1,2 M`, `320 jt` memakai `formatRupiahRingkas()`.

### 7.5 Kartu

- Default: `bg-surface border border-border rounded-lg p-6`.
- Kartu yang bisa diklik: seluruh kartu adalah tautan, hover → `border-border-strong shadow-card`, transisi 240ms.
- **Kartu proyek:** thumbnail 16:9 (`rounded-md`) → nama paket (H3 kecil, maks. 2 baris) → kecamatan + dinas (`text-sm text-ink-muted`) → baris badge status/red flag/demo → baris pagu dan nilai kontrak (`tabular-nums`) → `<SumberData>`.
- Kartu fitur/penjelasan: ikon garis 24px warna `action` di dalam kotak `brand-soft` 40px `rounded-md`, judul, 1–2 kalimat.

### 7.6 Badge dan chip

Semua `rounded-full px-2.5 py-0.5 text-xs font-semibold`.

| Badge | Gaya |
| --- | --- |
| Status proyek (direncanakan/berjalan) | `bg-recessed text-ink-muted` |
| Status selesai | `bg-success-soft text-success` |
| **Red flag** (`BadgeRedFlag`) | `bg-danger-soft text-danger` + ikon bendera kecil; teks "Perlu perhatian" |
| Status laporan aktif | `bg-brand-soft text-link` |
| Chip filter aktif | `bg-action text-white`; tidak aktif: `bg-surface border border-border text-ink` |

### 7.7 `SumberData`

- Satu baris kecil: ikon dokumen 12px + "Sumber: DJPK Kemenkeu · diakses 12 Okt 2026" + ikon `↗`.
- Gaya: `text-xs font-medium text-ink-subtle`, nama sumber adalah tautan `text-link hover:underline`.
- Diletakkan tepat di bawah angka/grafik yang dirujuk, dipisah garis putus-putus `border-t border-dashed border-border pt-2 mt-3` bila di dalam kartu.
- Varian gelap (`variant="dark"`) memakai `text-on-dark-muted`, tautan `text-brand-light`.

### 7.8 Form dan input

- Input: `bg-surface border border-border rounded-md px-3.5 py-2.5 text-base`; hover `border-border-strong`; fokus `border-brand outline-none ring-2 ring-brand/30`.
- Label di atas field, 14px 500. Penanda wajib `*` warna `ink-subtle`.
- Pesan galat di bawah field: `text-sm text-danger` dengan ikon.
- Area unggah foto: kotak border putus-putus `border-border-strong rounded-lg`, latar `canvas-soft`, ikon kamera, teks "Ambil foto atau pilih dari galeri (maks. 5 MB)". Saat ada file: pratinjau 4:3 dengan tombol hapus.
- Kotak privasi di form lapor: latar `canvas-blue`, ikon gembok, teks `text-sm text-ink-muted`.

### 7.9 Tabel

- Header: `bg-canvas-soft text-xs font-semibold uppercase tracking-[0.04em] text-ink-muted`, border bawah 1px.
- Baris: padding 12px 16px, border bawah `border-soft`, hover `bg-brand-soft/60`.
- Kolom angka rata kanan dengan `tabular-nums`.
- Di ponsel, tabel lebar berubah menjadi daftar kartu, bukan scroll horizontal.

### 7.10 Peta (Leaflet)

- Tile OpenStreetMap standar dengan filter CSS lembut pada layer tile: `filter: saturate(0.6) brightness(1.03)` agar pin lebih menonjol.
- Pin proyek biasa: teardrop `brand` dengan titik putih. Pin red flag: `danger`, sedikit lebih besar. Pin terpilih: border putih 3px + `shadow-pop`.
- Kontrol zoom dan tombol "Peta | Daftar" bergaya tombol sekunder bulat.
- Popup/kartu proyek di peta memakai gaya kartu §7.5, di ponsel muncul sebagai *bottom sheet* `rounded-t-xl`.
- Peta selalu `rounded-lg border border-border`, tinggi 60vh di desktop dan 50vh di ponsel.

### 7.11 Grafik (Recharts)

- Bar: sudut atas `radius={[4,4,0,0]}`, lebar maksimum 40px.
- Garis: `strokeWidth={2}`, tanpa titik kecuali saat hover.
- Tooltip: kartu `surface` `rounded-md border border-border shadow-pop` dengan angka `tabular-nums`.
- Legenda di atas grafik, rata kiri, 12px.
- Setiap grafik punya judul yang menyatakan temuan ("Belanja pendidikan terbesar di 2026"), bukan sekadar topik.

### 7.12 Linimasa status dan foto

- **Status:** titik 10px tersambung garis 2px horizontal (ponsel boleh vertikal). Tahap selesai = titik `action` terisi; tahap saat ini = cincin `brand` dengan isi `surface`; tahap belum = titik `border-strong`. Di bawah titik: nama tahap + tanggal 12px.
- **Foto:** strip gulir horizontal, thumbnail 4:3 `rounded-md`, caption 12px berisi jenis foto ("Klaim selesai", "Foto warga") dan tanggal. Foto klaim pemerintah diberi border `border-strong`; foto warga tanpa border.

### 7.13 State memuat, kosong, galat

- **Memuat:** skeleton `bg-recessed` dengan animasi pulse halus, bentuknya mengikuti konten asli.
- **Kosong:** ikon garis 40px `ink-subtle`, judul 16px 500, satu kalimat penjelas, dan satu tombol aksi. Rata tengah di dalam kartu.
- **Galat:** kotak `bg-danger-soft border border-danger/20 rounded-lg p-4`, pesan bahasa Indonesia, tombol sekunder "Coba lagi".

### 7.14 CTA penutup dan footer

- **CTA penutup:** pita `band`, judul H2 putih rata tengah, satu kalimat `on-dark-muted`, tombol `surface` + tombol outline putih.
- **Footer:** latar `band-deep`, teks `on-dark-muted` 14px, 3–4 kolom tautan (Jelajahi, Data, Tentang, Kontak), baris bawah berisi hak cipta + "Dibuat untuk WIA MIA 2026" dipisah garis `white/10`.

---

## 8. Pola per halaman

| Halaman | Struktur |
| --- | --- |
| **Beranda** | Hero → pita statistik (`band`) → grafik belanja per urusan + tren (2 kolom desktop) → "Proyek perlu perhatian" (grid kartu, 3 kolom desktop) → "Cara kerja Jejak Anggaran" (3 kartu langkah bernomor) → CTA penutup → footer |
| **Peta Proyek** | Header halaman ringkas → bar pencarian + chip filter → desktop: peta kiri 2/3 + daftar kartu kanan 1/3 yang tersinkron; ponsel: peta penuh + bottom sheet |
| **Detail Proyek** | Breadcrumb → judul + badge → grid 2 kolom desktop: kiri (data anggaran, linimasa foto, laporan warga), kanan *sticky* (ringkasan angka + tombol "Laporkan kondisi" + "Teruskan ke LAPOR! ↗"); ponsel: satu kolom, tombol aksi menempel di bawah |
| **Form Lapor** | Satu kolom maks. 560px, kartu ringkasan proyek di atas, field berurutan, kotak privasi, tombol kirim lebar penuh di ponsel |
| **Tentang Data** | Gaya dokumentasi: teks maks. 720px, daftar isi menempel di kiri (desktop), tabel sumber data, kotak aturan red flag dengan border kiri 4px `brand` |
| **Panel Admin** | Header + tabel antrean dengan filter status; detail laporan dalam panel samping; tombol ubah status memakai varian utama, tolak memakai varian bahaya |

---

## 9. Ikon dan gambar

- Ikon garis (*outline*) dengan stroke 1.5px, ukuran 16/20/24px. Gunakan **lucide-react** dan jangan campur dengan set ikon lain.
- Warna ikon mengikuti teks di sekitarnya; ikon aksen memakai `action`.
- Tidak ada emoji di UI.
- Foto proyek: rasio 16:9 di kartu dan 4:3 di linimasa, `object-cover`, selalu dengan `alt` yang menjelaskan isi foto.
- Tidak memakai ilustrasi 3D, gradien warna-warni, atau foto stok orang tersenyum.

---

## 10. Gerak (motion)

- Easing standar `var(--ease-standard)`; elemen yang muncul `var(--ease-out-soft)`.
- Durasi: 150ms (hover kecil), 240ms (hover kartu/tombol, transisi warna), 320ms (muncul saat scroll, bottom sheet).
- Animasi muncul saat scroll: `opacity 0 → 1` dan `translateY(8px) → 0`, sekali saja.
- Hormati `prefers-reduced-motion`: matikan transform, durasi menjadi ≤ 100ms.
- Tidak ada animasi berulang (*looping*) selain skeleton loading.

---

## 11. Aksesibilitas

- Kontras minimum 4,5:1 untuk teks normal (semua kombinasi token di §3 sudah memenuhi bila dipakai sesuai aturan).
- Cincin fokus di semua elemen interaktif: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`. Jangan pernah menghapus outline tanpa pengganti.
- Target sentuh minimal 44×44px.
- Informasi tidak boleh hanya disampaikan lewat warna: red flag selalu disertai ikon dan teks "Perlu perhatian".
- Peta selalu punya alternatif daftar proyek yang bisa dibaca pembaca layar.
- Grafik punya ringkasan teks (`aria-label` atau paragraf di bawahnya) dan data aslinya bisa dibuka sebagai tabel.

---

## 12. Gaya bahasa UI

- Bahasa Indonesia baku tapi santai, kalimat pendek, sapaan "Anda".
- Tombol berupa kata kerja: "Lihat detail proyek", "Laporkan kondisi", "Kirim laporan".
- Hindari tanda seru dan istilah teknis tanpa penjelasan ("pagu" diberi tooltip "batas anggaran yang direncanakan").
- Red flag ditulis netral: "Perlu perhatian: 3 laporan kerusakan terverifikasi dalam 90 hari", **bukan** "Dugaan korupsi".

---

## 13. Jangan

- Jangan memakai oranye, ungu, atau gradien sebagai aksen.
- Jangan memakai putih murni `#FFFFFF` (`bg-white`) untuk latar halaman atau section besar.
- Jangan memakai biru untuk teks paragraf atau latar section terang yang luas.
- Jangan memakai teks putih di atas `brand` (`#2B8CFF`), dan jangan memakai biru tua/navy sebagai warna aksi utama.
- Jangan memakai font weight 700/800, font serif, atau font kedua.
- Jangan membuat tombol bersudut tajam atau berbayangan tebal.
- Jangan menampilkan angka anggaran tanpa `<SumberData>`.
- Jangan menampilkan data demo tanpa catatan global data demo (di footer, lewat `useAdaDataDemo`). Tidak ada badge demo per item.
- Jangan meniru logo, ilustrasi, atau teks milik Cloudflare.

---

## 14. Checklist sebelum menyelesaikan tugas UI

- [ ] Hanya memakai token warna dari §3, tanpa hex, `bg-white`, atau warna Tailwind bawaan di komponen.
- [ ] Latar halaman `canvas`, kartu `surface`.
- [ ] Tipografi sesuai tabel §4, tanpa bobot 700+.
- [ ] Tombol berbentuk pil, maksimal satu tombol utama per section.
- [ ] Setiap angka anggaran/pagu/kontrak nyata punya `<SumberData>`; data demo dimuat lewat service yang memanggil `tandaiDataDemo()`.
- [ ] Ada state memuat, kosong, dan galat.
- [ ] Dicek di lebar 375px, 768px, dan 1280px tanpa scroll horizontal.
- [ ] Fokus keyboard terlihat di semua elemen interaktif.
- [ ] `npm run lint` dan `npm run typecheck` lulus.
