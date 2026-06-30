import { cn } from '@/lib/cn'

const COLOR_MAP = {
  blue: 'bg-primary/10 text-primary',
  green: 'bg-success/10 text-success',
  yellow: 'bg-amber-100 text-amber-600',
  red: 'bg-danger/10 text-danger',
  purple: 'bg-purple-100 text-purple-600',
  gray: 'bg-slate-100 text-slate-500',
  teal: 'bg-teal-100 text-teal-600',
}

// Scaffold visual para páginas en construcción.
// Acepta cualquier icono de lucide-react como componente.
export default function PlaceholderPage({
  Icon,
  title = 'Sección',
  description = '',
  color = 'blue',
}) {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      {Icon && (
        <div className={cn('grid h-20 w-20 place-items-center rounded-3xl', COLOR_MAP[color])}>
          <Icon size={38} strokeWidth={1.4} />
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <span className="rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-400">
        En construcción · próxima fase
      </span>
      {/* Skeleton hint */}
      <div className="mt-2 w-full max-w-xs space-y-2.5">
        {[48, 64, 48].map((h, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-slate-100"
            style={{ height: h, opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
