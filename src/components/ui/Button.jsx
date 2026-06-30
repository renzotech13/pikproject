import { cn } from '@/lib/cn'
import Spinner from './Spinner'

// Variantes visuales
const VARIANTS = {
  primary:   'bg-primary text-white shadow-sm hover:bg-primary-700 active:bg-primary-900',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
  outline:   'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  ghost:     'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger:    'bg-danger text-white shadow-sm hover:bg-red-700 active:bg-red-800',
  success:   'bg-success text-white shadow-sm hover:bg-green-700 active:bg-green-800',
}

// Tamaños (alto fijo + padding horizontal + gap entre icono y texto)
const SIZES = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-[15px] rounded-xl gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  as: Tag = 'button',
  type = 'button',
  onClick,
  children,
  className,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      onClick={onClick}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      className={cn(
        // Base
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Press scale (mobile-friendly)
        'active:scale-[0.97]',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children && <span>{children}</span>}
      {!loading && rightIcon}
    </Tag>
  )
}
