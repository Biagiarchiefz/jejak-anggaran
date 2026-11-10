-- HASIL GENERATE oleh `npm run data:seed` dari data/raw/*.csv. JANGAN DIEDIT MANUAL.
-- Aman dijalankan berulang: data resmi di-upsert, hanya laporan demo (is_demo) yang dihapus lalu dibuat ulang.
-- Laporan warga sungguhan tidak pernah disentuh.

begin;

-- sumber_data
insert into public.sumber_data (nama, url, diakses_pada) values
  ('DJPK Kemenkeu: Data APBD (anggaran dan realisasi belanja per fungsi)', 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10')
on conflict (url, diakses_pada) do update set nama = excluded.nama;

-- anggaran_daerah
insert into public.anggaran_daerah (tahun, urusan, anggaran, realisasi, sumber_id)
select v.tahun, v.urusan, v.anggaran, v.realisasi, s.id
from (values
  (2023::smallint, 'Pelayanan Umum', 2080028477840::bigint, 1866462195785::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Pendidikan', 1916131884878::bigint, 1917331794161::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Kesehatan', 1445215614132::bigint, 1393039784119::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Ekonomi', 742861109992::bigint, 686235040548::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Perumahan dan Fasilitas Umum', 416065080710::bigint, 380766664577::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Perlindungan Lingkungan Hidup', 357631825938::bigint, 283165764971::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Ketertiban dan Keamanan', 152935838195::bigint, 137383321224::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Perlindungan Sosial', 71110425055::bigint, 62249781846::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2023::smallint, 'Pariwisata', 20876733815::bigint, 19409049547::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Pelayanan Umum', 2106446337369::bigint, 1808999976461::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Pendidikan', 1828916526020::bigint, 1850471261043::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Kesehatan', 1723823981893::bigint, 1640838980435::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Ekonomi', 910371931736::bigint, 809624351729::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Perlindungan Lingkungan Hidup', 453489486292::bigint, 331057171067::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Perumahan dan Fasilitas Umum', 428953367702::bigint, 398642956417::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Ketertiban dan Keamanan', 153959330779::bigint, 143567235114::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Perlindungan Sosial', 82412845509::bigint, 76020347158::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2024::smallint, 'Pariwisata', 11042749275::bigint, 7989329112::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Pelayanan Umum', 2088023780625::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Pendidikan', 2028648880441::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Kesehatan', 1602907720666::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Ekonomi', 944217687772::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Perlindungan Lingkungan Hidup', 459603090351::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Perumahan dan Fasilitas Umum', 409005005580::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Ketertiban dan Keamanan', 172788575624::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Perlindungan Sosial', 89576794292::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2025::smallint, 'Pariwisata', 14620411819::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Pendidikan', 1922731630624::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Pelayanan Umum', 1914261008696::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Kesehatan', 1535319905765::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Ekonomi', 1181891257033::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Perlindungan Lingkungan Hidup', 397691840492::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Perumahan dan Fasilitas Umum', 381694206587::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Ketertiban dan Keamanan', 183514777102::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Perlindungan Sosial', 80424904694::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date),
  (2026::smallint, 'Pariwisata', 12691244634::bigint, null::bigint, 'https://djpk.kemenkeu.go.id/?p=5412', '2026-11-10'::date)
) as v (tahun, urusan, anggaran, realisasi, url, diakses_pada)
join public.sumber_data s on s.url = v.url and s.diakses_pada = v.diakses_pada
on conflict (tahun, urusan) do update set
  anggaran = excluded.anggaran, realisasi = excluded.realisasi, sumber_id = excluded.sumber_id;

-- proyek
insert into public.proyek (id, kode_rup, nama_paket, satker, kecamatan, kelurahan, pagu, nilai_kontrak, pelaksana, tahun_anggaran, status_proyek, lat, lng, sumber_rup_url, sumber_lpse_url, diakses_pada, is_demo, foto_path) values
  ('demo-jalan-lingkungan', null, 'Proyek Demo: Rehabilitasi Jalan Lingkungan (fiktif)', 'Satker Demo (fiktif)', 'Coblong', null, 1250000000, 1180000000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.8935, 107.613, null, null, null, true, null),
  ('demo-saluran-drainase', null, 'Proyek Demo: Pembangunan Saluran Drainase (fiktif)', 'Satker Demo (fiktif)', 'Kiaracondong', null, 870000000, 812500000, 'CV Contoh Demo (fiktif)', 2026, 'berjalan', -6.9225, 107.642, null, null, null, true, null),
  ('demo-trotoar-pejalan-kaki', null, 'Proyek Demo: Penataan Trotoar dan Jalur Pejalan Kaki (fiktif)', 'Satker Demo (fiktif)', 'Bandung Wetan', null, 2150000000, 1985000000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.905, 107.615, null, null, null, true, null),
  ('demo-gorong-gorong', null, 'Proyek Demo: Perbaikan Gorong-Gorong Permukiman (fiktif)', 'Satker Demo (fiktif)', 'Babakan Ciparay', null, 640000000, 598750000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.94, 107.58, null, null, null, true, null),
  ('taman-alun-alun-bandung-tahap-2', '59722398', 'Penataan Taman Alun-alun Bandung Tahap 2', 'Dinas Perumahan dan Kawasan Permukiman', 'Regol', 'Balonggede', 4411467450, null, null, 2025, 'selesai', -6.92129, 107.60715, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=59722398', null, '2026-11-10'::date, false, null),
  ('drainase-pamoyanan-rw03-04', '55998650', 'DAU - Drainase Lingkungan (u-ditch 40x50+penutup) RW 03 & 04 Kel.Pamoyanan', 'Kecamatan Cicendo', 'Cicendo', 'Pamoyanan', 105561000, null, null, 2025, 'selesai', -6.90416, 107.59213, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=55998650', null, '2026-11-10'::date, false, null),
  ('drainase-sukahaji-rw02', '55976458', 'Pembangunan Drainase Lingkungan RW 02', 'Kecamatan Babakan Ciparay', 'Babakan Ciparay', 'Sukahaji', 39641800, null, null, 2025, 'selesai', -6.9336, 107.58325, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=55976458', null, '2026-11-10'::date, false, null),
  ('drainase-cigending-rw10', '60714433', 'Pembangunan Drainase Lingkungan #PRAKARSA RW 10 Kelurahan Cigending', 'Kecamatan Ujungberung', 'Ujungberung', 'Cigending', 45144309, null, null, 2025, 'selesai', -6.90958, 107.70007, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=60714433', null, '2026-11-10'::date, false, null),
  ('drainase-antapani-tengah', '60757847', '(DAU) Belanja Pemeliharaan Drainase Saluran Batu Kali Kelurahan Antapani Tengah', 'Kecamatan Antapani', 'Antapani', 'Antapani Tengah', 64915399, null, null, 2025, 'selesai', -6.91728, 107.66494, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=60757847', null, '2026-11-10'::date, false, null),
  ('taman-panjunan-rw05', '59791480', 'Pembangunan Taman RW.05 Kel. Panjunan Kec. Astana Anyar', 'Dinas Perumahan dan Kawasan Permukiman', 'Astanaanyar', 'Panjunan', 99134100, null, null, 2025, 'selesai', -6.92977, 107.598, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=59791480', null, '2026-11-10'::date, false, null),
  ('hotmix-mengger-rw02', '54137652', 'Belanja DAU Hotmix RW 02 Kelurahan Mengger', 'Kecamatan Bandung Kidul', 'Bandung Kidul', 'Mengger', 26088400, null, null, 2025, 'selesai', -6.96246, 107.63547, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=54137652', null, '2026-11-10'::date, false, null),
  ('tpt-tamansari', '54986602', 'PEMBUATAN TPT TAMANSARI', 'Kecamatan Bandung Wetan', 'Bandung Wetan', 'Tamansari', 87484204, null, null, 2025, 'selesai', -6.90385, 107.60748, 'https://sirup.inaproc.id/sirup/rup/detailPaketPenyedia2020?idPaket=54986602', null, '2026-11-10'::date, false, null)
on conflict (id) do update set
  kode_rup = excluded.kode_rup,
  nama_paket = excluded.nama_paket,
  satker = excluded.satker,
  kecamatan = excluded.kecamatan,
  kelurahan = excluded.kelurahan,
  pagu = excluded.pagu,
  nilai_kontrak = excluded.nilai_kontrak,
  pelaksana = excluded.pelaksana,
  tahun_anggaran = excluded.tahun_anggaran,
  status_proyek = excluded.status_proyek,
  lat = excluded.lat,
  lng = excluded.lng,
  sumber_rup_url = excluded.sumber_rup_url,
  sumber_lpse_url = excluded.sumber_lpse_url,
  diakses_pada = excluded.diakses_pada,
  is_demo = excluded.is_demo,
  foto_path = excluded.foto_path;

-- laporan demo (hanya pada proyek is_demo = true)
delete from public.laporan where is_demo;
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-jalan-lingkungan', 'kerusakan', '(Contoh demo) Aspal di dekat persimpangan sudah berlubang di beberapa titik, padahal proyek tercatat selesai.', null, 'ditindaklanjuti', 'Diteruskan ke satker terkait (simulasi).', true, now() - interval '40 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days'),
    ('diverifikasi'::public.status_laporan, 'ditindaklanjuti'::public.status_laporan, 'Diteruskan ke satker terkait (simulasi).', interval '2 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-jalan-lingkungan', 'kerusakan', '(Contoh demo) Permukaan jalan retak memanjang sekitar 10 meter dan mulai mengelupas di bagian tepi.', null, 'diverifikasi', null, true, now() - interval '25 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-jalan-lingkungan', 'kerusakan', '(Contoh demo) Genangan air muncul setiap hujan karena permukaan jalan amblas di tengah ruas.', null, 'diverifikasi', null, true, now() - interval '12 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-jalan-lingkungan', 'kerusakan', '(Contoh demo) Ada lubang baru di depan gang, cukup dalam dan berbahaya bagi pengendara motor.', null, 'diterima', null, true, now() - interval '3 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-saluran-drainase', 'belum_dikerjakan', '(Contoh demo) Sudah dua bulan tidak terlihat aktivitas pekerjaan di lokasi saluran ini.', null, 'ditolak', 'Pekerjaan dijadwalkan ulang sesuai kontrak (simulasi).', true, now() - interval '20 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'ditolak'::public.status_laporan, 'Pekerjaan dijadwalkan ulang sesuai kontrak (simulasi).', interval '1 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-gorong-gorong', 'kerusakan', '(Contoh demo) Gorong-gorong tersumbat dan air meluap ke jalan setiap hujan deras, padahal proyek tercatat selesai.', null, 'diverifikasi', null, true, now() - interval '30 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-gorong-gorong', 'kerusakan', '(Contoh demo) Tutup gorong-gorong di mulut gang patah sehingga berbahaya bagi pejalan kaki.', null, 'diverifikasi', null, true, now() - interval '18 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-gorong-gorong', 'kerusakan', '(Contoh demo) Dinding saluran retak dan sebagian runtuh ke dalam gorong-gorong.', null, 'ditindaklanjuti', 'Diteruskan ke satker terkait (simulasi).', true, now() - interval '9 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days'),
    ('diterima'::public.status_laporan, 'diverifikasi'::public.status_laporan, 'Laporan diverifikasi admin (simulasi).', interval '1 days'),
    ('diverifikasi'::public.status_laporan, 'ditindaklanjuti'::public.status_laporan, 'Diteruskan ke satker terkait (simulasi).', interval '2 days')
  ) as r (status_lama, status_baru, catatan, jeda);
with baru as (
  insert into public.laporan (proyek_id, kategori, deskripsi, foto_path, status, catatan_status, is_demo, created_at)
  values ('demo-trotoar-pejalan-kaki', 'kerusakan', '(Contoh demo) Satu ubin pemandu tunanetra terlepas di dekat halte.', null, 'diterima', null, true, now() - interval '5 days')
  returning id, created_at
)
insert into public.riwayat_status (laporan_id, status_lama, status_baru, catatan, created_at)
select baru.id, r.status_lama, r.status_baru, r.catatan, least(now(), baru.created_at + r.jeda)
from baru cross join (values
    (null::public.status_laporan, 'diterima'::public.status_laporan, 'Laporan diterima sistem', interval '0 days')
  ) as r (status_lama, status_baru, catatan, jeda);

-- proyek demo yang sudah dikeluarkan dari proyek.csv. Dilewati bila masih punya laporan warga
-- sungguhan (hapus proyek = cascade ke laporannya), agar laporan nyata tidak pernah ikut terhapus.
delete from public.proyek p
where p.is_demo
  and p.id not in ('demo-jalan-lingkungan', 'demo-saluran-drainase', 'demo-trotoar-pejalan-kaki', 'demo-gorong-gorong')
  and not exists (select 1 from public.laporan l where l.proyek_id = p.id and not l.is_demo);

commit;
