import { Badge } from './ui/Badge'

/** Label wajib untuk setiap baris `is_demo = true`. */
export function BadgeDemo({ className }: { className?: string }) {
  return (
    <Badge nada="peringatan" className={className} title="Data simulasi untuk demo, bukan data resmi atau laporan warga sungguhan.">
      Data demo
    </Badge>
  )
}
