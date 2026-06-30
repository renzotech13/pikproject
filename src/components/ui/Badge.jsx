import { cn } from '@/lib/cn'

// Colores: para warning e info se usan tonos más oscuros para garantizar
// contraste AA sobre fondos claros (ver CONTRACT.md §6).
const VARIANTS = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-success/10 text-success',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-danger/10 text-danger',
  info:    'bg-sky-100 text-sky-700',
  primary: 'bg-primary/10 text-primary',
}

const SIZES = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
  ...rest
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
