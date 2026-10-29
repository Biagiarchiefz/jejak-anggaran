import { Flag } from 'lucide-react'
import { Badge } from './Badge'

export function IkonBendera({ className }: { className?: string }) {
  return <Flag className={className ?? 'size-3.5'} strokeWidth={1.5} aria-hidden />
}

/** Red flag hanya berarti "perlu perhatian", bukan tuduhan. Selalu ikon + teks, tidak hanya warna. */
export function BadgeRedFlag({ alasan, ringkas }: { alasan?: string; ringkas?: boolean }) {
  return (
    <Badge nada="bahaya" title={alasan} ringkas={ringkas}>
      <IkonBendera className={ringkas ? 'size-3' : undefined} />
      Perlu perhatian
    </Badge>
  )
}
