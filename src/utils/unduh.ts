/**
 * Unduh teks sebagai berkas lewat tautan sementara (tanpa server, tanpa pustaka).
 * Efek samping DOM, jadi tidak diuji unit; isi berkasnya disusun oleh fungsi murni di utils/csv dan utils/rapor.
 */
export function unduhBerkas(namaBerkas: string, isi: string, tipe = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }))
  const a = document.createElement('a')
  a.href = url
  a.download = namaBerkas
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
