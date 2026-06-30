import Badge from './Badge'
import { ESTADO_COLOR, ESTADO_LABEL } from '@/constants/estados'

// StatusBadge resuelve variant y label a partir de cualquier enum de estado
// definido en CONTRACT.md §2.8. Es el componente canónico para mostrar estados
// de certificación, citas y pagos — no usar Badge directamente para eso.
export default function StatusBadge({ estado, size = 'md', className }) {
  const variant = ESTADO_COLOR[estado] ?? 'neutral'
  const label   = ESTADO_LABEL[estado] ?? estado

  return (
    <Badge variant={variant} size={size} dot className={className}>
      {label}
    </Badge>
  )
}
