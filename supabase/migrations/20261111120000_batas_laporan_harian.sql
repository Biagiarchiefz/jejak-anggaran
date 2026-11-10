-- Anti-spam laporan warga: per akun maksimal 5 laporan dalam 24 jam terakhir,
-- dan maksimal 1 laporan untuk proyek yang sama dalam 24 jam terakhir.
-- Laporan demo dan laporan yang ditolak tidak dihitung.
-- Harus sinkron dengan LAPORAN_PER_HARI dan LAPORAN_PER_PROYEK_PER_HARI di src/utils/batasLaporan.ts
-- (dijaga scripts/sinkronAturan.test.ts). Pesan galat 'batas_laporan_harian' / 'batas_laporan_proyek'
-- diterjemahkan ke bahasa Indonesia oleh src/services/laporanService.ts.

-- Hitungan per pelapor dalam jendela waktu tetap cepat walau laporan bertambah.
create index if not exists laporan_pelapor_created_at_idx
  on public.laporan (pelapor_id, created_at desc);

create function public.laporan_batas_harian()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  jumlah_harian integer;
  jumlah_proyek integer;
begin
  if new.is_demo or new.pelapor_id is null then
    return new;
  end if;

  -- Kunci per pelapor sampai transaksi selesai, agar dua kiriman bersamaan tidak sama-sama lolos hitungan.
  perform pg_advisory_xact_lock(hashtextextended(new.pelapor_id::text, 0));

  select count(*), count(*) filter (where proyek_id = new.proyek_id)
    into jumlah_harian, jumlah_proyek
  from public.laporan
  where pelapor_id = new.pelapor_id
    and not is_demo
    and status <> 'ditolak'
    and created_at > now() - interval '24 hours';

  if jumlah_harian >= 5 then
    raise exception 'batas_laporan_harian' using errcode = 'check_violation';
  end if;
  if jumlah_proyek >= 1 then
    raise exception 'batas_laporan_proyek' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- Nama diawali "laporan_batas" agar berjalan sebelum trigger laporan_sebelum_insert (urutan abjad).
create trigger laporan_batas_harian
  before insert on public.laporan
  for each row execute function public.laporan_batas_harian();
