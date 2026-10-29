-- Menyamakan aturan database dengan validasi di UI (src/utils/schemas.ts),
-- supaya aturan tetap berlaku untuk permintaan yang tidak lewat aplikasi.

-- Laporan yang ditolak tidak bisa dikonfirmasi (UI sudah menonaktifkan tombolnya).
create function public.laporan_bisa_dikonfirmasi(id_laporan uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.laporan
    where id = id_laporan and status <> 'ditolak'
  );
$$;

drop policy "konfirmasi_insert_warga" on public.konfirmasi;
create policy "konfirmasi_insert_warga" on public.konfirmasi
  for insert to authenticated
  with check (
    warga_id = (select auth.uid())
    and not public.adalah_pelapor(laporan_id)
    and public.laporan_bisa_dikonfirmasi(laporan_id)
  );

-- Nilai kontrak data nyata wajib punya sumber LPSE (sebelumnya hanya dicek scripts/seedLib.ts).
alter table public.proyek
  add constraint proyek_sumber_lpse_wajib
  check (is_demo or nilai_kontrak is null or sumber_lpse_url is not null);

-- Penolakan wajib disertai alasan. Harus sinkron dengan ALASAN_TOLAK_MIN di src/utils/schemas.ts.
-- coalesce: CHECK yang bernilai null dianggap lolos, jadi catatan kosong harus jadi ''.
-- not valid: baris lama tidak diperiksa ulang, baris baru dan perubahan tetap diperiksa.
alter table public.laporan
  add constraint laporan_alasan_tolak_wajib
  check (status <> 'ditolak' or is_demo or char_length(btrim(coalesce(catatan_status, ''))) >= 10)
  not valid;

-- UUID admin di riwayat_status tidak perlu terbuka ke publik. Publik cukup tahu
-- apakah perubahan dilakukan admin, lewat kolom turunan oleh_admin.
alter table public.riwayat_status
  add column oleh_admin boolean generated always as (diubah_oleh is not null) stored not null;

revoke select on public.riwayat_status from anon, authenticated;
grant select (id, laporan_id, status_lama, status_baru, catatan, created_at, oleh_admin)
  on public.riwayat_status to anon, authenticated;
