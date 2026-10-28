-- HASIL GENERATE oleh `npm run data:seed` dari data/raw/*.csv. JANGAN DIEDIT MANUAL.
-- Aman dijalankan berulang: data resmi di-upsert, hanya laporan demo (is_demo) yang dihapus lalu dibuat ulang.
-- Laporan warga sungguhan tidak pernah disentuh.

begin;

-- sumber_data
-- (belum ada sumber data anggaran)

-- anggaran_daerah
-- (belum ada data anggaran_daerah)

-- proyek
insert into public.proyek (id, kode_rup, nama_paket, satker, kecamatan, kelurahan, pagu, nilai_kontrak, pelaksana, tahun_anggaran, status_proyek, lat, lng, sumber_rup_url, sumber_lpse_url, diakses_pada, is_demo, foto_path) values
  ('demo-jalan-lingkungan', null, 'Proyek Demo: Rehabilitasi Jalan Lingkungan (fiktif)', 'Satker Demo (fiktif)', 'Coblong', null, 1250000000, 1180000000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.8935, 107.613, null, null, null, true, null),
  ('demo-saluran-drainase', null, 'Proyek Demo: Pembangunan Saluran Drainase (fiktif)', 'Satker Demo (fiktif)', 'Kiaracondong', null, 870000000, 812500000, 'CV Contoh Demo (fiktif)', 2026, 'berjalan', -6.9225, 107.642, null, null, null, true, null),
  ('demo-taman-kelurahan', null, 'Proyek Demo: Penataan Taman Kelurahan (fiktif)', 'Satker Demo (fiktif)', 'Buahbatu', null, 450000000, null, null, 2026, 'direncanakan', -6.948, 107.653, null, null, null, true, null),
  ('demo-trotoar-pejalan-kaki', null, 'Proyek Demo: Penataan Trotoar dan Jalur Pejalan Kaki (fiktif)', 'Satker Demo (fiktif)', 'Bandung Wetan', null, 2150000000, 1985000000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.905, 107.615, null, null, null, true, null),
  ('demo-gorong-gorong', null, 'Proyek Demo: Perbaikan Gorong-Gorong Permukiman (fiktif)', 'Satker Demo (fiktif)', 'Babakan Ciparay', null, 640000000, 598750000, 'CV Contoh Demo (fiktif)', 2025, 'selesai', -6.94, 107.58, null, null, null, true, null),
  ('demo-jembatan-penyeberangan', null, 'Proyek Demo: Rehabilitasi Jembatan Penyeberangan Orang (fiktif)', 'Satker Demo (fiktif)', 'Sumur Bandung', null, 1780000000, 1690000000, 'CV Contoh Demo (fiktif)', 2026, 'berjalan', -6.917, 107.608, null, null, null, true, null),
  ('demo-penerangan-jalan', null, 'Proyek Demo: Pemasangan Lampu Penerangan Jalan Umum (fiktif)', 'Satker Demo (fiktif)', 'Antapani', null, 520000000, 487300000, 'CV Contoh Demo (fiktif)', 2026, 'berjalan', -6.913, 107.66, null, null, null, true, null),
  ('demo-ruang-terbuka-hijau', null, 'Proyek Demo: Pembangunan Ruang Terbuka Hijau Kecamatan (fiktif)', 'Satker Demo (fiktif)', 'Cibiru', null, 950000000, null, null, 2026, 'direncanakan', -6.918, 107.72, null, null, null, true, null),
  ('demo-gedung-posyandu', null, 'Proyek Demo: Renovasi Gedung Posyandu (fiktif)', 'Satker Demo (fiktif)', 'Sukajadi', null, 380000000, null, null, 2026, 'direncanakan', -6.89, 107.59, null, null, null, true, null)
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

commit;
