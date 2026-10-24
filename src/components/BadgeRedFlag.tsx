import { Badge } from './ui/Badge'

export function IkonBendera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className ?? 'size-3.5'} aria-hidden>
      <path d="M3 1.75a.75.75 0 0 1 1.5 0V2h7.69a.75.75 0 0 1 .6 1.2L11.1 5.5l1.69 2.3a.75.75 0 0 1-.6 1.2H4.5v5.25a.75.75 0 0 1-1.5 0V1.75Z" />
    </svg>
  )
}

/** Red flag hanya berarti "perlu perhatian", bukan tuduhan. */
export function BadgeRedFlag({ alasan }: { alasan?: string }) {
  return (
    <Badge nada="bahaya" title={alasan}>
      <IkonBendera />
      Perlu perhatian
    </Badge>
  )
}
