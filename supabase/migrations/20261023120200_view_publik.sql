-- View yang dibaca halaman publik. View berjalan dengan hak pemiliknya
-- sehingga bisa membaca laporan tanpa membuka kolom pelapor_id.

create view public.v_laporan_publik as
select
  l.id,
  l.proyek_id,
  l.kategori,
  l.deskripsi,
  l.foto_path,
  l.status,
  l.catatan_status,
  l.is_demo,
  l.created_at,
  l.updated_at,
  (select count(*) from public.konfirmasi k where k.laporan_id = l.id)::integer as jumlah_konfirmasi
from public.laporan l;

-- Aturan red flag (F7). HARUS sinkron dengan src/lib/redFlag.ts:
--   status proyek    : selesai
--   kategori laporan : kerusakan
--   status laporan   : diverifikasi, ditindaklanjuti, selesai
--   jendela waktu    : 90 hari terakhir
--   ambang           : >= 3 laporan
create view public.v_red_flag_proyek as
select
  p.id as proyek_id,
  count(l.id)::integer as jumlah_laporan,
  format(
    'Proyek tercatat selesai, tetapi ada %s laporan kerusakan yang sudah diverifikasi dalam 90 hari terakhir (ambang: 3 laporan).',
    count(l.id)
  ) as alasan
from public.proyek p
join public.laporan l on l.proyek_id = p.id
where p.status_proyek = 'selesai'
  and l.kategori = 'kerusakan'
  and l.status in ('diverifikasi', 'ditindaklanjuti', 'selesai')
  and l.created_at >= now() - interval '90 days'
group by p.id
having count(l.id) >= 3;
