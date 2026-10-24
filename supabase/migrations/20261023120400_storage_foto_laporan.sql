-- Bucket foto laporan warga. Foto sudah dikompres ke WebP (maks 5 MB) di klien.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-laporan', 'foto-laporan', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "foto_laporan_baca_publik" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'foto-laporan');

-- Warga hanya boleh mengunggah ke folder {auth.uid()}/.
create policy "foto_laporan_upload_warga" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'foto-laporan'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Dipakai service untuk menghapus foto yatim jika insert laporan gagal.
create policy "foto_laporan_hapus_milik_sendiri" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'foto-laporan'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
